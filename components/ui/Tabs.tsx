"use client";

import clsx from "clsx";

type Tone = "light" | "dark";

const toneStyles: Record<Tone, { active: string; inactive: string }> = {
  light: {
    active: "bg-brand-navy text-white",
    inactive: "bg-stone-100 text-stone-600 hover:bg-stone-200",
  },
  dark: {
    active: "bg-white text-brand-navy",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
};

export default function Tabs<K extends string>({
  tabs,
  active,
  onChange,
  tone = "light",
  className = "",
}: {
  tabs: readonly { key: K; label: string }[];
  active: K;
  onChange: (key: K) => void;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div role="tablist" className={clsx("flex flex-wrap gap-3", className)}>
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
              "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              isActive ? toneStyles[tone].active : toneStyles[tone].inactive
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
