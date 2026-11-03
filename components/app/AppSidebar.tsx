"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { appButtonPrimary } from "@/components/app/AppButton";
import { appNav, isNavActive } from "@/components/app/nav";
import {
  IconBell,
  IconCaretUpDown,
  IconPlus,
  IconSearch,
  IconSidebar,
} from "@/components/app/AppIcons";
import { mockUser } from "@/lib/mock/user";

const navItem =
  "group relative flex h-10 items-center gap-3 rounded-control text-[14px] transition-colors duration-200";
const navIdle = "text-body hover:bg-navy/4 hover:text-navy";

// Same key the prototype uses, so the choice survives a reload.
const COLLAPSED_KEY = "vastunord.sidebar.collapsed";
const COLLAPSED_EVENT = "vastunord:sidebar";

function subscribeCollapsed(onChange: () => void) {
  window.addEventListener(COLLAPSED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(COLLAPSED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function toggleCollapsed() {
  try {
    localStorage.setItem(COLLAPSED_KEY, readCollapsed() ? "0" : "1");
  } catch {}
  window.dispatchEvent(new Event(COLLAPSED_EVENT));
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);

  // Ctrl/Cmd+K opens search, as the "Ctrl K" hint in the search field promises.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/app/search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <aside
      className={clsx(
        "sticky top-0 z-40 hidden h-svh shrink-0 flex-col border-r border-line bg-white lg:flex",
        collapsed ? "w-19 px-3" : "w-62 px-4"
      )}
    >
      <div className={clsx("flex items-center pt-5 pb-4", collapsed ? "flex-col gap-3" : "justify-between pl-2")}>
        <Link href="/app" className="shrink-0">
          <Image src="/brand/vastunord-mark.svg" alt="VastuNord" width={49} height={24} className="h-6 w-[49px]" />
        </Link>
        <button
          type="button"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
          className="flex size-9 items-center justify-center rounded-control text-muted transition-colors duration-200 hover:bg-navy/4 hover:text-navy"
        >
          <IconSidebar />
        </button>
      </div>

      <Link href="/app/library" className={clsx(appButtonPrimary, "w-full", collapsed && "h-11 px-0 py-0")}>
        <IconPlus />
        <span className={clsx(collapsed && "sr-only")}>New</span>
      </Link>

      <Link
        href="/app/search"
        title={collapsed ? "Search" : undefined}
        className={clsx(
          "mt-3 flex h-11 items-center gap-2.5 rounded-control border border-line bg-shell text-[13px] text-faint transition-colors duration-200 hover:border-navy/30",
          collapsed ? "justify-center" : "px-3"
        )}
      >
        <IconSearch className="shrink-0 text-muted" />
        <span className={clsx(collapsed ? "sr-only" : "flex-1 truncate")}>Search</span>
        {!collapsed && (
          <kbd className="rounded-md border border-line bg-white px-1.5 py-0.5 font-display text-[10px] font-medium text-muted">
            Ctrl K
          </kbd>
        )}
      </Link>

      <nav className="no-scrollbar mt-6 flex-1 overflow-y-auto" aria-label="Workspace">
        {!collapsed && <p className="eyebrow mb-2 px-3 text-faint">Workspace</p>}
        <ul className="flex flex-col gap-0.5">
          {appNav.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    navItem,
                    collapsed ? "justify-center px-0" : "px-3",
                    active ? "bg-navy/7 font-medium text-navy" : navIdle
                  )}
                >
                  <item.Icon className={clsx("shrink-0", active ? "text-ember" : "text-muted group-hover:text-navy")} />
                  <span className={clsx(collapsed ? "sr-only" : "truncate")}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-line py-3">
        <button
          type="button"
          title={collapsed ? "Notifications" : undefined}
          className={clsx(navItem, navIdle, "w-full text-left", collapsed ? "justify-center px-0" : "px-3")}
        >
          <span className="relative shrink-0">
            <IconBell className="text-muted group-hover:text-navy" />
            {collapsed && <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-ember ring-2 ring-white" />}
          </span>
          <span className={clsx(collapsed ? "sr-only" : "flex-1 truncate")}>Notifications</span>
          {!collapsed && (
            <span className="flex min-w-5 items-center justify-center rounded-full bg-ember px-1.5 font-display text-[10px] leading-5 font-semibold text-white">
              {mockUser.unreadNotifications}
            </span>
          )}
        </button>
      </div>

      <div className="border-t border-line py-3">
        <button
          type="button"
          title={collapsed ? mockUser.name : undefined}
          className={clsx(
            "flex w-full items-center gap-3 rounded-control py-2 text-left transition-colors duration-200 hover:bg-navy/4",
            collapsed ? "justify-center px-0" : "px-2"
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[13px] font-semibold text-white">
            {mockUser.initials}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[13px] font-medium text-navy">{mockUser.name}</span>
                <span className="block truncate text-[12px] text-muted">{mockUser.email}</span>
              </span>
              <IconCaretUpDown className="shrink-0 text-faint" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
