// Review links, downloads and the activity log — the prototype's
// `vastunord.delivery.v1` record. Read by the Shared screen (E-S).

export type ShareItem = { fileId: string; versionId: string };

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
  settings: {
    access: "link" | "invite";
    invitees: string[];
    review: boolean;
    showOriginal: boolean;
    allowDownload: boolean;
    expiry: "7d" | "30d" | "never";
  };
  createdAt: number;
  expiresAt: number;
  views: number;
  lastViewedAt: number;
  review:
    | { status: "waiting" }
    | { status: "changes" | "approved"; chosen: number; reviewer: string; note: string; decidedAt: number };
  comments: { id: string; author: string; from: "client" | "owner"; text: string; item: number; at: number }[];
};

export type Delivery = {
  id: string;
  userId: string;
  fileId: string;
  projectId?: string;
  versionId: string;
  resultId: string;
  type: "jpg" | "png";
  size: "HD" | "4K";
  format: "JPG" | "PNG";
  filename: string;
  compression?: "balanced";
  layout: "result" | "before-after";
  watermarked: boolean;
  credits: number;
  status: "delivered" | "failed";
  bytes: number;
  createdAt: number;
  completedAt: number;
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
  action: "export" | "review" | "share-created";
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
