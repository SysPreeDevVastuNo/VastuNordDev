import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const topics = [
  { label: "Home Renovation", image: "home-renovation" },
  { label: "Interior Styles", image: "interior-styles" },
  { label: "Property Marketing", image: "property-marketing" },
  { label: "Design Inspiration", image: "design-inspiration" },
  { label: "Product Tutorials", image: "product-tutorials" },
  { label: "Case Studies", image: "case-studies" },
  { label: "Buying Guides", image: "buying-guides" },
  { label: "Furniture Visualization", image: "furniture-visualization" },
];

export default function TopicGrid() {
  return (
    <Section tone="offwhite" padded={false} className="border-y border-stone-200 py-20 lg:py-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">03 — Browse by Topic</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Find the decision you&apos;re facing.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <button
              key={topic.label}
              type="button"
              className="group relative h-40 overflow-hidden rounded-3xl border border-stone-200 text-left"
            >
              <Image
                src={`/images/resources/topics/${topic.image}.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/25 to-brand-navy/0"
              />
              <span className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                <span className="font-heading text-sm font-medium leading-5 text-white">{topic.label}</span>
                <Image src="/icons/arrow-up-right-orange-sm.svg" alt="" width={16} height={16} />
              </span>
            </button>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
