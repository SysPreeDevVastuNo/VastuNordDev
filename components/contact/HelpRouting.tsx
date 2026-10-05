import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const routes = [
  {
    title: "Product Support",
    body: "Something not behaving as expected in a visualization or project.",
    sla: "Replies within one business day",
    icon: "support",
  },
  {
    title: "Sales",
    body: "Plans, teams, and volume for studios and agencies.",
    sla: "Replies within a few hours",
    icon: "sales",
  },
  {
    title: "Partnerships",
    body: "Integrations, platforms and property portals.",
    sla: "Replies within three days",
    icon: "partnerships",
  },
  {
    title: "Feedback",
    body: "Ideas, requests and things we should build next.",
    sla: "Always read by the team",
    icon: "feedback",
  },
];

export default function HelpRouting() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">02 — How Can We Help?</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
            Pick the right door.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 md:grid-cols-2">
          {routes.map((route, i) => (
            <Reveal key={route.title} delay={i * 55} className="bg-white p-8">
              <Image src={`/icons/help/${route.icon}.svg`} alt="" width={24} height={24} />
              <h3 className="pt-5 font-heading text-lg font-medium leading-7 tracking-[-0.0135em] text-brand-teal">
                {route.title}
              </h3>
              <p className="max-w-[384px] pt-3 text-sm leading-6 text-stone-600">{route.body}</p>
              <p className="pt-6 text-xs uppercase leading-4 tracking-[0.025em] text-stone-500">{route.sla}</p>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
