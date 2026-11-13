// Long-form copy for each tool's entry page (WD-04): the description and the
// "What you bring / What you get / Highlights" lists. Copy is the prototype's.

import type { ToolId } from "@/lib/mock/tools";

export type ToolDetail = {
  long: string;
  inputs: string[];
  outputs: string[];
  highlights: string[];
};

export const toolDetails: Record<ToolId, ToolDetail> = {
  "room-reimagination": {
    long: "Start from a photograph of the room as it is today. VastuNord keeps the geometry and daylight, then explores what the space could become — materials, furniture, palette and mood.",
    inputs: ["A photo of the room", "Optional style reference", "Optional prompt"],
    outputs: ["Up to 4 directions", "High-resolution export", "Side-by-side comparison"],
    highlights: ["Keeps structure and proportion", "Respects existing daylight", "Eight starting languages"],
  },
  "virtual-home-staging": {
    long: "An empty room asks the buyer to do the imagining. Stage the same space in several directions and let them picture living there — before the first viewing, not after.",
    inputs: ["A photo of the empty room", "Target buyer style"],
    outputs: ["Furnished directions", "Listing-ready exports"],
    highlights: ["Minutes, not a moving truck", "Match the staging to the buyer", "Honest proportions"],
  },
  "outdoor-visualization": {
    long: "Outdoor projects are the hardest to picture and the most expensive to redo. See the plot as several finished gardens before a single paver is ordered.",
    inputs: ["A photo of the outdoor space", "Planting or hardscape preference"],
    outputs: ["Finished garden scenes", "Seasonal variants"],
    highlights: ["Hardscape and planting together", "Respects aspect and light", "Compare lush against minimal"],
  },
  "hardscape-design": {
    long: "Stone, timber and gravel laid out on the photograph of the terrace you actually have. Pattern, edges and walls are chosen together, so the scene reads as one place rather than a catalogue.",
    inputs: ["A photo of the outdoor space", "Material and pattern preference"],
    outputs: ["Hardscape scenes", "Material and pattern variants"],
    highlights: ["Paving, decking and walls together", "Laying pattern as a choice", "Visualisation, not a construction drawing"],
  },
  "furniture-refresh": {
    long: "Change what sits in the room without touching the room itself — a faster question than a full redirection, and often the only one that matters.",
    inputs: ["A photo of the room", "Furniture style"],
    outputs: ["Re-furnished scenes"],
    highlights: ["Room stays put", "Piece-level swaps", "Buy-before-you-buy"],
  },
  "seasonal-styling": {
    long: "Dress an existing space for a season or an occasion — useful for listings that have gone quiet and for photography that needs to feel current.",
    inputs: ["A photo of the space", "Season or occasion"],
    outputs: ["Seasonal variants"],
    highlights: ["Reset a stale listing", "Occasion-led styling"],
  },
  "visual-cleanup": {
    long: "Take out the bins, the cables, the parked car — the things that make a real photograph read as a bad one.",
    inputs: ["Any photo"],
    outputs: ["Cleaned image"],
    highlights: ["Object removal", "Keeps the scene honest"],
  },
  "resolution-enhancement": {
    long: "Bring a low-resolution or soft photograph up to something you can print, list or present without apologising for it.",
    inputs: ["A low-resolution photo"],
    outputs: ["Upscaled image"],
    highlights: ["Print-ready output", "Detail recovery"],
  },
  "perspective-correction": {
    long: "Correct converging verticals and tilted horizons so architectural photographs read the way the eye remembers the building.",
    inputs: ["A photo with skewed perspective"],
    outputs: ["Corrected image"],
    highlights: ["Vertical correction", "Architectural framing"],
  },
  "decor-redefinition": {
    long: "The furniture stays where it is. What changes is everything on top of it — textiles, ceramics, art, the small decisions that make a room feel considered or chaotic.",
    inputs: ["A photo of the room", "Decor direction"],
    outputs: ["Restyled decor", "Object-level variants"],
    highlights: ["Leaves furniture untouched", "Add or remove single objects", "Works from your own asset library"],
  },
  "material-refinement": {
    long: "The narrowest interior tool: change what surfaces are made of. Oak instead of laminate, matt instead of gloss, stone instead of tile — with the layout held exactly.",
    inputs: ["A photo of the room", "Target materials"],
    outputs: ["Material variants", "Surface-level comparison"],
    highlights: ["Select a single surface", "Palette-led substitution", "Geometry never moves"],
  },
  "lighting-reimagination": {
    long: "Most rooms are not badly designed, they are badly lit. Change temperature, intensity and direction, or put a different fixture where the old one hangs.",
    inputs: ["A photo of the room", "Lighting intent"],
    outputs: ["Relit scenes", "Fixture variants"],
    highlights: ["Warmth and intensity separately", "Ambient, task or accent", "Place fixtures from assets"],
  },
  "garden-design": {
    long: "Borders, paths, lawn and trees, resolved on the photo of the plot you actually have. Or a lighter touch-up that tidies what is already planted.",
    inputs: ["A photo of the garden", "Style and area"],
    outputs: ["Planting schemes", "Touch-up variants"],
    highlights: ["Whole garden or one border", "Touch-up mode for small changes", "Suggestions read from the photo"],
  },
  "pool-redesign": {
    long: "Pools are decided years before they are built and regretted for decades after. Work through type, construction, shape and material against the real site.",
    inputs: ["A photo of the site", "Pool configuration"],
    outputs: ["Pool scenes", "Material variants"],
    highlights: ["Infinity through plunge", "In-ground or raised", "Coping and lining together"],
  },
  "sky-transformation": {
    long: "The fastest improvement any exterior photograph can have. Set time of day and weather, then tune cloud and saturation until the building sits in the light it deserves.",
    inputs: ["An exterior photo"],
    outputs: ["Sky variants", "Time-of-day set"],
    highlights: ["Five times of day", "Cloud and saturation sliders", "Building lighting follows the sky"],
  },
  "seasonal-transformation": {
    long: "Show the property in summer for the listing and in winter for the planning application. People, vehicles and planting all shift with the season.",
    inputs: ["An exterior photo", "Season and time of day"],
    outputs: ["Four seasonal scenes", "Populated or empty variants"],
    highlights: ["Planting follows the season", "Adjust people and vehicles", "Consistent across the set"],
  },
  "object-placement": {
    long: "You have the product photograph and you have the site. This places the one into the other with the right scale, shadow and ground contact.",
    inputs: ["A photo of the scene", "An object from your assets"],
    outputs: ["Placed object scenes", "Position variants"],
    highlights: ["Uses your own object library", "Scale and shadow resolved", "No style reference needed"],
  },
};
