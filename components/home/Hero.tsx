"use client";

import { useState } from "react";
import clsx from "clsx";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Placeholder from "@/components/ui/Placeholder";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import { IconChevron } from "@/components/ui/icons";

const slides = [
  {
    key: "exterior",
    label: "Exterior Transformation",
    caption: "Transform outdoor environments into new possibilities.",
  },
  {
    key: "interior",
    label: "Interior Transformation",
    caption: "Reimagine interior spaces instantly.",
  },
  {
    key: "detail",
    label: "Detail Refinement",
    caption: "Change the details that shape a space.",
  },
] as const;

const journey = ["Choose", "Create", "Explore", "Decide"];

export default function Hero() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <Section tone="dark" padded={false}>
      <PageContainer className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16 lg:py-20">
        <div>
          <Eyebrow light>Visual Design &amp; Transformation</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
            See What&rsquo;s Possible.
          </h1>
          <p className="mt-6 max-w-md text-white/70">
            Turn your ideas into visuals. Reimagine spaces, transform details, and explore
            possibilities before deciding what comes next.
          </p>
          <div className="cta-group mt-8">
            <Button href="/pricing">Start Creating</Button>
            <Button href="#how-it-works" variant="ghost">
              See How It Works
            </Button>
          </div>

          <div className="mt-12 flex max-w-md items-center gap-5 text-xs font-semibold uppercase tracking-widest text-white/50">
            {journey.map((step, i) => (
              <span key={step} className="flex items-center gap-5">
                {i > 0 && <IconChevron className="h-3 w-3 text-white/30" />}
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <Placeholder label={slide.label} className="aspect-[4/5] w-full" />

          <button
            type="button"
            aria-label="Show next transformation"
            onClick={() => setActive((active + 1) % slides.length)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-navy transition-colors hover:bg-white"
          >
            <IconChevron className="h-4 w-4" />
          </button>

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-xl bg-brand-navy/85 px-4 py-3 backdrop-blur">
            <p className="text-sm font-medium text-white">{slide.caption}</p>
            <div className="flex shrink-0 gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  aria-label={`Show ${s.label}`}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === active ? "bg-white" : "bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
