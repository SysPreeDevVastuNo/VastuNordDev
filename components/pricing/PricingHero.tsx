import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

// Figma's multi-stop scrim: solid navy at the bottom, easing to a translucent teal at the top.
const scrim =
  "linear-gradient(0deg, rgb(4,43,60) 10%, rgba(4,44,62,0.921) 17.857%, rgba(4,46,64,0.843) 25.714%, rgba(4,47,66,0.764) 33.571%, rgba(3,49,69,0.686) 41.429%, rgba(3,52,73,0.607) 49.286%, rgba(2,55,78,0.529) 57.143%, rgba(1,60,85,0.45) 65%, rgba(1,60,85,0.72) 100%)";

export default function PricingHero() {
  return (
    <Section tone="dark" padded={false} className="relative isolate overflow-hidden">
      {/* Figma reuses the Features "Minimalist" direction photo here. */}
      <Image
        src="/images/features/directions/minimalist.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: scrim }} />
      <div aria-hidden className="accent-rule" />

      <PageContainer className="flex min-h-[420px] flex-col justify-end pt-28 pb-14 lg:min-h-[520px] lg:pb-20">
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-brand-orange">01 — Pricing</p>
          <h1 className="mt-6 text-[33.6px] font-semibold leading-[1.04] tracking-[-0.0135em] sm:text-[48px] xl:text-[68px]">
            <span className="block text-white">Start exploring for free.</span>
            <span className="block text-white/50">Upgrade when you&apos;re ready.</span>
          </h1>
          <p className="mt-6 max-w-[576px] leading-7 text-brand-cream/75 lg:text-lg">
            One visualization is enough to see the difference. Pro is for when one is no longer enough.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="#plans" className="w-full sm:w-auto">
              <Image src="/icons/arrow-down.svg" alt="" width={16} height={16} />
              See the plans
            </Button>
            <Button href="/contact" variant="ghost" className="w-full sm:w-auto">
              Contact Sales
            </Button>
          </div>
        </Reveal>
      </PageContainer>
    </Section>
  );
}
