"use client";

import Image from "next/image";
import Tabs from "@/components/ui/Tabs";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import { categories, type Category } from "@/components/resources/articles";

const tabs = categories.map((c) => ({ key: c, label: c }));

export default function ResourceFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
}) {
  return (
    <Section padded={false} className="border-b border-stone-200 py-12 lg:py-16">
      <PageContainer className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <label className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-brand-offwhite px-4 py-3 transition-colors focus-within:border-brand-teal lg:max-w-[448px] lg:shrink-0">
          <Image src="/icons/search.svg" alt="" width={18} height={18} className="shrink-0" />
          <span className="sr-only">Search resources</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search guides, tutorials and case studies"
            className="min-w-0 rounded-none border-0 bg-transparent p-0 text-sm leading-5 placeholder:text-stone-400 focus:shadow-none"
          />
        </label>
        {/* Figma lets the pill row run past the edge on mobile and clip on desktop. */}
        <div className="-mx-6 min-w-0 md:-mx-10 lg:mx-0 lg:flex-1">
          <Tabs
            tabs={tabs}
            active={category}
            onChange={onCategoryChange}
            tone="outline"
            wrap={false}
            className="px-6 [scrollbar-width:none] md:px-10 lg:px-0"
          />
        </div>
      </PageContainer>
    </Section>
  );
}
