import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

// Figma reuses the Possibility Explorer photos for this gallery.
const directions = [
  { badge: "Direction A", label: "Scandinavian", caption: "Pale woods, soft light, calm restraint.", image: "/images/features/directions/scandinavian.jpg" },
  { badge: "Direction B", label: "Japandi", caption: "Warm minimalism with natural texture.", image: "/images/features/directions/japandi.jpg" },
  { badge: "Direction C", label: "Modern Luxury", caption: "Deep tones, rich materials, quiet drama.", image: "/images/features/directions/modern-luxury.png" },
  { badge: "Direction D", label: "Minimalist", caption: "Clean lines and generous negative space.", image: "/images/features/directions/minimalist.png" },
];

const badge =
  "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.025em]";

export default function PossibilityGrid() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">Transformation Gallery</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
            See what&apos;s possible
          </h2>
          <p className="mt-5 max-w-[576px] text-base leading-7 text-stone-600">
            Never one final image — always a set of directions, because the point is to compare, not
            to accept.
          </p>
        </Reveal>

        {/* The "Before" photo stays pinned while the directions scroll past it. */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start [&>*]:min-w-0">
          <Reveal as="figure" className="overflow-hidden rounded-3xl border border-stone-200 lg:sticky lg:top-24">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/features/hero-background.png"
                alt="The space before"
                fill
                sizes="(min-width: 1024px) 352px, 100vw"
                className="object-cover"
              />
              <span className={`${badge} bg-white/85 text-stone-900`}>Before</span>
            </div>
            <figcaption className="px-5 py-4 text-sm leading-6 text-stone-600">
              One living room — and every direction it could take.
            </figcaption>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {directions.map((d, i) => (
              <Reveal as="figure" key={d.label} delay={i * 50} className="group overflow-hidden rounded-3xl border border-stone-200">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={d.image}
                    alt={`Living Room in a ${d.label} direction`}
                    fill
                    sizes="(min-width: 1024px) 388px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className={`${badge} bg-brand-teal/85 text-white`}>{d.badge}</span>
                </div>
                <figcaption className="px-5 py-4">
                  <p className="font-heading text-sm font-medium leading-5 text-brand-teal">{d.label}</p>
                  <p className="pt-1 text-sm leading-6 text-stone-600">{d.caption}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
