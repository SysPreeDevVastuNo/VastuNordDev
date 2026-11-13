"use client";

import { useState } from "react";
import { Callout, Dropzone, FitImage, PanelSection, PinLayer, StageTag, type Pin } from "@/app/app/editor/[fileId]/_ui/controls";
import { glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { checkFile, readPhoto, useToolScreen, type UploadError } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { AddCard, AssetDialog, PieceRow, assetById, short, usePieces, type Piece } from "@/app/app/editor/[fileId]/_tools/pieces/kit";
import { mockImage } from "@/lib/mock/entities";

const GCube = glyph(
  "M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z",
  "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"
);

// The same copy ToolScreen shows for a failed photo upload.
const uploadErrors: Record<UploadError, { title: string; body: string }> = {
  unsupported: { title: "That file type will not work", body: "Use a JPEG, PNG or WEBP photo. Screenshots of a photo work too." },
  oversize: { title: "That photo is over 20 MB", body: "Export a smaller copy from your phone or camera app and try again." },
  failed: { title: "The upload did not go through", body: "Nothing was lost. Try again, or pick a photo you have used before from your assets." },
};

/** The piece action is the object's size. */
const sizes = [
  { value: "small", label: "Small" },
  { value: "life", label: "Life-size" },
  { value: "large", label: "Large" },
];
const sizeWord = (v: string) => (v === "small" ? "small" : v === "large" ? "large" : "life-size");

const info = {
  photo: "The photo the object goes into. Add other angles if you have them; the highlighted one is used.",
  prompt: "How the objects should sit: where, at what angle, in what light. Optional.",
  objects: "Required. Choose an object you have, or upload a photo of one, then tap where it goes.",
};

const scene = mockImage("3a82a11603438139b4485d7a453302df8f17af25-1600x1076.png");
const demoPins: Pin[] = [
  { id: "d1", at: { x: 28, y: 78 }, n: 1, tone: "add", label: "+ Stone planter" },
  { id: "d2", at: { x: 64, y: 70 }, n: 2, tone: "add", label: "+ Timber bench" },
];

export default function ObjectPlacement({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { working, run } = s;
  const p = working.params;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const kit = usePieces(s, {
    key: "objects",
    read: () => "Object",
    defaultAction: "life",
    addAction: "life",
    addLabel: "Object",
    readable: true,
    unclearLabel: "Object",
  });
  const screen = useToolScreen(s, { onPhotoChange: kit.reset, onBeforeGenerate: kit.exit });
  const showSource = () => {
    screen.setView("source");
    screen.showStage();
  };

  const { pieces } = kit;
  const prompt = String(p.prompt ?? "");
  const canGenerate = !!working.sourceImage && pieces.length > 0;

  const describe = (x: Piece) =>
    `a ${sizeWord(x.action)} ${(assetById(x.assetId)?.name ?? x.label).toLowerCase()}${x.note.trim() ? ` (${x.note.trim()})` : ""}`;
  const summary = () => prompt.trim() || `Placed ${pieces.map(describe).join(", ")}`;

  /** An object photo from the device: read it, then tap it onto the scene. */
  const uploadObject = (files: File[]) => {
    setUploadError(null);
    const file = files[0];
    const problem = file ? checkFile(file) : "failed";
    if (problem) return setUploadError(problem);
    setUploading(true);
    run(async () => {
      try {
        const image = await readPhoto(file);
        const name =
          file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " ")
            .trim() || "Your object";
        kit.setPlacing({ id: `upload-${Date.now().toString(36)}`, name: name.charAt(0).toUpperCase() + name.slice(1), image });
        kit.setMode("add");
        showSource();
      } catch {
        setUploadError("failed");
      } finally {
        setUploading(false);
      }
    }, 0.8);
  };

  const pins: Pin[] = pieces.map((x, i) => ({ id: x.id, at: x.at, n: i + 1, tone: "add", label: `+ ${short(x.label)}` }));

  return (
    <>
      <ToolScreen
        screen={screen}
        place="outside"
        toolName="Object Placement"
        intro={{
          eyebrow: "Exterior & landscape",
          bullets: [
            "Upload a photo of the place the object should go.",
            "Choose the object from your assets, or upload a photo of it, and tap where it goes.",
            "Generate. It is placed at the right scale, in the photo’s own light and shadow.",
          ],
          before: scene,
          after: scene,
          demo: (
            <FitImage src={scene} alt="A backyard with two objects pinned where they would be placed">
              <PinLayer pins={demoPins} interactive={false} />
              <StageTag className="top-3 left-3">How it works</StageTag>
            </FitImage>
          ),
        }}
        steps={[
          { label: "Add your photo", short: "Photo" },
          { label: "Place the objects", short: "Objects" },
          { label: "Generate", short: "Generate" },
        ]}
        described={pieces.length > 0}
        canGenerate={canGenerate}
        blockedHint="Place at least one object to enable Generate"
        summary={summary}
        generateLabel={{ first: pieces.length > 1 ? `Place ${pieces.length} objects` : "Place the object", again: "Regenerate" }}
        phases={["Reading the scene and its light", "Keeping everything already there", "Placing the objects at scale", "Casting their shadows"]}
        photoInfo={info.photo}
        referenceInfo=""
        prompt={{
          title: "How should it sit?",
          info: info.prompt,
          label: "Describe how the objects should sit",
          placeholder: "Near the steps, catching the afternoon light, slightly angled to the path…",
          improve: (text) => {
            const built = pieces.length
              ? `Place ${pieces.map(describe).join(" and ")} where marked, at true scale, matching the light and shadows of the photo.`
              : "Place the object where marked, at true scale, matching the light and shadows of the photo.";
            return text.trim() ? `${text.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
          },
        }}
        marking={kit.marking(pins, {
          change: "Tap where it should go",
          add: "Tap where it should go",
          placing: (a) => `Tap where the ${a.name.toLowerCase()} should go`,
        })}
        sourceOverlay={pins.length ? <PinLayer pins={pins} selectedId={kit.selectedId} interactive={false} /> : null}
      >
        <PanelSection title="Objects" info={info.objects} meta={pieces.length ? `${pieces.length} placed` : "Required"}>
          <div className="space-y-2">
            <AddCard
              kit={kit}
              icon={GCube}
              title="Place an object"
              hint="Choose one you have, then tap where it goes."
              assetsLink="Choose from your objects"
              disabled={!working.sourceImage}
              onEnter={showSource}
            />
            {uploadError && (
              <Callout tone="error" title={uploadErrors[uploadError].title} onDismiss={() => setUploadError(null)}>
                {uploadErrors[uploadError].body}
              </Callout>
            )}
            {working.sourceImage && (
              <Dropzone
                compact
                multiple={false}
                title="Or upload a photo of the object"
                hint="A product shot on a plain background works best"
                onFiles={uploadObject}
                busy={uploading}
              />
            )}
            {pieces.length > 0 ? (
              <div className="space-y-2 pt-1">
                {pieces.map((x, i) => (
                  <PieceRow
                    key={x.id}
                    n={i + 1}
                    piece={x}
                    tone="add"
                    actions={sizes}
                    selected={x.id === kit.selectedId}
                    title={x.label}
                    placeholder="How it sits: angled to the path, in partial shade…"
                    onSelect={() => kit.setSelectedId(x.id)}
                    onChange={(patch) => kit.update(x.id, patch)}
                    onRemove={() => kit.remove(x.id)}
                    onPickAsset={() => kit.setAssetFor(x.id)}
                  />
                ))}
              </div>
            ) : working.sourceImage ? (
              <p className="pt-1 text-[11.5px] leading-5 text-cream/45">Nothing placed yet. Generate needs at least one object.</p>
            ) : null}
          </div>
        </PanelSection>
      </ToolScreen>
      <AssetDialog kit={kit} type="object" noun="objects" onPlace={showSource} />
    </>
  );
}
