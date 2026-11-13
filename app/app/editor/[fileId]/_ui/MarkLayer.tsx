"use client";

import { useRef } from "react";

export type Mark = { x: number; y: number };

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

// Drawing and area selection on top of the photo. Positions are percentages,
// so marks survive any stage size. "annotate" draws strokes; "select" keeps
// one circle (the last tap) and dims the rest of the photo.
export default function MarkLayer({
  mode,
  marks,
  onMark,
  interactive,
}: {
  mode: "annotate" | "select";
  marks: Mark[];
  onMark?: (m: Mark) => void;
  interactive: boolean;
}) {
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
        if (!interactive || !onMark || mode === "select" || !drawing.current) return;
        const p = at(e.clientX, e.clientY);
        const prev = last.current;
        if (!p || (prev && Math.hypot(prev.x - p.x, prev.y - p.y) < 0.8)) return;
        last.current = p;
        onMark(p);
      }}
    >
      {mode === "select" ? (
        marks.slice(-1).map((m) => (
          <span
            key={`${m.x}-${m.y}`}
            className="pointer-events-none absolute aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ember bg-ember/15 shadow-[0_0_0_9999px_color-mix(in_oklab,var(--color-stage)_50%,transparent)]"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" />
          </span>
        ))
      ) : (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          {strokes(marks).map((s, i) => (
            <polyline
              key={i}
              points={(s.length === 1 ? [s[0], s[0]] : s).map((m) => `${m.x},${m.y}`).join(" ")}
              fill="none"
              className="stroke-ember"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}
    </div>
  );
}
