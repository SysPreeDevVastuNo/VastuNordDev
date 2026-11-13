"use client";

import OutdoorScene from "@/app/app/editor/[fileId]/_tools/outdoor/OutdoorScene";

export default function OutdoorVisualization({ fileId }: { fileId: string }) {
  return <OutdoorScene fileId={fileId} variant="outdoor" />;
}
