import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const tiers = [
  {
    label: "Free",
    title: "One Visualization",
    body: "A single direction per space — enough to judge the quality.",
    icon: "/icons/history-faint.svg",
    pro: false,
  },
  {
    label: "Pro",
    title: "Unlimited Possibilities",
    body: "Every style, every iteration, compared side by side and shareable.",
    icon: "/icons/bolt-orange.svg",
    pro: true,
  },
];

export default function WhyGoPro() {
  return (
    <Section tone="dark" padded={false} className="relative py-20 lg:py-28">
      <div aria-hidden className="accent-rule" />
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal className="max-w-[768px]">
            <p className="eyebrow text-white/70">03 — Why Go Pro</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-white">
              Unlock every possibility.
            </h2>
            <p className="max-w-[576px] pt-5 text-base leading-7 text-brand-cream/70">
              Free answers one question. Pro lets you keep asking until the answer is obvious.
            </p>
          </Reveal>

          <Reveal delay={80} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.label}
                className={clsx(
                  "rounded-3xl border p-7",
                  tier.pro ? "border-brand-orange bg-brand-orange/12" : "border-white/15 bg-white/5"
                )}
              >
                <p className={clsx("eyebrow", tier.pro ? "text-brand-orange" : "text-white/70")}>{tier.label}</p>
                <h3 className="pt-4 font-heading text-2xl font-semibold leading-8 text-white">{tier.title}</h3>
                <p className={clsx("pt-3 text-sm leading-6", tier.pro ? "text-brand-cream/80" : "text-brand-cream/70")}>
                  {tier.body}
                </p>
                <Image src={tier.icon} alt="" width={22} height={22} className="mt-8" />
              </div>
            ))}
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}
