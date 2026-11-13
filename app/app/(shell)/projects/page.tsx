import ProjectCollection, { type ProjectView } from "@/app/app/(shell)/projects/ProjectCollection";

const views: ProjectView[] = ["active", "archived", "deleted"];

// `?tab=deleted` (after deleting a project from its dashboard) opens on that tab.
export default async function ProjectsPage({ searchParams }: PageProps<"/app/projects">) {
  const { tab } = await searchParams;
  const initialView = views.find((v) => v === tab) ?? "active";
  return <ProjectCollection initialView={initialView} />;
}
