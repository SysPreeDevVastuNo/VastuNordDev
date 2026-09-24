"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-14">
        <Link href="/" aria-label="VastuNord home" className="font-heading text-lg font-semibold text-brand-navy">
          VastuNord
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-stone-700 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-brand-navy">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/contact" className="text-sm font-medium text-stone-700 transition-colors hover:text-brand-navy">
            Sign In
          </Link>
          <Link
            href="/pricing"
            className="rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
          >
            Visualize My Space
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-100 bg-white px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium text-stone-700">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
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
            className="mt-4 block rounded-2xl bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Visualize My Space
          </Link>
        </div>
      )}
    </header>
  );
}
