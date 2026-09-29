import clsx from "clsx";
import Faq, { type FaqVariant } from "@/components/ui/Faq";
import Reveal from "@/components/ui/Reveal";

// Column split per Figma: 448 + 640 / 80px gap (chevron) and 352 + 752 / 64px gap (plus).
const layouts: Record<FaqVariant, string> = {
  chevron: "lg:grid-cols-[minmax(0,448fr)_minmax(0,640fr)] lg:gap-20",
  plus: "lg:grid-cols-[352fr_752fr] lg:gap-16 [&>*]:min-w-0",
};

export default function SplitFaq({
  eyebrow,
  title,
  description,
  items,
  action,
  variant = "chevron",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  items: { q: string; a: string }[];
  /** Rendered under the accordion, e.g. an "Ask us anything" link. */
  action?: React.ReactNode;
  variant?: FaqVariant;
}) {
  return (
    <div className={clsx("grid grid-cols-1 gap-12", layouts[variant])}>
      <Reveal>
        <p className="eyebrow text-stone-500">{eyebrow}</p>
        <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
          {title}
        </h2>
        {description && <p className="mt-5 max-w-[576px] leading-7 text-stone-600">{description}</p>}
      </Reveal>
      <Reveal delay={60}>
        <Faq items={items} variant={variant} />
        {action && <div className="mt-8">{action}</div>}
      </Reveal>
    </div>
  );
}
