"use client";

import { useState } from "react";
import clsx from "clsx";
import { z } from "zod";
import { IconCheckBold } from "@/components/app/AppIcons";
import ScreenCode from "@/components/app/ScreenCode";
import { SheetActions, SheetTitle } from "@/components/app/Sheet";
import { projectLabels, type Project } from "@/lib/mock/entities";
import { createProject, findActiveProjectByName } from "@/lib/mock/store";

/** File and project names: trimmed, 1–60 characters. */
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name required.")
  .max(60, "Name too long — keep it under 60 characters.");

/** Comma-separated tags → a de-duplicated list of at most 10. */
export const tagsSchema = z
  .string()
  .transform((s) => [...new Set(s.split(",").map((t) => t.trim()).filter(Boolean))])
  .pipe(z.array(z.string().max(30, "Keep each tag under 30 characters.")).max(10, "Use at most 10 tags."));

export const descriptionSchema = z.string().trim().max(280, "Keep the description under 280 characters.");

const projectSchema = z.object({ name: nameSchema, description: descriptionSchema, tags: tagsSchema });

/** The label toggles (Create project, Manage project). */
export function LabelPicker({ value, onToggle }: { value: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {projectLabels.map((label) => {
        const on = value.includes(label.id);
        return (
          <button
            key={label.id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(label.id)}
            style={on ? { backgroundColor: label.color } : undefined}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors duration-200",
              on ? "border-transparent text-white" : "border-line text-body hover:border-navy/30"
            )}
          >
            {on && <IconCheckBold />}
            {label.name}
          </button>
        );
      })}
    </div>
  );
}

type Errors = Partial<Record<"name" | "description" | "tags", string>>;

const field =
  "mt-2 w-full rounded-control border bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]";
const fieldTone = (error?: string) => (error ? "border-ember" : "border-line focus:border-navy/40");

// C-05.01 — new project. Opened from Projects, or from a file's "Create New
// Project" (`forFile`), where a name that already exists reuses that project.
export default function CreateProjectForm({
  forFile = false,
  onCancel,
  onClose,
  onCreated,
}: {
  forFile?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const [values, setValues] = useState({ name: "", description: "", tags: "" });
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };
  const toggleLabel = (id: string) =>
    setLabelIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const submit = () => {
    const parsed = projectSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(next);
      return;
    }
    const existing = findActiveProjectByName(parsed.data.name);
    if (existing && forFile) return onCreated(existing);
    if (existing) return setErrors({ name: "You already have a project with this name." });
    onCreated(createProject({ ...parsed.data, labelIds }));
  };

  return (
    <>
      <SheetTitle title={forFile ? "Create a project for this File" : "Create project"} onClose={onClose} />
      <ScreenCode code={forFile ? "C-04.03 → C-05.01" : "C-05.01"} state="Create project" />
      <div className="space-y-4">
        <div>
          <label htmlFor="project-name" className="text-sm font-medium text-navy">
            Project Name
          </label>
          <input
            id="project-name"
            value={values.name}
            onChange={set("name")}
            placeholder="Smith Residence"
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "project-name-error" : undefined}
            className={clsx(field, fieldTone(errors.name))}
          />
          {errors.name && (
            <p id="project-name-error" className="mt-1.5 text-[13px] text-ember">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="project-description" className="text-sm font-medium text-navy">
            Description <span className="font-normal text-faint">(optional)</span>
          </label>
          <textarea
            id="project-description"
            rows={2}
            value={values.description}
            onChange={set("description")}
            placeholder="What this project is for"
            aria-invalid={!!errors.description || undefined}
            className={clsx(field, "resize-none", fieldTone(errors.description))}
          />
          {errors.description && <p className="mt-1.5 text-[13px] text-ember">{errors.description}</p>}
        </div>
        <div>
          <p className="text-sm font-medium text-navy">
            Labels <span className="font-normal text-faint">(optional)</span>
          </p>
          <div className="mt-2">
            <LabelPicker value={labelIds} onToggle={toggleLabel} />
          </div>
        </div>
        <div>
          <label htmlFor="project-tags" className="text-sm font-medium text-navy">
            Tags <span className="font-normal text-faint">(optional, comma separated)</span>
          </label>
          <input
            id="project-tags"
            value={values.tags}
            onChange={set("tags")}
            placeholder="Renovation, Interior"
            aria-invalid={!!errors.tags || undefined}
            className={clsx(field, fieldTone(errors.tags))}
          />
          {errors.tags && <p className="mt-1.5 text-[13px] text-ember">{errors.tags}</p>}
        </div>
      </div>
      <SheetActions confirm="Create project" onConfirm={submit} onCancel={onCancel} />
    </>
  );
}
