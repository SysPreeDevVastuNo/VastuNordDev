// The editor's working state per file (photos, reference, settings), with
// undo/redo. In memory like the rest of lib/mock; it resets on reload until
// files and their settings are stored by the backend.

import { useSyncExternalStore } from "react";

export type ParamValue = string | number | boolean;

export type Mark = { x: number; y: number };
/** Marks drawn on the photo: strokes ("annotate"), one area ("select"), or nothing. */
/** `zones`: surfaces marked on the photo (Hardscape Design); their shape is the tool's own. */
export type Selection = { mode: "annotate" | "select" | "erase" | null; marks: Mark[]; zones?: unknown[] };
export const emptySelection = (): Selection => ({ mode: null, marks: [] });

export type Working = {
  /** Every photo added to the file, newest last (up to MAX_PHOTOS). */
  photos: string[];
  /** The photo the next generation works from. */
  sourceImage: string;
  referenceImage: string;
  params: Record<string, ParamValue>;
  selection: Selection;
};

/** `typing` is the key of the text field the last change came from, so a run of keystrokes is one undo step. */
type Entry = { past: Working[]; present: Working; future: Working[]; typing?: string };

export const MAX_PHOTOS = 6;
const HISTORY = 50;

const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function entry(fileId: string, initial: () => Working): Entry {
  let e = entries.get(fileId);
  if (!e) {
    e = { past: [], present: initial(), future: [] };
    entries.set(fileId, e);
  }
  return e;
}

export function useWorking(fileId: string, initial: () => Working) {
  const snapshot = () => entry(fileId, initial);
  const e = useSyncExternalStore(subscribe, snapshot, snapshot);

  /** Applies a change. Pass `typing` (a field key) so consecutive keystrokes in that field undo together. */
  const commit = (change: (w: Working) => Working, typing?: string) => {
    const cur = entry(fileId, initial);
    const next = change(cur.present);
    if (next === cur.present) return;
    const merge = typing !== undefined && cur.typing === typing && cur.past.length > 0;
    entries.set(fileId, {
      past: merge ? cur.past : [...cur.past, cur.present].slice(-HISTORY),
      present: next,
      future: [],
      typing,
    });
    emit();
  };

  const undo = () => {
    const cur = entry(fileId, initial);
    if (!cur.past.length) return;
    entries.set(fileId, {
      past: cur.past.slice(0, -1),
      present: cur.past[cur.past.length - 1],
      future: [cur.present, ...cur.future],
    });
    emit();
  };

  const redo = () => {
    const cur = entry(fileId, initial);
    if (!cur.future.length) return;
    entries.set(fileId, { past: [...cur.past, cur.present], present: cur.future[0], future: cur.future.slice(1) });
    emit();
  };

  return { working: e.present, commit, undo, redo, canUndo: e.past.length > 0, canRedo: e.future.length > 0 };
}
