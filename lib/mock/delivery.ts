// Review links, downloads and the activity log — the prototype's
// `vastunord.delivery.v1` record. Read by the Shared screen (E-S), written by
// Share & export in the editor and by the client review page.

export type ShareItem = { fileId: string; versionId: string };

export type ShareSettings = {
  access: "link" | "invite";
  invitees: string[];
  review: boolean;
  showOriginal: boolean;
  allowDownload: boolean;
  expiry: "7d" | "30d" | "never";
};

export type ReviewStatus = "waiting" | "changes" | "approved";

export type Share = {
  id: string;
  token: string;
  previousTokens: string[];
  userId: string;
  projectId?: string;
  title: string;
  message: string;
  items: ShareItem[];
  /** "set": several files shown together; "options": versions to choose between. */
  kind?: "options" | "set";
  settings: ShareSettings;
  createdAt: number;
  /** null: the link never expires. */
  expiresAt: number | null;
  views: number;
  lastViewedAt: number;
  review:
    | { status: "waiting" }
    | { status: "changes" | "approved"; chosen: number; reviewer: string; note: string; decidedAt: number };
  comments: ShareComment[];
  /** Set when the owner turned the link off. */
  revokedAt?: number;
  /** Final files sent to the same link after approval (E-S3). */
  handoff?: { at: number; deliveryIds: string[] };
};

export type ShareComment = { id: string; author: string; from: "client" | "owner"; text: string; item?: number; at: number };

export type ExportKind = "jpg" | "png" | "pdf" | "highres";
export type Compression = "smaller" | "balanced" | "best";
export type Layout = "result" | "before-after";

export type Delivery = {
  id: string;
  userId: string;
  fileId: string;
  projectId?: string;
  versionId: string;
  resultId: string;
  type: ExportKind | "social";
  size: "HD" | "4K" | "8K";
  format: "JPG" | "PNG" | "PDF";
  filename: string;
  compression?: Compression;
  layout: Layout;
  /** Social format id, for type "social". */
  social?: string;
  /** The review link this file was handed off to. */
  shareId?: string;
  watermarked: boolean;
  credits: number;
  status: "delivered" | "failed";
  bytes: number;
  createdAt: number;
  completedAt?: number;
  events: { at: number; note: string }[];
};

export type ActivityEntry = {
  id: string;
  at: number;
  /** "user-mira" for the signed-in user, otherwise the reviewer's name. */
  userId: string;
  projectId?: string;
  fileId: string;
  versionId: string;
  shareId?: string;
  deliveryId?: string;
  action:
    | "export"
    | "social"
    | "review"
    | "comment"
    | "handoff"
    | "share-created"
    | "share-updated"
    | "share-revoked"
    | "share-renewed";
  exportType?: string;
  shareSettings?: string;
  status: "ok" | "failed";
  recovery?: string;
  detail: string;
};

export const mockShares: Share[] = [
  {
    id: "sh-kitchen",
    token: "k7tchn4nna",
    previousTokens: [],
    userId: "user-mira",
    projectId: "pr-sodermalm",
    title: "Kitchen — two directions",
    message: "Anna, here are the two kitchens we talked about. Pick the one that feels right, or tell me what to change.",
    items: [
      { fileId: "ws-kitchen-north", versionId: "seed-ws-kitchen-north-v2" },
      { fileId: "ws-kitchen-north", versionId: "seed-ws-kitchen-north-v4" },
    ],
    settings: { access: "link", invitees: [], review: true, showOriginal: true, allowDownload: true, expiry: "30d" },
    createdAt: 1793439763595,
    expiresAt: 1796031763595,
    views: 4,
    lastViewedAt: 1793680963595,
    review: {
      status: "changes",
      chosen: 1,
      reviewer: "Anna Berg",
      note: "Option B, but can the pendant be smaller and the worktop a shade lighter?",
      decidedAt: 1793680963595,
    },
    comments: [
      { id: "c1", author: "Anna Berg", from: "client", text: "Love the warm light here.", item: 0, at: 1793605363595 },
      { id: "c2", author: "Anna Berg", from: "client", text: "This is closer. The pendant feels a bit big over the island.", item: 1, at: 1793680963595 },
    ],
  },
  {
    id: "sh-living",
    token: "l1v1ngjohn",
    previousTokens: [],
    userId: "user-mira",
    projectId: "pr-sodermalm",
    title: "Living room — Scandinavian or Japandi",
    message: "",
    items: [
      { fileId: "ws-living-scandi", versionId: "seed-ws-living-scandi-v1" },
      { fileId: "ws-living-scandi", versionId: "seed-ws-living-scandi-v2" },
    ],
    settings: { access: "link", invitees: [], review: true, showOriginal: true, allowDownload: false, expiry: "7d" },
    createdAt: 1793526163595,
    expiresAt: 1794130963595,
    views: 2,
    lastViewedAt: 1793688163595,
    review: { status: "approved", chosen: 0, reviewer: "Johan Ek", note: "Scandinavian. Go ahead.", decidedAt: 1793688163595 },
    comments: [],
  },
  {
    id: "sh-facade",
    token: "f4c4d3old1",
    previousTokens: [],
    userId: "user-mira",
    title: "Facade study — cladding",
    message: "First pass at the timber cladding.",
    items: [{ fileId: "ws-facade-study", versionId: "seed-ws-facade-study-v2" }],
    settings: { access: "link", invitees: [], review: true, showOriginal: true, allowDownload: false, expiry: "30d" },
    createdAt: 1790242963595,
    expiresAt: 1792834963595,
    views: 1,
    lastViewedAt: 1790415763595,
    review: { status: "waiting" },
    comments: [],
  },
];

export const mockDeliveries: Delivery[] = [
  {
    id: "dl-seed-2",
    userId: "user-mira",
    fileId: "ws-facade-study",
    versionId: "seed-ws-facade-study-v2",
    resultId: "seed-ws-facade-study-r2",
    type: "png",
    size: "HD",
    format: "PNG",
    filename: "facade-study-v2-hd.png",
    layout: "before-after",
    watermarked: false,
    credits: 0,
    status: "delivered",
    bytes: 4409856,
    createdAt: 1793697163595,
    completedAt: 1793697223595,
    events: [
      { at: 1793697163595, note: "Generation failed on the first attempt" },
      { at: 1793697223595, note: "Retried — delivered" },
    ],
  },
  {
    id: "dl-seed-1",
    userId: "user-mira",
    fileId: "ws-kitchen-north",
    projectId: "pr-sodermalm",
    versionId: "seed-ws-kitchen-north-v2",
    resultId: "seed-ws-kitchen-north-r2",
    type: "jpg",
    size: "4K",
    format: "JPG",
    filename: "kitchen-north-light-v2-4k.jpg",
    compression: "balanced",
    layout: "result",
    watermarked: false,
    credits: 0,
    status: "delivered",
    bytes: 2211840,
    createdAt: 1793353363595,
    completedAt: 1793353371595,
    events: [],
  },
];

const settings = (downloads: boolean, days: number) =>
  `Anyone with the link · asks for a decision · before & after · downloads ${downloads ? "on" : "off"} · open for ${days} days`;

export const mockActivity: ActivityEntry[] = [
  {
    id: "act-dl-seed-2",
    at: 1793697163595,
    userId: "user-mira",
    fileId: "ws-facade-study",
    versionId: "seed-ws-facade-study-v2",
    deliveryId: "dl-seed-2",
    action: "export",
    exportType: "PNG · HD",
    status: "ok",
    recovery: "Generation failed on the first attempt → Retried — delivered",
    detail: "Downloaded facade-study-v2-hd.png",
  },
  {
    id: "act-sh-living-review",
    at: 1793688163595,
    userId: "Johan Ek",
    projectId: "pr-sodermalm",
    fileId: "ws-living-scandi",
    versionId: "seed-ws-living-scandi-v1",
    shareId: "sh-living",
    action: "review",
    status: "ok",
    detail: "Johan Ek approved option A",
  },
  {
    id: "act-sh-kitchen-review",
    at: 1793680963595,
    userId: "Anna Berg",
    projectId: "pr-sodermalm",
    fileId: "ws-kitchen-north",
    versionId: "seed-ws-kitchen-north-v4",
    shareId: "sh-kitchen",
    action: "review",
    status: "ok",
    detail: "Anna Berg asked for changes to option B",
  },
  {
    id: "act-sh-living-created",
    at: 1793526163595,
    userId: "user-mira",
    projectId: "pr-sodermalm",
    fileId: "ws-living-scandi",
    versionId: "seed-ws-living-scandi-v1",
    shareId: "sh-living",
    action: "share-created",
    shareSettings: settings(false, 7),
    status: "ok",
    detail: "Created review link “Living room — Scandinavian or Japandi” with 2 options",
  },
  {
    id: "act-sh-kitchen-created",
    at: 1793439763595,
    userId: "user-mira",
    projectId: "pr-sodermalm",
    fileId: "ws-kitchen-north",
    versionId: "seed-ws-kitchen-north-v2",
    shareId: "sh-kitchen",
    action: "share-created",
    shareSettings: settings(true, 30),
    status: "ok",
    detail: "Created review link “Kitchen — two directions” with 2 options",
  },
  {
    id: "act-dl-seed-1",
    at: 1793353363595,
    userId: "user-mira",
    projectId: "pr-sodermalm",
    fileId: "ws-kitchen-north",
    versionId: "seed-ws-kitchen-north-v2",
    deliveryId: "dl-seed-1",
    action: "export",
    exportType: "JPG · 4K",
    status: "ok",
    detail: "Downloaded kitchen-north-light-v2-4k.jpg",
  },
  {
    id: "act-sh-facade-created",
    at: 1790242963595,
    userId: "user-mira",
    fileId: "ws-facade-study",
    versionId: "seed-ws-facade-study-v2",
    shareId: "sh-facade",
    action: "share-created",
    shareSettings: settings(false, 30),
    status: "ok",
    detail: "Created review link “Facade study — cladding” with 1 option",
  },
];

// ---------------------------------------------------------------------------
// Export and link helpers (the prototype's delivery module). Pure, so the
// editor, the Shared screens and the review page all agree.
// ---------------------------------------------------------------------------

const DAY = 86_400_000;

/** Long edge in pixels for each export size. */
export const exportSizes = { HD: 1920, "4K": 3840, "8K": 7680 } as const;
export const compressionQuality: Record<Compression, number> = { smaller: 0.72, balanced: 0.86, best: 0.95 };
export const compressionOptions: { id: Compression; label: string }[] = [
  { id: "smaller", label: "Smaller file" },
  { id: "balanced", label: "Balanced" },
  { id: "best", label: "Best quality" },
];

export const socialFormats = [
  { id: "portrait", label: "Portrait 4:5", where: "Instagram and Facebook feed", w: 4, h: 5 },
  { id: "square", label: "Square 1:1", where: "Any feed", w: 1, h: 1 },
  { id: "story", label: "Story 9:16", where: "Stories and Reels", w: 9, h: 16 },
  { id: "pin", label: "Pin 2:3", where: "Pinterest", w: 2, h: 3 },
  { id: "wide", label: "Wide 1.91:1", where: "LinkedIn and X", w: 1.91, h: 1 },
];
export const socialFormat = (id: string) => socialFormats.find((f) => f.id === id) ?? socialFormats[0];

export const defaultShareSettings = (): ShareSettings => ({
  access: "link",
  invitees: [],
  review: true,
  showOriginal: true,
  allowDownload: false,
  expiry: "30d",
});
export const expiryOptions: { id: ShareSettings["expiry"]; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "never", label: "No expiry" },
];
export const expiresAtFor = (expiry: ShareSettings["expiry"], from: number) =>
  expiry === "never" ? null : from + (expiry === "7d" ? 7 : 30) * DAY;
/** An invite-only link needs at least one email. */
export const settingsValid = (s: ShareSettings) => s.access === "link" || s.invitees.length > 0;

/** "A", "B"… for the options on a link. */
export const optionLetter = (index: number) => String.fromCharCode(65 + index);

/** The address a client opens. */
export const reviewPath = (token: string) => `/review/${token}`;
export const reviewUrl = (token: string) => `${typeof window === "undefined" ? "" : window.location.origin}${reviewPath(token)}`;

export function slugify(text: string) {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "vastunord"
  );
}

/** "kitchen-north-light-v2-4k" (+ a suffix such as "-before-after"). */
export const fileNameFor = (file: string, version: number, size: string, suffix = "") =>
  `${slugify(file)}-v${version}-${size.toLowerCase()}${suffix}`;

/** Fills an export naming pattern from Settings: {file}, {version}, {size}, {date}. */
export const applyNaming = (pattern: string, v: { file: string; version: number; size: string }) =>
  pattern
    .replace(/\{file\}/g, slugify(v.file))
    .replace(/\{version\}/g, String(v.version))
    .replace(/\{size\}/g, v.size.toLowerCase())
    .replace(/\{date\}/g, new Date().toISOString().slice(0, 10))
    .replace(/\s+/g, "-");

/** Why a file name would be refused, or undefined when it is fine. */
export function checkFileName(name: string) {
  const t = name.trim();
  if (!t) return "Give the file a name.";
  if (t.length > 80) return "Keep it under 80 characters.";
  if (/[\\/:*?"<>|]/.test(t)) return "Remove \\ / : * ? \" < > | — computers refuse those in file names.";
}

/** A rough file size, shown before the export runs. */
export function estimateBytes(
  kind: ExportKind,
  size: keyof typeof exportSizes,
  compression: Compression = "balanced",
  layout: Layout = "result"
) {
  const edge = exportSizes[size];
  const raw = edge * edge * 0.75 * (layout === "before-after" ? 1.1 : 1);
  if (kind === "png" || kind === "highres") return Math.round(raw * 1.45);
  if (kind === "pdf") return Math.round(raw * 0.22);
  return Math.round(raw * { smaller: 0.11, balanced: 0.2, best: 0.34 }[compression]);
}

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;

/** "JPG · 4K", "PDF · one page · HD"… */
export const exportTypeLabel = (d: Pick<Delivery, "type" | "size" | "format" | "social">) =>
  d.type === "pdf"
    ? `PDF · one page · ${d.size}`
    : d.type === "social"
      ? `Social · ${socialFormat(d.social ?? "").label}`
      : d.type === "highres"
        ? `High resolution · ${d.size} ${d.format}`
        : `${d.format} · ${d.size}`;

export function settingsSummary(s: ShareSettings) {
  return [
    s.access === "link" ? "Anyone with the link" : `Invited only (${s.invitees.length})`,
    s.review ? "asks for a decision" : "view only",
    s.showOriginal ? "before & after" : "results only",
    s.allowDownload ? "downloads on" : "downloads off",
    s.expiry === "never" ? "no expiry" : `open for ${s.expiry === "7d" ? "7" : "30"} days`,
  ].join(" · ");
}

/** A suggested post caption, by tool category. */
export function captionFor(fileName: string, layout: Layout, category: string | undefined, credit: boolean) {
  const subject = fileName.split(/[—–-]/)[0].trim().toLowerCase();
  const tags =
    category === "exterior"
      ? "#gardendesign #exteriordesign #beforeandafter"
      : category === "staging"
        ? "#virtualstaging #realestate #homestaging"
        : category === "enhancement"
          ? "#realestatephotography #beforeandafter"
          : "#interiordesign #homerenovation #beforeandafter";
  return `${layout === "before-after" ? `Before and after: ${subject}.` : `A new direction for the ${subject}.`}${credit ? " Visualised with VastuNord." : ""}\n\n${tags}`;
}

export type LinkState = "active" | "expired" | "revoked" | "replaced" | "missing";

/** Whether a link opens. `token` is the one the visitor used (an old token means the link was replaced). */
export function linkState(share: Share | undefined, now: number, token?: string): LinkState {
  if (!share) return "missing";
  if (token && token !== share.token && share.previousTokens.includes(token)) return "replaced";
  if (share.revokedAt) return "revoked";
  if (share.expiresAt !== null && share.expiresAt < now) return "expired";
  return "active";
}

export type ShareStatus = "waiting" | "viewed" | "approved" | "changes" | "expired" | "revoked" | "handed-off";

export const shareStatusLabels: Record<ShareStatus, string> = {
  waiting: "Not opened yet",
  viewed: "Waiting for a decision",
  approved: "Approved",
  changes: "Changes requested",
  expired: "Expired",
  revoked: "Turned off",
  "handed-off": "Handed off",
};

/** Where a link stands, for badges. A decision outranks the link's own state. */
export function shareStatus(share: Share, now: number): ShareStatus {
  if (share.handoff) return "handed-off";
  if (share.review.status !== "waiting") return share.review.status;
  const state = linkState(share, now);
  if (state === "revoked" || state === "replaced") return "revoked";
  if (state === "expired") return "expired";
  return share.views > 0 ? "viewed" : "waiting";
}

/** "Expires in 3 days", "Expired 2 days ago"… */
export function expiryLabel(share: Share, now: number) {
  if (share.expiresAt === null) return "No expiry";
  const days = Math.round((share.expiresAt - now) / DAY);
  if (share.expiresAt < now)
    return days === 0 ? "Expired today" : `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} ago`;
  return days <= 0 ? "Expires today" : `Expires in ${days} ${days === 1 ? "day" : "days"}`;
}
