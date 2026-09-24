"use client";

import { useState } from "react";
import clsx from "clsx";
import Placeholder from "@/components/ui/Placeholder";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import { IconSpaces, IconOutdoors, IconDetails, IconImages } from "@/components/ui/icons";

const options = [
  {
    key: "spaces",
    tab: "Reimagine Spaces",
    title: "Transform the spaces you live in.",
    body: "Reimagine rooms, interiors and homes in entirely new directions.",
    Icon: IconSpaces,
  },
  {
    key: "outdoors",
    tab: "Transform Outdoors",
    title: "See your outdoor space differently.",
    body: "Reimagine gardens, landscapes and pools with new materials, planting and light.",
    Icon: IconOutdoors,
  },
  {
    key: "details",
    tab: "Refine the Details",
    title: "Change the details that shape a space.",
    body: "Swap furniture, decor and lighting to see how the details change the feel.",
    Icon: IconDetails,
  },
  {
    key: "images",
    tab: "Perfect Your Images",
    title: "Make every image work harder.",
    body: "Clean up, enhance and correct perspective so every photo is presentation-ready.",
    Icon: IconImages,
  },
] as const;

export default function WhatToTransform() {
  const [active, setActive] = useState<(typeof options)[number]["key"]>("spaces");
  const current = options.find((o) => o.key === active)!;

  return (
    <Section>
      <PageContainer>
        <SectionHeader
          eyebrow="02 — What Can You Create?"
          title="What do you want to transform?"
          description="Start with the outcome you have in mind. Choose a direction and VastuNord gives you the tools to bring it to life."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const isActive = opt.key === active;
              const Icon = opt.Icon;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(opt.key)}
                  className={clsx(
                    "flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors",
                    isActive
                      ? "border-brand-navy bg-brand-navy"
                      : "border-transparent hover:bg-stone-100"
                  )}
                >
                  <Icon
                    className={clsx("mt-0.5 h-5 w-5 shrink-0", isActive ? "text-brand-orange" : "text-stone-400")}
                  />
                  <span>
                    <span className={clsx("block text-sm font-semibold", isActive ? "text-white" : "text-stone-900")}>
                      {opt.tab}
                    </span>
                    <span className={clsx("mt-0.5 block text-sm", isActive ? "text-white/70" : "text-stone-500")}>
                      {opt.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <div className="relative">
              <Placeholder label={current.tab} className="aspect-[4/3] w-full" />
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-brand-navy/85 px-4 py-3 backdrop-blur">
                <p className="text-sm font-medium text-white">{current.title}</p>
              </div>
            </div>
            <p className="mt-4 text-stone-600">{current.body}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand-orange">Explore →</span>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
