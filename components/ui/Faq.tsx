"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export type FaqVariant = "chevron" | "plus";

// Figma uses two accordion treatments:
//  - chevron: Home / Pricing — 18px questions, 24px rows, grey chevron that flips.
//  - plus:    Features       — 16px questions, 20px rows, orange + that turns into ×.
const variants: Record<FaqVariant, { row: string; question: string; answer: string }> = {
  chevron: {
    row: "py-6",
    question: "lg:text-lg lg:leading-7",
    answer: "pb-6",
  },
  plus: {
    row: "py-5",
    question: "",
    answer: "max-w-[672px] pb-5",
  },
};

export default function Faq({
  items,
  variant = "chevron",
}: {
  items: { q: string; a: string }[];
  variant?: FaqVariant;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const v = variants[variant];

  return (
    <div className="divide-y divide-stone-200 border-y border-stone-200">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={clsx("group flex w-full items-center justify-between gap-6 text-left", v.row)}
              aria-expanded={isOpen}
            >
              <span className={clsx("font-heading font-medium leading-6 text-brand-teal transition-colors group-hover:text-brand-orange", v.question)}>
                {item.q}
              </span>
              {variant === "chevron" ? (
                <Image
                  src="/icons/chevron-down.svg"
                  alt=""
                  width={18}
                  height={18}
                  className={clsx("shrink-0 transition-transform", isOpen && "rotate-180")}
                />
              ) : (
                <Image
                  src="/icons/plus-orange.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={clsx("shrink-0 transition-transform", isOpen && "rotate-45")}
                />
              )}
            </button>
            <div
              className={clsx(
                "grid transition-[grid-template-rows]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className={clsx("text-[15px] leading-7 text-stone-600", v.answer)}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
