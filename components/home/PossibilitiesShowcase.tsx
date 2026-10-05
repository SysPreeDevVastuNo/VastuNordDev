"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Tabs from "@/components/ui/Tabs";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

type Category = {
  key: string;
  label: string;
  title: string;
  description: string;
  input?: string;
  variations?: string[];
};

const categories: Category[] = [
  {
    key: "spaces",
    label: "Spaces",
    title: "Room Reimagination",
    description:
      "Start with an existing room and explore multiple interior design directions from the same base image.",
    input: "/images/possibilities/spaces-input.png",
    variations: [
      "/images/possibilities/spaces-variation-1.png",
      "/images/possibilities/spaces-variation-2.png",
      "/images/possibilities/spaces-variation-3.png",
    ],
  },
  {
    key: "outdoors",
    label: "Outdoors",
    title: "Garden Reimagination",
    description:
      "Start with an existing garden or yard and explore multiple landscaping directions from the same base image.",
    input: "/images/possibilities/outdoors-input.jpg",
    variations: [
      "/images/possibilities/outdoors-variation-1.jpg",
      "/images/possibilities/outdoors-variation-2.jpg",
      "/images/possibilities/outdoors-variation-3.jpg",
    ],
  },
  {
    key: "details",
    label: "Details",
    title: "Material Study",
    description:
      "Start with an existing detail and explore multiple furniture, decor and lighting directions from the same base image.",
    input: "/images/possibilities/details-input.jpg",
    variations: [
      "/images/possibilities/details-variation-1.jpg",
      "/images/possibilities/details-variation-2.jpg",
      "/images/possibilities/details-variation-3.jpg",
    ],
  },
  {
    key: "images",
    label: "Images",
    title: "Image Enhancement",
    description:
      "Start with an existing photo and explore multiple cleanup and enhancement directions from the same base image.",
    input: "/images/possibilities/images-input.jpg",
    variations: [
      "/images/possibilities/images-variation-1.jpg",
      "/images/possibilities/images-variation-2.jpg",
      "/images/possibilities/images-variation-3.jpg",
    ],
  },
];

const variationCount = 3;
// Figma frames the divider at 52% (358.8px of 690px).
const defaultSplit = 52;

export default function PossibilitiesShowcase() {
  const [active, setActive] = useState(categories[0].key);
  const [variation, setVariation] = useState(0);
  const [split, setSplit] = useState(defaultSplit);
  // As in the prototype, pressing or dragging anywhere on the card moves the divider.
  const cardRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const splitAt = (clientX: number) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (r) setSplit(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const current = categories.find((c) => c.key === active)!;
  const variationSrc = current.variations?.[variation];

  const selectVariation = (i: number) => setVariation(i);
  const stepVariation = (delta: number) =>
    setVariation((v) => (v + delta + variationCount) % variationCount);

  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[768px]">
            <p className="eyebrow text-stone-500">03 — Possibilities</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
              See what you can create.
            </h2>
            <p className="mt-5 max-w-[576px] text-base leading-7 text-stone-600">
              Start with a real image and explore how it can transform — from interiors and exteriors
              to fine details, VastuNord generates multiple directions from a single starting point.
            </p>
          </Reveal>
          <Reveal delay={80} className="min-w-0">
          <Tabs
            tone="outline"
            tabs={categories.map((c) => ({ key: c.key, label: c.label }))}
            active={active}
            onChange={(key) => {
              setActive(key);
              setVariation(0);
              setSplit(defaultSplit);
            }}
            wrap={false}
            className="-mx-6 px-6 lg:mx-0 lg:px-0"
          />
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] lg:items-center lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-cream shadow-[0_30px_80px_-50px_rgba(1,41,58,0.7)]">
            <div
              ref={cardRef}
              className="absolute inset-0 touch-pan-y select-none"
              onPointerDown={(e) => {
                // The slider handles its own drag.
                if ((e.target as HTMLElement).tagName === "INPUT") return;
                dragging.current = true;
                splitAt(e.clientX);
              }}
              onPointerMove={(e) => dragging.current && splitAt(e.clientX)}
              onPointerUp={() => (dragging.current = false)}
              onPointerLeave={() => (dragging.current = false)}
            >
            {current.input && (
              <Image
                src={current.input}
                alt="Input image"
                fill
                sizes="(min-width: 1024px) 690px, 100vw"
                className="object-cover"
              />
            )}
            {variationSrc && (
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
                <Image
                  src={variationSrc}
                  alt={`Variation ${variation + 1} direction`}
                  fill
                  sizes="(min-width: 1024px) 690px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.025em] text-stone-900">
              Input
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-brand-teal/85 px-3 py-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.025em] text-white">
              Variation {variation + 1}
            </span>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px bg-white/90"
              style={{ left: `${split}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(split)}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label={`Compare Input with Variation ${variation + 1}`}
              className="absolute inset-x-0 bottom-5 mx-auto w-[70%] accent-brand-orange"
            />
            </div>
          </Reveal>

          <Reveal delay={60}>
            <p className="eyebrow text-stone-400">{current.label}</p>
            <h3 className="mt-3 text-2xl font-semibold leading-8 tracking-[-0.0135em] text-brand-teal">
              {current.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-600">{current.description}</p>

            <div className="mt-7 flex items-center gap-4">
              <p className="shrink-0 text-sm font-medium leading-5 text-brand-teal">
                {variation + 1} of {variationCount} Variations
              </p>
              <span aria-hidden className="h-px flex-1 bg-stone-200" />
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous variation"
                  onClick={() => stepVariation(-1)}
                  className={variationNavButton}
                >
                  <Image src="/icons/arrow-left-navy.svg" alt="" width={16} height={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next variation"
                  onClick={() => stepVariation(1)}
                  className={variationNavButton}
                >
                  <Image src="/icons/arrow-right-navy.svg" alt="" width={16} height={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {Array.from({ length: variationCount }, (_, i) => {
                const src = current.variations?.[i];
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show variation ${i + 1}`}
                    aria-pressed={variation === i}
                    onClick={() => selectVariation(i)}
                    className={clsx(
                      "overflow-hidden rounded-xl border bg-brand-cream",
                      variation === i ? "border-brand-orange" : "border-stone-200 hover:border-stone-300"
                    )}
                  >
                    <span className="relative block aspect-[4/3]">
                      {src && (
                        <Image src={src} alt="" fill sizes="(min-width: 1024px) 131px, 30vw" className="object-cover" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-sm leading-5 text-stone-500">One real image. Multiple possible futures.</p>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}

const variationNavButton =
  "flex size-9 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-50";
