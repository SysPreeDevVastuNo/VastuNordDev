import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

export default function OurBelief() {
  return (
    <Section padded={false} className="py-24 lg:py-36">
      <PageContainer className="text-center">
        <Reveal className="mx-auto max-w-[768px]">
          <p className="eyebrow text-stone-500">Our Belief</p>
          <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.0135em] text-brand-teal">
            Design shouldn&rsquo;t feel like a leap of faith.
          </h2>
          <p className="mx-auto mt-6 max-w-[576px] text-base leading-7 text-stone-600">
            Too many decisions are made without seeing the outcome. VastuNord closes the gap between
            imagining something and actually seeing it.
          </p>
        </Reveal>

        {/* Figma reuses the Home closing-banner photo here. */}
        <Reveal as="figure" delay={90} className="mx-auto mt-14 max-w-[896px] overflow-hidden rounded-3xl border border-stone-200">
          <div className="relative aspect-[7/3]">
            <Image src="/images/cta/home.jpg" alt="" fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-brand-navy/45" />
            <figcaption className="absolute inset-0 flex items-center justify-center px-8">
              <p className="max-w-[672px] font-heading text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-[1.25] text-white">
                A world where you can see the possibility before you commit to it.
              </p>
            </figcaption>
          </div>
        </Reveal>
      </PageContainer>
    </Section>
  );
}
