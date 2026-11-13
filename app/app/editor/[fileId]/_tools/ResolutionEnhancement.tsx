"use client";

import { useEffect, useMemo, useState } from "react";
import { Callout, Chips, MethodCards, PanelSection, RatioGlyph, Slider, StageTag, SubLabel } from "@/app/app/editor/[fileId]/_ui/controls";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip } from "@/app/app/editor/[fileId]/_tools/options";
import {
  GArrowCounterClockwise,
  GFlipHorizontal,
  GFlipVertical,
  GMagicWand,
  GSliders,
  IconPill,
  OverlayCompare,
} from "@/app/app/editor/[fileId]/_tools/group-d/shared";
import { mockImage } from "@/lib/mock/entities";

const MANUAL = "Manual controls";

/** Each finishing look as a CSS filter. */
const looks: Record<string, string> = {
  None: "",
  Natural: "contrast(1.05) saturate(1.08)",
  Warm: "sepia(0.18) saturate(1.15) hue-rotate(-8deg)",
  Cool: "saturate(0.95) hue-rotate(10deg) brightness(1.03)",
  Matte: "contrast(0.86) brightness(1.06) saturate(0.85)",
  Mono: "grayscale(1) contrast(1.08)",
};

const cropRatios: Record<string, number> = { "1:1": 1, "4:3": 4 / 3, "3:2": 3 / 2, "16:9": 16 / 9 };

type Adjust = { noise: number; sharpness: number; brightness: number; contrast: number; saturation: number };

/** The manual sliders and the look, as one CSS filter (the live preview and what Apply saves). */
function filterOf(manual: boolean, a: Adjust, look: string) {
  const out: string[] = [];
  if (manual) {
    out.push(
      `brightness(${(1 + a.brightness / 200).toFixed(3)})`,
      `contrast(${(1 + a.contrast / 200 + a.sharpness / 500).toFixed(3)})`,
      `saturate(${(1 + a.saturation / 100).toFixed(3)})`
    );
    if (a.noise > 0) out.push(`blur(${(a.noise / 220).toFixed(2)}px)`);
  }
  if (looks[look]) out.push(looks[look]);
  return out.join(" ");
}

/** How much to scale a rotated photo so no empty corners show. */
const coverScale = (deg: number, ratio: number) => {
  const r = (Math.abs(deg) * Math.PI) / 180;
  return Math.max(Math.cos(r) + Math.sin(r) * ratio, Math.cos(r) + Math.sin(r) / ratio);
};

/** The photo's natural width/height. */
function usePhotoRatio(src: string) {
  const [ratio, setRatio] = useState(1.5);
  useEffect(() => {
    if (!src) return;
    let live = true;
    const img = new Image();
    img.onload = () => live && setRatio(img.naturalWidth / img.naturalHeight || 1.5);
    img.src = src;
    return () => {
      live = false;
    };
  }, [src]);
  return ratio;
}

/** The crop frame, in % of the photo, for a ratio. */
function cropBox(ratio: number, crop: string) {
  const want = cropRatios[crop];
  if (!want) return null;
  return ratio > want ? { w: (want / ratio) * 100, h: 100 } : { w: 100, h: (ratio / want) * 100 };
}

/** Bakes the manual adjustments, look and framing into a JPEG on this device. */
async function renderAdjusted(src: string, o: { filter: string; deg: number; flipH: boolean; flipV: boolean; crop: string }) {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const box = cropBox(w / h, o.crop) ?? { w: 100, h: 100 };
  const k = Math.min(1, 1600 / Math.max((w * box.w) / 100, (h * box.h) / 100));
  const cw = Math.round(((w * box.w) / 100) * k);
  const ch = Math.round(((h * box.h) / 100) * k);
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");
  ctx.filter = o.filter || "none";
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((o.deg * Math.PI) / 180);
  const sc = coverScale(o.deg, w / h);
  ctx.scale(sc * (o.flipH ? -1 : 1), sc * (o.flipV ? -1 : 1));
  ctx.drawImage(img, (-w * k) / 2, (-h * k) / 2, w * k, h * k);
  return canvas.toDataURL("image/jpeg", 0.86);
}

const signed = (v: number) => `${v > 0 ? "+" : ""}${v}`;

const demo = mockImage("59c590ae09f876d4cd463f1dce475c7709014708-4000x5999.png");
const demoGrade = "contrast(1.12) saturate(1.22) brightness(1.03)";

const info = {
  photo: "Any photo of a space. Add others to work on them one at a time; the highlighted one is used.",
  prompt: "Anything specific about the result. Optional.",
  method: "Auto enhance upscales and cleans the photo with AI. Manual controls are yours to set, run on this device and are free.",
  manual: "What you see on the photo is exactly what Apply saves.",
  filters: "A finishing look over everything else. Your own photo shows each one.",
  framing: "Crop to a shape, straighten a tilted horizon, or mirror the photo.",
};

export default function ResolutionEnhancement({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);
  const [applying, setApplying] = useState(false);
  const [holding, setHolding] = useState(false);
  const [failed, setFailed] = useState(false);

  const manual = String(p.method) === MANUAL;
  const adjust: Adjust = {
    noise: Number(p.noise) || 0,
    sharpness: Number(p.sharpness) || 0,
    brightness: Number(p.brightness) || 0,
    contrast: Number(p.contrast) || 0,
    saturation: Number(p.saturation) || 0,
  };
  const look = String(p.filter);
  const crop = String(p.crop);
  const straighten = Number(p.straighten) || 0;
  const flipH = p.flipH === true;
  const flipV = p.flipV === true;
  const prompt = String(p.prompt ?? "");
  const upscale = String(p.upscale);
  const ratio = usePhotoRatio(working.sourceImage);

  const filter = filterOf(manual, adjust, look);
  const transform = [
    straighten ? `rotate(${straighten}deg) scale(${coverScale(straighten, ratio).toFixed(3)})` : "",
    flipH ? "scaleX(-1)" : "",
    flipV ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const sourceStyle = holding ? undefined : { filter: filter || undefined, transform: transform || undefined };
  const frame = cropBox(ratio, crop);
  const previewing = !!(filter || transform || frame);

  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const ready = !!working.sourceImage;

  const parts = [
    manual
      ? [
          adjust.brightness ? `brightness ${signed(adjust.brightness)}` : "",
          adjust.contrast ? `contrast ${signed(adjust.contrast)}` : "",
          adjust.saturation ? `saturation ${signed(adjust.saturation)}` : "",
          adjust.sharpness ? `sharpness ${adjust.sharpness}` : "",
          adjust.noise ? `noise reduction ${adjust.noise}` : "",
        ]
      : [`auto enhance${upscale === "Original size" ? "" : `, ${upscale}`}`],
    look === "None" ? [] : [`${look.toLowerCase()} look`],
    frame ? [`cropped ${crop}`] : [],
    straighten ? [`straightened ${straighten}°`] : [],
    flipH ? ["flipped"] : [],
    flipV ? ["flipped vertically"] : [],
  ]
    .flat()
    .filter(Boolean);
  const summary = () => prompt.trim() || (parts.length ? parts.join(", ").replace(/^./, (c) => c.toUpperCase()) : "Manual adjustments");

  // Auto enhance is a normal run; manual controls are baked on this device first.
  const onGenerate = async () => {
    if (!working.sourceImage || s.processing || applying) return;
    if (!manual) return screen.generate(summary());
    setApplying(true);
    setFailed(false);
    try {
      await renderAdjusted(working.sourceImage, { filter, deg: straighten, flipH, flipV, crop });
      screen.generate(summary());
    } catch {
      setFailed(true);
    } finally {
      setApplying(false);
    }
  };

  const set = (key: string, value: string | number | boolean) => s.setParam(key, value);
  const resetManual = () =>
    s.commit((w) => ({ ...w, params: { ...w.params, noise: 0, sharpness: 0, brightness: 0, contrast: 0, saturation: 0 } }));

  const overlay = (
    <>
      {frame && !holding ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-sm border-2 border-white/90 shadow-[0_0_0_9999px_color-mix(in_oklab,var(--color-stage)_62%,transparent)]"
            style={{ width: `${frame.w}%`, height: `${frame.h}%` }}
          />
        </div>
      ) : null}
      {previewing ? (
        <StageTag className="bottom-3 left-3">
          {holding ? "Before" : manual ? "Live preview · this is what Apply saves" : "Look and framing preview · enhancement on Generate"}
        </StageTag>
      ) : null}
      {previewing ? (
        <button
          type="button"
          onPointerDown={() => setHolding(true)}
          onPointerUp={() => setHolding(false)}
          onPointerLeave={() => setHolding(false)}
          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setHolding(true)}
          onKeyUp={() => setHolding(false)}
          className="absolute right-3 bottom-3 min-h-8 rounded-full bg-black/60 px-3 font-display text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-md hover:bg-black/75"
        >
          Hold to see before
        </button>
      ) : null}
    </>
  );

  return (
    <ToolScreen
      screen={screen}
      place="photo"
      toolName="Resolution Enhancement"
      intro={{
        eyebrow: "Image enhancement",
        bullets: [
          "Upload any photo of a space that looks soft, dark or noisy.",
          "Let Auto enhance upscale it, or set brightness, contrast and sharpness yourself, free.",
          "Add a finishing look, crop and straighten, then save it as a new version.",
        ],
        before: demo,
        after: demo,
        demo: (
          <OverlayCompare
            before={demo}
            after={demo}
            beforeLabel="Today"
            afterLabel="Natural · preview"
            start={45}
            afterOverlay={<div className="pointer-events-none absolute inset-0" style={{ backdropFilter: demoGrade, WebkitBackdropFilter: demoGrade }} />}
          />
        ),
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Choose the method", short: "Method" },
        { label: manual ? "Apply" : "Enhance", short: manual ? "Apply" : "Enhance" },
      ]}
      described={described}
      canGenerate={ready && !applying}
      summary={summary}
      onGenerate={onGenerate}
      generateLabel={{ first: manual ? "Apply adjustments" : "Enhance image", again: manual ? "Apply adjustments" : "Reprocess" }}
      phases={[
        "Reading the photo",
        "Lifting detail and reducing noise",
        `Upscaling${upscale === "Original size" ? "" : ` ${upscale}`}`,
        "Finishing colour and contrast",
      ]}
      photoInfo={info.photo}
      referenceInfo=""
      prompt={{
        title: "Anything specific?",
        info: info.prompt,
        label: "Describe the enhancement",
        placeholder: "Sharper and cleaner, print-ready, keep the colours natural…",
      }}
      marking={null}
      sourceStyle={sourceStyle}
      sourceOverlay={overlay}
    >
      <PanelSection title="Method" info={info.method}>
        {failed && (
          <div className="mb-3">
            <Callout tone="error" onDismiss={() => setFailed(false)}>
              Those adjustments could not be applied on this device. Nothing was saved; try again.
            </Callout>
          </div>
        )}
        <MethodCards
          label="Enhancement method"
          options={[
            { value: "Auto enhance", title: "Auto enhance", hint: "Upscaled and cleaned up in one pass, by AI.", icon: GMagicWand, badge: "1 credit" },
            { value: MANUAL, title: "Manual controls", hint: "Set each adjustment yourself and see it live.", icon: GSliders, badge: "Free · on device" },
          ]}
          value={String(p.method)}
          onChange={(v) => set("method", v)}
        />
        {manual ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] leading-5 text-cream/55">{info.manual}</p>
              <IconPill size="sm" variant="quiet" icon={GArrowCounterClockwise} label="Reset" onClick={resetManual} />
            </div>
            <Slider label="Noise reduction" min={0} max={100} step={5} value={adjust.noise} onChange={(v) => set("noise", v)} />
            <Slider label="Sharpness" min={0} max={100} step={5} value={adjust.sharpness} onChange={(v) => set("sharpness", v)} />
            <Slider label="Brightness" min={-100} max={100} step={5} value={adjust.brightness} format={signed} onChange={(v) => set("brightness", v)} />
            <Slider label="Contrast" min={-100} max={100} step={5} value={adjust.contrast} format={signed} onChange={(v) => set("contrast", v)} />
            <Slider label="Saturation" min={-100} max={100} step={5} value={adjust.saturation} format={signed} onChange={(v) => set("saturation", v)} />
          </div>
        ) : (
          <div className="mt-4">
            <SubLabel>Upscale</SubLabel>
            <Chips
              label="Upscale"
              options={optionsOf(def, "upscale").map((o) => ({ value: o.value }))}
              value={upscale}
              onChange={(v) => set("upscale", v)}
            />
          </div>
        )}
      </PanelSection>
      <PanelSection title="Look" info={info.filters} meta={look}>
        <div role="radiogroup" aria-label="Image filter" className="grid grid-cols-3 gap-2">
          {optionsOf(def, "filter").map((o) => {
            const on = o.value === look;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set("filter", o.value)}
                className={`overflow-hidden rounded-xl border-2 text-left transition-[border-color] duration-200 ${on ? "border-ember" : "border-transparent hover:border-white/30"}`}
              >
                {working.sourceImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={working.sourceImage}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                    style={{ filter: looks[o.value] || undefined }}
                    loading="lazy"
                  />
                ) : (
                  <span className="block aspect-[4/3] w-full bg-white/6" />
                )}
                <span className={`block bg-white/4 px-2 py-1.5 text-[11px] ${on ? "text-white" : "text-cream/65"}`}>{o.value}</span>
              </button>
            );
          })}
        </div>
      </PanelSection>
      <PanelSection title="Crop, rotate & flip" info={info.framing}>
        <div className="space-y-4">
          <div>
            <SubLabel>Crop</SubLabel>
            <Chips
              label="Crop"
              options={optionsOf(def, "crop").map((o) =>
                cropRatios[o.value] ? { value: o.value, glyph: <RatioGlyph w={cropRatios[o.value] * 3} h={3} /> } : chip(o.value)
              )}
              value={crop}
              onChange={(v) => set("crop", v)}
            />
          </div>
          <Slider label="Straighten" min={-15} max={15} step={0.5} value={straighten} format={(v) => `${signed(v)}°`} onChange={(v) => set("straighten", v)} />
          <div className="flex gap-2">
            <IconPill size="sm" variant={flipH ? "primary" : "ghost"} icon={GFlipHorizontal} label="Flip horizontal" onClick={() => set("flipH", !flipH)} />
            <IconPill size="sm" variant={flipV ? "primary" : "ghost"} icon={GFlipVertical} label="Flip vertical" onClick={() => set("flipV", !flipV)} />
          </div>
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
