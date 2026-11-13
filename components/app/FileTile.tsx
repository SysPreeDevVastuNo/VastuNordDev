"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconDotsThreeVertical } from "@/components/app/AppIcons";
import FileActions from "@/components/app/FileActions";
import { FileStatusBadge, FileToolLine } from "@/components/app/FileMeta";
import { fileThumbnail, inlineLabel, type StudioFile } from "@/lib/mock/entities";
import { projectById } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";

// File card with thumbnail, status, tool line and a Continue bar (Files, project dashboard).
// `href` overrides where it opens; `showProject` adds the project name to the edit line.
export default function FileTile({
  file,
  href = `/app/files/${file.id}`,
  showProject = true,
}: {
  file: StudioFile;
  href?: string;
  showProject?: boolean;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const tool = toolById(file.toolId);
  const project = projectById(file.projectId);
  const opens = file.status === "active" || file.status === "draft";
  const edited = `Edited ${inlineLabel(file.lastEdited)}`;
  const titleClass =
    "text-left after:absolute after:inset-0 after:z-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-ember";

  return (
    <div className="group relative flex h-full w-full flex-col rounded-card border border-navy/12 bg-shell p-2.5 transition-[border-color,transform,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30 hover:bg-white">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-cream">
        <Image
          src={fileThumbnail(file)}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        <span className="absolute top-2.5 left-2.5">
          <FileStatusBadge file={file} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1.5 pt-3.5 pb-1">
        <FileToolLine file={file} />
        <h3 className="font-display text-[15px] leading-snug font-medium text-navy">
          {/* Archived and deleted files don't open; their title opens the actions menu instead. */}
          {opens ? (
            <Link href={href} aria-label={`Continue ${file.name}, ${tool?.name}`} className={titleClass}>
              {file.name}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setActionsOpen(true)}
              aria-label={`${file.name}, ${tool?.name}`}
              className={titleClass}
            >
              {file.name}
            </button>
          )}
        </h3>
        <p className="truncate text-xs text-muted">
          {file.status === "deleted"
            ? `${file.retentionDaysLeft} days left to restore`
            : showProject
              ? `${edited} · ${project?.name ?? "Independent"}`
              : edited}
        </p>
      </div>
      <span className="pointer-events-none mt-3 flex items-center justify-between rounded-control bg-navy px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 ease-out-soft group-hover:bg-navy-ink">
        Continue
        <IconArrowRight size={14} className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
      </span>
      <button
        type="button"
        aria-label={`File actions for ${file.name}`}
        aria-haspopup="dialog"
        onClick={() => setActionsOpen(true)}
        className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors duration-200 hover:bg-white"
      >
        <IconDotsThreeVertical size={17} />
      </button>
      <FileActions file={file} start={actionsOpen ? "menu" : null} onClose={() => setActionsOpen(false)} />
    </div>
  );
}
