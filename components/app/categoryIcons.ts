import { IconBuildings, IconHouseLine, IconImage, IconTree } from "@/components/app/AppIcons";
import type { ToolCategoryId } from "@/lib/mock/tools";

// The glyph each tool category carries on its filter chip (Tool library, Files).
export const categoryIcons: Record<ToolCategoryId, typeof IconHouseLine> = {
  interior: IconHouseLine,
  exterior: IconTree,
  staging: IconBuildings,
  enhancement: IconImage,
};
