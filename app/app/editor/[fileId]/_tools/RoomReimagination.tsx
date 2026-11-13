"use client";

import { useMemo, useState } from "react";
import { Chips, OptionCard, Palettes, PanelSection, PillButton, PromptBox, StyleTiles, SubLabel, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import { GPencilSimple, GPlus, GSelection, GShieldCheck, GSparkle } from "@/app/app/editor/[fileId]/_ui/icons";
import MarkLayer from "@/app/app/editor/[fileId]/_ui/MarkLayer";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { isAuto, optionsOf, settingsChanged, summarize, type Params } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip, lightingIcons, roomIcons, timeIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { mockImage } from "@/lib/mock/entities";
import type { Mark } from "@/lib/mock/editorState";

const info = {
  photo: "Upload one photo, or a few angles of the same room. The highlighted photo is the one the next generation works from.",
  reference: "A photo of a room you like. VastuNord borrows its materials and mood, never its layout.",
  prompt: "Say what should change and what should stay. Leave it empty and your choices below do the work.",
  roomType: "Auto-detect reads it from the photo. Set it yourself if the room is mid-renovation or empty.",
  roomStyle: "The overall design language. It sets furniture shapes, materials and detailing.",
  palette: "Auto picks colours that suit the style. A palette here overrides it.",
  interior: "Keep existing leaves that part of the room as it is in the photo.",
  time: "As photographed keeps the light in your photo, which is usually the most believable.",
  aspect: "Original keeps your photo’s framing. Other ratios crop or extend the edges.",
  extras: "Each of these is optional. Skip them all and Generate works the same.",
};

const phases = (style: string) => [
  "Reading the room",
  "Keeping walls, windows and daylight",
  `Furnishing it ${style.toLowerCase()}`,
  "Finishing materials and light",
];

const suggestions = [
  "Pale oak floor, low linen seating, morning light",
  "Keep the sofa, change everything around it",
  "Warmer palette and one statement light",
];

const interiorSettings: [string, string][] = [
  ["floorFinish", "Floor finish"],
  ["furnishing", "Furnishing"],
  ["plants", "Indoor plants"],
  ["accessories", "Accessories"],
  ["lighting", "Lighting"],
];

/** Where an area mark sits, in words, for "Analyze an area". */
function areaName(m: Mark) {
  if (m.y < 30) return "the ceiling and upper walls";
  if (m.y > 72) return "the floor and rug";
  if (m.x < 30) return "the window wall";
  if (m.x > 70) return "the shelving and side wall";
  return "the sofa and coffee table";
}

/** "Improve": the user's words plus the chosen settings, as a fuller prompt. */
function improvePrompt(text: string, p: Params) {
  const room = isAuto(p.roomType) ? "room" : String(p.roomType).toLowerCase();
  const parts = [`A ${String(p.roomStyle).toLowerCase()} ${room}`];
  if (!isAuto(p.floorFinish)) parts.push(`${String(p.floorFinish).toLowerCase()} floors`);
  if (!isAuto(p.palette)) parts.push(`a ${String(p.palette).toLowerCase()} palette`);
  if (!isAuto(p.lighting)) parts.push(`${String(p.lighting).toLowerCase()} lighting`);
  if (p.plants === "Generous") parts.push("plenty of indoor plants");
  const time = isAuto(p.timeOfDay) ? "" : `, ${String(p.timeOfDay).toLowerCase()} light`;
  const built = `${parts.join(", ")}${time}. Keep the walls, windows and layout as they are.`;
  const own = text.trim();
  return own ? `${own.replace(/[.\s]+$/, "")}. ${built}` : built;
}

export default function RoomReimagination({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const [mode, setMode] = useState<"annotate" | "select" | null>(null);
  const [area, setArea] = useState<"idle" | "reading" | "ready">("idle");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsReady, setSuggestionsReady] = useState(false);
  const screen = useToolScreen(s, {
    onPhotoChange: () => {
      setMode(null);
      setArea("idle");
    },
  });

  const prompt = String(p.prompt ?? "");
  const areaPrompt = String(p.areaPrompt ?? "");
  const childSafe = p.childSafe === true;
  const marks = working.selection.marks;
  const kind = working.selection.mode;
  const drawn = kind === "annotate" ? marks : [];
  const picked = kind === "select" ? marks[marks.length - 1] : undefined;
  const noPhoto = !working.sourceImage;

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || areaPrompt.trim() || changed);
  const canGenerate = !noPhoto;

  const summary = () => {
    const base = prompt.trim()
      ? prompt.trim()
      : areaPrompt.trim()
        ? `${areaName(picked ?? { x: 50, y: 50 })}: ${areaPrompt.trim()}`
        : summarize(def, p);
    return childSafe ? `${base} · child-safe` : base;
  };

  const enter = (m: "annotate" | "select") => {
    if (noPhoto) return;
    if (mode === m) return setMode(null);
    if (kind && kind !== m && marks.length) s.commit((w) => ({ ...w, selection: { mode: m, marks: [] } }));
    setMode(m);
    screen.setView("source");
    screen.showStage();
  };
  const addMark = (m: Mark) => {
    if (mode === "select") {
      s.commit((w) => ({ ...w, selection: { mode: "select", marks: [m] } }));
      setArea("ready");
    } else if (mode === "annotate") {
      s.commit((w) => ({ ...w, selection: { mode: "annotate", marks: [...w.selection.marks, m] } }), "marks");
    }
  };
  const clearMarks = () => {
    s.commit((w) => ({ ...w, selection: { mode: null, marks: [] } }));
    if (mode === "select") setArea("idle");
  };

  const marking =
    mode && working.sourceImage
      ? {
          banner: mode === "annotate" ? "Draw on the photo to point at what matters" : "Tap the part of the room you want to change",
          layer: <MarkLayer mode={mode} marks={mode === "annotate" ? drawn : picked ? [picked] : []} onMark={addMark} interactive />,
          canClear: mode === "annotate" ? drawn.length > 0 : !!picked,
          onClear: clearMarks,
          onDone: () => setMode(null),
        }
      : null;

  return (
    <ToolScreen
      screen={screen}
      toolName="Room Reimagination"
      intro={{
        eyebrow: "Interior design",
        bullets: [
          "Upload a photo of the room as it is today. A phone photo is fine.",
          "Describe what you want, or just choose a style and palette.",
          "Generate. Walls, windows and daylight stay where they are.",
        ],
        before: mockImage("895653aeced87dc008ab988a65d39395ecc2cf81-2048x1365.png"),
        after: mockImage("9cdbb0b9bdb75c5e335e5dac48e64c3255e917e2-1537x1023.png"),
        afterLabel: "Reimagined",
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Describe the room", short: "Describe" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={summary}
      generateLabel={{ first: "Generate room", again: "Regenerate" }}
      phases={phases(String(p.roomStyle))}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Describe the room",
        info: info.prompt,
        label: "Describe the room you want",
        placeholder: "A calmer living room with pale oak floors, low linen seating and soft morning light…",
        improve: (t) => improvePrompt(t, p),
      }}
      marking={marking}
      sourceOverlay={marks.length && (kind === "annotate" || kind === "select") ? <MarkLayer mode={kind} marks={marks} interactive={false} /> : null}
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
          options={optionsOf(def, "palette").map((o) => ({ value: o.value, swatch: o.swatch ?? [] }))}
          value={String(p.palette)}
          onChange={(v) => s.setParam("palette", v)}
        />
      </PanelSection>
      <PanelSection title="Interior settings" info={info.interior}>
        <div className="space-y-4">
          {interiorSettings.map(([id, label]) => (
            <div key={id}>
              <SubLabel>{label}</SubLabel>
              <Chips
                label={label}
                options={optionsOf(def, id).map((o) => chip(o.value, id === "lighting" ? lightingIcons : undefined))}
                value={String(p[id])}
                onChange={(v) => s.setParam(id, v)}
              />
            </div>
          ))}
        </div>
      </PanelSection>
      <PanelSection title="Time of day" info={info.time}>
        <Chips
          label="Time of day"
          options={optionsOf(def, "timeOfDay").map((o) => chip(o.value, timeIcons))}
          value={String(p.timeOfDay)}
          onChange={(v) => s.setParam("timeOfDay", v)}
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
      <PanelSection title="Optional edits" info={info.extras}>
        <div className="space-y-2">
          <OptionCard>
            <Toggle
              icon={GShieldCheck}
              label="Make it child safe"
              hint="Rounded edges, fewer breakables within reach. A design direction, not a safety check."
              checked={childSafe}
              onChange={(v) => s.setParam("childSafe", v)}
            />
          </OptionCard>
          <OptionCard
            icon={GPencilSimple}
            title="Annotate the design"
            hint="Draw on the photo to point at what matters."
            active={mode === "annotate" || drawn.length > 0}
            action={
              <PillButton
                size="sm"
                variant={mode === "annotate" ? "primary" : "ghost"}
                label={mode === "annotate" ? "Drawing" : drawn.length ? "Edit" : "Draw"}
                onClick={() => enter("annotate")}
                disabled={noPhoto}
              />
            }
          >
            {(drawn.length > 0 || mode === "annotate") && (
              <div className="space-y-2">
                <PromptBox
                  label="What do your marks mean?"
                  rows={2}
                  max={300}
                  value={String(p.annotationNote ?? "")}
                  onChange={(v) => s.setParam("annotationNote", v, true)}
                  placeholder="Replace this wall with built-in shelving…"
                />
                {drawn.length > 0 && (
                  <button type="button" onClick={clearMarks} className="text-[11.5px] text-cream/55 underline-offset-2 hover:text-white hover:underline">
                    Clear drawing
                  </button>
                )}
              </div>
            )}
          </OptionCard>
          <OptionCard
            icon={GSelection}
            title="Analyze an area"
            hint="Mark one part of the room and describe just that."
            active={mode === "select" || !!picked}
            action={
              <PillButton
                size="sm"
                variant={mode === "select" ? "primary" : "ghost"}
                label={area === "reading" ? "Reading…" : mode === "select" ? "Selecting" : picked ? "Change" : "Select"}
                onClick={() => {
                  if (mode === "select") return setMode(null);
                  setArea("reading");
                  s.run(() => {
                    setArea(picked ? "ready" : "idle");
                    enter("select");
                  }, 0.9);
                }}
                disabled={noPhoto || area === "reading"}
              />
            }
          >
            {picked ? (
              <div className="space-y-2">
                <p className="text-[11.5px] leading-5 text-cream/60">
                  Looks like <span className="text-white">{areaName(picked)}</span>.
                </p>
                <PromptBox
                  label="What should change in this area?"
                  rows={2}
                  max={300}
                  value={areaPrompt}
                  onChange={(v) => s.setParam("areaPrompt", v, true)}
                  placeholder="Swap for a low linen sofa and a round travertine table…"
                />
                <button
                  type="button"
                  onClick={() => {
                    clearMarks();
                    s.setParam("areaPrompt", "");
                  }}
                  className="text-[11.5px] text-cream/55 underline-offset-2 hover:text-white hover:underline"
                >
                  Remove area
                </button>
              </div>
            ) : mode === "select" ? (
              <p className="text-[11.5px] leading-5 text-cream/55">
                Tap the photo where the change should happen, or{" "}
                <button type="button" onClick={() => addMark({ x: 50, y: 50 })} className="text-ember-soft underline-offset-2 hover:underline">
                  mark the centre
                </button>{" "}
                and describe it below.
              </p>
            ) : null}
          </OptionCard>
          <OptionCard
            icon={GSparkle}
            title="VastuNord suggestions"
            hint="A few directions read from your photo."
            active={showSuggestions}
            action={
              <PillButton
                size="sm"
                variant="ghost"
                label={showSuggestions ? "Hide" : "Show"}
                onClick={() => {
                  const next = !showSuggestions;
                  setShowSuggestions(next);
                  if (next && !suggestionsReady) s.run(() => setSuggestionsReady(true), 0.9);
                }}
                disabled={noPhoto}
              />
            }
          >
            {showSuggestions &&
              (!suggestionsReady ? (
                <div className="space-y-1.5" aria-label="Reading your photo">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-9 rounded-lg bg-white/6 motion-safe:animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {suggestions.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => {
                          s.setParam("prompt", t);
                          screen.focusPrompt();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-left text-[12px] leading-5 text-cream/80 transition-colors duration-200 hover:border-white/25 hover:text-white"
                      >
                        <GPlus size={12} className="shrink-0 text-ember-soft" />
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
          </OptionCard>
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
