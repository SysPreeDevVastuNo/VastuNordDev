"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppButton, { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import AppSection from "@/components/app/AppSection";
import {
  IconArrowCounterClockwise,
  IconDotsThreeVertical, IconPlus, IconSearch, IconShareNetwork, IconSparkle } from "@/components/app/AppIcons";
import EmptyState from "@/components/app/EmptyState";
import FileTile from "@/components/app/FileTile";
import Rail from "@/components/app/Rail";
import ScreenCode from "@/components/app/ScreenCode";
import SearchField from "@/components/app/SearchField";
import SortMenu from "@/components/app/SortMenu";
import { inlineLabel, type StudioFile } from "@/lib/mock/entities";
import { projectFileCount, useStudio } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";
import AddExistingFile from "@/app/app/(shell)/projects/[projectId]/AddExistingFile";
import DeleteProject from "@/app/app/(shell)/projects/[projectId]/DeleteProject";
import DuplicateProject from "@/app/app/(shell)/projects/[projectId]/DuplicateProject";
import ProjectSettings from "@/app/app/(shell)/projects/[projectId]/ProjectSettings";
import ShareForReview from "@/app/app/(shell)/projects/[projectId]/ShareForReview";
import { ErrorState, plural, useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

const toolName = (f: StudioFile) => toolById(f.toolId)?.name ?? "";

const sorts = {
  edited: { label: "Last edited", compare: (a: StudioFile, b: StudioFile) => b.lastEditedAt - a.lastEditedAt },
  name: { label: "Name (A–Z)", compare: (a: StudioFile, b: StudioFile) => a.name.localeCompare(b.name) },
  tool: { label: "Tool", compare: (a: StudioFile, b: StudioFile) => toolName(a).localeCompare(toolName(b)) },
};
type SortId = keyof typeof sorts;
const sortOptions = (Object.keys(sorts) as SortId[]).map((id) => ({ value: id, label: sorts[id].label }));

// Loading walks: project load → access check → its files.
const loadingCodes = ["C-06.02", "C-06.03", "C-06.04"];
type Phase = 0 | 1 | 2 | "unavailable" | "ready";
type Dialog = "settings" | "duplicate" | "delete" | "add" | "share" | null;

// C-06 — one project: its details, its files (search and sort), and the
// project's actions. Keyed on the project id by the page, so it reloads per project.
export default function ProjectDashboard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const wait = useWait();
  const { projects, files } = useStudio();
  const project = projects.find((p) => p.id === projectId);
  const [phase, setPhase] = useState<Phase>(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("edited");
  const [dialog, setDialog] = useState<Dialog>(null);
  const exists = !!project;
  const live = project?.status === "active";

  useEffect(() => {
    if (!exists) return;
    if (phase === 0) return wait(() => setPhase(live ? 1 : "unavailable"), 0.3);
    if (phase === 1) return wait(() => setPhase(2), 0.25);
    if (phase === 2) return wait(() => setPhase("ready"), 0.3);
  }, [phase, exists, live, wait]);

  if (!project) {
    return (
      <div className="px-5 py-6 sm:px-0">
        <ScreenCode code="C-06.01" state="Invalid project — flow ends" />
        <ErrorState title="That project link is not valid" body="It does not point at a project. Nothing else is affected.">
          <ProjectsButton label="Return to projects" />
          <AppButton href="/app" variant="outline">
            Home
          </AppButton>
        </ErrorState>
      </div>
    );
  }

  if (phase === "unavailable") {
    const body =
      project.status === "deleted"
        ? "It has been deleted — restore it from Projects → Recently deleted."
        : project.status === "archived"
          ? "It is archived — restore it from Projects → Archived. Its files are still accessible from Home."
          : "Your access to it was revoked.";
    return (
      <div className="px-5 py-6 sm:px-0">
        <ScreenCode code="C-06.02" state="Project unavailable — flow ends" />
        <ErrorState title={`“${project.name}” is unavailable`} body={body}>
          <ProjectsButton label="Go to projects" />
          <AppButton href="/app" variant="outline">
            Home
          </AppButton>
        </ErrorState>
      </div>
    );
  }

  if (phase !== "ready") {
    return (
      <div className="px-5 sm:px-0">
        <ScreenCode code={loadingCodes[phase]} state="Loading project" />
        <div className="h-8 w-48 animate-pulse rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded-lg bg-line/50" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
              <div className="aspect-4/3 w-full animate-pulse bg-line/70" />
              <div className="p-4">
                <div className="h-4 w-2/3 animate-pulse rounded-xl bg-line/70" />
                <div className="mt-2 h-3 w-1/3 animate-pulse rounded-xl bg-line/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const projectFiles = files
    .filter((f) => f.projectId === project.id && f.status !== "deleted")
    .sort((a, b) => b.lastEditedAt - a.lastEditedAt);
  const q = query.trim().toLowerCase();
  const shown = (q ? projectFiles.filter((f) => `${f.name} ${toolName(f)}`.toLowerCase().includes(q)) : projectFiles)
    .slice()
    .sort(sorts[sort].compare);
  const createHref = `/app/library?project=${project.id}`;
  const close = () => setDialog(null);

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="C-06.06" state="Project Dashboard Ready" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[clamp(1.5rem,5.5vw,2.1rem)] leading-tight font-semibold break-words text-navy">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 max-w-lg text-[15px] leading-7 text-body">{project.description}</p>
            )}
            <p className="mt-2 text-[13px] text-muted">
              {plural(projectFileCount(project.id), "file")} · Updated {inlineLabel(project.lastUpdated)}
            </p>
            {(project.labels.length > 0 || project.tags.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.labels.map((l) => (
                  <span
                    key={l.id}
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.name}
                  </span>
                ))}
                {project.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] text-body">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDialog("settings")}
            aria-label="Project actions"
            aria-haspopup="dialog"
            className="flex size-11 shrink-0 items-center justify-center rounded-control border border-line text-navy transition-colors duration-200 hover:border-navy/30"
          >
            <IconDotsThreeVertical size={18} />
          </button>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          <AppButton href={createHref}>
            <IconPlus />
            Create New Visualization
          </AppButton>
          <button type="button" onClick={() => setDialog("add")} className={appButtonOutline}>
            Add Existing File
          </button>
          {projectFiles.some((f) => f.version > 0) && (
            <button type="button" onClick={() => setDialog("share")} className={appButtonOutline}>
              <IconShareNetwork />
              Share for review
            </button>
          )}
        </div>
      </div>

      <AppSection title="Files" count={projectFiles.length} className="mt-9">
        {projectFiles.length === 0 ? (
          <div className="px-5 sm:px-0">
            <ScreenCode code="C-06.05" state="Empty project" />
            <EmptyState
              icon={<IconSparkle size={20} />}
              title="No files in this project yet"
              body="Start a new visualization here, or bring in a file you have already started."
            >
              <Link href={createHref} className={appButtonPrimary}>
                Create New Visualization
              </Link>
              <button type="button" onClick={() => setDialog("add")} className={appButtonOutline}>
                Add Existing File
              </button>
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="mb-4 px-5 sm:px-0">
              <div className="flex items-center gap-2">
                <SearchField label="Search files in this project" value={query} onChange={setQuery} compact />
                <SortMenu options={sortOptions} value={sort} onChange={setSort} />
              </div>
            </div>
            {shown.length === 0 ? (
              <div className="px-5 sm:px-0">
                <EmptyState icon={<IconSearch size={20} />} title="No files match">
                  <button type="button" onClick={() => setQuery("")} className={appButtonPrimary}>
                    Clear search
                  </button>
                </EmptyState>
              </div>
            ) : (
              <Rail cols={3}>
                {shown.map((file) => (
                  <FileTile
                    key={file.id}
                    file={file}
                    href={`/app/files/${file.id}?from=project&project=${project.id}`}
                    showProject={false}
                  />
                ))}
              </Rail>
            )}
          </>
        )}
      </AppSection>

      <div className="mt-10 px-5 sm:px-0">
        <AppButton href="/app/projects" variant="outline">
          Back to projects
        </AppButton>
      </div>

      <ProjectSettings
        open={dialog === "settings"}
        project={project}
        onClose={close}
        onArchived={() => router.push("/app/projects")}
        onDuplicate={() => setDialog("duplicate")}
        onDelete={() => setDialog("delete")}
      />
      <DuplicateProject
        open={dialog === "duplicate"}
        project={project}
        onClose={close}
        onDone={(copy) => {
          close();
          router.push(`/app/projects/${copy.id}`);
        }}
      />
      <DeleteProject
        open={dialog === "delete"}
        project={project}
        onClose={close}
        onDeleted={() => {
          close();
          router.push("/app/projects?tab=deleted");
        }}
      />
      <AddExistingFile open={dialog === "add"} project={project} onClose={close} />
      <ShareForReview open={dialog === "share"} project={project} onClose={close} />
    </div>
  );
}

/** The ember "go to projects" action on the screens where the flow ends. */
function ProjectsButton({ label }: { label: string }) {
  return (
    <Link href="/app/projects" className={appButtonPrimary}>
      <IconArrowCounterClockwise size={15} />
      {label}
    </Link>
  );
}
