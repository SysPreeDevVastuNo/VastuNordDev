"use client";

import { useState } from "react";
import Placeholder from "@/components/ui/Placeholder";
import Tabs from "@/components/ui/Tabs";

const tabs = [
  {
    key: "interior",
    label: "Show Interior Transformation",
    eyebrow: "Interior Transformation",
    title: "Reimagine interior spaces instantly.",
  },
  {
    key: "exterior",
    label: "Show Exterior Transformation",
    eyebrow: "Exterior Transformation",
    title: "See your outdoor space differently.",
  },
  {
    key: "detail",
    label: "Show Detail Refinement",
    eyebrow: "Detail Refinement",
    title: "Change the details that shape a space.",
  },
] as const;

export default function TransformationShowcase() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("interior");
  const current = tabs.find((t) => t.key === active)!;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      <Tabs
        tabs={tabs}
        active={active}
        onChange={setActive}
        tone="dark"
        className="items-center justify-center"
      />

      <div className="mt-10 overflow-hidden rounded-3xl bg-white/5 p-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
          {current.eyebrow}
        </span>
        <h2 className="mt-2 text-2xl font-semibold text-white">{current.title}</h2>
        <div className="mt-6">
          <Placeholder dark label={current.eyebrow} className="aspect-video w-full" />
        </div>
      </div>
    </div>
  );
}
