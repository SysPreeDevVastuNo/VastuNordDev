import ProjectDashboard from "@/app/app/(shell)/projects/[projectId]/ProjectDashboard";

// C-06 Project dashboard: `/app/projects/<id>`.
export default async function ProjectPage({ params }: PageProps<"/app/projects/[projectId]">) {
  const { projectId } = await params;
  return <ProjectDashboard key={projectId} projectId={projectId} />;
}
