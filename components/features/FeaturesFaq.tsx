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
    a: "Yes. Every direction is your uploaded space reimagined, keeping the geometry and light of the real room so what you see is grounded in what you have.",
  },
  {
    q: "How many directions can I compare?",
    a: "You can explore every style on the page and set them side by side. Comparing possibilities — not generating one image — is the whole idea.",
  },
  {
    q: "Can I share the results with my family or designer?",
    a: "Yes. A shared picture is often what turns a stalled decision into an agreed one, so results are made to be sent and discussed.",
  },
  {
    q: "Is this only for full renovations?",
    a: "No. It works just as well for a weekend refresh, a single new sofa, or a complete redirection of the room.",
  },
  {
    q: "How long does it take to see a result?",
    a: "Minutes. Upload a photo, choose a direction, and the reimagined room appears — then keep exploring from there",
  },
  {
    q: "What if my room is small or awkwardly shaped?",
    a: "Those are the rooms this helps most. Seeing an awkward space handled well removes the biggest source of hesitation.",
  },
  {
    q: "Do I have to sign up to try it?",
    a: "You can visualize your first direction and explore the possibilities on this page. Signing up free unlocks the full set of directions to compare.",
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
