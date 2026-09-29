import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

const possibilities = [
  "/images/problem/possibility-1.png",
  "/images/problem/possibility-2.png",
  "/images/problem/possibility-3.png",
  "/images/problem/possibility-4.png",
];

export default function TheProblem() {
  return (
    <Section padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal>
            <Eyebrow>01 — The Problem</Eyebrow>
            <h2 className="mt-5 text-[30.4px] font-semibold leading-[1.06] tracking-[-0.0135em] sm:text-[44px] xl:text-[56px]">
              <span className="block text-brand-teal">The hardest part isn&rsquo;t creating.</span>
              <span className="block text-brand-teal/40">It&rsquo;s seeing what&rsquo;s possible.</span>
            </h2>
            <p className="mt-6 max-w-[512px] leading-7 text-stone-600">
              Design ideas are difficult to explore when they only exist in your head. Whether
              you&rsquo;re transforming a space, changing a detail, or refining an image, VastuNord
              helps you see the possibilities before moving forward.
            </p>
            <p className="mt-8 text-sm leading-5 text-stone-500">
              Start with what you have. Explore what it could become.
            </p>
          </Reveal>

          <Reveal delay={100} className="grid grid-cols-[minmax(0,185.47fr)_22px_minmax(0,288.53fr)] items-center gap-4 lg:gap-6">
            <figure>
              <div className="overflow-hidden rounded-3xl border border-stone-200">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/images/shared/unfurnished-open-plan.jpg"
                    alt="Current unfurnished open-plan space"
                    fill
                    sizes="(min-width: 1024px) 186px, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="eyebrow mt-3 text-stone-500">Current</figcaption>
            </figure>

            <Image src="/icons/arrow-right-orange.svg" alt="" width={22} height={22} />

            <div>
              <div className="grid grid-cols-2 gap-3">
                {possibilities.map((src, i) => (
                  <div key={src} className="overflow-hidden rounded-xl border border-stone-200">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={src}
                        alt={`Possibility ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 137px, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="eyebrow mt-3 text-brand-orange">Possibilities</p>
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  );
}
