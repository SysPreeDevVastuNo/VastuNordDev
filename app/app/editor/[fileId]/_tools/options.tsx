import { LevelGlyph, RatioGlyph, SwatchDot, type ChipOption } from "@/app/app/editor/[fileId]/_ui/controls";
import {
  GBathtub,
  GBed,
  GCameraFill,
  GCloud,
  GCloudFog,
  GCloudMoon,
  GCloudRain,
  GCookingPot,
  GCouch,
  GDesk,
  GDoorOpen,
  GForkKnife,
  GImageFill,
  GLamp,
  GLightbulb,
  GLock,
  GMoon,
  GMoonStars,
  GProhibit,
  GSnowflake,
  GSparkleFill,
  GSun,
  GSunDim,
  GSunHorizon,
  type Glyph,
} from "@/app/app/editor/[fileId]/_ui/icons";

// How an option renders as a chip, shared by every tool (the prototype's
// toolOptions): Auto gets a sparkle, Keep existing a lock, None a prohibit
// sign, then a tool's icon map, floor swatches, level bars, ratio boxes.

const floorColours: Record<string, string> = {
  "Pale oak": "#d8c3a2",
  Walnut: "#6e4b34",
  Concrete: "#9b9892",
  Stone: "#cbc3b5",
  Terrazzo: "#e7e0d4",
};
const levels: Record<string, number> = {
  Light: 1,
  Balanced: 2,
  Full: 3,
  "A few": 1,
  Generous: 3,
  Minimal: 1,
  Considered: 2,
  Layered: 3,
  Sparse: 1,
  Lush: 3,
  Many: 3,
  Busy: 3,
  One: 1,
  Parked: 1,
  Passing: 2,
};
const ratios: Record<string, [number, number]> = { "1:1": [1, 1], "4:3": [4, 3], "3:2": [3, 2], "16:9": [16, 9] };

export function chip(value: string, icons?: Record<string, Glyph>): ChipOption {
  if (value === "Auto" || value === "Auto-detect") return { value, icon: GSparkleFill };
  if (value === "Keep existing") return { value, icon: GLock };
  if (value === "None") return { value, icon: GProhibit };
  if (value === "Original") return { value, icon: GImageFill };
  if (icons?.[value]) return { value, icon: icons[value] };
  if (floorColours[value]) return { value, glyph: <SwatchDot color={floorColours[value]} /> };
  if (levels[value] !== undefined) return { value, glyph: <LevelGlyph level={levels[value]} /> };
  if (ratios[value]) return { value, glyph: <RatioGlyph w={ratios[value][0]} h={ratios[value][1]} /> };
  return { value };
}

export const roomIcons: Record<string, Glyph> = {
  "Living room": GCouch,
  Bedroom: GBed,
  Kitchen: GCookingPot,
  Bathroom: GBathtub,
  Dining: GForkKnife,
  Office: GDesk,
  Hallway: GDoorOpen,
};
export const timeIcons: Record<string, Glyph> = {
  "As photographed": GCameraFill,
  Morning: GSunHorizon,
  Midday: GSun,
  "Golden hour": GSunDim,
  "Blue hour": GCloudMoon,
  Night: GMoon,
};
export const weatherIcons: Record<string, Glyph> = {
  "As photographed": GCameraFill,
  Clear: GSun,
  Overcast: GCloud,
  Hazy: GCloudFog,
  Rain: GCloudRain,
  Snow: GSnowflake,
};
export const lightingIcons: Record<string, Glyph> = { "Natural only": GSun, "Warm lamps": GLamp, Bright: GLightbulb, Moody: GMoonStars };

/** Garden/outdoor style cards: swatch and a short hint. */
export const outdoorStyles: Record<string, { swatch: string[]; hint: string }> = {
  Naturalistic: { swatch: ["#8a9a6b", "#c9b88f", "#5d6b4a"], hint: "Meadow grasses · stone · wildflowers" },
  Formal: { swatch: ["#2f4a33", "#d8d2c4", "#6b7f5a"], hint: "Clipped hedges · gravel · symmetry" },
  Mediterranean: { swatch: ["#c98b5a", "#a9b38c", "#e9dcc4"], hint: "Olive · terracotta · lavender" },
  Nordic: { swatch: ["#a8b2a0", "#d9d4c8", "#4f5a52"], hint: "Birch · granite · moss" },
  Desert: { swatch: ["#d6b58a", "#a3765a", "#7f8a6a"], hint: "Succulents · sand · weathered steel" },
  Tropical: { swatch: ["#2f6b47", "#e0b04a", "#a2c27a"], hint: "Big leaves · timber · bright blooms" },
};
