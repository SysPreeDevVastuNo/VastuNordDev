"use client";

import clsx from "clsx";

type Tone = "light" | "dark" | "outline";

const toneStyles: Record<Tone, { list: string; tab: string; active: string; inactive: string }> = {
  light: {
    list: "gap-3",
    tab: "px-5 py-2.5 text-sm font-medium",
    active: "bg-brand-navy text-white",
    inactive: "bg-stone-100 text-stone-600 hover:bg-stone-200",
  },
  dark: {
    list: "gap-3",
    tab: "px-5 py-2.5 text-sm font-medium",
    active: "bg-white text-brand-navy",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
  // Figma filter pills (Home "03 — Possibilities").
  outline: {
    list: "gap-2",
    tab: "border px-4 py-2 text-[13px] leading-[19.5px]",
    active: "border-brand-teal bg-brand-teal text-white",
    inactive: "border-stone-200 bg-white text-stone-600 hover:border-brand-teal/40 hover:text-brand-teal",
  },
};

export default function Tabs<K extends string>({
  tabs,
  active,
  onChange,
  tone = "light",
  wrap = true,
  className = "",
}: {
  tabs: readonly { key: K; label: string }[];
  active: K;
  onChange: (key: K) => void;
  tone?: Tone;
  /** false keeps the tabs on one line and lets the row scroll sideways. */
  wrap?: boolean;
  className?: string;
}) {
  const styles = toneStyles[tone];
  return (
    <div role="tablist" className={clsx("flex", wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto", styles.list, className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={clsx(
              "shrink-0 rounded-full transition-[background-color,border-color,color]",
              styles.tab,
              isActive ? styles.active : styles.inactive
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
