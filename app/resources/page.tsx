import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourceFilters from "@/components/resources/ResourceFilters";
import FeaturedArticles from "@/components/resources/FeaturedArticles";
import TopicGrid from "@/components/resources/TopicGrid";
import Newsletter from "@/components/resources/Newsletter";
import ClosingCta from "@/components/shared/ClosingCta";

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHero />
      <ResourceFilters />
      <FeaturedArticles />
      <TopicGrid />
      <Newsletter />
      <ClosingCta
        eyebrow="05 — Keep Exploring"
        image="/images/cta/living-room.jpg"
        title="Reading is useful. Seeing is decisive."
        description="Put the ideas to work on your own space in a few minutes."
        primaryLabel="Explore Solutions"
        primaryHref="/features"
        secondaryLabel="Start Visualizing"
        secondaryHref="/pricing"
      />
    </>
  );
}
