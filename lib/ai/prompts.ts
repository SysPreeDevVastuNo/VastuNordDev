// What each tool asks the model to do. The tool's own summary (its settings in
// words) and the user's prompt are added after this, then the "keep" line so
// the room or building stays the same photo.

const keepRoom =
  "Edit this exact photo. Keep the room exactly as it is: the same walls, windows, doors, ceiling, floor and camera angle. Do not add, remove or move any windows or doors, and keep the floor the same. Photorealistic, natural light.";
const keepSite =
  "Edit this exact photo. Keep the building and site exactly as they are: the same walls, windows, doors, roof, layout and camera angle. Do not add, remove or move any windows or doors. Photorealistic.";

const tools: Record<string, { task: string; keep: string }> = {
  "room-reimagination": { task: "Redesign this room's interior in a new style.", keep: keepRoom },
  "furniture-refresh": { task: "Replace the furniture in this room with new pieces.", keep: keepRoom },
  "decor-redefinition": { task: "Change the decor and accessories in this room.", keep: keepRoom },
  "material-refinement": { task: "Change only the materials and finishes in this room. Do not move or replace furniture.", keep: keepRoom },
  "seasonal-styling": { task: "Style this space for the season described.", keep: keepRoom },
  "virtual-home-staging": { task: "Furnish and stage this empty room for a property listing. Only add furniture, rugs, lighting and decor.", keep: keepRoom },
  "lighting-reimagination": { task: "Relight this room. Change only the lighting and the light fittings.", keep: keepRoom },
  "outdoor-visualization": { task: "Show this outdoor space finished and landscaped.", keep: keepSite },
  "hardscape-design": { task: "Redesign the paving, decking and walls of this outdoor space.", keep: keepSite },
  "garden-design": { task: "Plant and design the garden in this photo.", keep: keepSite },
  "pool-redesign": { task: "Redesign the pool or spa in this photo.", keep: keepSite },
  "sky-transformation": { task: "Replace only the sky. Match the lighting on the building to the new sky.", keep: keepSite },
  "seasonal-transformation": { task: "Show this exterior in the season described.", keep: keepSite },
  "object-placement": { task: "Place the described object into this scene with correct scale, perspective and shadows.", keep: keepSite },
  "resolution-enhancement": { task: "Enhance this photo: sharper detail, less noise, better clarity. Do not change the content.", keep: "Keep everything in the photo exactly the same." },
  "visual-cleanup": { task: "Remove clutter and distractions from this photo.", keep: "Keep everything else exactly the same." },
  "perspective-correction": { task: "Correct the perspective so vertical lines are straight.", keep: "Keep the content of the photo the same." },
};

export const REFERENCE_LINE = " Use the second image as a style reference.";

export const knownTool = (toolId: string) => toolId in tools;

export function buildPrompt({ toolId, summary, prompt, negative, hasReference }: { toolId: string; summary: string; prompt: string; negative: string; hasReference: boolean }) {
  const t = tools[toolId];
  // The model weighs the start most, so what must stay comes first.
  const parts = [t.keep, t.task, summary.trim() && `Request: ${summary.trim()}.`];
  if (prompt.trim() && !summary.includes(prompt.trim())) parts.push(prompt.trim());
  if (hasReference) parts.push(REFERENCE_LINE.trim());
  if (negative.trim()) parts.push(`Avoid: ${negative.trim()}.`);
  return parts.filter(Boolean).join(" ").slice(0, 1900);
}
