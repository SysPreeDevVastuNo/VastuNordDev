// The Files tabs. Kept out of FileGrid (a client module) so the server page can read it.
export const fileViews = [
  { id: "active", tab: "Active" },
  { id: "archived", tab: "Archived" },
  { id: "deleted", tab: "Recently deleted" },
] as const;
export type FileView = (typeof fileViews)[number]["id"];
