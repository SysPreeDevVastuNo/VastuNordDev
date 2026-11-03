// Profile, sessions and preferences — the prototype's `vastunord.account.v1` record.

export type AccountProfile = {
  name: string;
  email: string;
  studio: string;
  role: "designer" | "homeowner" | "agent";
  avatar: string;
};

export type AccountSession = {
  id: string;
  device: string;
  place: string;
  lastActive: number;
  current: boolean;
};

export type NotificationPrefs = Record<"security" | "product" | "generation" | "billing" | "credits" | "marketing", boolean>;

export type ExportDefaults = {
  format: "jpg" | "png";
  size: "HD" | "4K";
  naming: string;
  branding: "none" | "logo";
};

export type SupportTicket = {
  id: string;
  category: "export" | "billing" | "generation" | "account";
  subject: string;
  body: string;
  priority: "normal" | "high";
  status: "open" | "answered" | "closed";
  createdAt: number;
};

export const mockProfile: AccountProfile = {
  name: "Mira Lindqvist",
  email: "mira@lindqvist.studio",
  studio: "Lindqvist Studio",
  role: "designer",
  avatar: "",
};

export const mockSessions: AccountSession[] = [
  { id: "s-this", device: "This browser", place: "Stockholm, Sweden", lastActive: 1793698963595, current: true },
  { id: "s-phone", device: "iPhone · Safari", place: "Stockholm, Sweden", lastActive: 1793688163595, current: false },
  { id: "s-office", device: "Windows · Chrome", place: "Uppsala, Sweden", lastActive: 1793518963595, current: false },
];

export const mockPasswordChangedAt = 1785750163595;

export const mockNotificationPrefs: NotificationPrefs = {
  security: true,
  product: true,
  generation: true,
  billing: true,
  credits: true,
  marketing: false,
};

export const mockExportDefaults: ExportDefaults = {
  format: "jpg",
  size: "4K",
  naming: "{file}-v{version}-{size}",
  branding: "none",
};

export const mockTutorials: Record<string, { step: number; done: boolean }> = {
  "first-room": { step: 3, done: true },
  compare: { step: 1, done: false },
};

export const mockTickets: SupportTicket[] = [
  {
    id: "VN-48213",
    category: "export",
    subject: "PNG export looked darker than the preview",
    body: "The 4K PNG of the kitchen came out noticeably darker than what I see on screen.",
    priority: "normal",
    status: "answered",
    createdAt: 1793180563595,
  },
];
