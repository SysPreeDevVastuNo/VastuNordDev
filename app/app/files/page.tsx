import FileGrid from "@/app/app/files/FileGrid";
import { fileViews, type FileView } from "@/app/app/files/views";

// `?view=archived` (Home's "Archived & deleted files" link) opens on that tab.
export default async function FilesPage({ searchParams }: PageProps<"/app/files">) {
  const { view } = await searchParams;
  const initialView = fileViews.find((v) => v.id === view)?.id ?? ("active" satisfies FileView);
  return <FileGrid initialView={initialView} />;
}
