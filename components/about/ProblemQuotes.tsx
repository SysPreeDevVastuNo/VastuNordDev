import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const quotes = [
  { n: "01", quote: "What if we changed this?", caption: "The idea that starts every project." },
  { n: "02", quote: "Would this actually work?", caption: "The doubt that stalls the decision." },
  { n: "03", quote: "What would it look like?", caption: "The question imagination can't answer." },
  { n: "04", quote: "Can we see it first?", caption: "The moment VastuNord steps in." },
];

export default function ProblemQuotes() {
  return (
    <Section>
      <PageContainer>
        <Eyebrow>The Problem</Eyebrow>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold text-brand-teal sm:text-4xl">
          We all have ideas. Seeing them is the hard part.
        </h2>
        <p className="mt-5 max-w-xl text-stone-600">
          You can picture it in your head — a new room, a better kitchen, a transformed space. But
          imagination breaks when decisions become real. And guessing is expensive when it
          involves your home, money, or time.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((q) => (
            <div key={q.n} className="rounded-2xl bg-stone-50 p-6">
              <span className="text-2xl font-semibold text-stone-200">{q.n}</span>
              <p className="mt-3 font-semibold text-stone-900">&ldquo;{q.quote}&rdquo;</p>
              <p className="mt-2 text-sm text-stone-500">{q.caption}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
