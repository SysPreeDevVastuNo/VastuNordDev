"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import MaskIcon from "@/components/ui/MaskIcon";
import Reveal from "@/components/ui/Reveal";

export type ShowcaseStep = {
  n: string;
  label: string;
  title: string;
  /** Dark tone only: the line revealed under the selected step. */
  body?: string;
  icon: string;
  /** Figma draws the card label icon separately at 16px; falls back to `icon`. */
  cardIcon?: string;
  image?: string;
};

type Tone = "dark" | "light";

// Figma: Home "04 — How It Works" (dark) and About "How It Works" (light).
const tones: Record<
  Tone,
  {
    row: string;
    rowActive: string;
    rowHover: string;
    num: string;
    iconIdle: string;
    label: string;
    title: string;
    card: string;
    shade: string;
    pill: string;
    pillText: string;
    pillIcon: string;
    barIdle: string;
  }
> = {
  dark: {
    row: "border-transparent",
    rowActive: "border-white/15 bg-white/8",
    rowHover: "hover:border-white/12 hover:bg-white/4",
    num: "text-white/35",
    iconIdle: "bg-white/50",
    label: "text-white",
    title: "text-brand-cream/75",
    card: "border-white/12 bg-brand-teal",
    shade: "from-brand-navy/80 to-brand-navy/0",
    pill: "border-white/25 bg-white/10",
    pillText: "text-white",
    pillIcon: "bg-[#ff8256]",
    barIdle: "bg-white/15",
  },
  light: {
    row: "border-transparent",
    rowActive: "border-brand-teal/15 bg-brand-offwhite",
    rowHover: "hover:bg-stone-50",
    num: "text-stone-400",
    iconIdle: "bg-stone-500",
    label: "text-brand-teal",
    title: "text-stone-600",
    card: "border-stone-200 bg-brand-cream",
    shade: "from-black/45 to-black/0",
    pill: "border-white/40 bg-white/80",
    pillText: "text-stone-900",
    pillIcon: "bg-stone-900",
    barIdle: "bg-stone-200",
  },
};

export default function StepShowcase({ steps, tone = "dark" }: { steps: ShowcaseStep[]; tone?: Tone }) {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const t = tones[tone];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,566.14fr)_minmax(0,537.84fr)] lg:items-center lg:gap-16">
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <li key={step.n}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(i)}
                className={clsx(
                  "flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition-[background-color,border-color]",
                  isActive ? t.rowActive : [t.row, t.rowHover]
                )}
              >
                <span
                  className={clsx(
                    "font-heading text-sm font-semibold leading-5",
                    isActive ? "text-brand-orange" : t.num
                  )}
                >
                  {step.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <MaskIcon
                      src={step.icon}
                      className={clsx("size-[17px]", isActive ? "bg-brand-orange" : t.iconIdle)}
                    />
                    <span className={clsx("font-heading font-medium uppercase leading-6 tracking-[0.14em]", t.label)}>
                      {step.label}
                    </span>
                  </span>
                  <span className={clsx("block pt-1.5 text-sm leading-6", t.title)}>{step.title}</span>
                  {step.body && (
                    <span
                      className={clsx(
                        "grid transition-[grid-template-rows]",
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-[448px] pt-2 text-sm leading-6 text-brand-cream/50">
                          {step.body}
                        </span>
                      </span>
                    </span>
                  )}
                </span>
                {tone === "light" && (
                  <MaskIcon
                    src="/icons/caret-right.svg"
                    className={clsx(
                      "size-4 transition-transform",
                      isActive ? "translate-x-0.5 bg-brand-orange" : "bg-stone-400"
                    )}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <Reveal delay={60} className={clsx("overflow-hidden rounded-3xl border lg:sticky lg:top-28", t.card)}>
        <div className="relative aspect-[4/3]">
          {current.image && (
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="(min-width: 1024px) 538px, 100vw"
              className="object-cover"
            />
          )}
          <div aria-hidden className={clsx("absolute inset-0 bg-linear-to-t", t.shade)} />
          <div className={clsx("absolute inset-x-5 bottom-5 flex items-center gap-2 rounded-2xl border px-4 py-3 backdrop-blur", t.pill)}>
            <MaskIcon src={current.cardIcon ?? current.icon} className={clsx("size-4", t.pillIcon)} />
            <span
              className={clsx("font-heading text-sm font-medium uppercase leading-5 tracking-[0.14em]", t.pillText)}
            >
              {current.label}
            </span>
          </div>
        </div>
        <div aria-hidden className="flex gap-1.5 p-5">
          {steps.map((step, i) => (
            <span
              key={step.n}
              className={clsx(
                "h-1 flex-1 rounded-full transition-colors",
                i <= active ? "bg-brand-orange" : t.barIdle
              )}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
