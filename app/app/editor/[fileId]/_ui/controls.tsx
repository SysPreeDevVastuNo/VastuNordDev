"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  GArrowsHorizontal,
  GCheckBold,
  GCloudCheck,
  GInfo,
  GMagicWand,
  GSparkle,
  GSparkleFill,
  GUpload,
  GX,
  type Glyph,
} from "@/app/app/editor/[fileId]/_ui/icons";

// The editor's dark control set, one-for-one with the prototype's ToolStage:
// panel sections, chips, style tiles, palettes, toggles, the dropzone, the
// prompt box, the step tracker and the Generate bar.

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

const pillVariants = {
  primary: "bg-ember text-white hover:bg-ember-soft",
  ghost: "border border-white/18 text-white hover:border-white/40 hover:bg-white/6",
  quiet: "text-cream/70 hover:bg-white/6 hover:text-white",
};

export function PillButton({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  variant?: keyof typeof pillVariants;
  size?: "sm" | "md";
  icon?: Glyph;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-medium transition-[background-color,border-color,color,opacity] duration-200 ease-out-soft disabled:cursor-not-allowed disabled:opacity-40 ${size === "sm" ? "min-h-9 px-3.5 text-[12px]" : "min-h-11 px-5 text-[13px]"} ${pillVariants[variant]} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} className="shrink-0" />}
      {label}
    </button>
  );
}

export function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  active,
  tone = "bar",
}: {
  label: string;
  icon: Glyph;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  /** "float": a dark round button over the stage image. */
  tone?: "bar" | "float";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30 ${tone === "float" ? `bg-black/55 backdrop-blur-md hover:bg-black/75 ${active ? "text-ember-soft" : "text-white"}` : active ? "bg-white/12 text-white" : "text-cream/70 hover:bg-white/8 hover:text-white"}`}
    >
      <Icon size={18} fill={active} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Panel structure
// ---------------------------------------------------------------------------

export function PanelSection({
  id,
  title,
  info,
  meta,
  optional,
  children,
}: {
  id?: string;
  title: string;
  info?: string;
  meta?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const infoId = useId();
  return (
    <section id={id} aria-label={title} className="scroll-mt-16 border-b border-white/8 px-5 py-5 last:border-b-0 lg:scroll-mt-4">
      <div className="flex min-h-6 items-center gap-2">
        <h3 className="eyebrow min-w-0 flex-1 truncate text-cream/85">
          {title}
          {optional && <span className="ml-2 tracking-[0.12em] text-cream/40 normal-case">optional</span>}
        </h3>
        {meta && <span className="shrink-0 text-[11px] text-cream/45">{meta}</span>}
        {info && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={infoId}
            aria-label={`About ${title.toLowerCase()}`}
            className={`-mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${open ? "bg-white/12 text-white" : "text-cream/45 hover:text-white"}`}
          >
            <GInfo size={15} />
          </button>
        )}
      </div>
      {info && open && (
        <p id={infoId} className="mt-2 text-[12px] leading-5 text-cream/55">
          {info}
        </p>
      )}
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 font-display text-[10px] font-semibold tracking-[0.16em] text-cream/45 uppercase">{children}</p>;
}

// ---------------------------------------------------------------------------
// Choice controls
// ---------------------------------------------------------------------------

export type ChipOption = { value: string; icon?: Glyph; glyph?: React.ReactNode };

export function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] whitespace-nowrap transition-colors duration-200 ${on ? "border-ember bg-ember/14 text-white" : "border-white/10 bg-white/4 text-cream/70 hover:border-white/30 hover:text-white"}`}
          >
            {Icon ? <Icon size={14} fill={on} className={on ? "text-ember-soft" : ""} /> : o.glyph}
            {o.value}
          </button>
        );
      })}
    </div>
  );
}

/** Three bars, filled to the option's level (Light / Balanced / Full…). */
export function LevelGlyph({ level }: { level: number }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`w-[3px] rounded-full bg-current ${n <= level ? "" : "opacity-25"}`}
          style={{ height: `${4 + n * 2.5}px` }}
        />
      ))}
    </span>
  );
}

/** An outlined rectangle in the option's proportions (1:1, 4:3…). */
export function RatioGlyph({ w, h }: { w: number; h: number }) {
  const k = 12 / Math.max(w, h);
  return (
    <span
      aria-hidden
      className="inline-block rounded-[2px] border-[1.5px] border-current"
      style={{ width: `${Math.round(w * k)}px`, height: `${Math.round(h * k)}px` }}
    />
  );
}

export function SwatchDot({ color }: { color: string }) {
  return <span aria-hidden className="size-3 rounded-full ring-1 ring-white/25" style={{ backgroundColor: color }} />;
}

export function StyleTiles({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; preview: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`group relative overflow-hidden rounded-xl border-2 transition-[border-color] duration-200 ${on ? "border-ember" : "border-transparent hover:border-white/30"}`}
          >
            <span className="relative block aspect-[4/3.4] w-full overflow-hidden">
              <Image
                src={o.preview}
                alt=""
                fill
                sizes="120px"
                className="object-cover transition-transform duration-300 ease-out-soft motion-safe:group-hover:scale-[1.04]"
              />
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pt-6 pb-1.5 text-left font-display text-[10.5px] leading-tight font-medium text-white">
              {o.value}
            </span>
            {on && (
              <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-ember text-white">
                <GCheckBold size={11} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Palettes({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; swatch: string[] }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-xl border p-2 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
          >
            {o.swatch.length ? (
              <span className="flex h-7 overflow-hidden rounded-md">
                {o.swatch.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </span>
            ) : (
              <span className="flex h-7 items-center justify-center gap-1 rounded-md border border-dashed border-white/25 text-cream/60">
                {on ? <GSparkleFill size={13} className="text-ember-soft" /> : <GSparkle size={13} />}
              </span>
            )}
            <span className={`mt-1.5 block truncate text-[11px] ${on ? "text-white" : "text-cream/65"}`}>{o.value}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: Glyph;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center gap-3 text-left">
      {Icon && (
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${checked ? "bg-ember/15 text-ember-soft" : "bg-white/6 text-cream/65"}`}
        >
          <Icon size={17} fill={checked} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[13px] font-medium text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-[11.5px] leading-5 text-cream/50">{hint}</span>}
      </span>
      <span aria-hidden className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-ember" : "bg-white/16"}`}>
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition-[left] duration-200 ease-out-soft ${checked ? "left-5" : "left-1"}`}
        />
      </span>
    </button>
  );
}

/** A bordered card for an optional edit: icon, title, hint, an action, and what it reveals. */
export function OptionCard({
  icon: Icon,
  title,
  hint,
  action,
  active,
  children,
}: {
  icon?: Glyph;
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  active?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-3 transition-colors duration-200 ${active ? "border-white/22 bg-white/6" : "border-white/8 bg-white/3"}`}>
      {title && (
        <div className="flex items-center gap-3">
          {Icon && (
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${active ? "bg-ember/15 text-ember-soft" : "bg-white/6 text-cream/65"}`}
            >
              <Icon size={17} fill={active} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-[13px] font-medium text-white">{title}</p>
            {hint && <p className="mt-0.5 text-[11.5px] leading-5 text-cream/50">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      {children && <div className={title ? "mt-3" : ""}>{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upload and text
// ---------------------------------------------------------------------------

export const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp";

export function Dropzone({
  onFiles,
  onBrowseAssets,
  busy,
  multiple = true,
  compact,
  title = "Drag & drop or click to upload",
  hint = "A straight-on photo of the room works best",
}: {
  onFiles: (files: File[]) => void;
  onBrowseAssets?: () => void;
  busy?: boolean;
  multiple?: boolean;
  compact?: boolean;
  title?: string;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!busy) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (busy) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={`relative rounded-xl border border-dashed transition-colors duration-200 ${over ? "border-ember bg-ember/8" : "border-white/18 bg-white/3"}`}
    >
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className={`flex w-full flex-col items-center text-center ${compact ? "gap-1 px-4 py-4" : "gap-1.5 px-5 pt-7 pb-4"}`}
      >
        {!compact && (
          <span className="mb-2 flex size-11 items-center justify-center rounded-full bg-white/8 text-cream/75">
            {busy ? (
              <span className="size-5 rounded-full border-2 border-white/20 border-t-ember motion-safe:animate-spin" />
            ) : (
              <GUpload size={20} />
            )}
          </span>
        )}
        <span className="font-display text-[13px] font-medium text-white">{busy ? "Uploading…" : title}</span>
        <span className="text-[11.5px] leading-5 text-cream/50">{hint}</span>
        {!compact && (
          <span className="mt-1 font-display text-[9.5px] font-semibold tracking-[0.18em] text-cream/40 uppercase">
            JPEG · PNG · WEBP · up to 20 MB
          </span>
        )}
      </button>
      {onBrowseAssets && (
        <p className={`text-center text-[11.5px] text-cream/50 ${compact ? "pb-3" : "pb-5"}`}>
          or{" "}
          <button
            type="button"
            onClick={onBrowseAssets}
            disabled={busy}
            className="font-medium text-ember-soft underline-offset-2 hover:underline"
          >
            browse your assets
          </button>
        </p>
      )}
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_IMAGES}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

export function PromptBox({
  value,
  onChange,
  placeholder,
  max = 1000,
  onImprove,
  improving,
  label,
  inputRef,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  max?: number;
  onImprove?: () => void;
  improving?: boolean;
  label: string;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  rows?: number;
}) {
  return (
    <div className="rounded-xl border border-white/12 bg-black/25 transition-colors duration-200 focus-within:border-white/35">
      <textarea
        ref={inputRef}
        value={value}
        rows={rows}
        maxLength={max}
        aria-label={label}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full resize-none rounded-none border-0 bg-transparent px-3.5 pt-3 pb-0 text-[13px] leading-6 text-white placeholder:text-cream/30 focus:shadow-none focus:outline-none"
      />
      <div className="flex items-center gap-2 px-2.5 pt-1 pb-2.5">
        {onImprove && (
          <button
            type="button"
            onClick={onImprove}
            disabled={improving}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/6 px-3 text-[11.5px] font-medium text-ember-soft transition-colors duration-200 hover:bg-white/10 disabled:opacity-60"
          >
            <GMagicWand size={13} className={improving ? "motion-safe:animate-pulse" : ""} />
            {improving ? "Improving…" : "Improve"}
          </button>
        )}
        <span className="ml-auto text-[11px] text-cream/35 tabular-nums">
          {value.length} / {max}
        </span>
      </div>
    </div>
  );
}

const calloutTones = {
  info: "border-white/14 bg-white/5 text-cream/80",
  warn: "border-ember/35 bg-ember/8 text-ember-soft",
  error: "border-ember/50 bg-ember/12 text-ember-soft",
  success: "border-white/18 bg-white/7 text-white",
};

export function Callout({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
}: {
  tone?: keyof typeof calloutTones;
  title?: string;
  children?: React.ReactNode;
  /** Buttons under the message. */
  action?: React.ReactNode;
  onDismiss?: () => void;
}) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-3.5 py-3 text-[12.5px] leading-5 ${calloutTones[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {title && <p className="font-display text-[12.5px] font-medium">{title}</p>}
          {children && <div className={title ? "mt-0.5 opacity-85" : ""}>{children}</div>}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="shrink-0 text-[11.5px] underline underline-offset-2 opacity-80 hover:opacity-100">
            Dismiss
          </button>
        )}
      </div>
      {action && <div className="mt-2.5 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Generate bar, steps, save state, credits
// ---------------------------------------------------------------------------

const noSubscribe = () => () => {};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded-md bg-white/18 px-1 font-display text-[10px] font-medium text-white/90">
      {children}
    </kbd>
  );
}

export function GenerateBar({
  label,
  onGenerate,
  disabled,
  busy,
  credits,
  estimate,
  hint,
}: {
  label: string;
  onGenerate: () => void;
  disabled?: boolean;
  busy?: boolean;
  credits: number;
  estimate: string;
  hint?: string;
}) {
  const mac = useSyncExternalStore(noSubscribe, () => /Mac|iPhone|iPad/.test(navigator.platform), () => false);
  const low = credits > 0 && credits <= 3;
  const out = credits <= 0;
  return (
    <div className="border-t border-white/8 bg-stage-raised px-5 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || busy}
        className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-ember font-display text-[14px] font-medium text-white transition-[background-color,opacity] duration-200 ease-out-soft hover:bg-ember-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (
          <span className="size-4 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
        ) : (
          <GSparkleFill size={17} />
        )}
        {busy ? "Generating…" : label}
        {!busy && (
          <span className="ml-1 hidden items-center gap-0.5 lg:inline-flex" aria-hidden>
            <Kbd>{mac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>↵</Kbd>
          </span>
        )}
      </button>
      <p className="mt-2.5 text-center font-display text-[9.5px] font-semibold tracking-[0.16em] text-cream/40 uppercase">
        {hint ? (
          <span className="tracking-[0.08em] normal-case">{hint}</span>
        ) : (
          <>
            1 credit · {credits} left · est. {estimate}
            {out ? <span className="text-ember-soft"> · out of credits</span> : low ? <span className="text-ember-soft"> · low balance</span> : null}
          </>
        )}
      </p>
    </div>
  );
}

export type Step = { label: string; short?: string; state: "done" | "current" | "todo" };

export function StepTracker({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex items-center gap-3">
      {steps.map((s, i) => (
        <li key={s.label} className="flex min-w-0 flex-1 items-center gap-3 last:flex-none">
          <span className="flex min-w-0 items-center gap-2" aria-current={s.state === "current" ? "step" : undefined}>
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full font-display text-[9.5px] font-semibold tabular-nums ${s.state === "done" ? "bg-white/14 text-white" : s.state === "current" ? "bg-ember text-white" : "border border-white/18 text-cream/45"}`}
            >
              {s.state === "done" ? <GCheckBold size={10} /> : i + 1}
            </span>
            <span className={`truncate font-display text-[11.5px] font-medium ${s.state === "todo" ? "text-cream/40" : "text-white"}`}>
              {s.short ? (
                <>
                  <span className="sm:hidden">{s.short}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </>
              ) : (
                s.label
              )}
            </span>
          </span>
          {i < steps.length - 1 && <span aria-hidden className="h-px min-w-4 flex-1 bg-white/12" />}
        </li>
      ))}
    </ol>
  );
}

export function SavedState({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-[11px] whitespace-nowrap text-cream/40" aria-live="polite">
      <GCloudCheck size={12} />
      {label}
    </span>
  );
}

export function CreditsPill({ credits, onClick }: { credits: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 font-display text-[11px] font-medium whitespace-nowrap transition-colors duration-200 hover:bg-white/12 ${credits <= 0 ? "bg-ember/20 text-ember-soft" : credits <= 3 ? "bg-ember/12 text-ember-soft" : "bg-white/8 text-cream/75"}`}
    >
      <GSparkleFill size={12} />
      {credits} {credits === 1 ? "credit" : "credits"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Stage imagery
// ---------------------------------------------------------------------------

/** Measures an image's natural ratio and the box it can fill inside its parent. */
function useFitBox(src: string) {
  const outer = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let live = true;
    const img = new window.Image();
    img.onload = () => live && setRatio(img.naturalWidth / img.naturalHeight || 4 / 3);
    img.onerror = () => live && setRatio(4 / 3);
    img.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el || !ratio) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const w = Math.min(width, height * ratio);
      setBox({ w: Math.floor(w), h: Math.floor(w / ratio) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio]);

  return { outer, box };
}

export function StageTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute rounded-full bg-black/60 px-2.5 py-1 font-display text-[9.5px] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}

/** One image, fitted to the stage at its own proportions. Sources are uploads (data URLs), so a plain <img>. */
export function FitImage({
  src,
  alt,
  children,
  imgStyle,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  imgStyle?: React.CSSProperties;
}) {
  const { outer, box } = useFitBox(src);
  return (
    <div ref={outer} className="flex size-full items-center justify-center">
      {box ? (
        <div className="relative overflow-hidden rounded-xl" style={{ width: box.w, height: box.h }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="size-full object-cover" style={imgStyle} draggable={false} />
          {children}
        </div>
      ) : (
        <div className="size-full rounded-xl bg-white/4 motion-safe:animate-pulse" aria-label="Loading image" />
      )}
    </div>
  );
}

/** Before/after with a draggable divider. */
export function CompareSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  start = 50,
  children,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  start?: number;
  /** Drawn on top (e.g. the stage's floating buttons). */
  children?: React.ReactNode;
}) {
  const { outer, box } = useFitBox(after);
  const [pos, setPos] = useState(start);
  const frame = useRef<HTMLDivElement>(null);
  const move = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={outer} className="flex size-full items-center justify-center">
      {box ? (
        <div
          ref={frame}
          className="relative cursor-ew-resize touch-none overflow-hidden rounded-xl select-none"
          style={{ width: box.w, height: box.h }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e.clientX);
          }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e.clientX)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={after} alt={afterLabel} className="size-full object-cover" draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={before} alt={beforeLabel} className="size-full object-cover" draggable={false} />
          </div>
          <StageTag className="bottom-3 left-3">{beforeLabel}</StageTag>
          <StageTag className="right-3 bottom-3">{afterLabel}</StageTag>
          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }}>
            <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              <GArrowsHorizontal size={16} />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            aria-label={`Compare ${beforeLabel} with ${afterLabel}`}
            onChange={(e) => setPos(Number(e.target.value))}
            className="sr-only"
          />
          {children}
        </div>
      ) : (
        <div className="size-full rounded-xl bg-white/4 motion-safe:animate-pulse" />
      )}
    </div>
  );
}

/** A square photo thumbnail in the panel or the stage strip. */
export function Thumb({
  src,
  label,
  active,
  onClick,
  badge,
}: {
  src: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-[border-color] duration-200 ${active ? "border-ember" : "border-transparent hover:border-white/30"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-cover" />
      {badge && (
        <span className="absolute inset-x-0 bottom-0 bg-black/65 py-0.5 text-center font-display text-[8px] font-semibold tracking-[0.04em] text-white uppercase">
          {badge}
        </span>
      )}
    </button>
  );
}

/** Generation overlay: a scan line, the current phase and a progress bar. */
export function RenderProgress({ progress, phases, onCancel }: { progress: number; phases: string[]; onCancel: () => void }) {
  const phase = phases[Math.min(phases.length - 1, Math.floor((progress / 100) * phases.length))];
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-stage/55 backdrop-blur-[3px]" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pt-16 pb-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-stage/95 via-stage/70 to-transparent" />
        <p className="relative font-display text-[15px] font-medium text-white" aria-live="polite">
          {phase}
        </p>
        <p className="relative mt-1 text-[12px] text-cream/55">You can keep adjusting settings while this runs.</p>
        <div
          className="relative mt-4 h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-white/14"
          role="progressbar"
          aria-label="Generation progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-ember transition-[width] duration-300 ease-out-soft" style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="relative mt-3 min-h-10 px-4 text-[12.5px] text-cream/65 underline-offset-2 transition-colors duration-200 hover:text-white hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

/** The editor's dark modal: a bottom sheet on phones, centred from sm. Native <dialog>, so focus and Escape come free. */
export function StageDialog({
  open,
  onClose,
  title,
  subtitle,
  placement = "center",
  wide,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** "drawer": a full-height panel on the right from sm (version history). */
  placement?: "center" | "drawer";
  /** 560px wide from sm instead of 460px (Share & export). */
  wide?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={`fixed m-0 flex max-w-none flex-col overflow-hidden bg-stage-raised p-0 text-white backdrop:bg-black/60 backdrop:backdrop-blur-[2px] not-open:hidden ${placement === "drawer" ? "inset-x-0 top-auto bottom-0 max-h-[88svh] w-full rounded-t-card border-t border-white/10 sm:inset-y-0 sm:right-0 sm:left-auto sm:h-svh sm:max-h-svh sm:w-[420px] sm:rounded-none sm:border-t-0 sm:border-l" : `inset-x-0 top-auto bottom-0 max-h-[88svh] w-full rounded-t-card border-t border-white/10 sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[86svh] sm:rounded-card sm:border ${wide ? "sm:w-[min(560px,calc(100vw-2rem))]" : "sm:w-[460px]"}`}`}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[15px] font-medium text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 truncate text-[12px] text-cream/50">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-cream/70 transition-colors duration-200 hover:bg-white/8 hover:text-white"
        >
          <GX size={18} />
        </button>
      </div>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {open ? children : null}
      </div>
    </dialog>
  );
}

export type Asset = { id: string; name: string; image: string };

/** "Choose from your assets": a short loading shimmer, then the account's photos. */
export function AssetGrid({ assets, selected, onPick }: { assets: Asset[]; selected?: string; onPick: (a: Asset) => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, []);
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" aria-label="Loading your assets">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/3] rounded-lg bg-white/6 motion-safe:animate-pulse" />
        ))}
      </div>
    );
  if (!assets.length)
    return (
      <p className="py-8 text-center text-[12.5px] leading-6 text-cream/55">
        Nothing here yet. Photos you upload to any tool are kept here so you can reuse them.
      </p>
    );
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {assets.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onPick(a)}
          aria-pressed={a.image === selected}
          className={`group overflow-hidden rounded-lg border-2 text-left transition-[border-color] duration-200 ${a.image === selected ? "border-ember" : "border-transparent hover:border-white/30"}`}
        >
          <span className="relative block aspect-[4/3] w-full">
            <Image src={a.image} alt="" fill sizes="140px" className="object-cover" />
          </span>
          <span className="block truncate bg-white/4 px-2 py-1.5 text-[11px] text-cream/75">{a.name}</span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slider, method cards, pins
// ---------------------------------------------------------------------------

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  unit = "",
  format,
  track,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  format?: (v: number) => string;
  /** A custom track background (e.g. a colour-temperature gradient). */
  track?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const shown = format ? format(value) : `${value}${unit}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-cream/70">{label}</span>
        <span className="text-[12px] font-medium text-white tabular-nums">{shown}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuetext={shown}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 mb-1 h-1 w-full cursor-pointer appearance-none rounded-full border-0 p-0 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
        style={{
          background:
            track ??
            `linear-gradient(to right, var(--color-ember) 0%, var(--color-ember) ${pct}%, rgba(255,255,255,0.16) ${pct}%, rgba(255,255,255,0.16) 100%)`,
        }}
      />
    </div>
  );
}

/** Two-up cards for choosing a method: icon, title, hint, optional badge, a check when chosen. */
export function MethodCards({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; title: string; hint: string; icon: Glyph; badge?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const on = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`relative flex flex-col rounded-xl border p-3 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
          >
            <span className="flex items-center gap-2 pr-6">
              <Icon size={17} fill={on} className={on ? "text-ember-soft" : "text-cream/70"} />
              <span className="font-display text-[13px] font-semibold text-white">{o.title}</span>
            </span>
            <span className="mt-1.5 text-[11px] leading-[1.45] text-cream/55">{o.hint}</span>
            {o.badge && (
              <span className="mt-2.5 self-start rounded-full bg-white/8 px-2 py-0.5 font-display text-[9.5px] font-semibold tracking-[0.12em] text-cream/70 uppercase">
                {o.badge}
              </span>
            )}
            {on && (
              <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-ember text-white">
                <GCheckBold size={11} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type Pin = { id: string; at: { x: number; y: number }; n: number; tone: "change" | "add" | "remove"; label: string };
const PIN_HIT = 4.5;

/** Numbered pins with labels on the photo; tapping empty space reports a point, tapping a pin selects it. */
export function PinLayer({
  pins,
  selectedId,
  interactive,
  onTap,
  onSelect,
}: {
  pins: Pin[];
  selectedId?: string | null;
  interactive: boolean;
  onTap?: (at: { x: number; y: number }) => void;
  onSelect?: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={box}
      className={`absolute inset-0 ${interactive ? "cursor-crosshair touch-none" : "pointer-events-none"}`}
      onPointerDown={(e) => {
        if (!interactive) return;
        const r = box.current?.getBoundingClientRect();
        if (!r) return;
        const at = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
        const hit = pins.find((p) => Math.abs(p.at.x - at.x) < PIN_HIT && Math.abs(p.at.y - at.y) < PIN_HIT * 1.4);
        if (hit) onSelect?.(hit.id);
        else onTap?.(at);
      }}
    >
      {pins.map((p) => {
        const flip = p.at.x > 68;
        const on = p.id === selectedId;
        return (
          <span
            key={p.id}
            className={`pointer-events-none absolute flex items-center gap-1.5 ${flip ? "flex-row-reverse" : ""}`}
            style={{ left: `${p.at.x}%`, top: `${p.at.y}%`, transform: `translate(${flip ? "calc(-100% + 14px)" : "-14px"}, -50%)` }}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${p.tone === "add" ? "bg-white text-navy" : p.tone === "remove" ? "border-2 border-ember bg-black/70 text-ember-soft" : "bg-ember text-white"} ${on ? "ring-2 ring-white ring-offset-2 ring-offset-black/40" : ""}`}
            >
              {p.n}
            </span>
            <span
              className={`rounded-full bg-black/70 px-2 py-0.5 text-[10.5px] whitespace-nowrap text-white backdrop-blur-md ${p.tone === "remove" ? "line-through decoration-ember-soft" : ""}`}
            >
              {p.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
