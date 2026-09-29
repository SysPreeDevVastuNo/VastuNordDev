import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const audiences = [
  {
    title: "Homeowners",
    body: "See your future home before spending money on it.",
    image: "/images/features/audiences/homeowners.png",
  },
  {
    title: "Renters",
    body: "Plan a refresh you can picture — and reverse — with confidence.",
    image: "/images/features/audiences/renters.png",
  },
  {
    title: "Designers",
    body: "Explore ideas with clients before anyone commits to one.",
    // Figma reuses the Home "Property Professionals" photo here.
    image: "/images/audiences/property-professionals.png",
  },
];

export default function SpaceDecisions() {
  return (
    <Section tone="dark" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-white/70">Audiences</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-white sm:text-[44px] xl:text-[52px]">
            Built for different space decisions
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal as="article" key={a.title} delay={i * 70} className="overflow-hidden rounded-3xl border border-white/12 bg-white/3">
              <div className="relative aspect-[16/10]">
                <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 376px, 100vw" className="object-cover" />
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-navy/70 to-brand-navy/0" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-medium leading-7 tracking-[-0.0135em] text-white">
                  {a.title}
                </h3>
                <p className="pt-2 text-sm leading-6 text-brand-cream/65">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
