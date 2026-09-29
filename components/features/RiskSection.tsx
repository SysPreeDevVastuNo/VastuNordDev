import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

function DownArrow() {
  return (
    <div className="flex justify-center py-2.5">
      <Image src="/icons/arrow-down-faint.svg" alt="" width={18} height={18} />
    </div>
  );
}

export default function RiskSection() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[608fr_480fr] lg:items-center lg:gap-20 [&>*]:min-w-0">
          <div>
            <p className="eyebrow text-stone-500">The Decision Problem</p>
            <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
              Why living room renovations feel risky
            </h2>
            <p className="max-w-[576px] pt-5 leading-7 text-stone-600">
              The living room is the room you live in most, and the hardest to picture changed.
              Swatches and mood boards leave a gap between what you approve and what you get — and
              that gap is where expensive second-guessing lives. You commit to a sofa, a palette,
              a whole direction on faith, then wait to find out if it was right.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-brand-offwhite p-6 lg:p-8">
            <div className="flex h-[54px] items-center justify-center rounded-xl border border-brand-teal/20 bg-white px-4">
              <p className="text-sm font-medium leading-5 text-brand-teal">Your room today</p>
            </div>
            <DownArrow />
            <div className="flex h-[54px] items-center justify-center rounded-xl border border-dashed border-brand-orange/50 bg-brand-orange/[0.06] px-4">
              <p className="text-sm font-medium leading-5 text-brand-orange">The visualization gap</p>
            </div>
            <DownArrow />
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex aspect-[4/3] flex-col justify-end rounded-xl border border-brand-teal/25 bg-white p-2"
                >
                  <div className="h-1.5 w-[57.5%] rounded-full bg-brand-teal/15" />
                  <div className="mt-1.5 h-1.5 w-[43%] rounded-full bg-brand-orange/40" />
                </div>
              ))}
            </div>
            <p className="pt-3 text-center text-xs font-medium uppercase leading-4 tracking-[0.18em] text-stone-500">
              Several possible rooms
            </p>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
