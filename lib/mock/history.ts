// Each file's generation → result → version history: the seed from
// entities.ts plus changes made in this tab (make a version current,
// favourite a result). Kept in localStorage like the delivery record, so a
// review link opened in a new tab can still show a version made here.

import { useSyncExternalStore } from "react";
import { MOCK_NOW, mockFiles, mockGenerations, mockResults, mockVersions, type Generation, type Result, type Version } from "@/lib/mock/entities";

type HistoryState = {
  versions: Version[];
  favourites: Set<string>;
  /** fileId → current version id. */
  current: Record<string, string | undefined>;
};

const seed: HistoryState = {
  versions: mockVersions,
  favourites: new Set(mockResults.filter((r) => r.favourite).map((r) => r.id)),
  current: Object.fromEntries(mockFiles.map((f) => [f.id, f.currentVersionId])),
};
let state = seed;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const HISTORY_KEY = "vastunord.history.v1";

function readHistory(raw: string | null): Partial<HistoryState> {
  if (!raw) return {};
  try {
    const d = JSON.parse(raw) as { versions?: Version[]; favourites?: string[]; current?: HistoryState["current"] };
    return {
      ...(Array.isArray(d.versions) && { versions: d.versions }),
      ...(Array.isArray(d.favourites) && { favourites: new Set(d.favourites) }),
      ...(d.current && { current: d.current }),
    };
  } catch {
    return {};
  }
}

if (typeof window !== "undefined") {
  try {
    state = { ...state, ...readHistory(window.localStorage.getItem(HISTORY_KEY)) };
  } catch {}
  window.addEventListener("storage", (e) => {
    if (e.key !== HISTORY_KEY) return;
    state = { ...state, ...readHistory(e.newValue) };
    listeners.forEach((l) => l());
  });
}

const commit = (next: Partial<HistoryState>) => {
  state = { ...state, ...next };
  try {
    const { versions, favourites, current } = state;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify({ versions, favourites: [...favourites], current }));
  } catch {}
  listeners.forEach((l) => l());
};

const loadedAt = Date.now();
const now = () => MOCK_NOW + (Date.now() - loadedAt);

const resultFor = (s: HistoryState, id: string): Result | undefined => {
  const r = mockResults.find((x) => x.id === id);
  return r && { ...r, favourite: s.favourites.has(r.id) };
};

export function useHistory(fileId: string) {
  const s = useSyncExternalStore(subscribe, () => state, () => seed);
  const versions = s.versions.filter((v) => v.fileId === fileId).sort((a, b) => a.number - b.number);
  const current = versions.find((v) => v.id === s.current[fileId]) ?? versions[versions.length - 1];
  const resultById = (id: string) => resultFor(s, id);
  const generationById = (id: string): Generation | undefined => mockGenerations.find((g) => g.id === id);
  const generations = mockGenerations.filter((g) => g.fileId === fileId);
  return { versions, current, resultById, generationById, generations };
}

/** Looks up any file's version and its image, across all files (for review links and downloads). */
export function useVersionLookup() {
  const s = useSyncExternalStore(subscribe, () => state, () => seed);
  return (versionId: string) => {
    const version = s.versions.find((v) => v.id === versionId);
    const result = version ? resultFor(s, version.resultId) : undefined;
    return version && { version, image: result?.image ?? "" };
  };
}

export function toggleFavourite(resultId: string) {
  const favourites = new Set(state.favourites);
  if (favourites.has(resultId)) favourites.delete(resultId);
  else favourites.add(resultId);
  commit({ favourites });
}

/** "Make current": a new version that repeats an earlier one's result. Returns the new version. */
export function restoreVersion(fileId: string, versionId: string) {
  const versions = state.versions.filter((v) => v.fileId === fileId);
  const from = versions.find((v) => v.id === versionId);
  if (!from) return;
  const number = Math.max(0, ...versions.map((v) => v.number)) + 1;
  const restored: Version = {
    id: `${fileId}-v${number}-${Math.random().toString(36).slice(2, 6)}`,
    fileId,
    number,
    kind: "restored",
    resultId: from.resultId,
    restoredFromId: from.id,
    createdAt: now(),
  };
  commit({ versions: [...state.versions, restored], current: { ...state.current, [fileId]: restored.id } });
  return restored;
}
