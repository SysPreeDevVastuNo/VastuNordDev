import Link from "next/link";
import { IconArrowRight } from "@/components/app/AppIcons";

// A titled block of a Studio screen: heading with an optional count and
// "see all" link, an optional one-line intro, then the content.
export default function AppSection({
  title,
  count,
  link,
  intro,
  className,
  children,
}: {
  title: string;
  count?: number;
  link?: { href: string; label: string };
  intro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="flex items-baseline justify-between gap-4 px-5 sm:px-0">
        <h2 className="font-display text-base font-medium text-navy">
          {title}
          {count !== undefined && <span className="ml-2 text-sm font-normal text-faint">{count}</span>}
        </h2>
        {link && (
          <Link
            href={link.href}
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ember"
          >
            {link.label}
            <IconArrowRight />
          </Link>
        )}
      </div>
      <div className="mt-4">
        {intro ? (
          <>
            <p className="px-5 text-[13px] leading-6 text-muted sm:px-0">{intro}</p>
            <div className="mt-4">{children}</div>
          </>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
