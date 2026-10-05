"use client";

import { useMemo, useState } from "react";
import ResourceFilters from "@/components/resources/ResourceFilters";
import FeaturedArticles from "@/components/resources/FeaturedArticles";
import { filterArticles, type Category } from "@/components/resources/articles";

/** Search + category pills and the article list they filter. */
export default function ResourceLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const results = useMemo(() => filterArticles(category, query), [category, query]);

  return (
    <>
      <ResourceFilters query={query} onQueryChange={setQuery} category={category} onCategoryChange={setCategory} />
      <FeaturedArticles
        items={results}
        onClear={() => {
          setQuery("");
          setCategory("All");
        }}
      />
    </>
  );
}
