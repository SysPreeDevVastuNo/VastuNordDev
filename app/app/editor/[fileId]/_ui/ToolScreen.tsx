"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ACCEPTED_IMAGES,
  AssetGrid,
  Callout,
  CompareSlider,
  CreditsPill,
  Dropzone,
  FitImage,
  GenerateBar,
  IconButton,
  PanelSection,
  PillButton,
  PromptBox,
  RenderProgress,
  SavedState,
  StageDialog,
  StageTag,
  StepTracker,
  Thumb,
  type Asset,
  type Step,
} from "@/app/app/editor/[fileId]/_ui/controls";
import {
  GArrowLeft,
  GCaretDown,
  GDownload,
  GHeart,
  GHistory,
  GPencilSimple,
  GPlus,
  GRedo,
  GRows,
  GShareNetwork,
  GUndo,
  GX,
} from "@/app/app/editor/[fileId]/_ui/icons";
import ShareExport, { type DeliverTarget } from "@/app/app/editor/[fileId]/_ui/ShareExport";
import VersionHistory from "@/app/app/editor/[fileId]/_ui/VersionHistory";
import type { ToolScreenState, UploadError } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { MAX_PHOTOS } from "@/lib/mock/editorState";
import { mockImage } from "@/lib/mock/entities";

/** Wording that changes with what the photo is of. */
const places = {
  room: {
    photoTitle: "Photo of the room",
    dropHint: "A straight-on photo of the room works best",
    anglesHint: "Add other angles of the same room if you have them. ",
    alt: "Your photo of the room",
    refTitle: "Add a room you like",
    refBad: "Use a clear photo of a finished room, not a moodboard collage.",
    start: "Add a photo of the room to start",
  },
  photo: {
    photoTitle: "Your photo",
    dropHint: "Any photo of a space, inside or out",
    anglesHint: "Add other photos to work on them one at a time. ",
    alt: "Your photo",
    refTitle: "Add a reference",
    refBad: "Use a clear photo, not a collage.",
    start: "Add a photo to start",
  },
  outside: {
    photoTitle: "Photo of the outside",
    dropHint: "A wide photo in daylight works best",
    anglesHint: "Add other views of the same place if you have them. ",
    alt: "Your photo of the outside",
    refTitle: "Add a place you like",
    refBad: "Use a clear photo of a real place, not a moodboard collage.",
    start: "Add a photo of the outside to start",
  },
};
export type Place = keyof typeof places;

const uploadErrors: Record<UploadError, { title: string; body: string }> = {
  unsupported: { title: "That file type will not work", body: "Use a JPEG, PNG or WEBP photo. Screenshots of a photo work too." },
  oversize: { title: "That photo is over 20 MB", body: "Export a smaller copy from your phone or camera app and try again." },
  failed: { title: "The upload did not go through", body: "Nothing was lost. Try again, or pick a photo you have used before from your assets." },
};

/** Photos already in the account, offered by "browse your assets". */
export const photoAssets: Asset[] = [
  { id: "as-room-1", name: "Living room — north", image: mockImage("8572d4e8b15377bb1f8ca39ba3216e71cb5dc2e0-1535x1024.png") },
  { id: "as-room-2", name: "Empty apartment", image: mockImage("c4aca6e10e56217d9138293bc1025ea5517be2d3-1080x1440.jpg") },
  { id: "as-room-3", name: "Kitchen as built", image: mockImage("8b5b210e78e7bf8fc163b9b7864fb4841c73b8ef-542x369.jpg") },
  { id: "as-room-4", name: "Back garden", image: mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png") },
  { id: "as-room-5", name: "House front", image: mockImage("dbb051df03418dc7c1c1a9da96fadf04cec3b723-1472x1462.png") },
];

export type Marking = {
  /** One line at the top of the stage: what to tap or draw. */
  banner: string;
  /** The interactive layer drawn over the photo. */
  layer: React.ReactNode;
  canClear: boolean;
  onClear: () => void;
  onDone: () => void;
};

export type ToolScreenProps = {
  screen: ToolScreenState;
  toolName: string;
  intro: {
    eyebrow: string;
    bullets: string[];
    before?: string;
    after?: string;
    afterLabel?: string;
    /** Replaces the before/after slider (tools that show something else first). */
    demo?: React.ReactNode;
  };
  steps: { label: string; short?: string }[];
  /** Step 2 is done: the user said or chose something. */
  described: boolean;
  canGenerate: boolean;
  /** One line describing the run, for history. */
  summary: () => string;
  generateLabel: { first: string; again: string };
  phases: string[];
  photoInfo?: string;
  referenceInfo?: string;
  prompt: { title: string; info?: string; label: string; placeholder: string; improve?: (text: string) => string };
  marking?: Marking | null;
  /** Shown over the photo when not marking (pins, strokes…). */
  sourceOverlay?: React.ReactNode;
  /** CSS applied to the photo on the stage (a live preview of a slider). */
  sourceStyle?: React.CSSProperties;
  degraded?: boolean;
  /** Overrides Generate (tools that run several jobs). */
  onGenerate?: () => void;
  /** Hint under Generate when it is disabled with a photo in. */
  blockedHint?: string;
  /** Badge drawn on a photo thumbnail (e.g. its resolution). */
  stripBadge?: (src: string) => React.ReactNode;
  place?: Place;
  /** Hide the "Describe" section (tools with no prompt). */
  noPrompt?: boolean;
  children?: React.ReactNode;
};

// The editor shell every tool renders into (the prototype's ToolScreen): the
// header, the stage (intro, photo, marking, progress), the settings panel with
// photo, reference and prompt sections followed by the tool's own sections,
// and the Generate bar.
export default function ToolScreen({
  screen,
  toolName,
  intro,
  steps,
  described,
  canGenerate,
  summary,
  generateLabel,
  phases,
  photoInfo,
  referenceInfo,
  prompt,
  marking,
  sourceOverlay,
  sourceStyle,
  onGenerate,
  blockedHint,
  stripBadge,
  place = "room",
  noPrompt,
  children,
}: ToolScreenProps) {
  const router = useRouter();
  const { s, attachPrompt, attachStage, compareWith, deliverTab, deliverVersion, dialog, generate, openDelivery, setDeliverTab, setDeliverVersion, photoError, photos, referenceError, removePhoto, selectPhoto, setCompareWith, setDialog, setPhotoError, setReferenceError, setView, showStage, focusPrompt, uploadPhotos, uploadReference, uploading, view } = screen;
  const { working, def } = s;
  const copy = places[place];
  const [improving, setImproving] = useState(false);
  const [avoidOpen, setAvoidOpen] = useState(false);
  const promptText = String(working.params.prompt ?? "");
  const negative = String(working.params.negative ?? "");
  const hasPhoto = !!working.sourceImage;

  const doGenerate = () => {
    if (!canGenerate || s.processing) return;
    if (onGenerate) return onGenerate();
    generate(summary());
  };
  const generateRef = useRef(doGenerate);
  const markingRef = useRef(marking);
  useEffect(() => {
    generateRef.current = doGenerate;
    markingRef.current = marking;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        generateRef.current();
      }
      if (e.key === "Escape") markingRef.current?.onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!s.file || !s.tool || s.file.status === "deleted") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-stage px-6 text-center">
        <h1 className="font-display text-[clamp(1.35rem,5vw,1.9rem)] leading-tight font-semibold text-white">This file is gone.</h1>
        <p className="mt-3 max-w-sm text-[14px] leading-7 text-cream/60">
          It may have been deleted permanently, or the link may be out of date. Everything else is where you left it.
        </p>
        <Link
          href="/app/files"
          className="mt-8 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/18 px-5 font-display text-[13px] font-medium text-white transition-colors duration-200 hover:border-white/40"
        >
          <GArrowLeft size={13} />
          Back to files
        </Link>
      </div>
    );
  }

  const versions = s.versions;
  const hasResult = !!s.shownResult;
  const tracked: Step[] = [
    { ...steps[0], state: hasPhoto ? "done" : "current" },
    { ...steps[1], state: hasPhoto ? (described || versions.length ? "done" : "current") : "todo" },
    { ...steps[2], state: versions.length ? "done" : hasPhoto && described ? "current" : "todo" },
  ];
  const label = (id: string) => `Version ${versions.find((v) => v.id === id)?.number ?? ""}`;
  const imageOf = (id: string) =>
    id === "source" ? working.sourceImage : (s.resultById(versions.find((v) => v.id === id)?.resultId ?? "")?.image ?? "");
  // Comparing a version with itself falls back to the original photo.
  const against = compareWith === s.shownVersion?.id ? "source" : compareWith;
  const viewingOld = !!(s.previewId && s.shownVersion && s.shownVersion.id !== s.current?.id);
  const showLatest = view === "latest" || (view === "compare" && !hasResult);

  const exit = () => (window.history.length > 1 ? router.back() : router.push("/app/files"));

  // What Share & export works on: this file's versions, newest first, each with the photo it was made from.
  const deliverTarget: DeliverTarget = {
    fileId: s.file.id,
    fileName: s.file.name,
    projectId: s.file.projectId,
    category: s.tool.category,
    versions: [...versions].reverse().map((v) => ({
      id: v.id,
      number: v.number,
      resultId: v.resultId,
      image: s.resultById(v.resultId)?.image ?? "",
      before: working.sourceImage || s.file?.sourceImage || "",
    })),
  };

  const floatButtons =
    !marking && !s.processing && s.shownResult ? (
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1.5 sm:top-3 sm:right-3">
        <IconButton
          tone="float"
          label={s.shownResult.favourite ? "Remove from favourites" : "Favourite"}
          icon={GHeart}
          active={s.shownResult.favourite}
          onClick={() => s.shownResult && s.favourite(s.shownResult.id)}
        />
        <IconButton
          tone="float"
          label={view === "compare" ? "Stop comparing" : "Compare before and after"}
          icon={GRows}
          active={view === "compare"}
          onClick={() => {
            setCompareWith("source");
            setView(view === "compare" ? "latest" : "compare");
          }}
        />
        <IconButton tone="float" label="Modify and regenerate" icon={GPencilSimple} onClick={focusPrompt} />
        <IconButton tone="float" label="Download or share" icon={GDownload} onClick={() => openDelivery()} />
      </div>
    ) : null;

  const oldVersionBar = viewingOld ? (
    <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3">
      <div className="flex items-center gap-1 rounded-full bg-black/70 p-1 pl-3.5 backdrop-blur-md">
        <span className="hidden text-[11.5px] text-cream/80 sm:inline">Not the current version</span>
        <button type="button" onClick={() => s.setPreviewId(null)} className="min-h-8 rounded-full px-3 text-[11.5px] text-white hover:bg-white/10">
          Back to latest
        </button>
        <button
          type="button"
          onClick={() => s.shownVersion && s.restore(s.shownVersion.id)}
          className="min-h-8 rounded-full bg-white px-3 text-[11.5px] font-semibold text-navy hover:bg-cream"
        >
          Make current
        </button>
      </div>
    </div>
  ) : null;

  let stage: React.ReactNode = null;
  if (s.processing && hasPhoto) {
    stage = (
      <FitImage src={working.sourceImage} alt="Your photo, being worked on">
        <RenderProgress progress={s.processing.progress} phases={phases} onCancel={s.cancelGenerate} />
      </FitImage>
    );
  } else if (marking && hasPhoto) {
    stage = (
      <FitImage src={working.sourceImage} alt={copy.alt}>
        {marking.layer}
      </FitImage>
    );
  } else if (view === "compare" && s.shownResult && imageOf(against)) {
    stage = (
      <CompareSlider
        key={`${against}-${s.shownVersion?.id}`}
        before={imageOf(against)}
        after={s.shownResult.image}
        beforeLabel={against === "source" ? "Original" : label(against)}
        afterLabel={label(s.shownVersion?.id ?? "")}
      >
        {floatButtons}
      </CompareSlider>
    );
  } else if (s.shownResult && view !== "source") {
    stage = (
      <FitImage src={s.shownResult.image} alt={`${label(s.shownVersion?.id ?? "")}, the result`}>
        <StageTag className="top-3 left-3">
          {viewingOld ? `Viewing ${label(s.shownVersion?.id ?? "").toLowerCase()}` : label(s.shownVersion?.id ?? "")}
        </StageTag>
        {floatButtons}
        {oldVersionBar}
      </FitImage>
    );
  } else if (hasPhoto) {
    stage = (
      <FitImage src={working.sourceImage} alt={copy.alt} imgStyle={sourceStyle}>
        <StageTag className="top-3 left-3">{hasResult ? "Original" : "Your photo"}</StageTag>
        {sourceOverlay}
      </FitImage>
    );
  }

  const improve = prompt.improve;

  return (
    <div className="app-shell flex min-h-svh flex-col bg-stage text-white [color-scheme:dark] lg:h-svh lg:overflow-hidden">
      <header className="sticky top-0 z-30 flex shrink-0 items-center gap-1 border-b border-white/8 bg-stage/95 px-2 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:static lg:border-0 lg:bg-stage lg:px-4">
        <IconButton label="Back" icon={GArrowLeft} onClick={exit} />
        <div className="min-w-0 flex-1 px-1.5 py-2">
          <p className="truncate font-display text-[14px] font-medium text-white">{s.file.name}</p>
          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <span className="truncate text-[11px] text-cream/45">
              {toolName}
              {s.current ? ` · v${s.current.number}` : ""}
            </span>
            <SavedState label="Saved just now" />
          </div>
        </div>
        <IconButton label="Undo" icon={GUndo} onClick={s.undo} disabled={!s.canUndo} />
        <IconButton label="Redo" icon={GRedo} onClick={s.redo} disabled={!s.canRedo} />
        <span className="relative">
          <IconButton label="Version history" icon={GHistory} onClick={() => setDialog("history")} />
          {versions.length > 0 && (
            <span className="pointer-events-none absolute top-1 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-ember px-1 font-display text-[9px] font-semibold text-white">
              {versions.length}
            </span>
          )}
        </span>
        {versions.length > 0 && (
          <>
            <span className="sm:hidden">
              <IconButton label="Share or export" icon={GShareNetwork} onClick={() => openDelivery()} />
            </span>
            <button
              type="button"
              onClick={() => openDelivery()}
              className="ml-1 hidden min-h-9 items-center gap-1.5 rounded-full border border-white/18 px-3.5 font-display text-[12px] font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/6 sm:inline-flex"
            >
              <GShareNetwork size={14} />
              Share
            </button>
          </>
        )}
        <span className="ml-1 hidden sm:block">
          <CreditsPill credits={s.credits} />
        </span>
      </header>

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row lg:gap-3 lg:px-3 lg:pb-3">
        <section
          ref={attachStage}
          aria-label="Stage"
          className="flex scroll-mt-14 flex-col border-b border-white/8 lg:order-2 lg:min-h-0 lg:flex-1 lg:rounded-card lg:border lg:bg-stage-raised/50"
        >
          {!hasPhoto && !versions.length ? (
            <div className="flex flex-col gap-5 px-5 pt-6 pb-5 lg:min-h-0 lg:flex-1 lg:px-8 lg:pt-8">
              <div>
                <p className="eyebrow text-ember-soft">{intro.eyebrow}</p>
                <h1 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2.2rem)] leading-[1.08] font-semibold text-white">{toolName}</h1>
                <ul className="mt-3.5 max-w-xl list-disc space-y-1 pl-5 text-[13.5px] leading-6 text-cream/70 marker:text-cream/35">
                  {intro.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-4 flex items-center gap-1.5 font-display text-[13px] font-medium text-white">
                  <span className="hidden lg:inline">← Start from the panel on the left</span>
                  <span className="lg:hidden">Start below ↓</span>
                </p>
              </div>
              <div className="aspect-[4/3] min-h-0 lg:aspect-auto lg:flex-1">
                {intro.demo ??
                  (intro.before && intro.after ? (
                    <CompareSlider before={intro.before} after={intro.after} beforeLabel="Today" afterLabel={intro.afterLabel ?? "After"} start={46} />
                  ) : null)}
              </div>
            </div>
          ) : (
            <>
              <div className="relative aspect-[4/3.25] max-h-[72svh] w-full p-3 lg:aspect-auto lg:max-h-none lg:min-h-0 lg:flex-1 lg:p-5">
                {stage}
                {marking && !s.processing && (
                  <div className="absolute inset-x-3 top-3 z-10 flex items-center gap-2 rounded-xl bg-black/70 px-3 py-2 backdrop-blur-md lg:inset-x-5 lg:top-5">
                    <p className="min-w-0 flex-1 text-[12px] text-white/90">{marking.banner}</p>
                    {marking.canClear && (
                      <button
                        type="button"
                        onClick={marking.onClear}
                        className="flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[11.5px] text-cream/80 hover:text-white"
                      >
                        <GX size={12} />
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={marking.onDone}
                      className="min-h-8 rounded-full bg-white px-3 text-[11.5px] font-semibold text-navy transition-colors duration-200 hover:bg-cream"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-3 pb-3 lg:px-5">
                {hasPhoto && (
                  <div className="w-14 shrink-0">
                    <Thumb
                      src={working.sourceImage}
                      label="Show the original photo"
                      badge="Original"
                      active={view === "source" || (!hasResult && !s.processing)}
                      onClick={() => {
                        marking?.onDone();
                        setView("source");
                      }}
                    />
                  </div>
                )}
                {versions.length > 0 && <span aria-hidden className="h-8 w-px shrink-0 bg-white/12" />}
                {versions.map((v) => {
                  const r = s.resultById(v.resultId);
                  return (
                    <div key={v.id} className="relative w-14 shrink-0">
                      <Thumb
                        src={r?.image ?? ""}
                        label={`Show version ${v.number}`}
                        badge={`v${v.number}`}
                        active={showLatest && v.id === s.shownVersion?.id}
                        onClick={() => {
                          marking?.onDone();
                          setView("latest");
                          s.setPreviewId(v.id === s.current?.id ? null : v.id);
                        }}
                      />
                      {r?.favourite && <GHeart size={11} fill className="pointer-events-none absolute top-1 right-1 text-ember-soft" />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <div className="hidden border-t border-white/6 py-3.5 pr-40 pl-6 lg:block">
            <StepTracker steps={tracked} />
          </div>
        </section>

        <aside
          aria-label={`${toolName} settings`}
          className="flex flex-col lg:order-1 lg:w-[384px] lg:shrink-0 lg:overflow-hidden lg:rounded-card lg:border lg:border-white/8 lg:bg-stage-raised"
        >
          <div className="no-scrollbar flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
            <div className="px-5 pt-4 lg:hidden">
              <StepTracker steps={tracked} />
            </div>

            {s.notConnected && (
              <div className="px-5 pt-5">
                <Callout tone="warn" title="Rendering is not connected yet" onDismiss={s.dismissNotConnected}>
                  Your photo and settings are saved. Results will appear here once the AI providers are connected.
                </Callout>
              </div>
            )}

            <PanelSection
              title={copy.photoTitle}
              info={photoInfo}
              meta={photos.length > 1 ? `${photos.length} photos` : undefined}
            >
              {photoError && (
                <div className="mb-3">
                  <Callout tone="error" title={uploadErrors[photoError].title} onDismiss={() => setPhotoError(null)}>
                    {uploadErrors[photoError].body}
                  </Callout>
                </div>
              )}
              {photos.length === 0 ? (
                <Dropzone
                  onFiles={uploadPhotos}
                  onBrowseAssets={() => setDialog("assets-source")}
                  busy={uploading === "source"}
                  hint={copy.dropHint}
                />
              ) : (
                <div>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((src, i) => (
                      <div key={src.slice(-24) + i} className="group relative">
                        <Thumb
                          src={src}
                          label={src === working.sourceImage ? `Photo ${i + 1}, in use` : `Use photo ${i + 1}`}
                          active={src === working.sourceImage}
                          badge={src === working.sourceImage ? "In use" : undefined}
                          onClick={() => selectPhoto(src)}
                        />
                        {stripBadge?.(src)}
                        <button
                          type="button"
                          onClick={() => removePhoto(src)}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full border border-white/15 bg-stage-raised text-cream/70 transition-opacity duration-200 hover:text-white lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
                        >
                          <GX size={11} />
                        </button>
                      </div>
                    ))}
                    {photos.length < MAX_PHOTOS && <AddPhotoTile onFiles={uploadPhotos} busy={uploading === "source"} />}
                  </div>
                  <p className="mt-2.5 text-[11.5px] leading-5 text-cream/45">
                    {photos.length > 1 ? "Tap a photo to work from it. " : copy.anglesHint}
                    <button
                      type="button"
                      onClick={() => setDialog("assets-source")}
                      className="text-ember-soft underline-offset-2 hover:underline"
                    >
                      Browse your assets
                    </button>
                  </p>
                </div>
              )}
            </PanelSection>

            {def.supportsReferenceImage && (
              <PanelSection title="Style reference" optional info={referenceInfo}>
                {referenceError && (
                  <div className="mb-3">
                    <Callout
                      tone="error"
                      title={referenceError === "unusable" ? "That image will not work as a reference" : "The reference did not upload"}
                      onDismiss={() => setReferenceError(null)}
                    >
                      {referenceError === "unusable" ? copy.refBad : "Generating without one is fine. It is optional."}
                    </Callout>
                  </div>
                )}
                {working.referenceImage ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={working.referenceImage} alt="Your style reference" className="size-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[12.5px] font-medium text-white">Reference set</p>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-cream/50">It shapes the next run.</p>
                    </div>
                    <PillButton label="Remove" size="sm" variant="ghost" onClick={() => s.setReference("")} />
                  </div>
                ) : (
                  <Dropzone
                    compact
                    multiple={false}
                    title={copy.refTitle}
                    hint="Drop a photo, or click to choose one"
                    onFiles={uploadReference}
                    onBrowseAssets={() => setDialog("assets-reference")}
                    busy={uploading === "reference"}
                  />
                )}
              </PanelSection>
            )}

            {!noPrompt && (
              <PanelSection id="tool-prompt" title={prompt.title} info={prompt.info}>
                <PromptBox
                  label={prompt.label}
                  inputRef={attachPrompt}
                  value={promptText}
                  onChange={(v) => s.setParam("prompt", v, true)}
                  placeholder={prompt.placeholder}
                  onImprove={
                    improve
                      ? () => {
                          setImproving(true);
                          s.run(() => {
                            setImproving(false);
                            s.setParam("prompt", improve(promptText));
                          }, 0.6);
                        }
                      : undefined
                  }
                  improving={improving}
                />
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => setAvoidOpen((o) => !o)}
                    aria-expanded={avoidOpen}
                    className="flex min-h-9 items-center gap-1.5 text-[12px] text-cream/60 transition-colors duration-200 hover:text-white"
                  >
                    <GCaretDown size={12} className={`transition-transform duration-200 ${avoidOpen ? "rotate-180" : ""}`} />
                    Anything to avoid?
                    {negative.trim() && !avoidOpen && <span className="size-1.5 rounded-full bg-ember" />}
                  </button>
                  {avoidOpen && (
                    <div className="mt-1.5">
                      <PromptBox
                        label="Anything to avoid"
                        rows={2}
                        max={400}
                        value={negative}
                        onChange={(v) => s.setParam("negative", v, true)}
                        placeholder="Clutter, harsh lighting, busy patterns…"
                      />
                    </div>
                  )}
                </div>
              </PanelSection>
            )}

            {children}
          </div>

          <StageDialog
            open={dialog === "history"}
            onClose={() => setDialog(null)}
            title="Version history"
            subtitle={`${versions.length} versions · ${s.generations.length} runs`}
            placement="drawer"
          >
            <VersionHistory
              s={s}
              shownId={showLatest ? s.shownVersion?.id : undefined}
              onView={(id) => {
                marking?.onDone();
                setView("latest");
                s.setPreviewId(id === s.current?.id ? null : id);
                setDialog(null);
                showStage();
              }}
              onCompare={(id) => {
                marking?.onDone();
                setCompareWith(id === s.shownVersion?.id ? "source" : id);
                setView("compare");
                setDialog(null);
                showStage();
              }}
              onRestore={(id) => {
                if (s.restore(id)) {
                  setView("latest");
                  setDialog(null);
                }
              }}
              onShare={(id) => openDelivery("download", id)}
            />
          </StageDialog>

          <ShareExport
            open={dialog === "deliver"}
            onClose={() => setDialog(null)}
            tab={deliverTab}
            onTab={setDeliverTab}
            versionId={deliverVersion || s.current?.id || ""}
            onVersion={setDeliverVersion}
            target={deliverTarget}
            onMoreVariations={() => {
              setDialog(null);
              setView("latest");
              focusPrompt();
            }}
          />

          <StageDialog
            open={dialog === "assets-source" || dialog === "assets-reference"}
            onClose={() => setDialog(null)}
            title={dialog === "assets-reference" ? "Choose a reference" : "Choose from your assets"}
            subtitle="Photos already in your account"
          >
            <AssetGrid
              assets={photoAssets}
              selected={dialog === "assets-reference" ? working.referenceImage : working.sourceImage}
              onPick={(a) => {
                if (dialog === "assets-reference") s.setReference(a.image);
                else {
                  setPhotoError(null);
                  selectPhoto(a.image);
                }
                setDialog(null);
              }}
            />
          </StageDialog>

          <div className="sticky bottom-0 z-20 lg:static">
            <GenerateBar
              label={hasResult ? generateLabel.again : generateLabel.first}
              onGenerate={doGenerate}
              disabled={!canGenerate}
              busy={!!s.processing}
              credits={s.credits}
              estimate="20–30 s"
              hint={hasPhoto ? (canGenerate ? undefined : (blockedHint ?? "Describe the change to enable Generate")) : copy.start}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/** The "+ Add" tile after the photo thumbnails. */
function AddPhotoTile({ onFiles, busy }: { onFiles: (f: File[]) => void; busy?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        aria-label="Add another photo"
        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 text-cream/55 transition-colors duration-200 hover:border-white/45 hover:text-white"
      >
        {busy ? (
          <span className="size-4 rounded-full border-2 border-white/20 border-t-ember motion-safe:animate-spin" />
        ) : (
          <GPlus size={16} />
        )}
        <span className="font-display text-[9px] font-semibold tracking-[0.12em] uppercase">{busy ? "Adding" : "Add"}</span>
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_IMAGES}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </>
  );
}
