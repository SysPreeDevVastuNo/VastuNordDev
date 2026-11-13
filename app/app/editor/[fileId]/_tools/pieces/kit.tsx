"use client";

// Pieces kit: numbered pins on the photo, each with a row in the panel (the
// prototype's Pieces module). Used by Furniture, Decor, Material, Lighting,
// Object Placement and Visual Cleanup. How to use it in a tool:
//   const kit = usePieces(s, { key: "pieces", read, defaultAction: "replace", addAction: "add",
//                              addLabel: "New piece", readable: true, unclearLabel: "Unclear piece" });
//   useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
//   pins = kit.pieces.map((p, i) => ({ id, at, n: i + 1, tone, label }));
//   <ToolScreen marking={kit.marking(pins, { change, add, placing: (a) => … })}
//               sourceOverlay={<PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} />} />
//   <PickCard kit … onEnter={showSource} />  <AddCard kit … />  rows: <PieceRow … /> per piece
//   <AssetDialog kit={kit} type="furniture" noun="furniture" onPlace={showSource} /> next to ToolScreen.
// Pieces are stored as JSON in params[key], so they undo and save with the file.

import { useMemo, useState } from "react";
import Image from "next/image";
import { AssetGrid, Callout, OptionCard, PinLayer, StageDialog, type Asset, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { GPlus, GX, glyph, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import type { ToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import type { Marking } from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { assetById, assetsOf, type AssetType } from "@/app/app/editor/[fileId]/_tools/pieces/assets";

export { assetById, assetsOf, pieceAssets, type AssetType, type PieceAsset } from "@/app/app/editor/[fileId]/_tools/pieces/assets";

export const GTrash = glyph(
  "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z",
  "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
);

export type Point = { x: number; y: number };
export type Piece = {
  id: string;
  at: Point;
  /** What to do with it: the tool's own values ("replace", "remove", "add"…). */
  action: string;
  label: string;
  note: string;
  /** A library asset (see assets.ts). */
  assetId?: string;
  /** An asset image that is not in the library. */
  image?: string;
};
export type Tone = Pin["tone"];
export type PiecesOptions = {
  /** The param the pieces are stored under. */
  key: string;
  /** Names what sits at a point on the photo ("Sofa", "Wall art"…). */
  read: (at: Point) => string;
  defaultAction: string;
  addAction: string;
  addLabel: string;
  /** False when the photo could not be read: picked pieces get `unclearLabel`. */
  readable: boolean;
  unclearLabel: string;
};

const parse = (v: unknown): Piece[] => {
  if (typeof v !== "string" || !v) return [];
  try {
    const list = JSON.parse(v);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};
const newId = () => `pc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Cuts a label to `max` characters with an ellipsis (pin labels). */
export const short = (text: string, max = 22) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

const scrollToRow = (id: string) =>
  window.setTimeout(() => {
    document.querySelector(`[data-piece="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, 60);

export function usePieces(s: ToolFile, opts: PiecesOptions) {
  const { key } = opts;
  const [mode, setMode] = useState<"add" | "change" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** An asset waiting to be tapped onto the photo. */
  const [placing, setPlacing] = useState<Asset | null>(null);
  /** The piece the asset dialog is choosing for, or "new" to place a new one. */
  const [assetFor, setAssetFor] = useState<string | null>(null);
  const pieces = useMemo(() => parse(s.working.params[key]), [s.working.params, key]);

  const write = (fn: (list: Piece[]) => Piece[], typingKey?: string) =>
    s.commit((w) => ({ ...w, params: { ...w.params, [key]: JSON.stringify(fn(parse(w.params[key]))) } }), typingKey);

  const update = (id: string, patch: Partial<Piece>) =>
    write((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)), `piece:${id}`);
  const remove = (id: string) => {
    write((list) => list.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const clear = () => {
    write(() => []);
    setSelectedId(null);
  };
  const select = (id: string) => {
    setSelectedId(id);
    scrollToRow(id);
  };
  const placeAt = (at: Point) => {
    if (!mode) return;
    const piece: Piece =
      mode === "add"
        ? {
            id: newId(),
            at,
            action: opts.addAction,
            label: placing?.name ?? opts.addLabel,
            note: "",
            assetId: placing && assetById(placing.id) ? placing.id : undefined,
            image: placing && !assetById(placing.id) ? placing.image : undefined,
          }
        : { id: newId(), at, action: opts.defaultAction, label: opts.readable ? opts.read(at) : opts.unclearLabel, note: "" };
    write((list) => [...list, piece]);
    select(piece.id);
    if (placing) {
      setPlacing(null);
      setMode(null);
    }
  };
  const enterMode = (m: "add" | "change", onEnter: () => void) => {
    if (mode === m && !placing) return setMode(null);
    setPlacing(null);
    setMode(m);
    onEnter();
  };
  const exit = () => {
    setMode(null);
    setPlacing(null);
  };
  const reset = () => {
    exit();
    setSelectedId(null);
    if (parse(s.working.params[key]).length) s.setParam(key, "[]");
  };

  /** The stage's marking state while picking or placing, else null. */
  const marking = (pins: Pin[], copy: { change: string; add: string; placing: (a: Asset) => string }): Marking | null =>
    mode && s.working.sourceImage
      ? {
          banner: placing ? copy.placing(placing) : mode === "add" ? copy.add : copy.change,
          layer: <PinLayer pins={pins} selectedId={selectedId} interactive onTap={placeAt} onSelect={select} />,
          canClear: pieces.length > 0 && !placing,
          onClear: clear,
          onDone: exit,
        }
      : null;

  return {
    pieces,
    mode,
    setMode,
    selectedId,
    setSelectedId,
    placing,
    setPlacing,
    assetFor,
    setAssetFor,
    update,
    remove,
    clear,
    placeAt,
    enterMode,
    exit,
    reset,
    marking,
  };
}

export type PiecesKit = ReturnType<typeof usePieces>;

const toneBadge: Record<Tone, string> = {
  add: "bg-white text-navy",
  remove: "border-2 border-ember text-ember-soft",
  change: "bg-ember text-white",
};

/** A library photo through next/image, anything else (uploads) as a plain img. */
function AssetThumb({ src }: { src: string }) {
  if (src.startsWith("https://cdn.sanity.io/"))
    return (
      <span className="relative size-9 shrink-0 overflow-hidden rounded-md">
        <Image src={src} alt="" fill sizes="36px" className="object-cover" />
      </span>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="size-9 rounded-md object-cover" />;
}

/** One piece in the panel: its number, name, action switch, forget button, and details. */
export function PieceRow({
  n,
  piece,
  tone,
  actions,
  selected,
  title,
  placeholder,
  removeCopy,
  onSelect,
  onChange,
  onRemove,
  onPickAsset,
  children,
}: {
  n: number;
  piece: Piece;
  tone: Tone;
  actions: { value: string; label: string }[];
  selected: boolean;
  title: string;
  placeholder: string;
  /** Shown instead of the details when the piece is being removed. */
  removeCopy?: string;
  onSelect: () => void;
  onChange: (patch: Partial<Piece>) => void;
  onRemove: () => void;
  onPickAsset?: () => void;
  /** Replaces the default details (note field and asset link). */
  children?: React.ReactNode;
}) {
  const asset = assetById(piece.assetId) ?? (piece.image ? { name: piece.label, image: piece.image } : undefined);
  const name = piece.label.toLowerCase();
  return (
    <div
      data-piece={piece.id}
      onFocusCapture={onSelect}
      className={`rounded-xl border p-3 transition-colors duration-200 ${selected ? "border-white/30 bg-white/7" : "border-white/8 bg-white/3"}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex size-6 shrink-0 items-center justify-center rounded-full font-display text-[10.5px] font-semibold ${toneBadge[tone]}`}>
          {n}
        </span>
        <p className="min-w-0 flex-1 truncate font-display text-[12.5px] font-medium text-white">{title}</p>
        {actions.length > 0 && (
          <div role="radiogroup" aria-label={`What to do with the ${name}`} className="flex rounded-full bg-black/30 p-0.5">
            {actions.map((a) => (
              <button
                key={a.value}
                type="button"
                role="radio"
                aria-checked={piece.action === a.value}
                onClick={() => onChange({ action: a.value })}
                className={`min-h-7 rounded-full px-2.5 text-[11px] transition-colors duration-200 ${piece.action === a.value ? "bg-white/14 text-white" : "text-cream/55 hover:text-white"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Forget ${n}, ${name}`}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-cream/45 transition-colors duration-200 hover:bg-white/8 hover:text-white"
        >
          <GTrash size={13} />
        </button>
      </div>
      {tone === "remove" && removeCopy ? (
        <p className="mt-2 pl-8.5 text-[11.5px] leading-5 text-cream/50">{removeCopy}</p>
      ) : children ? (
        <div className="mt-2.5 pl-8.5">{children}</div>
      ) : (
        <div className="mt-2.5 space-y-2 pl-8.5">
          {asset && (
            <div className="flex items-center gap-2 rounded-lg bg-black/25 p-1.5">
              <AssetThumb src={asset.image} />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-white">{asset.name}</span>
              <button
                type="button"
                onClick={() => onChange({ assetId: undefined, image: undefined })}
                aria-label={`Stop using ${asset.name}`}
                className="flex size-7 items-center justify-center rounded-full text-cream/55 hover:text-white"
              >
                <GX size={12} />
              </button>
            </div>
          )}
          <input
            type="text"
            value={piece.note}
            maxLength={160}
            onChange={(e) => onChange({ note: e.target.value })}
            aria-label={`Details for ${n}, ${name}`}
            placeholder={asset ? "How it should sit: angled to the window…" : placeholder}
            autoComplete="off"
            className="block min-h-9 w-full rounded-lg border border-white/12 bg-black/25 px-3 text-[12px] text-white placeholder:text-cream/30 focus:border-white/35 focus:outline-none"
          />
          {!asset && onPickAsset && (
            <button
              type="button"
              onClick={onPickAsset}
              className="inline-flex min-h-7 items-center gap-1 text-[11.5px] text-ember-soft underline-offset-2 hover:underline"
            >
              <GPlus size={11} />
              Use one from your assets
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** "Add from your assets" / "Replace with an asset": render it next to ToolScreen. */
export function AssetDialog({
  kit,
  type,
  noun,
  state = "ok",
  onPlace,
}: {
  kit: PiecesKit;
  type: AssetType;
  noun: string;
  /** The library's load state (the prototype's scenarios); "ok" in normal use. */
  state?: "ok" | "empty" | "failed";
  onPlace: () => void;
}) {
  const { assetFor, pieces, setAssetFor, setPlacing, setMode, update } = kit;
  const target = assetFor && assetFor !== "new" ? pieces.find((p) => p.id === assetFor) : undefined;
  return (
    <StageDialog
      open={assetFor !== null}
      onClose={() => setAssetFor(null)}
      title={assetFor === "new" ? "Add from your assets" : "Replace with an asset"}
      subtitle={`${noun.charAt(0).toUpperCase()}${noun.slice(1)} you have uploaded before`}
    >
      {state === "failed" ? (
        <Callout tone="error" title="Your assets did not load">
          Upload from your device instead, or close this and try again in a moment.
        </Callout>
      ) : (
        <AssetGrid
          assets={state === "empty" ? [] : assetsOf(type)}
          selected={assetById(target?.assetId)?.image}
          onPick={(a) => {
            if (assetFor === "new") {
              setPlacing(a);
              setMode("add");
              onPlace();
            } else if (assetFor) update(assetFor, { assetId: a.id });
            setAssetFor(null);
          }}
        />
      )}
    </StageDialog>
  );
}

/** The card's Pick/Place button: ember while its mode is on. */
function ModeButton({ on, idle, busy, onClick, disabled }: { on: boolean; idle: string; busy: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-9 shrink-0 items-center rounded-full px-3.5 font-display text-[12px] font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${on ? "bg-ember text-white hover:bg-ember-soft" : "border border-white/18 text-white hover:border-white/40 hover:bg-white/6"}`}
    >
      {on ? busy : idle}
    </button>
  );
}

const linkClass = "text-ember-soft underline-offset-2 hover:underline";

/** "Change pieces on the photo": turns on picking existing things. */
export function PickCard({
  kit,
  icon,
  title,
  hint,
  centre,
  disabled,
  onEnter,
}: {
  kit: PiecesKit;
  icon: Glyph;
  title: string;
  hint: string;
  /** Link text for picking the thing in the middle of the photo. */
  centre: string;
  disabled?: boolean;
  onEnter: () => void;
}) {
  const { mode, enterMode, placeAt } = kit;
  const on = mode === "change";
  return (
    <OptionCard
      icon={icon}
      title={title}
      hint={hint}
      active={on}
      action={<ModeButton on={on} idle="Pick" busy="Picking" disabled={disabled} onClick={() => enterMode("change", onEnter)} />}
    >
      {on && (
        <div className="text-[11.5px] leading-5 text-cream/55">
          Tap each one on the photo, or{" "}
          <button type="button" onClick={() => placeAt({ x: 50, y: 55 })} className={linkClass}>
            {centre}
          </button>
          .
        </div>
      )}
    </OptionCard>
  );
}

/** "Add a piece": turns on placing new things, or opens the asset dialog. */
export function AddCard({
  kit,
  icon,
  title,
  hint,
  assetsLink,
  disabled,
  onEnter,
}: {
  kit: PiecesKit;
  icon: Glyph;
  title: string;
  hint: string;
  /** Link text for adding from assets; omit to hide it. */
  assetsLink?: string;
  disabled?: boolean;
  onEnter: () => void;
}) {
  const { mode, placing, enterMode, placeAt, setAssetFor } = kit;
  const on = mode === "add";
  const body = placing ? (
    <>
      Tap the photo where the <span className="text-white">{placing.name.toLowerCase()}</span> should go.
    </>
  ) : on ? (
    <>
      Tap an empty spot, or{" "}
      <button type="button" onClick={() => placeAt({ x: 50, y: 62 })} className={linkClass}>
        add one in the centre
      </button>
      .
    </>
  ) : assetsLink ? (
    <button
      type="button"
      onClick={() => setAssetFor("new")}
      disabled={disabled}
      className={`inline-flex min-h-8 items-center gap-1 disabled:opacity-40 ${linkClass}`}
    >
      <GPlus size={12} />
      {assetsLink}
    </button>
  ) : null;
  return (
    <OptionCard
      icon={icon}
      title={title}
      hint={hint}
      active={on}
      action={<ModeButton on={on} idle="Place" busy="Placing" disabled={disabled} onClick={() => enterMode("add", onEnter)} />}
    >
      {body && <div className="text-[11.5px] leading-5 text-cream/55">{body}</div>}
    </OptionCard>
  );
}
