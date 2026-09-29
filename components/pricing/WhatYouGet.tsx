import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import FeatureGrid, { type FeatureGridItem } from "@/components/shared/FeatureGrid";
import Reveal from "@/components/ui/Reveal";

const features: FeatureGridItem[] = [
  {
    title: "Upload Your Spaces",
    body: "Photograph a room, façade or empty property and start there.",
    icon: "/icons/what-you-get/upload.svg",
  },
  {
    title: "Explore Multiple Directions",
    body: "Eight style languages, or describe the outcome yourself.",
    icon: "/icons/what-you-get/grid.svg",
  },
  {
    title: "Fast Iterations",
    body: "New directions in the time it takes to make a decision.",
    icon: "/icons/what-you-get/bolt.svg",
  },
  {
    title: "Save & Revisit Projects",
    body: "Every exploration stays where you left it.",
    icon: "/icons/what-you-get/floppy.svg",
  },
  {
    title: "Share With Others",
    body: "Send a link to partners, clients or buyers.",
    icon: "/icons/what-you-get/share.svg",
  },
];

export default function WhatYouGet() {
  return (
    <Section tone="offwhite" padded={false} className="border-y border-stone-200 py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">02 — What You Get</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Everything you need to decide well.
          </h2>
        </Reveal>
        <div className="mt-14">
          <FeatureGrid items={features} />
        </div>
      </PageContainer>
    </Section>
  );
}
