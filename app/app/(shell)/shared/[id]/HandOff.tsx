"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { appButtonNavy, appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { IconCheckBold, IconPaperPlaneRight } from "@/components/app/AppIcons";
import Notice from "@/components/app/Notice";
import Sheet, { SheetTitle } from "@/components/app/Sheet";
import { ExportSteps } from "@/components/app/ShareControls";
import { fileNameFor, optionLetter, type Share } from "@/lib/mock/delivery";
import type { ResolvedItem } from "@/lib/mock/resolve";
import { handOffShare } from "@/lib/mock/store";
import { useExport } from "@/lib/useExport";

type Final = "highres" | "png" | "jpg";

const finals: { id: Final; title: string; hint: string }[] = [
  { id: "highres", title: "High resolution", hint: "8K PNG, upscaled and checked. For print and final sign-off." },
  { id: "png", title: "4K PNG", hint: "Lossless, for presentations and screens." },
  { id: "jpg", title: "4K JPG", hint: "Smaller, for email and the web." },
];

// E-S3 — after approval, the final file is made, downloaded here, and put on
// the same review link for the client to download.
export default function HandOff({
  open,
  onClose,
  share,
  item,
}: {
  open: boolean;
  onClose: () => void;
  share: Share;
  item: ResolvedItem;
}) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="handoff-title" maxWidth="30rem">
      {open && <HandOffBody onClose={onClose} share={share} item={item} />}
    </Sheet>
  );
}

function HandOffBody({ onClose, share, item }: { onClose: () => void; share: Share; item: ResolvedItem }) {
  const exp = useExport();
  const [final, setFinal] = useState<Final>("highres");
  const { phase } = exp;
  const reviewer = share.review.status === "waiting" ? "" : share.review.reviewer;
  const chosen = share.review.status === "waiting" ? 0 : share.review.chosen;

  // Once the file is delivered, it goes on the link (once).
  const handed = useRef(false);
  useEffect(() => {
    if (phase.kind !== "delivered" || handed.current) return;
    handed.current = true;
    handOffShare(
      share.id,
      phase.deliveries.map((d) => d.id)
    );
  }, [phase, share.id]);

  const start = () =>
    void exp.start({
      kind: final,
      fileId: item.fileId,
      projectId: share.projectId,
      shareId: share.id,
      size: final === "highres" ? "8K" : "4K",
      compression: "best",
      layout: "result",
      watermarked: false,
      items: [
        {
          versionId: item.versionId,
          versionNumber: item.versionNumber,
          resultId: item.resultId,
          image: item.image,
          before: item.before,
          filename: `${fileNameFor(item.fileName, item.versionNumber, final === "highres" ? "8K" : "4K", "-final")}${final === "jpg" ? ".jpg" : ".png"}`,
        },
      ],
    });

  return (
    <>
      <SheetTitle id="handoff-title" title="Hand off final files" onClose={onClose} />
      <div className="flex items-center gap-3 rounded-control border border-line bg-shell p-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.image && <img src={item.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />}
        <div className="min-w-0">
          <p className="truncate font-display text-[14px] font-medium text-navy">
            {share.items.length > 1 ? `Option ${optionLetter(chosen)}` : share.title} · approved by {reviewer}
          </p>
          <p className="truncate text-[12.5px] text-muted">
            {item.fileName}, version {item.versionNumber}
          </p>
        </div>
      </div>

      {phase.kind === "idle" ? (
        <>
          <div role="radiogroup" aria-label="Final file" className="mt-5 grid gap-2">
            {finals.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={final === f.id}
                onClick={() => setFinal(f.id)}
                className={clsx(
                  "rounded-control border px-4 py-3 text-left transition-colors duration-200",
                  final === f.id ? "border-ember bg-ember/[0.05]" : "border-line hover:border-navy/30"
                )}
              >
                <span className="flex items-center gap-2 font-display text-[14px] font-medium text-navy">
                  {f.title}
                  {f.id === "highres" && (
                    <span className="rounded-full bg-navy/8 px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-navy uppercase">2 credits</span>
                  )}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-5 text-body">{f.hint}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-6 text-body">
            The file downloads here too, and appears on the review link for {reviewer} to download. No watermark.
          </p>
          <button type="button" onClick={start} disabled={!item.image} className={clsx(appButtonPrimary, "mt-5 w-full")}>
            <IconPaperPlaneRight />
            Prepare and hand off
          </button>
        </>
      ) : phase.kind === "running" ? (
        <div className="mt-6">
          <ExportSteps steps={exp.steps} tone="light" />
        </div>
      ) : phase.kind === "delivered" ? (
        <div className="mt-6">
          <Notice tone="success" title="Handed off">
            {phase.deliveries[0]?.filename} is on the link now. {reviewer} can download it from the page they approved on.
          </Notice>
          {phase.downloadBlocked && (
            <p className="mt-3 text-[13px] text-ember">
              Your browser blocked your own copy.{" "}
              <button type="button" onClick={exp.downloadAgain} className="font-medium underline underline-offset-2">
                Download again
              </button>
            </p>
          )}
          <button type="button" onClick={onClose} className={clsx(appButtonNavy, "mt-5 w-full")}>
            <IconCheckBold size={14} />
            Done
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <Notice tone="error" title="The file did not finish">
            Nothing was charged and nothing was sent to {reviewer}. Try again; it picks up where it stopped.
          </Notice>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={start} className={clsx(appButtonPrimary, "flex-1")}>
              Try again
            </button>
            <button type="button" onClick={exp.reset} className={clsx(appButtonOutline, "flex-1")}>
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
