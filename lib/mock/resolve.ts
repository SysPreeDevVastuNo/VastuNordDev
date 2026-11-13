"use client";

import { useVersionLookup } from "@/lib/mock/history";
import { useStudio } from "@/lib/mock/store";

export type ResolvedItem = {
  fileId: string;
  fileName: string;
  versionId: string;
  versionNumber: number;
  resultId: string;
  image: string;
  /** The original photo, for before & after. */
  before: string;
  /** False when the file or version is gone. */
  exists: boolean;
};

/** Turns a link item or a download (file + version) into what it shows: names, numbers and images. */
export function useResolveItem() {
  const { files } = useStudio();
  const lookup = useVersionLookup();
  return (item: { fileId: string; versionId: string }): ResolvedItem => {
    const file = files.find((f) => f.id === item.fileId);
    const found = lookup(item.versionId);
    return {
      fileId: item.fileId,
      fileName: file?.name ?? "A file that no longer exists",
      versionId: item.versionId,
      versionNumber: found?.version.number ?? 0,
      resultId: found?.version.resultId ?? "",
      image: found?.image ?? "",
      before: file?.sourceImage ?? "",
      exists: !!(file && found?.image),
    };
  };
}
