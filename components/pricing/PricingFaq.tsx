import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import SplitFaq from "@/components/shared/SplitFaq";

const faqItems = [
  {
    q: "Can I try VastuNord for free?",
    a: "Yes. The Free plan includes one visualization per space so you can see the quality on your own room before paying anything.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — Pro is month to month, and cancelling keeps your projects readable.",
  },
  {
    q: "Do credits expire?",
    a: "Monthly Pro credits refresh each billing period. Annual plans release credits monthly and unused credits roll over within the year.",
  },
  {
    q: "Is this suitable for professionals?",
    a: "Designers, architects, contractors and agents use Pro for early-stage alignment before committing to production renders.",
  },
  {
    q: "What spaces can I visualize?",
    a: "Interiors, exteriors, single rooms, whole apartments, façades and empty properties for staging.",
  },
];

export default function PricingFaq() {
  return (
    <Section padded={false} className="py-20 lg:py-24">
      <PageContainer>
        <SplitFaq eyebrow="04 — FAQ" title="Pricing, answered." items={faqItems} />
      </PageContainer>
    </Section>
  );
}
