"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { nameSchema } from "@/components/app/CreateProjectForm";
import FlowSteps from "@/components/app/FlowSteps";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, { SheetTitle } from "@/components/app/Sheet";
import type { Project } from "@/lib/mock/entities";
import { duplicateFile, duplicateProject, getStudio, setFileProject } from "@/lib/mock/store";
import { ChoiceCard, plural, TextField, useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

const steps = [
  "Creating the duplicate project",
  "Loading the source files",
  "Duplicating files",
  "Associating files with the new project",
];

type Step = "C-09.01" | "C-09.02" | "C-09.03" | "C-09.04" | "C-09.05" | "C-09.06" | "C-09.07";
type Mode = "structure" | "with-files";

// C-09 — copy a project, with or without its files. Copies get new ids and
// stay fully independent of the originals.
export default function DuplicateProject({
  open,
  project,
  onClose,
  onDone,
}: {
  open: boolean;
  project: Project;
  onClose: () => void;
  onDone: (copy: Project) => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="duplicate-title" maxWidth="26rem">
      {open && <DuplicateBody project={project} onClose={onClose} onDone={onDone} />}
    </Sheet>
  );
}

function DuplicateBody({
  project,
  onClose,
  onDone,
}: {
  project: Project;
  onClose: () => void;
  onDone: (copy: Project) => void;
}) {
  const wait = useWait();
  const [step, setStep] = useState<Step>("C-09.01");
  const [mode, setMode] = useState<Mode>("with-files");
  const [name, setName] = useState(`${project.name} Copy`);
  const [error, setError] = useState<string>();
  const [copy, setCopy] = useState<Project | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [copied, setCopied] = useState<string[]>([]);
  // Held in a ref so a re-render of the page (each copy updates the store) does not restart a step.
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });
  const sourceFiles = getStudio().files.filter((f) => f.projectId === project.id && f.status !== "deleted");

  // C-09.01: read the source project.
  useEffect(() => wait(() => setStep("C-09.02"), 0.4), [wait]);

  // C-09.05 → C-09.07: load the files, copy them one by one, then link the copies.
  useEffect(() => {
    if (step === "C-09.05") {
      return wait(() => {
        setQueue(getStudio().files.filter((f) => f.projectId === project.id && f.status !== "deleted").map((f) => f.id));
        setStep("C-09.06");
      }, 0.4);
    }
    if (step === "C-09.06") {
      if (queue.length === 0) return wait(() => setStep("C-09.07"), 0.2);
      const [next, ...rest] = queue;
      return wait(() => {
        const file = getStudio().files.find((f) => f.id === next);
        const id = file && duplicateFile(next, { name: file.name, projectId: undefined });
        if (id) setCopied((c) => [...c, id]);
        setQueue(rest);
      }, 0.45);
    }
    if (step === "C-09.07" && copy) {
      return wait(() => {
        copied.forEach((id) => setFileProject(id, copy.id));
        done.current(copy);
      }, 0.5);
    }
  }, [step, queue, copy, copied, project.id, wait]);

  const start = () => {
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError(undefined);
    setStep(mode === "structure" ? "C-09.03" : "C-09.04");
    wait(() => {
      const created = duplicateProject(project.id, parsed.data);
      if (!created) return;
      if (mode === "structure") return onDone(created);
      setCopy(created);
      setStep("C-09.05");
    }, 0.5);
  };

  const active = step === "C-09.04" ? 0 : step === "C-09.05" ? 1 : step === "C-09.06" ? 2 : 3;

  return (
    <>
      <SheetTitle title="Duplicate project" onClose={onClose} />
      <p id="duplicate-title" className="sr-only">
        Duplicate {project.name}
      </p>
      {step === "C-09.01" ? (
        <>
          <ScreenCode code="C-09.01" state="Loading source project" />
          <p className="text-[13px] text-body">Reading “{project.name}”…</p>
        </>
      ) : step === "C-09.02" ? (
        <>
          <ScreenCode code="C-09.02" state="Select duplication mode" />
          <div className="space-y-2.5">
            <ChoiceCard
              selected={mode === "structure"}
              title="Duplicate Project Structure Only"
              body="Name, description, labels and tags. No files."
              onSelect={() => setMode("structure")}
            />
            <ChoiceCard
              selected={mode === "with-files"}
              title="Duplicate Project + All Files"
              body={`Also copies ${plural(sourceFiles.length, "file")} — new ids, fully independent.`}
              onSelect={() => setMode("with-files")}
            />
          </div>
          <TextField label="Name" value={name} onChange={setName} error={error} className="mt-5" />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <button type="button" onClick={start} className={clsx(appButtonPrimary, "flex-1")}>
              Duplicate
            </button>
            <button type="button" onClick={onClose} className={clsx(appButtonOutline, "flex-1")}>
              Cancel
            </button>
          </div>
        </>
      ) : step === "C-09.03" ? (
        <>
          <ScreenCode code="C-09.03" state="Duplicating project metadata" />
          <p className="text-[13px] text-body">Creating “{name.trim()}” with File Count = 0…</p>
        </>
      ) : (
        <>
          <ScreenCode code={step} state="Duplicating project + files" />
          <FlowSteps steps={steps} active={active} />
          {step === "C-09.06" && (
            <p className="mt-4 text-[13px] text-muted">
              {copied.length} of {copied.length + queue.length} files copied
            </p>
          )}
        </>
      )}
    </>
  );
}
