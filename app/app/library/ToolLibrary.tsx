"use client";

import { useState } from "react";
import { appButtonPrimary } from "@/components/app/AppButton";
import { categoryIcons } from "@/components/app/categoryIcons";
import EmptyState from "@/components/app/EmptyState";
import FilterChip from "@/components/app/FilterChip";
import ScreenCode from "@/components/app/ScreenCode";
import SearchField from "@/components/app/SearchField";
import ToolCard from "@/components/app/ToolCard";
import {
  matchesToolQuery,
  suggestedToolIds,
  toolById,
  toolCategories,
  tools,
  type Tool,
  type ToolCategoryId,
} from "@/lib/mock/tools";

function ToolGrid({ label, tools }: { label: string; tools: readonly Tool[] }) {
  return (
    <section aria-label={label} className="mt-8">
      <h2 className="px-5 font-display text-[17px] font-semibold text-navy sm:px-0">
        {label}
        <span className="ml-2 text-[13px] font-normal text-faint">{tools.length}</span>
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 px-5 sm:gap-4 sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <li key={tool.id}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// WD-01 → WD-02 — the tool library, filtered by category and/or a search.
export default function ToolLibrary() {
  const [category, setCategory] = useState<ToolCategoryId | null>(null);
  const [query, setQuery] = useState("");

  const activeCategory = toolCategories.find((c) => c.id === category);
  const searching = query.trim() !== "";
  const visible = tools.filter((t) => (!category || t.category === category) && (!searching || matchesToolQuery(t, query)));

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="WD-01 → WD-02" state={`Category · ${category ?? "all"}`} />
        <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold text-navy">Tool library</h1>
        <p className="mt-2 max-w-lg text-[15px] leading-7 text-body">
          What can you do with a photograph? Pick the tool that matches the change you want. Every one starts from the real
          space.
        </p>
        <SearchField label="Search tools" value={query} onChange={setQuery} className="mt-6" />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:flex-wrap sm:px-0">
        <FilterChip pressed={!category} onClick={() => setCategory(null)}>
          All
        </FilterChip>
        {toolCategories.map((c) => {
          const Icon = categoryIcons[c.id];
          const pressed = category === c.id;
          return (
            <FilterChip
              key={c.id}
              pressed={pressed}
              onClick={() => setCategory(pressed ? null : c.id)}
              icon={<Icon className={pressed ? "text-ember-soft" : "text-muted"} />}
            >
              {c.label}
            </FilterChip>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <ToolGrid label={searching ? "Results" : (activeCategory?.label ?? "All tools")} tools={visible} />
      ) : (
        <>
          <div className="mt-8 px-5 sm:px-0">
            <EmptyState
              title={`Nothing matches “${query.trim()}”`}
              body="Try a broader word, or start from one of the tools people reach for most."
            >
              <button type="button" onClick={() => setQuery("")} className={appButtonPrimary}>
                Clear search
              </button>
            </EmptyState>
          </div>
          <ToolGrid label="Suggested tools" tools={suggestedToolIds.map((id) => toolById(id)!)} />
        </>
      )}
    </div>
  );
}
