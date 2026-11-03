import clsx from "clsx";
import type { StudioFile } from "@/lib/mock/entities";
import { toolById, toolCategories } from "@/lib/mock/tools";

// Status pill and "TOOL · Category" line that file cards carry (Files, Search).

export function FileStatusBadge({ file }: { file: StudioFile }) {
  const [label, tone] =
    file.status === "deleted"
      ? ["Deleted", "bg-ember/12 text-ember"]
      : file.status === "archived"
        ? ["Archived", "bg-line text-muted"]
        : file.recovery
          ? ["Recovery available", "bg-ember/12 text-ember"]
          : file.status === "draft"
            ? ["Draft", "bg-line text-body"]
            : ["Active", "bg-navy/8 text-navy"];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[10px] font-semibold tracking-[0.08em] uppercase",
        tone
      )}
    >
      {file.recovery && file.status !== "deleted" && <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}

export function FileToolLine({ file }: { file: StudioFile }) {
  const tool = toolById(file.toolId);
  const category = toolCategories.find((c) => c.id === tool?.category);
  return (
    <p className="flex min-w-0 items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
      <span className="truncate">{tool?.name}</span>
      {category && (
        <span className="shrink-0 rounded-full border border-navy/15 px-2 py-px text-[10px] tracking-[0.06em] text-navy/70 normal-case">
          {category.label}
        </span>
      )}
    </p>
  );
}
