import Image from "next/image";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";
import type { Article } from "@/components/resources/articles";

/** The filtered library: first match as the large card, the rest stacked beside it. */
export default function FeaturedArticles({ items, onClear }: { items: Article[]; onClear: () => void }) {
  const [featured, ...rest] = items;

  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <Reveal className="max-w-[768px]">
          <p className="eyebrow text-stone-500">02 — Featured</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal">
            Start with these.
          </h2>
        </Reveal>

        {!featured ? (
          <Reveal className="mt-14 rounded-3xl border border-dashed border-stone-200 bg-brand-offwhite px-8 py-16 text-center">
            <p className="font-heading text-lg font-medium text-brand-teal">Nothing matches that yet.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">
              Try a broader search, or clear the filter to see every guide in the library.
            </p>
            <button
              type="button"
              onClick={onClear}
              className="mt-7 inline-flex items-center justify-center rounded-2xl border border-stone-200 px-5 py-3 text-sm font-semibold leading-5 text-brand-teal transition-[transform,background-color,border-color] hover:border-brand-teal/40 hover:bg-white active:translate-y-px"
            >
              Clear filters
            </button>
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[614fr_534fr] lg:items-start [&>*]:min-w-0">
            {/* Keyed by title so a new featured article fades in rather than swapping in place. */}
            <Reveal key={featured.title} className="lg:h-[686px]">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 transition-transform hover:-translate-y-1">
                <div className="relative h-72 shrink-0 overflow-hidden lg:h-96">
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 614px, 100vw"
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex-1 bg-brand-offwhite p-8">
                  <div className="flex items-center gap-3 text-xs leading-4 text-stone-500">
                    <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1">{featured.category}</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h3 className="pt-5 font-heading text-2xl font-semibold leading-[33px] tracking-[-0.0135em] text-brand-teal">
                    {featured.title}
                  </h3>
                  <p className="max-w-[448px] pt-4 text-sm leading-7 text-stone-600">{featured.body}</p>
                  <a href="#" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold leading-5 text-brand-orange">
                    Read the guide
                    <Image
                      src="/icons/arrow-up-right-orange.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </article>
            </Reveal>

            <div className="flex flex-col gap-4">
              {rest.map((a, i) => (
                <Reveal key={a.title} delay={i * 60}>
                  <article className="group flex items-start gap-5 rounded-3xl border border-stone-200 bg-white p-4 transition-transform hover:-translate-y-1">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl lg:size-28">
                      <Image
                        src={a.image}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover transition-transform group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-3 text-xs leading-4 text-stone-500">
                        <span>{a.category}</span>
                        <span aria-hidden>·</span>
                        <span>{a.readTime}</span>
                      </p>
                      <h3 className="pt-2 font-heading font-medium leading-[22px] tracking-[-0.0135em] text-brand-teal">
                        {a.title}
                      </h3>
                      <p className="line-clamp-2 pt-2 text-sm leading-6 text-stone-600">{a.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </Section>
  );
}
