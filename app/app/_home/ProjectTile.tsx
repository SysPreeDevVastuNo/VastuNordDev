import Image from "next/image";
import Link from "next/link";
import { IconCaretRight, IconPushPinFill } from "@/components/app/AppIcons";
import { inlineLabel, projectFileCount, type Project } from "@/lib/mock/entities";

// Cover-image project card for the Home "Recent projects" rail.
export default function ProjectTile({ project }: { project: Project }) {
  const files = projectFileCount(project.id);
  return (
    <Link
      href={`/app/projects/${project.id}`}
      className="group flex h-full flex-col rounded-card border border-line bg-white p-2.5 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30"
    >
      <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-cream">
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 72vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <span className="flex items-center gap-1.5">
          <h3 className="truncate font-display text-[15px] leading-snug font-medium text-navy">{project.name}</h3>
          {project.pinned && (
            <>
              <IconPushPinFill className="shrink-0 text-ember" />
              <span className="sr-only">Pinned</span>
            </>
          )}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">
            {files} {files === 1 ? "file" : "files"} · Updated {inlineLabel(project.lastUpdated)}
          </span>
          <IconCaretRight className="shrink-0 transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
