"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import MaskIcon from "@/components/ui/MaskIcon";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

type Option = {
  key: string;
  tab: string;
  title: string;
  icon: string;
  body: string;
  cta: string;
  image?: string;
  tags?: string[];
};

const options: Option[] = [
  {
    key: "spaces",
    tab: "Reimagine Spaces",
    title: "Transform the spaces you live in.",
    icon: "/icons/home.svg",
    body: "Reimagine rooms, interiors and homes in entirely new directions.",
    cta: "Explore Spaces",
    image: "/images/transform/reimagine-spaces.png",
    tags: ["Room Reimagination", "Virtual Home Staging", "Seasonal Styling", "Lighting Reimagination"],
  },
  {
    key: "outdoors",
    tab: "Transform Outdoors",
    title: "See your outdoor space differently.",
    icon: "/icons/outdoors.svg",
    body: "Explore new possibilities for gardens, landscapes, pools and outdoor spaces.",
    cta: "Explore Outdoors",
    // The prototype reuses the How It Works "Create" artwork here.
    image: "/images/how-it-works/create.jpg",
    tags: ["Outdoor Visualization", "Garden Design", "Hardscape Design", "Spa & Pool Redesign", "Sky Transformation"],
  },
  {
    key: "details",
    tab: "Refine the Details",
    title: "Change the details that shape a space.",
    icon: "/icons/paint-roller.svg",
    body: "Refresh furniture, redefine decor, experiment with materials and refine the way a space feels.",
    cta: "Explore Details",
    image: "/images/transform/refine-details.jpg",
    tags: ["Furniture Refresh", "Decor Re-definition", "Material Refinement", "Object Placement"],
  },
  {
    key: "images",
    tab: "Perfect Your Images",
    title: "Make every image work harder.",
    icon: "/icons/image.svg",
    body: "Clean up, enhance and correct your visuals before you share or use them.",
    cta: "Explore Image Tools",
    image: "/images/transform/perfect-images.jpg",
    tags: ["Visual Cleanup", "Image Enhancement", "Resolution Enhancement", "Perspective Correction"],
  },
];

export default function WhatToTransform() {
  const [active, setActive] = useState(options[0].key);
  const current = options.find((o) => o.key === active)!;

  return (
    <Section tone="offwhite" padded={false} className="border-y border-stone-200 py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">02 — What Can You Create?</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
            What do you want to transform?
          </h2>
          <p className="mt-5 max-w-[576px] text-base leading-7 text-stone-600">
            Start with the outcome you have in mind. Choose a direction and VastuNord gives you the
            tools to bring it to life.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const isActive = opt.key === active;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(opt.key)}
                  className={clsx(
                    "flex items-center gap-4 rounded-2xl border p-5 text-left transition-[background-color,border-color,transform]",
                    isActive
                      ? "border-brand-teal/15 bg-white shadow-[0_18px_50px_-38px_rgba(1,41,58,0.8)]"
                      : "border-transparent hover:-translate-y-px hover:border-stone-200 hover:bg-white/60"
                  )}
                >
                  <span
                    className={clsx(
                      "flex size-11 shrink-0 items-center justify-center rounded-full",
                      isActive ? "bg-brand-orange" : "bg-brand-cream"
                    )}
                  >
                    <MaskIcon src={opt.icon} className={clsx("size-5", isActive ? "bg-white" : "bg-brand-teal")} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block h-6 pt-1 text-stone-400">{opt.tab}</span>
                    <span className="block pt-1 font-heading font-medium leading-6 text-brand-teal">
                      {opt.title}
                    </span>
                  </span>
                  <MaskIcon
                    src="/icons/caret-right.svg"
                    className={clsx(
                      "size-4 transition-transform",
                      isActive ? "translate-x-0.5 bg-brand-orange" : "bg-stone-400"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Keyed by tab so each switch replays the fade-up, as in the prototype. */}
          <Reveal key={current.key} as="article" delay={40} className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <div className="relative aspect-[16/10] bg-brand-navy">
              {current.image && (
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(min-width: 1024px) 608px, 100vw"
                  className="object-cover"
                />
              )}
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/55 to-black/0" />
              <p className="absolute bottom-5 left-6 right-0 max-w-[384px] font-heading text-xl font-medium leading-7 text-white lg:text-2xl lg:leading-8">
                {current.title}
              </p>
            </div>

            <div className="p-7">
              <p className="max-w-[448px] text-sm leading-6 text-stone-600">{current.body}</p>
              {current.tags && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-stone-200 bg-brand-offwhite px-3 py-1.5 text-[13px] leading-[19.5px] text-stone-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <Button href="/features" variant="outline" className="mt-7">
                <Image src="/icons/arrow-right-navy.svg" alt="" width={16} height={16} />
                {current.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}
