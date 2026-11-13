"use client";

import { useState } from "react";
import clsx from "clsx";
import { appButtonOutline, appButtonPrimary } from "@/components/app/AppButton";
import { descriptionSchema, LabelPicker, nameSchema, tagsSchema } from "@/components/app/CreateProjectForm";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, { SheetTitle } from "@/components/app/Sheet";
import { projectLabels, type Project } from "@/lib/mock/entities";
import { archiveProject, restoreProject, setProjectPinned, updateProjectDetails } from "@/lib/mock/store";
import { TextField, useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

type Feedback = { tone: "error" | "success"; text: string };
type Key = "rename" | "description" | "labels" | "pin" | "restore";

const quiet = clsx(appButtonOutline, "mt-2 w-full");

function Section({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-navy">{title}</h3>
        <code className="font-display text-[10px] tracking-[0.08em] text-faint">{code}</code>
      </div>
      {children}
    </section>
  );
}

// C-07 — the dashboard's project actions: rename, description, labels and
// tags, pin, archive or restore, then duplicate and delete (their own dialogs).
export default function ProjectSettings({
  open,
  project,
  onClose,
  onArchived,
  onDuplicate,
  onDelete,
}: {
  open: boolean;
  project: Project;
  onClose: () => void;
  onArchived: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="project-settings-title" maxWidth="28rem">
      {/* Remounts on open, so every field starts from the project as it is now. */}
      {open && (
        <SettingsBody
          project={project}
          onClose={onClose}
          onArchived={onArchived}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
    </Sheet>
  );
}

function SettingsBody({
  project,
  onClose,
  onArchived,
  onDuplicate,
  onDelete,
}: {
  project: Project;
  onClose: () => void;
  onArchived: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const wait = useWait();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [labelIds, setLabelIds] = useState(project.labels.map((l) => l.id));
  const [tags, setTags] = useState(project.tags.join(", "));
  const [feedback, setFeedback] = useState<Partial<Record<Key, Feedback>>>({});
  const [confirmArchive, setConfirmArchive] = useState(false);

  const say = (key: Key, f: Feedback) => setFeedback((all) => ({ ...all, [key]: f }));

  const saveName = () => {
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) return say("rename", { tone: "error", text: parsed.error.issues[0].message });
    wait(() => {
      updateProjectDetails(project.id, { name: parsed.data });
      say("rename", { tone: "success", text: "Project name updated." });
    }, 0.4);
  };

  const saveDescription = () => {
    const parsed = descriptionSchema.safeParse(description);
    if (!parsed.success) return say("description", { tone: "error", text: parsed.error.issues[0].message });
    wait(() => {
      updateProjectDetails(project.id, { description: parsed.data || undefined });
      say("description", { tone: "success", text: "Description updated." });
    }, 0.4);
  };

  const saveLabels = () => {
    const parsed = tagsSchema.safeParse(tags);
    if (!parsed.success) return say("labels", { tone: "error", text: parsed.error.issues[0].message });
    wait(() => {
      updateProjectDetails(project.id, {
        labels: projectLabels.filter((l) => labelIds.includes(l.id)),
        tags: parsed.data,
      });
      say("labels", { tone: "success", text: "Labels and tags updated." });
    }, 0.4);
  };

  const togglePin = () =>
    wait(() => {
      setProjectPinned(project.id, !project.pinned);
      say("pin", {
        tone: "success",
        text: project.pinned ? "Unpinned — display priority updated." : "Pinned — it now sorts first.",
      });
    }, 0.3);

  const archive = () =>
    wait(() => {
      archiveProject(project.id);
      onArchived();
    }, 0.4);

  const restore = () =>
    wait(() => {
      restoreProject(project.id);
      say("restore", { tone: "success", text: "End: Project Restored — back in your active projects." });
    }, 0.4);

  const status = (key: Key) => {
    const f = feedback[key];
    return f ? (
      <p
        role="status"
        className={clsx(
          "mt-2 flex flex-wrap items-center gap-x-2 text-[13px]",
          f.tone === "error" ? "text-ember" : "text-navy"
        )}
      >
        {f.text}
      </p>
    ) : null;
  };

  return (
    <>
      <ScreenCode code="C-07.01" state="Project actions" />
      <SheetTitle title="Project actions" onClose={onClose} />
      <p id="project-settings-title" className="sr-only">
        Project actions for {project.name}
      </p>
      <div className="space-y-5">
        <Section title="Rename" code="C-07.02">
          <p className="mb-2 text-xs text-muted">Current name: {project.name}</p>
          <TextField label="New name" value={name} onChange={setName} />
          <button type="button" onClick={saveName} className={quiet}>
            Save name
          </button>
          {status("rename")}
        </Section>

        <Section title="Edit description" code="C-07.03">
          <textarea
            aria-label="New description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-control border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:border-navy/40 focus:shadow-none focus:outline-none sm:text-[15px]"
          />
          <button type="button" onClick={saveDescription} className={quiet}>
            Save description
          </button>
          {status("description")}
        </Section>

        <Section title="Labels & tags" code="C-07.04">
          <LabelPicker
            value={labelIds}
            onToggle={(id) => setLabelIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))}
          />
          <div className="mt-3">
            <TextField label="Tags" hint="Comma separated" value={tags} onChange={setTags} />
          </div>
          <button type="button" onClick={saveLabels} className={quiet}>
            Save labels & tags
          </button>
          {status("labels")}
        </Section>

        <Section title="Pin" code="C-07.05">
          <button
            type="button"
            onClick={togglePin}
            aria-pressed={project.pinned}
            className="flex w-full items-center justify-between rounded-control border border-line px-4 py-3 text-left transition-colors duration-200 hover:border-navy/30"
          >
            <span className="font-display text-[13px] font-medium text-navy">
              {project.pinned ? "Unpin project" : "Pin project"}
            </span>
            <span className="text-xs text-muted">{project.pinned ? "Pinned" : "Unpinned"}</span>
          </button>
          {status("pin")}
        </Section>

        {project.status === "archived" ? (
          <Section title="Restore" code="C-07.07">
            <button type="button" onClick={restore} className={clsx(appButtonOutline, "w-full")}>
              Restore project
            </button>
            {status("restore")}
          </Section>
        ) : (
          <Section title="Archive" code="C-07.06">
            {confirmArchive ? (
              <div className="rounded-control border border-ember/30 bg-ember/5 p-4">
                <p className="text-[13px] leading-6 text-body">
                  Project will be removed from active Project views. Associated Files remain intact.
                </p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={archive} className={clsx(appButtonPrimary, "flex-1")}>
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmArchive(false)}
                    className={clsx(appButtonOutline, "flex-1")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmArchive(true)}
                className={clsx(appButtonOutline, "w-full")}
              >
                Archive project
              </button>
            )}
          </Section>
        )}

        <div className="space-y-2.5 border-t border-line pt-5">
          <button type="button" onClick={onDuplicate} className={clsx(appButtonOutline, "w-full")}>
            Duplicate project
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-control border border-ember/30 px-4 py-3 text-sm font-semibold text-ember transition-colors duration-200 hover:border-ember hover:bg-ember/5"
          >
            Delete project
          </button>
        </div>
      </div>
    </>
  );
}
