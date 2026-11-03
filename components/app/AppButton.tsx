import Link from "next/link";
import clsx from "clsx";

// The app's primary action button (ember fill, 16px radius) — same recipe as
// the prototype's "New" / "Start" / "Continue" buttons.
export const appButtonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-semibold transition-[transform,background-color,border-color,opacity] duration-200 ease-soft active:translate-y-px disabled:pointer-events-none disabled:opacity-45 bg-ember text-white hover:bg-ember-soft";

export default function AppButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(appButtonPrimary, className)}>
      {children}
    </Link>
  );
}
