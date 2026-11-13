"use client";

import { useMemo, useRef, useState } from "react";
import { Chips, OptionCard, PanelSection, PillButton, PinLayer, Slider, SubLabel, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GSelection } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile, type ToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged, summarize, type ToolDef } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip, outdoorStyles, timeIcons, weatherIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { AreaCard, SuggestionsCard, useAreaAssist } from "@/app/app/editor/[fileId]/_tools/outdoor/Assist";
import { GTrash, siteIcons } from "@/app/app/editor/[fileId]/_tools/outdoor/icons";
import StylePalettes from "@/app/app/editor/[fileId]/_tools/outdoor/StylePalettes";
import { mockImage } from "@/lib/mock/entities";
import type { Mark, Selection } from "@/lib/mock/editorState";

// One editor for Outdoor Visualization and Hardscape Design (the prototype's
// OutdoorScene). Hardscape adds "Surfaces": tap each built surface on the
// photo, then choose its material and laying pattern.

/** A marked surface (prototype selection zone). */
export type Zone = { id: string; at: Mark; type: string; material: string; pattern: string };
type ZoneTypes = { hint: string; types: { value: string; materials: string[]; patterns: string[] }[] };

// The shared Selection has no zones yet, so they ride along on it. They are
// cleared with the rest of the selection when the photo changes.
const zonesOf = (sel: Selection) => (sel.zones ?? []) as Zone[];
const withZones = (sel: Selection, zones: Zone[]): Selection => ({ ...sel, zones });

const info = {
  photo: "A photo of the outside as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A garden or facade you like. VastuNord borrows its materials and mood, not its layout.",
  time: "As photographed keeps the light in your photo.",
  style: "The overall outdoor language: planting, materials and how formal it feels.",
  lighting: "How much outdoor lighting to add: path lights, uplights, string lights.",
  surroundings: "Keep existing leaves that part of the scene as it is in the photo.",
  weather: "As photographed keeps your sky. Anything else changes the weather and the light with it.",
  assist: "Each of these is optional. Skip them and Generate works the same.",
  surfaces: "Tap each built surface, then say what it should be made of and how it is laid.",
};

const variants = {
  outdoor: {
    name: "Outdoor Visualization",
    prompt: {
      title: "Describe the outside",
      label: "Describe the outdoor space you want",
      placeholder: "A terrace that works in the evening: stone, deep planting, low light…",
      info: "Say what should change outside. Leave it empty and your choices below do the work.",
    },
  },
  hardscape: {
    name: "Hardscape Design",
    prompt: {
      title: "Anything else?",
      label: "Anything the surfaces do not say",
      placeholder: "Keep the existing steps, widen the terrace to the fence…",
      info: "Optional. The surfaces below already say what should change; add anything they do not.",
    },
  },
};

const surroundings: [string, string][] = [
  ["people", "People"],
  ["siteContext", "Site context"],
  ["greenery", "Greenery"],
  ["vehicles", "Vehicles"],
];

const lightingLevel = (v: number) => (v === 0 ? "None" : v < 30 ? "Subtle" : v < 65 ? "Ambient" : "Dramatic");

/** Where an area mark sits, in words, for "Analyze an area". */
function areaName(m: Mark) {
  if (m.y < 30) return "the sky and tree line";
  if (m.y > 75) return "the lawn and foreground";
  if (m.x < 25 || m.x > 75) return "the boundary and planting";
  return "the facade and entrance";
}

/** A first guess at the surface type from where it was tapped. */
function guessSurface(m: Mark) {
  if (m.y < 45) return "Retaining wall";
  if (m.y > 80) return "Terrace";
  if (m.x < 18 || m.x > 82) return "Edging";
  if (m.y > 62) return "Path";
  return "Steps";
}

/** History line: the surfaces when there are any, else the usual summary. */
function summarizeZones(def: ToolDef, s: ToolFile, zones: Zone[]) {
  if (def.zones && zones.length) {
    const first = zones.slice(0, 3).map((z) => `${z.type} — ${z.material.toLowerCase()}`);
    return zones.length > 3 ? `${first.join(", ")} +${zones.length - 3} more` : first.join(", ");
  }
  return summarize(def, s.working.params);
}

export default function OutdoorScene({ fileId, variant }: { fileId: string; variant: "outdoor" | "hardscape" }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const v = variants[variant];
  const hardscape = variant === "hardscape";
  const [marking, setMarking] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const zoneList = useRef<HTMLDivElement>(null);
  const area = useAreaAssist(s, areaName);
  const screen = useToolScreen(s, {
    onPhotoChange: () => {
      setMarking(false);
      setSelectedZone(null);
    },
    onBeforeGenerate: () => {
      setMarking(false);
      area.setActive(false);
    },
  });
  const showPhoto = () => {
    screen.setView("source");
    screen.showStage();
  };

  const zoneTypes = def.zones as ZoneTypes | undefined;
  const zones = zonesOf(working.selection);
  const typeOf = (value: string) => zoneTypes?.types.find((t) => t.value === value) ?? zoneTypes?.types[0];

  const addZone = (at: Mark) => {
    const t = typeOf(guessSurface(at));
    if (!t) return;
    const zone: Zone = {
      id: `zone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      at,
      type: t.value,
      material: t.materials[0],
      pattern: t.patterns[0],
    };
    s.commit((w) => ({ ...w, selection: withZones(w.selection, [...zonesOf(w.selection), zone]) }));
    setSelectedZone(zone.id);
    window.setTimeout(
      () => zoneList.current?.querySelector(`[data-zone="${zone.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      60
    );
  };
  const updateZone = (id: string, patch: Partial<Zone>) =>
    s.commit(
      (w) => ({ ...w, selection: withZones(w.selection, zonesOf(w.selection).map((z) => (z.id === id ? { ...z, ...patch } : z))) }),
      `zone:${id}`
    );
  const removeZone = (id: string) =>
    s.commit((w) => ({ ...w, selection: withZones(w.selection, zonesOf(w.selection).filter((z) => z.id !== id)) }));

  const pins: Pin[] = zones.map((z, i) => ({ id: z.id, at: z.at, n: i + 1, tone: "change", label: `${z.type} · ${z.material}` }));
  const zoneMarking =
    hardscape && marking && working.sourceImage
      ? {
          banner: "Tap each surface you want to redesign: a terrace, a path, the steps, a wall",
          layer: <PinLayer pins={pins} selectedId={selectedZone} interactive onTap={addZone} onSelect={setSelectedZone} />,
          canClear: zones.length > 0,
          onClear: () => s.commit((w) => ({ ...w, selection: withZones(w.selection, []) })),
          onDone: () => setMarking(false),
        }
      : null;

  const prompt = String(p.prompt ?? "");
  const lighting = Number(p.lightingDensity) || 0;
  const style = String(p.outdoorStyle);
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || area.areaPrompt.trim() || zones.length || changed);
  const canGenerate = !!working.sourceImage;

  const summary = () =>
    prompt.trim()
      ? prompt.trim()
      : hardscape && zones.length
        ? summarizeZones(def, s, zones)
        : area.areaPrompt.trim() && area.areaMark
          ? `${areaName(area.areaMark)}: ${area.areaPrompt.trim()}`
          : summarizeZones(def, s, []);

  /** "Improve": the user's words plus the style, lighting and surfaces. */
  const improve = (text: string) => {
    const surfaces = zones.length
      ? ` Surfaces: ${zones.map((z) => `${z.type.toLowerCase()} in ${z.material.toLowerCase()}, ${z.pattern.toLowerCase()}`).join("; ")}.`
      : "";
    const built = `A ${style.toLowerCase()} outdoor space with ${lightingLevel(lighting).toLowerCase()} outdoor lighting.${surfaces} Keep the building and boundaries as they are.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
  };

  return (
    <ToolScreen
      screen={screen}
      place="outside"
      toolName={v.name}
      intro={
        hardscape
          ? {
              eyebrow: "Exterior & landscape",
              bullets: [
                "Upload a photo of the garden, terrace or drive as it is now.",
                "Tap each surface, the terrace, path or steps, and choose its material and pattern.",
                "Generate. The house and boundaries stay where they are.",
              ],
              before: mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png"),
              after: mockImage("99fbe54b6d9928aff9cf5f81dfb9377073f3b72b-1537x1023.png"),
              afterLabel: "Hardscaped",
            }
          : {
              eyebrow: "Exterior & landscape",
              bullets: [
                "Upload a photo of the outside of the house, or the garden.",
                "Set the style, the light, the weather and what is around it.",
                "Generate. The building itself stays where it is.",
              ],
              before: mockImage("dbb051df03418dc7c1c1a9da96fadf04cec3b723-1472x1462.png"),
              after: mockImage("99de53884181f9f57d98c42ccbd3aa62e8506b70-2508x2508.png"),
              afterLabel: "Reimagined",
            }
      }
      steps={[
        { label: "Add your photo", short: "Photo" },
        hardscape ? { label: "Mark the surfaces", short: "Surfaces" } : { label: "Set the scene", short: "Scene" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={summary}
      generateLabel={{ first: hardscape ? "Design the hardscape" : "Visualize outside", again: "Regenerate" }}
      phases={[
        "Reading the site",
        "Keeping the building and boundaries",
        hardscape ? "Laying the new surfaces" : `Styling it ${style.toLowerCase()}`,
        "Matching the light and weather",
      ]}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{ ...v.prompt, improve }}
      marking={zoneMarking ?? area.marking}
      sourceOverlay={hardscape ? (pins.length ? <PinLayer pins={pins} selectedId={selectedZone} interactive={false} /> : null) : area.overlay}
    >
      <PanelSection title="Time of day" info={info.time}>
        <Chips
          label="Time of day"
          options={optionsOf(def, "timeOfDay").map((o) => chip(o.value, timeIcons))}
          value={String(p.timeOfDay)}
          onChange={(val) => s.setParam("timeOfDay", val)}
        />
      </PanelSection>
      <PanelSection title="Outdoor style" info={info.style} meta={style}>
        <StylePalettes
          wide
          label="Outdoor style"
          options={optionsOf(def, "outdoorStyle").map((o) => ({
            value: o.value,
            swatch: outdoorStyles[o.value]?.swatch ?? [],
            hint: outdoorStyles[o.value]?.hint,
          }))}
          value={style}
          onChange={(val) => s.setParam("outdoorStyle", val)}
        />
      </PanelSection>
      <PanelSection title="Outdoor lighting" info={info.lighting}>
        <Slider
          label="Lighting density"
          min={0}
          max={100}
          step={5}
          value={lighting}
          format={(n) => `${lightingLevel(n)} · ${n}%`}
          onChange={(n) => s.setParam("lightingDensity", n)}
        />
      </PanelSection>
      <PanelSection title="Content & surroundings" info={info.surroundings}>
        <div className="space-y-4">
          {surroundings.map(([id, label]) => (
            <div key={id}>
              <SubLabel>{label}</SubLabel>
              <Chips
                label={label}
                options={optionsOf(def, id).map((o) => chip(o.value, id === "siteContext" ? siteIcons : undefined))}
                value={String(p[id])}
                onChange={(val) => s.setParam(id, val)}
              />
            </div>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Weather" info={info.weather}>
        <Chips
          label="Weather"
          options={optionsOf(def, "weather").map((o) => chip(o.value, weatherIcons))}
          value={String(p.weather)}
          onChange={(val) => s.setParam("weather", val)}
        />
      </PanelSection>
      {hardscape && zoneTypes && (
        <PanelSection title="Surfaces" info={info.surfaces} meta={zones.length ? `${zones.length} marked` : undefined}>
          <div className="space-y-2">
            <OptionCard
              icon={GSelection}
              title="Mark surfaces"
              hint={zoneTypes.hint}
              active={marking}
              action={
                <PillButton
                  size="sm"
                  variant={marking ? "primary" : "ghost"}
                  label={marking ? "Marking" : "Mark"}
                  onClick={() => {
                    if (marking) return setMarking(false);
                    area.setActive(false);
                    setMarking(true);
                    showPhoto();
                  }}
                  disabled={!working.sourceImage}
                />
              }
            >
              {marking && (
                <p className="text-[11.5px] leading-5 text-cream/55">
                  Tap each surface on the photo, or{" "}
                  <button type="button" onClick={() => addZone({ x: 50, y: 85 })} className="text-ember-soft underline-offset-2 hover:underline">
                    add the terrace in front
                  </button>
                  .
                </p>
              )}
            </OptionCard>
            {zones.length > 0 && (
              <div ref={zoneList} className="space-y-2 pt-1">
                {zones.map((z, i) => {
                  const t = typeOf(z.type);
                  return (
                    <div
                      key={z.id}
                      data-zone={z.id}
                      onFocusCapture={() => setSelectedZone(z.id)}
                      className={`rounded-xl border p-3 transition-colors duration-200 ${z.id === selectedZone ? "border-white/30 bg-white/7" : "border-white/8 bg-white/3"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ember font-display text-[10.5px] font-semibold text-white">
                          {i + 1}
                        </span>
                        <p className="min-w-0 flex-1 truncate font-display text-[12.5px] font-medium text-white">
                          {z.type} · <span className="text-cream/60">{z.material.toLowerCase()}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => removeZone(z.id)}
                          aria-label={`Forget surface ${i + 1}`}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full text-cream/45 transition-colors duration-200 hover:bg-white/8 hover:text-white"
                        >
                          <GTrash size={13} />
                        </button>
                      </div>
                      <div className="mt-3 space-y-3 pl-8.5">
                        <div>
                          <SubLabel>Surface</SubLabel>
                          <Chips
                            label={`Surface ${i + 1} type`}
                            options={zoneTypes.types.map((o) => ({ value: o.value }))}
                            value={z.type}
                            onChange={(val) => {
                              const next = typeOf(val);
                              if (next) updateZone(z.id, { type: val, material: next.materials[0], pattern: next.patterns[0] });
                            }}
                          />
                        </div>
                        <div>
                          <SubLabel>Material</SubLabel>
                          <Chips
                            label={`Surface ${i + 1} material`}
                            options={(t?.materials ?? []).map((m) => ({ value: m }))}
                            value={z.material}
                            onChange={(val) => updateZone(z.id, { material: val })}
                          />
                        </div>
                        <div>
                          <SubLabel>Laying pattern</SubLabel>
                          <Chips
                            label={`Surface ${i + 1} pattern`}
                            options={(t?.patterns ?? []).map((m) => ({ value: m }))}
                            value={z.pattern}
                            onChange={(val) => updateZone(z.id, { pattern: val })}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PanelSection>
      )}
      <PanelSection title="AI assistance" optional info={info.assist}>
        <div className="space-y-2">
          <SuggestionsCard s={s} toolId={def.id} onUse={screen.focusPrompt} />
          {!hardscape && (
            <AreaCard s={s} area={area} onEnter={showPhoto} placeholder="Replace the lawn with a gravel garden and a single tree…" />
          )}
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
