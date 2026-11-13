import { redirect } from "next/navigation";
import CreatingFile from "@/app/app/(shell)/new/CreatingFile";
import { toolById } from "@/lib/mock/tools";

// C-01 Create file: `/app/new?tool=<id>[&project=<id>]` walks the creation
// steps, then opens the new file in the editor. No tool goes back to the library.
export default async function NewFilePage({ searchParams }: PageProps<"/app/new">) {
  const { tool, project } = await searchParams;
  const toolId = typeof tool === "string" ? tool : "";
  const projectId = typeof project === "string" ? project : undefined;
  if (!toolId) redirect(projectId ? `/app/library?project=${projectId}` : "/app/library");
  return <CreatingFile key={`${toolId}:${projectId ?? ""}`} toolId={toolId} projectId={projectId} known={!!toolById(toolId)} />;
}
