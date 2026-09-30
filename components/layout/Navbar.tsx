"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

const links = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Past 12px of scroll the bar turns frosted so content blurs behind it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Figma marks the current page's link in teal (e.g. "Pricing" on /pricing).
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-[background-color,border-color]",
        scrolled ? "border-stone-200 bg-white/90 backdrop-blur-md" : "border-transparent bg-white"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-8 px-6 md:px-10 lg:px-14 xl:h-20">
        <Link href="/" aria-label="VastuNord home" className="shrink-0">
          <Image
            src="/brand/vastunord-logo.svg"
            alt=""
            width={260}
            height={24}
            priority
            className="h-5 w-auto xl:h-6"
          />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={clsx(
                  "relative block rounded-full px-4 py-2 text-sm leading-5 hover:text-brand-navy",
                  isCurrent(link.href) ? "text-brand-teal" : "text-stone-600"
                )}
              >
                {link.label}
                {/* Only the current page's link shows the underline. */}
                <span
                  aria-hidden
                  className={clsx(
                    "absolute inset-x-4 top-[37px] h-px bg-brand-orange transition-transform duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    isCurrent(link.href) ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/contact" className="text-sm leading-5 text-stone-600 hover:text-brand-navy">
            Sign In
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold leading-5 text-white hover:bg-brand-orange-dark"
          >
            <Image src="/icons/sparkle.svg" alt="" width={16} height={16} />
            Visualize My Space
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 flex size-10 items-center justify-center rounded-full xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1C1917" strokeWidth="1.25" strokeLinecap="round">
              <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
            </svg>
          ) : (
            <Image src="/icons/menu.svg" alt="" width={20} height={20} />
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-100 bg-white px-6 py-4 xl:hidden">
          <ul className="flex flex-col gap-4 text-sm leading-5 text-stone-600">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className={clsx(isCurrent(link.href) && "text-brand-orange")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </li>
          </ul>
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold leading-5 text-white"
          >
            <Image src="/icons/sparkle.svg" alt="" width={16} height={16} />
            Visualize My Space
          </Link>
        </div>
      )}
    </header>
  );
}
