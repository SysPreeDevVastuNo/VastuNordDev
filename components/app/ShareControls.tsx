"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import {
  IconCheckBold,
  IconCopy,
  IconGlobe,
  IconLockSimple,
  IconSpinnerGap,
  IconX,
  IconXBold,
} from "@/components/app/AppIcons";
import {
  expiryOptions,
  shareStatusLabels,
  type ShareSettings as Settings,
  type ShareStatus,
} from "@/lib/mock/delivery";
import { copyText } from "@/lib/render";

// Review-link and export controls shared by the editor's dark Share & export
// dialog and the light Studio screens (Share for review, link detail, handoff).
// One component per control with a `tone`, as in the prototype.

export type Tone = "dark" | "light";

export const tones = {
  dark: {
    text: "text-white",
    soft: "text-cream/60",
    faint: "text-cream/40",
    label: "font-display text-[10px] font-semibold tracking-[0.16em] text-cream/45 uppercase",
    box: "border-white/10 bg-white/4",
    boxHover: "hover:border-white/30",
    on: "border-ember bg-ember/12",
    input:
      "w-full rounded-xl border border-white/12 bg-white/5 px-3.5 py-3 text-base text-white placeholder:text-cream/30 focus:border-white/35 focus:outline-none sm:text-[13px]",
    track: "bg-white/16",
  },
  light: {
    text: "text-navy",
    soft: "text-body",
    faint: "text-muted",
    label: "font-display text-[10px] font-semibold tracking-[0.16em] text-muted uppercase",
    box: "border-line bg-white",
    boxHover: "hover:border-navy/30",
    on: "border-ember bg-ember/[0.06]",
    input:
      "w-full rounded-control border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:border-navy/40 focus:outline-none sm:text-[14px]",
    track: "bg-line",
  },
};

export function FieldLabel({ htmlFor, tone = "dark", children }: { htmlFor: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={clsx("mb-2 block", tones[tone].label)}>
      {children}
    </label>
  );
}

export function ToneToggle({
  label,
  hint,
  checked,
  onChange,
  disabled,
  tone = "dark",
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 py-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="min-w-0 flex-1">
        <span className={clsx("block font-display text-[13px] font-medium", t.text)}>{label}</span>
        {hint && <span className={clsx("mt-0.5 block text-[11.5px] leading-5", t.faint)}>{hint}</span>}
      </span>
      <span aria-hidden className={clsx("relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-ember" : t.track)}>
        <span
          className={clsx(
            "absolute top-1 size-4 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-out-soft",
            checked ? "left-5" : "left-1"
          )}
        />
      </span>
    </button>
  );
}

/** A row of pill options with their own labels (layout, compression, expiry…). */
export function ToneChips<T extends string>({
  label,
  options,
  value,
  onChange,
  tone = "dark",
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={clsx(
              "inline-flex min-h-9 items-center rounded-full border px-3.5 text-[12px] whitespace-nowrap transition-colors duration-200",
              on ? `${t.on} ${t.text}` : `${t.box} ${t.soft} ${t.boxHover}`
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Who can open a review link, what they can do with it, and how long it stays open. */
export function ShareSettings({
  value,
  onChange,
  tone = "dark",
  trial,
}: {
  value: Settings;
  onChange: (s: Settings) => void;
  tone?: Tone;
  trial?: boolean;
}) {
  const t = tones[tone];
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const set = (patch: Partial<Settings>) => onChange({ ...value, ...patch });

  const addEmails = () => {
    const emails = draft
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (!emails.length) return;
    const bad = emails.find((e) => !EMAIL.test(e));
    if (bad) return setError(`“${bad}” is not an email address.`);
    setError(undefined);
    set({ invitees: [...new Set([...value.invitees, ...emails.map((e) => e.toLowerCase())])] });
    setDraft("");
  };

  const access = [
    { id: "link", title: "Anyone with the link", hint: "No account needed", Icon: IconGlobe },
    { id: "invite", title: "Only people you invite", hint: "They confirm their email", Icon: IconLockSimple },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <p className={clsx("mb-2", t.label)}>Who can open it</p>
        <div role="radiogroup" aria-label="Who can open it" className="grid grid-cols-2 gap-2">
          {access.map(({ id, title, hint, Icon }) => {
            const on = value.access === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ access: id })}
                className={clsx("rounded-xl border px-3 py-2.5 text-left transition-colors duration-200", on ? t.on : `${t.box} ${t.boxHover}`)}
              >
                <Icon size={15} className={on ? "text-ember" : t.faint} />
                <span className={clsx("mt-1.5 block font-display text-[12.5px] font-semibold", t.text)}>{title}</span>
                <span className={clsx("mt-0.5 block text-[11px] leading-4", t.faint)}>{hint}</span>
              </button>
            );
          })}
        </div>
        {value.access === "invite" && (
          <div className="mt-3">
            <label htmlFor={inputId} className="sr-only">
              Email addresses to invite
            </label>
            <div className="flex gap-2">
              <input
                id={inputId}
                type="email"
                inputMode="email"
                autoComplete="off"
                spellCheck={false}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addEmails();
                  }
                }}
                placeholder="name@example.com"
                aria-invalid={!!error || undefined}
                className={t.input}
              />
              <button
                type="button"
                onClick={addEmails}
                className={clsx("shrink-0 rounded-xl border px-3.5 text-[12.5px] font-medium", t.box, t.text, t.boxHover)}
              >
                Add
              </button>
            </div>
            {error && <p className="mt-1.5 text-[12px] text-ember">{error}</p>}
            {value.invitees.length ? (
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {value.invitees.map((email) => (
                  <li key={email} className={clsx("inline-flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-[12px]", t.box, t.soft)}>
                    {email}
                    <button
                      type="button"
                      onClick={() => set({ invitees: value.invitees.filter((x) => x !== email) })}
                      aria-label={`Remove ${email}`}
                      className="flex size-6 items-center justify-center rounded-full hover:text-ember"
                    >
                      <IconX size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={clsx("mt-1.5 text-[11.5px]", t.faint)}>Add at least one email, or the link opens for nobody.</p>
            )}
          </div>
        )}
      </div>

      <div className={clsx("divide-y rounded-xl border px-3.5 py-1", tone === "dark" ? "divide-white/8 border-white/10" : "divide-line border-line")}>
        <div className="py-2.5">
          <ToneToggle
            tone={tone}
            label="Ask for a decision"
            hint="They can choose an option, approve it or ask for changes, and comment."
            checked={value.review}
            onChange={(review) => set({ review })}
          />
        </div>
        <div className="py-2.5">
          <ToneToggle
            tone={tone}
            label="Show the original photo"
            hint="A before & after slider, so the change is obvious."
            checked={value.showOriginal}
            onChange={(showOriginal) => set({ showOriginal })}
          />
        </div>
        <div className="py-2.5">
          <ToneToggle
            tone={tone}
            label="Allow downloads"
            hint={trial ? "HD JPG with the trial watermark." : "An HD JPG of each option."}
            checked={value.allowDownload}
            onChange={(allowDownload) => set({ allowDownload })}
          />
        </div>
      </div>

      <div>
        <p className={clsx("mb-2", t.label)}>Link stays open for</p>
        <ToneChips tone={tone} label="Link stays open for" options={expiryOptions} value={value.expiry} onChange={(expiry) => set({ expiry })} />
      </div>
    </div>
  );
}

/** The link in a read-only field with a Copy button. */
export function CopyLink({ url, tone = "dark" }: { url: string; tone?: Tone }) {
  const t = tones[tone];
  const id = useId();
  const [copied, setCopied] = useState<"yes" | "no" | null>(null);
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Review link
      </label>
      <div className={clsx("flex items-center gap-1 rounded-xl border p-1 pl-3.5", t.box)}>
        <input
          id={id}
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className={clsx(
            "min-w-0 flex-1 truncate rounded-none border-0 bg-transparent p-0 text-[13px] focus:shadow-none focus:outline-none",
            t.text
          )}
        />
        <button
          type="button"
          onClick={async () => {
            const ok = await copyText(url);
            setCopied(ok ? "yes" : "no");
            window.setTimeout(() => setCopied(null), 2200);
          }}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-ember px-3.5 font-display text-[12px] font-medium text-white transition-colors duration-200 hover:bg-ember-soft"
        >
          {copied === "yes" ? <IconCheckBold size={13} /> : <IconCopy size={13} />}
          {copied === "yes" ? "Copied" : "Copy"}
        </button>
      </div>
      <p aria-live="polite" className={clsx("mt-1.5 min-h-4 text-[11.5px]", copied === "no" ? "text-ember" : t.faint)}>
        {copied === "no" ? "Your browser would not copy it. Select the link and copy it yourself." : ""}
      </p>
    </div>
  );
}

/** Where a link stands: not opened, waiting, approved, changes requested, ended… */
export function ShareStatusBadge({ status, tone = "light" }: { status: ShareStatus; tone?: Tone }) {
  const colour =
    tone === "dark"
      ? status === "approved" || status === "changes"
        ? "bg-ember/15 text-ember-soft"
        : "bg-white/8 text-cream/70"
      : status === "approved" || status === "handed-off"
        ? "bg-navy text-white"
        : status === "changes"
          ? "bg-ember/12 text-ember"
          : status === "expired" || status === "revoked"
            ? "bg-line text-muted"
            : "bg-navy/8 text-navy";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase",
        colour
      )}
    >
      {(status === "changes" || status === "viewed") && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {shareStatusLabels[status]}
    </span>
  );
}

export type ExportStep = { id: string; label: string; state: "todo" | "active" | "done" | "failed" };

/** An export's steps with a progress bar: checked off one by one. */
export function ExportSteps({ steps, tone = "dark" }: { steps: ExportStep[]; tone?: Tone }) {
  const t = tones[tone];
  const done = steps.filter((s) => s.state === "done").length;
  return (
    <div>
      <div
        className={clsx("h-1 overflow-hidden rounded-full", tone === "dark" ? "bg-white/8" : "bg-line")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={done}
        aria-label="Export progress"
      >
        <div
          className="h-full rounded-full bg-ember transition-[width] duration-300 ease-out-soft"
          style={{ width: `${(done / Math.max(1, steps.length)) * 100}%` }}
        />
      </div>
      <ol className="mt-4 space-y-2.5" aria-live="polite">
        {steps.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <span
              aria-hidden
              className={clsx(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                s.state === "done"
                  ? tone === "dark"
                    ? "bg-white/12 text-white"
                    : "bg-navy/8 text-navy"
                  : s.state === "failed"
                    ? "bg-ember/18 text-ember"
                    : s.state === "active"
                      ? "text-ember"
                      : t.faint
              )}
            >
              {s.state === "done" ? (
                <IconCheckBold size={12} />
              ) : s.state === "failed" ? (
                <IconXBold size={12} />
              ) : s.state === "active" ? (
                <IconSpinnerGap size={16} className="motion-safe:animate-spin" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
            <span
              className={clsx(
                "text-[13px]",
                s.state === "todo" ? t.faint : s.state === "failed" ? "text-ember" : s.state === "active" ? t.text : t.soft
              )}
            >
              {s.label}
              <span className="sr-only">
                {s.state === "done" ? ", done" : s.state === "active" ? ", in progress" : s.state === "failed" ? ", failed" : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
