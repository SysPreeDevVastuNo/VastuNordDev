"use client";

import { useMemo } from "react";
import { Chips, OptionCard, PanelSection, PinLayer, Toggle, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GSelection, GShieldCheck, GSparkle, GSparkleFill, glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip } from "@/app/app/editor/[fileId]/_tools/options";
import { AddCard, AssetDialog, PickCard, PieceRow, assetById, short, usePieces, type Piece, type Point } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GFlower = glyph(
  "M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM104,128a24,24,0,1,1,24,24A24,24,0,0,1,104,128Zm74.35-56.79a24,24,0,1,1,24,41.57c-6.27,3.63-18.61,6.13-35.16,7.19A40,40,0,0,0,154.53,98.1C163.73,84.28,172.08,74.84,178.35,71.21ZM128,32a24,24,0,0,1,24,24c0,7.24-4,19.19-11.36,34.06a39.81,39.81,0,0,0-25.28,0C108,75.19,104,63.24,104,56A24,24,0,0,1,128,32ZM44.86,80a24,24,0,0,1,32.79-8.79c6.27,3.63,14.62,13.07,23.82,26.89A40,40,0,0,0,88.81,120c-16.55-1.06-28.89-3.56-35.16-7.18A24,24,0,0,1,44.86,80ZM77.65,184.79a24,24,0,1,1-24-41.57c6.27-3.63,18.61-6.13,35.16-7.19a40,40,0,0,0,12.66,21.87C92.27,171.72,83.92,181.16,77.65,184.79ZM128,224a24,24,0,0,1-24-24c0-7.24,4-19.19,11.36-34.06a39.81,39.81,0,0,0,25.28,0C148,180.81,152,192.76,152,200A24,24,0,0,1,128,224Zm83.14-48a24,24,0,0,1-32.79,8.79c-6.27-3.63-14.62-13.07-23.82-26.89A40,40,0,0,0,167.19,136c16.55,1.06,28.89,3.56,35.16,7.18A24,24,0,0,1,211.14,176Z",
  "M210.35,129.36c-.81-.47-1.7-.92-2.62-1.36.92-.44,1.81-.89,2.62-1.36a40,40,0,1,0-40-69.28c-.81.47-1.65,1-2.48,1.59.08-1,.13-2,.13-3a40,40,0,0,0-80,0c0,.94,0,1.94.13,3-.83-.57-1.67-1.12-2.48-1.59a40,40,0,1,0-40,69.28c.81.47,1.7.92,2.62,1.36-.92.44-1.81.89-2.62,1.36a40,40,0,1,0,40,69.28c.81-.47,1.65-1,2.48-1.59-.08,1-.13,2-.13,2.95a40,40,0,0,0,80,0c0-.94-.05-1.94-.13-2.95.83.57,1.67,1.12,2.48,1.59A39.79,39.79,0,0,0,190.29,204a40.43,40.43,0,0,0,10.42-1.38,40,40,0,0,0,9.64-73.28ZM128,156a28,28,0,1,1,28-28A28,28,0,0,1,128,156Z"
);

const info = {
  photo: "A photo of the room as it is styled today. Add other angles if you have them; the highlighted one is used.",
  reference: "A room whose styling you like. VastuNord borrows its objects, colours and textures, not its furniture.",
  prompt: "Say how the styling should feel. Leave it empty and the decor style below does the work.",
  style: "Each direction is a set of colours and materials. It sets which objects, textiles and art appear.",
  aspect: "Original keeps your photo’s framing. Other ratios crop or extend the edges.",
  edits: "Restyle or clear one surface at a time, or bring in decor you already own. All optional.",
};

const decorStyles: Record<string, { swatch: string[]; hint: string }> = {
  "Warm minimal": { swatch: ["#ece3d6", "#bc9f7d", "#6b5947"], hint: "Linen · oak · stoneware" },
  Gallery: { swatch: ["#f3f1ec", "#1c1917", "#b5462f"], hint: "Framed art · plinths · bare shelves" },
  "Layered textile": { swatch: ["#dcc0a3", "#8e5c3d", "#4f5d4b"], hint: "Throws · rugs · cushions" },
  "Mid-century": { swatch: ["#d98e3f", "#2f5d62", "#6b4226"], hint: "Teak · ceramics · graphic prints" },
  Coastal: { swatch: ["#eef2ef", "#9fb8bf", "#c7b49a"], hint: "Rattan · linen · driftwood" },
  Monochrome: { swatch: ["#f4f4f2", "#8a8a86", "#1f1f1e"], hint: "Black frames · glass · stone" },
};

const phases = (style: string) => [
  "Finding the decor",
  "Keeping furniture, walls and floor",
  `Styling it ${style.toLowerCase()}`,
  "Balancing the details",
];

/** What surface sits at a point on the photo (simulated analysis). */
function readSpot(at: Point) {
  if (at.y < 30) return "Wall art";
  if (at.y > 76) return "Rug and floor";
  if (at.x < 24) return "Shelf";
  if (at.x > 76) return "Side table";
  if (at.y > 52) return "Tabletop";
  return "Cushions and throws";
}

const actions = [
  { value: "restyle", label: "Restyle" },
  { value: "clear", label: "Clear" },
];
const toneOf = (p: Piece) => (p.action === "clear" ? "remove" : p.action === "add" ? "add" : "change");

/** One spot as a clause: "restyle the shelf with stoneware". */
function describe(p: Piece, style: string) {
  const name = p.label.toLowerCase();
  const what = p.note.trim() || assetById(p.assetId)?.name.toLowerCase() || "";
  if (p.action === "clear") return `clear the ${name}`;
  if (p.action === "add") return `add ${what || `${style.toLowerCase()} decor`}`;
  return `restyle the ${name}${what ? ` with ${what}` : ` ${style.toLowerCase()}`}`;
}
const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Two-up palette cards with a hint line (the prototype's wide Palettes). */
function StylePalettes({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; swatch: string[]; hint?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-xl border p-2 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
          >
            {o.swatch.length ? (
              <span className="flex h-7 overflow-hidden rounded-md">
                {o.swatch.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </span>
            ) : (
              <span className="flex h-7 items-center justify-center gap-1 rounded-md border border-dashed border-white/25 text-cream/60">
                {on ? <GSparkleFill size={13} className="text-ember-soft" /> : <GSparkle size={13} />}
              </span>
            )}
            <span className={`mt-1.5 block truncate text-[11px] ${on ? "text-white" : "text-cream/65"}`}>{o.value}</span>
            {o.hint && <span className="mt-0.5 block text-[10.5px] leading-4 text-cream/45">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function DecorRedefinition({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const kit = usePieces(s, {
    key: "decor",
    read: readSpot,
    defaultAction: "restyle",
    addAction: "add",
    addLabel: "New decor",
    readable: true,
    unclearLabel: "Unclear spot",
  });
  const screen = useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const style = String(p.decorStyle);
  const prompt = String(p.prompt ?? "");
  const childSafe = p.childSafe === true;
  const { pieces } = kit;
  const noPhoto = !working.sourceImage;

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || pieces.length || changed);
  const canGenerate = !noPhoto;

  const summary = () => {
    const base = prompt.trim() ? prompt.trim() : pieces.length ? capital(pieces.map((x) => describe(x, style)).join("; ")) : `${style} decor`;
    return childSafe ? `${base} · child-safe` : base;
  };

  const improve = (text: string) => {
    const look = decorStyles[style];
    const spots = pieces.length ? `${pieces.map((x) => describe(x, style)).join(", ")}, ` : "";
    const built = `${capital(spots)}${spots ? "in" : "Restyle the decor in"} a ${style.toLowerCase()} direction${look ? ` (${look.hint.toLowerCase().split(" · ").join(", ")})` : ""}. Keep the furniture, walls and floor as they are.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
  };

  const pins: Pin[] = pieces.map((x, i) => ({
    id: x.id,
    at: x.at,
    n: i + 1,
    tone: toneOf(x),
    label:
      x.action === "clear"
        ? x.label
        : x.action === "add"
          ? `+ ${short(x.note || x.label)}`
          : `${x.label} → ${short(x.note || assetById(x.assetId)?.name || style)}`,
  }));

  return (
    <>
      <ToolScreen
        screen={screen}
        toolName="Decor Re-definition"
        intro={{
          eyebrow: "Interior design",
          bullets: [
            "Upload a photo of the room as it is styled today.",
            "Pick a decor direction, then restyle or clear shelves, walls and tabletops.",
            "Generate. Furniture, walls and floors stay as they are.",
          ],
          before: mockImage("bdcf717e30b4020f8232728cca42fb940025c473-1535x1024.png"),
          after: mockImage("d3c2ec623a320d15f878f1b36ffd42d98c2deeb3-1536x1024.png"),
          afterLabel: "Restyled",
        }}
        steps={[
          { label: "Add your photo", short: "Photo" },
          { label: "Choose the styling", short: "Styling" },
          { label: "Generate", short: "Generate" },
        ]}
        described={described}
        canGenerate={canGenerate}
        summary={summary}
        generateLabel={{ first: "Redefine decor", again: "Regenerate" }}
        phases={phases(style)}
        photoInfo={info.photo}
        referenceInfo={info.reference}
        prompt={{
          title: "How should it feel?",
          info: info.prompt,
          label: "Describe the decor you want",
          placeholder: "Quieter decor: fewer objects, warmer textiles, one large artwork over the sofa…",
          improve,
        }}
        marking={kit.marking(pins, {
          change: "Tap a shelf, wall or tabletop to restyle or clear it",
          add: "Tap where new decor should go",
          placing: (a) => `Tap where the ${a.name.toLowerCase()} should go`,
        })}
        sourceOverlay={pins.length ? <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} /> : null}
      >
        <PanelSection title="Decor style" info={info.style} meta={style}>
          <StylePalettes
            label="Decor style"
            options={optionsOf(def, "decorStyle").map((o) => ({
              value: o.value,
              swatch: decorStyles[o.value]?.swatch ?? [],
              hint: decorStyles[o.value]?.hint,
            }))}
            value={style}
            onChange={(v) => s.setParam("decorStyle", v)}
          />
        </PanelSection>
        <PanelSection title="Aspect ratio" info={info.aspect}>
          <Chips
            label="Aspect ratio"
            options={optionsOf(def, "aspect").map((o) => chip(o.value))}
            value={String(p.aspect)}
            onChange={(v) => s.setParam("aspect", v)}
          />
        </PanelSection>
        <PanelSection
          title="Decor edits"
          optional
          info={info.edits}
          meta={pieces.length ? `${pieces.length} ${pieces.length === 1 ? "spot" : "spots"}` : undefined}
        >
          <div className="space-y-2">
            <PickCard
              kit={kit}
              icon={GSelection}
              title="Restyle or clear a spot"
              hint="Tap a shelf, a wall or a tabletop on the photo."
              centre="pick the spot in the centre"
              disabled={noPhoto}
              onEnter={showSource}
            />
            <AddCard
              kit={kit}
              icon={GFlower}
              title="Add decor"
              hint="Describe a piece, or bring in one you own."
              assetsLink="Choose from your decor assets"
              disabled={noPhoto}
              onEnter={showSource}
            />
            {pieces.length > 0 && (
              <div className="space-y-2 pt-1">
                {pieces.map((x, i) => (
                  <PieceRow
                    key={x.id}
                    n={i + 1}
                    piece={x}
                    tone={toneOf(x)}
                    actions={x.action === "add" ? [] : actions}
                    selected={x.id === kit.selectedId}
                    title={x.action === "add" ? `Add ${x.label}` : x.label}
                    placeholder={
                      x.action === "add"
                        ? "What goes here: a large ceramic vase…"
                        : `Restyle with: ${decorStyles[style]?.hint.toLowerCase() ?? "new pieces"}…`
                    }
                    removeCopy="Cleared back to an empty surface. Nothing new is added here."
                    onSelect={() => kit.setSelectedId(x.id)}
                    onChange={(patch) => kit.update(x.id, patch)}
                    onRemove={() => kit.remove(x.id)}
                    onPickAsset={() => kit.setAssetFor(x.id)}
                  />
                ))}
              </div>
            )}
            <OptionCard>
              <Toggle
                icon={GShieldCheck}
                label="Make it child safe"
                hint="Nothing breakable within reach, soft edges. A design direction, not a safety check."
                checked={childSafe}
                onChange={(v) => s.setParam("childSafe", v)}
              />
            </OptionCard>
          </div>
        </PanelSection>
      </ToolScreen>
      <AssetDialog kit={kit} type="decor" noun="decor" onPlace={showSource} />
    </>
  );
}
