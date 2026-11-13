"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { appButtonNavy, appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { IconFolderOpen, IconPlus, IconPushPinFill, IconSearch, IconWarning } from "@/components/app/AppIcons";
import CreateProjectForm from "@/components/app/CreateProjectForm";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, { SheetFacts, SheetTitle } from "@/components/app/Sheet";
import { inlineLabel, type Project, type StudioFile } from "@/lib/mock/entities";
import {
  activeProjects,
  deleteFile,
  deleteProject,
  getStudio,
  projectFileCount,
  restoreFileSnapshots,
  setFileProject,
  useStudio,
} from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";
import { ChoiceCard, plural, useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

type Step =
  | "C-10.01"
  | "C-10.03"
  | "C-10.04"
  | "picker"
  | "create"
  | "C-10.05"
  | "C-10.07"
  | "C-10.08"
  | "deleting-files"
  | "C-10.06"
  | "C-10.10";
type Handling = "keep" | "move" | "delete";

const working: Partial<Record<Step, { code: string; state: string }>> = {
  "C-10.05": { code: "C-10.05", state: "Detaching files" },
  "C-10.07": { code: "C-10.07", state: "Moving files" },
  "deleting-files": { code: "C-10.08", state: "Deleting files" },
  "C-10.10": { code: "C-10.10", state: "Soft deleting project" },
};

// C-10 — delete a project. Its files are kept independent, moved to another
// project or deleted first; the project then sits in Recently deleted for 30 days.
export default function DeleteProject({
  open,
  project,
  onClose,
  onDeleted,
}: {
  open: boolean;
  project: Project;
  onClose: () => void;
  onDeleted: () => void;
}) {
  return open ? <DeleteBody project={project} onClose={onClose} onDeleted={onDeleted} /> : null;
}

function DeleteBody({ project, onClose, onDeleted }: { project: Project; onClose: () => void; onDeleted: () => void }) {
  useStudio();
  const wait = useWait();
  const [step, setStep] = useState<Step>("C-10.01");
  const [handling, setHandling] = useState<Handling>("keep");
  const [target, setTarget] = useState<Project | null>(null);
  const [understood, setUnderstood] = useState(false);
  const [pending, setPending] = useState(false);
  // The project's files when the dialog opened, as they were — Cancel puts them back.
  const [snapshot] = useState<StudioFile[]>(() =>
    getStudio().files.filter((f) => f.projectId === project.id && f.status !== "deleted")
  );
  const ids = snapshot.map((f) => f.id);
  const count = ids.length;

  useEffect(() => wait(() => setStep(count ? "C-10.04" : "C-10.03"), 0.4), [wait, count]);

  const detach = () => {
    setHandling("keep");
    setStep("C-10.05");
    wait(() => {
      ids.forEach((id) => setFileProject(id, undefined));
      setStep("C-10.06");
    }, 0.5);
  };

  const move = (to: Project) => {
    setTarget(to);
    setStep("C-10.07");
    wait(() => {
      ids.forEach((id) => setFileProject(id, to.id));
      setStep("C-10.06");
    }, 0.5);
  };

  const removeFiles = () => {
    setStep("deleting-files");
    wait(() => {
      ids.forEach((id) => deleteFile(id));
      setStep("C-10.06");
    }, 0.6);
  };

  const softDelete = () => {
    setStep((s) => (s === "C-10.03" ? s : "C-10.10"));
    setPending(true);
    wait(() => {
      deleteProject(project.id);
      onDeleted();
    }, 0.5);
  };

  const cancelAndRestore = () => {
    restoreFileSnapshots(snapshot);
    onClose();
  };

  const filesSummary =
    count === 0
      ? "No files"
      : handling === "keep"
        ? `${plural(count, "file")} kept independent`
        : handling === "move"
          ? `${plural(count, "file")} moved to ${target?.name ?? "another project"}`
          : `${plural(count, "file")} deleted (recoverable for 30 days)`;

  if (step === "picker") {
    return (
      <Sheet open onClose={onClose} labelledBy="picker-title" maxWidth="28rem">
        <ProjectPicker
          excludeId={project.id}
          onBack={() => setStep("C-10.04")}
          onPick={move}
          onCreate={() => setStep("create")}
          onKeep={detach}
          onCancel={onClose}
        />
      </Sheet>
    );
  }

  if (step === "create") {
    return (
      <Sheet open onClose={onClose} maxWidth="28rem">
        <CreateProjectForm onCancel={() => setStep("picker")} onClose={() => setStep("picker")} onCreated={move} />
      </Sheet>
    );
  }

  const busy = working[step];

  return (
    <Sheet open onClose={onClose} labelledBy="delete-title" maxWidth="28rem">
      <SheetTitle title={`Delete “${project.name}”`} onClose={onClose} />
      <p id="delete-title" className="sr-only">
        Delete project {project.name}
      </p>

      {step === "C-10.01" && (
        <>
          <ScreenCode code="C-10.01" state="Loading project" />
          <p className="text-[13px] text-body">Checking the project and its files…</p>
        </>
      )}

      {step === "C-10.03" && (
        <>
          <ScreenCode code="C-10.03" state="Confirm empty project deletion" />
          <p className="text-[15px] leading-7 text-body">
            Delete Project: <span className="font-medium text-navy">{project.name}</span>. No Files are associated.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button type="button" onClick={softDelete} disabled={pending} className={clsx(appButtonNavy, "flex-1")}>
              {pending ? "Deleting…" : "Delete project"}
            </button>
            <button type="button" onClick={onClose} className={clsx(appButtonOutline, "flex-1")}>
              Cancel
            </button>
          </div>
        </>
      )}

      {step === "C-10.04" && (
        <>
          <ScreenCode code="C-10.04" state="File handling options" />
          <p className="mb-3 text-[13px] leading-6 text-body">
            Project contains: <span className="font-medium text-navy">{plural(count, "File")}</span>. Choose what happens
            to the Files:
          </p>
          <div className="space-y-2.5">
            <ChoiceCard
              selected={handling === "keep"}
              title="Keep Files Independent"
              body="Recommended. Files stay exactly as they are, with no project."
              onSelect={() => setHandling("keep")}
            />
            <ChoiceCard
              selected={handling === "move"}
              title="Move Files to Another Project"
              body="Every file moves, with nothing inside it changed."
              onSelect={() => setHandling("move")}
            />
            <ChoiceCard
              selected={handling === "delete"}
              danger
              title="Delete Files"
              body="Moves the files to Recently deleted — restorable for 30 days, then gone."
              onSelect={() => setHandling("delete")}
            />
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => (handling === "keep" ? detach() : setStep(handling === "move" ? "picker" : "C-10.08"))}
              className={clsx(appButtonPrimary, "flex-1")}
            >
              Continue
            </button>
            <button type="button" onClick={onClose} className={clsx(appButtonOutline, "flex-1")}>
              Cancel
            </button>
          </div>
        </>
      )}

      {busy && (
        <>
          <ScreenCode code={busy.code} state={busy.state} />
          <p className="text-[13px] leading-6 text-body">
            {step === "C-10.05"
              ? `Setting project to none on ${plural(count, "file")}…`
              : step === "C-10.07"
                ? `Moving ${plural(count, "file")} to “${target?.name}”…`
                : step === "C-10.10"
                  ? "Deleting the project and starting its recovery window…"
                  : `Deleting ${plural(count, "file")}…`}
          </p>
        </>
      )}

      {step === "C-10.08" && (
        <>
          <ScreenCode code="C-10.08" state="Critical file deletion warning" />
          <div className="rounded-control border border-ember/40 bg-ember/6 p-4">
            <div className="flex gap-2.5">
              <IconWarning size={18} className="mt-0.5 shrink-0 text-ember" />
              <div>
                <p className="font-display text-[13px] font-semibold text-ember">
                  Deleting this Project will also delete: {plural(count, "File")}.
                </p>
                <p className="mt-1.5 text-[13px] leading-6 text-body">
                  Each moves to Recently deleted with everything inside it — versions, generations and export records —
                  and can be restored from Files for 30 days. After that it is removed for good.
                </p>
                <ul className="mt-2 list-disc pl-4 text-xs leading-5 text-muted">
                  {snapshot.map((f) => (
                    <li key={f.id}>
                      {f.name} · {toolById(f.toolId)?.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <label className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 rounded-md border-line accent-ember"
            />
            <span className="text-[13px] leading-6 text-body">
              I understand {plural(count, "file")} will be removed for good unless restored within 30 days.
            </span>
          </label>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={removeFiles}
              disabled={!understood}
              className={clsx(appButtonPrimary, "flex-1")}
            >
              Delete files
            </button>
            <button type="button" onClick={() => setStep("C-10.04")} className={clsx(appButtonOutline, "flex-1")}>
              Back
            </button>
          </div>
        </>
      )}

      {step === "C-10.06" && (
        <>
          <ScreenCode code="C-10.06 / C-10.09" state="Final project deletion confirmation" />
          <SheetFacts
            rows={[
              ["Project", project.name],
              ["Files", filesSummary],
              ["Action", "Delete Project"],
            ]}
          />
          {handling === "move" && target && (
            <p className="mt-3 text-[13px] text-muted">
              “{target.name}” now has {plural(projectFileCount(target.id), "file")}.
            </p>
          )}
          <p className="mt-3 text-[13px] leading-6 text-body">
            The project moves to Recently deleted and can be restored for 30 days.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              type="button"
              onClick={softDelete}
              className={clsx(handling === "delete" ? appButtonPrimary : appButtonNavy, "flex-1")}
            >
              Delete project
            </button>
            <button type="button" onClick={cancelAndRestore} className={clsx(appButtonOutline, "flex-1")}>
              Cancel
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

// C-10.07 — where the files go. With no other active project it offers to
// create one, keep the files independent, or cancel.
function ProjectPicker({
  excludeId,
  onBack,
  onPick,
  onCreate,
  onKeep,
  onCancel,
}: {
  excludeId: string;
  onBack: () => void;
  onPick: (project: Project) => void;
  onCreate: () => void;
  onKeep: () => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState("");
  const all = activeProjects().filter((p) => p.id !== excludeId);
  const q = query.trim().toLowerCase();
  const shown = q ? all.filter((p) => p.name.toLowerCase().includes(q)) : all;

  return (
    <>
      <ScreenCode code="C-10.07" state={all.length ? "Choose a project" : "No Destination Projects Available"} />
      <SheetTitle title="Move files to" onClose={onBack} />
      {all.length === 0 ? (
        <div className="rounded-control border border-line bg-shell px-5 py-7 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-navy/8 text-navy">
            <IconFolderOpen size={20} />
          </span>
          <p id="picker-title" className="mt-4 font-display text-[15px] font-medium text-navy">
            No Destination Projects Available
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-6 text-body">
            There is no other active project to move these files into.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={onCreate} className={appButtonPrimary}>
              <IconPlus />
              Create New Project
            </button>
            <button type="button" onClick={onKeep} className={appButtonOutline}>
              Keep Files Independent
            </button>
            <button type="button" onClick={onCancel} className={appButtonOutline}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
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
          {shown.length === 0 ? (
            <p id="picker-title" className="py-8 text-center text-[13px] text-muted">
              No projects match.
            </p>
          ) : (
            <ul className="space-y-1.5" aria-labelledby="picker-title">
              {shown.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onPick(p)}
                    className="flex w-full items-center gap-3 rounded-control p-2.5 text-left transition-colors duration-200 hover:bg-shell"
                  >
                    {p.cover ? (
                      <Image src={p.cover} alt="" width={44} height={44} className="size-11 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cream text-faint">
                        <IconFolderOpen size={18} />
                      </span>
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
          )}
        </>
      )}
    </>
  );
}
