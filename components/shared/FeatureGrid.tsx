import Image from "next/image";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";

export type FeatureGridItem = {
  title: string;
  body: string;
  /** Figma SVG asset (24px). */
  icon: string;
};

/**
 * Bordered grid of icon + title + body cells, separated by 1px hairlines
 * (Figma: Features "Use Cases", Pricing "What You Get").
 */
export default function FeatureGrid({
  items,
  columns = 3,
}: {
  items: FeatureGridItem[];
  columns?: 2 | 3;
}) {
  // Figma fills any empty trailing cells in the last row with off-white, so the
  // hairline background never shows through as a grey block.
  const fillers = (columns - (items.length % columns)) % columns;

  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      )}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 55} className="bg-white">
          <div className="h-full p-7 transition-colors hover:bg-brand-offwhite">
          <Image src={item.icon} alt="" width={24} height={24} />
          <h3 className="pt-5 font-heading font-medium leading-6 tracking-[-0.0135em] text-brand-teal">
            {item.title}
          </h3>
          <p className="pt-3 text-sm leading-6 text-stone-600">{item.body}</p>
          </div>
        </Reveal>
      ))}
      {Array.from({ length: fillers }, (_, i) => (
        <div key={`filler-${i}`} aria-hidden className="hidden bg-brand-offwhite md:block" />
      ))}
    </div>
  );
}
