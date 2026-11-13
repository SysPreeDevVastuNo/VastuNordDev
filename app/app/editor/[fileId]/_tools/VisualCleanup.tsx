"use client";

import { useRef, useState } from "react";
import { FitImage, MethodCards, OptionCard, PanelSection, PillButton, PinLayer, Slider, StageTag, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GCheckBold, GMagicWand, GSelection, glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import type { Mark } from "@/app/app/editor/[fileId]/_ui/MarkLayer";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { PickCard, PieceRow, short, usePieces, type Piece, type Point } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GPaintBrush = glyph(
  "M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM92,208H34.63C41.38,198.41,48,183.92,48,164a44,44,0,1,1,44,44Zm32.42-94.45q5.14-6.66,10.09-12.55A76.23,76.23,0,0,1,155,121.49q-5.9,4.94-12.55,10.09A60.54,60.54,0,0,0,124.42,113.55Zm42.7-2.68a92.57,92.57,0,0,0-22-22c31.78-34.53,55.75-45,69.9-47.91C212.17,55.12,201.65,79.09,167.12,110.87Z",
  "M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM124.42,113.55q5.14-6.66,10.09-12.55A76.23,76.23,0,0,1,155,121.49q-5.9,4.94-12.55,10.09A60.54,60.54,0,0,0,124.42,113.55Zm42.7-2.68a92.57,92.57,0,0,0-22-22c31.78-34.53,55.75-45,69.9-47.91C212.17,55.12,201.65,79.09,167.12,110.87Z"
);
const GEraser = glyph(
  "M225,80.4,183.6,39a24,24,0,0,0-33.94,0L31,157.66a24,24,0,0,0,0,33.94l30.06,30.06A8,8,0,0,0,66.74,224H216a8,8,0,0,0,0-16h-84.7L225,114.34A24,24,0,0,0,225,80.4ZM108.68,208H70.05L42.33,180.28a8,8,0,0,1,0-11.31L96,115.31,148.69,168Zm105-105L160,156.69,107.31,104,161,50.34a8,8,0,0,1,11.32,0l41.38,41.38a8,8,0,0,1,0,11.31Z",
  "M225,80.4,183.6,39a24,24,0,0,0-33.94,0L31,157.66a24,24,0,0,0,0,33.94l30.06,30.06A8,8,0,0,0,66.74,224H216a8,8,0,0,0,0-16h-84.7L225,114.34A24,24,0,0,0,225,80.4ZM213.67,103,160,156.69,107.31,104,161,50.34a8,8,0,0,1,11.32,0l41.38,41.38a8,8,0,0,1,0,11.31Z"
);

const AI = "AI object editing";
const BRUSH = "Brush and delete";
const clutterOptions = ["Bins", "Cables", "Cars", "People", "Signs", "Loose clutter", "Power lines", "Reflections"];
const actions = [
  { value: "remove", label: "Remove" },
  { value: "change", label: "Change" },
];
const toneOf = (p: Piece) => (p.action === "remove" ? "remove" : "change");

/** What sits at a point on the photo (simulated analysis). */
function readThing(at: Point) {
  if (at.y < 25) return "Overhead cable";
  if (at.y > 80) return "Ground clutter";
  if (at.x < 20) return "Bin";
  if (at.x > 80) return "Sign";
  if (at.y > 55) return "Object";
  return "Fixture";
}

/** The intro's painted-over units. */
const demoMarks: Mark[] = Array.from({ length: 26 }, (_, i) => ({ x: 66 + (i % 13) * 0.9, y: 52 + Math.floor(i / 13) * 4 + Math.sin(i) * 1.2 }));
const scene = mockImage("3a82a11603438139b4485d7a453302df8f17af25-1600x1076.png");

const info = {
  photo: "Any photo with things you want gone. Add others to work on them one at a time; the highlighted one is used.",
  prompt: "Describe anything else to remove or fix. Optional if you mark it below.",
  method: "AI object editing understands what things are. Brush and delete removes exactly what you paint.",
  clutter: "One tap removes it everywhere in the photo.",
};

/** Marks closer than this (in % of the photo) belong to the same stroke. */
const STROKE_GAP = 5;
function strokes(marks: Mark[]) {
  const out: Mark[][] = [];
  for (const m of marks) {
    const last = out[out.length - 1];
    const prev = last?.[last.length - 1];
    if (!prev || Math.hypot(prev.x - m.x, prev.y - m.y) > STROKE_GAP) out.push([m]);
    else last.push(m);
  }
  return out;
}

/** Wide, see-through brush strokes over what should go (MarkLayer's erase mode in the prototype). */
function EraseLayer({ marks, onMark, interactive, size }: { marks: Mark[]; onMark?: (m: Mark) => void; interactive: boolean; size: number }) {
  const box = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<Mark | null>(null);
  const at = (x: number, y: number): Mark | null => {
    const r = box.current?.getBoundingClientRect();
    return r ? { x: ((x - r.left) / r.width) * 100, y: ((y - r.top) / r.height) * 100 } : null;
  };
  const stop = () => (drawing.current = false);
  return (
    <div
      ref={box}
      className={`absolute inset-0 ${interactive ? "cursor-crosshair touch-none" : "pointer-events-none"}`}
      onPointerDown={(e) => {
        if (!interactive || !onMark) return;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        const p = at(e.clientX, e.clientY);
        if (p) {
          drawing.current = true;
          last.current = p;
          onMark(p);
        }
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
      onPointerMove={(e) => {
        if (!interactive || !onMark || !drawing.current) return;
        const p = at(e.clientX, e.clientY);
        const prev = last.current;
        if (!p || (prev && Math.hypot(prev.x - p.x, prev.y - p.y) < 0.8)) return;
        last.current = p;
        onMark(p);
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        {strokes(marks).map((st, i) => (
          <polyline
            key={i}
            points={(st.length === 1 ? [st[0], st[0]] : st).map((m) => `${m.x},${m.y}`).join(" ")}
            fill="none"
            className="stroke-ember"
            strokeWidth={size}
            strokeOpacity={0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}

const splitClutter = (v: unknown) => (typeof v === "string" && v ? v.split("|") : []);

export default function VisualCleanup({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { working } = s;
  const p = working.params;
  const [painting, setPainting] = useState(false);
  const kit = usePieces(s, {
    key: "cleanup",
    read: readThing,
    defaultAction: "remove",
    addAction: "remove",
    addLabel: "Object",
    readable: true,
    unclearLabel: "Unclear object",
  });
  const screen = useToolScreen(s, {
    onPhotoChange: () => {
      kit.reset();
      setPainting(false);
    },
    onBeforeGenerate: () => {
      kit.exit();
      setPainting(false);
    },
  });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const method = String(p.method);
  const ai = method === AI;
  const prompt = String(p.prompt ?? "");
  const clutter = splitClutter(p.clutter);
  const brushSize = Number(p.brushSize) || 28;
  // Brush strokes live in the file's selection ("erase" marks), so they undo and reset with the photo.
  const marks = working.selection.mode === "erase" ? working.selection.marks : [];
  const { pieces } = kit;
  const marked = ai ? pieces.length + clutter.length : marks.length;
  const described = !!(prompt.trim() || marked);
  const canGenerate = !!working.sourceImage && !!(prompt.trim() || marked);

  const summary = () => {
    if (prompt.trim()) return prompt.trim();
    if (!ai) return "Removed the painted areas";
    const removed = pieces.filter((x) => x.action === "remove").map((x) => x.label.toLowerCase());
    const changed = pieces.filter((x) => x.action === "change").map((x) => `${x.label.toLowerCase()} → ${x.note.trim() || "new finish"}`);
    return [removed.length ? `Removed ${removed.join(", ")}` : "", clutter.length ? `cleared ${clutter.join(", ").toLowerCase()}` : "", ...changed]
      .filter(Boolean)
      .join(" · ");
  };

  const toggleClutter = (v: string) =>
    s.commit((w) => {
      const list = splitClutter(w.params.clutter);
      const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
      return { ...w, params: { ...w.params, clutter: next.join("|") } };
    });
  const addMark = (m: Mark) =>
    s.commit(
      (w) => ({
        ...w,
        selection: { ...w.selection, mode: "erase", marks: [...(w.selection.mode === "erase" ? w.selection.marks : []), m] },
      }),
      "brush"
    );
  const clearMarks = () => s.commit((w) => ({ ...w, selection: { ...w.selection, mode: null, marks: [] } }));

  const pins: Pin[] = pieces.map((x, i) => ({
    id: x.id,
    at: x.at,
    n: i + 1,
    tone: toneOf(x),
    label: x.action === "remove" ? x.label : `${x.label} → ${short(x.note || "new finish", 16)}`,
  }));

  const brushMarking =
    !ai && painting && working.sourceImage
      ? {
          banner: "Paint over everything that should go",
          layer: <EraseLayer marks={marks} onMark={addMark} interactive size={brushSize} />,
          canClear: marks.length > 0,
          onClear: clearMarks,
          onDone: () => setPainting(false),
        }
      : null;
  const overlay = ai ? (
    pins.length ? (
      <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} />
    ) : null
  ) : marks.length ? (
    <EraseLayer marks={marks} interactive={false} size={brushSize} />
  ) : null;

  return (
    <ToolScreen
      screen={screen}
      place="photo"
      toolName="Visual Cleanup"
      intro={{
        eyebrow: "Image enhancement",
        bullets: [
          "Upload a photo with things in the way: bins, cables, cars, clutter.",
          "Tap them to remove, or paint over exactly what should go.",
          "Generate. Whatever was behind them is filled in.",
        ],
        before: scene,
        after: scene,
        demo: (
          <FitImage src={scene} alt="A backyard with the air-conditioning units painted over for removal">
            <EraseLayer marks={demoMarks} interactive={false} size={22} />
            <StageTag className="top-3 left-3">How it works · paint what should go</StageTag>
          </FitImage>
        ),
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Mark what should go", short: "Mark" },
        { label: "Clean up", short: "Clean" },
      ]}
      described={described}
      canGenerate={canGenerate}
      blockedHint="Mark something to remove to enable Generate"
      summary={summary}
      generateLabel={{ first: "Clean up image", again: "Regenerate" }}
      phases={["Finding what should go", "Removing it", "Rebuilding what was behind it", "Matching texture and light"]}
      photoInfo={info.photo}
      referenceInfo=""
      prompt={{
        title: "What should go?",
        info: info.prompt,
        label: "Describe what to clean up",
        placeholder: "Remove the bins and the cable across the wall…",
      }}
      marking={
        ai
          ? kit.marking(pins, { change: "Tap each thing to remove or change", add: "Tap each thing", placing: () => "Tap each thing" })
          : brushMarking
      }
      sourceOverlay={overlay}
    >
      <PanelSection title="Method" info={info.method}>
        <MethodCards
          label="Cleanup method"
          options={[
            { value: AI, title: "AI object editing", hint: "Tap things to remove them, or change what they are made of.", icon: GMagicWand },
            { value: BRUSH, title: "Brush & delete", hint: "Paint over it. Exactly what you paint goes.", icon: GPaintBrush },
          ]}
          value={method}
          onChange={(v) => {
            kit.exit();
            setPainting(false);
            s.setParam("method", v);
          }}
        />
      </PanelSection>
      {ai ? (
        <>
          <PanelSection title="Common clutter" optional info={info.clutter} meta={clutter.length ? `${clutter.length} selected` : undefined}>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Common clutter to remove">
              {clutterOptions.map((c) => {
                const on = clutter.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleClutter(c)}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-colors duration-200 ${on ? "border-ember bg-ember/14 text-white" : "border-white/10 bg-white/4 text-cream/70 hover:border-white/30 hover:text-white"}`}
                  >
                    {on && <GCheckBold size={12} className="text-ember-soft" />}
                    {c}
                  </button>
                );
              })}
            </div>
          </PanelSection>
          <PanelSection
            title="On the photo"
            info="Tap something specific. Remove takes it out; Change keeps it and changes its finish."
            meta={pieces.length ? `${pieces.length} marked` : undefined}
          >
            <div className="space-y-2">
              <PickCard
                kit={kit}
                icon={GSelection}
                title="Pick things on the photo"
                hint="Tap a bin, a sign, a stain on the wall."
                centre="pick the one in the centre"
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
                      tone={toneOf(x)}
                      actions={actions}
                      selected={x.id === kit.selectedId}
                      title={x.label}
                      placeholder="Change it to: painted white, oak, stone…"
                      removeCopy="Taken out, with what was behind it filled in."
                      onSelect={() => kit.setSelectedId(x.id)}
                      onChange={(patch) => kit.update(x.id, patch)}
                      onRemove={() => kit.remove(x.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </PanelSection>
        </>
      ) : (
        <PanelSection
          title="Brush"
          info="Paint over everything that should go. Wider strokes for big things, finer for cables."
          meta={marks.length ? "Painted" : undefined}
        >
          <OptionCard
            icon={GEraser}
            title="Paint over it"
            hint="Strokes are saved with the file and can be undone."
            active={painting}
            action={
              <PillButton
                size="sm"
                variant={painting ? "primary" : "ghost"}
                label={painting ? "Painting" : marks.length ? "Paint more" : "Paint"}
                onClick={() => {
                  if (painting) return setPainting(false);
                  setPainting(true);
                  showSource();
                }}
                disabled={!working.sourceImage}
              />
            }
          >
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <Slider label="Brush size" min={8} max={64} step={2} value={brushSize} unit="px" onChange={(v) => s.setParam("brushSize", v)} />
                  </div>
                  <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-black/25">
                    <span className="rounded-full bg-ember/55" style={{ width: brushSize, height: brushSize, maxWidth: 56, maxHeight: 56 }} />
                  </span>
                </div>
              </div>
              {marks.length > 0 && (
                <button
                  type="button"
                  onClick={clearMarks}
                  className="text-[11.5px] text-cream/55 underline-offset-2 hover:text-white hover:underline"
                >
                  Clear all strokes
                </button>
              )}
            </div>
          </OptionCard>
        </PanelSection>
      )}
    </ToolScreen>
  );
}
