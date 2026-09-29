import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StoryCard from "@/components/shared/StoryCard";

export default function AboutHero() {
  return (
    <Section tone="dark" padded={false} className="relative isolate overflow-hidden">
      <Image
        src="/images/shared/unfurnished-open-plan.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-brand-navy/75 via-brand-navy/80 to-brand-navy"
      />
      <div aria-hidden className="accent-rule" />

      <PageContainer className="pt-28 pb-20 lg:pt-36">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,581.05fr)_minmax(0,522.94fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-white/70">Why VastuNord</p>
            <h1 className="mt-6 text-[35.2px] font-semibold leading-[1.02] tracking-[-0.0135em] text-white sm:text-[52px] xl:text-[72px]">
              You shouldn&rsquo;t have to imagine it all in your head.
            </h1>
            <p className="mt-6 max-w-[512px] leading-7 text-brand-cream/75 lg:text-lg">
              Whether you&rsquo;re changing a room, planning a garden, or exploring a new idea — the
              hardest part is knowing what it will actually look like. VastuNord helps you see it before
              you commit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/pricing" className="w-full sm:w-auto">
                <Image src="/icons/sparkle.svg" alt="" width={16} height={16} />
                Start Creating
              </Button>
              <Button href="/features#possibilities" variant="ghost" className="w-full sm:w-auto">
                <Image src="/icons/eye-white.svg" alt="" width={16} height={16} />
                See Examples
              </Button>
            </div>
          </div>

          <StoryCard />
        </div>
      </PageContainer>
    </Section>
  );
}
