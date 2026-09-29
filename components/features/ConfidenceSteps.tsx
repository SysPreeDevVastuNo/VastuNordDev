import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const steps = [
  {
    n: "01",
    step: "Step 1",
    title: "Upload your space",
    body: "Snap a photo or pull one from your gallery. A single frame of the room, plot, or storefront is all it takes to begin.",
  },
  {
    n: "02",
    step: "Step 2",
    title: "Explore possibilities",
    body: "Choose a direction and see the space reimagined instantly — then keep going. Every style is another lens on the same room.",
  },
  {
    n: "03",
    step: "Step 3",
    title: "Compare alternatives",
    body: "Set directions side by side. Seeing choices next to each other is how uncertainty turns into a shortlist.",
  },
  {
    n: "04",
    step: "Step 4",
    title: "Move forward with confidence",
    body: "Share the direction that feels right with the people who matter, and commit knowing you have already seen it.",
  },
];

export default function ConfidenceSteps() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">How It Works</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            From uncertainty to confidence in minutes
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl border border-stone-200 bg-brand-offwhite p-7">
              <p aria-hidden className="font-heading text-[30px] font-semibold leading-9 text-brand-orange/90">
                {s.n}
              </p>
              <p className="pt-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.18em] text-stone-500">
                {s.step}
              </p>
              <h3 className="pt-4 font-heading font-medium leading-6 tracking-[-0.0135em] text-brand-teal">
                {s.title}
              </h3>
              <p className="pt-3 text-sm leading-6 text-stone-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </PageContainer>
    </Section>
  );
}
