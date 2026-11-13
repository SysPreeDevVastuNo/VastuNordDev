"use client";

import { useMemo } from "react";
import { Chips, OptionCard, PanelSection, PillButton, PinLayer, StyleTiles, Toggle, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GSelection, GShieldCheck, glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { isAuto, optionsOf, settingsChanged, summarize } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip, roomIcons, timeIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { AddCard, AssetDialog, PickCard, PieceRow, assetById, short, usePieces, type Piece, type Point } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GArmchair = glyph(
  "M216,88.8V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V88.8a40,40,0,0,0,0,78.4V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V167.2a40,40,0,0,0,0-78.4ZM80,48h96a24,24,0,0,1,24,24V88.8A40.07,40.07,0,0,0,168,128H88A40.07,40.07,0,0,0,56,88.8V72A24,24,0,0,1,80,48ZM208.39,152H208a8,8,0,0,0-8,8v40H56V160a8,8,0,0,0-8-8h-.39A24,24,0,1,1,72,128v40a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V128a24,24,0,1,1,24.39,24Z",
  "M240,132a28,28,0,0,1-24,27.71V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V159.71A28,28,0,1,1,72,132v36a8,8,0,0,0,16,0V144h80v24a8,8,0,0,0,16,0V132a28,28,0,0,1,56,0ZM44,88a44.06,44.06,0,0,1,43.81,40h80.38A44.06,44.06,0,0,1,212,88a4,4,0,0,0,4-4V72a40,40,0,0,0-40-40H80A40,40,0,0,0,40,72V84A4,4,0,0,0,44,88Z"
);
const GBroom = glyph(
  "M235.5,216.81c-22.56-11-35.5-34.58-35.5-64.8V134.73a15.94,15.94,0,0,0-10.09-14.87L165,110a8,8,0,0,1-4.48-10.34l21.32-53a28,28,0,0,0-16.1-37,28.14,28.14,0,0,0-35.82,16,.61.61,0,0,0,0,.12L108.9,79a8,8,0,0,1-10.37,4.49L73.11,73.14A15.89,15.89,0,0,0,55.74,76.8C34.68,98.45,24,123.75,24,152a111.45,111.45,0,0,0,31.18,77.53A8,8,0,0,0,61,232H232a8,8,0,0,0,3.5-15.19ZM67.14,88l25.41,10.3a24,24,0,0,0,31.23-13.45l21-53c2.56-6.11,9.47-9.27,15.43-7a12,12,0,0,1,6.88,15.92L145.69,93.76a24,24,0,0,0,13.43,31.14L184,134.73V152c0,.33,0,.66,0,1L55.77,101.71A108.84,108.84,0,0,1,67.14,88Zm48,128a87.53,87.53,0,0,1-24.34-42,8,8,0,0,0-15.49,4,105.16,105.16,0,0,0,18.36,38H64.44A95.54,95.54,0,0,1,40,152a85.9,85.9,0,0,1,7.73-36.29l137.8,55.12c3,18,10.56,33.48,21.89,45.16Z",
  "M235.29,216.7C212.86,205.69,200,182.12,200,152V134.69a15.94,15.94,0,0,0-10.09-14.87l-28.65-11.46A8,8,0,0,1,156.79,98l22.32-56.67C184,28.79,178,14.21,165.34,9.51a24,24,0,0,0-30.7,13.71L112.25,80.08a8,8,0,0,1-10.41,4.5L73.11,73.08a15.91,15.91,0,0,0-17.38,3.66C34.68,98.4,24,123.71,24,152a111.53,111.53,0,0,0,31.15,77.53A8.06,8.06,0,0,0,61,232H232a8,8,0,0,0,8-7.51A8.21,8.21,0,0,0,235.29,216.7ZM115.11,216a87.52,87.52,0,0,1-24.26-41.71,8.21,8.21,0,0,0-9.25-6.18A8,8,0,0,0,75.28,178a105.33,105.33,0,0,0,18.36,38H64.44A95.62,95.62,0,0,1,40,152a85.92,85.92,0,0,1,7.73-36.3l137.8,55.13c3,18.06,10.55,33.5,21.89,45.19Z"
);
/** One-click refresh always shows the filled wand. */
const GMagicWandFill = glyph(
  "M248,152a8,8,0,0,1-8,8H224v16a8,8,0,0,1-16,0V160H192a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,248,152ZM56,72H72V88a8,8,0,0,0,16,0V72h16a8,8,0,0,0,0-16H88V40a8,8,0,0,0-16,0V56H56a8,8,0,0,0,0,16ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80ZM208,68.69,187.31,48l-32,32L176,100.69Z"
);

const info = {
  photo: "A photo of the room with its furniture as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A room whose furniture you like. VastuNord borrows the shapes and materials, not the layout.",
  prompt: "Say what should change about the furniture. Leave it empty if you pick pieces below.",
  roomType: "Auto-detect reads it from the photo. It decides which pieces make sense in the room.",
  roomStyle: "The direction for every new piece: shapes, materials and finish.",
  time: "As photographed keeps your photo’s light, so new pieces sit in it naturally.",
  edits: "Pick pieces on the photo, add new ones, or refresh everything in one click. All optional.",
};

const phases = (style: string) => [
  "Finding the furniture",
  "Keeping walls, floor and windows",
  `Placing ${style.toLowerCase()} pieces`,
  "Matching shadows and scale",
];

/** What piece of furniture sits at a point on the photo (simulated analysis). */
function readPiece(at: Point) {
  if (at.y < 32) return "Pendant light";
  if (at.y > 78) return "Rug";
  if (at.x < 22) return "Armchair";
  if (at.x > 78) return "Sideboard";
  if (at.y > 58 && at.x > 38 && at.x < 62) return "Coffee table";
  if (at.x > 64) return "Floor lamp";
  return "Sofa";
}

const actions = [
  { value: "replace", label: "Swap" },
  { value: "remove", label: "Remove" },
];
const toneOf = (p: Piece) => (p.action === "remove" ? "remove" : p.action === "add" ? "add" : "change");

/** One piece as a clause: "swap the sofa for a low linen one". */
function describe(p: Piece, style: string) {
  const name = p.label.toLowerCase();
  const what = p.note.trim() || assetById(p.assetId)?.name.toLowerCase() || "";
  if (p.action === "remove") return `remove the ${name}`;
  if (p.action === "add") return `add ${what || `a ${style.toLowerCase()} piece`}`;
  return `swap the ${name} for ${what || `a ${style.toLowerCase()} one`}`;
}
const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export default function FurnitureRefresh({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const kit = usePieces(s, {
    key: "pieces",
    read: readPiece,
    defaultAction: "replace",
    addAction: "add",
    addLabel: "New piece",
    readable: true,
    unclearLabel: "Unclear piece",
  });
  const screen = useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const style = String(p.roomStyle);
  const prompt = String(p.prompt ?? "");
  const cleanUp = p.cleanUp === true;
  const childSafe = p.childSafe === true;
  const { pieces } = kit;
  const noPhoto = !working.sourceImage;

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || pieces.length || cleanUp || changed);
  const canGenerate = !noPhoto;

  const extras = () => [cleanUp ? "cleaned up" : "", childSafe ? "child-safe" : ""].filter(Boolean);
  const summary = () =>
    [
      prompt.trim() ? prompt.trim() : pieces.length ? capital(pieces.map((x) => describe(x, style)).join("; ")) : summarize(def, p),
      ...extras(),
    ].join(" · ");

  const improve = (text: string) => {
    const room = isAuto(p.roomType) ? "room" : String(p.roomType).toLowerCase();
    const changes = pieces.length ? pieces.map((x) => describe(x, style)).join(", ") : `restyle the furniture as ${style.toLowerCase()}`;
    const built = `In this ${room}, ${changes}. Keep the walls, floor, windows and layout as they are${cleanUp ? ", and clear the clutter" : ""}.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : capital(built);
  };

  const refreshNow = () => {
    if (!working.sourceImage || s.processing) return;
    screen.generate(["One-click refresh", style, ...extras()].join(" · "));
  };

  const pins: Pin[] = pieces.map((x, i) => ({
    id: x.id,
    at: x.at,
    n: i + 1,
    tone: toneOf(x),
    label:
      x.action === "remove"
        ? x.label
        : x.action === "add"
          ? `+ ${short(x.note || x.label)}`
          : `${x.label} → ${short(x.note || assetById(x.assetId)?.name || "new")}`,
  }));

  return (
    <>
      <ToolScreen
        screen={screen}
        toolName="Furniture Refresh"
        intro={{
          eyebrow: "Interior design",
          bullets: [
            "Upload a photo of the room with its furniture as it is now.",
            "Pick pieces to swap, remove or add, or refresh everything in one click.",
            "Generate. Walls, floors and windows stay exactly where they are.",
          ],
          before: mockImage("2f2c2ebc1c59732e8606ff57ebe43ff02d8c1843-7360x4912.png"),
          after: mockImage("2b1a5cdf71c6937f84a7834d655707ba27748e4e-1535x1025.png"),
          afterLabel: "Refreshed",
        }}
        steps={[
          { label: "Add your photo", short: "Photo" },
          { label: "Choose what changes", short: "Changes" },
          { label: "Generate", short: "Generate" },
        ]}
        described={described}
        canGenerate={canGenerate}
        summary={summary}
        generateLabel={{ first: "Refresh furniture", again: "Regenerate" }}
        phases={phases(style)}
        photoInfo={info.photo}
        referenceInfo={info.reference}
        prompt={{
          title: "What should change?",
          info: info.prompt,
          label: "Describe the furniture change",
          placeholder: "Swap the sofa for something low and linen, keep the rug and the shelving…",
          improve,
        }}
        marking={kit.marking(pins, {
          change: "Tap each piece of furniture you want to change",
          add: "Tap an empty spot to add a piece there",
          placing: (a) => `Tap where the ${a.name.toLowerCase()} should go`,
        })}
        sourceOverlay={pins.length ? <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} /> : null}
      >
        <PanelSection title="Room type" info={info.roomType}>
          <Chips
            label="Room type"
            options={optionsOf(def, "roomType").map((o) => chip(o.value, roomIcons))}
            value={String(p.roomType)}
            onChange={(v) => s.setParam("roomType", v)}
          />
        </PanelSection>
        <PanelSection title="Furniture style" info={info.roomStyle} meta={style}>
          <StyleTiles
            label="Furniture style"
            options={optionsOf(def, "roomStyle").map((o) => ({ value: o.value, preview: o.preview ?? "" }))}
            value={style}
            onChange={(v) => s.setParam("roomStyle", v)}
          />
        </PanelSection>
        <PanelSection title="Time of day" info={info.time}>
          <Chips
            label="Time of day"
            options={optionsOf(def, "timeOfDay").map((o) => chip(o.value, timeIcons))}
            value={String(p.timeOfDay)}
            onChange={(v) => s.setParam("timeOfDay", v)}
          />
        </PanelSection>
        <PanelSection
          title="Furniture edits"
          optional
          info={info.edits}
          meta={pieces.length ? `${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"}` : undefined}
        >
          <div className="space-y-2">
            <div className="rounded-xl border border-ember/35 bg-ember/8 p-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember-soft">
                  <GMagicWandFill size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[13px] font-medium text-white">One-click refresh</p>
                  <p className="mt-0.5 text-[11.5px] leading-5 text-cream/60">
                    Every piece restyled {style.toLowerCase()}, same layout. Nothing else to set.
                  </p>
                </div>
                <PillButton size="sm" label="Refresh now" onClick={refreshNow} disabled={noPhoto || !!s.processing} />
              </div>
            </div>
            <PickCard
              kit={kit}
              icon={GSelection}
              title="Change pieces on the photo"
              hint="Tap a sofa, lamp or table, then swap or remove it."
              centre="pick the one in the centre"
              disabled={noPhoto}
              onEnter={showSource}
            />
            <AddCard
              kit={kit}
              icon={GArmchair}
              title="Add a piece"
              hint="Describe something new, or bring in one from your assets."
              assetsLink="Choose from your furniture assets"
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
                    placeholder={x.action === "add" ? "What goes here: a reading chair…" : `Swap it for: a ${style.toLowerCase()} one…`}
                    removeCopy="Taken out, with the floor and wall filled in behind it."
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
                icon={GBroom}
                label="Clean up the room"
                hint="Clear loose items, cables and piles first. Furniture stays unless you change it."
                checked={cleanUp}
                onChange={(v) => s.setParam("cleanUp", v)}
              />
            </OptionCard>
            <OptionCard>
              <Toggle
                icon={GShieldCheck}
                label="Make it child safe"
                hint="Rounded edges, fewer breakables within reach. A design direction, not a safety check."
                checked={childSafe}
                onChange={(v) => s.setParam("childSafe", v)}
              />
            </OptionCard>
          </div>
        </PanelSection>
      </ToolScreen>
      <AssetDialog kit={kit} type="furniture" noun="furniture" onPlace={showSource} />
    </>
  );
}
