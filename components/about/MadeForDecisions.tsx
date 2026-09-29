import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

// Figma reuses the Home "Who It's For" photos here.
const audiences = [
  {
    title: "Homeowners",
    icon: "/icons/badge-home.svg",
    quote: "Will this actually work in my home?",
    body: "Visualize renovations, furniture, and spaces before deciding.",
    image: "/images/audiences/homeowners.png",
  },
  {
    title: "Property Professionals",
    icon: "/icons/badge-building.svg",
    quote: "Help others see potential.",
    body: "Transform empty or outdated spaces into compelling visuals.",
    image: "/images/audiences/property-professionals.png",
  },
  {
    title: "Designers & Architects",
    icon: "/icons/badge-compass.svg",
    quote: "Explore before committing.",
    body: "Test ideas, directions, and concepts visually.",
    image: "/images/audiences/designers-architects.png",
  },
];

export default function MadeForDecisions() {
  return (
    <Section tone="offwhite" padded={false} className="border-y border-stone-200 py-20 lg:py-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">Made for Real Decisions</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Different people. Same need: see it before moving forward.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className="relative h-[418px] overflow-hidden rounded-3xl border border-stone-200">
              <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 376px, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/0" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5">
                  <Image src={a.icon} alt="" width={14} height={14} />
                  <span className="eyebrow text-white/85">{a.title}</span>
                </span>
                <h3 className="pt-4 font-heading text-xl font-medium leading-7 tracking-[-0.0135em] text-white">
                  {a.quote}
                </h3>
                <p className="max-w-[320px] pt-2 text-sm leading-6 text-white/75">{a.body}</p>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
