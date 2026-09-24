import Eyebrow from "@/components/ui/Eyebrow";
import Placeholder from "@/components/ui/Placeholder";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

export default function OurBelief() {
  return (
    <Section>
      <PageContainer size="narrow" className="text-center">
        <Eyebrow>Our Belief</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-xl text-3xl font-semibold text-brand-teal sm:text-4xl">
          Design shouldn&rsquo;t feel like a leap of faith.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone-600">
          Too many decisions are made without seeing the outcome. VastuNord closes the gap between
          imagining something and actually seeing it.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-2xl">
          <Placeholder label="Our Belief" className="aspect-[16/9] w-full" />
          <div className="absolute inset-0 bg-brand-navy/50" />
          <p className="absolute inset-0 flex items-center justify-center px-10 text-center text-lg font-medium text-white">
            A world where you can see the possibility before you commit to it.
          </p>
        </div>
      </PageContainer>
    </Section>
  );
}
