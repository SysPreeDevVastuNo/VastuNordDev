import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const beliefs = ["Idea", "Visualize", "Compare", "Refine", "Decide"];

export default function WhyWeBuiltIt() {
  return (
    <Section tone="dark" padded={false} className="relative py-20 lg:py-28">
      <div aria-hidden className="accent-rule" />
      <PageContainer>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,572.62fr)_minmax(0,515.38fr)] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-white/70">Why We Built It</p>
            <h2 className="mt-5 text-[30.4px] font-semibold leading-[1.07] tracking-[-0.0135em] text-white sm:text-[44px] xl:text-[52px]">
              Seeing a possibility changes the decision.
            </h2>
            <p className="mt-6 max-w-[512px] leading-7 text-brand-cream/75">
              Once you can see an idea, everything becomes easier — comparing, refining, deciding, and
              sharing. That&rsquo;s why VastuNord exists: to make visual exploration possible before
              commitment.
            </p>
            <p className="mt-8 font-heading text-xl font-medium leading-8">
              <span className="block text-white">Make the idea visible.</span>
              <span className="block text-[#ff8256]">Then decide what comes next.</span>
            </p>
          </Reveal>

          <Reveal as="ol" delay={90} className="flex flex-col gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
            {beliefs.map((label, i) => {
              const last = i === beliefs.length - 1;
              return (
                <li key={label} className="flex items-center gap-4 bg-brand-teal px-6 py-5">
                  <span className="font-heading text-xs font-semibold leading-4 text-brand-orange">
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-heading font-medium uppercase leading-6 tracking-[0.14em] text-white">
                    {label}
                  </span>
                  {last ? (
                    <span aria-hidden className="size-2 rounded-full bg-brand-orange" />
                  ) : (
                    <Image src="/icons/caret-right-faint.svg" alt="" width={16} height={16} />
                  )}
                </li>
              );
            })}
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}
