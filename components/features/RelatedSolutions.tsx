import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const solutions = [
  {
    category: "Interior Spaces",
    categoryIcon: "/icons/interior-spaces-teal.svg",
    title: "Scandinavian Living Room",
    image: "/images/features/directions/scandinavian.jpg",
  },
  {
    category: "Interior Spaces",
    categoryIcon: "/icons/interior-spaces-teal.svg",
    title: "Kitchen Remodel",
    image: "/images/features/solutions/kitchen-remodel.jpg",
  },
  {
    category: "Property Visualization",
    categoryIcon: "/icons/home-teal.svg",
    title: "Virtual Staging",
    image: "/images/features/solutions/virtual-staging.jpg",
  },
  {
    category: "Exterior Spaces",
    categoryIcon: "/icons/exterior-teal.svg",
    title: "Backyard Design",
    image: "/images/features/solutions/backyard-design.png",
  },
];

export default function RelatedSolutions() {
  return (
    <Section padded={false} className="pb-20 lg:pb-28">
      <PageContainer>
        <div className="max-w-[768px]">
          <p className="eyebrow text-stone-500">Related Solutions</p>
          <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
            Explore related solutions
          </h2>
        </div>

        {/* Figma lets the row run past the container edge (card 4 is cut off) and
            scroll sideways; there are no arrow controls. */}
        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {solutions.map((s) => (
            <Link
              key={s.title}
              href="/resources"
              className="group w-[72%] shrink-0 snap-start overflow-hidden rounded-3xl border border-stone-200 md:w-[30%]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 350px, 72vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/60 to-black/0" />
                <span className="absolute bottom-3 left-3 flex h-[24.5px] items-center gap-1.5 rounded-full bg-white/85 px-3 text-[11px] font-semibold leading-[16.5px] text-brand-teal">
                  <Image src={s.categoryIcon} alt="" width={13} height={13} />
                  {s.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <p className="font-heading font-medium leading-6 text-brand-teal">{s.title}</p>
                <Image
                  src="/icons/arrow-up-right-grey.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
