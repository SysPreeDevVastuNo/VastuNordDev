"use client";

import { useState } from "react";
import { OptionCard, PillButton, PromptBox } from "@/app/app/editor/[fileId]/_ui/controls";
import { GPlus, GSelection, GSparkle } from "@/app/app/editor/[fileId]/_ui/icons";
import MarkLayer from "@/app/app/editor/[fileId]/_ui/MarkLayer";
import type { ToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import type { Mark } from "@/lib/mock/editorState";

// The "AI assistance" cards shared by the outdoor tools (the prototype's Assist
// kit): "Analyze an area" (one tapped area, described on its own) and
// "VastuNord suggestions" (a few prompts read from the photo).

const suggestionLists: Record<string, string[]> = {
  default: ["Keep the layout, change the materials", "Lighter palette, same furniture", "Add planting and soften the edges"],
  "outdoor-visualization": [
    "Stone terrace with deep planted borders",
    "Evening scene, low level lighting",
    "Simplify the hardscape, add a tree for shade",
  ],
  "hardscape-design": [
    "Oak decking to the house, stone path to the gate",
    "Porcelain terrace, one low timber screen",
    "Gravel courtyard with a linear stone edge",
  ],
  "garden-design": ["Gravel path through deep borders", "Lawn reduced, planting increased", "One multi-stem tree for structure"],
};
const suggestionsFor = (toolId: string) => suggestionLists[toolId] ?? suggestionLists.default;

/**
 * The "Analyze an area" state. `read` names the area under a mark; `start`
 * takes what to do when marking begins (show the photo on the stage).
 */
export function useAreaAssist(s: ToolFile, read: (m: Mark) => string) {
  const [active, setActive] = useState(false);
  const [reading, setReading] = useState(false);
  const { working } = s;
  const marks = working.selection.mode === "select" ? working.selection.marks : [];
  const areaMark: Mark | undefined = marks[marks.length - 1];
  const areaPrompt = String(working.params.areaPrompt ?? "");

  const place = (m: Mark) => s.commit((w) => ({ ...w, selection: { ...w.selection, mode: "select", marks: [m] } }));
  const clear = () =>
    s.commit((w) => ({ ...w, selection: { ...w.selection, mode: null, marks: [] }, params: { ...w.params, areaPrompt: "" } }));

  const start = (onEnter: () => void) => {
    if (active) return setActive(false);
    if (!working.sourceImage) return;
    setReading(true);
    s.run(() => {
      setReading(false);
      setActive(true);
      onEnter();
    }, 0.9);
  };

  return {
    active,
    setActive,
    reading,
    start,
    areaMark,
    areaPrompt,
    clear,
    place,
    /** What the area looks like, in words. */
    areaName: areaMark ? read(areaMark) : "",
    marking:
      active && working.sourceImage
        ? {
            banner: "Tap the part of the photo you want to change",
            layer: <MarkLayer mode="select" marks={areaMark ? [areaMark] : []} onMark={place} interactive />,
            canClear: !!areaMark,
            onClear: clear,
            onDone: () => setActive(false),
          }
        : null,
    overlay: areaMark ? <MarkLayer mode="select" marks={[areaMark]} interactive={false} /> : null,
  };
}

export type AreaAssist = ReturnType<typeof useAreaAssist>;

export function AreaCard({
  s,
  area,
  placeholder,
  onEnter,
}: {
  s: ToolFile;
  area: AreaAssist;
  placeholder: string;
  onEnter: () => void;
}) {
  return (
    <OptionCard
      icon={GSelection}
      title="Analyze an area"
      hint="Mark one part of the photo and describe just that."
      active={area.active || !!area.areaMark}
      action={
        <PillButton
          size="sm"
          variant={area.active ? "primary" : "ghost"}
          label={area.reading ? "Reading…" : area.active ? "Selecting" : area.areaMark ? "Change" : "Select"}
          onClick={() => area.start(onEnter)}
          disabled={!s.working.sourceImage || area.reading}
        />
      }
    >
      {area.areaMark ? (
        <div className="space-y-2">
          <p className="text-[11.5px] leading-5 text-cream/60">
            Looks like <span className="text-white">{area.areaName}</span>.
          </p>
          <PromptBox
            label="What should change in this area?"
            rows={2}
            max={300}
            value={area.areaPrompt}
            onChange={(v) => s.setParam("areaPrompt", v, true)}
            placeholder={placeholder}
          />
          <button type="button" onClick={area.clear} className="text-[11.5px] text-cream/55 underline-offset-2 hover:text-white hover:underline">
            Remove area
          </button>
        </div>
      ) : area.active ? (
        <p className="text-[11.5px] leading-5 text-cream/55">
          Tap the photo where the change should happen, or{" "}
          <button type="button" onClick={() => area.place({ x: 50, y: 60 })} className="text-ember-soft underline-offset-2 hover:underline">
            mark the centre
          </button>
          .
        </p>
      ) : null}
    </OptionCard>
  );
}

export function SuggestionsCard({ s, toolId, onUse }: { s: ToolFile; toolId: string; onUse: () => void }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  return (
    <OptionCard
      icon={GSparkle}
      title="VastuNord suggestions"
      hint="A few directions read from your photo."
      active={open}
      action={
        <PillButton
          size="sm"
          variant="ghost"
          label={open ? "Hide" : "Show"}
          onClick={() => {
            setOpen(!open);
            if (!open && !ready) s.run(() => setReady(true), 0.9);
          }}
          disabled={!s.working.sourceImage}
        />
      }
    >
      {open &&
        (!ready ? (
          <div className="space-y-1.5" aria-label="Reading your photo">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-9 rounded-lg bg-white/6 motion-safe:animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1.5">
            {suggestionsFor(toolId).map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => {
                    s.setParam("prompt", t);
                    onUse();
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
  );
}
