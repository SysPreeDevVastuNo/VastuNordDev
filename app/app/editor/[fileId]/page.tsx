import type { Metadata } from "next";
import Editor from "@/app/app/editor/[fileId]/Editor";

export const metadata: Metadata = {
  title: "VastuNord Studio",
  robots: { index: false },
};

// The editor is full screen: it sits outside the (shell) group, so no sidebar or tab bar.
export default async function EditorPage({ params }: PageProps<"/app/editor/[fileId]">) {
  const { fileId } = await params;
  return <Editor key={fileId} fileId={fileId} />;
}
