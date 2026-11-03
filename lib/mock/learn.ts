// Home "Learn" rail — guides from the marketing Resources section.

import { mockImage } from "@/lib/mock/entities";

export type LearnArticle = {
  id: string;
  category: string;
  readMinutes: number;
  title: string;
  summary: string;
  image: string;
  href: string;
};

export const learnArticles: LearnArticle[] = [
  {
    id: "visualize-renovation",
    category: "Renovation",
    readMinutes: 8,
    title: "How to Visualize a Renovation Before You Build",
    summary: "A step-by-step method for testing a renovation on a photograph before a single wall moves.",
    image: mockImage("06d32ffb68c22223031861c9058113233402f140-1504x1046.png"),
    href: "/resources",
  },
  {
    id: "virtual-vs-traditional-staging",
    category: "Real Estate",
    readMinutes: 6,
    title: "Virtual Staging vs Traditional Staging",
    summary: "What each approach costs, what each one signals to buyers, and when to use which.",
    image: mockImage("22871f11a67ad5ea67e262bc1fe52e2ac92fc053-1024x576.png"),
    href: "/resources",
  },
  {
    id: "interior-style",
    category: "Design Ideas",
    readMinutes: 5,
    title: "Choosing the Right Interior Style",
    summary: "Scandinavian, Japandi or Modern Luxury — how to tell which language suits your rooms.",
    image: mockImage("f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg"),
    href: "/resources",
  },
];
