import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const items = [
  {
    title: "Explore multiple directions",
    body: "One photo, every style — never just a single answer handed back to you.",
    icon: "/icons/why/stack.svg",
  },
  {
    title: "Reduce decision uncertainty",
    body: 'Replace "I think it will work" with "I have seen it, and it does".',
    icon: "/icons/why/shield-check.svg",
  },
  {
    title: "Avoid costly mistakes",
    body: "Catch the direction you would have regretted before any money moves.",
    icon: "/icons/why/coins.svg",
  },
  {
    title: "Move faster",
    body: "Go from unsure to a confident shortlist in a single sitting.",
    icon: "/icons/why/trend-up.svg",
  },
  {
    title: "Communicate ideas clearly",
    body: "Show, rather than describe, so everyone is deciding on the same thing.",
    icon: "/icons/why/chat.svg",
  },
  {
    title: "Design around your room",
    body: "Every direction is your space reimagined, not a stock catalogue photo.",
    icon: "/icons/why/eye.svg",
  },
];

export default function WhyVastuNord() {
  return (
    <Section tone="cream" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">Why VastuNord</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Why use VastuNord?
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, body, icon }) => (
            <div key={title} className="rounded-3xl border border-stone-200 bg-white p-7">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-orange/10">
                <Image src={icon} alt="" width={22} height={22} />
              </span>
              <h3 className="pt-5 font-heading font-medium leading-6 tracking-[-0.0135em] text-brand-teal">
                {title}
              </h3>
              <p className="pt-3 text-sm leading-6 text-stone-600">{body}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
