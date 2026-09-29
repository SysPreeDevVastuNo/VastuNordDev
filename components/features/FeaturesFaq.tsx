import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import SplitFaq from "@/components/shared/SplitFaq";

const faqItems = [
  {
    q: "Do I need to know what style I want first?",
    a: "Not at all. The point is the opposite — start from your room and explore several directions before you have a favourite. Most people arrive unsure and leave with a clear shortlist.",
  },
  {
    q: "Will it use my actual room?",
    a: "Yes — every direction is generated from your own photo, so proportions and light stay recognisable.",
  },
  {
    q: "How many directions can I compare?",
    a: "As many as you like on Pro; the Free plan includes two style directions per space.",
  },
  {
    q: "Can I share the results with my family or designer?",
    a: "Yes, every exploration can be shared with a link so others can see exactly what you're seeing.",
  },
  {
    q: "Is this only for full renovations?",
    a: "No — it works just as well for a single piece of furniture or a small styling change.",
  },
  {
    q: "How long does it take to see a result?",
    a: "New directions typically arrive in the time it takes to make a decision, not days.",
  },
  {
    q: "What if my room is small or awkwardly shaped?",
    a: "VastuNord works from your real photo, so it respects the room's actual layout and constraints.",
  },
  {
    q: "Do I have to sign up to try it?",
    a: "You can start exploring on the Free plan without committing to anything.",
  },
];

export default function FeaturesFaq() {
  return (
    <Section tone="offwhite" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <SplitFaq
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything worth knowing before you visualize your space."
          items={faqItems}
          variant="plus"
        />
      </PageContainer>
    </Section>
  );
}
