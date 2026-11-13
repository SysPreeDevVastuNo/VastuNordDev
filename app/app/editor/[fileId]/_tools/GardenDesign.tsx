"use client";

import { useMemo } from "react";
import { Chips, OptionCard, PanelSection, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import { GCheckBold, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { outdoorStyles } from "@/app/app/editor/[fileId]/_tools/options";
import { AreaCard, SuggestionsCard, useAreaAssist } from "@/app/app/editor/[fileId]/_tools/outdoor/Assist";
import { GFlower, GHouseLine, GPlant, GScissors, GSquaresFour, GTree } from "@/app/app/editor/[fileId]/_tools/outdoor/icons";
import StylePalettes from "@/app/app/editor/[fileId]/_tools/outdoor/StylePalettes";
import { mockImage } from "@/lib/mock/entities";
import type { Mark } from "@/lib/mock/editorState";

const areaIcons: Record<string, Glyph> = { "Whole garden": GTree, Borders: GFlower, Lawn: GPlant, Terrace: GSquaresFour, Front: GHouseLine };

const touchUpTasks = ["Mow and edge the lawn", "Weed the borders", "Fresh mulch", "Prune and shape", "Clean the paving", "Fill planting gaps"];
const defaultTasks = touchUpTasks.slice(0, 3);

const info = {
  photo: "A photo of the garden as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A garden you like. VastuNord borrows its planting and materials, not its layout.",
  prompt: "Say what the garden should become. Leave it empty and your choices below do the work.",
  style: "The planting and materials language of the whole garden.",
  area: "Which part of the garden to redesign. Everything else stays as it is in the photo.",
  touchUp: "Keep the garden as it is designed and just tidy it, the way it would look after a good day’s work.",
  assist: "Each of these is optional. Skip them and Generate works the same.",
};

/** Where an area mark sits, in words, for "Analyze an area". */
function areaName(m: Mark) {
  if (m.y < 35) return "the trees and boundary";
  if (m.y > 75) return "the lawn";
  if (m.x < 25) return "the left-hand border";
  if (m.x > 75) return "the right-hand border";
  return "the middle of the garden";
}

export default function GardenDesign({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const area = useAreaAssist(s, areaName);
  const screen = useToolScreen(s, { onBeforeGenerate: () => area.setActive(false) });
  const showPhoto = () => {
    screen.setView("source");
    screen.showStage();
  };

  const touchUp = p.touchUp === true;
  // Chosen touch-up tasks, stored as one "|"-separated param.
  const tasks = typeof p.touchUpTasks === "string" && p.touchUpTasks ? p.touchUpTasks.split("|") : defaultTasks;
  const style = String(p.outdoorStyle);
  const gardenArea = String(p.outdoorArea);
  const prompt = String(p.prompt ?? "");

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || area.areaPrompt.trim() || touchUp || changed);
  const canGenerate = !!working.sourceImage;

  const summary = () =>
    touchUp
      ? `Touch-up: ${tasks.join(", ").toLowerCase()}`
      : prompt.trim()
        ? prompt.trim()
        : area.areaPrompt.trim() && area.areaMark
          ? `${areaName(area.areaMark)}: ${area.areaPrompt.trim()}`
          : `${style} · ${gardenArea.toLowerCase()}`;

  /** "Improve": the user's words plus the redesign (or the tidy-up) in full. */
  const improve = (text: string) => {
    const hint = outdoorStyles[style]?.hint.toLowerCase().split(" · ").join(", ");
    const built = touchUp
      ? `Tidy the garden without redesigning it: ${tasks.join(", ").toLowerCase()}.`
      : `Redesign ${gardenArea === "Whole garden" ? "the whole garden" : `the ${gardenArea.toLowerCase()}`} in a ${style.toLowerCase()} style${hint ? ` (${hint})` : ""}. Keep the house, fences and trees as they are.`;
    return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
  };

  const toggleTask = (t: string) => {
    const next = tasks.includes(t) ? tasks.filter((x) => x !== t) : [...tasks, t];
    s.setParam("touchUpTasks", next.join("|"));
  };

  return (
    <ToolScreen
      screen={screen}
      place="outside"
      toolName="Garden Design"
      intro={{
        eyebrow: "Exterior & landscape",
        bullets: [
          "Upload a photo of the garden as it is now.",
          "Pick a style and the part to redesign, or switch to a tidy touch-up.",
          "Generate. The house, fences and big trees stay where they are.",
        ],
        before: mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png"),
        after: mockImage("fbab9dfe055f83dc3fa984d7be507a3f485b8a83-1537x1023.png"),
        afterLabel: "Redesigned",
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Shape the garden", short: "Garden" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={summary}
      generateLabel={{ first: touchUp ? "Tidy the garden" : "Design the garden", again: "Regenerate" }}
      phases={[
        "Reading the garden",
        "Keeping the house, fences and trees",
        touchUp ? "Tidying lawns, borders and paving" : `Planting it ${style.toLowerCase()}`,
        "Matching season and light",
      ]}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Describe the garden",
        info: info.prompt,
        label: "Describe the garden you want",
        placeholder: "Soften the edges: deep borders, a gravel path, one tree for shade…",
        improve,
      }}
      marking={area.marking}
      sourceOverlay={area.overlay}
    >
      <div className={`transition-opacity duration-200 ${touchUp ? "opacity-45" : ""}`} aria-disabled={touchUp || undefined}>
        <PanelSection title="Outdoor style" info={info.style} meta={touchUp ? "Not used in a touch-up" : style}>
          <StylePalettes
            wide
            label="Outdoor style"
            options={optionsOf(def, "outdoorStyle").map((o) => ({
              value: o.value,
              swatch: outdoorStyles[o.value]?.swatch ?? [],
              hint: outdoorStyles[o.value]?.hint,
            }))}
            value={style}
            onChange={(v) => s.setParam("outdoorStyle", v)}
          />
        </PanelSection>
        <PanelSection title="Outdoor area" info={info.area} meta={touchUp ? "Not used in a touch-up" : undefined}>
          <Chips
            label="Outdoor area"
            options={optionsOf(def, "outdoorArea").map((o) => ({ value: o.value, icon: areaIcons[o.value] }))}
            value={gardenArea}
            onChange={(v) => s.setParam("outdoorArea", v)}
          />
        </PanelSection>
      </div>
      <PanelSection title="Garden touch-up" info={info.touchUp}>
        <OptionCard active={touchUp}>
          <Toggle
            icon={GScissors}
            label="Just tidy it up"
            hint="No redesign. The same garden after a good day’s work."
            checked={touchUp}
            onChange={(v) => s.setParam("touchUp", v)}
          />
          {touchUp && (
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Touch-up tasks">
              {touchUpTasks.map((t) => {
                const on = tasks.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleTask(t)}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-colors duration-200 ${on ? "border-ember bg-ember/14 text-white" : "border-white/10 bg-white/4 text-cream/70 hover:border-white/30 hover:text-white"}`}
                  >
                    {on && <GCheckBold size={12} className="text-ember-soft" />}
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </OptionCard>
      </PanelSection>
      <PanelSection title="AI assistance" optional info={info.assist}>
        <div className="space-y-2">
          <SuggestionsCard s={s} toolId={def.id} onUse={screen.focusPrompt} />
          <AreaCard s={s} area={area} onEnter={showPhoto} placeholder="A curved bed of grasses and a single multi-stem tree…" />
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
