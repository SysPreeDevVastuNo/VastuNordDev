import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StepShowcase, { type ShowcaseStep } from "@/components/shared/StepShowcase";

// Figma reuses the Home "Choose" artwork; the other steps have no image yet.
const steps: ShowcaseStep[] = [
  {
    n: "01",
    label: "Choose",
    title: "Start with what you want to transform.",
    icon: "/icons/step-choose.svg",
    cardIcon: "/icons/step-choose-sm.svg",
    image: "/images/how-it-works/choose.png",
  },
  { n: "02", label: "Upload", title: "Bring your space or image.", icon: "/icons/step-upload.svg" },
  { n: "03", label: "Explore", title: "Generate and compare variations.", icon: "/icons/step-explore.svg" },
  { n: "04", label: "Decide", title: "Pick what feels right and move forward.", icon: "/icons/step-decide.svg" },
];

export default function AboutSteps() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">How It Works</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            From idea to visual in four steps.
          </h2>
        </div>

        <div className="mt-14">
          <StepShowcase steps={steps} tone="light" />
        </div>

        <p className="mt-8 text-sm leading-5 text-stone-500">From one idea, explore multiple possibilities.</p>
      </PageContainer>
    </Section>
  );
}
