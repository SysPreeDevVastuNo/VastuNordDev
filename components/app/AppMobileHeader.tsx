import Image from "next/image";
import Link from "next/link";
import { appButtonPrimary } from "@/components/app/AppButton";
import { IconBell, IconPlus, IconSearch, IconUserCircle } from "@/components/app/AppIcons";
import { mockUser } from "@/lib/mock/user";

// Below lg the sidebar is gone; this bar carries logo, search, notifications and
// account, and the bottom tab bar (MobileTabBar) carries the five destinations.
export default function AppMobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md lg:hidden">
      <div className="flex h-14 w-full items-center gap-3 px-4 md:h-16 md:px-6">
        <Link href="/app" className="shrink-0">
          <Image src="/brand/vastunord-mark.svg" alt="VastuNord" width={49} height={24} className="h-6 w-[49px]" />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/app/search"
            aria-label="Search"
            className="flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-shell"
          >
            <IconSearch size={20} />
          </Link>
          <button
            type="button"
            aria-label={`Notifications, ${mockUser.unreadNotifications} unread`}
            className="relative flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-shell"
          >
            <IconBell size={20} />
            <span className="absolute top-2 right-2 flex min-w-4 items-center justify-center rounded-full bg-ember px-1 font-display text-[10px] font-semibold text-white">
              {mockUser.unreadNotifications}
            </span>
          </button>
          <Link href="/app/library" className={`${appButtonPrimary} ml-1 hidden px-3.5 py-2.5 sm:inline-flex`}>
            <IconPlus />
            New
          </Link>
          <button
            type="button"
            aria-label="Account"
            className="flex size-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-shell hover:text-navy"
          >
            <IconUserCircle />
          </button>
        </div>
      </div>
    </header>
  );
}
