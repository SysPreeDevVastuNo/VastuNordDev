import { IconHome, IconTools, IconFiles, IconProjects, IconShared } from "@/components/app/AppIcons";

export const appNav = [
  { href: "/app", label: "Home", Icon: IconHome, alsoMatches: [] as string[] },
  { href: "/app/library", label: "Tools", Icon: IconTools, alsoMatches: ["/app/tools"] },
  { href: "/app/files", label: "Files", Icon: IconFiles, alsoMatches: [] as string[] },
  { href: "/app/projects", label: "Projects", Icon: IconProjects, alsoMatches: [] as string[] },
  { href: "/app/shared", label: "Shared", Icon: IconShared, alsoMatches: [] as string[] },
];

export type AppNavItem = (typeof appNav)[number];

export function isNavActive(pathname: string, item: AppNavItem) {
  if (item.href === "/app") return pathname === "/app";
  return [item.href, ...item.alsoMatches].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
