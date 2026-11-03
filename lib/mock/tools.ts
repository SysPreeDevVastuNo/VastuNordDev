// The tool catalogue the Tool library (WD-01) and Home recommendations read.
// Order, copy and cover images are the prototype's.

import { mockImage } from "@/lib/mock/entities";

export type ToolCategoryId = "interior" | "exterior" | "staging" | "enhancement";

export const toolCategories: { id: ToolCategoryId; label: string }[] = [
  { id: "interior", label: "Interior Design" },
  { id: "exterior", label: "Exterior & Landscape" },
  { id: "staging", label: "Virtual Staging" },
  { id: "enhancement", label: "Image Enhancement" },
];

export type Tool = {
  id: string;
  name: string;
  blurb: string;
  category: ToolCategoryId;
  image: string;
};

export const tools = [
  { id: "room-reimagination", name: "Room Reimagination", blurb: "Reimagine a room in a new direction.", category: "interior", image: mockImage("f34b431ae201a5c6d5ac90baed09336196f2df96-1080x608.jpg") },
  { id: "virtual-home-staging", name: "Virtual Home Staging", blurb: "Furnish an empty room for a listing.", category: "staging", image: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg") },
  { id: "outdoor-visualization", name: "Outdoor Visualization", blurb: "See a garden or terrace finished.", category: "exterior", image: mockImage("89ec2e7a440d0bf6d8b143ca4892d87cee151863-1024x682.png") },
  { id: "hardscape-design", name: "Hardscape Design", blurb: "Paving, decking and walls, set in the real space.", category: "exterior", image: mockImage("89ec2e7a440d0bf6d8b143ca4892d87cee151863-1024x682.png") },
  { id: "furniture-refresh", name: "Furniture Refresh", blurb: "Swap the furniture, keep the room.", category: "interior", image: mockImage("289267f2310e46f9cbc8401b2f876aef191371f7-1536x1024.png") },
  { id: "seasonal-styling", name: "Seasonal Styling", blurb: "Restyle a space for a season.", category: "staging", image: mockImage("a41988e0dce447ac8c380d22efac2f34a751af41-1080x720.jpg") },
  { id: "visual-cleanup", name: "Visual Cleanup", blurb: "Remove clutter and distractions.", category: "enhancement", image: mockImage("53811e1e2cd199389a7fdba37db66db06f6f8714-1536x1024.png") },
  { id: "resolution-enhancement", name: "Resolution Enhancement", blurb: "Make a small image usable.", category: "enhancement", image: mockImage("671725f04c42e8e1f95e836a564c23efd45197cc-1500x1000.jpg") },
  { id: "perspective-correction", name: "Perspective Correction", blurb: "Straighten a leaning building.", category: "enhancement", image: mockImage("7c609fd51d189961d30180a883b22a036064b3c1-1024x576.png") },
  { id: "decor-redefinition", name: "Decor Re-definition", blurb: "Change the objects, keep the room.", category: "interior", image: mockImage("671725f04c42e8e1f95e836a564c23efd45197cc-1500x1000.jpg") },
  { id: "material-refinement", name: "Material Refinement", blurb: "Swap finishes, nothing else.", category: "interior", image: mockImage("53811e1e2cd199389a7fdba37db66db06f6f8714-1536x1024.png") },
  { id: "lighting-reimagination", name: "Lighting Reimagination", blurb: "Relight a room you already have.", category: "interior", image: mockImage("c6dfafbcf288818cf0bf88bb2db36c9d33db780d-1536x1024.png") },
  { id: "garden-design", name: "Garden Design", blurb: "Plant the garden before you dig it.", category: "exterior", image: mockImage("77045f942e5fb6f35501791994a9ec2474dea837-1200x675.png") },
  { id: "pool-redesign", name: "Spa & Pool Redesign", blurb: "Shape, material and setting for a pool.", category: "exterior", image: mockImage("144bd1d8129ab54640981c8e245ed07717d31bd3-800x533.png") },
  { id: "sky-transformation", name: "Sky Transformation", blurb: "Replace a flat grey sky.", category: "exterior", image: mockImage("b21b1523c42e156896e6730308bf763713925900-1024x682.png") },
  { id: "seasonal-transformation", name: "Seasonal Transformation", blurb: "The same exterior across four seasons.", category: "exterior", image: mockImage("d594affb64331658be2bc5f27c3f958f9183cb5b-1024x682.png") },
  { id: "object-placement", name: "Object Placement", blurb: "Put a specific object into a real scene.", category: "exterior", image: mockImage("22871f11a67ad5ea67e262bc1fe52e2ac92fc053-1024x576.png") },
] as const satisfies readonly Tool[];

export type ToolId = (typeof tools)[number]["id"];

export const toolById = (id: string): Tool | undefined => tools.find((t) => t.id === id);

/** Shown when a library search finds nothing — the tools people reach for most. */
export const suggestedToolIds: ToolId[] = ["room-reimagination", "virtual-home-staging", "outdoor-visualization"];

/** Home "Recommended for you": tools that suit homeowner work, in priority order. */
export const homeownerToolIds: ToolId[] = [
  "material-refinement",
  "decor-redefinition",
  "hardscape-design",
  "seasonal-styling",
  "room-reimagination",
  "furniture-refresh",
  "garden-design",
];

/** Name and one-line description, case-insensitively — what the library search matches. */
export const matchesToolQuery = (tool: Tool, query: string) =>
  `${tool.name} ${tool.blurb}`.toLowerCase().includes(query.trim().toLowerCase());
