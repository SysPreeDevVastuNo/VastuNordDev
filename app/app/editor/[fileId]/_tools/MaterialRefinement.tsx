"use client";

import { useMemo } from "react";
import { Chips, OptionCard, Palettes, PanelSection, PinLayer, SwatchDot, Toggle, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GShieldCheck, glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged, summarize } from "@/app/app/editor/[fileId]/_tools/defs";
import { PickCard, PieceRow, short, usePieces, type Piece, type Point } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GPaintRoller = glyph(
  "M232,88H216V64a16,16,0,0,0-16-16H48A16,16,0,0,0,32,64V88H16a8,8,0,0,0,0,16H32v24a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V104h16v50L131.6,182.65A16.07,16.07,0,0,0,120,198v34a8,8,0,0,0,16,0V198l100.4-28.68A16.07,16.07,0,0,0,248,154V104A16,16,0,0,0,232,88Zm-32,40H48V64H200v64Z",
  "M248,104v50a16.07,16.07,0,0,1-11.6,15.38L136,198v34a8,8,0,0,1-16,0V198a16.07,16.07,0,0,1,11.6-15.38L232,154V104H216v24a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V104H16a8,8,0,0,1,0-16H32V64A16,16,0,0,1,48,48H200a16,16,0,0,1,16,16V88h16A16,16,0,0,1,248,104Z"
);

const info = {
  photo: "A photo with the surfaces you want to change in view. Add other angles if you have them; the highlighted one is used.",
  reference: "A photo of materials you like. VastuNord borrows their colour, grain and finish.",
  prompt: "Say which materials should change, and to what. Leave it empty if you pick surfaces below.",
  palette: "Auto keeps colours that suit your materials. A palette pulls every new finish toward it.",
  edits: "Tap any surface, then choose what it should be made of. Layout and furniture stay put.",
};

const phases = ["Finding the surfaces", "Keeping shapes, layout and light", "Applying the new materials", "Matching grain, sheen and shadow"];

/** The materials offered for each kind of surface. */
const materials: Record<string, { name: string; hex: string }[]> = {
  Floor: [
    { name: "Pale oak", hex: "#d8c3a2" },
    { name: "Smoked oak", hex: "#6f5642" },
    { name: "Walnut", hex: "#5d4030" },
    { name: "Terrazzo", hex: "#e2dbd0" },
    { name: "Polished concrete", hex: "#9d9b96" },
    { name: "Travertine", hex: "#d9c9ad" },
  ],
  Wall: [
    { name: "Limewash", hex: "#e8e0d4" },
    { name: "Matt paint", hex: "#f1efe9" },
    { name: "Microcement", hex: "#b7b1a8" },
    { name: "Timber panelling", hex: "#a07c58" },
    { name: "Zellige tile", hex: "#7f9c8f" },
  ],
  Worktop: [
    { name: "Marble", hex: "#ece8e2" },
    { name: "Terrazzo", hex: "#e2dbd0" },
    { name: "Quartz", hex: "#f4f2ee" },
    { name: "Solid oak", hex: "#c49a6c" },
    { name: "Stainless steel", hex: "#b9bcbf" },
  ],
  "Cabinet fronts": [
    { name: "Painted sage", hex: "#7f9277" },
    { name: "Painted navy", hex: "#24344d" },
    { name: "Oak veneer", hex: "#c9a57b" },
    { name: "Walnut veneer", hex: "#5d4030" },
    { name: "Matt white", hex: "#f3f1ed" },
  ],
  Upholstery: [
    { name: "Linen", hex: "#d9d0c1" },
    { name: "Bouclé", hex: "#ebe5da" },
    { name: "Leather", hex: "#7a4b31" },
    { name: "Velvet", hex: "#3f5246" },
    { name: "Wool", hex: "#a59c8f" },
  ],
  Ceiling: [
    { name: "Matt white", hex: "#f3f1ed" },
    { name: "Timber slats", hex: "#b38a5f" },
    { name: "Limewash", hex: "#e8e0d4" },
  ],
};
/** A surface's materials; unknown surfaces get a mixed handful. */
const materialsFor = (surface: string) => materials[surface] ?? Object.values(materials).flat().slice(0, 8);

/** What surface sits at a point on the photo (simulated analysis). */
function readSurface(at: Point) {
  if (at.y < 20) return "Ceiling";
  if (at.y > 76) return "Floor";
  if (at.y < 46) return at.x < 25 || at.x > 75 ? "Wall" : "Cabinet fronts";
  if (at.y < 60) return "Worktop";
  return at.x > 60 ? "Upholstery" : "Cabinet fronts";
}

const describe = (p: Piece) => `${p.label.toLowerCase()} in ${p.note.trim().toLowerCase() || "a new material"}`;
const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export default function MaterialRefinement({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const kit = usePieces(s, {
    key: "surfaces",
    read: readSurface,
    defaultAction: "material",
    addAction: "material",
    addLabel: "Surface",
    readable: true,
    unclearLabel: "Surface",
  });
  const screen = useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const prompt = String(p.prompt ?? "");
  const childSafe = p.childSafe === true;
  const surfaces = kit.pieces;
  const chosen = surfaces.filter((x) => x.note.trim());
  const noPhoto = !working.sourceImage;

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || chosen.length || changed);
  const canGenerate = !noPhoto;

  const summary = () => {
    const base = prompt.trim() ? prompt.trim() : chosen.length ? capital(chosen.map(describe).join("; ")) : summarize(def, p);
    return childSafe ? `${base} · child-safe` : base;
  };

  const improve = (text: string) => {
    const built = `Refine the materials: ${chosen.length ? chosen.map(describe).join(", ") : "warmer, more natural materials throughout"}. Keep the layout, furniture shapes and light exactly as they are.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
  };

  const pins: Pin[] = surfaces.map((x, i) => ({
    id: x.id,
    at: x.at,
    n: i + 1,
    tone: "change",
    label: `${x.label} → ${short(x.note || "?", 18)}`,
  }));

  return (
    <ToolScreen
      screen={screen}
      toolName="Material Refinement"
      intro={{
        eyebrow: "Interior design",
        bullets: [
          "Upload a photo of the room with the surfaces you want to change.",
          "Tap a floor, wall, worktop or sofa, and choose what it should be made of.",
          "Generate. Shapes, layout and light stay exactly where they are.",
        ],
        before: mockImage("3a82a11603438139b4485d7a453302df8f17af25-1600x1076.png"),
        after: mockImage("7f6470593408f0adaf2770a81063b46f7b776932-3074x2046.png"),
        afterLabel: "Refined",
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Choose materials", short: "Materials" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={summary}
      generateLabel={{ first: "Refine materials", again: "Regenerate" }}
      phases={phases}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Which materials?",
        info: info.prompt,
        label: "Describe the material change",
        placeholder: "Warmer materials: oak instead of laminate, matt instead of gloss…",
        improve,
      }}
      marking={kit.marking(pins, {
        change: "Tap each surface whose material should change",
        add: "Tap a surface",
        placing: () => "Tap a surface",
      })}
      sourceOverlay={pins.length ? <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} /> : null}
    >
      <PanelSection title="Colour palette" info={info.palette}>
        <Palettes
          label="Colour palette"
          options={optionsOf(def, "palette").map((o) => ({ value: o.value, swatch: o.swatch ?? [] }))}
          value={String(p.palette)}
          onChange={(v) => s.setParam("palette", v)}
        />
      </PanelSection>
      <PanelSection
        title="Surfaces"
        optional
        info={info.edits}
        meta={surfaces.length ? `${chosen.length} of ${surfaces.length} chosen` : undefined}
      >
        <div className="space-y-2">
          <PickCard
            kit={kit}
            icon={GPaintRoller}
            title="Change a surface or object"
            hint="Tap a floor, wall, worktop or sofa on the photo."
            centre="pick the surface in the centre"
            disabled={noPhoto}
            onEnter={showSource}
          />
          {surfaces.length > 0 && (
            <div className="space-y-2 pt-1">
              {surfaces.map((x, i) => {
                const options = materialsFor(x.label);
                const custom = !!x.note.trim() && !options.some((m) => m.name === x.note);
                const name = x.label.toLowerCase();
                return (
                  <PieceRow
                    key={x.id}
                    n={i + 1}
                    piece={x}
                    tone="change"
                    actions={[]}
                    selected={x.id === kit.selectedId}
                    title={x.label}
                    placeholder=""
                    onSelect={() => kit.setSelectedId(x.id)}
                    onChange={(patch) => kit.update(x.id, patch)}
                    onRemove={() => kit.remove(x.id)}
                  >
                    <div className="space-y-2">
                      <Chips
                        label={`Material for the ${name}`}
                        options={options.map((m) => ({ value: m.name, glyph: <SwatchDot color={m.hex} /> }))}
                        value={x.note}
                        onChange={(v) => kit.update(x.id, { note: v })}
                      />
                      <input
                        type="text"
                        value={custom ? x.note : ""}
                        maxLength={80}
                        onChange={(e) => kit.update(x.id, { note: e.target.value })}
                        aria-label={`Or describe the material for the ${name}`}
                        placeholder="Or describe it: brushed brass, green zellige…"
                        autoComplete="off"
                        className="block min-h-9 w-full rounded-lg border border-white/12 bg-black/25 px-3 text-[12px] text-white placeholder:text-cream/30 focus:border-white/35 focus:outline-none"
                      />
                    </div>
                  </PieceRow>
                );
              })}
            </div>
          )}
          <OptionCard>
            <Toggle
              icon={GShieldCheck}
              label="Make it child safe"
              hint="Wipeable, non-slip and rounded where it matters. A design direction, not a safety check."
              checked={childSafe}
              onChange={(v) => s.setParam("childSafe", v)}
            />
          </OptionCard>
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
