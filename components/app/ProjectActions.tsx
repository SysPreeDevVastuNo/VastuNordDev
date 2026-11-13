"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appButtonNavy } from "@/components/app/AppButton";
import {
  IconArchive,
  IconArrowCounterClockwise,
  IconFolderOpen,
  IconInfo,
  IconPushPin,
  IconTrash,
  IconWarning,
} from "@/components/app/AppIcons";
import Sheet, { SheetConfirm, SheetMenu, SheetTitle, type SheetMenuEntry } from "@/components/app/Sheet";
import type { Project } from "@/lib/mock/entities";
import { archiveProject, purgeProject, restoreProject, setProjectPinned } from "@/lib/mock/store";

// Actions for one project card: open / pin / archive while active, restore
// once archived, restore or delete for good once deleted.
export default function ProjectActions({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  return open ? <ProjectActionsSheet project={project} onClose={onClose} /> : null;
}

function ProjectActionsSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const router = useRouter();
  const [view, setView] = useState<"menu" | "archive" | "purge">("menu");
  const run = (action: () => void) => () => {
    action();
    onClose();
  };

  const items: SheetMenuEntry[] =
    project.status === "active"
      ? [
          { label: "Open project", Icon: IconFolderOpen, onSelect: () => router.push(`/app/projects/${project.id}`) },
          {
            label: project.pinned ? "Unpin" : "Pin",
            Icon: IconPushPin,
            onSelect: run(() => setProjectPinned(project.id, !project.pinned)),
          },
          { label: "Archive", Icon: IconArchive, onSelect: () => setView("archive") },
        ]
      : [
          { label: "Restore project", Icon: IconArrowCounterClockwise, onSelect: run(() => restoreProject(project.id)) },
          ...(project.status === "deleted"
            ? [{ label: "Delete permanently", Icon: IconTrash, onSelect: () => setView("purge"), danger: true }]
            : []),
        ];

  return (
    <Sheet open onClose={onClose} maxWidth={view === "menu" ? "24rem" : "26rem"} labelledBy="project-menu-title">
      {view === "menu" && (
        <>
          <SheetTitle title={project.name} onClose={onClose} />
          <p id="project-menu-title" className="sr-only">
            Actions for {project.name}
          </p>
          <SheetMenu items={items} />
        </>
      )}
      {view === "archive" && (
        <SheetConfirm
          icon={<IconInfo size={20} />}
          title={`Archive “${project.name}”?`}
          body="Project will be removed from active Project views. Associated Files remain intact."
          confirm="Archive"
          confirmClass={appButtonNavy}
          onConfirm={run(() => archiveProject(project.id))}
          onCancel={() => setView("menu")}
        />
      )}
      {view === "purge" && (
        <SheetConfirm
          icon={<IconWarning />}
          tone="ember"
          title="Delete this project permanently?"
          body={`“${project.name}” goes for good and can’t be restored. Its files are not deleted — they stay in Files as independent files.`}
          confirm="Delete permanently"
          onConfirm={run(() => purgeProject(project.id))}
          onCancel={() => setView("menu")}
        />
      )}
    </Sheet>
  );
}
