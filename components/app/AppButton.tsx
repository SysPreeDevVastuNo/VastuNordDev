import Link from "next/link";
import clsx from "clsx";

// The app's primary action button (ember fill, 16px radius) — same recipe as
// the prototype's "New" / "Start" / "Continue" buttons.
const appButtonBase =
  "inline-flex items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-semibold transition-[transform,background-color,border-color,opacity] duration-200 ease-soft active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

export const appButtonPrimary = `${appButtonBase} bg-ember text-white hover:bg-ember-soft`;

// Translucent white-on-navy button for dark panels (Home start card).
// White button with a hairline border for secondary actions on light surfaces.
export const appButtonOutline = `${appButtonBase} border border-line bg-white text-navy hover:border-navy/40 hover:bg-shell`;

export const appButtonGlass = `${appButtonBase} border border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15`;

const variants = { primary: appButtonPrimary, outline: appButtonOutline, glass: appButtonGlass };

export default function AppButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "glass";
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(variants[variant], className)}>
      {children}
    </Link>
  );
}
