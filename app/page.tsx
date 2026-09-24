import Eyebrow from "@/components/ui/Eyebrow";
import Faq from "@/components/ui/Faq";
import Placeholder from "@/components/ui/Placeholder";
import MediaCard from "@/components/ui/MediaCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import ClosingCta from "@/components/shared/ClosingCta";
import Hero from "@/components/home/Hero";
import QuickTransformBar from "@/components/home/QuickTransformBar";
import WhatToTransform from "@/components/home/WhatToTransform";
import PossibilitiesShowcase from "@/components/home/PossibilitiesShowcase";
import HowItWorks from "@/components/home/HowItWorks";

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
      <Hero />
      <QuickTransformBar />

      {/* 01 — The Problem */}
      <Section padded={false} className="pt-12 pb-24">
        <PageContainer>
          <Eyebrow>01 — The Problem</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
            <span className="text-brand-teal">The hardest part isn&rsquo;t creating.</span>{" "}
            <span className="text-stone-300">It&rsquo;s seeing what&rsquo;s possible.</span>
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
            <div className="relative">
              <Placeholder label="Current" className="aspect-[4/3] w-full sm:aspect-auto sm:h-full" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
                Current
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Possibility 1", "Possibility 2", "Possibility 3", "Possibility 4"].map((label) => (
                <Placeholder key={label} label={label} className="aspect-square" />
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>

      <WhatToTransform />
      <PossibilitiesShowcase />
      <HowItWorks />

      {/* 05 — Who it's for */}
      <Section>
        <PageContainer>
          <SectionHeader
            eyebrow="05 — Who It's For"
            title="Built for people who need to see an idea before moving forward."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {audiences.map((a) => (
              <MediaCard key={a.title} label={a.title} aspect="aspect-[3/4]">
                <h3 className="font-semibold text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-white/70">{a.body}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-orange">Explore →</span>
              </MediaCard>
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
              <MediaCard key={t.name + t.role} label={t.role} aspect="aspect-[4/5]">
                <p className="text-sm text-white">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-white/60">{t.role}</p>
              </MediaCard>
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

      <ClosingCta
        eyebrow="07 — Get Started"
        title="Start with an idea. See where it takes you."
        description="Choose what you want to transform and turn your next idea into something you can see. Choose. Create. Explore. Decide."
        primaryLabel="Start Creating"
        primaryHref="/pricing"
        secondaryLabel="Explore What You Can Do"
        secondaryHref="/resources"
      />
    </>
  );
}
