import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  IconArrowRight,
  IconDotsThreeVertical,
  IconFolderFill,
  IconFolderPlus,
} from "@/components/app/AppIcons";
import { fileThumbnail, inlineLabel, projectById, type StudioFile } from "@/lib/mock/entities";
import { toolById } from "@/lib/mock/tools";

// A "Continue working" card. The whole card opens the file; the project chip
// and the actions button sit above that link. Their menus are not built yet.
export default function FileCard({ file }: { file: StudioFile }) {
  const tool = toolById(file.toolId);
  const project = projectById(file.projectId);

  return (
    <div className="group relative flex h-full w-full flex-col rounded-card border border-navy/12 bg-shell p-2 transition-[border-color,transform,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30 hover:bg-white">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-cream">
        <Image
          src={fileThumbnail(file)}
          alt=""
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 72vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-2.5">
        <h3 className="truncate font-display text-[14px] leading-snug font-medium text-navy">
          <Link
            href={`/app/files/${file.id}`}
            aria-label={`Continue ${file.name}, ${tool?.name}`}
            className="text-left after:absolute after:inset-0 after:z-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-ember"
          >
            {file.name}
          </Link>
        </h3>
        <p className="truncate text-[11px] text-muted">
          {tool?.name} · Edited {inlineLabel(file.lastEdited)}
        </p>
        <button
          type="button"
          aria-label={project ? `In project ${project.name}. Change project` : `Add ${file.name} to a project`}
          className={clsx(
            "relative z-10 mt-1 inline-flex min-h-7 max-w-full items-center gap-1.5 self-start rounded-full border px-2.5 text-[11px] transition-colors duration-200",
            project
              ? "border-navy/15 bg-white text-navy hover:border-navy/40"
              : "border-dashed border-navy/25 text-muted hover:border-navy/45 hover:text-navy"
          )}
        >
          {project ? <IconFolderFill className="shrink-0 text-navy/70" /> : <IconFolderPlus className="shrink-0" />}
          <span className="truncate">{project ? project.name : "Add to project"}</span>
        </button>
      </div>
      <span className="pointer-events-none mt-2.5 flex items-center justify-between rounded-control bg-navy px-3 py-2 text-[12px] font-semibold text-white transition-colors duration-200 ease-out-soft group-hover:bg-navy-ink">
        Continue
        <IconArrowRight className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
      </span>
      <button
        type="button"
        aria-label={`File actions for ${file.name}`}
        className="absolute top-3.5 right-3.5 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-colors duration-200 hover:bg-white"
      >
        <IconDotsThreeVertical />
      </button>
    </div>
  );
}
