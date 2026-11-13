"use client";

import { useMemo } from "react";
import { Chips, Palettes, PanelSection, StyleTiles } from "@/app/app/editor/[fileId]/_ui/controls";
import { GCheckBold, GSnowflake, GSun, glyph, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { GLeaf, withOwnWords } from "@/app/app/editor/[fileId]/_tools/group-c/shared";
import { chip, roomIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { mockImage } from "@/lib/mock/entities";

const GFlower = glyph(
  "M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM104,128a24,24,0,1,1,24,24A24,24,0,0,1,104,128Zm74.35-56.79a24,24,0,1,1,24,41.57c-6.27,3.63-18.61,6.13-35.16,7.19A40,40,0,0,0,154.53,98.1C163.73,84.28,172.08,74.84,178.35,71.21ZM128,32a24,24,0,0,1,24,24c0,7.24-4,19.19-11.36,34.06a39.81,39.81,0,0,0-25.28,0C108,75.19,104,63.24,104,56A24,24,0,0,1,128,32ZM44.86,80a24,24,0,0,1,32.79-8.79c6.27,3.63,14.62,13.07,23.82,26.89A40,40,0,0,0,88.81,120c-16.55-1.06-28.89-3.56-35.16-7.18A24,24,0,0,1,44.86,80ZM77.65,184.79a24,24,0,1,1-24-41.57c6.27-3.63,18.61-6.13,35.16-7.19a40,40,0,0,0,12.66,21.87C92.27,171.72,83.92,181.16,77.65,184.79ZM128,224a24,24,0,0,1-24-24c0-7.24,4-19.19,11.36-34.06a39.81,39.81,0,0,0,25.28,0C148,180.81,152,192.76,152,200A24,24,0,0,1,128,224Zm83.14-48a24,24,0,0,1-32.79,8.79c-6.27-3.63-14.62-13.07-23.82-26.89A40,40,0,0,0,167.19,136c16.55,1.06,28.89,3.56,35.16,7.18A24,24,0,0,1,211.14,176Z",
  "M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM128,156a28,28,0,1,1,28-28A28,28,0,0,1,128,156Z"
);

const seasons: { name: string; icon: Glyph; changes: string; swatch: string[] }[] = [
  { name: "Spring", icon: GFlower, changes: "Fresh flowers, light linens, pastel accents", swatch: ["#f3e3e3", "#cfe0c3", "#f5e6b8"] },
  { name: "Summer", icon: GSun, changes: "Airy textiles, greenery, sun-bleached tones", swatch: ["#f6efe2", "#9fc1b5", "#e9b872"] },
  { name: "Autumn", icon: GLeaf, changes: "Wool throws, warm lamps, amber and rust", swatch: ["#c8743a", "#8c4a2f", "#d9b382"] },
  { name: "Winter", icon: GSnowflake, changes: "Layered knits, candlelight, evergreen", swatch: ["#e9ebe8", "#3f5a4c", "#a8443a"] },
];

const info = {
  photo: "A photo of the room as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A room dressed the way you like for the season. VastuNord borrows its textiles and accents.",
  prompt: "Anything specific for the season. Leave it empty and the season below does the work.",
  roomType: "Auto-detect reads it from the photo. It decides which seasonal touches make sense.",
  roomStyle: "Keeps the seasonal pieces in the room’s own language.",
  palette: "Auto uses the season’s own colours. A palette here overrides them.",
  season: "Only the soft things change: textiles, flowers, objects and light. Furniture and layout stay.",
};

const phases = (season: string) => [
  "Reading the room",
  "Keeping furniture and layout",
  `Dressing it for ${season.toLowerCase()}`,
  "Matching light to the season",
];

export default function SeasonalStyling({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);

  const season = String(p.season);
  const prompt = String(p.prompt ?? "");
  const current = seasons.find((x) => x.name === season) ?? seasons[0];
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;
  // "Auto" palette shows as the season's own colours.
  const ownPalette = `${season}’s own`;

  return (
    <ToolScreen
      screen={screen}
      toolName="Seasonal Styling"
      intro={{
        eyebrow: "Interior design",
        bullets: [
          "Upload a photo of the room as it is now.",
          "Choose a season. Textiles, flowers, objects and light change with it.",
          "Generate. The furniture and layout stay exactly where they are.",
        ],
        before: mockImage("03ac624ef968e00134d6783cb050827d2881a85a-1536x1024.png"),
        after: mockImage("d3c2ec623a320d15f878f1b36ffd42d98c2deeb3-1536x1024.png"),
        afterLabel: "Summer",
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Choose the season", short: "Season" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={() => (prompt.trim() ? prompt.trim() : `${season} styling · ${String(p.roomStyle)}`)}
      generateLabel={{ first: `Style for ${season.toLowerCase()}`, again: "Regenerate" }}
      phases={phases(season)}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Anything specific?",
        info: info.prompt,
        label: "Describe the seasonal styling",
        placeholder: "Dried flowers on the table, a heavier throw on the sofa, candles on the mantel…",
        improve: (t) =>
          withOwnWords(t, `Dress the room for ${season.toLowerCase()}: ${current.changes.toLowerCase()}. Keep the furniture and layout exactly as they are.`),
      }}
      marking={null}
    >
      <PanelSection title="Room type" info={info.roomType}>
        <Chips
          label="Room type"
          options={optionsOf(def, "roomType").map((o) => chip(o.value, roomIcons))}
          value={String(p.roomType)}
          onChange={(v) => s.setParam("roomType", v)}
        />
      </PanelSection>
      <PanelSection title="Room style" info={info.roomStyle} meta={String(p.roomStyle)}>
        <StyleTiles
          label="Room style"
          options={optionsOf(def, "roomStyle").map((o) => ({ value: o.value, preview: o.preview ?? "" }))}
          value={String(p.roomStyle)}
          onChange={(v) => s.setParam("roomStyle", v)}
        />
      </PanelSection>
      <PanelSection title="Colour palette" info={info.palette}>
        <Palettes
          label="Colour palette"
          options={optionsOf(def, "palette").map((o) =>
            o.value === "Auto" ? { value: ownPalette, swatch: current.swatch } : { value: o.value, swatch: o.swatch ?? [] }
          )}
          value={String(p.palette) === "Auto" ? ownPalette : String(p.palette)}
          onChange={(v) => s.setParam("palette", v.endsWith("’s own") ? "Auto" : v)}
        />
      </PanelSection>
      <PanelSection title="Season" info={info.season} meta={season}>
        <div role="radiogroup" aria-label="Season" className="grid grid-cols-2 gap-2">
          {seasons.map((x) => {
            const on = x.name === season;
            const Icon = x.icon;
            return (
              <button
                key={x.name}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => s.setParam("season", x.name)}
                className={`relative flex flex-col rounded-xl border p-3 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={18} fill={on} className={on ? "text-ember-soft" : "text-cream/70"} />
                  <span className="font-display text-[14px] font-semibold text-white">{x.name}</span>
                </span>
                <span className="mt-2 text-[11px] leading-[1.45] text-cream/55">{x.changes}</span>
                <span className="mt-3 flex h-1.5 overflow-hidden rounded-full">
                  {x.swatch.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                {on ? (
                  <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-ember text-white">
                    <GCheckBold size={11} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
