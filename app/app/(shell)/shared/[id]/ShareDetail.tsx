"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { appButtonNavy, appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import {
  IconArrowClockwise,
  IconArrowLeft,
  IconArrowSquareOut,
  IconClockCounterClockwise,
  IconDownloadSimple,
  IconEye,
  IconGearSix,
  IconPaperPlaneRight,
  IconPencilSimple,
  IconProhibit,
  IconShareNetwork,
} from "@/components/app/AppIcons";
import Notice from "@/components/app/Notice";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, { SheetConfirm, SheetTitle } from "@/components/app/Sheet";
import { CopyLink, ShareSettings, ShareStatusBadge } from "@/components/app/ShareControls";
import HandOff from "@/app/app/(shell)/shared/[id]/HandOff";
import {
  expiryLabel,
  exportTypeLabel,
  formatBytes,
  linkState,
  optionLetter,
  reviewUrl,
  settingsSummary,
  settingsValid,
  shareStatus,
  shareStatusLabels,
  type ShareSettings as Settings,
} from "@/lib/mock/delivery";
import { inlineLabel, timeAgo } from "@/lib/mock/entities";
import { useResolveItem } from "@/lib/mock/resolve";
import {
  addShareComment,
  projectById,
  renewShare,
  revokeShare,
  studioNow,
  updateShareSettings,
  useHydrated,
  useStudio,
} from "@/lib/mock/store";
import { mockUser } from "@/lib/mock/user";
import { redownload } from "@/lib/useExport";

const when = (at: number) => inlineLabel(timeAgo(at));

// E-S2 / E-S3 — one review link from the owner's side: the client's decision,
// what they see, the conversation, and the link itself (copy, settings, a new
// link, turn off). After approval, the final files are handed off here.
export default function ShareDetail({ shareId }: { shareId: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { shares, deliveries } = useStudio();
  const resolve = useResolveItem();
  const share = shares.find((s) => s.id === shareId);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [confirmOff, setConfirmOff] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const [handOffOpen, setHandOffOpen] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const [reply, setReply] = useState("");

  if (!hydrated) return <div className="mx-5 h-64 rounded-card bg-line/50 motion-safe:animate-pulse sm:mx-0" aria-label="Loading the link" />;

  if (!share)
    return (
      <div className="px-5 py-6 sm:px-0">
        <ScreenCode code="E-S" state="Link not found" />
        <Notice
          tone="error"
          title="That link is not here"
          actions={
            <button type="button" onClick={() => router.push("/app/shared")} className={appButtonPrimary}>
              Back to Shared
            </button>
          }
        >
          It may have been made on another device, or the address is incomplete.
        </Notice>
      </div>
    );

  const now = studioNow();
  const state = linkState(share, now);
  const status = shareStatus(share, now);
  const items = share.items.map(resolve);
  const options = items.length > 1 && share.kind !== "set";
  const set = share.kind === "set";
  const chosen = share.review.status === "waiting" ? 0 : share.review.chosen;
  const project = projectById(share.projectId);
  const handedOff = share.handoff ? deliveries.filter((d) => share.handoff!.deliveryIds.includes(d.id)) : [];
  const firstFile = items[0]?.fileId;
  const url = reviewUrl(share.token);

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    addShareComment(share.id, { author: mockUser.name, from: "owner", text: reply.trim() });
    setReply("");
  };

  const { review } = share;
  let decision: React.ReactNode;
  if (review.status === "approved")
    decision = (
      <Notice
        tone="success"
        title={`${review.reviewer} approved ${options ? `option ${optionLetter(chosen)}` : "it"}`}
        actions={
          share.handoff ? undefined : (
            <button type="button" onClick={() => setHandOffOpen(true)} className={clsx(appButtonPrimary, "px-4 py-2.5")}>
              <IconPaperPlaneRight />
              Hand off final files
            </button>
          )
        }
      >
        {review.note ? `“${review.note}” · ` : ""}
        {when(review.decidedAt)}.{" "}
        {share.handoff ? `Final files handed off ${when(share.handoff.at)}.` : "Send the final files to the same link."}
      </Notice>
    );
  else if (review.status === "changes")
    decision = (
      <Notice
        tone="warn"
        title={`${review.reviewer} asked for changes${options ? `, closest to option ${optionLetter(chosen)}` : ""}`}
        actions={
          firstFile ? (
            <>
              <Link href={`/app/files/${items[chosen]?.fileId ?? firstFile}`} className={clsx(appButtonPrimary, "px-4 py-2.5")}>
                <IconPencilSimple size={15} />
                Open the file
              </Link>
              <Link
                href={`/app/editor/${items[chosen]?.fileId ?? firstFile}?deliver=link`}
                className="inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-shell"
              >
                Share an update
              </Link>
            </>
          ) : undefined
        }
      >
        “{review.note}” · {when(review.decidedAt)}. Make the change, then share the new version on a fresh link.
      </Notice>
    );
  else if (share.settings.review)
    decision = (
      <Notice tone="info" title={share.views ? "Waiting for a decision" : "Not opened yet"}>
        {share.views
          ? `Opened ${share.views} ${share.views === 1 ? "time" : "times"}. You will see their choice here as soon as they send it.`
          : "Send the link if you have not yet. It needs no account to open."}
      </Notice>
    );
  else
    decision = (
      <Notice tone="info" title="View only">
        This link does not ask for a decision. Turn it on in the settings if you need one.
      </Notice>
    );

  return (
    <div className="px-5 sm:px-0">
      <ScreenCode code={share.handoff ? "E-S3" : "E-S2"} state={shareStatusLabels[status]} />
      <Link href="/app/shared" className="inline-flex min-h-9 items-center gap-1 text-[13px] text-muted transition-colors duration-200 hover:text-navy">
        <IconArrowLeft size={13} />
        Shared
      </Link>
      <div className="mt-3">
        <ShareStatusBadge status={status} />
        <h1 className="mt-2 text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold text-navy">{share.title}</h1>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        {items[0]?.fileName}
        {project && (
          <>
            {" · "}
            <Link href={`/app/projects/${project.id}`} className="underline-offset-2 hover:text-navy hover:underline">
              {project.name}
            </Link>
          </>
        )}
        {" · "}Sent {when(share.createdAt)} · {share.views} {share.views === 1 ? "view" : "views"}
        {share.lastViewedAt ? `, last ${when(share.lastViewedAt)}` : ""}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="min-w-0 space-y-8">
          <section aria-label="Decision">{decision}</section>

          {handedOff.length > 0 && (
            <section aria-label="Handed off">
              <h2 className="font-display text-base font-medium text-navy">Final files</h2>
              <ul className="mt-3 space-y-2">
                {handedOff.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 rounded-card border border-line bg-white p-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[14px] font-medium text-navy">{d.filename}</span>
                      <span className="block text-[12.5px] text-muted">
                        {exportTypeLabel(d)} · {formatBytes(d.bytes)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void redownload(d, resolve(d))}
                      className="inline-flex items-center justify-center gap-2 rounded-control px-3.5 py-2.5 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-shell"
                    >
                      <IconDownloadSimple />
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-label="What they see">
            <h2 className="font-display text-base font-medium text-navy">
              {options ? `${items.length} options` : set ? `${items.length} images, approved together` : "What they see"}
            </h2>
            <div className={clsx("mt-3 grid gap-4", items.length > 1 && "sm:grid-cols-2")}>
              {items.map((item, i) => {
                const picked = options && review.status !== "waiting" && review.chosen === i;
                const comments = share.comments.filter((c) => c.item === i);
                return (
                  <figure
                    key={item.versionId + i}
                    className={clsx(
                      "overflow-hidden rounded-card border bg-white",
                      picked ? "border-ember shadow-[0_0_0_1px_var(--color-ember)]" : "border-line"
                    )}
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={options ? `Option ${optionLetter(i)}` : share.title} className="aspect-4/3 w-full object-cover" />
                    ) : (
                      <div className="flex aspect-4/3 items-center justify-center bg-cream text-[13px] text-body">This version was removed</div>
                    )}
                    <figcaption className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-[14px] font-medium text-navy">
                          {options ? `Option ${optionLetter(i)}` : set ? item.fileName : "The image"}
                          <span className="ml-2 text-[12px] font-normal text-muted">version {item.versionNumber}</span>
                        </p>
                        {picked && (
                          <span className="ml-auto rounded-full bg-ember/12 px-2.5 py-1 text-[11px] font-semibold text-ember">
                            {review.status === "approved" ? "Approved" : "Closest"}
                          </span>
                        )}
                      </div>
                      {comments.length > 0 && (
                        <ul className="mt-3 space-y-2 border-t border-line pt-3">
                          {comments.map((c) => (
                            <li key={c.id} className="text-[13px] leading-5">
                              <span className="font-medium text-navy">{c.author}</span>
                              <span className="text-muted"> · {when(c.at)}</span>
                              <p className="text-body">{c.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="conversation">
            <h2 id="conversation" className="font-display text-base font-medium text-navy">
              Conversation
            </h2>
            {share.comments.length ? (
              <ol className="mt-3 space-y-3">
                {[...share.comments]
                  .sort((a, b) => a.at - b.at)
                  .map((c) => (
                    <li
                      key={c.id}
                      className={clsx(
                        "max-w-xl rounded-card px-4 py-3 text-[13.5px] leading-6",
                        c.from === "owner" ? "ml-auto bg-navy/[0.06]" : "border border-line bg-white"
                      )}
                    >
                      <p className="text-[12px] text-muted">
                        <span className="font-medium text-navy">{c.from === "owner" ? "You" : c.author}</span>
                        {options && c.item !== undefined ? ` on option ${optionLetter(c.item)}` : ""} · {when(c.at)}
                      </p>
                      <p className="mt-0.5 text-body">{c.text}</p>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="mt-2 text-[13.5px] text-body">No comments yet.</p>
            )}
            <form onSubmit={sendReply} className="mt-4 flex gap-2">
              <label htmlFor="owner-reply" className="sr-only">
                Reply on the link
              </label>
              <input
                id="owner-reply"
                value={reply}
                onChange={(e) => setReply(e.target.value.slice(0, 600))}
                placeholder="Reply — they see it on the link…"
                className="min-w-0 flex-1 rounded-control border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:border-navy/40 focus:outline-none sm:text-[14px]"
              />
              <button type="submit" disabled={!reply.trim()} className={appButtonNavy}>
                <IconPaperPlaneRight />
                <span className="sr-only sm:not-sr-only">Send</span>
              </button>
            </form>
          </section>
        </div>

        <aside aria-label="Link" className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-card border border-line bg-white p-5">
            <h2 className="font-display text-[15px] font-medium text-navy">The link</h2>
            {state === "active" ? (
              <>
                <div className="mt-3">
                  <CopyLink url={url} tone="light" />
                </div>
                {renewed && <p className="-mt-1 mb-2 text-[12.5px] text-navy">New link made. The old one no longer opens.</p>}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-10 items-center gap-1.5 text-[13px] font-medium text-navy underline-offset-2 hover:underline"
                >
                  <IconEye size={15} />
                  See it as your client
                  <IconArrowSquareOut size={13} className="text-muted" />
                </a>
              </>
            ) : (
              <div className="mt-3">
                <Notice
                  tone="warn"
                  title={state === "expired" ? "This link has expired" : "This link is turned off"}
                  actions={
                    <button
                      type="button"
                      onClick={() => {
                        renewShare(share.id);
                        setRenewed(true);
                      }}
                      className={clsx(appButtonPrimary, "px-3.5 py-2.5")}
                    >
                      <IconArrowClockwise />
                      Generate new link
                    </button>
                  }
                >
                  Anyone who opens it sees a polite note instead of the work. A new link opens everything again, with the same comments.
                </Notice>
              </div>
            )}
            <p className="mt-3 text-[12.5px] leading-5 text-muted">
              {settingsSummary(share.settings)}
              {share.revokedAt ? "." : `. ${expiryLabel(share, now)}.`}
            </p>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(share.settings);
                  setSettingsOpen(true);
                }}
                className={appButtonOutline}
              >
                <IconGearSix />
                Change settings
              </button>
              {state === "active" && (
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setConfirmNew(true)} className={appButtonOutline}>
                    <IconArrowClockwise />
                    New link
                  </button>
                  <button type="button" onClick={() => setConfirmOff(true)} className={appButtonOutline}>
                    <IconProhibit />
                    Turn off
                  </button>
                </div>
              )}
            </div>
          </div>
          {share.message && (
            <div className="rounded-card border border-line bg-white p-5">
              <h2 className="font-display text-[13px] font-medium text-muted">Your message</h2>
              <p className="mt-2 text-[14px] leading-6 text-body">{share.message}</p>
            </div>
          )}
          <p className="flex items-center gap-1.5 px-1 text-[12.5px] text-muted">
            <IconClockCounterClockwise size={14} />
            Everything here is in Shared, under Activity.
          </p>
        </aside>
      </div>

      <Sheet open={settingsOpen} onClose={() => setSettingsOpen(false)} labelledBy="link-settings" maxWidth="30rem">
        <SheetTitle id="link-settings" title="Link settings" onClose={() => setSettingsOpen(false)} />
        {draft && <ShareSettings value={draft} onChange={setDraft} tone="light" />}
        <p className="mt-4 text-[12.5px] leading-5 text-muted">Changes apply to the same link. Nobody needs a new one.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            disabled={!draft || !settingsValid(draft)}
            onClick={() => {
              if (draft) updateShareSettings(share.id, draft);
              setSettingsOpen(false);
            }}
            className={clsx(appButtonNavy, "flex-1")}
          >
            Save
          </button>
          <button type="button" onClick={() => setSettingsOpen(false)} className={clsx(appButtonOutline, "flex-1")}>
            Cancel
          </button>
        </div>
      </Sheet>

      <Sheet open={confirmOff} onClose={() => setConfirmOff(false)} labelledBy="confirm-title">
        <SheetConfirm
          icon={<IconProhibit size={20} />}
          tone="ember"
          title="Turn off this link?"
          body="Anyone who opens it will see that it was turned off. Comments and decisions stay here, and you can make a new link any time."
          confirm="Turn off"
          onConfirm={() => {
            revokeShare(share.id);
            setConfirmOff(false);
          }}
          onCancel={() => setConfirmOff(false)}
        />
      </Sheet>

      <Sheet open={confirmNew} onClose={() => setConfirmNew(false)} labelledBy="confirm-title">
        <SheetConfirm
          icon={<IconShareNetwork size={20} />}
          title="Make a new link?"
          body="The link you sent stops working and shows a note that it was replaced. Comments, the decision and the settings carry over to the new one."
          confirm="Make a new link"
          confirmClass={appButtonNavy}
          onConfirm={() => {
            renewShare(share.id);
            setRenewed(true);
            setConfirmNew(false);
          }}
          onCancel={() => setConfirmNew(false)}
        />
      </Sheet>

      {review.status === "approved" && items[chosen] && (
        <HandOff open={handOffOpen} onClose={() => setHandOffOpen(false)} share={share} item={items[chosen]} />
      )}
    </div>
  );
}
