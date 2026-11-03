"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { appNav, isNavActive } from "@/components/app/nav";

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Workspace"
      className="sticky bottom-0 z-30 flex border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {appNav.map((item) => {
        const active = isNavActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 font-display text-[10px] font-medium tracking-[0.02em] uppercase transition-colors duration-200 min-[400px]:text-[11px] min-[400px]:tracking-[0.06em]",
              active ? "text-ember" : "text-muted"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
