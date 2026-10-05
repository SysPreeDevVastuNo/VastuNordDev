import FeaturesHero from "@/components/features/FeaturesHero";
import RiskSection from "@/components/features/RiskSection";
import PossibilityGallery from "@/components/features/PossibilityGallery";
import UseCases from "@/components/features/UseCases";
import WhyVastuNord from "@/components/features/WhyVastuNord";
import ConfidenceSteps from "@/components/features/ConfidenceSteps";
import SpaceDecisions from "@/components/features/SpaceDecisions";
import PossibilityGrid from "@/components/features/PossibilityGrid";
import FeaturesFaq from "@/components/features/FeaturesFaq";
import RelatedSolutions from "@/components/features/RelatedSolutions";
import ClosingCta from "@/components/shared/ClosingCta";

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />
      <RiskSection />
      <PossibilityGallery />
      <UseCases />
      <WhyVastuNord />
      <ConfidenceSteps />
      <SpaceDecisions />
      <PossibilityGrid />
      <FeaturesFaq />
      <RelatedSolutions />
      <ClosingCta
        eyebrow="Get Started"
        image="/images/cta/features.jpg"
        title="Start visualizing your possibilities"
        description="Explore multiple directions before making expensive decisions — and move forward knowing you have already seen the result."
        primaryLabel="Upload Your Space"
        primaryHref="#demo"
        secondaryLabel="Sign Up Free"
        secondaryHref="/pricing"
      />
    </>
  );
}
