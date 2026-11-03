import clsx from "clsx";
import { IconSearch, IconX } from "@/components/app/AppIcons";

// Search box for in-page filtering (tool library, projects, files) and Search. `compact` is the
// slimmer one that sits beside a sort button.
export default function SearchField({
  label,
  placeholder = label,
  value,
  onChange,
  compact = false,
  autoFocus,
  className,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <label
      className={clsx(
        "flex items-center rounded-control border border-line bg-white transition-colors duration-200 focus-within:border-navy/40",
        compact ? "flex-1 gap-2.5 px-3.5 py-2.5" : "gap-3 px-4 py-3",
        className
      )}
    >
      <IconSearch size={compact ? 16 : 18} className="shrink-0 text-muted" />
      {/* The border/padding resets undo the marketing form styles in globals.css. */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        autoFocus={autoFocus}
        aria-label={label}
        className="w-full rounded-none border-0 bg-transparent p-0 text-base text-ink placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className={clsx(
            "flex items-center justify-center rounded-full text-muted transition-colors hover:bg-shell hover:text-navy",
            compact ? "-mr-1 size-7" : "-mr-1.5 size-8"
          )}
        >
          <IconX size={compact ? 13 : 15} />
        </button>
      )}
    </label>
  );
}
