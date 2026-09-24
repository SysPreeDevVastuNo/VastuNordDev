import MediaCard from "@/components/ui/MediaCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import ProcessSteps, { type ProcessStep } from "@/components/shared/ProcessSteps";
import ClosingCta from "@/components/shared/ClosingCta";
import AboutHero from "@/components/about/AboutHero";
import ProblemQuotes from "@/components/about/ProblemQuotes";
import WhyWeBuiltIt from "@/components/about/WhyWeBuiltIt";
import OurBelief from "@/components/about/OurBelief";

const steps: ProcessStep[] = [
  {
    n: "01",
    label: "CHOOSE",
    title: "Start with what you want to transform.",
    body: "Pick the workflow that matches your goal.",
  },
  {
    n: "02",
    label: "UPLOAD",
    title: "Bring your space or image.",
    body: "Upload a photo of the room, garden or detail you want to explore.",
  },
  {
    n: "03",
    label: "EXPLORE",
    title: "Generate and compare variations.",
    body: "See multiple directions from the same starting image, side by side.",
  },
  {
    n: "04",
    label: "DECIDE",
    title: "Pick what feels right and move forward.",
    body: "Save, share or export the direction that works.",
  },
];

const audiences = [
  {
    title: "Homeowners",
    quote: "Will this actually work in my home?",
    body: "Visualize renovations, furniture, and spaces before deciding.",
  },
  {
    title: "Property Professionals",
    quote: "Help others see potential.",
    body: "Transform empty or outdated spaces into compelling visuals.",
  },
  {
    title: "Designers & Architects",
    quote: "Explore before committing.",
    body: "Test ideas, directions, and concepts visually.",
  },
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ProblemQuotes />
      <WhyWeBuiltIt />

      {/* How It Works */}
      <Section>
        <PageContainer>
          <SectionHeader eyebrow="How It Works" title="From idea to visual in four steps." />
          <div className="mt-12">
            <ProcessSteps steps={steps} />
          </div>
          <p className="mt-6 text-center text-sm text-stone-500">
            From one idea, explore multiple possibilities.
          </p>
        </PageContainer>
      </Section>

      {/* Made for real decisions */}
      <Section tone="cream">
        <PageContainer>
          <SectionHeader
            eyebrow="Made for Real Decisions"
            title="Different people. Same need: see it before moving forward."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {audiences.map((a) => (
              <MediaCard key={a.title} label={a.title} aspect="aspect-[3/4]">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  {a.title}
                </span>
                <p className="mt-2 font-semibold text-white">{a.quote}</p>
                <p className="mt-1 text-sm text-white/70">{a.body}</p>
              </MediaCard>
            ))}
          </div>
        </PageContainer>
      </Section>

      <OurBelief />

      <ClosingCta
        eyebrow="Get Started"
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
