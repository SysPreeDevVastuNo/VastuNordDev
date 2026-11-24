import { buildPrompt, knownTool } from "@/lib/ai/prompts";
import { generateImage, ProviderError } from "@/lib/ai/providers";

// One Generate run: the photo (and optional reference) arrive as multipart
// form data; the result comes back as a data: URL.
export const maxDuration = 180;

const MAX_BYTES = 15 * 1024 * 1024;

// Seed and library photos live on our Sanity CDN, which refuses browser
// fetches from other origins, so the browser sends their URL and we fetch them.
const ALLOWED_IMAGE_PREFIX = "https://cdn.sanity.io/images/5mo9wf71/production/";

async function photoFrom(form: FormData, field: string, signal: AbortSignal) {
  const file = form.get(field);
  if (file instanceof Blob && file.size > 0) return file;
  const url = String(form.get(`${field}Url`) ?? "");
  if (!url.startsWith(ALLOWED_IMAGE_PREFIX) || url.includes("..")) return undefined;
  const res = await fetch(url, { signal });
  return res.ok ? res.blob() : undefined;
}

const messages: Record<ProviderError["kind"], { status: number; message: string }> = {
  auth: { status: 502, message: "The rendering service refused our key. Please try again later." },
  config: { status: 503, message: "Rendering is not set up on this server yet." },
  credits: { status: 402, message: "The rendering service is out of credits." },
  rejected: { status: 422, message: "The rendering service could not use this photo or prompt. Try a different photo or wording." },
  busy: { status: 429, message: "The rendering service is busy. Try again in a minute." },
  failed: { status: 502, message: "The render did not finish. Try again." },
};

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Expected form data." }, { status: 400 });
  }
  const toolId = String(form.get("toolId") ?? "");
  if (!knownTool(toolId)) return Response.json({ error: "Unknown tool." }, { status: 400 });
  const image = await photoFrom(form, "image", request.signal);
  const reference = await photoFrom(form, "reference", request.signal);
  if (!image) return Response.json({ error: "A photo is required." }, { status: 400 });
  if (image.size > MAX_BYTES || (reference && reference.size > MAX_BYTES))
    return Response.json({ error: "Photos must be under 15 MB." }, { status: 413 });

  const hasReference = !!reference;
  const prompt = buildPrompt({
    toolId,
    summary: String(form.get("summary") ?? ""),
    prompt: String(form.get("prompt") ?? ""),
    negative: String(form.get("negative") ?? ""),
    hasReference,
  });

  try {
    const out = await generateImage({ toolId, prompt, image, reference }, request.signal);
    return Response.json(out);
  } catch (e) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    const kind = e instanceof ProviderError ? e.kind : "failed";
    console.error("[generate]", e instanceof Error ? e.message : e);
    return Response.json({ error: messages[kind].message, kind }, { status: messages[kind].status });
  }
}
