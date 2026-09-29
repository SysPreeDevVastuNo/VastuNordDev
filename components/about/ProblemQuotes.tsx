import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const quotes = [
  { n: "01", quote: "What if we changed this?", caption: "The idea that starts every project." },
  { n: "02", quote: "Would this actually work?", caption: "The doubt that stalls the decision." },
  { n: "03", quote: "What would it look like?", caption: "The question imagination can't answer." },
  { n: "04", quote: "Can we see it first?", caption: "The moment VastuNord steps in." },
];

export default function ProblemQuotes() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">The Problem</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            We all have ideas. Seeing them is the hard part.
          </h2>
          <p className="mt-5 max-w-[576px] leading-7 text-stone-600">
            You can picture it in your head — a new room, a better kitchen, a transformed space. But
            imagination breaks when decisions become real. And guessing is expensive when it involves
            your home, money, or time.
          </p>
        </Reveal>

        {/* Mobile: Figma runs the cards as a full-bleed sideways row (78vw each). */}
        <Reveal delay={80} className="-mx-6 mt-14 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {quotes.map((q) => (
            <article
              key={q.n}
              className="flex min-h-[220px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-3xl border border-stone-200 bg-brand-offwhite p-7 md:w-auto"
            >
              <p aria-hidden className="font-heading text-4xl font-semibold leading-10 text-stone-200">
                {q.n}
              </p>
              <div>
                <p className="max-w-[222px] font-heading text-2xl font-medium leading-8 text-brand-teal">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <p className="pt-3 text-sm leading-6 text-stone-500">{q.caption}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </PageContainer>
    </Section>
  );
}
