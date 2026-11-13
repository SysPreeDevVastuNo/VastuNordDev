"use client";

import { useState } from "react";
import clsx from "clsx";
import { IconCheck, IconSortDescending } from "@/components/app/AppIcons";

// Square sort button beside a search field; opens a list of sort orders (Projects, project dashboard).
export default function SortMenu<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (sort: T) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Sort"
        onClick={() => setOpen(!open)}
        className="flex size-11 items-center justify-center rounded-control border border-line bg-white text-navy transition-colors duration-200 hover:border-navy/30"
      >
        <IconSortDescending />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 z-40 mt-2 w-56 overflow-hidden rounded-control border border-line bg-white py-1.5 shadow-[0_20px_50px_-25px_rgba(1,41,58,0.5)]">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors duration-200 hover:bg-shell",
                  o.value === value ? "font-semibold text-navy" : "text-body"
                )}
              >
                {o.label}
                {o.value === value && <IconCheck className="text-ember" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
