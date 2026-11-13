// In-memory Studio store: the seed from entities.ts plus every edit made in
// this tab (rename, move, archive…). It resets on reload, like the backend it
// stands in for will not. Edits only ever happen in event handlers, so the
// server render always sees the seed.

import { useSyncExternalStore } from "react";
import {
  MOCK_NOW,
  mockFiles,
  mockProjects,
  projectLabels,
  type Project,
  type ProjectLabel,
  type StudioFile,
} from "@/lib/mock/entities";
import {
  expiresAtFor,
  mockActivity,
  mockDeliveries,
  mockShares,
  optionLetter,
  settingsSummary,
  exportTypeLabel,
  type ActivityEntry,
  type Delivery,
  type Share,
  type ShareComment,
  type ShareItem,
  type ShareSettings,
} from "@/lib/mock/delivery";
import type { ToolId } from "@/lib/mock/tools";

type StudioState = {
  files: StudioFile[];
  projects: Project[];
  shares: Share[];
  activity: ActivityEntry[];
  deliveries: Delivery[];
};

const seed: StudioState = {
  files: mockFiles,
  projects: mockProjects,
  shares: mockShares,
  activity: mockActivity,
  deliveries: mockDeliveries,
};
let state = seed;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Review links, downloads and activity are kept in localStorage (the
// prototype's `vastunord.delivery.v1`), so a link opened in a new tab — the
// client's view — finds the share, and a decision made there shows up here.
const DELIVERY_KEY = "vastunord.delivery.v1";
type DeliveryPart = Pick<StudioState, "shares" | "activity" | "deliveries">;

function readDelivery(raw: string | null): Partial<DeliveryPart> {
  if (!raw) return {};
  try {
    const d = JSON.parse(raw) as Partial<DeliveryPart>;
    return {
      ...(Array.isArray(d.shares) && { shares: d.shares }),
      ...(Array.isArray(d.activity) && { activity: d.activity }),
      ...(Array.isArray(d.deliveries) && { deliveries: d.deliveries }),
    };
  } catch {
    return {};
  }
}

if (typeof window !== "undefined") {
  try {
    state = { ...state, ...readDelivery(window.localStorage.getItem(DELIVERY_KEY)) };
  } catch {}
  window.addEventListener("storage", (e) => {
    if (e.key !== DELIVERY_KEY) return;
    state = { ...state, ...readDelivery(e.newValue) };
    listeners.forEach((l) => l());
  });
}

function commit(next: Partial<StudioState>) {
  state = { ...state, ...next };
  if (next.shares || next.activity || next.deliveries) {
    try {
      const { shares, activity, deliveries } = state;
      window.localStorage.setItem(DELIVERY_KEY, JSON.stringify({ shares, activity, deliveries }));
    } catch {}
  }
  listeners.forEach((l) => l());
}

/** The current snapshot. Components that render it should also call useStudio() so they re-render on edits. */
export const getStudio = () => state;

export function useStudio() {
  return useSyncExternalStore(subscribe, getStudio, () => seed);
}

const noSubscribe = () => () => {};
/** False on the server and during hydration: screens that look up saved links wait for it, so they never flash "not found". */
export const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

// Timestamps for edits stay in the seed's frame, so "Just now" sits after everything seeded.
const loadedAt = Date.now();
const now = () => MOCK_NOW + (Date.now() - loadedAt);
/** "Now" in the seed's time frame, for expiry checks and new timestamps. */
export const studioNow = now;
const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

const isLive = (f: StudioFile) => f.status === "active" || f.status === "draft";

export const fileById = (id: string) => state.files.find((f) => f.id === id);
export const projectById = (id?: string) => state.projects.find((p) => p.id === id);

/** "Continue working": files with an interrupted session first, then most recently edited. */
export const continueWorkingFiles = () =>
  state.files
    .filter(isLive)
    .sort((a, b) => Number(!!b.recovery) - Number(!!a.recovery) || b.lastEditedAt - a.lastEditedAt);

export const archivedOrDeletedFileCount = () => state.files.filter((f) => !isLive(f)).length;

export const projectFileCount = (projectId: string) =>
  state.files.filter((f) => f.projectId === projectId && isLive(f)).length;

export const activeProjects = () =>
  state.projects.filter((p) => p.status === "active").sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);

// ---------------------------------------------------------------------------
// File actions
// ---------------------------------------------------------------------------

const updateFile = (id: string, patch: Partial<StudioFile>) =>
  commit({ files: state.files.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

const touchProject = (id?: string) =>
  id &&
  commit({
    projects: state.projects.map((p) => (p.id === id ? { ...p, lastUpdated: "Just now", lastUpdatedAt: now() } : p)),
  });

export const renameFile = (id: string, name: string) => updateFile(id, { name });

/**
 * C-01 Create file: a draft for `toolId`, optionally inside a project. Until a
 * photo is added its card shows the tool's cover. Returns the new id.
 */
export function createFile(input: { toolId: ToolId; name: string; cover: string; projectId?: string }) {
  const file: StudioFile = {
    id: newId("file"),
    name: input.name,
    toolId: input.toolId,
    ownerId: "user-mira",
    status: "draft",
    sessionState: "recent",
    lastEdited: "Just now",
    lastEditedAt: now(),
    createdAt: "Just now",
    preview: input.cover,
    sourceImage: "",
    projectId: input.projectId,
    tags: [],
    version: 0,
    totalVersions: 0,
    totalGenerations: 0,
    aiCreditsUsed: 0,
    storageUsed: 0,
  };
  commit({ files: [file, ...state.files] });
  touchProject(file.projectId);
  return file.id;
}

/** C-02.06 "Restore recovered state": the unsaved session becomes the file's state. */
export function applyRecovery(id: string) {
  const file = fileById(id);
  if (!file?.recovery) return;
  const r = file.recovery;
  updateFile(id, { sourceImage: r.sourceImage || file.sourceImage, params: { ...file.params, ...r.params }, recovery: undefined });
}

/** The editor's photo in use becomes the file's thumbnail and source. */
export const setFileSource = (id: string, sourceImage: string) =>
  updateFile(id, { sourceImage, preview: sourceImage, lastEdited: "Just now", lastEditedAt: now() });

/**
 * Copies the file as "<name> Copy" and returns the copy's id. `into` overrides
 * the copy's name and project (Duplicate project copies files under their own name).
 */
export function duplicateFile(id: string, into?: { name: string; projectId: string | undefined }) {
  const file = fileById(id);
  if (!file) return;
  const copy: StudioFile = {
    ...file,
    ...into,
    id: newId("file"),
    name: into?.name ?? `${file.name} Copy`,
    status: "active",
    sessionState: "recent",
    lastEdited: "Just now",
    lastEditedAt: now(),
    createdAt: "Just now",
    recovery: undefined,
  };
  commit({ files: [copy, ...state.files] });
  touchProject(copy.projectId);
  return copy.id;
}

export function setFileProject(id: string, projectId: string | undefined) {
  const before = fileById(id)?.projectId;
  updateFile(id, { projectId });
  touchProject(before);
  touchProject(projectId);
}

export const archiveFile = (id: string) => updateFile(id, { status: "archived" });

export const deleteFile = (id: string) =>
  updateFile(id, { status: "deleted", deletedAt: "Just now", retentionDaysLeft: 30 });

export const restoreFile = (id: string) =>
  updateFile(id, { status: "active", deletedAt: undefined, retentionDaysLeft: undefined });

export const purgeFile = (id: string) => commit({ files: state.files.filter((f) => f.id !== id) });

/** Puts files back exactly as they were snapshotted (undoes Delete project's file handling). */
export function restoreFileSnapshots(snapshot: StudioFile[]) {
  const byId = new Map(snapshot.map((f) => [f.id, f]));
  commit({ files: state.files.map((f) => byId.get(f.id) ?? f) });
}

// ---------------------------------------------------------------------------
// Project actions
// ---------------------------------------------------------------------------

const updateProject = (id: string, patch: Partial<Project>) =>
  commit({ projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

export const findActiveProjectByName = (name: string) =>
  state.projects.find((p) => p.status === "active" && p.name.toLowerCase() === name.trim().toLowerCase());

export function createProject(input: { name: string; description?: string; labelIds: string[]; tags: string[] }) {
  const at = now();
  const project: Project = {
    id: newId("pr"),
    ownerId: "user-mira",
    name: input.name,
    description: input.description || undefined,
    labels: input.labelIds
      .map((id) => projectLabels.find((l) => l.id === id))
      .filter((l): l is ProjectLabel => !!l),
    tags: input.tags,
    status: "active",
    pinned: false,
    lastUpdated: "Just now",
    lastUpdatedAt: at,
    createdAt: "Just now",
    createdAtMs: at,
    cover: "",
  };
  commit({ projects: [project, ...state.projects] });
  return project;
}

export const setProjectPinned = (id: string, pinned: boolean) => updateProject(id, { pinned });
export const archiveProject = (id: string) => updateProject(id, { status: "archived", pinned: false });
export const restoreProject = (id: string) =>
  updateProject(id, { status: "active", deletedAt: undefined, retentionDaysLeft: undefined });
/** Removes the project for good; its files stay, now independent. */
export const purgeProject = (id: string) =>
  commit({
    projects: state.projects.filter((p) => p.id !== id),
    files: state.files.map((f) => (f.projectId === id ? { ...f, projectId: undefined } : f)),
  });

/** C-07 Manage project: name, description, labels and tags. */
export const updateProjectDetails = (
  id: string,
  patch: Partial<Pick<Project, "name" | "description" | "labels" | "tags">>
) => updateProject(id, { ...patch, lastUpdated: "Just now", lastUpdatedAt: now() });

/** C-09 Duplicate project: a new active project with the same details and no files. */
export function duplicateProject(id: string, name: string) {
  const source = projectById(id);
  if (!source) return;
  const at = now();
  const project: Project = {
    ...source,
    id: newId("pr"),
    name,
    status: "active",
    pinned: false,
    lastUpdated: "Just now",
    lastUpdatedAt: at,
    createdAt: "Just now",
    createdAtMs: at,
    deletedAt: undefined,
    retentionDaysLeft: undefined,
  };
  commit({ projects: [project, ...state.projects] });
  return project;
}

/** C-10 Delete project: moves it to Recently deleted for 30 days. Its files are handled first. */
export const deleteProject = (id: string) =>
  updateProject(id, { status: "deleted", pinned: false, deletedAt: "Just now", retentionDaysLeft: 30 });

// ---------------------------------------------------------------------------
// Review links
// ---------------------------------------------------------------------------

const shareToken = () =>
  Array.from({ length: 10 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

export const shareById = (id: string) => state.shares.find((s) => s.id === id);
/** The share a token opens: its current token or one it replaced. */
export const shareByToken = (token: string) =>
  state.shares.find((s) => s.token === token || s.previousTokens.includes(token));

const updateShareRecord = (id: string, fn: (s: Share) => Share) =>
  state.shares.map((s) => (s.id === id ? fn(s) : s));

function log(entry: Omit<ActivityEntry, "id" | "at" | "userId" | "fileId" | "versionId"> & Partial<ActivityEntry>): ActivityEntry {
  return { id: newId("act"), at: now(), userId: "user-mira", fileId: "", versionId: "", ...entry };
}

/** A new review link (Share for review, Share & export); it shows up in Shared with a "created" entry in Activity. */
export function createShare(input: {
  title: string;
  message: string;
  items: ShareItem[];
  settings: ShareSettings;
  projectId?: string;
  kind: Share["kind"];
}) {
  const at = now();
  const share: Share = {
    ...input,
    id: newId("sh"),
    token: shareToken(),
    previousTokens: [],
    userId: "user-mira",
    createdAt: at,
    expiresAt: expiresAtFor(input.settings.expiry, at),
    views: 0,
    lastViewedAt: 0,
    review: { status: "waiting" },
    comments: [],
  };
  const n = input.items.length;
  const entry = log({
    projectId: input.projectId,
    fileId: input.items[0]?.fileId ?? "",
    versionId: input.items[0]?.versionId ?? "",
    shareId: share.id,
    action: "share-created",
    shareSettings: settingsSummary(input.settings),
    status: "ok",
    detail: `Created review link “${input.title}” with ${n} ${n === 1 ? "option" : "options"}`,
  });
  commit({ shares: [share, ...state.shares], activity: [entry, ...state.activity] });
  return share;
}

/** Link settings changed in place; the address stays the same. */
export function updateShareSettings(id: string, settings: ShareSettings) {
  const share = shareById(id);
  if (!share) return;
  const expiresAt = settings.expiry !== share.settings.expiry ? expiresAtFor(settings.expiry, now()) : share.expiresAt;
  const entry = log({
    projectId: share.projectId,
    shareId: id,
    action: "share-updated",
    shareSettings: settingsSummary(settings),
    status: "ok",
    detail: `Changed the settings of “${share.title}”`,
  });
  commit({ shares: updateShareRecord(id, (s) => ({ ...s, settings, expiresAt })), activity: [entry, ...state.activity] });
}

/** "Turn off": the link shows a note instead of the work. */
export function revokeShare(id: string) {
  const share = shareById(id);
  if (!share) return;
  const entry = log({ projectId: share.projectId, shareId: id, action: "share-revoked", status: "ok", detail: `Turned off “${share.title}”` });
  commit({ shares: updateShareRecord(id, (s) => ({ ...s, revokedAt: now() })), activity: [entry, ...state.activity] });
}

/** "Generate new link": a fresh token; the old one shows that it was replaced. Comments and the decision carry over. */
export function renewShare(id: string) {
  const share = shareById(id);
  if (!share) return;
  const at = now();
  const renewed: Share = {
    ...share,
    token: shareToken(),
    previousTokens: [...share.previousTokens, share.token],
    revokedAt: undefined,
    createdAt: at,
    expiresAt: expiresAtFor(share.settings.expiry, at),
  };
  const entry = log({
    projectId: share.projectId,
    shareId: id,
    action: "share-renewed",
    status: "ok",
    recovery: "Generate new link",
    detail: `New link for “${share.title}”. The old link no longer opens.`,
  });
  commit({ shares: updateShareRecord(id, () => renewed), activity: [entry, ...state.activity] });
  return renewed;
}

/** The client opened the link. */
export const recordShareView = (id: string) =>
  commit({ shares: updateShareRecord(id, (s) => ({ ...s, views: s.views + 1, lastViewedAt: now() })) });

/** The client's decision on the link: approve an option, or ask for changes to it. */
export function submitReview(id: string, input: { reviewer: string; status: "approved" | "changes"; chosen: number; note: string }) {
  const share = shareById(id);
  if (!share) return;
  const item = share.items[input.chosen] ?? share.items[0];
  const which = share.items.length > 1 ? `option ${optionLetter(input.chosen)}` : "the image";
  const entry = log({
    userId: input.reviewer,
    projectId: share.projectId,
    fileId: item?.fileId ?? "",
    versionId: item?.versionId ?? "",
    shareId: id,
    action: "review",
    status: "ok",
    detail: `${input.reviewer} ${input.status === "approved" ? "approved" : "asked for changes to"} ${which}`,
  });
  commit({
    shares: updateShareRecord(id, (s) => ({ ...s, review: { ...input, decidedAt: now() } })),
    activity: [entry, ...state.activity],
  });
}

/** A comment on the link, from the client or the owner's reply. */
export function addShareComment(id: string, comment: Omit<ShareComment, "id" | "at">) {
  const share = shareById(id);
  if (!share) return;
  const on = comment.item !== undefined && share.items.length > 1 ? ` on option ${optionLetter(comment.item)}` : "";
  const entry = log({
    userId: comment.from === "owner" ? "user-mira" : comment.author,
    projectId: share.projectId,
    fileId: share.items[comment.item ?? 0]?.fileId ?? "",
    versionId: share.items[comment.item ?? 0]?.versionId ?? "",
    shareId: id,
    action: "comment",
    status: "ok",
    detail: `${comment.author} commented${on}`,
  });
  commit({
    shares: updateShareRecord(id, (s) => ({ ...s, comments: [...s.comments, { ...comment, id: newId("cm"), at: now() }] })),
    activity: [entry, ...state.activity],
  });
}

/** E-S3: final files put on the approved link. */
export function handOffShare(id: string, deliveryIds: string[]) {
  const share = shareById(id);
  if (!share) return;
  const entry = log({
    projectId: share.projectId,
    shareId: id,
    action: "handoff",
    status: "ok",
    detail: `Handed off the final files for “${share.title}”`,
  });
  commit({ shares: updateShareRecord(id, (s) => ({ ...s, handoff: { at: now(), deliveryIds } })), activity: [entry, ...state.activity] });
}

// ---------------------------------------------------------------------------
// Downloads
// ---------------------------------------------------------------------------

/** A finished export: listed in Shared → Downloads, with an entry in Activity. */
export function recordDelivery(input: Omit<Delivery, "id" | "userId" | "createdAt">) {
  const delivery: Delivery = { ...input, id: newId("dl"), userId: "user-mira", createdAt: now() };
  const entry = log({
    projectId: delivery.projectId,
    fileId: delivery.fileId,
    versionId: delivery.versionId,
    deliveryId: delivery.id,
    shareId: delivery.shareId,
    action: delivery.type === "social" ? "social" : "export",
    exportType: exportTypeLabel(delivery),
    status: delivery.status === "failed" ? "failed" : "ok",
    recovery: delivery.events.length ? delivery.events.map((e) => e.note).join(" → ") : undefined,
    detail: delivery.type === "social" ? `Prepared ${delivery.filename} for social` : `Downloaded ${delivery.filename}`,
  });
  commit({ deliveries: [delivery, ...state.deliveries], activity: [entry, ...state.activity] });
  return delivery;
}
