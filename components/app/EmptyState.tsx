import clsx from "clsx";
import { IconSearch } from "@/components/app/AppIcons";

// Dashed "nothing here" card for a search or filter that matches nothing.
export default function EmptyState({
  title,
  body,
  icon = <IconSearch size={20} />,
  roomy = false,
  children,
}: {
  title: string;
  body?: string;
  icon?: React.ReactNode;
  /** Taller padding, for an empty state that stands alone on the page. */
  roomy?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={clsx("flex flex-col items-center rounded-card border border-dashed border-line bg-shell px-6 text-center", roomy ? "py-14" : "py-10")}>
      <span className="flex size-11 items-center justify-center rounded-full bg-white text-muted">
        {icon}
      </span>
      <p className="mt-4 font-display text-base font-medium text-navy">{title}</p>
      {body && <p className="mt-2 max-w-xs text-[13px] leading-6 text-body">{body}</p>}
      {children && <div className="mt-6 flex flex-col gap-2 sm:flex-row">{children}</div>}
    </div>
  );
}
