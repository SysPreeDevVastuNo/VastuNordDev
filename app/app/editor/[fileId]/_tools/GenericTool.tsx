"use client";

import { PanelSection } from "@/app/app/editor/[fileId]/_ui/controls";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { summarize } from "@/app/app/editor/[fileId]/_tools/defs";
import { toolById, toolCategories } from "@/lib/mock/tools";

// Placeholder for a tool whose own panel is not built yet: photo, reference
// and description work; the tool's settings section says it is coming.
export default function GenericTool({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const screen = useToolScreen(s);
  const tool = s.file ? toolById(s.file.toolId) : undefined;
  const name = tool?.name ?? "Tool";
  const category = toolCategories.find((c) => c.id === tool?.category)?.label ?? "";
  const prompt = String(s.working.params.prompt ?? "");
  return (
    <ToolScreen
      screen={screen}
      toolName={name}
      intro={{ eyebrow: category, bullets: ["Upload a photo. A phone photo is fine.", "Describe what you want to change.", "Generate."] }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Describe the change", short: "Describe" },
        { label: "Generate", short: "Generate" },
      ]}
      described={!!prompt.trim()}
      canGenerate={!!s.working.sourceImage}
      summary={() => summarize(s.def, s.working.params)}
      generateLabel={{ first: s.def.labels.generate, again: "Regenerate" }}
      phases={["Reading the photo", "Working on it", "Finishing"]}
      prompt={{ title: "Describe the change", label: "Describe the change", placeholder: "What should change…" }}
    >
      <PanelSection title="Tool settings">
        <p className="text-[12px] leading-5 text-cream/55">{name}’s own settings are still being built. Your photo and description are saved with this file.</p>
      </PanelSection>
    </ToolScreen>
  );
}
