import type { Asset } from "@/app/app/editor/[fileId]/_ui/controls";
import { mockImage } from "@/lib/mock/entities";

// Objects already in the account (the prototype's asset library, minus room
// photos, which live in ToolScreen's photoAssets). Pieces tools offer them in
// "Choose from your … assets" and the per-piece "Use one from your assets".

export type AssetType = "furniture" | "decor" | "lighting" | "object";
export type PieceAsset = Asset & { type: AssetType };

export const pieceAssets: PieceAsset[] = [
  { id: "as-furn-1", type: "furniture", name: "Linen sofa", image: mockImage("289267f2310e46f9cbc8401b2f876aef191371f7-1536x1024.png") },
  { id: "as-furn-2", type: "furniture", name: "Oak dining set", image: mockImage("53811e1e2cd199389a7fdba37db66db06f6f8714-1536x1024.png") },
  { id: "as-decor-1", type: "decor", name: "Ceramic grouping", image: mockImage("671725f04c42e8e1f95e836a564c23efd45197cc-1500x1000.jpg") },
  { id: "as-decor-2", type: "decor", name: "Woven throw", image: mockImage("a41988e0dce447ac8c380d22efac2f34a751af41-1080x720.jpg") },
  { id: "as-light-1", type: "lighting", name: "Paper pendant", image: mockImage("c6dfafbcf288818cf0bf88bb2db36c9d33db780d-1536x1024.png") },
  { id: "as-light-2", type: "lighting", name: "Brass floor lamp", image: mockImage("c2161214bb390b5a6fb54bd14c1de74e7e2131e3-1535x1024.png") },
  { id: "as-obj-1", type: "object", name: "Stone planter", image: mockImage("77045f942e5fb6f35501791994a9ec2474dea837-1200x675.png") },
  { id: "as-obj-2", type: "object", name: "Timber bench", image: mockImage("144bd1d8129ab54640981c8e245ed07717d31bd3-800x533.png") },
];

export const assetsOf = (type: AssetType) => pieceAssets.filter((a) => a.type === type);

/** The library asset with this id, if any. */
export const assetById = (id?: string) => (id ? pieceAssets.find((a) => a.id === id) : undefined);
