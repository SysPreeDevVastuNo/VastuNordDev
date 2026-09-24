import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import ProcessSteps, { type ProcessStep } from "@/components/shared/ProcessSteps";

const steps: ProcessStep[] = [
  {
    n: "01",
    label: "CHOOSE",
    title: "Start with what you want to transform.",
    body: "Pick the workflow that matches your goal.",
  },
  {
    n: "02",
    label: "CREATE",
    title: "Bring your image and set the direction.",
    body: "Upload an image, choose references, add a prompt, or use the controls your task needs.",
  },
  {
    n: "03",
    label: "EXPLORE",
    title: "Generate, refine and compare possibilities.",
    body: "Try different directions, adjust the result, save promising versions and keep exploring.",
  },
  {
    n: "04",
    label: "DECIDE",
    title: "Choose what works and take it forward.",
    body: "Export, share, present or use your chosen direction to move ahead.",
  },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" tone="cream">
      <PageContainer>
        <SectionHeader
          eyebrow="04 — How It Works"
          title="From idea to visual in four steps."
          description="VastuNord adapts the workflow to what you're trying to create, so you can move from an idea to something you can actually see."
        />
        <div className="mt-12">
          <ProcessSteps steps={steps} />
        </div>
      </PageContainer>
    </Section>
  );
}
