"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import {
  IconChatCircle,
  IconCheckCircle,
  IconCheckCircleFill,
  IconDownloadSimple,
  IconLinkBreak,
  IconLockSimple,
  IconPaperPlaneRight,
  IconSparkleFill,
} from "@/components/app/AppIcons";
import Notice from "@/components/app/Notice";
import ScreenCode from "@/components/app/ScreenCode";
import { CompareSlider } from "@/app/app/editor/[fileId]/_ui/controls";
import { mockProfile } from "@/lib/mock/account";
import { exportTypeLabel, formatBytes, linkState, optionLetter, slugify, type LinkState, type Share } from "@/lib/mock/delivery";
import { timeAgo } from "@/lib/mock/entities";
import { useResolveItem, type ResolvedItem } from "@/lib/mock/resolve";
import { addShareComment, recordShareView, studioNow, submitReview, useHydrated, useStudio } from "@/lib/mock/store";
import { canvasToBlob, renderCanvas, saveBlob } from "@/lib/render";
import { redownload } from "@/lib/useExport";

// The person who sent the link (the prototype's owner profile).
const owner = { name: mockProfile.name, studio: mockProfile.studio, first: mockProfile.name.split(" ")[0] };
const MAX_NOTE = 600;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simulated service time, as in the prototype: each wait is a fraction of this.
const LATENCY_MS = 1100;

/** Timers that stand in for service calls; cleared on unmount. */
function useLater() {
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  return (fn: () => void, factor: number) => {
    timers.current.push(window.setTimeout(fn, Math.round(LATENCY_MS * factor)));
  };
}

/** The prototype's labelled text input (light). */
function Field({
  id,
  label,
  error,
  ...input
}: { id?: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const own = useId();
  const fieldId = id ?? own;
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={clsx(
            "w-full rounded-control border bg-white px-4 py-3.5 text-base text-ink transition-colors duration-200 ease-out-soft placeholder:text-faint focus:outline-none sm:text-[15px]",
            error ? "border-ember focus:border-ember" : "border-line focus:border-navy/40"
          )}
          {...input}
        />
      </div>
      {error && (
        <p id={`${fieldId}-error`} className="mt-2 text-[13px] leading-5 text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

// E-S2 — the page a client opens from a review link. A link that expired, was
// turned off, replaced or never existed shows a note; an invite-only link asks
// for the visitor's email first (E-S2a). Decisions and comments go to the
// owner's Shared screen; final files handed off after approval are here (E-S3).
export default function ClientReview({ token }: { token: string }) {
  const hydrated = useHydrated();
  const later = useLater();
  const { shares } = useStudio();
  const share = shares.find((s) => s.token === token || s.previousTokens.includes(token));
  const state = linkState(share, studioNow(), token);
  // The link takes a moment to open, as in the prototype.
  const [opening, setOpening] = useState(true);
  useEffect(() => later(() => setOpening(false), 0.7), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [verified, setVerified] = useState(false);
  const loading = !hydrated || opening;
  const viewable = !!share && state === "active" && (share.settings.access === "link" || verified);

  // One view per visit, once the work is shown.
  const counted = useRef<string | null>(null);
  useEffect(() => {
    if (!loading && viewable && share && counted.current !== share.id) {
      counted.current = share.id;
      recordShareView(share.id);
    }
  }, [loading, viewable, share]);

  let body: React.ReactNode;
  if (loading) body = <Opening />;
  else if (!share || state !== "active") body = <LinkNote state={state === "active" ? "missing" : state} />;
  else if (viewable) body = <Review share={share} />;
  else body = <InviteCheck share={share} onVerified={() => setVerified(true)} />;

  return (
    <div className="app-shell flex min-h-svh flex-col bg-shell text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-5 sm:h-16 sm:px-8">
          <Image src="/brand/vastunord-mark.svg" alt="VastuNord" width={49} height={24} className="h-6 w-[49px]" />
          <span className="ml-auto truncate text-[13px] text-muted">
            Shared by <span className="font-medium text-navy">{owner.name}</span>
            <span className="hidden sm:inline"> · {owner.studio}</span>
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 pt-8 pb-16 sm:px-8 md:pt-12">
        <ScreenCode code={loading || !share || state !== "active" || viewable ? "E-S2" : "E-S2a"} state={loading ? "Opening link" : state} />
        {body}
      </main>
      <footer className="border-t border-line py-8 text-center text-[12px] text-muted">
        Visualised with{" "}
        <Link href="/" className="font-medium text-navy underline-offset-2 hover:underline">
          VastuNord
        </Link>
      </footer>
    </div>
  );
}

function Opening() {
  return (
    <div aria-label="Opening the link" className="animate-pulse">
      <div className="h-3 w-28 rounded-full bg-line" />
      <div className="mt-4 h-9 w-2/3 rounded-xl bg-line" />
      <div className="mt-3 h-4 w-1/2 rounded-full bg-line/70" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="aspect-4/3 rounded-card bg-line/70" />
        <div className="aspect-4/3 rounded-card bg-line/70" />
      </div>
    </div>
  );
}

const notes: Record<Exclude<LinkState, "active">, { title: string; copy: string }> = {
  expired: { title: "This link has expired", copy: `Links stay open for a set time. Ask ${owner.first} to send you a new one.` },
  revoked: {
    title: "This link was turned off",
    copy: `${owner.first} has closed it. If you still need to see the work, ask for a new link.`,
  },
  replaced: {
    title: "There is a newer link",
    copy: `${owner.first} replaced this link with a new one. Ask for the latest, or check your messages for it.`,
  },
  missing: {
    title: "This link does not open anything",
    copy: "It may have been copied only in part. Check you have the whole link, or ask for it again.",
  },
};

/** What a visitor sees instead of the work when the link does not open. */
function LinkNote({ state }: { state: Exclude<LinkState, "active"> }) {
  const note = notes[state];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-navy/8 text-navy">
        <IconLinkBreak size={22} />
      </span>
      <h1 className="mt-6 text-[clamp(1.5rem,5vw,2rem)] leading-tight font-semibold text-navy">{note.title}</h1>
      <p className="mt-3 text-[15px] leading-7 text-body">{note.copy}</p>
      <p className="mt-8 text-[13px] text-muted">Nothing you sent before is lost.</p>
    </div>
  );
}

/** E-S2a: an invite-only link opens for the emails on its list. */
function InviteCheck({ share, onVerified }: { share: Share; onVerified: () => void }) {
  const later = useLater();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [checking, setChecking] = useState(false);
  const [stranger, setStranger] = useState(false);
  return (
    <div className="mx-auto max-w-md py-10">
      <span className="flex size-12 items-center justify-center rounded-full bg-navy/8 text-navy">
        <IconLockSimple size={22} />
      </span>
      <h1 className="mt-6 text-[clamp(1.5rem,5vw,2rem)] leading-tight font-semibold text-navy">{share.title}</h1>
      <p className="mt-3 text-[15px] leading-7 text-body">{owner.first} shared this with specific people. Enter your email to open it.</p>
      {stranger && (
        <div className="mt-6">
          <Notice tone="warn" title="This email is not on the list">
            Ask {owner.first} to add {email.trim()}, or try the address the link was sent to.
          </Notice>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!EMAIL.test(email.trim())) return setError("Enter the email address this was shared with.");
          setError(undefined);
          setChecking(true);
          later(() => {
            setChecking(false);
            if (share.settings.invitees.includes(email.trim().toLowerCase())) onVerified();
            else setStranger(true);
          }, 0.6);
        }}
        className="mt-6 space-y-4"
        noValidate
      >
        <Field
          label="Your email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStranger(false);
          }}
          error={error}
        />
        <button type="submit" disabled={checking} className={clsx(appButtonPrimary, "w-full")}>
          {checking ? "Checking…" : "Open"}
        </button>
      </form>
    </div>
  );
}

function Review({ share }: { share: Share }) {
  const later = useLater();
  const resolve = useResolveItem();
  const { deliveries } = useStudio();
  const nameId = useId();
  const noteId = useId();
  const items = share.items.map(resolve);
  const multi = items.length > 1 && share.kind !== "set";
  const notesOnLink = share.comments.filter((c) => c.item === undefined);
  const decided = share.review.status !== "waiting" ? share.review : null;
  const [chosen, setChosen] = useState<number | undefined>(decided?.chosen ?? (multi ? undefined : 0));
  const [name, setName] = useState(decided?.reviewer ?? "");
  const [mode, setMode] = useState<"approve" | "changes">("approve");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; choice?: string; note?: string }>({});
  const [sending, setSending] = useState(false);
  const [deciding, setDeciding] = useState(!decided);
  const finals = share.handoff ? deliveries.filter((d) => share.handoff!.deliveryIds.includes(d.id)) : [];

  const send = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = `Add your name, so ${owner.first} knows who this is from.`;
    if (mode === "approve" && multi && chosen === undefined) next.choice = "Choose the option you are approving.";
    if (mode === "changes" && !note.trim()) next.note = "Say what you would change. A sentence is enough.";
    setErrors(next);
    if (next.name) document.getElementById(nameId)?.focus();
    else if (next.note) document.getElementById(noteId)?.focus();
    if (Object.keys(next).length) return;
    setSending(true);
    later(() => {
      setSending(false);
      submitReview(share.id, {
        reviewer: name.trim(),
        status: mode === "approve" ? "approved" : "changes",
        chosen: chosen ?? 0,
        note: note.trim(),
      });
      setDeciding(false);
    }, 0.8);
  };

  // An HD JPG of the option, drawn in the browser.
  const download = async (item: ResolvedItem, index: number) => {
    if (!item.image) return;
    try {
      const canvas = await renderCanvas({ after: item.image, before: item.before, layout: "result", longEdge: 1920 });
      saveBlob(
        await canvasToBlob(canvas, "JPG", 0.86),
        `${slugify(share.title)}${multi ? `-option-${optionLetter(index).toLowerCase()}` : ""}.jpg`
      );
    } catch {}
  };

  return (
    <div>
      <p className="eyebrow text-ember">{share.settings.review ? "For your review" : "Shared with you"}</p>
      <h1 className="mt-3 text-[clamp(1.75rem,5.4vw,3rem)] leading-[1.05] font-semibold text-navy">{share.title}</h1>
      <p className="mt-3 text-[13px] text-muted">
        From {owner.name} · {timeAgo(share.createdAt)}
        {share.expiresAt ? ` · open until ${new Date(share.expiresAt).toLocaleDateString(undefined, { day: "numeric", month: "long" })}` : ""}
      </p>
      {share.message && (
        <p className="mt-6 max-w-2xl border-l-2 border-ember pl-4 text-[15px] leading-7 text-body md:text-base">{share.message}</p>
      )}

      {share.handoff && (
        <section aria-labelledby="final-files" className="mt-10 overflow-hidden rounded-card bg-navy-deep p-6 text-white md:p-8">
          <p className="eyebrow text-ember-soft">Final files</p>
          <h2 id="final-files" className="mt-2 font-display text-xl font-medium">
            Ready to download
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-6 text-cream/70">
            {owner.first} sent these {timeAgo(share.handoff.at).toLowerCase()}. They are full size, without a watermark.
          </p>
          <ul className="mt-5 space-y-2">
            {finals.map((d) => (
              <li key={d.id} className="flex items-center gap-3 rounded-control bg-white/8 px-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{d.filename}</span>
                  <span className="block text-[12px] text-cream/60">
                    {exportTypeLabel(d)} · {formatBytes(d.bytes)}
                  </span>
                </span>
                <button
                  type="button"
                  disabled={d.status !== "delivered"}
                  onClick={() => void redownload(d, resolve(d))}
                  className="inline-flex shrink-0 items-center gap-2 rounded-control border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white transition-[background-color,border-color,opacity] duration-200 hover:border-white/30 hover:bg-white/15 disabled:pointer-events-none disabled:opacity-45"
                >
                  <IconDownloadSimple size={15} />
                  Download
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {decided && !deciding && (
        <div className="mt-8">
          <Notice
            tone={decided.status === "approved" ? "success" : "info"}
            title={
              decided.status === "approved"
                ? `${decided.reviewer} approved ${multi ? `option ${optionLetter(decided.chosen)}` : "this"}`
                : `${decided.reviewer} asked for changes`
            }
            actions={
              share.settings.review && !share.handoff ? (
                <button type="button" onClick={() => setDeciding(true)} className={clsx(appButtonOutline, "px-3.5 py-2.5")}>
                  Change the answer
                </button>
              ) : undefined
            }
          >
            {decided.note ? `“${decided.note}” · ` : ""}Sent {timeAgo(decided.decidedAt).toLowerCase()}. {owner.first} has it.
          </Notice>
        </div>
      )}

      {notesOnLink.length > 0 && items.length > 1 && (
        <ul className="mt-8 max-w-2xl space-y-3" aria-label="Notes">
          {notesOnLink.map((c) => (
            <li key={c.id} className="rounded-card border border-line bg-white px-4 py-3 text-[14px] leading-6">
              <span className="font-medium text-navy">{c.from === "owner" ? owner.name : c.author}</span>
              <span className="text-muted"> · {timeAgo(c.at).toLowerCase()}</span>
              <p className="text-body">{c.text}</p>
            </li>
          ))}
        </ul>
      )}

      {multi && share.settings.review && deciding && (
        <p className="mt-10 font-display text-[15px] font-medium text-navy">{items.length} options. Compare them, then choose one below.</p>
      )}

      <div className={clsx("mt-6 grid gap-6", items.length > 1 ? "md:grid-cols-2" : "max-w-4xl")}>
        {items.map((item, i) => (
          <OptionCard
            key={item.versionId + i}
            share={share}
            item={item}
            index={i}
            multi={multi}
            set={share.kind === "set"}
            chosen={multi && chosen === i}
            canChoose={share.settings.review && deciding && multi}
            onChoose={() => {
              setChosen(i);
              setErrors((e) => ({ ...e, choice: undefined }));
            }}
            onDownload={share.settings.allowDownload ? () => void download(item, i) : undefined}
            name={name}
            onAskName={() => document.getElementById(nameId)?.focus()}
            onComment={(text) => addShareComment(share.id, { author: name.trim(), from: "client", text, item: i })}
            decidedChoice={multi && decided && !deciding ? decided.chosen : undefined}
          />
        ))}
      </div>

      {share.settings.review && deciding && (
        <section aria-labelledby="decision" className="mt-10 rounded-card border border-line bg-white p-5 sm:p-6">
          <h2 id="decision" className="font-display text-base font-medium text-navy">
            {multi && chosen !== undefined ? `Option ${optionLetter(chosen)} chosen` : "Your decision"}
          </h2>
          {errors.choice && <p className="mt-1 text-[13px] text-ember">{errors.choice}</p>}
          <div role="radiogroup" aria-label="Decision" className="mt-4 grid grid-cols-2 gap-2 sm:max-w-md">
            {(
              [
                ["approve", "Approve"],
                ["changes", "Ask for changes"],
              ] as const
            ).map(([id, text]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mode === id}
                onClick={() => setMode(id)}
                className={clsx(
                  "min-h-11 rounded-control border px-3 text-[14px] font-medium transition-colors duration-200",
                  mode === id ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy/40"
                )}
              >
                {text}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
            <Field id={nameId} label="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" error={errors.name} />
            {mode === "changes" ? (
              <div>
                <label htmlFor={noteId} className="block text-sm font-medium text-navy">
                  What would you change?
                </label>
                <textarea
                  id={noteId}
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE))}
                  rows={3}
                  aria-invalid={errors.note ? true : undefined}
                  placeholder={multi ? "Which option is closest, and what should be different…" : "What should be different…"}
                  className={clsx(
                    "mt-2 w-full resize-none rounded-control border bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:outline-none sm:text-[15px]",
                    errors.note ? "border-ember" : "border-line focus:border-navy/40"
                  )}
                />
                {errors.note && <p className="mt-1.5 text-[13px] text-ember">{errors.note}</p>}
              </div>
            ) : (
              <p className="self-end pb-3 text-[13px] leading-6 text-body">
                {owner.first} will hear right away and can send the final files to this same link.
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={send} disabled={sending} className={appButtonPrimary}>
              {mode === "approve" ? <IconCheckCircle size={15} /> : <IconPaperPlaneRight size={15} />}
              {sending
                ? "Sending…"
                : mode === "approve"
                  ? `Approve${multi && chosen !== undefined ? ` option ${optionLetter(chosen)}` : ""}`
                  : "Send the changes"}
            </button>
            {decided && (
              <button type="button" onClick={() => setDeciding(false)} className={appButtonOutline}>
                Cancel
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/** One option: the image (or a before & after slider), a choose button, a download, and its comments. */
function OptionCard({
  share,
  item,
  index,
  multi,
  set,
  chosen,
  canChoose,
  onChoose,
  onDownload,
  name,
  onAskName,
  onComment,
  decidedChoice,
}: {
  share: Share;
  item: ResolvedItem;
  index: number;
  multi: boolean;
  set: boolean;
  chosen: boolean;
  canChoose: boolean;
  onChoose: () => void;
  onDownload?: () => void;
  name: string;
  onAskName: () => void;
  onComment: (text: string) => void;
  decidedChoice?: number;
}) {
  const inputId = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const letter = optionLetter(index);
  const highlighted = chosen || decidedChoice === index;
  const comments = share.comments.filter((c) => c.item === index || (share.items.length === 1 && c.item === undefined));

  const post = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!name.trim()) {
      setError("Add your name in the decision box first.");
      onAskName();
      return;
    }
    setError(undefined);
    onComment(text.trim());
    setText("");
  };

  return (
    <article
      aria-label={multi ? `Option ${letter}` : share.title}
      className={clsx(
        "overflow-hidden rounded-card border bg-white transition-[border-color,box-shadow] duration-200",
        highlighted ? "border-ember shadow-[0_0_0_1px_var(--color-ember)]" : "border-line"
      )}
    >
      {!item.exists ? (
        <div className="flex aspect-4/3 items-center justify-center bg-cream px-6 text-center text-[14px] text-body">
          This image was removed after the link was made.
        </div>
      ) : share.settings.showOriginal && item.before ? (
        <div className="aspect-4/3 bg-cream p-2">
          <CompareSlider before={item.before} after={item.image} beforeLabel="Today" afterLabel={multi ? `Option ${letter}` : "Proposed"} />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={multi ? `Option ${letter}` : share.title} className="aspect-4/3 w-full object-cover" />
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            {multi && <p className="font-display text-lg font-medium text-navy">Option {letter}</p>}
            {set && <p className="font-display text-lg font-medium text-navy">{item.fileName}</p>}
            {share.settings.showOriginal && <p className="text-[12px] text-muted">Drag across the image to compare with today.</p>}
          </div>
          {onDownload && item.exists && (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-control px-3 text-[13px] font-medium text-navy transition-colors duration-200 hover:bg-shell"
            >
              <IconDownloadSimple size={15} />
              Download
            </button>
          )}
          {canChoose ? (
            <button
              type="button"
              onClick={onChoose}
              aria-pressed={chosen}
              className={clsx(
                "inline-flex min-h-10 items-center gap-1.5 rounded-control border px-4 text-[13px] font-semibold transition-colors duration-200",
                chosen ? "border-ember bg-ember text-white" : "border-line text-navy hover:border-navy/40"
              )}
            >
              {chosen && <IconCheckCircleFill size={15} />}
              {chosen ? "Chosen" : `Choose ${letter}`}
            </button>
          ) : decidedChoice === index ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/12 px-3 py-1.5 text-[12px] font-semibold text-ember">
              <IconSparkleFill size={13} />
              Chosen
            </span>
          ) : null}
        </div>
        {share.settings.review && (
          <div className="mt-4 border-t border-line pt-4">
            {comments.length > 0 && (
              <ul className="mb-3 space-y-2.5">
                {comments.map((c) => (
                  <li key={c.id} className="text-[13px] leading-6">
                    <span className="font-medium text-navy">{c.from === "owner" ? owner.name : c.author}</span>{" "}
                    <span className="text-muted">· {timeAgo(c.at).toLowerCase()}</span>
                    <p className="text-body">{c.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={post} className="flex gap-2">
              <label htmlFor={inputId} className="sr-only">
                Comment on {multi ? `option ${letter}` : "this image"}
              </label>
              <input
                id={inputId}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 400))}
                placeholder={multi ? `A comment on option ${letter}…` : set ? `A comment on ${item.fileName.toLowerCase()}…` : "A comment…"}
                className="min-w-0 flex-1 rounded-control border border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-faint focus:border-navy/40 focus:outline-none sm:text-[14px]"
              />
              <button
                type="submit"
                aria-label="Post comment"
                disabled={!text.trim()}
                className="flex size-11 shrink-0 items-center justify-center rounded-control bg-navy text-white transition-colors duration-200 hover:bg-navy-ink disabled:opacity-40"
              >
                <IconChatCircle size={17} />
              </button>
            </form>
            {error && <p className="mt-1.5 text-[12.5px] text-ember">{error}</p>}
          </div>
        )}
      </div>
    </article>
  );
}
