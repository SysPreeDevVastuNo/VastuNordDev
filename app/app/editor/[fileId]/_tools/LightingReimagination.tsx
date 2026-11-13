"use client";

import { useMemo, useState } from "react";
import { Chips, LevelGlyph, PanelSection, PinLayer, Slider, StageTag, SubLabel, Toggle, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GLamp, GLightbulb, glyph, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip, roomIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { AddCard, AssetDialog, PieceRow, assetById, short, usePieces } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GCircleDashed = glyph(
  "M96.26,37.05A8,8,0,0,1,102,27.29a104.11,104.11,0,0,1,52,0,8,8,0,0,1-2,15.75,8.15,8.15,0,0,1-2-.26,88.09,88.09,0,0,0-44,0A8,8,0,0,1,96.26,37.05ZM53.79,55.14a104.05,104.05,0,0,0-26,45,8,8,0,0,0,15.42,4.27,88,88,0,0,1,22-38.09A8,8,0,0,0,53.79,55.14ZM43.21,151.55a8,8,0,1,0-15.42,4.28,104.12,104.12,0,0,0,26,45,8,8,0,0,0,11.41-11.22A88.14,88.14,0,0,1,43.21,151.55ZM150,213.22a88,88,0,0,1-44,0,8,8,0,1,0-4,15.49,104.11,104.11,0,0,0,52,0,8,8,0,0,0-4-15.49ZM222.65,146a8,8,0,0,0-9.85,5.58,87.91,87.91,0,0,1-22,38.08,8,8,0,1,0,11.42,11.21,104,104,0,0,0,26-45A8,8,0,0,0,222.65,146Zm-9.86-41.54a8,8,0,0,0,15.42-4.28,104,104,0,0,0-26-45,8,8,0,1,0-11.41,11.22A88,88,0,0,1,212.79,104.45Z",
  "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm54.59,45a8,8,0,0,1,11.29.7,88,88,0,0,1,17.6,30.47,8,8,0,0,1-15.18,5.08,71.87,71.87,0,0,0-14.4-25A8,8,0,0,1,182.59,69ZM73.41,187.05a8,8,0,0,1-11.29-.7,88,88,0,0,1-17.6-30.47A8,8,0,1,1,59.7,150.8a71.87,71.87,0,0,0,14.4,24.95A8,8,0,0,1,73.41,187.05Zm.69-106.8a71.87,71.87,0,0,0-14.4,25,8,8,0,1,1-15.18-5.08,88,88,0,0,1,17.6-30.47,8,8,0,1,1,12,10.6Zm71.49,134a87.8,87.8,0,0,1-35.18,0,8,8,0,0,1,3.18-15.68,72.08,72.08,0,0,0,28.82,0,8,8,0,0,1,3.18,15.68Zm6.25-163A8,8,0,0,1,144,57.61a7.89,7.89,0,0,1-1.6-.16,72.08,72.08,0,0,0-28.82,0,8,8,0,1,1-3.18-15.68,87.92,87.92,0,0,1,35.18,0A8,8,0,0,1,151.84,51.2Zm59.64,104.68a88,88,0,0,1-17.6,30.47,8,8,0,1,1-12-10.6,71.87,71.87,0,0,0,14.4-24.95,8,8,0,0,1,15.18,5.08Z"
);
const GDotsThreeOutline = glyph(
  "M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z",
  "M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28,28,0,0,0,208,100Z"
);
const GLampPendant = glyph(
  "M176,74.78V72a16,16,0,0,0-16-16H136V16a8,8,0,0,0-16,0V56H96A16,16,0,0,0,80,72v2.78A111.73,111.73,0,0,0,16,176a8,8,0,0,0,8,8H88a40,40,0,0,0,80,0h64a8,8,0,0,0,8-8A111.73,111.73,0,0,0,176,74.78ZM128,208a24,24,0,0,1-24-24h48A24,24,0,0,1,128,208ZM32.33,168A95.79,95.79,0,0,1,91.08,87.35,8,8,0,0,0,96,80V72h64v8a8,8,0,0,0,4.92,7.38A95.79,95.79,0,0,1,223.67,168Z",
  "M176,74.78V72a16,16,0,0,0-16-16H136V16a8,8,0,0,0-16,0V56H96A16,16,0,0,0,80,72v2.78A111.73,111.73,0,0,0,16,176a8,8,0,0,0,8,8H88a40,40,0,0,0,80,0h64a8,8,0,0,0,8-8A111.73,111.73,0,0,0,176,74.78ZM128,208a24,24,0,0,1-24-24h48A24,24,0,0,1,128,208Z"
);
const GDiamond = glyph(
  "M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z",
  "M240,128a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Z"
);
const GEye = glyph(
  "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z",
  "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
);

const info = {
  photo: "A photo of the room as it is lit now. Add other angles if you have them; the highlighted one is used.",
  reference: "A room whose lighting you like. VastuNord borrows its warmth, levels and fixtures.",
  prompt: "Say how the room should feel when it is lit. Leave it empty and the settings below do the work.",
  roomType: "Auto-detect reads it from the photo. It decides where light is needed: over a worktop, beside a bed.",
  settings:
    "Colour temperature is the warmth of the light. Layers are ambient (fills the room), task (to work by) and accent (to look at).",
  fixtures: "Keep existing changes only the light. Any other choice also replaces the fixtures.",
  extras: "Bring in a fixture you own and place it on the photo. Optional.",
};

const phases = ["Reading the room and its windows", "Keeping furniture and finishes", "Placing the light sources", "Casting light and shadow"];

const fixtureIcons: Record<string, Glyph> = {
  Pendant: GLampPendant,
  Recessed: GCircleDashed,
  Track: GDotsThreeOutline,
  Sconce: GLightbulb,
  "Floor lamp": GLamp,
  Statement: GDiamond,
};
const layerLevels: Record<string, number> = { "Ambient only": 1, "Ambient + task": 2, "Fully layered": 3 };

// Colour temperature → an RGB tint, interpolated between these stops.
const kelvinStops: [number, [number, number, number]][] = [
  [2200, [255, 138, 42]],
  [2700, [255, 169, 92]],
  [3200, [255, 196, 137]],
  [4000, [255, 230, 201]],
  [5000, [222, 233, 255]],
];
function kelvinColour(k: number) {
  const i = Math.max(0, kelvinStops.findIndex(([t]) => t >= k) - 1);
  const [k0, c0] = kelvinStops[i];
  const [k1, c1] = kelvinStops[Math.min(kelvinStops.length - 1, i + 1)];
  const t = k1 === k0 ? 0 : Math.min(1, Math.max(0, (k - k0) / (k1 - k0)));
  return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * t)).join(",")})`;
}
const kelvinTrack = `linear-gradient(to right, ${kelvinStops.map(([k]) => `${kelvinColour(k)} ${((k - 2200) / 2800) * 100}%`).join(", ")})`;
const warmth = (k: number) => (k < 2500 ? "candlelight" : k < 3200 ? "warm white" : k < 4200 ? "neutral white" : "cool daylight");

/** A quick tint over the photo for warmth and brightness (not a render). */
function LightPreview({ kelvin, brightness }: { kelvin: number; brightness: number }) {
  const dim = brightness < 60 ? ((60 - brightness) / 50) * 0.7 : 0;
  const lift = brightness > 60 ? ((brightness - 60) / 40) * 0.4 : 0;
  const cast = Math.min(1, Math.abs(kelvin - 4000) / 1800) * 0.38;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundColor: kelvinColour(kelvin), opacity: 0.85 }} />
      <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: kelvinColour(kelvin), opacity: cast }} />
      <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
      <div className="absolute inset-0 bg-white mix-blend-soft-light" style={{ opacity: lift }} />
      <StageTag className="bottom-3 left-3">Light preview · not a render</StageTag>
    </div>
  );
}

export default function LightingReimagination({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const [preview, setPreview] = useState(true);
  const kit = usePieces(s, {
    key: "fixtures",
    read: () => "New light",
    defaultAction: "add",
    addAction: "add",
    addLabel: "New light",
    readable: true,
    unclearLabel: "New light",
  });
  const screen = useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const kelvin = Number(p.kelvin) || 2700;
  const brightness = Number(p.brightness) || 60;
  const layers = String(p.layers);
  const fixtureStyle = String(p.fixtureStyle);
  const prompt = String(p.prompt ?? "");
  const { pieces } = kit;

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || pieces.length || changed);
  const canGenerate = !!working.sourceImage;

  const keep = fixtureStyle === "Keep existing";
  const setting = `${kelvin}K ${warmth(kelvin)}, ${brightness}% · ${layers.toLowerCase()}${keep ? "" : ` · ${fixtureStyle.toLowerCase()} fixtures`}`;
  const added = pieces.map((x) => x.note.trim() || assetById(x.assetId)?.name.toLowerCase() || "a new light");
  const summary = () => (prompt.trim() ? prompt.trim() : [setting, ...added.map((a) => `+ ${a}`)].join(" · "));
  const improve = (text: string) => {
    const built = `Relight the room with ${warmth(kelvin)} light (${kelvin}K) at about ${brightness}% brightness, ${layers.toLowerCase()}${keep ? ", keeping the existing fixtures" : `, using ${fixtureStyle.toLowerCase()} fixtures`}${added.length ? `, and add ${added.join(" and ")}` : ""}. Keep the furniture and finishes as they are.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
  };

  const pins: Pin[] = pieces.map((x, i) => ({ id: x.id, at: x.at, n: i + 1, tone: "add", label: `+ ${short(x.note || x.label)}` }));

  return (
    <>
      <ToolScreen
        screen={screen}
        toolName="Lighting Reimagination"
        intro={{
          eyebrow: "Interior design",
          bullets: [
            "Upload a photo of the room as it is lit today.",
            "Set the warmth, brightness and layers of light, and preview them on your photo.",
            "Generate. Furniture and finishes stay; the light changes.",
          ],
          before: mockImage("d3c2ec623a320d15f878f1b36ffd42d98c2deeb3-1536x1024.png"),
          after: mockImage("03ac624ef968e00134d6783cb050827d2881a85a-1536x1024.png"),
          afterLabel: "Evening",
        }}
        steps={[
          { label: "Add your photo", short: "Photo" },
          { label: "Set the light", short: "Light" },
          { label: "Generate", short: "Generate" },
        ]}
        described={described}
        canGenerate={canGenerate}
        summary={summary}
        generateLabel={{ first: "Relight the room", again: "Regenerate" }}
        phases={phases}
        photoInfo={info.photo}
        referenceInfo={info.reference}
        prompt={{
          title: "How should it feel?",
          info: info.prompt,
          label: "Describe the lighting you want",
          placeholder: "Warmer, lower light: lamps rather than ceiling spots, a glow over the dining table…",
          improve,
        }}
        marking={kit.marking(pins, {
          change: "Tap where a light should go",
          add: "Tap where a light should go",
          placing: (a) => `Tap where the ${a.name.toLowerCase()} should go`,
        })}
        sourceOverlay={
          <>
            {preview && <LightPreview kelvin={kelvin} brightness={brightness} />}
            {pins.length > 0 && <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} />}
          </>
        }
      >
        <PanelSection title="Room type" info={info.roomType}>
          <Chips
            label="Room type"
            options={optionsOf(def, "roomType").map((o) => chip(o.value, roomIcons))}
            value={String(p.roomType)}
            onChange={(v) => s.setParam("roomType", v)}
          />
        </PanelSection>
        <PanelSection title="Lighting settings" info={info.settings}>
          <div className="space-y-5">
            <Slider
              label="Colour temperature"
              min={2200}
              max={5000}
              step={100}
              value={kelvin}
              format={(v) => `${v}K · ${warmth(v)}`}
              track={kelvinTrack}
              onChange={(v) => s.setParam("kelvin", v)}
            />
            <Slider label="Brightness" min={10} max={100} step={5} value={brightness} unit="%" onChange={(v) => s.setParam("brightness", v)} />
            <div>
              <SubLabel>Layers of light</SubLabel>
              <Chips
                label="Layers of light"
                options={optionsOf(def, "layers").map((o) => ({ value: o.value, glyph: <LevelGlyph level={layerLevels[o.value] ?? 1} /> }))}
                value={layers}
                onChange={(v) => s.setParam("layers", v)}
              />
            </div>
            <div className="rounded-xl border border-white/8 bg-white/3 p-3">
              <Toggle
                icon={GEye}
                label="Preview on my photo"
                hint="A quick tint for warmth and brightness, free and instant. Generate for the real thing."
                checked={preview}
                onChange={setPreview}
              />
            </div>
          </div>
        </PanelSection>
        <PanelSection title="Light fixture style" info={info.fixtures} meta={fixtureStyle}>
          <Chips
            label="Light fixture style"
            options={optionsOf(def, "fixtureStyle").map((o) => chip(o.value, fixtureIcons))}
            value={fixtureStyle}
            onChange={(v) => s.setParam("fixtureStyle", v)}
          />
        </PanelSection>
        <PanelSection title="Add lights" optional info={info.extras} meta={pieces.length ? `${pieces.length} added` : undefined}>
          <div className="space-y-2">
            <AddCard
              kit={kit}
              icon={GLampPendant}
              title="Place a light"
              hint="Describe a fixture, or bring in one you own."
              assetsLink="Choose from your lighting assets"
              disabled={!working.sourceImage}
              onEnter={showSource}
            />
            {pieces.length > 0 && (
              <div className="space-y-2 pt-1">
                {pieces.map((x, i) => (
                  <PieceRow
                    key={x.id}
                    n={i + 1}
                    piece={x}
                    tone="add"
                    actions={[]}
                    selected={x.id === kit.selectedId}
                    title={x.label}
                    placeholder="What it is: a brass wall light, warm…"
                    onSelect={() => kit.setSelectedId(x.id)}
                    onChange={(patch) => kit.update(x.id, patch)}
                    onRemove={() => kit.remove(x.id)}
                    onPickAsset={() => kit.setAssetFor(x.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </PanelSection>
      </ToolScreen>
      <AssetDialog kit={kit} type="lighting" noun="lighting" onPlace={showSource} />
    </>
  );
}
