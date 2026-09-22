"use client";

import { useState } from "react";
import Placeholder from "@/components/ui/Placeholder";
import Tabs from "@/components/ui/Tabs";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const options = [
  {
    key: "spaces",
    tab: "Reimagine Spaces",
    title: "Transform the spaces you live in.",
    body: "Reimagine rooms, interiors and homes in entirely new directions.",
    tags: ["Room Reimagination", "Virtual Home Staging", "Seasonal Styling", "Lighting Reimagination"],
  },
  {
    key: "outdoors",
    tab: "Transform Outdoors",
    title: "See your outdoor space differently.",
    body: "Reimagine gardens, landscapes and pools with new materials, planting and light.",
    tags: ["Garden Reimagination", "Landscape Styling", "Pool Visualization", "Seasonal Views"],
  },
  {
    key: "details",
    tab: "Refine the Details",
    title: "Change the details that shape a space.",
    body: "Swap furniture, decor and lighting to see how the details change the feel.",
    tags: ["Furniture Swaps", "Decor Styling", "Lighting Moods", "Material Studies"],
  },
  {
    key: "images",
    tab: "Perfect Your Images",
    title: "Make every image work harder.",
    body: "Clean up, enhance and correct perspective so every photo is presentation-ready.",
    tags: ["Cleanup", "Enhancement", "Perspective Correction", "Upscaling"],
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

        <Tabs
          tabs={options.map((opt) => ({ key: opt.key, label: opt.tab }))}
          active={active}
          onChange={setActive}
          className="mt-10"
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-stone-900">{current.title}</h3>
            <p className="mt-3 text-stone-600">{current.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <Placeholder label={current.tab} className="aspect-[4/3]" />
        </div>
      </PageContainer>
    </Section>
  );
}
