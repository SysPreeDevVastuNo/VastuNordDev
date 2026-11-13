"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ACCEPTED_IMAGES } from "@/app/app/editor/[fileId]/_ui/controls";
import type { DeliverTab } from "@/app/app/editor/[fileId]/_ui/ShareExport";
import type { ToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { MAX_PHOTOS } from "@/lib/mock/editorState";

const MAX_BYTES = 20 * 1024 * 1024;
const MAX_EDGE = 2048;

export type UploadError = "unsupported" | "oversize" | "failed";
export type Dialog = "assets-source" | "assets-reference" | "history" | "deliver" | null;
export type StageView = "latest" | "source" | "compare";

export const checkFile = (f: File): UploadError | null =>
  !ACCEPTED_IMAGES.split(",").includes(f.type) ? "unsupported" : f.size > MAX_BYTES ? "oversize" : null;

/** Reads a photo and scales it down to MAX_EDGE as a JPEG data URL, so it fits in memory. */
export async function readPhoto(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const k = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * k);
    canvas.height = Math.round(img.naturalHeight * k);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = () => typeof window !== "undefined" && window.innerWidth < 1024;

// The screen around a tool file (the prototype's tool-screen hook): photos and
// uploads, the assets dialog, the stage view, and scrolling to the stage or the
// prompt on phones. Tools pass `onPhotoChange` to reset their own marks.
export function useToolScreen(s: ToolFile, opts: { onPhotoChange?: () => void; onBeforeGenerate?: () => void } = {}) {
  const [uploading, setUploading] = useState<"source" | "reference" | null>(null);
  const [photoError, setPhotoError] = useState<UploadError | null>(null);
  const [referenceError, setReferenceError] = useState<"unusable" | "failed" | null>(null);
  // "?deliver=link" (from a review link's "Share an update") opens Share & export on that tab.
  const router = useRouter();
  const pathname = usePathname();
  const deliverParam = useSearchParams().get("deliver");
  const paramTab: DeliverTab | null = !deliverParam
    ? null
    : deliverParam === "link" || deliverParam === "share"
      ? "link"
      : deliverParam === "social"
        ? "social"
        : "download";
  const [dialog, setDialog] = useState<Dialog>(paramTab ? "deliver" : null);
  const [deliverTab, setDeliverTab] = useState<DeliverTab>(paramTab ?? "download");
  /** The version Share & export works on; empty means the shown one. */
  const [deliverVersion, setDeliverVersion] = useState("");
  useEffect(() => {
    if (deliverParam) router.replace(pathname, { scroll: false });
  }, [deliverParam, pathname, router]);
  const [view, setView] = useState<StageView>("latest");
  /** What the shown version is compared with: the original photo or another version id. */
  const [compareWith, setCompareWith] = useState<string>("source");
  const stageEl = useRef<HTMLElement | null>(null);
  const promptEl = useRef<HTMLTextAreaElement | null>(null);
  /** Callback refs for the stage section and the prompt box. */
  const attachStage = useCallback((el: HTMLElement | null) => {
    stageEl.current = el;
  }, []);
  const attachPrompt = useCallback((el: HTMLTextAreaElement | null) => {
    promptEl.current = el;
  }, []);
  const photos = s.working.photos;

  const showStage = () => {
    if (isPhone()) stageEl.current?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
  };
  const focusPrompt = () => {
    document.getElementById("tool-prompt")?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
    window.setTimeout(() => promptEl.current?.focus({ preventScroll: true }), reducedMotion() ? 0 : 350);
  };

  const selectPhoto = (src: string, list = photos) => {
    const next = list.includes(src) ? list : [...list, src].slice(-MAX_PHOTOS);
    if (src !== s.working.sourceImage) opts.onPhotoChange?.();
    s.setSource(src, next);
    setView(s.shownResult ? "source" : "latest");
  };

  const removePhoto = (src: string) => {
    const rest = photos.filter((p) => p !== src);
    if (src === s.working.sourceImage) {
      opts.onPhotoChange?.();
      s.setSource(rest[0] ?? "", rest);
    } else s.commit((w) => ({ ...w, photos: rest }));
  };

  const uploadPhotos = async (files: File[]) => {
    setPhotoError(null);
    const bad = files.map(checkFile).find(Boolean);
    if (bad) return setPhotoError(bad);
    setUploading("source");
    try {
      const slots = Math.max(1, MAX_PHOTOS - photos.length);
      const read = await Promise.all(files.slice(0, slots).map(readPhoto));
      selectPhoto(read[0], [...photos, ...read].slice(-MAX_PHOTOS));
    } catch {
      setPhotoError("failed");
    } finally {
      setUploading(null);
    }
  };

  const uploadReference = async (files: File[]) => {
    setReferenceError(null);
    const f = files[0];
    if (!f || checkFile(f)) return setReferenceError("unusable");
    setUploading("reference");
    try {
      s.setReference(await readPhoto(f));
    } catch {
      setReferenceError("failed");
    } finally {
      setUploading(null);
    }
  };

  /** Opens Share & export on a tab, on a version (default: the one on the stage). */
  const openDelivery = (tab: DeliverTab = "download", versionId?: string) => {
    setDeliverTab(tab);
    setDeliverVersion(versionId ?? s.shownVersion?.id ?? s.current?.id ?? "");
    setDialog("deliver");
  };

  const generate = (summary: string) => {
    opts.onBeforeGenerate?.();
    setView("latest");
    if (s.generate(summary)) showStage();
  };

  return {
    s,
    uploading,
    photoError,
    setPhotoError,
    referenceError,
    setReferenceError,
    dialog,
    setDialog,
    deliverTab,
    setDeliverTab,
    deliverVersion,
    setDeliverVersion,
    openDelivery,
    view,
    setView,
    compareWith,
    setCompareWith,
    attachStage,
    attachPrompt,
    showStage,
    focusPrompt,
    photos,
    selectPhoto,
    removePhoto,
    uploadPhotos,
    uploadReference,
    generate,
  };
}

export type ToolScreenState = ReturnType<typeof useToolScreen>;
