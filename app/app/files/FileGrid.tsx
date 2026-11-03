"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import AppButton, { appButtonPrimary } from "@/components/app/AppButton";
import { IconArrowRight, IconDotsThreeVertical, IconPlus } from "@/components/app/AppIcons";
import { categoryIcons } from "@/components/app/categoryIcons";
import EmptyState from "@/components/app/EmptyState";
import { FileStatusBadge, FileToolLine } from "@/components/app/FileMeta";
import FilterChip from "@/components/app/FilterChip";
import ScreenCode from "@/components/app/ScreenCode";
import { fileViews, type FileView } from "@/app/app/files/views";
import SearchField from "@/components/app/SearchField";
import { fileThumbnail, inlineLabel, mockFiles, mockProjects, projectById, type StudioFile } from "@/lib/mock/entities";
import { toolById, toolCategories, type ToolCategoryId } from "@/lib/mock/tools";

const inView = (file: StudioFile, view: FileView) =>
  view === "active" ? file.status === "active" || file.status === "draft" : file.status === view;

const toolName = (f: StudioFile) => toolById(f.toolId)?.name ?? "";

// No "last opened" timestamp exists yet, so "Recently opened" orders by last edit too.
const sorts = {
  edited: { label: "Recently edited", compare: (a: StudioFile, b: StudioFile) => b.lastEditedAt - a.lastEditedAt },
  opened: { label: "Recently opened", compare: (a: StudioFile, b: StudioFile) => b.lastEditedAt - a.lastEditedAt },
  name: { label: "Name", compare: (a: StudioFile, b: StudioFile) => a.name.localeCompare(b.name) },
  tool: { label: "Tool", compare: (a: StudioFile, b: StudioFile) => toolName(a).localeCompare(toolName(b)) },
};
type SortId = keyof typeof sorts;

const NO_PROJECT = "none";

function matchesQuery(file: StudioFile, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [file.name, toolName(file), projectById(file.projectId)?.name ?? "", ...file.tags].some((s) =>
    s.toLowerCase().includes(q)
  );
}

function FileTile({ file }: { file: StudioFile }) {
  const tool = toolById(file.toolId);
  const project = projectById(file.projectId);
  const opens = file.status === "active" || file.status === "draft";
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
          {/* Archived and deleted files don't open; restoring happens from the actions menu. */}
          {opens ? (
            <Link href={`/app/files/${file.id}`} aria-label={`Continue ${file.name}, ${tool?.name}`} className={titleClass}>
              {file.name}
            </Link>
          ) : (
            <button type="button" aria-label={`${file.name}, ${tool?.name}`} className={titleClass}>
              {file.name}
            </button>
          )}
        </h3>
        <p className="truncate text-xs text-muted">
          {file.status === "deleted"
            ? `${file.retentionDaysLeft} days left to restore`
            : `Edited ${inlineLabel(file.lastEdited)} · ${project?.name ?? "Independent"}`}
        </p>
      </div>
      <span className="pointer-events-none mt-3 flex items-center justify-between rounded-control bg-navy px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 ease-out-soft group-hover:bg-navy-ink">
        Continue
        <IconArrowRight size={14} className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
      </span>
      <button
        type="button"
        aria-label={`File actions for ${file.name}`}
        className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors duration-200 hover:bg-white"
      >
        <IconDotsThreeVertical size={17} />
      </button>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex min-h-12 items-center rounded-control border border-line bg-white transition-colors duration-200 focus-within:border-navy/40 sm:min-w-44">
      <span className="sr-only">{label}</span>
      {/* The border/radius resets undo the marketing form styles in globals.css. */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full cursor-pointer appearance-none rounded-none border-0 bg-transparent py-3 pr-9 pl-4 text-[14px] text-ink focus:shadow-none focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 text-[10px] text-muted">▼</span>
    </label>
  );
}

// FL-02 — every file the user has made, by status, with search, project, tool and sort filters.
export default function FileGrid({ initialView }: { initialView: FileView }) {
  const [view, setView] = useState<FileView>(initialView);
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("");
  const [category, setCategory] = useState<ToolCategoryId | null>(null);
  const [sort, setSort] = useState<SortId>("edited");

  const shown = mockFiles
    .filter(
      (f) =>
        inView(f, view) &&
        matchesQuery(f, query) &&
        (!project || (project === NO_PROJECT ? !f.projectId : f.projectId === project)) &&
        (!category || toolById(f.toolId)?.category === category)
    )
    .sort(sorts[sort].compare);
  const filtering = query.trim() !== "" || project !== "" || category !== null;
  const noun = shown.length === 1 ? "file" : "files";

  const clearFilters = () => {
    setQuery("");
    setProject("");
    setCategory(null);
  };

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="FL-02" state={`Files · ${view}`} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold text-navy">Files</h1>
            <p className="mt-2 max-w-lg text-[15px] leading-7 text-body">
              Everything you have made. Each file opens in its own tool, exactly where you left it — in a project or not.
            </p>
          </div>
          <AppButton href="/app/library" className="hidden sm:inline-flex">
            <IconPlus />
            New file
          </AppButton>
        </div>

        <div role="tablist" aria-label="Which files" className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-line">
          {fileViews.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={clsx(
                "-mb-px min-h-11 shrink-0 border-b-2 px-3 font-display text-[13px] font-medium whitespace-nowrap transition-colors duration-200",
                view === v.id ? "border-ember text-navy" : "border-transparent text-muted hover:text-navy"
              )}
            >
              {v.tab}
              <span className="ml-1.5 text-[12px] font-normal text-faint">
                {mockFiles.filter((f) => inView(f, v.id)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchField label="Search files" placeholder="Search by name, tool, project or tag…" value={query} onChange={setQuery} className="flex-1" />
          <div className="grid grid-cols-2 gap-2.5 sm:flex">
            <Select
              label="Project"
              value={project}
              onChange={setProject}
              options={[
                { value: "", label: "Any project" },
                { value: NO_PROJECT, label: "Not in a project" },
                ...mockProjects.filter((p) => p.status === "active").map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
            <Select
              label="Sort"
              value={sort}
              onChange={(v) => setSort(v as SortId)}
              options={(Object.keys(sorts) as SortId[]).map((id) => ({ value: id, label: sorts[id].label }))}
            />
          </div>
        </div>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:flex-wrap sm:px-0">
        <FilterChip pressed={!category} onClick={() => setCategory(null)}>
          All tools
        </FilterChip>
        {toolCategories.map((c) => {
          const Icon = categoryIcons[c.id];
          const pressed = category === c.id;
          return (
            <FilterChip
              key={c.id}
              pressed={pressed}
              onClick={() => setCategory(pressed ? null : c.id)}
              icon={<Icon className={pressed ? "text-ember-soft" : "text-muted"} />}
            >
              {c.label}
            </FilterChip>
          );
        })}
      </div>

      <div className="mt-6 px-5 sm:px-0">
        {shown.length > 0 ? (
          <>
            <p className="mb-3 text-[13px] text-muted">
              {shown.length} {filtering ? `${noun} match` : noun}
              {view === "deleted" && " · restore any of them from their actions"}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((file) => (
                <li key={file.id}>
                  <FileTile file={file} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title="Nothing matches" body="No file in this view matches those filters.">
            <button type="button" onClick={clearFilters} className={appButtonPrimary}>
              Clear filters
            </button>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
