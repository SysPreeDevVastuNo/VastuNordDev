"use client";

import { GEye, GHeart, GHistory, GRows, GShareNetwork, GUndo, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import type { ToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { timeAgo } from "@/lib/mock/entities";

function SmallAction({ icon: Icon, label, onClick, disabled }: { icon: Glyph; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] text-cream/70 transition-colors duration-200 hover:bg-white/8 hover:text-white disabled:text-cream/40 disabled:hover:bg-transparent"
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

// The version history drawer (D-6a): every version newest first with its
// result, what made it, and view / compare / make current / share; then the
// runs that did not finish.
export default function VersionHistory({
  s,
  shownId,
  onView,
  onCompare,
  onRestore,
  onShare,
}: {
  s: ToolFile;
  shownId?: string;
  onView: (id: string) => void;
  onCompare: (id: string) => void;
  onRestore: (id: string) => void;
  onShare?: (id: string) => void;
}) {
  const { versions } = s;
  if (versions.length === 0)
    return (
      <div className="py-10 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/6 text-cream/55">
          <GHistory size={22} />
        </span>
        <p className="mt-4 font-display text-[14px] font-medium text-white">No versions yet</p>
        <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-6 text-cream/55">
          Each time you generate, the result is kept here as a version. You can always come back to one.
        </p>
      </div>
    );

  const numberOf = (id?: string) => versions.find((v) => v.id === id)?.number;
  const unfinished = s.generations.filter((g) => g.status !== "succeeded");

  return (
    <div className="space-y-5">
      <ol className="space-y-2.5">
        {[...versions].reverse().map((v) => {
          const r = s.resultById(v.resultId);
          const g = r ? s.generationById(r.generationId) : undefined;
          const current = v.id === s.current?.id;
          const shown = v.id === shownId;
          return (
            <li
              key={v.id}
              className={`rounded-xl border p-2.5 transition-colors duration-200 ${shown ? "border-white/25 bg-white/6" : "border-white/8 bg-white/3"}`}
            >
              <div className="flex gap-3">
                <button type="button" onClick={() => onView(v.id)} aria-label={`View version ${v.number}`} className="relative size-[68px] shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r && <img src={r.image} alt="" className="size-full object-cover" loading="lazy" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-[13px] font-medium text-white">Version {v.number}</p>
                    {current && (
                      <span className="rounded-full bg-ember/15 px-2 py-0.5 font-display text-[9px] font-semibold tracking-[0.14em] text-ember-soft uppercase">
                        Current
                      </span>
                    )}
                    {r && (
                      <button
                        type="button"
                        onClick={() => s.favourite(r.id)}
                        aria-pressed={r.favourite}
                        aria-label={r.favourite ? `Remove version ${v.number} from favourites` : `Favourite version ${v.number}`}
                        className={`ml-auto flex size-8 items-center justify-center rounded-full transition-colors duration-200 ${r.favourite ? "text-ember-soft" : "text-cream/45 hover:text-white"}`}
                      >
                        <GHeart size={15} fill={r.favourite} />
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-cream/60">
                    {v.kind === "restored" ? `Restored from version ${numberOf(v.restoredFromId) ?? "?"}` : (g?.summary ?? "Generated")}
                  </p>
                  <p className="mt-0.5 text-[11px] text-cream/35">{timeAgo(v.createdAt)}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <SmallAction icon={GEye} label={shown ? "Showing" : "View"} onClick={() => onView(v.id)} disabled={shown} />
                <SmallAction icon={GRows} label="Compare" onClick={() => onCompare(v.id)} />
                {!current && <SmallAction icon={GUndo} label="Make current" onClick={() => onRestore(v.id)} />}
                {onShare && <SmallAction icon={GShareNetwork} label="Share or export" onClick={() => onShare(v.id)} />}
              </div>
            </li>
          );
        })}
      </ol>
      {unfinished.length > 0 && (
        <div>
          <p className="mb-2 font-display text-[10px] font-semibold tracking-[0.16em] text-cream/40 uppercase">Runs that did not finish</p>
          <ul className="space-y-1.5">
            {[...unfinished].reverse().map((g) => (
              <li key={g.id} className="rounded-lg border border-white/6 px-3 py-2 text-[11.5px] leading-5 text-cream/50">
                <span className="text-cream/75">Failed</span> · {g.summary}
                <span className="block text-cream/35">
                  {timeAgo(g.createdAt)} · {g.cost ? `${g.cost} credit spent` : "no credit spent"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
