import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import Placeholder from "@/components/ui/Placeholder";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import TransformationShowcase from "@/components/home/TransformationShowcase";
import WhatToTransform from "@/components/home/WhatToTransform";

const steps = [
  {
    n: "01",
    label: "CHOOSE",
    title: "Start with what you want to transform.",
    body: "Pick the workflow that matches your goal.",
  },
  {
    n: "02",
    label: "CREATE",
    title: "Bring your image and set the direction.",
    body: "Upload an image, choose references, add a prompt, or use the controls your task needs.",
  },
  {
    n: "03",
    label: "EXPLORE",
    title: "Generate, refine and compare possibilities.",
    body: "Try different directions, adjust the result, save promising versions and keep exploring.",
  },
  {
    n: "04",
    label: "DECIDE",
    title: "Choose what works and take it forward.",
    body: "Export, share, present or use your chosen direction to move ahead.",
  },
];

const audiences = [
  {
    title: "Homeowners",
    body: "Reimagine rooms, furniture, materials, gardens and more before making changes to your home.",
  },
  {
    title: "Property Professionals",
    body: "Stage, enhance and transform property visuals to help buyers see more potential.",
  },
  {
    title: "Designers & Architects",
    body: "Explore concepts, refine details and communicate visual directions before detailed workflows.",
  },
];

const stats = [
  { value: "40K+", label: "Spaces Transformed" },
  { value: "210K+", label: "Designs Explored" },
  { value: "15K+", label: "Images Enhanced" },
  { value: "28K+", label: "Users Creating" },
];

const testimonials = [
  {
    quote: "I could finally see how the room would feel before committing to the renovation.",
    name: "Customer Name",
    role: "Homeowner",
  },
  {
    quote: "We can explore directions with clients before spending hours refining a concept.",
    name: "Customer Name",
    role: "Interior Designer",
  },
  {
    quote: "We can show buyers what an empty property could become.",
    name: "Customer Name",
    role: "Property Professional",
  },
];

const faqItems = [
  {
    q: "Do I need design experience to use VastuNord?",
    a: "No. Choose what you want to transform, bring an image, and VastuNord guides the workflow. Professionals can go deeper with references, prompts and side-by-side comparison.",
  },
  {
    q: "What can I transform?",
    a: "Interiors, exteriors, gardens and pools, individual details like furniture and materials, and everyday images that just need cleanup or enhancement.",
  },
  {
    q: "How close is a result to what I can actually build?",
    a: "VastuNord works from your real image, so proportions, structure and light stay recognisable. It is a tool for seeing possibilities and deciding — not a construction drawing.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" padded={false}>
        <PageContainer className="pt-20 pb-16 text-center">
          <Eyebrow light>Visual Design &amp; Transformation</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            See What&rsquo;s Possible.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-white/70">
            Turn your ideas into visuals. Reimagine spaces, transform details, and explore
            possibilities before deciding what comes next.
          </p>
          <div className="cta-group mt-8 justify-center">
            <Button href="/pricing">Start Creating</Button>
            <Button href="#how-it-works" variant="ghost">
              See How It Works
            </Button>
          </div>

          <div className="mx-auto mt-12 flex max-w-xl items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/50">
            {["Choose", "Create", "Explore", "Decide"].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </PageContainer>

        <TransformationShowcase />
      </Section>

      <WhatToTransform />

      {/* 01 — The Problem */}
      <Section>
        <PageContainer>
          <Eyebrow>01 — The Problem</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-brand-teal sm:text-4xl">
            The hardest part isn&rsquo;t creating. It&rsquo;s seeing what&rsquo;s possible.
          </h2>
          <p className="mt-5 max-w-xl text-stone-600">
            Design ideas are difficult to explore when they only exist in your head. Whether
            you&rsquo;re transforming a space, changing a detail, or refining an image, VastuNord
            helps you see the possibilities before moving forward.
          </p>
          <p className="mt-3 max-w-xl font-medium text-stone-900">
            Start with what you have. Explore what it could become.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Placeholder label="Current" className="aspect-[4/3]" />
            <Placeholder label="Possibilities" className="aspect-[4/3]" />
          </div>
        </PageContainer>
      </Section>

      {/* 04 — How it works */}
      <Section id="how-it-works" tone="cream">
        <PageContainer>
          <SectionHeader
            eyebrow="04 — How It Works"
            title="From idea to visual in four steps."
            description="VastuNord adapts the workflow to what you're trying to create, so you can move from an idea to something you can actually see."
          />

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.n}>
                <span className="text-xs font-semibold tracking-widest text-brand-orange">
                  {step.n} · {step.label}
                </span>
                <h3 className="mt-3 font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{step.body}</p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* 05 — Who it's for */}
      <Section>
        <PageContainer>
          <SectionHeader
            eyebrow="05 — Who It's For"
            title="Built for people who need to see an idea before moving forward."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {audiences.map((a) => (
              <Card key={a.title} variant="outline">
                <h3 className="font-semibold text-stone-900">{a.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{a.body}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-orange">
                  Explore →
                </span>
              </Card>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* 06 — Social proof */}
      <Section tone="dark">
        <PageContainer>
          <SectionHeader
            eyebrow="06 — Social Proof"
            title="Built for ideas worth seeing."
            description="From everyday home changes to professional design decisions, VastuNord helps people explore possibilities before moving forward."
            tone="dark"
          />

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name + t.role} variant="glass">
                <p className="text-sm text-white/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-white/50">{t.role}</p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* FAQ */}
      <Section>
        <PageContainer size="narrow">
          <SectionHeader eyebrow="Questions" title="Before you start." constrain={false} />
          <div className="mt-10">
            <Faq items={faqItems} />
          </div>
          <p className="mt-6 text-sm font-semibold text-brand-orange">Ask us anything →</p>
        </PageContainer>
      </Section>

      {/* Get started */}
      <Section tone="cream" className="text-center">
        <div className="mx-auto max-w-2xl px-6">
          <SectionHeader
            eyebrow="07 — Get Started"
            title="Start with an idea. See where it takes you."
            description="Choose what you want to transform and turn your next idea into something you can see. Choose. Create. Explore. Decide."
            constrain={false}
          />
          <div className="cta-group mt-8 justify-center">
            <Button href="/pricing">Start Creating</Button>
            <Button href="/resources" variant="secondary" className="border border-stone-300">
              Explore What You Can Do
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
