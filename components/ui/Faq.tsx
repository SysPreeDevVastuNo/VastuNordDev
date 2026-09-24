"use client";

import { useState } from "react";
import { IconChevron } from "@/components/ui/icons";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-stone-900">{item.q}</span>
              <IconChevron
                direction={isOpen ? "down" : "right"}
                className="h-4 w-4 shrink-0 text-stone-400 transition-transform"
              />
            </button>
            {isOpen && <p className="pb-5 text-sm leading-relaxed text-stone-600">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
