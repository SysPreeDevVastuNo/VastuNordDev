import clsx from "clsx";

// Toggle pill used for tool categories and project filters.
export default function FilterChip({
  pressed,
  onClick,
  icon,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={clsx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-[13px] transition-[background-color,border-color,color] duration-200",
        pressed ? "border-navy bg-navy text-white" : "border-line bg-white text-body hover:border-navy/40 hover:text-navy"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
