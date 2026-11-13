"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toolDef, defaultParams, type ParamValue } from "@/app/app/editor/[fileId]/_tools/defs";
import { mockCredits } from "@/lib/mock/entities";
import { emptySelection, useWorking, type Working } from "@/lib/mock/editorState";
import { restoreVersion, toggleFavourite, useHistory } from "@/lib/mock/history";
import { setFileSource, useStudio } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";

export type Processing = { progress: number };

// One file's editing session (the prototype's useToolFile): the file, its tool
// definition, the undoable working state, credits, and generation. Generation
// is simulated (progress, then "not connected") until the AI providers are wired.
export function useToolFile(fileId: string) {
  const { files } = useStudio();
  const file = files.find((f) => f.id === fileId);
  const tool = file ? toolById(file.toolId) : undefined;
  const def = toolDef(file?.toolId ?? "");

  const { working, commit, undo, redo, canUndo, canRedo } = useWorking(fileId, (): Working => {
    const source = file?.sourceImage ?? "";
    return {
      photos: source ? [source] : [],
      sourceImage: source,
      referenceImage: "",
      params: { ...defaultParams(def), prompt: file?.params?.prompt ?? "" },
      selection: emptySelection(),
    };
  });

  /** `typing`: consecutive keystrokes in one text field are one undo step. */
  const setParam = (key: string, value: ParamValue, typing = false) =>
    commit((w) => ({ ...w, params: { ...w.params, [key]: value } }), typing ? key : undefined);

  const setSource = (src: string, photos: string[]) => {
    commit((w) => ({ ...w, sourceImage: src, photos, selection: src === w.sourceImage ? w.selection : emptySelection() }));
    setFileSource(fileId, src);
  };
  const setReference = (src: string) => commit((w) => ({ ...w, referenceImage: src }));

  // Timers for simulated work, cleared on unmount.
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  /** Runs `fn` after `seconds` of simulated work. */
  const run = useCallback((fn: () => void, seconds: number) => {
    timers.current.push(window.setTimeout(fn, seconds * 1000));
  }, []);

  // Versions: the current one, and one picked in the strip or history to look at.
  const history = useHistory(fileId);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const shownVersion = history.versions.find((v) => v.id === previewId) ?? history.current;
  const shownResult = shownVersion ? history.resultById(shownVersion.resultId) : undefined;
  const restore = (versionId: string) => {
    const v = restoreVersion(fileId, versionId);
    if (v) setPreviewId(null);
    return !!v;
  };

  const [processing, setProcessing] = useState<Processing | null>(null);
  const [notConnected, setNotConnected] = useState(false);
  const [lastSummary, setLastSummary] = useState("");

  /** Starts a run. Returns false when one is already running or there is no photo. */
  const generate = (summary: string) => {
    if (processing || !working.sourceImage) return false;
    setLastSummary(summary);
    setNotConnected(false);
    setProcessing({ progress: 0 });
    const tick = (n: number) =>
      run(() => {
        if (n >= 100) {
          setProcessing(null);
          setNotConnected(true);
          return;
        }
        setProcessing({ progress: n });
        tick(n + 4);
      }, 0.12);
    tick(4);
    return true;
  };
  const cancelGenerate = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setProcessing(null);
  };

  return {
    file,
    tool,
    def,
    working,
    commit,
    setParam,
    setSource,
    setReference,
    undo,
    redo,
    canUndo,
    canRedo,
    credits: mockCredits,
    run,
    processing,
    generate,
    cancelGenerate,
    notConnected,
    dismissNotConnected: () => setNotConnected(false),
    lastSummary,
    versions: history.versions,
    current: history.current,
    resultById: history.resultById,
    generationById: history.generationById,
    generations: history.generations,
    previewId,
    setPreviewId,
    shownVersion,
    shownResult,
    favourite: toggleFavourite,
    restore,
  };
}

export type ToolFile = ReturnType<typeof useToolFile>;
