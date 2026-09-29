import ClosingCta from "@/components/shared/ClosingCta";
import AboutHero from "@/components/about/AboutHero";
import ProblemQuotes from "@/components/about/ProblemQuotes";
import WhyWeBuiltIt from "@/components/about/WhyWeBuiltIt";
import OurBelief from "@/components/about/OurBelief";
import AboutSteps from "@/components/about/AboutSteps";
import MadeForDecisions from "@/components/about/MadeForDecisions";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ProblemQuotes />
      <WhyWeBuiltIt />

      <AboutSteps />

      <MadeForDecisions />

      <OurBelief />

      <ClosingCta
        eyebrow="Get Started"
        image="/images/audiences/property-professionals.png"
        title="Have an idea? Let's make it visible."
        description="Start with what you want to change. Explore what it could become. Choose. Create. Explore. Decide."
        primaryLabel="Start Creating"
        primaryHref="/pricing"
        secondaryLabel="Explore Examples"
        secondaryHref="/resources"
      />
    </>
  );
}
