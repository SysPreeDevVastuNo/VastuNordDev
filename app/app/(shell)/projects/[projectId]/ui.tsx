"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import clsx from "clsx";
import { IconWarning } from "@/components/app/AppIcons";

// Pieces shared by the project dashboard and its dialogs.

/** "1 file", "3 files". */
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Simulated service time, as in the prototype: each wait is a fraction of this.
const LATENCY_MS = 1100;

/** Timers that stand in for service calls; all are cleared on unmount. Returns a cancel function. */
export function useWait() {
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  return useCallback((fn: () => void, factor = 1) => {
    const t = window.setTimeout(fn, Math.round(LATENCY_MS * factor));
    timers.current.push(t);
    return () => window.clearTimeout(t);
  }, []);
}

/** Labelled text input with an optional hint or error. */
export function TextField({
  label,
  hint,
  error,
  value,
  onChange,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const described = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error || undefined}
          aria-describedby={described}
          className={clsx(
            "w-full rounded-control border bg-white px-4 py-3.5 text-base text-ink transition-colors duration-200 ease-out-soft placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]",
            error ? "border-ember focus:border-ember" : "border-line focus:border-navy/40"
          )}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] leading-5 text-ember">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] leading-5 text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** One choice in a radio-style list (duplication mode, file handling). */
export function ChoiceCard({
  selected,
  danger = false,
  title,
  body,
  onSelect,
}: {
  selected: boolean;
  danger?: boolean;
  title: string;
  body: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "flex w-full items-start gap-3 rounded-control border p-3.5 text-left transition-colors duration-200",
        selected ? (danger ? "border-ember bg-ember/5" : "border-navy bg-navy/4") : "border-line hover:border-navy/25"
      )}
    >
      <span
        className={clsx(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-ember" : "border-line"
        )}
      >
        {selected && <span className="size-2 rounded-full bg-ember" />}
      </span>
      <span>
        <span className={clsx("block text-[13px] font-medium", danger ? "text-ember" : "text-navy")}>{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{body}</span>
      </span>
    </button>
  );
}

/** Ember "that did not work" card for a screen that ends (invalid or unavailable project). */
export function ErrorState({ title, body, children }: { title: string; body?: string; children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-card border border-ember/30 bg-ember/[0.05] px-6 py-14 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-white text-ember">
        <IconWarning size={20} />
      </span>
      <p className="mt-4 font-display text-base font-medium text-navy">{title}</p>
      {body && <p className="mt-2 max-w-xs text-[13px] leading-6 text-body">{body}</p>}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">{children}</div>
    </div>
  );
}
