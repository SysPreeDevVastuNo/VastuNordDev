import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/app/AppIcons";
import { FileStatusBadge, FileToolLine } from "@/components/app/FileMeta";
import { fileThumbnail, inlineLabel, type StudioFile } from "@/lib/mock/entities";
import { toolById } from "@/lib/mock/tools";

const cardClass =
  "group flex w-full items-center gap-4 rounded-card border border-navy/12 bg-shell p-3 text-left transition-[border-color,background-color] duration-200 ease-out-soft hover:border-navy/30 hover:bg-white sm:p-3.5";

// A file as a wide row with a square thumbnail and "Continue" (Search results,
// a tool's "Your files made with this tool"). Pass `href` to make it a link,
// or `onOpen` when opening has to do something first.
export default function FileRowCard({
  file,
  href,
  onOpen,
}: { file: StudioFile } & ({ href: string; onOpen?: never } | { onOpen: () => void; href?: never })) {
  const label = `${href ? "Continue " : ""}${file.name}, ${toolById(file.toolId)?.name}`;
  const body = (
    <>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream sm:size-24">
        <Image src={fileThumbnail(file)} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <FileStatusBadge file={file} />
          <FileToolLine file={file} />
        </div>
        <h3 className="font-display text-[15px] leading-snug font-medium text-navy">{file.name}</h3>
        <p className="truncate text-xs text-muted">Edited {inlineLabel(file.lastEdited)}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
          Continue
          <IconArrowRight className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );

  return (
    <div className="relative h-full">
      {href ? (
        <Link href={href} aria-label={label} className={cardClass}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onOpen} aria-label={label} className={cardClass}>
          {body}
        </button>
      )}
    </div>
  );
}
