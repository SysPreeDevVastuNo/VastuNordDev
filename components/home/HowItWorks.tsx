import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import StepShowcase, { type ShowcaseStep } from "@/components/shared/StepShowcase";
import Reveal from "@/components/ui/Reveal";

const steps: ShowcaseStep[] = [
  {
    n: "01",
    label: "Choose",
    title: "Start with what you want to transform.",
    body: "Pick the workflow that matches your goal.",
    icon: "/icons/step-choose.svg",
    cardIcon: "/icons/step-choose-sm.svg",
    image: "/images/how-it-works/choose.png",
  },
  {
    n: "02",
    label: "Create",
    title: "Bring your image and set the direction.",
    body: "Upload an image, choose references, add a prompt, or use the controls your task needs.",
    icon: "/icons/step-create.svg",
    image: "/images/how-it-works/create.jpg",
  },
  {
    n: "03",
    label: "Explore",
    title: "Generate, refine and compare possibilities.",
    body: "Try different directions, adjust the result, save promising versions and keep exploring.",
    icon: "/icons/step-explore.svg",
    image: "/images/how-it-works/explore.jpg",
  },
  {
    n: "04",
    label: "Decide",
    title: "Choose what works and take it forward.",
    body: "Export, share, present or use your chosen direction to move ahead.",
    icon: "/icons/step-decide.svg",
    image: "/images/how-it-works/decide.jpg",
  },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" tone="dark" padded={false} className="relative py-20 lg:py-28">
      <div aria-hidden className="accent-rule" />
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-white/70">04 — How It Works</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-white sm:text-[44px] xl:text-[52px]">
            From idea to visual in four steps.
          </h2>
          <p className="mt-5 max-w-[576px] leading-7 text-brand-cream/70">
            VastuNord adapts the workflow to what you&apos;re trying to create, so you can move from an
            idea to something you can actually see.
          </p>
        </Reveal>

        <div className="mt-14">
          <StepShowcase steps={steps} tone="dark" />
        </div>
      </PageContainer>
    </Section>
  );
}
