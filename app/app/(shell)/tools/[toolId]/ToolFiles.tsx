"use client";

import AppButton from "@/components/app/AppButton";
import AppSection from "@/components/app/AppSection";
import { IconSparkle } from "@/components/app/AppIcons";
import EmptyState from "@/components/app/EmptyState";
import FileRowCard from "@/components/app/FileRowCard";
import { useStudio } from "@/lib/mock/store";

// "Your files made with this tool": live (active or draft) files, newest edit first.
export default function ToolFiles({ toolId, toolName, startHref }: { toolId: string; toolName: string; startHref: string }) {
  const { files } = useStudio();
  const mine = files
    .filter((f) => f.toolId === toolId && (f.status === "active" || f.status === "draft"))
    .sort((a, b) => b.lastEditedAt - a.lastEditedAt);

  return (
    <AppSection title="Your files made with this tool" count={mine.length} className="mt-12">
      {mine.length === 0 ? (
        <div className="px-5 sm:px-0">
          <EmptyState
            icon={<IconSparkle size={20} />}
            title={`Nothing made with ${toolName} yet`}
            body="Your first one starts with a photograph. Each file you make here stays separate from the others."
          >
            <AppButton href={startHref}>Start a new file</AppButton>
          </EmptyState>
        </div>
      ) : (
        <div className="grid gap-3 px-5 sm:grid-cols-2 sm:px-0">
          {mine.map((file) => (
            <FileRowCard key={file.id} file={file} href={`/app/files/${file.id}`} />
          ))}
        </div>
      )}
    </AppSection>
  );
}
