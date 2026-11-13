"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExportStep } from "@/components/app/ShareControls";
import {
  compressionQuality,
  exportSizes,
  socialFormat,
  type Compression,
  type Delivery,
  type ExportKind,
  type Layout,
} from "@/lib/mock/delivery";
import { recordDelivery } from "@/lib/mock/store";
import { canvasToBlob, renderCanvas, renderPdf, saveBlob } from "@/lib/render";

export type ExportItem = {
  versionId: string;
  versionNumber: number;
  resultId: string;
  image: string;
  before: string;
  filename: string;
};

export type ExportSpec = {
  kind: ExportKind;
  fileId: string;
  projectId?: string;
  /** Set for a handoff to a review link. */
  shareId?: string;
  items: ExportItem[];
  size: "HD" | "4K" | "8K";
  compression: Compression;
  layout: Layout;
  watermarked: boolean;
  brand?: string;
  /** Title block for a PDF page. */
  page?: { title: string; subtitle: string; footer: string };
};

export type ExportPhase =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "delivered"; deliveries: Delivery[]; downloadBlocked: boolean }
  /** The version's image is missing, so nothing can be drawn. */
  | { kind: "missing" }
  /** The image would not draw (e.g. it did not load). */
  | { kind: "failed" };

const stepsFor: Record<ExportKind, { id: string; label: string }[]> = {
  jpg: [
    { id: "validate", label: "Checking the file" },
    { id: "generate", label: "Generating the JPG" },
    { id: "compress", label: "Applying compression" },
    { id: "prepare", label: "Preparing your download" },
  ],
  pdf: [
    { id: "validate", label: "Checking the file" },
    { id: "generate", label: "Laying out the page" },
    { id: "embed", label: "Placing the image" },
    { id: "prepare", label: "Preparing your download" },
  ],
  png: [
    { id: "validate", label: "Checking the file" },
    { id: "generate", label: "Generating the PNG" },
    { id: "preserve", label: "Keeping every pixel" },
    { id: "prepare", label: "Preparing your download" },
  ],
  highres: [
    { id: "validate", label: "Checking the file" },
    { id: "plan", label: "Checking your plan" },
    { id: "credits", label: "Checking credits" },
    { id: "upscale", label: "Upscaling to 8K" },
    { id: "qa", label: "Quality check" },
    { id: "prepare", label: "Preparing the delivery file" },
  ],
};

// Simulated service time per step, as in the prototype: each wait is a fraction of this.
const LATENCY_MS = 1100;

// One export (the prototype's export hook): checks and service steps are
// simulated with short waits; the file itself is really drawn in the browser
// and handed to downloads, then recorded in Shared → Downloads. The 8K upscale
// is simulated: the file is drawn at the largest size a canvas allows.
export function useExport() {
  const [phase, setPhase] = useState<ExportPhase>({ kind: "idle" });
  const [steps, setSteps] = useState<ExportStep[]>([]);
  const run = useRef(0);
  const last = useRef<{ blob: Blob; filename: string }[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    // Pending waits never resolve once cleared, so an export stops with the screen.
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const wait = useCallback(
    (factor: number) =>
      new Promise<void>((resolve) => {
        timers.current.push(window.setTimeout(resolve, Math.round(LATENCY_MS * factor)));
      }),
    []
  );

  const start = useCallback(
    async (spec: ExportSpec) => {
      const id = ++run.current;
      const live = () => id === run.current;
      // Starting a step finishes the one before it.
      const mark = (step: string, state: ExportStep["state"]) =>
        setSteps((list) =>
          list.map((s) => (s.id === step ? { ...s, state } : state === "active" && s.state === "active" ? { ...s, state: "done" } : s))
        );
      setPhase({ kind: "running" });
      setSteps(stepsFor[spec.kind].map((s) => ({ ...s, state: "todo" })));

      mark("validate", "active");
      await wait(0.6);
      if (!live()) return;
      if (spec.items.some((i) => !i.image)) {
        mark("validate", "failed");
        setPhase({ kind: "missing" });
        return;
      }
      mark("validate", "done");

      if (spec.kind === "highres") {
        for (const step of ["plan", "credits"]) {
          mark(step, "active");
          await wait(0.35);
          if (!live()) return;
          mark(step, "done");
        }
      }

      const main = spec.kind === "highres" ? "upscale" : "generate";
      mark(main, "active");
      await wait(spec.kind === "highres" ? 2.2 : 0.9);
      if (!live()) return;
      mark({ jpg: "compress", png: "preserve", pdf: "embed", highres: "qa" }[spec.kind], "active");
      await wait(spec.kind === "highres" ? 0.7 : 0.45);
      if (!live()) return;
      mark("prepare", "active");

      const size = spec.kind === "highres" ? "8K" : spec.size;
      const format = spec.kind === "jpg" ? "JPG" : spec.kind === "pdf" ? "PDF" : "PNG";
      const layout = spec.kind === "highres" ? "result" : spec.layout;
      const files: { blob: Blob; filename: string }[] = [];
      try {
        for (const item of spec.items) {
          const draw = {
            after: item.image,
            before: item.before,
            layout,
            longEdge: exportSizes[size],
            watermark: spec.watermarked,
            brand: spec.brand,
          };
          if (spec.kind === "pdf") {
            const page = spec.page ?? { title: "VastuNord", subtitle: "", footer: "" };
            files.push({
              blob: await renderPdf({ ...draw, ...page, subtitle: `${page.subtitle} · version ${item.versionNumber}` }),
              filename: item.filename,
            });
          } else {
            const canvas = await renderCanvas(draw);
            files.push({
              blob: await canvasToBlob(canvas, format === "JPG" ? "JPG" : "PNG", compressionQuality[spec.compression]),
              filename: item.filename,
            });
          }
        }
      } catch {
        if (!live()) return;
        mark("prepare", "failed");
        setPhase({ kind: "failed" });
        return;
      }
      await wait(0.25);
      if (!live()) return;
      mark("prepare", "done");

      // Downloads start here, still inside the click's chain of work.
      const blocked = !files.every((f) => saveBlob(f.blob, f.filename));
      last.current = files;
      const deliveries = spec.items.map((item, i) =>
        recordDelivery({
          fileId: spec.fileId,
          projectId: spec.projectId,
          shareId: spec.shareId,
          versionId: item.versionId,
          resultId: item.resultId,
          type: spec.kind,
          size,
          format,
          compression: spec.kind === "jpg" ? spec.compression : undefined,
          layout,
          filename: item.filename,
          watermarked: spec.watermarked,
          credits: spec.kind === "highres" ? 2 : 0,
          status: "delivered",
          bytes: files[i]?.blob.size ?? 0,
          completedAt: Date.now(),
          events: blocked ? [{ at: Date.now(), note: "Download blocked by the browser" }] : [],
        })
      );
      setPhase({ kind: "delivered", deliveries, downloadBlocked: blocked });
    },
    [wait]
  );

  const downloadAgain = useCallback(() => {
    const ok = last.current.every((f) => saveBlob(f.blob, f.filename));
    setPhase((p) => (p.kind === "delivered" ? { ...p, downloadBlocked: !ok } : p));
  }, []);

  const reset = useCallback(() => {
    run.current += 1;
    setPhase({ kind: "idle" });
    setSteps([]);
  }, []);

  return { phase, steps, start, downloadAgain, reset };
}

/** Draws a past download again from its record (Shared → Downloads, final files on a link). False when it could not. */
export async function redownload(d: Delivery, item: { image: string; before: string; fileName: string; versionNumber: number }) {
  if (!item.image) return false;
  try {
    const draw = { after: item.image, before: item.before, layout: d.layout, longEdge: exportSizes[d.size], watermark: d.watermarked };
    if (d.format === "PDF")
      return saveBlob(
        await renderPdf({
          ...draw,
          title: item.fileName,
          subtitle: `Version ${item.versionNumber} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
          footer: "Visualised with VastuNord",
        }),
        d.filename
      );
    const social = d.type === "social" ? socialFormat(d.social ?? "") : undefined;
    const ratio = social ? social.w / social.h : undefined;
    const canvas = await renderCanvas({
      ...draw,
      ratio,
      longEdge: ratio ? Math.round(ratio >= 1 ? 1080 * ratio : 1080 / ratio) : draw.longEdge,
    });
    return saveBlob(await canvasToBlob(canvas, d.format, compressionQuality[d.compression ?? "balanced"]), d.filename);
  } catch {
    return false;
  }
}
