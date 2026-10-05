"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const directions = [
  { label: "Before", caption: "Your space, as it is today.", image: "/images/features/hero-background.png" },
  { label: "Scandinavian", caption: "Pale woods, soft light, calm restraint.", image: "/images/features/directions/scandinavian.jpg" },
  { label: "Japandi", caption: "Warm minimalism with natural texture.", image: "/images/features/directions/japandi.jpg" },
  { label: "Modern Luxury", caption: "Deep tones, rich materials, quiet drama.", image: "/images/features/directions/modern-luxury.png" },
  { label: "Minimalist", caption: "Clean lines and generous negative space.", image: "/images/features/directions/minimalist.png" },
  { label: "Industrial", caption: "Raw surfaces, steel, and honest structure.", image: "/images/features/directions/industrial.png" },
  { label: "Mediterranean", caption: "Sun-washed plaster and earthy warmth.", image: "/images/features/directions/mediterranean.png" },
];

export default function PossibilityGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const atEnd = active === directions.length - 1;

  // As in the prototype, cards snap to the centre and the active dot follows
  // whichever card sits closest to the middle of the track — however it moved.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((card, i) => {
          const r = card.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", update);
    };
  }, []);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const index = Math.min(directions.length - 1, Math.max(0, i));
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    const offset = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + offset - (track.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
    setActive(index);
  };

  return (
    <Section id="possibilities" tone="dark" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="flex items-end justify-between gap-6">
          <Reveal className="max-w-[768px]">
            <p className="eyebrow text-white/70">Possibility Explorer</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-white">
              Explore possibilities before committing
            </h2>
            <p className="mt-5 max-w-[576px] text-base leading-7 text-brand-cream/70">
              Better decisions come from comparing possibilities. Swipe between directions — this is
              exploration, not a single generated answer.
            </p>
          </Reveal>
          {/* Figma's mobile frame drops the arrows; the track is swiped instead. */}
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous direction"
              disabled={active === 0}
              onClick={() => scrollToIndex(active - 1)}
              className={navButton}
            >
              <Image src="/icons/caret-left-white.svg" alt="" width={18} height={18} />
            </button>
            <button
              type="button"
              aria-label="Next direction"
              disabled={atEnd}
              onClick={() => scrollToIndex(active + 1)}
              className={navButton}
            >
              <Image src="/icons/caret-right-white.svg" alt="" width={18} height={18} />
            </button>
          </div>
        </div>

        <Reveal delay={80}>
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {directions.map((d, i) => (
            <figure key={d.label} className="w-[78%] shrink-0 snap-center sm:w-[58%] lg:w-[42%]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/12 bg-[#01293a]">
                <Image
                  src={d.image}
                  alt={`${d.label} direction`}
                  fill
                  sizes="(min-width: 1024px) 490px, (min-width: 640px) 58vw, 78vw"
                  className="object-cover"
                />
                <span
                  className={clsx(
                    "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.025em]",
                    i === 0 ? "bg-white/85 text-stone-900" : "bg-brand-orange text-white"
                  )}
                >
                  {d.label}
                </span>
              </div>
              <figcaption className="px-1 pt-4">
                <p className="font-heading font-medium leading-6 text-white">{d.label}</p>
                <p className="pt-1.5 text-sm leading-6 text-brand-cream/60">{d.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        </Reveal>

        <div className="flex justify-center gap-2 pt-6">
          {directions.map((d, i) => (
            <button
              key={d.label}
              type="button"
              aria-label={`Show ${d.label}`}
              aria-current={i === active}
              onClick={() => scrollToIndex(i)}
              className={clsx(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-brand-orange" : "w-1.5 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}

const navButton =
  "flex size-11 items-center justify-center rounded-full border border-white/25 transition-opacity hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30";
