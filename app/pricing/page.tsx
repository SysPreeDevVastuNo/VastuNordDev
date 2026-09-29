import PricingHero from "@/components/pricing/PricingHero";
import PricingPlans from "@/components/pricing/PricingPlans";
import WhatYouGet from "@/components/pricing/WhatYouGet";
import WhyGoPro from "@/components/pricing/WhyGoPro";
import PricingFaq from "@/components/pricing/PricingFaq";
import ClosingCta from "@/components/shared/ClosingCta";

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingPlans />
      <WhatYouGet />
      <WhyGoPro />
      <PricingFaq />
      <ClosingCta
        eyebrow="05 — Ready to Start?"
        image="/images/cta/pricing.png"
        title="Your first visualization is free."
        description="See a possibility for your own space before deciding whether you need more."
        primaryLabel="Start Free"
        primaryHref="/contact"
        secondaryLabel="Contact Sales"
        secondaryHref="/contact"
      />
    </>
  );
}
