"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import GenericTool from "@/app/app/editor/[fileId]/_tools/GenericTool";
import { useStudio } from "@/lib/mock/store";

type ToolComponent = React.ComponentType<{ fileId: string }>;
const loading = () => <div className="min-h-svh bg-stage" />;
const load = (importer: () => Promise<{ default: ToolComponent }>) => dynamic(importer, { loading });

// Each tool's editor loads on its own, so opening one file never pulls in the other sixteen.
const tools: Record<string, ToolComponent> = {
  "room-reimagination": load(() => import("@/app/app/editor/[fileId]/_tools/RoomReimagination")),
  "furniture-refresh": load(() => import("@/app/app/editor/[fileId]/_tools/FurnitureRefresh")),
  "decor-redefinition": load(() => import("@/app/app/editor/[fileId]/_tools/DecorRedefinition")),
  "material-refinement": load(() => import("@/app/app/editor/[fileId]/_tools/MaterialRefinement")),
  "seasonal-styling": load(() => import("@/app/app/editor/[fileId]/_tools/SeasonalStyling")),
  "virtual-home-staging": load(() => import("@/app/app/editor/[fileId]/_tools/VirtualHomeStaging")),
  "lighting-reimagination": load(() => import("@/app/app/editor/[fileId]/_tools/LightingReimagination")),
  "outdoor-visualization": load(() => import("@/app/app/editor/[fileId]/_tools/OutdoorVisualization")),
  "hardscape-design": load(() => import("@/app/app/editor/[fileId]/_tools/HardscapeDesign")),
  "garden-design": load(() => import("@/app/app/editor/[fileId]/_tools/GardenDesign")),
  "pool-redesign": load(() => import("@/app/app/editor/[fileId]/_tools/PoolRedesign")),
  "sky-transformation": load(() => import("@/app/app/editor/[fileId]/_tools/SkyTransformation")),
  "seasonal-transformation": load(() => import("@/app/app/editor/[fileId]/_tools/SeasonalTransformation")),
  "object-placement": load(() => import("@/app/app/editor/[fileId]/_tools/ObjectPlacement")),
  "resolution-enhancement": load(() => import("@/app/app/editor/[fileId]/_tools/ResolutionEnhancement")),
  "visual-cleanup": load(() => import("@/app/app/editor/[fileId]/_tools/VisualCleanup")),
  "perspective-correction": load(() => import("@/app/app/editor/[fileId]/_tools/PerspectiveCorrection")),
};

// D-00 Editor: opens the file's own tool. A missing file still renders the
// shell, which shows "This file is gone".
export default function Editor({ fileId }: { fileId: string }) {
  const { files } = useStudio();
  const file = files.find((f) => f.id === fileId);
  return createElement((file && tools[file.toolId]) || GenericTool, { fileId });
}
