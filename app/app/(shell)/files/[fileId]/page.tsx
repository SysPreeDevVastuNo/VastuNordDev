import OpeningFile from "@/app/app/(shell)/files/[fileId]/OpeningFile";

// C-02 Open / continue file: `/app/files/<id>[?from=…&project=…]` checks the
// file, its access and its tool, offers recovered work, then opens the editor.
export default async function OpenFilePage({ params, searchParams }: PageProps<"/app/files/[fileId]">) {
  const { fileId } = await params;
  const { from, project } = await searchParams;
  return (
    <OpeningFile
      key={fileId}
      fileId={fileId}
      from={typeof from === "string" ? from : "continue-working"}
      projectId={typeof project === "string" ? project : undefined}
    />
  );
}
