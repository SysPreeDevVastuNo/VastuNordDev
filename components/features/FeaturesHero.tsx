import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StoryCard from "@/components/shared/StoryCard";
import Reveal from "@/components/ui/Reveal";

export default function FeaturesHero() {
  return (
    <Section tone="dark" padded={false} className="relative isolate overflow-hidden">
      {/* Figma stops the photo at 778.73px on desktop, above the section's bottom edge. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-full opacity-30 xl:h-[778.73px]">
        <Image
          src="/images/features/hero-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/85 via-brand-teal/80 to-brand-navy"
      />
      <div aria-hidden className="accent-rule" />

      {/* Figma sets this hero flush with the 1280px container edge (no side
          padding) with fixed 688px + 522.94px columns. That only fits once the
          viewport leaves a 56px margin either side (87rem = 1392px); below it the hero
          uses the standard padded container with fluid columns. */}
      <PageContainer className="pt-24 pb-14 lg:pt-28 lg:pb-24 min-[87rem]:px-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.76fr)] lg:gap-16 min-[87rem]:grid-cols-[688px_522.94px]">
          <Reveal className="max-w-[576px]">
            <p className="flex h-6 items-center gap-2 text-[11px] font-semibold uppercase leading-[16.5px] tracking-eyebrow text-brand-orange">
              <Image src="/icons/interior-spaces.svg" alt="" width={14} height={14} />
              Interior Spaces
            </p>
            <h1 className="mt-6 text-[33.6px] font-semibold leading-[1.04] tracking-[-0.0135em] text-white sm:text-[48px] xl:text-[64px]">
              Transform your living room before moving a single piece of furniture
            </h1>
            <p className="mt-6 max-w-[512px] text-[15px] leading-7 text-brand-cream/75 lg:text-lg">
              See your room in five directions in the time it takes to make a coffee — so the choice
              you make is one you have already seen, not one you are hoping works out.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-9">
              <Button href="/pricing" className="w-full sm:w-auto">
                <Image src="/icons/upload.svg" alt="" width={16} height={16} />
                Visualize My Space
              </Button>
              <Button href="#possibilities" variant="ghost" className="w-full sm:w-auto">
                <Image src="/icons/arrow-down.svg" alt="" width={16} height={16} />
                Explore possibilities
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <StoryCard />
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}
