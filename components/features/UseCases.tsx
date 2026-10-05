import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import FeatureGrid, { type FeatureGridItem } from "@/components/shared/FeatureGrid";
import Reveal from "@/components/ui/Reveal";

const items: FeatureGridItem[] = [
  {
    title: "Renovation planning",
    body: "Test a full redirection of the room before you brief a contractor.",
    icon: "/icons/use-cases/paintbrush.svg",
  },
  {
    title: "Furniture selection",
    body: "See how a style reads in your actual space before you buy the sofa.",
    icon: "/icons/use-cases/armchair.svg",
  },
  {
    title: "Design exploration",
    body: "Wander between directions with no pressure to commit to any of them.",
    icon: "/icons/use-cases/compass.svg",
  },
  {
    title: "Concept testing",
    body: "Pressure-test a bold idea against a safe one, side by side.",
    icon: "/icons/use-cases/lightbulb.svg",
  },
  {
    title: "Space planning",
    body: "Understand how layout and palette change the feel of the whole room.",
    icon: "/icons/use-cases/ruler.svg",
  },
  {
    title: "Sharing with family",
    body: "Bring everyone the same picture so the decision is a shared one.",
    icon: "/icons/use-cases/chat.svg",
  },
];

export default function UseCases() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">Use Cases</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
            What can you use this for?
          </h2>
        </Reveal>
        <div className="mt-14">
          <FeatureGrid items={items} />
        </div>
      </PageContainer>
    </Section>
  );
}
