"use client";

import { useState } from "react";
import clsx from "clsx";
import Tabs from "@/components/ui/Tabs";
import Placeholder from "@/components/ui/Placeholder";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import { IconChevron } from "@/components/ui/icons";

const categories = [
  {
    key: "spaces",
    label: "Spaces",
    eyebrow: "SPACES",
    title: "Room Reimagination",
    description:
      "Start with an existing room and explore multiple interior design directions from the same base image.",
  },
  {
    key: "outdoors",
    label: "Outdoors",
    eyebrow: "OUTDOORS",
    title: "Garden Reimagination",
    description:
      "Start with an existing garden or yard and explore multiple landscaping directions from the same base image.",
  },
  {
    key: "details",
    label: "Details",
    eyebrow: "DETAILS",
    title: "Material Study",
    description:
      "Start with an existing detail and explore multiple furniture, decor and lighting directions from the same base image.",
  },
  {
    key: "images",
    label: "Images",
    eyebrow: "IMAGES",
    title: "Image Enhancement",
    description:
      "Start with an existing photo and explore multiple cleanup and enhancement directions from the same base image.",
  },
] as const;

const variationCount = 3;

export default function PossibilitiesShowcase() {
  const [active, setActive] = useState<(typeof categories)[number]["key"]>("spaces");
  const [variation, setVariation] = useState(1);
  const current = categories.find((c) => c.key === active)!;

  return (
    <Section>
      <PageContainer>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionHeader
            eyebrow="03 — Possibilities"
            title="See what you can create."
            description="Start with a real image and explore how it can transform — from interiors and exteriors to fine details, VastuNord generates multiple directions from a single starting point."
          />
          <Tabs
            tabs={categories.map((c) => ({ key: c.key, label: c.label }))}
            active={active}
            onChange={(key) => {
              setActive(key);
              setVariation(1);
            }}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative">
            <Placeholder label="Input" className="aspect-[4/3] w-full" />
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
              Input
            </span>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 p-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
                {current.eyebrow}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-stone-900">{current.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{current.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-medium text-stone-600">
                <button
                  type="button"
                  aria-label="Previous variation"
                  onClick={() => setVariation((v) => (v === 1 ? variationCount : v - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-100"
                >
                  <IconChevron direction="left" className="h-4 w-4" />
                </button>
                <span>
                  {variation} of {variationCount} Variations
                </span>
                <button
                  type="button"
                  aria-label="Next variation"
                  onClick={() => setVariation((v) => (v === variationCount ? 1 : v + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-100"
                >
                  <IconChevron className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {Array.from({ length: variationCount }).map((_, i) => (
                  <Placeholder
                    key={i}
                    label={`V${i + 1}`}
                    className={clsx("aspect-square", variation === i + 1 && "ring-2 ring-brand-orange")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          One real image. Multiple possible futures.
        </p>
      </PageContainer>
    </Section>
  );
}
