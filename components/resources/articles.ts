// Resource library content. The first match for the active filter is shown as
// the large featured card; the rest stack beside it.

export const categories = [
  "All",
  "Design Ideas",
  "Renovation",
  "Real Estate",
  "Guides",
  "Tutorials",
  "Product Updates",
] as const;

export type Category = (typeof categories)[number];

export type Article = {
  category: Exclude<Category, "All">;
  readTime: string;
  title: string;
  body: string;
  image: string;
};

export const articles: Article[] = [
  {
    category: "Renovation",
    readTime: "8 min read",
    title: "How to Visualize a Renovation Before You Build",
    body: "A step-by-step method for testing a renovation on a photograph before a single wall moves.",
    image: "/images/resources/renovation.jpg",
  },
  {
    category: "Real Estate",
    readTime: "6 min read",
    title: "Virtual Staging vs Traditional Staging",
    body: "What each approach costs, what each one signals to buyers, and when to use which.",
    image: "/images/resources/virtual-staging.jpg",
  },
  {
    category: "Design Ideas",
    readTime: "5 min read",
    title: "Choosing the Right Interior Style",
    body: "Scandinavian, Japandi or Modern Luxury — how to tell which language suits your rooms.",
    // Figma reuses the Features closing-banner bedroom here.
    image: "/images/cta/features.jpg",
  },
  {
    category: "Guides",
    readTime: "7 min read",
    title: "AI for Homeowners",
    body: "A plain-language guide to what spatial visualization can and cannot decide for you.",
    image: "/images/resources/ai-for-homeowners.jpg",
  },
  {
    category: "Design Ideas",
    readTime: "4 min read",
    title: "Design Trends",
    body: "The material and light directions shaping northern European interiors this year.",
    image: "/images/resources/design-trends.jpg",
  },
];

/** Same rules as the prototype: category must match, and the search text must
 *  appear in the title or summary (case-insensitive). */
export function filterArticles(category: Category, query: string) {
  const q = query.trim().toLowerCase();
  return articles.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      (!q || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q))
  );
}
