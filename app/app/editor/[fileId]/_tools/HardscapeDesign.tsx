"use client";

import OutdoorScene from "@/app/app/editor/[fileId]/_tools/outdoor/OutdoorScene";

export default function HardscapeDesign({ fileId }: { fileId: string }) {
  return <OutdoorScene fileId={fileId} variant="hardscape" />;
}
