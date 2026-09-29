"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Auto-playing before/after story card (Figma: Home hero, Features hero, About
 * hero). One CSS timeline drives the progress bar, the orange divider and the
 * reveal; see the .story-* rules in globals.css.
 */

type Story = {
  key: string;
  label: string;
  caption: string;
  // The Detail story has no artwork in Figma yet, so the card renders its
  // plain navy surface for it until the images are supplied.
  before?: string;
  after?: string;
};

const stories: Story[] = [
  {
    key: "interior",
    label: "Interior Transformation",
    caption: "Reimagine interior spaces instantly.",
    before: "/images/hero/interior-before.png",
    after: "/images/hero/interior-after.png",
  },
  {
    key: "exterior",
    label: "Exterior Transformation",
    caption: "Transform outdoor environments into new possibilities.",
    before: "/images/hero/exterior-before.png",
    after: "/images/hero/exterior-after.png",
  },
  {
    key: "detail",
    label: "Detail Refinement",
    caption: "Change the details that shape a space.",
  },
];

export default function StoryCard({ initialStory = 0 }: { initialStory?: number }) {
  const [active, setActive] = useState(initialStory);
  const story = stories[active];
  const go = (i: number) => setActive((i + stories.length) % stories.length);

  return (
    <div className="relative aspect-[4/5] w-full max-w-xl overflow-hidden rounded-3xl border border-white/12 bg-brand-navy lg:aspect-[3/4] lg:max-w-none">
      {story.before && story.after && (
        <>
          <Image
            src={story.before}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-cover"
          />
          <div key={`reveal-${active}`} className="story-reveal absolute inset-0">
            <Image
              src={story.after}
              alt={story.caption}
              fill
              priority
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
            />
          </div>
          <div
            key={`divider-${active}`}
            aria-hidden
            className="story-divider absolute inset-y-0 w-0.5 bg-brand-orange shadow-[0_0_18px_0_rgba(251,96,43,0.65)]"
          />
        </>
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-brand-navy/85 via-brand-navy/0 to-brand-navy/25"
      />

      <div className="absolute inset-x-4 top-4 flex gap-1.5">
        {stories.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Show ${s.label}`}
            aria-current={i === active}
            onClick={() => go(i)}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            {i < active && <span className="block h-full w-full rounded-full bg-white" />}
            {i === active && (
              <span
                key={`fill-${active}`}
                className="story-fill block h-full rounded-full bg-white"
                onAnimationEnd={() => go(active + 1)}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute inset-x-5 bottom-[19.5px]">
        <p className="eyebrow text-[#ff8256]">{story.label}</p>
        <p className="mt-2 max-w-[320px] font-heading text-lg font-medium leading-7 text-white lg:text-xl">
          {story.caption}
        </p>
      </div>

      <div className="absolute right-4 bottom-5 flex gap-2">
        <button
          type="button"
          aria-label="Previous story"
          onClick={() => go(active - 1)}
          className={storyNavButton}
        >
          <Image src="/icons/arrow-left.svg" alt="" width={16} height={16} />
        </button>
        <button
          type="button"
          aria-label="Next story"
          onClick={() => go(active + 1)}
          className={storyNavButton}
        >
          <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

const storyNavButton =
  "flex size-9 items-center justify-center rounded-full border border-white/35 bg-white/10 hover:bg-white/20";
