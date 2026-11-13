"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AppButton, { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { IconArrowCounterClockwise, IconClockCounterClockwise } from "@/components/app/AppIcons";
import FlowSteps from "@/components/app/FlowSteps";
import { FlowNotice, NoticeActions } from "@/components/app/Notice";
import ScreenCode from "@/components/app/ScreenCode";
import { timeAgo, type StudioFile } from "@/lib/mock/entities";
import { applyRecovery, useStudio } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";

const codes = ["C-02.02", "C-02.03", "C-02.04", "C-02.05", "C-02.07", "C-02.08"];
const STEP_MS = 350;

type Phase = "walking" | "invalid" | "unavailable" | "tool" | "recovery" | "ready";

/** What the recovered session changed, in words. */
function recoveredChanges(f: StudioFile) {
  const r = f.recovery;
  if (!r) return "Unsaved changes from your last session";
  const out: string[] = [];
  const prompt = String(r.params.prompt ?? "").trim();
  if (prompt && prompt !== String(f.params?.prompt ?? "").trim()) out.push(`a new prompt — “${prompt}”`);
  const marks = r.selection.marks.length;
  if (marks) out.push(`${marks} marked area${marks === 1 ? "" : "s"}`);
  if (r.referenceImage) out.push("a reference image");
  if (r.sourceImage && r.sourceImage !== f.sourceImage) out.push("a different photo");
  return out.length ? out.join(", ") : "Setting changes";
}

// Walks the C-02 checks for one file, then replaces itself with the editor.
export default function OpeningFile({ fileId, from, projectId }: { fileId: string; from: string; projectId?: string }) {
  const router = useRouter();
  const { files, projects } = useStudio();
  const file = files.find((f) => f.id === fileId);
  const tool = file ? toolById(file.toolId) : undefined;
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(file ? "walking" : "invalid");
  const [restore, setRestore] = useState<"saved" | "recovered">("saved");
  const recoveryOffered = useRef(false);

  useEffect(() => {
    if (phase === "ready") {
      router.replace(`/app/editor/${fileId}`);
      return;
    }
    if (phase !== "walking" || !file) return;
    const next = (ms = STEP_MS) => window.setTimeout(() => setStep((s) => s + 1), ms);
    const end = (p: Phase, ms = STEP_MS) => window.setTimeout(() => setPhase(p), ms);
    let t: number;
    switch (step) {
      case 0:
        t = file.status === "archived" || file.status === "deleted" ? end("unavailable") : next();
        break;
      case 1:
        t = next();
        break;
      case 2:
        t = tool ? next() : end("tool");
        break;
      case 3:
        // A file with unsaved work from an ended session asks which state to open.
        t =
          file.recovery && !recoveryOffered.current
            ? window.setTimeout(() => {
                recoveryOffered.current = true;
                setPhase("recovery");
              }, STEP_MS)
            : next();
        break;
      case 4:
        t = next(400);
        break;
      default:
        t = end("ready", 300);
    }
    return () => window.clearTimeout(t);
  }, [phase, step, file, tool, fileId, router]);

  const resume = (state: "saved" | "recovered") => {
    if (state === "recovered") applyRecovery(fileId);
    setRestore(state);
    setStep(4);
    setPhase("walking");
  };

  if (phase === "invalid" || !file) {
    return (
      <FlowNotice code="C-02.01" title="We could not find that file" ends>
        <p>File not found, or the file reference is invalid. Nothing else is affected.</p>
        <NoticeActions>
          <AppButton href="/app">Return home</AppButton>
        </NoticeActions>
      </FlowNotice>
    );
  }

  if (phase === "unavailable") {
    const archived = file.status === "archived";
    return (
      <FlowNotice code="C-02.02" title="This file is unavailable" ends>
        <p>
          {file.name} — <span className="font-medium text-navy">{archived ? "File archived" : "File deleted"}</span>. Restore it from Files to
          open it again — nothing inside it has been removed.
        </p>
        <NoticeActions>
          <AppButton href={`/app/files?view=${archived ? "archived" : "deleted"}`}>
            {archived ? "Go to archived files" : "Go to recently deleted"}
          </AppButton>
          <AppButton href="/app" variant="outline">
            Return home
          </AppButton>
        </NoticeActions>
      </FlowNotice>
    );
  }

  if (phase === "tool") {
    return (
      <FlowNotice code="C-02.04" title="This file's tool is unavailable" ends>
        <p>Its tool has been removed. {file.name} is safe — it always keeps its tool, so it opens again as soon as the tool is back.</p>
        <NoticeActions>
          <AppButton href="/contact">Contact support</AppButton>
          <AppButton href="/app" variant="outline">
            Return home
          </AppButton>
        </NoticeActions>
      </FlowNotice>
    );
  }

  if (phase === "recovery") {
    const rows: [string, string][] = [
      ["Last saved state", `${file.version ? `Version ${file.version}` : "No versions yet"} · saved ${timeAgo(file.savedAt ?? file.lastEditedAt).toLowerCase()}`],
      ["Recovered changes", recoveredChanges(file)],
      ["Recovered from", timeAgo(file.recovery?.capturedAt ?? file.lastEditedAt)],
    ];
    return (
      <FlowNotice code="C-02.06" title="Recovered work is available" tone="info">
        <p>{file.name} has changes from a session that ended before they were saved. Which state should open?</p>
        <dl className="mt-4 divide-y divide-line rounded-control border border-line bg-white">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="text-right text-[13px] font-medium text-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <NoticeActions>
          <button type="button" onClick={() => resume("recovered")} className={appButtonPrimary}>
            <IconArrowCounterClockwise size={15} />
            Restore recovered state
          </button>
          <button type="button" onClick={() => resume("saved")} className={appButtonOutline}>
            <IconClockCounterClockwise size={15} />
            Load last saved state
          </button>
        </NoticeActions>
        <p className="mt-4 text-[12px] leading-5 text-muted">
          Either way nothing is thrown away: if you load the saved state, the recovered changes stay with the file until you discard them in the
          editor.
        </p>
      </FlowNotice>
    );
  }

  const project = projects.find((p) => p.id === file.projectId);
  const steps = [
    "Loading the file",
    "Checking access",
    tool ? `Resolving its tool — ${tool.name}` : "Resolving its tool",
    "Loading the tool workflow",
    restore === "recovered" ? "Restoring your recovered work" : "Restoring your last saved work",
    "Opening the file",
  ];
  return (
    <div className="px-5 py-10 sm:px-0">
      <ScreenCode code={codes[Math.min(step, 5)]} state={`Opening file · from ${from}`} />
      {tool && <p className="eyebrow text-ember">{tool.name}</p>}
      <h1 className="mt-2.5 text-[clamp(1.4rem,5vw,1.9rem)] leading-tight font-semibold text-navy">Opening {file.name}.</h1>
      {(project || projectId) && <p className="mt-2 text-[13px] text-muted">In “{project?.name ?? "a project"}”</p>}
      <div className="mt-7 max-w-sm">
        <FlowSteps steps={steps} active={step} />
      </div>
    </div>
  );
}
