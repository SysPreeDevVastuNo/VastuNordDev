"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import {
  IconArrowRight,
  IconCaretDown,
  IconChatCircle,
  IconDownloadSimple,
  IconEye,
  IconFunnel,
} from "@/components/app/AppIcons";
import EmptyState from "@/components/app/EmptyState";
import FilterChip from "@/components/app/FilterChip";
import ScreenCode from "@/components/app/ScreenCode";
import { daysUntil, fileById, mockVersions, projectById, timeAgo, versionImage } from "@/lib/mock/entities";
import { mockActivity, mockDeliveries, mockShares, type ActivityEntry, type Share } from "@/lib/mock/delivery";
import { mockUser } from "@/lib/mock/user";

const tabs = [
  { id: "links", code: "E-S", label: "Review links", count: mockShares.length },
  { id: "downloads", code: "E-X", label: "Downloads", count: mockDeliveries.length },
  { id: "activity", code: "E-AT", label: "Activity", count: mockActivity.length },
] as const;
type Tab = (typeof tabs)[number]["id"];

type LinkState = "waiting" | "changes" | "approved" | "ended";

const linkFilters: { id: LinkState | null; label: string }[] = [
  { id: null, label: "All" },
  { id: "waiting", label: "Waiting" },
  { id: "changes", label: "Changes requested" },
  { id: "approved", label: "Approved" },
  { id: "ended", label: "Ended" },
];

// A link that ran out before anyone decided counts as ended.
const linkState = (share: Share): LinkState =>
  share.review.status === "waiting" && daysUntil(share.expiresAt) < 0 ? "ended" : share.review.status;

const lastTouched = (share: Share) =>
  Math.max(share.lastViewedAt, share.review.status === "waiting" ? 0 : share.review.decidedAt);

const optionLetter = (index: number) => String.fromCharCode(65 + index);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const versionNumber = (id: string) => mockVersions.find((v) => v.id === id)?.number;

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase";

function LinkBadge({ state }: { state: LinkState }) {
  if (state === "approved") return <span className={clsx(badgeBase, "bg-navy text-white")}>Approved</span>;
  if (state === "ended") return <span className={clsx(badgeBase, "bg-line text-muted")}>Expired</span>;
  return (
    <span className={clsx(badgeBase, state === "changes" ? "bg-ember/12 text-ember" : "bg-navy/8 text-navy")}>
      <span className="size-1.5 rounded-full bg-current" />
      {state === "changes" ? "Changes requested" : "Waiting"}
    </span>
  );
}

// Up to four option thumbnails; one or two fill the square on their own.
function OptionMosaic({ share }: { share: Share }) {
  const images = share.items.slice(0, 4).map((item) => versionImage(item.versionId) ?? "");
  const single = images.length === 1;
  return (
    <div
      className={clsx(
        "grid size-20 shrink-0 gap-0.5 overflow-hidden rounded-xl bg-line sm:size-24",
        single ? "grid-cols-1 grid-rows-1" : "grid-cols-2 grid-rows-2"
      )}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt=""
          width={96}
          height={96}
          className={clsx(
            "size-full min-h-0 object-cover",
            (images.length === 2 || (images.length === 3 && i === 0)) && "row-span-2"
          )}
        />
      ))}
    </div>
  );
}

function ShareCard({ share }: { share: Share }) {
  const state = linkState(share);
  const days = daysUntil(share.expiresAt);
  const fileName = fileById(share.items[0].fileId)?.name;
  const { review } = share;

  return (
    <Link
      href={`/app/shared/${share.id}`}
      className="group flex h-full gap-4 rounded-card border border-line bg-white p-3 pr-4 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30"
    >
      <OptionMosaic share={share} />
      <div className="min-w-0 flex-1 py-0.5">
        <LinkBadge state={state} />
        <p className="mt-1.5 line-clamp-2 font-display text-[15px] leading-snug font-medium text-navy">{share.title}</p>
        <p className="mt-0.5 truncate text-[12.5px] text-muted">
          {fileName}
          {share.items.length > 1 && ` · ${share.items.length} options`}
        </p>
        {review.status !== "waiting" && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-body">
            <span className="font-medium text-navy">{review.reviewer}</span>
            {review.status === "approved" ? ` approved option ${optionLetter(review.chosen)}` : " asked for changes"}
            {review.note && `: “${review.note}”`}
          </p>
        )}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <IconEye />
            {share.views} {share.views === 1 ? "view" : "views"}
          </span>
          {share.comments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <IconChatCircle />
              {share.comments.length}
            </span>
          )}
          <span>{days < 0 ? `Expired ${plural(-days, "day")} ago` : `Expires in ${plural(days, "day")}`}</span>
        </p>
      </div>
    </Link>
  );
}

function ReviewLinks() {
  const [filter, setFilter] = useState<LinkState | null>(null);
  const shown = mockShares
    .filter((s) => !filter || linkState(s) === filter)
    .sort((a, b) => lastTouched(b) - lastTouched(a));

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label="Filter by status">
        {linkFilters.map((f) => (
          <FilterChip key={f.label} pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </FilterChip>
        ))}
      </div>
      {shown.length > 0 ? (
        <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 px-5 sm:px-0 lg:grid-cols-2">
          {shown.map((share) => (
            <li key={share.id}>
              <ShareCard share={share} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 px-5 sm:px-0">
          <EmptyState title="No links here" icon={<IconFunnel />}>
            <button type="button" onClick={() => setFilter(null)} className={appButtonPrimary}>
              Show all
            </button>
          </EmptyState>
        </div>
      )}
    </div>
  );
}

function Downloads() {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 px-5 sm:px-0">
      {mockDeliveries.map((d) => {
        const file = fileById(d.fileId);
        return (
          <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-white p-3 sm:flex-nowrap">
            <Image
              src={versionImage(d.versionId) ?? ""}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14px] font-medium text-navy">{d.filename}</p>
              <p className="mt-0.5 truncate text-[12.5px] text-muted">
                {d.format} · {d.size} · {(d.bytes / 1024 / 1024).toFixed(1)} MB · {file?.name}, v{versionNumber(d.versionId)} ·{" "}
                {timeAgo(d.createdAt)}
              </p>
              {d.events.length > 0 && (
                <p className="mt-1 truncate text-[12px] text-faint">{d.events.map((e) => e.note).join(" → ")}</p>
              )}
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button type="button" className={clsx(appButtonOutline, "flex-1 px-3.5 py-2.5 sm:flex-none")}>
                <IconDownloadSimple />
                Download again
              </button>
              <Link
                href={`/app/files/${d.fileId}`}
                aria-label={`Open ${file?.name}`}
                className="flex size-11 shrink-0 items-center justify-center rounded-control text-muted transition-colors duration-200 hover:bg-shell hover:text-navy"
              >
                <IconArrowRight size={16} />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const actionLabels: Record<ActivityEntry["action"], string> = {
  export: "Export",
  review: "Decision",
  "share-created": "Link created",
};

function ActivityDetails({ entry }: { entry: ActivityEntry }) {
  const rows: [string, string][] = [
    ["User", entry.userId === "user-mira" ? mockUser.name : entry.userId],
    ["Project", projectById(entry.projectId)?.name ?? "—"],
    ["File", fileById(entry.fileId)?.name ?? "—"],
    ["Version", `Version ${versionNumber(entry.versionId)}`],
    ["Export type", entry.exportType ?? "—"],
    ["Share settings", entry.shareSettings ?? "—"],
    // Only rendered after a click, so the viewer's locale and time zone are safe to use.
    ["Time", new Date(entry.at).toLocaleString("en-GB")],
    ["Status", entry.status === "ok" ? "Done" : "Failed"],
    ["Recovery", entry.recovery ?? "None needed"],
  ];
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 bg-shell px-5 pt-1 pb-4 pl-10 text-[12.5px]">
      {rows.map(([term, value]) => (
        <div key={term} className="contents">
          <dt className="text-muted">{term}</dt>
          <dd className="break-words text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Activity() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ol className="divide-y divide-line overflow-hidden border-y border-line bg-white sm:rounded-card sm:border">
      {mockActivity.map((entry) => {
        const expanded = open === entry.id;
        return (
          <li key={entry.id}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : entry.id)}
              className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-shell"
            >
              <span className={clsx("mt-1.5 size-2 shrink-0 rounded-full", entry.status === "ok" ? "bg-navy" : "bg-ember")} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] leading-6 text-ink">{entry.detail}</span>
                <span className="mt-0.5 block text-[12px] text-muted">
                  {actionLabels[entry.action]} · {timeAgo(entry.at)}
                </span>
              </span>
              <IconCaretDown
                className={clsx("mt-1.5 shrink-0 text-faint transition-transform duration-200", expanded && "rotate-180")}
              />
            </button>
            {expanded && <ActivityDetails entry={entry} />}
          </li>
        );
      })}
    </ol>
  );
}

// E-S — review links sent out, files downloaded, and the log of both.
export default function SharedHub() {
  const [tab, setTab] = useState<Tab>("links");

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code={tabs.find((t) => t.id === tab)!.code} state="Shared" />
        <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold text-navy">Shared</h1>
        <p className="mt-2 max-w-lg text-[15px] leading-7 text-body">
          Links you have sent and what people said, every file you downloaded, and a record of all of it.
        </p>
        <div role="tablist" aria-label="Shared" className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {tabs.map((t) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.id)}
                className={clsx(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] transition-colors duration-200",
                  selected ? "border-navy bg-navy text-white" : "border-line bg-white text-body hover:border-navy/40 hover:text-navy"
                )}
              >
                {t.label}
                <span className={clsx("text-[12px]", selected ? "text-white/60" : "text-faint")}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {tab === "links" && <ReviewLinks />}
        {tab === "downloads" && <Downloads />}
        {tab === "activity" && <Activity />}
      </div>
    </div>
  );
}
