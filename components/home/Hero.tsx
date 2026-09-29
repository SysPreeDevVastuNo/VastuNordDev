import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StoryCard from "@/components/shared/StoryCard";
import Reveal from "@/components/ui/Reveal";

const journey = ["Choose", "Create", "Explore", "Decide"];

export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <Section tone="dark" padded={false} className="relative isolate overflow-hidden">
      <Image
        src="/images/shared/unfurnished-open-plan.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/70 via-brand-navy/80 to-brand-navy"
      />
      <div aria-hidden className="accent-rule" />

      <PageContainer className="pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16">
          <Reveal>
            <Eyebrow light>Visual Design &amp; Transformation</Eyebrow>
            <h1 className="mt-6 text-[38.4px] font-semibold leading-[0.98] tracking-[-0.0135em] text-white sm:text-[56px] xl:text-[84px]">
              See What&rsquo;s Possible.
            </h1>
            <p className="mt-6 max-w-[512px] leading-7 text-brand-cream/75 lg:text-lg">
              Turn your ideas into visuals. Reimagine spaces, transform details, and explore
              possibilities before deciding what comes next.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/pricing" className="w-full sm:w-auto">
                <Image src="/icons/sparkle.svg" alt="" width={16} height={16} />
                Start Creating
              </Button>
              <Button href="#how-it-works" variant="ghost" className="w-full sm:w-auto">
                <Image src="/icons/chevron-right.svg" alt="" width={16} height={16} />
                See How It Works
              </Button>
            </div>

            <p className="mt-9 flex items-center gap-3 font-heading text-sm font-medium leading-5 text-white/80">
              {journey.map((step, i) => (
                <span key={step} className="contents">
                  {i > 0 && <Image src="/icons/chevron-right-orange.svg" alt="" width={13} height={13} />}
                  <span>{step}</span>
                </span>
              ))}
            </p>
          </Reveal>

          {/* Opens on Exterior with Interior already played — the state the Figma frame captures. */}
          <Reveal delay={120}>
            <StoryCard initialStory={1} />
          </Reveal>
        </div>

        {children}
      </PageContainer>
    </Section>
  );
}
