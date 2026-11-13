"use client";

import { useMemo, useState } from "react";
import { FitImage, MethodCards, OptionCard, PanelSection, Slider, StageTag, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { GCamera, GGridFour, GMagicWand, GPerspective, IconPill } from "@/app/app/editor/[fileId]/_tools/group-d/shared";
import { mockImage } from "@/lib/mock/entities";

const FIX = "Fix distortion";

type Angle = { value: string; hint: string; eye: number; tilt: number };

const angles: Angle[] = [
  { value: "Eye level", hint: "About 1.6 m, how people see it.", eye: 24, tilt: 0 },
  { value: "Low", hint: "Near the ground; reads grander.", eye: 34, tilt: -12 },
  { value: "High", hint: "From above; shows the layout.", eye: 8, tilt: 14 },
  { value: "Straight on", hint: "Square to the facade, no convergence.", eye: 24, tilt: 0 },
];

/** A small side view: the camera at its height and tilt, looking at a building. */
function AngleGlyph({ angle, on }: { angle: Angle; on: boolean }) {
  const flat = angle.value === "Straight on";
  return (
    <svg viewBox="0 0 64 40" className="h-10 w-16 shrink-0" aria-hidden>
      <line x1="2" y1="38" x2="62" y2="38" className="stroke-current opacity-30" strokeWidth="1" />
      <rect x="40" y="10" width="16" height="28" className="fill-current opacity-20" />
      <g transform={`translate(10 ${angle.eye}) rotate(${angle.tilt})`}>
        <rect x="-4" y="-3" width="8" height="6" rx="1" className={on ? "fill-ember" : "fill-current"} />
        {flat ? (
          <line x1="4" y1="0" x2="30" y2="0" className="stroke-current opacity-60" strokeWidth="0.8" strokeDasharray="2 2" />
        ) : (
          <>
            <line x1="4" y1="0" x2="30" y2="-10" className="stroke-current opacity-60" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="4" y1="0" x2="30" y2="10" className="stroke-current opacity-60" strokeWidth="0.8" strokeDasharray="2 2" />
          </>
        )}
      </g>
    </svg>
  );
}

/** Straight guide lines over the photo, never part of the image. */
function Guides({ dense = false }: { dense?: boolean }) {
  const cols = dense ? [10, 20, 30, 40, 50, 60, 70, 80, 90] : [20, 40, 60, 80];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {cols.map((x) => (
        <span key={`v${x}`} className="absolute inset-y-0 w-px bg-white/45" style={{ left: `${x}%` }} />
      ))}
      {[33.3, 66.6].map((y) => (
        <span key={`h${y}`} className="absolute inset-x-0 h-px bg-white/30" style={{ top: `${y}%` }} />
      ))}
    </div>
  );
}

const demo = mockImage("dbb051df03418dc7c1c1a9da96fadf04cec3b723-1472x1462.png");

const info = {
  photo: "A photo with leaning walls or a tilted view. Add others to work on them one at a time; the highlighted one is used.",
  prompt: "Anything about the framing to keep or fix. Optional.",
  method: "Fix distortion straightens what the lens leaned. Adjust camera angle re-frames as if shot from another height.",
  fix: "Line the walls up with the guides. The preview tilts the photo live; the corrected image rebuilds the edges.",
  angle: "The viewpoint to re-frame the photo from.",
  guides: "Straight lines over the photo, to judge what should be vertical.",
};

export default function PerspectiveCorrection({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);
  const [guides, setGuides] = useState(true);
  const [suggesting, setSuggesting] = useState(false);

  const fix = String(p.method) === FIX;
  const vertical = Number(p.vertical) || 0;
  const horizontal = Number(p.horizontal) || 0;
  const angle = String(p.angle);
  const prompt = String(p.prompt ?? "");
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;

  // A live tilt of the photo while straightening (a preview, not the corrected image).
  const tilting = fix && (vertical || horizontal);
  const sourceStyle = tilting
    ? {
        transform: `perspective(700px) rotateX(${(vertical * 0.45).toFixed(2)}deg) rotateY(${(horizontal * 0.45).toFixed(2)}deg) scale(${(1 + (Math.abs(vertical) + Math.abs(horizontal)) / 380).toFixed(3)})`,
        transformOrigin: "50% 50%",
      }
    : undefined;

  const line = fix
    ? `Straightened verticals${vertical ? ` (${vertical > 0 ? "+" : ""}${vertical})` : ""}${horizontal ? `, horizontals ${horizontal > 0 ? "+" : ""}${horizontal}` : ""}`
    : `Re-framed from ${angle.toLowerCase()}`;

  const suggest = () => {
    setSuggesting(true);
    s.run(() => {
      setSuggesting(false);
      s.commit((w) => ({ ...w, params: { ...w.params, vertical: -30, horizontal: 0 } }));
    }, 0.8);
  };

  return (
    <ToolScreen
      screen={screen}
      place="photo"
      toolName="Perspective Correction"
      intro={{
        eyebrow: "Image enhancement",
        bullets: [
          "Upload a photo where walls lean or the view feels tilted.",
          "Straighten it against the guides, or re-frame it from another height.",
          "Generate. Verticals stand up straight and the edges are rebuilt.",
        ],
        before: demo,
        after: demo,
        demo: (
          <FitImage src={demo} alt="A house front with straight guides drawn over it">
            <Guides dense />
            <StageTag className="top-3 left-3">How it works · line the walls up with the guides</StageTag>
          </FitImage>
        ),
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Set the correction", short: "Correct" },
        { label: "Reprocess", short: "Reprocess" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={() => prompt.trim() || line}
      generateLabel={{ first: "Correct perspective", again: "Reprocess" }}
      phases={[
        "Finding the vertical lines",
        fix ? "Straightening them" : `Moving the camera to ${angle.toLowerCase()}`,
        "Rebuilding the edges",
        "Keeping proportions true",
      ]}
      photoInfo={info.photo}
      referenceInfo=""
      prompt={{
        title: "Anything specific?",
        info: info.prompt,
        label: "Describe the correction",
        placeholder: "Straighten the verticals, keep the full width of the facade…",
      }}
      marking={null}
      sourceStyle={sourceStyle}
      sourceOverlay={
        <>
          {guides ? <Guides dense={fix} /> : null}
          {tilting ? <StageTag className="bottom-3 left-3">Perspective preview · not a render</StageTag> : null}
        </>
      }
    >
      <PanelSection title="Method" info={info.method}>
        <MethodCards
          label="Correction method"
          options={[
            { value: FIX, title: "Fix distortion", hint: "Straighten walls and lines the lens leaned.", icon: GPerspective },
            { value: "Adjust camera angle", title: "Camera angle", hint: "Re-frame as if shot from another height.", icon: GCamera },
          ]}
          value={String(p.method)}
          onChange={(v) => s.setParam("method", v)}
        />
      </PanelSection>
      {fix ? (
        <PanelSection title="Straighten" info={info.fix}>
          <div className="space-y-5">
            <Slider
              label="Vertical"
              min={-100}
              max={100}
              step={5}
              value={vertical}
              format={(v) => (v === 0 ? "As shot" : `${v > 0 ? "+" : ""}${v} · ${v < 0 ? "tops apart" : "tops together"}`)}
              onChange={(v) => s.setParam("vertical", v)}
            />
            <Slider
              label="Horizontal"
              min={-100}
              max={100}
              step={5}
              value={horizontal}
              format={(v) => (v === 0 ? "As shot" : `${v > 0 ? "+" : ""}${v} · turn ${v < 0 ? "left" : "right"}`)}
              onChange={(v) => s.setParam("horizontal", v)}
            />
            <div className="flex flex-wrap gap-2">
              <IconPill
                size="sm"
                variant="ghost"
                icon={GMagicWand}
                label={suggesting ? "Reading the lines…" : "Suggest a correction"}
                onClick={suggest}
                disabled={!working.sourceImage || suggesting}
              />
              {vertical || horizontal ? (
                <IconPill
                  size="sm"
                  variant="quiet"
                  label="Reset"
                  onClick={() => s.commit((w) => ({ ...w, params: { ...w.params, vertical: 0, horizontal: 0 } }))}
                />
              ) : null}
            </div>
          </div>
        </PanelSection>
      ) : (
        <PanelSection title="Camera angle" info={info.angle} meta={angle}>
          <div role="radiogroup" aria-label="Camera angle" className="space-y-1.5">
            {optionsOf(def, "angle").map((o) => {
              const a = angles.find((x) => x.value === o.value) ?? angles[0];
              const on = o.value === angle;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => s.setParam("angle", o.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10 text-white" : "border-white/10 bg-white/4 text-cream/70 hover:border-white/30"}`}
                >
                  <AngleGlyph angle={a} on={on} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[12.5px] font-medium text-white">{o.value}</span>
                    <span className="mt-0.5 block text-[11px] leading-[1.45] text-cream/50">{a.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </PanelSection>
      )}
      <PanelSection title="Guides" info={info.guides}>
        <OptionCard>
          <Toggle icon={GGridFour} label="Show guides" hint="Only on screen. They are never part of the image." checked={guides} onChange={setGuides} />
        </OptionCard>
      </PanelSection>
    </ToolScreen>
  );
}
