"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toolDef, defaultParams, type ParamValue } from "@/app/app/editor/[fileId]/_tools/defs";
import { mockCredits } from "@/lib/mock/entities";
import { emptySelection, useWorking, type Working } from "@/lib/mock/editorState";
import { addFailedGeneration, addGeneratedVersion, restoreVersion, toggleFavourite, useHistory } from "@/lib/mock/history";
import { setFileSource, useStudio } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";

export type Processing = { progress: number };

/** Adds a photo to the form: files made here as a blob, CDN photos by URL (the server fetches those). */
async function appendPhoto(form: FormData, field: string, src: string) {
  if (!src) return;
  if (/^https?:/.test(src)) form.set(`${field}Url`, src);
  else form.set(field, await (await fetch(src)).blob(), `${field}.jpg`);
}

// One file's editing session (the prototype's useToolFile): the file, its tool
// definition, the undoable working state, credits, and generation. Generate
// posts the photo to /api/generate; the result becomes a new current version.
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
  const [runError, setRunError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState("");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  const stopTicking = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Starts a run. Returns false when one is already running or there is no photo. */
  const generate = (summary: string) => {
    if (processing || !working.sourceImage || !file) return false;
    setLastSummary(summary);
    setRunError(null);
    setProcessing({ progress: 2 });
    // The provider gives no progress, so ease towards 92% over about 20 s.
    const tick = (n: number) =>
      run(() => {
        setProcessing({ progress: Math.round(n) });
        tick(n + (92 - n) * 0.06);
      }, 0.25);
    tick(4);

    const controller = new AbortController();
    abort.current = controller;
    const params = working.params;
    (async () => {
      try {
        const form = new FormData();
        form.set("toolId", file.toolId);
        form.set("summary", summary);
        form.set("prompt", String(params.prompt ?? ""));
        form.set("negative", String(params.negative ?? ""));
        await appendPhoto(form, "image", working.sourceImage);
        await appendPhoto(form, "reference", working.referenceImage);
        const res = await fetch("/api/generate", { method: "POST", body: form, signal: controller.signal });
        const data = (await res.json().catch(() => ({}))) as { image?: string; error?: string };
        if (!res.ok || !data.image) throw new Error(data.error || "The render did not finish. Try again.");
        stopTicking();
        setProcessing({ progress: 100 });
        addGeneratedVersion(fileId, data.image, summary);
        setPreviewId(null);
        setProcessing(null);
      } catch (e) {
        if (controller.signal.aborted) return;
        stopTicking();
        setProcessing(null);
        addFailedGeneration(fileId, summary);
        setRunError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Could not reach the server. Check your connection and try again.");
      }
    })();
    return true;
  };
  const cancelGenerate = () => {
    abort.current?.abort();
    stopTicking();
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
    runError,
    dismissRunError: () => setRunError(null),
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
