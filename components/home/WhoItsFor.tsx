import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const audiences = [
  {
    title: "Homeowners",
    body: "Reimagine rooms, furniture, materials, gardens and more before making changes to your home.",
    image: "/images/audiences/homeowners.png",
  },
  {
    title: "Property Professionals",
    body: "Stage, enhance and transform property visuals to help buyers see more potential.",
    image: "/images/audiences/property-professionals.png",
  },
  {
    title: "Designers & Architects",
    body: "Explore concepts, refine details and communicate visual directions before detailed workflows.",
    image: "/images/audiences/designers-architects.png",
  },
];

export default function WhoItsFor() {
  return (
    <Section tone="cream" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">05 — Who It&apos;s For</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Built for people who need to see an idea before moving forward.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 70}>
            <Link
              href="/features"
              className="group relative block h-[322px] overflow-hidden rounded-3xl border border-stone-200"
            >
              <Image
                src={a.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 376px, 100vw"
                className="object-cover transition-transform group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/0" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-heading text-lg font-medium leading-7 tracking-[-0.0135em] text-white">
                  {a.title}
                </h3>
                <p className="pt-2 text-sm leading-6 text-white/75">{a.body}</p>
                <p className="flex h-[41px] items-start gap-1.5 pt-5 text-sm font-semibold leading-5 text-[#ff8256]">
                  Explore
                  <Image
                    src="/icons/arrow-right-coral.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="mt-[3px] transition-transform group-hover:translate-x-0.5"
                  />
                </p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
