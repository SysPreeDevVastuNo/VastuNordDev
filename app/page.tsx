import Image from "next/image";
import Button from "@/components/ui/Button";
import SplitFaq from "@/components/shared/SplitFaq";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import ClosingCta from "@/components/shared/ClosingCta";
import Hero from "@/components/home/Hero";
import QuickTransformBar from "@/components/home/QuickTransformBar";
import WhatToTransform from "@/components/home/WhatToTransform";
import PossibilitiesShowcase from "@/components/home/PossibilitiesShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import TheProblem from "@/components/home/TheProblem";
import WhoItsFor from "@/components/home/WhoItsFor";
import SocialProof from "@/components/home/SocialProof";

const faqItems = [
  {
    q: "Do I need design experience to use VastuNord?",
    a: "No. Choose what you want to transform, bring an image, and VastuNord guides the workflow. Professionals can go deeper with references, prompts and side-by-side comparison.",
  },
  {
    q: "What can I transform?",
    a: "Interiors, exteriors, gardens and pools, individual details like furniture and materials, and everyday images that just need cleanup or enhancement.",
  },
  {
    q: "How close is a result to what I can actually build?",
    a: "VastuNord works from your real image, so proportions, structure and light stay recognisable. It is a tool for seeing possibilities and deciding — not a construction drawing.",
  },
];

export default function Home() {
  return (
    <>
      <Hero>
        <QuickTransformBar />
      </Hero>

      <TheProblem />
      <WhatToTransform />
      <PossibilitiesShowcase />
      <HowItWorks />

      <WhoItsFor />

      <SocialProof />

      {/* FAQ */}
      <Section padded={false} className="border-t border-stone-200 py-20 lg:py-24">
        <PageContainer>
          <SplitFaq
            eyebrow="Questions"
            title="Before you start."
            items={faqItems}
            action={
              <Button href="/contact" variant="outline">
                <Image src="/icons/eye.svg" alt="" width={16} height={16} />
                Ask us anything
              </Button>
            }
          />
        </PageContainer>
      </Section>

      <ClosingCta
        eyebrow="07 — Get Started"
        title="Start with an idea. See where it takes you."
        description="Choose what you want to transform and turn your next idea into something you can see. Choose. Create. Explore. Decide."
        image="/images/cta/home.jpg"
        primaryLabel="Start Creating"
        primaryHref="/pricing"
        secondaryLabel="Explore What You Can Do"
        secondaryHref="/resources"
      />
    </>
  );
}
