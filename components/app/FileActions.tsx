"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { appButtonNavy, appButtonOutline } from "@/components/app/AppButton";
import {
  IconArchive,
  IconArrowCounterClockwise,
  IconArrowsLeftRight,
  IconCopy,
  IconFolderMinus,
  IconFolderOpen,
  IconInfo,
  IconPencilSimple,
  IconPlus,
  IconPushPinFill,
  IconSearch,
  IconShared,
  IconTrash,
  IconWarning,
} from "@/components/app/AppIcons";
import CreateProjectForm, { nameSchema } from "@/components/app/CreateProjectForm";
import { FileStatusBadge } from "@/components/app/FileMeta";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, {
  SheetActions,
  SheetClose,
  SheetConfirm,
  SheetDone,
  SheetFacts,
  SheetMenu,
  SheetTitle,
  type SheetMenuEntry,
} from "@/components/app/Sheet";
import { fileGenerationCount, inlineLabel, type Project, type StudioFile } from "@/lib/mock/entities";
import {
  activeProjects,
  archiveFile,
  deleteFile,
  duplicateFile,
  projectById,
  purgeFile,
  renameFile,
  restoreFile,
  setFileProject,
} from "@/lib/mock/store";
import { toolById, toolCategories } from "@/lib/mock/tools";

type View =
  | "menu"
  | "rename"
  | "manage"
  | "add"
  | "pick"
  | "create"
  | "remove"
  | "archive"
  | "delete"
  | "restore"
  | "purge"
  | "info"
  | { done: "added" | "moved" | "removed"; from?: string; to?: string };

const widths: Partial<Record<string, string>> = { menu: "24rem", pick: "28rem", create: "28rem" };

/** Where the actions button or the project chip on a file card opens the sheet. */
export type FileActionsStart = "menu" | "project";

export default function FileActions({
  file,
  start,
  onClose,
}: {
  file: StudioFile;
  start: FileActionsStart | null;
  onClose: () => void;
}) {
  const open = start !== null;
  // The view resets each time the sheet opens, by remounting on `start`.
  return (
    <FileActionsSheet key={String(start)} file={file} open={open} start={start ?? "menu"} onClose={onClose} />
  );
}

function FileActionsSheet({
  file,
  open,
  start,
  onClose,
}: {
  file: StudioFile;
  open: boolean;
  start: FileActionsStart;
  onClose: () => void;
}) {
  const router = useRouter();
  const project = projectById(file.projectId);
  const [view, setView] = useState<View>(start === "menu" ? "menu" : project ? "manage" : "add");
  const [pickMode, setPickMode] = useState<"add" | "move">("add");
  const tool = toolById(file.toolId);
  const live = file.status === "active" || file.status === "draft";
  const width = typeof view === "string" ? (widths[view] ?? "26rem") : "26rem";

  const run = (action: () => void) => () => {
    action();
    onClose();
  };
  const pick = (mode: "add" | "move") => {
    setPickMode(mode);
    setView("pick");
  };
  const assign = (target: Project) => {
    const from = project?.name;
    setFileProject(file.id, target.id);
    setView({ done: pickMode === "move" && from ? "moved" : "added", from, to: target.name });
  };

  const menu: SheetMenuEntry[] = live
    ? [
        ...(file.status === "active"
          ? [{ label: "Share or export", Icon: IconShared, onSelect: () => router.push(`/app/editor/${file.id}`) }]
          : []),
        { label: "Rename", Icon: IconPencilSimple, onSelect: () => setView("rename") },
        // The copy joins Continue Working at the top; the editor it would open isn't built yet.
        { label: "Duplicate", Icon: IconCopy, onSelect: run(() => duplicateFile(file.id)) },
        ...(project
          ? [
              { label: "Move to Project", Icon: IconArrowsLeftRight, onSelect: () => setView("manage") },
              { label: "Remove from Project", Icon: IconFolderMinus, onSelect: () => setView("remove") },
            ]
          : [{ label: "Add to Project", Icon: IconFolderMinus, onSelect: () => setView("add") }]),
        { label: "Archive", Icon: IconArchive, onSelect: () => setView("archive") },
        { label: "Delete", Icon: IconTrash, onSelect: () => setView("delete"), danger: true },
        { label: "File Information", Icon: IconInfo, onSelect: () => setView("info") },
      ]
    : [
        { label: "Restore", Icon: IconArrowCounterClockwise, onSelect: () => setView("restore") },
        file.status === "archived"
          ? { label: "Delete", Icon: IconTrash, onSelect: () => setView("delete"), danger: true }
          : { label: "Delete permanently", Icon: IconTrash, onSelect: () => setView("purge"), danger: true },
        { label: "File Information", Icon: IconInfo, onSelect: () => setView("info") },
      ];

  const subtitle = (
    <p className="-mt-2 mb-4 text-[13px] text-muted">
      {file.name} · {tool?.name}
    </p>
  );

  let body: React.ReactNode;
  if (typeof view === "object") {
    const done = {
      added: {
        code: "C-04.04",
        title: "File added to project",
        message: `“${file.name}” is now in “${view.to}”. Its card, the project’s file count and Recent Work have all updated.`,
      },
      moved: {
        code: "C-04.06",
        title: "File moved",
        message: `“${file.name}” moved from “${view.from}” to “${view.to}”. Same File, same id — only its project changed.`,
      },
      removed: {
        code: "C-04.07",
        title: "File now independent",
        message: `“${file.name}” stays active and is still in Continue Working. Project: None.`,
      },
    }[view.done];
    body = <SheetDone code={done.code} state={`End: ${done.title}`} title={done.title} message={done.message} onDone={onClose} />;
  } else if (view === "menu") {
    body = (
      <>
        <ScreenCode code="C-03.01" state="File actions" />
        <div className="mb-3 flex items-center justify-between">
          <div className="min-w-0">
            <p id="file-menu-title" className="truncate font-display text-base font-semibold text-navy">
              {file.name}
            </p>
            <p className="text-xs text-muted">
              {tool?.name} · {project?.name ?? "Independent file"}
            </p>
          </div>
          <SheetClose onClose={onClose} />
        </div>
        <SheetMenu items={menu} />
      </>
    );
  } else if (view === "rename") {
    body = <RenameFile file={file} onCancel={() => setView("menu")} onDone={onClose} />;
  } else if (view === "manage") {
    body = (
      <>
        <ScreenCode code="C-04.01 → C-04.05" state="Project assigned — manage" />
        <SheetTitle title="Project" onClose={onClose} />
        {subtitle}
        <div className="mb-4 rounded-control border border-line bg-shell px-4 py-3">
          <p className="text-xs text-muted">Current project</p>
          <p id="assoc-title" className="mt-0.5 font-display text-[15px] font-medium text-navy">
            {project?.name}
          </p>
        </div>
        <SheetMenu
          items={[
            { label: "Move to Another Project", Icon: IconArrowsLeftRight, onSelect: () => pick("move") },
            { label: "Remove from Project", Icon: IconFolderOpen, onSelect: () => setView("remove") },
          ]}
        />
      </>
    );
  } else if (view === "add") {
    body = (
      <>
        <ScreenCode code="C-04.01 → C-04.02" state="No project — add to one" />
        <SheetTitle title="Add to project" onClose={onClose} />
        {subtitle}
        <SheetMenu
          items={[
            { label: "Select Existing Project", Icon: IconFolderOpen, onSelect: () => pick("add") },
            { label: "Create New Project", Icon: IconFolderMinus, onSelect: () => setView("create") },
          ]}
        />
      </>
    );
  } else if (view === "pick") {
    body = (
      <ProjectPicker
        mode={pickMode}
        excludeId={file.projectId}
        onClose={onClose}
        onCreate={() => setView("create")}
        onPick={assign}
      />
    );
  } else if (view === "create") {
    body = (
      <CreateProjectForm
        forFile
        onCancel={() => setView(project ? "manage" : "add")}
        onClose={onClose}
        onCreated={(p) => {
          setPickMode("add");
          setFileProject(file.id, p.id);
          setView({ done: "added", to: p.name });
        }}
      />
    );
  } else if (view === "remove") {
    body = (
      <>
        <ScreenCode code="C-04.07" state="Confirm removal" />
        <h2 id="assoc-title" className="font-display text-lg font-semibold text-navy">
          Remove this File from Project?
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-body">
          File will remain available independently. “{file.name}” leaves “{project?.name}” and nothing inside it changes.
        </p>
        <SheetActions
          confirm="Remove from project"
          onConfirm={() => {
            setFileProject(file.id, undefined);
            setView({ done: "removed" });
          }}
          onCancel={() => setView("menu")}
        />
      </>
    );
  } else if (view === "archive") {
    body = (
      <SheetConfirm
        icon={<IconInfo size={20} />}
        title="Archive this file?"
        body="File will be removed from active File views. Restore it any time and it comes back exactly as it was."
        confirm="Archive"
        confirmClass={appButtonNavy}
        onConfirm={run(() => archiveFile(file.id))}
        onCancel={() => setView("menu")}
      >
        <ScreenCode code="C-03.04" state="Confirm archive" />
      </SheetConfirm>
    );
  } else if (view === "delete") {
    body = (
      <SheetConfirm
        icon={<IconWarning />}
        tone="ember"
        title="Delete this file?"
        confirm="Delete"
        onConfirm={run(() => deleteFile(file.id))}
        onCancel={() => setView("menu")}
      >
        <ScreenCode code="C-03.06" state="Delete confirmation" />
        <SheetFacts
          dense
          rows={[
            ["File", file.name],
            ["Tool", tool?.name ?? "—"],
            ["Project", project?.name ?? "None"],
          ]}
        />
        <p className="mt-3 text-[13px] leading-6 text-body">
          It leaves every active view and is kept, recoverable, for 30 days. Its generations, versions and exports stay
          inside it.
        </p>
      </SheetConfirm>
    );
  } else if (view === "restore") {
    body = (
      <SheetConfirm
        icon={<IconInfo size={20} />}
        title="Restore this file?"
        body="It returns to Continue Working and its project, exactly as it was."
        confirm="Restore"
        confirmClass={appButtonNavy}
        onConfirm={run(() => restoreFile(file.id))}
        onCancel={() => setView("menu")}
      >
        <ScreenCode code="C-03.05" state="Validate: exists · access · eligible" />
      </SheetConfirm>
    );
  } else if (view === "purge") {
    const versions = `${file.totalVersions} ${file.totalVersions === 1 ? "version" : "versions"}`;
    const gens = fileGenerationCount(file.id);
    body = (
      <SheetConfirm
        icon={<IconWarning />}
        tone="ember"
        title="Delete this file permanently?"
        confirm="Delete permanently"
        onConfirm={run(() => purgeFile(file.id))}
        onCancel={() => setView("menu")}
      >
        <ScreenCode code="C-03.06" state="Permanent delete — cannot be undone" />
        <p className="text-[13px] leading-6 text-body">
          “{file.name}” and everything stored inside it go for good: {versions}, {gens} {gens === 1 ? "generation" : "generations"}.
          Images you already downloaded are not affected. There is no way to restore it afterwards.
        </p>
      </SheetConfirm>
    );
  } else {
    const category = toolCategories.find((c) => c.id === tool?.category);
    body = (
      <>
        <ScreenCode code="C-03.07" state="View file information" />
        <SheetTitle title="File information" onClose={onClose} />
        <SheetFacts
          rows={[
            ["File name", file.name],
            ["Tool", tool?.name ?? "—"],
            ["Category", category?.label ?? "—"],
            ["Created", file.createdAt],
            ["Last edited", file.lastEdited],
            ["Last opened", "Not yet"],
            ["Project", project?.name ?? "None"],
            ["Current version", `Version ${file.version} of ${file.totalVersions}`],
            ["Generations", String(fileGenerationCount(file.id))],
            ["Exports", "0"],
            ["Unsaved changes", file.recovery ? "Recovery available" : "None"],
            ["File status", <FileStatusBadge key="status" file={file} />],
          ]}
        />
        <button type="button" onClick={() => setView("menu")} className={clsx(appButtonOutline, "mt-6 w-full")}>
          Back to file actions
        </button>
      </>
    );
  }

  return (
    <Sheet open={open} onClose={onClose} maxWidth={width} labelledBy={view === "menu" ? "file-menu-title" : undefined}>
      {body}
    </Sheet>
  );
}

function RenameFile({ file, onCancel, onDone }: { file: StudioFile; onCancel: () => void; onDone: () => void }) {
  const [name, setName] = useState(file.name);
  const [error, setError] = useState<string>();

  const save = () => {
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    renameFile(file.id, parsed.data);
    onDone();
  };

  return (
    <>
      <span className="flex size-11 items-center justify-center rounded-full bg-navy/8 text-navy">
        <IconInfo size={20} />
      </span>
      <h2 id="confirm-title" className="mt-4 font-display text-lg font-semibold text-navy">
        Rename file
      </h2>
      <div className="mt-4">
        <ScreenCode code="C-03.02" state="Rename file" />
        <p className="mb-3 text-[13px] text-muted">
          Current name: <span className="font-medium text-navy">{file.name}</span>
        </p>
        <div>
          <label htmlFor="rename-file" className="block text-sm font-medium text-navy">
            New file name
          </label>
          <div className="relative mt-2">
            <input
              id="rename-file"
              value={name}
              autoFocus
              onChange={(e) => {
                setName(e.target.value);
                setError(undefined);
              }}
              onKeyDown={(e) => e.key === "Enter" && save()}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? "rename-file-error" : undefined}
              className={clsx(
                "w-full rounded-control border bg-white px-4 py-3.5 text-base text-ink transition-colors duration-200 ease-out-soft placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]",
                error ? "border-ember focus:border-ember" : "border-line focus:border-navy/40"
              )}
            />
          </div>
          {error && (
            <p id="rename-file-error" className="mt-2 text-[13px] leading-5 text-ember">
              {error}
            </p>
          )}
        </div>
      </div>
      <SheetActions confirm="Save" confirmClass={appButtonNavy} onConfirm={save} onCancel={onCancel} />
    </>
  );
}

function ProjectPicker({
  mode,
  excludeId,
  onClose,
  onCreate,
  onPick,
}: {
  mode: "add" | "move";
  excludeId?: string;
  onClose: () => void;
  onCreate: () => void;
  onPick: (project: Project) => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const projects = activeProjects().filter((p) => p.id !== excludeId && p.name.toLowerCase().includes(q));

  return (
    <>
      <ScreenCode code={mode === "move" ? "C-04.06" : "C-04.02"} state="Choose a project" />
      <SheetTitle title={mode === "move" ? "Move to another project" : "Add to an existing project"} onClose={onClose} />
      <button
        type="button"
        onClick={onCreate}
        className="mb-4 flex w-full items-center gap-3 rounded-control border border-dashed border-line px-4 py-3.5 text-left transition-colors duration-200 hover:border-navy/30 hover:bg-shell"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy/8 text-navy">
          <IconPlus size={16} />
        </span>
        <span className="font-display text-[13px] font-medium text-navy">Create New Project</span>
      </button>
      <label className="mb-3 flex items-center gap-2.5 rounded-control border border-line bg-shell px-3.5 py-2.5">
        <IconSearch size={15} className="shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          aria-label="Search projects"
          className="w-full rounded-none border-0 bg-transparent p-0 text-base text-ink placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]"
        />
      </label>
      {projects.length > 0 ? (
        <ul className="space-y-1.5">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPick(p)}
                className="flex w-full items-center gap-3 rounded-control p-2.5 text-left transition-colors duration-200 hover:bg-shell"
              >
                {p.cover ? (
                  <Image src={p.cover} alt="" width={44} height={44} className="size-11 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="size-11 shrink-0 rounded-lg bg-cream" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[13px] font-medium text-navy">{p.name}</span>
                  <span className="block text-xs text-muted">Updated {inlineLabel(p.lastUpdated)}</span>
                </span>
                {p.pinned && <IconPushPinFill size={13} className="shrink-0 text-ember" />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-[13px] text-muted">
          {q ? "No project matches that name." : "No other projects yet. Create one above."}
        </p>
      )}
    </>
  );
}
