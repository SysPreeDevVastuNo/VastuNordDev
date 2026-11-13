"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Callout, Chips, PillButton, RatioGlyph, StageDialog } from "@/app/app/editor/[fileId]/_ui/controls";
import {
  GArrowRight,
  GArrowSquareOut,
  GCheckBold,
  GCheckCircle,
  GCopy,
  GDownload,
  GDownloadTab,
  GFileJpg,
  GFilePdf,
  GFilePng,
  GLinkSimple,
  GShareNetwork,
  GShareTab,
  GSparkle,
  type Glyph,
} from "@/app/app/editor/[fileId]/_ui/icons";
import {
  CopyLink,
  ExportSteps,
  FieldLabel,
  ShareSettings,
  ShareStatusBadge,
  ToneChips,
  ToneToggle,
  tones,
} from "@/components/app/ShareControls";
import { mockExportDefaults, mockProfile } from "@/lib/mock/account";
import {
  applyNaming,
  captionFor,
  checkFileName,
  compressionOptions,
  defaultShareSettings,
  estimateBytes,
  formatBytes,
  optionLetter,
  reviewUrl,
  settingsValid,
  shareStatus,
  slugify,
  socialFormat,
  socialFormats,
  type Compression,
  type ExportKind,
  type Layout,
  type Share,
} from "@/lib/mock/delivery";
import { mockCredits } from "@/lib/mock/entities";
import { createShare, recordDelivery, studioNow, useStudio } from "@/lib/mock/store";
import { canShareFiles, canvasToBlob, copyText, renderCanvas, saveBlob } from "@/lib/render";
import { useExport, type ExportSpec } from "@/lib/useExport";

const $ = tones.dark;

export type DeliverTab = "download" | "link" | "social";

/** A file's versions as Share & export offers them, newest first. */
export type DeliverTarget = {
  fileId: string;
  fileName: string;
  projectId?: string;
  category?: string;
  versions: { id: string; number: number; resultId: string; image: string; before: string }[];
};
type TargetVersion = DeliverTarget["versions"][number];

const tabs: { id: DeliverTab; label: string; icon: Glyph }[] = [
  { id: "download", label: "Download", icon: GDownloadTab },
  { id: "link", label: "Review link", icon: GLinkSimple },
  { id: "social", label: "Social", icon: GShareTab },
];

/** Timers for simulated service calls, cleared on unmount. */
function useLater() {
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  return (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

// E-X / E-S1 / E-SM — Share & export: download a file, make a review link for
// a client, or prepare an image for social media, from any version.
export default function ShareExport({
  open,
  onClose,
  tab,
  onTab,
  versionId,
  onVersion,
  target,
  onMoreVariations,
}: {
  open: boolean;
  onClose: () => void;
  tab: DeliverTab;
  onTab: (tab: DeliverTab) => void;
  versionId: string;
  onVersion: (id: string) => void;
  target: DeliverTarget;
  onMoreVariations: () => void;
}) {
  const tabRefs = useRef<Record<DeliverTab, HTMLButtonElement | null>>({ download: null, link: null, social: null });
  // The version the review link starts from: the one picked when the dialog opened, or "Share it for review".
  const [linkVersion, setLinkVersion] = useState(versionId);
  const [openedWith, setOpenedWith] = useState({ open, versionId });
  if (open !== openedWith.open) {
    setOpenedWith({ open, versionId });
    if (open) setLinkVersion(versionId);
  }

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
    if (next < 0) return;
    e.preventDefault();
    onTab(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  if (!target.versions.length)
    return (
      <StageDialog open={open} onClose={onClose} title="Share & export">
        <p className="py-8 text-center text-[13px] leading-6 text-cream/60">
          Generate a first version, and it can be downloaded, sent for review or posted from here.
        </p>
      </StageDialog>
    );

  return (
    <StageDialog open={open} onClose={onClose} title="Share & export" subtitle={target.fileName} wide>
      <div role="tablist" aria-label="Share or export" onKeyDown={onKey} className="-mt-1 mb-6 grid grid-cols-3 gap-1 rounded-full bg-white/5 p-1">
        {tabs.map((t) => {
          const on = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`deliver-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`deliver-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => onTab(t.id)}
              className={`flex min-h-9 items-center justify-center gap-1.5 rounded-full font-display text-[12px] font-medium transition-colors duration-200 ${on ? "bg-white text-navy" : "text-cream/65 hover:text-white"}`}
            >
              <Icon size={14} fill={on} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id="deliver-panel-download" aria-labelledby="deliver-tab-download" hidden={tab !== "download"}>
        <DownloadPanel
          target={target}
          versionId={versionId}
          onVersion={onVersion}
          onShare={(id) => {
            setLinkVersion(id);
            onTab("link");
          }}
          onMoreVariations={onMoreVariations}
        />
      </div>
      <div role="tabpanel" id="deliver-panel-link" aria-labelledby="deliver-tab-link" hidden={tab !== "link"}>
        <LinkPanel key={linkVersion} target={target} initialVersionId={linkVersion} />
      </div>
      <div role="tabpanel" id="deliver-panel-social" aria-labelledby="deliver-tab-social" hidden={tab !== "social"}>
        <SocialPanel target={target} versionId={versionId} onVersion={onVersion} />
      </div>
    </StageDialog>
  );
}

/** Version thumbnails in a row: one to pick, or up to `max` (lettered A, B…) for a review link. */
function VersionPicker({
  versions,
  selected,
  onToggle,
  multi,
  max = 4,
  label = "Version",
}: {
  versions: TargetVersion[];
  selected: string[];
  onToggle: (id: string) => void;
  multi?: boolean;
  max?: number;
  label?: string;
}) {
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
      {versions.map((v) => {
        const at = selected.indexOf(v.id);
        const on = at >= 0;
        const full = multi && !on && selected.length >= max;
        return (
          <button
            key={v.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            aria-label={`Version ${v.number}${on && multi ? `, option ${optionLetter(at)}` : ""}`}
            disabled={full}
            onClick={() => onToggle(v.id)}
            className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-200 disabled:opacity-35 ${on ? "border-ember" : "border-transparent hover:border-white/30"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.image} alt="" className="size-full object-cover" loading="lazy" />
            {multi && on && (
              <span className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-ember font-display text-[10px] font-semibold text-white">
                {optionLetter(at)}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-black/65 py-0.5 text-center font-display text-[9.5px] text-white">v{v.number}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

const formats: { id: ExportKind; title: string; hint: string; icon: Glyph }[] = [
  { id: "jpg", title: "JPG", hint: "Small file for email and messages", icon: GFileJpg },
  { id: "png", title: "PNG", hint: "Lossless, for presentations", icon: GFilePng },
  { id: "pdf", title: "PDF", hint: "One page, titled, for sending", icon: GFilePdf },
  { id: "highres", title: "High resolution", hint: "8K, upscaled and checked, for print", icon: GSparkle },
];

const formatLabel = (kind: ExportKind, size: string) => (kind === "highres" ? "High resolution · 8K PNG" : `${kind.toUpperCase()} · ${size}`);

function DownloadPanel({
  target,
  versionId,
  onVersion,
  onShare,
  onMoreVariations,
}: {
  target: DeliverTarget;
  versionId: string;
  onVersion: (id: string) => void;
  onShare: (versionId: string) => void;
  onMoreVariations: () => void;
}) {
  const nameId = useId();
  const exp = useExport();
  const [kind, setKind] = useState<ExportKind>(mockExportDefaults.format);
  const [size, setSize] = useState<"HD" | "4K">(mockExportDefaults.size);
  const [compression, setCompression] = useState<Compression>("balanced");
  const [layout, setLayout] = useState<Layout>("result");
  const [edited, setEdited] = useState(false);
  const [draft, setDraft] = useState("");
  const [nameError, setNameError] = useState<string>();

  const version = target.versions.find((v) => v.id === versionId) ?? target.versions[0];
  const outSize = kind === "highres" ? "8K" : size;
  const outLayout = kind === "highres" ? "result" : layout;
  const ext = kind === "jpg" ? ".jpg" : kind === "pdf" ? ".pdf" : ".png";
  const suggested = version
    ? `${applyNaming(mockExportDefaults.naming, { file: target.fileName, version: version.number, size: outSize })}${outLayout === "before-after" ? "-before-after" : ""}`
    : "";
  // The name follows the settings until the user types their own.
  const name = edited ? draft : suggested;
  const about = formatBytes(estimateBytes(kind, outSize, compression, outLayout));

  const download = () => {
    const error = checkFileName(name);
    setNameError(error);
    if (error || !version) return;
    const spec: ExportSpec = {
      kind,
      fileId: target.fileId,
      projectId: target.projectId,
      items: [
        {
          versionId: version.id,
          versionNumber: version.number,
          resultId: version.resultId,
          image: version.image,
          before: version.before,
          filename: `${name.trim()}${ext}`,
        },
      ],
      size: outSize,
      compression,
      layout: outLayout,
      watermarked: false,
      page: {
        title: target.fileName,
        subtitle: `${mockProfile.studio || mockProfile.name} · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        footer: "Visualised with VastuNord",
      },
    };
    void exp.start(spec);
  };

  const { phase } = exp;

  if (phase.kind === "running")
    return (
      <div className="space-y-5">
        <ExportSummary image={version?.image} title={`${name}${ext}`} meta={`${formatLabel(kind, outSize)} · about ${about}`} />
        <ExportSteps steps={exp.steps} />
        <p className={`text-[11.5px] ${$.faint}`}>Closing this stops the export. Nothing is charged for an export that does not finish.</p>
      </div>
    );

  if (phase.kind === "delivered") {
    const first = phase.deliveries[0];
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
            <GCheckCircle size={20} fill />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-medium text-white">
              {phase.deliveries.length > 1 ? `${phase.deliveries.length} files delivered` : "Delivered"}
            </p>
            <p className={`mt-0.5 text-[12.5px] leading-5 ${$.soft}`}>
              {first?.filename}
              {phase.deliveries.length > 1 ? ` and ${phase.deliveries.length - 1} more` : ""} · {formatBytes(first?.bytes ?? 0)}
              {first?.watermarked ? " · trial watermark" : ""}
              {first?.credits ? ` · ${first.credits * phase.deliveries.length} credits` : ""}
            </p>
          </div>
        </div>
        {phase.downloadBlocked ? (
          <Callout
            tone="error"
            title="Your browser blocked the download"
            action={<PillButton label="Download again" icon={GDownload} size="sm" variant="ghost" onClick={exp.downloadAgain} />}
          >
            The file is ready. Allow downloads for this site, or tap Download again.
          </Callout>
        ) : (
          <p className={`text-[12px] ${$.faint}`}>
            In your downloads.{" "}
            <button type="button" onClick={exp.downloadAgain} className="text-ember-soft underline-offset-2 hover:underline">
              Did not arrive? Download again
            </button>
          </p>
        )}
        <div>
          <p className={`mb-2 ${$.label}`}>What next</p>
          <div className="grid gap-2">
            <NextStep icon={GShareNetwork} title="Share it for review" hint="A link your client can open, compare and approve" onClick={() => onShare(versionId)} />
            <NextStep icon={GSparkle} title="Generate more variations" hint="Back to the panel, with this version’s settings" onClick={onMoreVariations} />
            <NextStep icon={GDownload} title="Export another format" hint="Same version, different file" onClick={exp.reset} />
          </div>
        </div>
        <Link
          href="/app/shared?tab=downloads"
          className="inline-flex items-center gap-1.5 text-[12px] text-cream/55 transition-colors duration-200 hover:text-white"
        >
          Every download is listed in Shared
          <GArrowRight size={12} />
        </Link>
      </div>
    );
  }

  if (phase.kind === "missing" || phase.kind === "failed")
    return (
      <div className="space-y-5">
        <ExportSteps steps={exp.steps} />
        {phase.kind === "missing" ? (
          <Callout
            tone="error"
            title="The image for this version is missing"
            action={target.versions.length > 1 ? <PillButton label="Choose another version" size="sm" onClick={exp.reset} /> : undefined}
          >
            The version is listed, but its image did not come back from storage. Generating again from its settings brings it back.
          </Callout>
        ) : (
          <Callout tone="error" title="The file could not be made" action={<PillButton label="Try again" size="sm" onClick={download} />}>
            The image did not load in your browser, so nothing was downloaded. Check your connection and try again.
          </Callout>
        )}
        <button type="button" onClick={exp.reset} className="text-[12px] text-cream/55 underline-offset-2 hover:text-white hover:underline">
          Change settings instead
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <p className={`mb-2 ${$.label}`}>Version</p>
        <VersionPicker versions={target.versions} selected={[versionId]} onToggle={onVersion} />
      </div>

      <div>
        <p className={`mb-2 ${$.label}`}>File type</p>
        <div role="radiogroup" aria-label="File type" className="grid gap-2 sm:grid-cols-2">
          {formats.map((f) => {
            const on = f.id === kind;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setKind(f.id)}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 sm:block ${on ? $.on : `${$.box} ${$.boxHover}`}`}
              >
                <Icon size={18} fill={on} className={`mt-0.5 shrink-0 sm:mt-0 ${on ? "text-ember-soft" : "text-cream/55"}`} />
                <span className="min-w-0 sm:mt-1.5 sm:block">
                  <span className="flex items-center gap-1.5 font-display text-[13px] font-semibold text-white">
                    {f.title}
                    {f.id === "highres" && (
                      <span className="rounded-full bg-white/10 px-1.5 py-px font-display text-[9px] font-semibold tracking-[0.08em] text-cream/70 uppercase">
                        2 credits
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-cream/50">{f.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {kind === "highres" ? (
        <div className="rounded-xl border border-white/8 px-3.5 py-3 text-[12px] leading-5 text-cream/60">
          Upscaled to 7680 px on the long edge, checked for artefacts, and delivered as a lossless PNG.
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className={`mb-2 ${$.label}`}>Size</p>
              <Chips label="Size" options={[{ value: "4K" }, { value: "HD" }]} value={size} onChange={(v) => setSize(v as "HD" | "4K")} />
              <p className={`mt-1.5 text-[11px] ${$.faint}`}>{size === "4K" ? "3840 px, for screens and slides" : "1920 px, for email and web"}</p>
            </div>
            <div>
              <p className={`mb-2 ${$.label}`}>Layout</p>
              <ToneChips
                label="Layout"
                options={[
                  { id: "result", label: "Result" },
                  { id: "before-after", label: "Before & after" },
                ]}
                value={layout}
                onChange={setLayout}
              />
              <p className={`mt-1.5 text-[11px] ${$.faint}`}>
                {layout === "before-after" ? "Original and result, side by side" : "This version on its own"}
              </p>
            </div>
          </div>
          {kind === "jpg" && (
            <div>
              <p className={`mb-2 ${$.label}`}>Compression</p>
              <ToneChips label="Compression" options={compressionOptions} value={compression} onChange={setCompression} />
            </div>
          )}
        </>
      )}

      <div>
        <FieldLabel htmlFor={nameId}>File name</FieldLabel>
        <div
          className={`flex items-center rounded-xl border bg-white/5 pr-3.5 ${nameError ? "border-ember" : "border-white/12 focus-within:border-white/35"}`}
        >
          <input
            id={nameId}
            value={name}
            onChange={(e) => {
              setEdited(true);
              setDraft(e.target.value);
              setNameError(undefined);
            }}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? `${nameId}-error` : undefined}
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-base text-white focus:outline-none sm:text-[13px]"
          />
          <span className="text-[13px] text-cream/40">{ext}</span>
        </div>
        {nameError ? (
          <p id={`${nameId}-error`} className="mt-1.5 text-[12px] text-ember">
            {nameError}
          </p>
        ) : edited ? (
          <button
            type="button"
            onClick={() => setEdited(false)}
            className="mt-1.5 text-[11.5px] text-cream/50 underline-offset-2 hover:text-white hover:underline"
          >
            Use the suggested name
          </button>
        ) : null}
      </div>

      <div>
        <PillButton
          label={kind === "highres" ? "Upscale and download · 2 credits" : `Download ${kind.toUpperCase()}`}
          icon={kind === "highres" ? GSparkle : GDownload}
          onClick={download}
          disabled={!version}
          className="w-full"
        />
        <p className={`mt-2 text-center text-[11px] ${$.faint}`}>
          About {about}
          {kind === "highres" ? ` · ${mockCredits} credits left` : ""}
        </p>
      </div>
    </div>
  );
}

function ExportSummary({ image, title, meta }: { image?: string; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image && <img src={image} alt="" className="size-14 shrink-0 rounded-lg object-cover" />}
      <div className="min-w-0">
        <p className="truncate font-display text-[13.5px] font-medium text-white">{title}</p>
        <p className={`mt-0.5 text-[11.5px] ${$.faint}`}>{meta}</p>
      </div>
    </div>
  );
}

function NextStep({ icon: Icon, title, hint, onClick }: { icon: Glyph; title: string; hint: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3.5 py-3 text-left transition-colors duration-200 hover:border-white/30"
    >
      <Icon size={18} className="shrink-0 text-cream/70" />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[13px] font-medium text-white">{title}</span>
        <span className="mt-0.5 block text-[11.5px] leading-4 text-cream/50">{hint}</span>
      </span>
      <GArrowRight size={14} className="shrink-0 text-cream/40" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Review link
// ---------------------------------------------------------------------------

const MAX_OPTIONS = 4;
const MAX_MESSAGE = 400;

function LinkPanel({ target, initialVersionId }: { target: DeliverTarget; initialVersionId: string }) {
  const titleId = useId();
  const messageId = useId();
  const later = useLater();
  const { shares } = useStudio();
  const [selected, setSelected] = useState<string[]>(initialVersionId ? [initialVersionId] : []);
  const [title, setTitle] = useState(target.fileName);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(defaultShareSettings);
  const [state, setState] = useState<{ kind: "form" } | { kind: "creating" } | { kind: "ready"; share: Share }>({ kind: "form" });
  const [titleError, setTitleError] = useState<string>();

  const already = shares
    .filter((s) => s.items.some((i) => i.fileId === target.fileId) && !s.revokedAt)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  // Tapping a picked version unpicks it (keeping at least one); a new one joins the end.
  const toggle = (id: string) =>
    setSelected((list) =>
      list.includes(id) ? (list.length > 1 ? list.filter((x) => x !== id) : list) : list.length < MAX_OPTIONS ? [...list, id] : list
    );

  const create = () => {
    if (!title.trim()) return setTitleError("Give it a title. Your client sees it first.");
    if (!settingsValid(settings)) return;
    setTitleError(undefined);
    setState({ kind: "creating" });
    later(() => {
      const items = selected
        .map((id) => target.versions.find((v) => v.id === id))
        .filter((v): v is TargetVersion => !!v)
        .map((v) => ({ fileId: target.fileId, versionId: v.id }));
      const share = createShare({
        title: title.trim(),
        message: message.trim(),
        items,
        settings,
        projectId: target.projectId,
        kind: "options",
      });
      setState({ kind: "ready", share });
    }, 1000);
  };

  if (state.kind === "ready") {
    const url = reviewUrl(state.share.token);
    const canSend = typeof navigator !== "undefined" && typeof navigator.share === "function";
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
            <GCheckCircle size={20} fill />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-medium text-white">Your link is ready</p>
            <p className={`mt-0.5 text-[12.5px] leading-5 ${$.soft}`}>
              {state.share.items.length > 1 ? `${state.share.items.length} options` : "One image"}
              {state.share.settings.review ? ", and they can approve or ask for changes" : ", to look at"}.
            </p>
          </div>
        </div>
        <CopyLink url={url} />
        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={url}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/18 px-5 font-display text-[13px] font-medium text-white transition-colors duration-200 hover:border-white/40"
          >
            <GArrowSquareOut size={15} />
            See it as your client
          </a>
          {canSend && (
            <PillButton
              label="Send with…"
              icon={GShareNetwork}
              variant="ghost"
              onClick={() => navigator.share({ title: state.share.title, url }).catch(() => undefined)}
            />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-4">
          <Link
            href={`/app/shared/${state.share.id}`}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-cream/60 transition-colors duration-200 hover:text-white"
          >
            Follow it in Shared
            <GArrowRight size={12} />
          </Link>
          <button type="button" onClick={() => setState({ kind: "form" })} className="text-[12.5px] text-ember-soft underline-offset-2 hover:underline">
            Make another link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {already.length > 0 && (
        <div>
          <p className={`mb-2 ${$.label}`}>Already shared from this file</p>
          <ul className="space-y-1.5">
            {already.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/app/shared/${s.id}`}
                  className="flex items-center gap-3 rounded-xl border border-white/8 px-3 py-2.5 transition-colors duration-200 hover:border-white/25"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[12.5px] font-medium text-white">{s.title}</span>
                    <span className={`block text-[11px] ${$.faint}`}>
                      {s.items.length} {s.items.length === 1 ? "option" : "options"} · {s.views} {s.views === 1 ? "view" : "views"}
                    </span>
                  </span>
                  <ShareStatusBadge status={shareStatus(s, studioNow())} tone="dark" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className={$.label}>What they see</p>
          <span className={`text-[11px] ${$.faint}`}>
            {selected.length > 1 ? `${selected.length} options to choose from` : "Pick up to four to compare"}
          </span>
        </div>
        <VersionPicker versions={target.versions} selected={selected} onToggle={toggle} multi max={MAX_OPTIONS} label="Versions to share" />
        {selected.length > 1 && (
          <p className={`mt-2 text-[11.5px] leading-5 ${$.faint}`}>
            Shown as {selected.map((_, i) => optionLetter(i)).join(", ")}, in the order you picked them. They choose one.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor={titleId}>Title</FieldLabel>
          <input
            id={titleId}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(undefined);
            }}
            maxLength={80}
            aria-invalid={titleError ? true : undefined}
            className={$.input}
          />
          {titleError && <p className="mt-1.5 text-[12px] text-ember">{titleError}</p>}
        </div>
        <div>
          <FieldLabel htmlFor={messageId}>
            Message <span className="tracking-normal normal-case opacity-70">optional</span>
          </FieldLabel>
          <textarea
            id={messageId}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
            rows={3}
            placeholder="What should they look at, and what do you need from them…"
            className={`${$.input} resize-none`}
          />
        </div>
      </div>

      <ShareSettings value={settings} onChange={setSettings} />

      <PillButton
        label={state.kind === "creating" ? "Creating the link…" : "Create review link"}
        icon={GShareNetwork}
        onClick={create}
        disabled={state.kind === "creating" || !selected.length || !settingsValid(settings)}
        className="w-full"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

const MAX_CAPTION = 2200;

function SocialPanel({ target, versionId, onVersion }: { target: DeliverTarget; versionId: string; onVersion: (id: string) => void }) {
  const captionId = useId();
  const [formatId, setFormatId] = useState(socialFormats[0].id);
  const [layout, setLayout] = useState<Layout>("before-after");
  const [credit, setCredit] = useState(true);
  const [ownCaption, setOwnCaption] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"shared" | "downloaded" | "failed" | "render-failed" | null>(null);
  const [copied, setCopied] = useState(false);

  const version = target.versions.find((v) => v.id === versionId) ?? target.versions[0];
  const format = socialFormat(formatId);
  const ratio = format.w / format.h;
  // The caption follows the settings until the user edits it.
  const caption = ownCaption ?? captionFor(target.fileName, layout, target.category, credit);
  const filename = `${slugify(target.fileName)}-v${version?.number ?? 0}-${format.id}.jpg`;

  // A small live preview, drawn the same way as the real file.
  const after = version?.image ?? "";
  const before = version?.before ?? "";
  useEffect(() => {
    if (!after) return;
    let live = true;
    renderCanvas({ after, before, layout, ratio, longEdge: 640, credit })
      .then((c) => live && setPreview(c.toDataURL("image/jpeg", 0.82)))
      .catch(() => live && setPreview(undefined));
    return () => {
      live = false;
    };
  }, [after, before, layout, ratio, credit]);

  const make = async () => {
    if (!version) throw new Error("no-version");
    const longEdge = Math.round(ratio >= 1 ? 1080 * ratio : 1080 / ratio);
    return canvasToBlob(await renderCanvas({ after: version.image, before: version.before, layout, ratio, longEdge, credit }), "JPG", 0.9);
  };

  const record = (bytes: number, note?: string) =>
    version &&
    recordDelivery({
      fileId: target.fileId,
      projectId: target.projectId,
      versionId: version.id,
      resultId: version.resultId,
      type: "social",
      size: "HD",
      format: "JPG",
      filename,
      layout,
      social: format.id,
      watermarked: false,
      credits: 0,
      status: "delivered",
      bytes,
      completedAt: Date.now(),
      events: note ? [{ at: Date.now(), note }] : [],
    });

  const download = async (note?: string) => {
    setBusy(true);
    try {
      const blob = await make();
      record(blob.size, note);
      saveBlob(blob, filename);
      setResult("downloaded");
    } catch {
      setResult("render-failed");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    setBusy(true);
    setResult(null);
    try {
      const blob = await make();
      await navigator.share({ files: [new File([blob], filename, { type: "image/jpeg" })], text: caption });
      record(blob.size);
      setResult("shared");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setResult("failed");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    const ok = await copyText(caption);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
  };

  const hasSheet = canShareFiles(new File([""], "x.jpg", { type: "image/jpeg" }));

  return (
    <div className="space-y-6">
      <div>
        <p className={`mb-2 ${$.label}`}>Version</p>
        <VersionPicker versions={target.versions} selected={[versionId]} onToggle={onVersion} />
      </div>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-5">
          <div>
            <p className={`mb-2 ${$.label}`}>Where it is going</p>
            <div role="radiogroup" aria-label="Format" className="grid gap-1.5">
              {socialFormats.map((f) => {
                const on = f.id === formatId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFormatId(f.id)}
                    className={`flex min-h-10 items-center gap-3 rounded-xl border px-3 text-left transition-colors duration-200 ${on ? $.on : `${$.box} ${$.boxHover}`}`}
                  >
                    <span className={on ? "text-ember-soft" : "text-cream/55"}>
                      <RatioGlyph w={f.w} h={f.h} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-white">{f.where}</span>
                    <span className={`shrink-0 text-[11px] ${$.faint}`}>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className={`mb-2 ${$.label}`}>Layout</p>
            <ToneChips
              label="Layout"
              options={[
                { id: "before-after", label: "Before & after" },
                { id: "result", label: "Result" },
              ]}
              value={layout}
              onChange={setLayout}
            />
          </div>
        </div>
        <figure className="order-first sm:order-none">
          <div
            className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl bg-white/5 sm:max-w-none"
            style={{ aspectRatio: `${format.w} / ${format.h}`, maxHeight: "340px" }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={`Preview of the ${format.label} post`} className="size-full object-contain" />
            ) : (
              <div className="size-full motion-safe:animate-pulse" aria-label="Drawing the preview" />
            )}
          </div>
          <figcaption className={`mt-2 text-center text-[11px] ${$.faint}`}>{format.label} · as posted</figcaption>
        </figure>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <FieldLabel htmlFor={captionId}>Caption</FieldLabel>
          {ownCaption !== null && (
            <button type="button" onClick={() => setOwnCaption(null)} className="text-[11px] text-cream/50 hover:text-white">
              Use the suggestion
            </button>
          )}
        </div>
        <textarea
          id={captionId}
          value={caption}
          onChange={(e) => setOwnCaption(e.target.value.slice(0, MAX_CAPTION))}
          rows={4}
          className={`${$.input} resize-none`}
        />
        <div className="mt-2.5">
          <ToneToggle
            label="Add “Made with VastuNord”"
            hint="A small mark in the corner of the image."
            checked={credit}
            onChange={setCredit}
          />
        </div>
      </div>

      <p className={`text-[11.5px] leading-5 ${$.faint}`}>
        Posting a client’s home? Check they are happy for it to be public, and leave out house numbers and anything personal.
      </p>

      {result === "shared" ? (
        <Callout tone="success" title="Shared">
          Sent to the app you picked. It is listed in Shared, under Downloads.
        </Callout>
      ) : result === "downloaded" ? (
        <Callout tone="success" title="Image downloaded">
          {filename}. Copy the caption, then post it from the app.
        </Callout>
      ) : result === "failed" ? (
        <Callout
          tone="error"
          title="The share sheet did not open"
          action={
            <PillButton
              label="Download instead"
              icon={GDownload}
              size="sm"
              variant="ghost"
              onClick={() => void download("Share sheet failed — downloaded instead")}
            />
          }
        >
          Download the image and post it from the app. The caption is right here to copy.
        </Callout>
      ) : result === "render-failed" ? (
        <Callout tone="error" title="The image could not be made">
          Try another version, or the Result layout.
        </Callout>
      ) : null}

      <div className="space-y-2">
        {hasSheet && (
          <PillButton label={busy ? "Preparing…" : "Share…"} icon={GShareNetwork} onClick={() => void share()} disabled={busy || !version} className="w-full" />
        )}
        <div className="grid grid-cols-2 gap-2">
          <PillButton
            label="Download image"
            icon={GDownload}
            variant={hasSheet ? "ghost" : "primary"}
            onClick={() => void download()}
            disabled={busy || !version}
          />
          <PillButton label={copied ? "Copied" : "Copy caption"} icon={copied ? GCheckBold : GCopy} variant="ghost" onClick={() => void copy()} />
        </div>
        {!hasSheet && (
          <p className={clsx("text-center text-[11px]", $.faint)}>This device has no share sheet. Download the image and post it from the app.</p>
        )}
      </div>
    </div>
  );
}
