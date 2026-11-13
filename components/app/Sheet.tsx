"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { IconInfo, IconX } from "@/components/app/AppIcons";
import ScreenCode from "@/components/app/ScreenCode";

// Action sheet: rises from the bottom on phones, sits centred as a dialog from
// lg up. Portalled to <body> so a transformed card can't trap its fixed layout.
export default function Sheet({
  open,
  onClose,
  maxWidth = "26rem",
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  // Held in a ref so a parent's inline onClose doesn't re-run the effect (and steal focus) each render.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    const restore = document.activeElement as HTMLElement | null;
    // The page behind stays put while the sheet is open.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      restore?.focus();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-navy-deep/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={{ maxWidth }}
        // app-shell: portalled outside the Studio layout, so it opts back into the Studio heading style.
        className="app-shell fixed inset-x-0 bottom-0 z-50 flex max-h-[85svh] flex-col rounded-t-card bg-white outline-none lg:inset-0 lg:m-auto lg:h-fit lg:max-h-[85vh] lg:rounded-card"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line lg:hidden" />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

export function SheetClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className="-mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-shell hover:text-navy"
    >
      <IconX size={17} />
    </button>
  );
}

/** Title row: an h2 with the close button at its end. */
export function SheetTitle({ id, title, onClose }: { id?: string; title: string; onClose: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 id={id} className="font-display text-lg font-semibold text-navy">
        {title}
      </h2>
      <SheetClose onClose={onClose} />
    </div>
  );
}

export type SheetMenuEntry = {
  label: string;
  Icon: (props: { size?: number; className?: string }) => React.ReactNode;
  onSelect: () => void;
  danger?: boolean;
};

export function SheetMenu({ items }: { items: SheetMenuEntry[] }) {
  return (
    <ul className="-mx-1">
      {items.map(({ label, Icon, onSelect, danger }) => (
        <li key={label}>
          <button
            type="button"
            onClick={onSelect}
            className={clsx(
              "flex w-full items-center gap-3.5 rounded-control px-4 py-3.5 text-left transition-colors duration-200 hover:bg-shell",
              danger ? "text-ember" : "text-navy"
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span className="font-display text-[14px] font-medium">{label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Confirm / cancel pair; the confirm button sits on the right from sm up. */
export function SheetActions({
  confirm,
  confirmClass = appButtonPrimary,
  onConfirm,
  onCancel,
}: {
  confirm: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
      <button type="button" onClick={onConfirm} className={clsx(confirmClass, "flex-1")}>
        {confirm}
      </button>
      <button type="button" onClick={onCancel} className={clsx(appButtonOutline, "flex-1")}>
        Cancel
      </button>
    </div>
  );
}

/** Icon, question and consequences above a confirm / cancel pair. */
export function SheetConfirm({
  icon,
  tone = "navy",
  title,
  body,
  children,
  ...actions
}: {
  icon: React.ReactNode;
  tone?: "navy" | "ember";
  title: string;
  body?: React.ReactNode;
  children?: React.ReactNode;
} & React.ComponentProps<typeof SheetActions>) {
  return (
    <>
      <span
        className={clsx(
          "flex size-11 items-center justify-center rounded-full",
          tone === "ember" ? "bg-ember/12 text-ember" : "bg-navy/8 text-navy"
        )}
      >
        {icon}
      </span>
      <h2 id="confirm-title" className="mt-4 font-display text-lg font-semibold text-navy">
        {title}
      </h2>
      {body && <p className="mt-2 text-[13px] leading-6 text-body">{body}</p>}
      {children && <div className="mt-4">{children}</div>}
      <SheetActions {...actions} />
    </>
  );
}

/** Closing step of a flow: what changed, and a Done button. */
export function SheetDone({
  code,
  state,
  title,
  message,
  onDone,
}: {
  code: string;
  state: string;
  title: string;
  message: string;
  onDone: () => void;
}) {
  return (
    <>
      <ScreenCode code={code} state={state} />
      <div role="status" className="rounded-control border border-navy/15 bg-navy/[0.04] p-4">
        <div className="flex gap-3">
          <IconInfo className="mt-px shrink-0 text-navy" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-medium text-navy">{title}</p>
            <div className="mt-1.5 text-[13px] leading-6 text-body">{message}</div>
          </div>
        </div>
      </div>
      <button type="button" onClick={onDone} className={clsx(appButtonPrimary, "mt-6 w-full")}>
        Done
      </button>
    </>
  );
}

/** Label / value rows, as in File information and the delete summary. */
export function SheetFacts({ rows, dense = false }: { rows: [string, React.ReactNode][]; dense?: boolean }) {
  return (
    <dl className="divide-y divide-line rounded-control border border-line">
      {rows.map(([term, value]) => (
        <div key={term} className={clsx("flex items-center justify-between gap-4 px-4", dense ? "py-2.5" : "py-3")}>
          <dt className="text-[13px] text-muted">{term}</dt>
          <dd className={typeof value === "string" ? "text-right text-[13px] font-medium text-navy" : undefined}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
