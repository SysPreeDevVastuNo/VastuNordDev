"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { appButtonPrimary } from "@/components/app/AppButton";
import AppSection from "@/components/app/AppSection";
import { IconDotsThreeVertical, IconPushPinFill } from "@/components/app/AppIcons";
import CreateProjectForm from "@/components/app/CreateProjectForm";
import EmptyState from "@/components/app/EmptyState";
import FilterChip from "@/components/app/FilterChip";
import ProjectActions from "@/components/app/ProjectActions";
import ScreenCode from "@/components/app/ScreenCode";
import SearchField from "@/components/app/SearchField";
import Sheet from "@/components/app/Sheet";
import SortMenu from "@/components/app/SortMenu";
import { inlineLabel, updatedThisWeek, type Project } from "@/lib/mock/entities";
import { projectFileCount, useStudio } from "@/lib/mock/store";

const views = [
  { id: "active", tab: "Active", heading: "Active projects" },
  { id: "archived", tab: "Archived", heading: "Archived" },
  { id: "deleted", tab: "Recently deleted", heading: "Recently deleted" },
] as const;
export type ProjectView = (typeof views)[number]["id"];
type View = ProjectView;

const sorts = {
  updated: { label: "Recently Updated", compare: (a: Project, b: Project) => b.lastUpdatedAt - a.lastUpdatedAt },
  name: { label: "Name", compare: (a: Project, b: Project) => a.name.localeCompare(b.name) },
  created: { label: "Date Created", compare: (a: Project, b: Project) => b.createdAtMs - a.createdAtMs },
  files: { label: "File Count", compare: (a: Project, b: Project) => projectFileCount(b.id) - projectFileCount(a.id) },
  pinned: { label: "Pinned First", compare: (a: Project, b: Project) => Number(b.pinned) - Number(a.pinned) },
};
type SortId = keyof typeof sorts;
const sortOptions = (Object.keys(sorts) as SortId[]).map((id) => ({ value: id, label: sorts[id].label }));

type Filter = { id: string; label: string; test: (p: Project) => boolean };

// The quick filters a tab offers, built from what its projects actually carry.
function filtersFor(projects: Project[]): Filter[] {
  const filters: Filter[] = [];
  if (projects.some((p) => p.pinned)) filters.push({ id: "pinned", label: "Pinned", test: (p) => p.pinned });
  filters.push({ id: "week", label: "Updated this week", test: updatedThisWeek });
  const labels = new Map(projects.flatMap((p) => p.labels.map((l) => [l.id, l.name] as const)));
  labels.forEach((name, id) => filters.push({ id: `label:${id}`, label: name, test: (p) => p.labels.some((l) => l.id === id) }));
  new Set(projects.flatMap((p) => p.tags)).forEach((tag) =>
    filters.push({ id: `tag:${tag}`, label: `#${tag}`, test: (p) => p.tags.includes(tag) })
  );
  return filters;
}

function matchesQuery(p: Project, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.name, p.description ?? "", ...p.labels.map((l) => l.name), ...p.tags].some((s) => s.toLowerCase().includes(q));
}

function ProjectCard({ project }: { project: Project }) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const files = projectFileCount(project.id);
  const cardClass =
    "flex h-full flex-col rounded-card border border-line bg-white p-4 text-left transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30";
  const body = (
    <>
      <div className="flex items-start gap-2 pr-10">
        <h3 className="min-w-0 flex-1 font-display text-[15px] leading-snug font-medium text-navy">{project.name}</h3>
        {project.pinned && (
          <>
            <IconPushPinFill size={14} className="mt-0.5 shrink-0 text-ember" />
            <span className="sr-only">Pinned</span>
          </>
        )}
      </div>
      {project.description && <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-body">{project.description}</p>}
      {project.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.labels.map((label) => (
            <span
              key={label.id}
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <p className="mt-auto pt-4 text-xs text-muted">
        {project.status === "deleted"
          ? `Deleted ${inlineLabel(project.deletedAt ?? "")} · ${project.retentionDaysLeft} days left to restore`
          : `${files} ${files === 1 ? "file" : "files"} · Updated ${inlineLabel(project.lastUpdated)}`}
      </p>
    </>
  );

  return (
    <div className="relative">
      {/* Archived and deleted projects don't open; clicking one opens its actions to restore it. */}
      {project.status === "active" ? (
        <Link href={`/app/projects/${project.id}`} className={cardClass}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={() => setActionsOpen(true)} className={clsx(cardClass, "w-full")}>
          {body}
        </button>
      )}
      <button
        type="button"
        aria-label={`Actions for ${project.name}`}
        aria-haspopup="dialog"
        onClick={() => setActionsOpen(true)}
        className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-shell"
      >
        <IconDotsThreeVertical size={16} />
      </button>
      <ProjectActions project={project} open={actionsOpen} onClose={() => setActionsOpen(false)} />
    </div>
  );
}

// C-08.02 — the project collection: status tabs, search, sort and quick filters.
export default function ProjectCollection({ initialView = "active" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("updated");
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const { projects } = useStudio();
  const inView = projects.filter((p) => p.status === view);
  const filters = filtersFor(inView);
  const shown = inView
    .filter((p) => matchesQuery(p, query) && filters.every((f) => !selected.includes(f.id) || f.test(p)))
    .sort(sorts[sort].compare);
  const heading = views.find((v) => v.id === view)!.heading;

  const switchView = (next: View) => {
    setView(next);
    setSelected([]);
  };
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="C-08.02" state={`Project collection · ${view}`} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold text-navy">Projects</h1>
            <p className="mt-2 max-w-lg text-[15px] leading-7 text-body">
              Optional groups of files. Nothing here is required to keep working.
            </p>
          </div>
          <button type="button" onClick={() => setCreating(true)} className={appButtonPrimary}>
            Create project
          </button>
          <Sheet open={creating} onClose={() => setCreating(false)} maxWidth="28rem">
            <CreateProjectForm
              onCancel={() => setCreating(false)}
              onClose={() => setCreating(false)}
              onCreated={() => {
                setCreating(false);
                switchView("active");
              }}
            />
          </Sheet>
        </div>
        <div className="mt-6 flex gap-1 rounded-control border border-line bg-shell p-1" role="tablist" aria-label="Project status">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => switchView(v.id)}
              className={clsx(
                "flex-1 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors duration-200",
                view === v.id ? "bg-white text-navy shadow-[0_1px_4px_rgba(1,41,58,0.12)]" : "text-muted hover:text-navy"
              )}
            >
              {v.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="px-5 sm:px-0">
          <div className="flex items-center gap-2">
            <SearchField label="Search name, description, labels, tags" value={query} onChange={setQuery} compact />
            <SortMenu options={sortOptions} value={sort} onChange={setSort} />
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <FilterChip key={f.id} pressed={selected.includes(f.id)} onClick={() => toggle(f.id)}>
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {shown.length > 0 ? (
        <AppSection title={heading} count={shown.length} className="mt-9">
          <div className="grid gap-3 px-5 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
            {shown.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </AppSection>
      ) : (
        <div className="mt-6 px-5 sm:px-0">
          <ScreenCode code="C-08.03" state="No results" />
          <EmptyState title="No matching projects" body="Try a different name, label or tag.">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelected([]);
              }}
              className={appButtonPrimary}
            >
              Clear search
            </button>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
