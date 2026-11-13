"use client";

import { useState } from "react";
import Image from "next/image";
import ScreenCode from "@/components/app/ScreenCode";
import Sheet, { SheetTitle } from "@/components/app/Sheet";
import { fileThumbnail, type Project, type StudioFile } from "@/lib/mock/entities";
import { setFileProject, useStudio } from "@/lib/mock/store";
import { toolById } from "@/lib/mock/tools";
import { useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

// C-06.06 → C-04.04 — bring an independent file into this project.
export default function AddExistingFile({ open, project, onClose }: { open: boolean; project: Project; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="add-file-title" maxWidth="26rem">
      {open && <AddFileBody project={project} onClose={onClose} />}
    </Sheet>
  );
}

function AddFileBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const { files } = useStudio();
  const wait = useWait();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const independent = files.filter((f) => !f.projectId && (f.status === "active" || f.status === "draft"));
  const q = query.trim().toLowerCase();
  const shown = q ? independent.filter((f) => f.name.toLowerCase().includes(q)) : independent;

  const add = (file: StudioFile) => {
    setPending(true);
    wait(() => {
      setFileProject(file.id, project.id);
      onClose();
    }, 0.5);
  };

  return (
    <>
      <ScreenCode code="C-06.06 → C-04.04" state="Add existing file" />
      <SheetTitle title="Add an existing file" onClose={onClose} />
      <p id="add-file-title" className="-mt-2 mb-4 text-[13px] text-muted">
        Independent files can join “{project.name}”.
      </p>
      <label className="mb-3 flex items-center gap-2.5 rounded-control border border-line bg-shell px-3.5 py-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search independent files"
          aria-label="Search independent files"
          className="w-full rounded-none border-0 bg-transparent p-0 text-base text-ink placeholder:text-faint focus:shadow-none focus:outline-none sm:text-[15px]"
        />
      </label>
      {shown.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-muted">
          {independent.length === 0 ? "Every file already belongs to a project." : "No files match."}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {shown.map((file) => {
            const thumb = fileThumbnail(file);
            return (
              <li key={file.id}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => add(file)}
                  className="flex w-full items-center gap-3 rounded-control p-2.5 text-left transition-colors duration-200 hover:bg-shell disabled:opacity-60"
                >
                  {thumb ? (
                    <Image src={thumb} alt="" width={44} height={44} className="size-11 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="size-11 shrink-0 rounded-lg bg-cream" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[13px] font-medium text-navy">{file.name}</span>
                    <span className="block text-xs text-muted">{toolById(file.toolId)?.name}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
