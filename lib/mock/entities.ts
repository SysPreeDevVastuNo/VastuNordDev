// Studio entities — files, projects and their version history. Shape and seed
// values mirror the prototype's `vastunord.entities.v2` localStorage record so
// screens can be built against it before Supabase exists.

import type { ToolId } from "@/lib/mock/tools";

/** Every mock image lives in the prototype's Sanity dataset. */
export const mockImage = (asset: string) => `https://cdn.sanity.io/images/5mo9wf71/production/${asset}`;

/** The moment the seed was captured; relative labels below are measured from it. */
export const MOCK_NOW = 1793698963549;
const DAY = 86_400_000;

export type EntityStatus = "active" | "draft" | "archived" | "deleted";

export type Selection = {
  mode: "select" | "zone";
  marks: { x: number; y: number }[];
  zones: { x: number; y: number; w: number; h: number }[];
};

export type StudioFile = {
  id: string;
  name: string;
  toolId: ToolId;
  ownerId: string;
  status: EntityStatus;
  /** Present on files that show up under "Continue working". */
  sessionState?: "recent";
  lastEdited: string;
  lastEditedAt: number;
  createdAt: string;
  /** Last rendered result; empty until the first generation lands. */
  preview: string;
  sourceImage: string;
  projectId?: string;
  tags: string[];
  version: number;
  totalVersions: number;
  totalGenerations: number;
  aiCreditsUsed: number;
  /** MB. */
  storageUsed: number;
  currentVersionId?: string;
  savedAt?: number;
  params?: { prompt?: string };
  /** Unsaved editor state captured when a session ended mid-edit. */
  recovery?: {
    sourceImage: string;
    referenceImage: string;
    params: { prompt?: string };
    selection: Selection;
    capturedAt: number;
    reason: "session-ended";
  };
  deletedAt?: string;
  retentionDaysLeft?: number;
};

export type ProjectLabel = { id: string; name: string; color: string };

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  labels: ProjectLabel[];
  tags: string[];
  status: Exclude<EntityStatus, "draft">;
  pinned: boolean;
  lastUpdated: string;
  lastUpdatedAt: number;
  createdAt: string;
  createdAtMs: number;
  cover: string;
  deletedAt?: string;
  retentionDaysLeft?: number;
};

export type Generation = {
  id: string;
  fileId: string;
  status: "succeeded" | "failed";
  summary: string;
  cost: number;
  createdAt: number;
};

export type Result = {
  id: string;
  fileId: string;
  generationId: string;
  image: string;
  favourite: boolean;
  createdAt: number;
};

export type Version = {
  id: string;
  fileId: string;
  number: number;
  kind: "generated" | "restored";
  resultId: string;
  restoredFromId?: string;
  createdAt: number;
};

const LABEL_CLIENT: ProjectLabel = { id: "lbl-client", name: "Client work", color: "#013c55" };
const LABEL_PRIORITY: ProjectLabel = { id: "lbl-priority", name: "Priority", color: "#fb602b" };

export const mockProjects: Project[] = [
  {
    id: "pr-sodermalm",
    ownerId: "user-mira",
    name: "Södermalm apartment",
    description: "A full interior pass on the apartment before it goes to market.",
    labels: [LABEL_CLIENT],
    tags: ["Renovation", "Interior"],
    status: "active",
    pinned: true,
    lastUpdated: "2 hours ago",
    lastUpdatedAt: 1793691763549,
    createdAt: "2 months ago",
    createdAtMs: 1788514963549,
    cover: mockImage("f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg"),
  },
  {
    id: "pr-listings",
    ownerId: "user-mira",
    name: "Q3 listings",
    description: "Staging directions for everything going live this quarter.",
    labels: [LABEL_PRIORITY, LABEL_CLIENT],
    tags: ["Staging", "Property"],
    status: "active",
    pinned: false,
    lastUpdated: "Yesterday",
    lastUpdatedAt: 1793605363549,
    createdAt: "3 weeks ago",
    createdAtMs: 1791884563549,
    cover: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg"),
  },
  {
    id: "pr-garden",
    ownerId: "user-mira",
    name: "Garden concepts",
    labels: [],
    tags: ["Exterior"],
    status: "active",
    pinned: false,
    lastUpdated: "Last week",
    lastUpdatedAt: 1793094163549,
    createdAt: "2 months ago",
    createdAtMs: 1788514963549,
    cover: mockImage("77045f942e5fb6f35501791994a9ec2474dea837-1200x675.png"),
  },
  {
    id: "pr-old-office",
    ownerId: "user-mira",
    name: "Old office concepts",
    description: "Superseded by the current fit-out direction.",
    labels: [],
    tags: ["Commercial"],
    status: "archived",
    pinned: false,
    lastUpdated: "2 months ago",
    lastUpdatedAt: 1788514963549,
    createdAt: "6 months ago",
    createdAtMs: 1778146963549,
    cover: mockImage("48bf25076ba12c7fa8c6115c75c6a0f11c3d9518-1024x576.png"),
  },
  {
    id: "pr-canceled-listing",
    ownerId: "user-mira",
    name: "Vasastan listing (withdrawn)",
    labels: [],
    tags: ["Staging"],
    status: "deleted",
    pinned: false,
    lastUpdated: "4 days ago",
    lastUpdatedAt: 1793353363549,
    createdAt: "5 months ago",
    createdAtMs: 1780738963549,
    cover: mockImage("22871f11a67ad5ea67e262bc1fe52e2ac92fc053-1024x576.png"),
    deletedAt: "4 days ago",
    retentionDaysLeft: 26,
  },
];

export const mockFiles: StudioFile[] = [
  {
    id: "ws-kitchen-north",
    name: "Kitchen — north light",
    toolId: "room-reimagination",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "2 minutes ago",
    lastEditedAt: 1793698843549,
    createdAt: "3 weeks ago",
    preview: mockImage("8b5b210e78e7bf8fc163b9b7864fb4841c73b8ef-542x369.jpg"),
    projectId: "pr-sodermalm",
    sourceImage: mockImage("8572d4e8b15377bb1f8ca39ba3216e71cb5dc2e0-1535x1024.png"),
    tags: ["Kitchen", "Renovation"],
    version: 4,
    totalVersions: 4,
    totalGenerations: 11,
    aiCreditsUsed: 11,
    storageUsed: 84,
    currentVersionId: "seed-ws-kitchen-north-v4",
  },
  {
    id: "ws-living-scandi",
    name: "Living room — Scandinavian",
    toolId: "room-reimagination",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "2 hours ago",
    lastEditedAt: 1793691763549,
    createdAt: "2 months ago",
    preview: mockImage("f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg"),
    projectId: "pr-sodermalm",
    sourceImage: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg"),
    tags: ["Living room", "Scandinavian"],
    version: 7,
    totalVersions: 7,
    totalGenerations: 22,
    aiCreditsUsed: 22,
    storageUsed: 156,
    currentVersionId: "seed-ws-living-scandi-v3",
  },
  {
    id: "ws-garden-terrace",
    name: "Back garden — terrace study",
    toolId: "outdoor-visualization",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "Yesterday",
    lastEditedAt: 1793605363549,
    createdAt: "5 days ago",
    preview: mockImage("89ec2e7a440d0bf6d8b143ca4892d87cee151863-1024x682.png"),
    sourceImage: mockImage("d594affb64331658be2bc5f27c3f958f9183cb5b-1024x682.png"),
    tags: ["Garden"],
    version: 2,
    totalVersions: 2,
    totalGenerations: 6,
    aiCreditsUsed: 6,
    storageUsed: 41,
    currentVersionId: "seed-ws-garden-terrace-v2",
  },
  {
    id: "ws-listing-hammarby",
    name: "Hammarby listing — staging",
    toolId: "virtual-home-staging",
    ownerId: "user-mira",
    status: "draft",
    lastEdited: "3 days ago",
    lastEditedAt: 1793439763549,
    createdAt: "3 days ago",
    preview: "",
    sourceImage: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg"),
    projectId: "pr-listings",
    tags: ["Staging"],
    version: 1,
    totalVersions: 1,
    totalGenerations: 2,
    aiCreditsUsed: 2,
    storageUsed: 18,
  },
  {
    id: "ws-facade-study",
    name: "Facade study — cladding",
    toolId: "outdoor-visualization",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "40 minutes ago",
    lastEditedAt: 1793696563549,
    createdAt: "2 weeks ago",
    preview: mockImage("144bd1d8129ab54640981c8e245ed07717d31bd3-800x533.png"),
    savedAt: 1793696563549,
    sourceImage: mockImage("b21b1523c42e156896e6730308bf763713925900-1024x682.png"),
    params: { prompt: "Vertical timber cladding, charcoal window frames" },
    tags: ["Facade"],
    version: 3,
    totalVersions: 3,
    totalGenerations: 9,
    aiCreditsUsed: 9,
    storageUsed: 63,
    recovery: {
      sourceImage: mockImage("b21b1523c42e156896e6730308bf763713925900-1024x682.png"),
      referenceImage: "",
      params: { prompt: "Vertical timber cladding, charcoal frames, a low planted edge along the path" },
      selection: { mode: "select", marks: [{ x: 38, y: 62 }, { x: 64, y: 58 }], zones: [] },
      capturedAt: 1793698243549,
      reason: "session-ended",
    },
    currentVersionId: "seed-ws-facade-study-v2",
  },
  {
    id: "ws-lounge-evening",
    name: "Lounge — evening light",
    toolId: "lighting-reimagination",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "5 hours ago",
    lastEditedAt: 1793680963549,
    createdAt: "1 week ago",
    preview: mockImage("c6dfafbcf288818cf0bf88bb2db36c9d33db780d-1536x1024.png"),
    projectId: "pr-sodermalm",
    sourceImage: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg"),
    tags: ["Lighting"],
    version: 2,
    totalVersions: 2,
    totalGenerations: 5,
    aiCreditsUsed: 5,
    storageUsed: 37,
  },
  {
    id: "ws-villa-sky",
    name: "Villa exterior — golden hour",
    toolId: "sky-transformation",
    ownerId: "user-mira",
    status: "active",
    sessionState: "recent",
    lastEdited: "2 days ago",
    lastEditedAt: 1793526163549,
    createdAt: "4 days ago",
    preview: mockImage("b21b1523c42e156896e6730308bf763713925900-1024x682.png"),
    projectId: "pr-listings",
    sourceImage: mockImage("b21b1523c42e156896e6730308bf763713925900-1024x682.png"),
    tags: ["Exterior"],
    version: 1,
    totalVersions: 1,
    totalGenerations: 3,
    aiCreditsUsed: 3,
    storageUsed: 21,
  },
  {
    id: "ws-front-garden",
    name: "Front garden — borders",
    toolId: "garden-design",
    ownerId: "user-mira",
    status: "draft",
    lastEdited: "5 days ago",
    lastEditedAt: 1793266963549,
    createdAt: "5 days ago",
    preview: mockImage("77045f942e5fb6f35501791994a9ec2474dea837-1200x675.png"),
    sourceImage: mockImage("77045f942e5fb6f35501791994a9ec2474dea837-1200x675.png"),
    tags: ["Garden"],
    version: 1,
    totalVersions: 1,
    totalGenerations: 1,
    aiCreditsUsed: 1,
    storageUsed: 9,
  },
  {
    id: "ws-office-fitout",
    name: "Office fit-out — reception",
    toolId: "furniture-refresh",
    ownerId: "user-mira",
    status: "archived",
    lastEdited: "2 months ago",
    lastEditedAt: 1788514963549,
    createdAt: "3 months ago",
    preview: mockImage("48bf25076ba12c7fa8c6115c75c6a0f11c3d9518-1024x576.png"),
    sourceImage: mockImage("7c609fd51d189961d30180a883b22a036064b3c1-1024x576.png"),
    tags: ["Commercial"],
    version: 5,
    totalVersions: 5,
    totalGenerations: 14,
    aiCreditsUsed: 14,
    storageUsed: 97,
    currentVersionId: "seed-ws-office-fitout-v2",
  },
  {
    id: "ws-old-mockup",
    name: "Early bathroom mockup",
    toolId: "room-reimagination",
    ownerId: "user-mira",
    status: "deleted",
    lastEdited: "3 months ago",
    lastEditedAt: 1785922963549,
    createdAt: "4 months ago",
    preview: mockImage("0a6b26db94c722393d4a81a87900600a121fb598-1536x1024.png"),
    sourceImage: mockImage("8572d4e8b15377bb1f8ca39ba3216e71cb5dc2e0-1535x1024.png"),
    tags: [],
    version: 1,
    totalVersions: 1,
    totalGenerations: 3,
    aiCreditsUsed: 3,
    storageUsed: 22,
    deletedAt: "4 days ago",
    retentionDaysLeft: 26,
    currentVersionId: "seed-ws-old-mockup-v1",
  },
];

// Generation → result → version history. Ids follow the seed's
// `seed-<file>-g<n>` / `-r<n>` / `-v<n>` scheme.
const history: [file: string, n: number, summary: string, at: number, result: string | null][] = [
  ["ws-kitchen-north", 1, "Pale oak cabinetry, stone worktop", 1791884563550, "8b5b210e78e7bf8fc163b9b7864fb4841c73b8ef-542x369.jpg"],
  ["ws-kitchen-north", 2, "Same cabinetry, warmer light over the island", 1792489363550, "f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg"],
  ["ws-kitchen-north", 3, "Handleless fronts, timber worktop", 1793180563550, "a41988e0dce447ac8c380d22efac2f34a751af41-1080x720.jpg"],
  ["ws-kitchen-north", 4, "Brass fittings, darker worktop", 1793612563550, null],
  ["ws-kitchen-north", 5, "Back to painted fronts, stone worktop, pendant over the island", 1793698843550, "8ec8e34881c133d46401ef2c2928e91500f16bb5-800x534.png"],
  ["ws-living-scandi", 1, "Scandinavian, pale oak, low linen seating", 1793439763550, "f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg"],
  ["ws-living-scandi", 2, "Japandi — darker timber, paper light", 1793526163550, "a41988e0dce447ac8c380d22efac2f34a751af41-1080x720.jpg"],
  ["ws-garden-terrace", 1, "Stone terrace with deep planted borders", 1793526163550, "22871f11a67ad5ea67e262bc1fe52e2ac92fc053-1024x576.png"],
  ["ws-garden-terrace", 2, "Same terrace, evening, low level lighting", 1793605363550, "89ec2e7a440d0bf6d8b143ca4892d87cee151863-1024x682.png"],
  ["ws-facade-study", 1, "Light render, timber window frames", 1793266963550, "06d32ffb68c22223031861c9058113233402f140-1504x1046.png"],
  ["ws-facade-study", 2, "Vertical timber cladding, charcoal window frames", 1793696563550, "144bd1d8129ab54640981c8e245ed07717d31bd3-800x533.png"],
  ["ws-office-fitout", 1, "Oak reception desk, two lounge chairs", 1787650963550, "53811e1e2cd199389a7fdba37db66db06f6f8714-1536x1024.png"],
  ["ws-office-fitout", 2, "Lower desk, one long bench, more planting", 1788514963550, "48bf25076ba12c7fa8c6115c75c6a0f11c3d9518-1024x576.png"],
  ["ws-old-mockup", 1, "Terrazzo floor, fluted vanity", 1785922963550, "0a6b26db94c722393d4a81a87900600a121fb598-1536x1024.png"],
];

const FAVOURITES = new Set(["seed-ws-kitchen-north-r2", "seed-ws-kitchen-north-r5"]);

export const mockGenerations: Generation[] = history.map(([file, n, summary, at, result]) => ({
  id: `seed-${file}-g${n}`,
  fileId: file,
  status: result ? "succeeded" : "failed",
  summary,
  cost: result ? 1 : 0,
  createdAt: at,
}));

export const mockResults: Result[] = history
  .filter(([, , , , result]) => result)
  .map(([file, n, , at, result]) => ({
    id: `seed-${file}-r${n}`,
    fileId: file,
    generationId: `seed-${file}-g${n}`,
    image: mockImage(result!),
    favourite: FAVOURITES.has(`seed-${file}-r${n}`),
    createdAt: at,
  }));

export const mockVersions: Version[] = [
  ...[1, 2, 3].map((n) => version("ws-kitchen-north", n, n, mockResults.find((r) => r.id === `seed-ws-kitchen-north-r${n}`)!.createdAt)),
  version("ws-kitchen-north", 4, 5, 1793698843550),
  version("ws-living-scandi", 1, 1, 1793439763550),
  version("ws-living-scandi", 2, 2, 1793526163550),
  { ...version("ws-living-scandi", 3, 1, 1793691763550), kind: "restored", restoredFromId: "seed-ws-living-scandi-v1" },
  version("ws-garden-terrace", 1, 1, 1793526163550),
  version("ws-garden-terrace", 2, 2, 1793605363550),
  version("ws-facade-study", 1, 1, 1793266963550),
  version("ws-facade-study", 2, 2, 1793696563550),
  version("ws-office-fitout", 1, 1, 1787650963550),
  version("ws-office-fitout", 2, 2, 1788514963550),
  version("ws-old-mockup", 1, 1, 1785922963550),
];

function version(fileId: string, number: number, resultN: number, createdAt: number): Version {
  return { id: `seed-${fileId}-v${number}`, fileId, number, kind: "generated", resultId: `seed-${fileId}-r${resultN}`, createdAt };
}

/** Credits left on the account. */
export const mockCredits = 40;

// ---------------------------------------------------------------------------
// Selectors — the same derivations the prototype's screens make.
// ---------------------------------------------------------------------------

/** What a file card shows: the current version's result, else the last preview, else the upload. */
export function fileThumbnail(file: StudioFile) {
  const version = mockVersions.find((v) => v.id === file.currentVersionId);
  const result = version && mockResults.find((r) => r.id === version.resultId);
  return result?.image || file.preview || file.sourceImage;
}

const isLive = (f: StudioFile) => f.status === "active" || f.status === "draft";

/** "Continue working": files with an interrupted session first, then most recently edited. */
export function continueWorkingFiles() {
  return mockFiles
    .filter(isLive)
    .sort((a, b) => Number(!!b.recovery) - Number(!!a.recovery) || b.lastEditedAt - a.lastEditedAt);
}

export const archivedOrDeletedFileCount = () => mockFiles.filter((f) => !isLive(f)).length;

export const projectFileCount = (projectId: string) =>
  mockFiles.filter((f) => f.projectId === projectId && isLive(f)).length;

export const projectById = (id?: string) => mockProjects.find((p) => p.id === id);

export const updatedThisWeek = (p: Project) => MOCK_NOW - p.lastUpdatedAt <= 7 * DAY;

/** "Yesterday" → "yesterday" when it sits mid-sentence. */
export const inlineLabel = (label: string) => label.charAt(0).toLowerCase() + label.slice(1);

const MINUTE = 60_000;
const HOUR = 3_600_000;

/** "30 minutes ago", "Yesterday", "5 weeks ago" — measured from MOCK_NOW. */
export function timeAgo(at: number) {
  const ago = MOCK_NOW - at;
  const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"} ago`;
  if (ago < HOUR) return unit(Math.max(1, Math.floor(ago / MINUTE)), "minute");
  if (ago < DAY) return unit(Math.floor(ago / HOUR), "hour");
  const days = Math.floor(ago / DAY);
  if (days === 1) return "Yesterday";
  if (days < 7) return unit(days, "day");
  if (days < 60) return unit(Math.floor(days / 7), "week");
  return unit(Math.floor(days / 30), "month");
}

/** Whole days from MOCK_NOW to `at` (negative once it has passed). */
export const daysUntil = (at: number) => Math.round((at - MOCK_NOW) / DAY);

/** The image a saved version shows. */
export function versionImage(versionId: string) {
  const version = mockVersions.find((v) => v.id === versionId);
  return mockResults.find((r) => r.id === version?.resultId)?.image;
}

export const fileById = (id: string) => mockFiles.find((f) => f.id === id);
