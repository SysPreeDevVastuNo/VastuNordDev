import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "40K+", label: "Spaces Transformed" },
  { value: "210K+", label: "Designs Explored" },
  { value: "15K+", label: "Images Enhanced" },
  { value: "28K+", label: "Users Creating" },
];

const testimonials = [
  {
    quote: "I could finally see how the room would feel before committing to the renovation.",
    name: "Customer Name",
    role: "Homeowner",
  },
  {
    quote: "We can explore directions with clients before spending hours refining a concept.",
    name: "Customer Name",
    role: "Interior Designer",
  },
  {
    quote: "We can show buyers what an empty property could become.",
    name: "Customer Name",
    role: "Property Professional",
  },
];

export default function SocialProof() {
  return (
    <Section padded={false} className="relative bg-brand-teal py-20 text-white lg:py-28">
      <div aria-hidden className="accent-rule" />
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,462.39fr)_minmax(0,625.61fr)] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-white/70">06 — Social Proof</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em]">
              Built for ideas worth seeing.
            </h2>
            <p className="mt-5 max-w-[576px] text-base leading-7 text-brand-cream/70">
              From everyday home changes to professional design decisions, VastuNord helps people
              explore possibilities before moving forward.
            </p>
          </Reveal>

          <Reveal as="dl" delay={90} className="grid grid-cols-2 gap-x-8 gap-y-10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-t border-white/15 pt-5">
                <dt className="pt-2 text-sm leading-5 text-brand-cream/60">{s.label}</dt>
                <dd className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.5]">
                  {s.value}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              as="figure"
              key={t.role}
              delay={i * 60}
              className={clsx(
                "flex flex-col rounded-3xl border border-white/12 p-7",
                // Figma highlights the middle card on every breakpoint.
                i === 1 ? "bg-brand-navy" : "bg-white/4"
              )}
            >
              <Image src="/icons/quote.svg" alt="" width={22} height={22} />
              <blockquote className="pt-5 text-[15px] leading-7">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-7">
                <div className="border-t border-white/12 pt-5">
                  <p className="font-heading text-sm font-medium leading-5">{t.name}</p>
                  <p className="pt-1 text-sm leading-5 text-brand-cream/55">{t.role}</p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
