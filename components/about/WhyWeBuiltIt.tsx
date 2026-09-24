import clsx from "clsx";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import { IconChevron } from "@/components/ui/icons";

const beliefs = ["Idea", "Visualize", "Compare", "Refine", "Decide"];
const activeIndex = beliefs.length - 1;

export default function WhyWeBuiltIt() {
  return (
    <Section tone="dark">
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow light>Why We Built It</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Seeing a possibility changes the decision.
            </h2>
            <p className="mt-5 max-w-md text-white/70">
              Once you can see an idea, everything becomes easier — comparing, refining, deciding,
              and sharing. That&rsquo;s why VastuNord exists: to make visual exploration possible
              before commitment.
            </p>
            <p className="mt-6 font-semibold text-white">Make the idea visible.</p>
            <p className="font-semibold text-brand-orange">Then decide what comes next.</p>
          </div>

          <div className="rounded-2xl bg-brand-navy-light p-2">
            {beliefs.map((label, i) => (
              <div
                key={label}
                className={clsx(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium",
                  i === activeIndex ? "bg-white/10 text-white" : "text-white/50"
                )}
              >
                <span>
                  0{i + 1} {label.toUpperCase()}
                </span>
                <IconChevron
                  className={clsx("h-4 w-4", i === activeIndex ? "text-brand-orange" : "text-white/30")}
                />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
