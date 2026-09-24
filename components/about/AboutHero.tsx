import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Placeholder from "@/components/ui/Placeholder";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

export default function AboutHero() {
  return (
    <Section tone="dark" padded={false}>
      <PageContainer className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <Eyebrow light>Why VastuNord</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            You shouldn&rsquo;t have to imagine it all in your head.
          </h1>
          <p className="mt-6 max-w-md text-white/70">
            Whether you&rsquo;re changing a room, planning a garden, or exploring a new idea — the
            hardest part is knowing what it will actually look like. VastuNord helps you see it
            before you commit.
          </p>
          <div className="cta-group mt-8">
            <Button href="/pricing">Start Creating</Button>
            <Button href="#examples" variant="ghost">
              See Examples
            </Button>
          </div>
        </div>

        <div className="relative">
          <Placeholder label="Interior Transformation" className="aspect-[4/5] w-full" />
          <div className="absolute inset-x-4 bottom-4 rounded-xl bg-brand-navy/85 px-4 py-3 backdrop-blur">
            <span className="block text-xs font-semibold uppercase tracking-widest text-white/50">
              Interior Transformation
            </span>
            <p className="text-sm font-medium text-white">Reimagine interior spaces instantly.</p>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
