"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AppButton from "@/components/app/AppButton";
import { IconSparkle } from "@/components/app/AppIcons";
import FlowSteps from "@/components/app/FlowSteps";
import { FlowNotice, NoticeActions } from "@/components/app/Notice";
import ScreenCode from "@/components/app/ScreenCode";
import { createFile, getStudio } from "@/lib/mock/store";
import { toolById, toolCategories, type ToolId } from "@/lib/mock/tools";

const steps = [
  "Checking you can create a file",
  "Creating the file",
  "Naming it and setting up its details",
  "Initializing the file state",
  "Loading the tool workflow",
  "Preparing the canvas and inputs",
  "Saving the initial state",
  "Opening the file",
];
const STEP_MS = 350;
/** The file is created when the walk reaches "Naming it…". */
const CREATE_AT = 2;

// Walks the eight C-01 steps, creates the draft on the way, then hands off to the editor.
export default function CreatingFile({ toolId, projectId, known }: { toolId: string; projectId?: string; known: boolean }) {
  const router = useRouter();
  const tool = toolById(toolId);
  const [active, setActive] = useState(0);
  const created = useRef<string | null>(null);

  useEffect(() => {
    if (!tool) return;
    if (active === CREATE_AT && !created.current) {
      const project = getStudio().projects.find((p) => p.id === projectId && p.status === "active");
      created.current = createFile({
        toolId: tool.id as ToolId,
        name: `Untitled ${tool.name}`,
        cover: tool.image,
        projectId: project?.id,
      });
    }
    const t = window.setTimeout(() => {
      if (active < steps.length - 1) setActive((s) => s + 1);
      else if (created.current) router.replace(`/app/editor/${created.current}`);
    }, STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, tool, projectId, router]);

  if (!known || !tool) {
    return (
      <FlowNotice code="C-01" title="Invalid tool">
        <p>The selection did not come through intact, so nothing was created. Pick a tool from the library and we will set it up.</p>
        <NoticeActions>
          <AppButton href={projectId ? `/app/library?project=${projectId}` : "/app/library"}>Return to Tool Library</AppButton>
        </NoticeActions>
      </FlowNotice>
    );
  }

  const category = toolCategories.find((c) => c.id === tool.category);
  return (
    <div className="px-5 py-6 sm:px-0">
      <div className="mx-auto max-w-[34rem]">
        <ScreenCode code={`C-01.0${active + 1}`} state="Creating file" />
        <p className="eyebrow text-ember">{category?.label ?? "Tool"}</p>
        <h1 className="mt-2.5 text-[clamp(1.4rem,5vw,1.9rem)] leading-tight font-semibold text-navy">Setting up {tool.name}.</h1>
        <div className="mt-8">
          <FlowSteps steps={steps} active={active} />
        </div>
        <div className="mt-8">
          <p className="flex items-center gap-2 text-[13px] text-muted">
            <IconSparkle size={14} className="animate-pulse text-ember" />
            This takes a moment. Nothing is generated yet.
          </p>
        </div>
      </div>
    </div>
  );
}
