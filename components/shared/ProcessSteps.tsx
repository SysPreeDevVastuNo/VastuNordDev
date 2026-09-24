"use client";

import { useState } from "react";
import clsx from "clsx";
import Placeholder from "@/components/ui/Placeholder";

export type ProcessStep = {
  n: string;
  label: string;
  title: string;
  body: string;
};

export default function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
      <div className="divide-y divide-stone-200 rounded-2xl bg-white shadow-sm">
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <button
              key={step.n}
              type="button"
              aria-expanded={isActive}
              onClick={() => setActive(i)}
              className="flex w-full flex-col gap-1 px-6 py-5 text-left"
            >
              <span
                className={clsx(
                  "text-xs font-semibold tracking-widest",
                  isActive ? "text-brand-orange" : "text-stone-400"
                )}
              >
                {step.n} · {step.label}
              </span>
              <span className={clsx("font-semibold", isActive ? "text-stone-900" : "text-stone-500")}>
                {step.title}
              </span>
              {isActive && <span className="mt-1 text-sm text-stone-600">{step.body}</span>}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Placeholder label={current.label} className="aspect-[4/3] w-full" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
          {current.label}
        </span>
      </div>
    </div>
  );
}
