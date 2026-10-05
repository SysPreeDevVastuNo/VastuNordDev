import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StoryCard from "@/components/shared/StoryCard";
import Reveal from "@/components/ui/Reveal";

export default function FeaturesHero() {
  return (
    <Section tone="dark" padded={false} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
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

      {/* Prototype: the standard padded container, text column + 32.7rem story card. */}
      <PageContainer className="pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32.7rem)] lg:items-center lg:gap-16">
          <Reveal className="min-w-0 max-w-xl">
            <p className="eyebrow inline-flex items-center gap-2 text-brand-orange">
              <Image src="/icons/interior-spaces.svg" alt="" width={14} height={14} />
              Interior Spaces
            </p>
            <h1 className="mt-6 text-[clamp(2.5rem,5.35vw,4rem)] font-semibold leading-[1.04] tracking-[-0.0135em] text-white">
              Transform your living room before moving a single piece of furniture
            </h1>
            <p className="mt-6 max-w-lg leading-7 text-brand-cream/75 md:text-lg">
              See your room in five directions in the time it takes to make a coffee — so the choice
              you make is one you have already seen, not one you are hoping works out.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
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
