import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import SplitFaq from "@/components/shared/SplitFaq";

const faqItems = [
  {
    q: "How quickly will I receive a reply?",
    a: "Product support replies within one business day; sales enquiries usually the same day.",
  },
  {
    q: "How do I report a bug?",
    a: "Send us the project link and a short description of what you expected. Screenshots of the space help most.",
  },
  {
    q: "Can I request new features?",
    a: "Yes — choose Feedback in the form below. Requests are reviewed weekly alongside the roadmap.",
  },
  {
    q: "Where can I find tutorials?",
    a: "The Resources centre holds step-by-step tutorials, guides and case studies.",
  },
];

export default function ContactFaq() {
  return (
    <Section padded={false} className="py-20 lg:py-24">
      <PageContainer>
        <SplitFaq eyebrow="04 — FAQ" title="Quick answers." items={faqItems} />
      </PageContainer>
    </Section>
  );
}
