// Server-only: the AI providers behind Generate. Imported only from route
// handlers, so the keys in process.env never reach the browser.
//
// Order: MNML (architecture renders) when its key works, then Pollinations.
// AI_PROVIDERS in the env overrides the order, e.g. "pollinations".

export type GenerateInput = {
  toolId: string;
  prompt: string;
  image: Blob;
  reference?: Blob;
};

export type GenerateOutput = {
  /** data: URL of the result. */
  image: string;
  provider: string;
  model: string;
};

export class ProviderError extends Error {
  constructor(
    message: string,
    /** "auth" and "config" move on to the next provider; the rest are shown to the user. */
    readonly kind: "auth" | "config" | "credits" | "rejected" | "busy" | "failed",
  ) {
    super(message);
  }
}

const toDataUrl = async (res: Response) => {
  const type = res.headers.get("content-type")?.split(";")[0] || "image/png";
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
};

const statusKind = (status: number): ProviderError["kind"] =>
  status === 401 || status === 403 ? "auth" : status === 402 ? "credits" : status === 400 || status === 422 ? "rejected" : status === 429 ? "busy" : "failed";

// ── Pollinations: OpenAI-style image edits, answered in one request ──────────
async function pollinations(input: GenerateInput, signal: AbortSignal): Promise<GenerateOutput> {
  const key = process.env.POLLINATIONS_API_KEY;
  if (!key) throw new ProviderError("Pollinations key is not set", "config");
  const model = process.env.POLLINATIONS_MODEL || "flux-klein";
  const form = new FormData();
  form.set("model", model);
  form.set("prompt", input.prompt);
  form.append("image", input.image, "photo.jpg");
  if (input.reference) form.append("image", input.reference, "reference.jpg");
  const res = await fetch("https://gen.pollinations.ai/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
    signal,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ProviderError(`Pollinations ${res.status}: ${body.slice(0, 200)}`, statusKind(res.status));
  }
  const data = (await res.json()) as { data?: { b64_json?: string; url?: string }[] };
  const first = data.data?.[0];
  if (first?.b64_json) return { image: `data:image/jpeg;base64,${first.b64_json}`, provider: "pollinations", model };
  if (first?.url) return { image: await toDataUrl(await fetch(first.url, { signal })), provider: "pollinations", model };
  throw new ProviderError("Pollinations returned no image", "failed");
}

// ── MNML ArchDiffusion v4.6: start a job, then poll its status ───────────────
const MNML = "https://api.mnmlai.dev/v1";
const interiorTools = new Set(["room-reimagination", "furniture-refresh", "decor-redefinition", "material-refinement", "seasonal-styling", "lighting-reimagination", "virtual-home-staging"]);
const expertFor = (toolId: string) => (interiorTools.has(toolId) ? "interior" : toolId === "garden-design" ? "landscape" : "exterior");

async function mnmlWith(key: string, input: GenerateInput, signal: AbortSignal): Promise<GenerateOutput> {
  const auth = { Authorization: `Bearer ${key}`, Accept: "application/json" };
  const form = new FormData();
  form.append("image", input.image, "photo.jpg");
  form.set("expert_name", expertFor(input.toolId));
  form.set("prompt_mode", "edit");
  form.set("prompt", input.prompt);
  if (input.reference) form.append("reference_image_1", input.reference, "reference.jpg");
  const start = await fetch(`${MNML}/archDiffusion-v46`, { method: "POST", headers: auth, body: form, signal });
  const started = (await start.json().catch(() => ({}))) as { id?: string; message?: string; code?: string };
  if (!start.ok || !started.id) {
    const kind = started.code === "NO_CREDITS" ? "credits" : statusKind(start.status);
    throw new ProviderError(`MNML ${start.status}: ${started.message ?? "no job id"}`, kind);
  }
  for (let wait = 3000; ; wait = Math.min(wait * 1.3, 8000)) {
    await new Promise((r) => setTimeout(r, wait));
    signal.throwIfAborted();
    const res = await fetch(`${MNML}/status/${started.id}`, { headers: auth, signal });
    const s = (await res.json().catch(() => ({}))) as { status?: string; message?: string[] | string };
    if (s.status === "success" && Array.isArray(s.message) && s.message[0])
      return { image: await toDataUrl(await fetch(s.message[0], { signal })), provider: "mnml", model: "archDiffusion-v46" };
    if (s.status === "failed" || s.status === "canceled") throw new ProviderError(`MNML job ${s.status}`, "failed");
  }
}

async function mnml(input: GenerateInput, signal: AbortSignal) {
  const keys = [process.env.MNML_API_KEY, process.env.MNML_API_KEY_BACKUP].filter((k): k is string => !!k);
  if (!keys.length) throw new ProviderError("MNML key is not set", "config");
  let last: unknown;
  for (const key of keys) {
    try {
      return await mnmlWith(key, input, signal);
    } catch (e) {
      last = e;
      // Only a refused key moves on to the backup key.
      if (!(e instanceof ProviderError && (e.kind === "auth" || e.kind === "credits"))) throw e;
    }
  }
  throw last instanceof ProviderError && last.kind === "credits" ? last : new ProviderError("MNML keys were refused", "auth");
}

const registry = { mnml, pollinations } as const;

export async function generateImage(input: GenerateInput, signal: AbortSignal): Promise<GenerateOutput> {
  const order = (process.env.AI_PROVIDERS || "mnml,pollinations")
    .split(",")
    .map((p) => p.trim())
    .filter((p): p is keyof typeof registry => p in registry);
  let last: unknown = new ProviderError("No AI provider is configured", "config");
  for (const name of order) {
    try {
      return await registry[name](input, signal);
    } catch (e) {
      last = e;
      console.warn(`[generate] ${name} failed:`, e instanceof Error ? e.message : e);
      // A refused key or missing config falls through to the next provider.
      if (!(e instanceof ProviderError && (e.kind === "auth" || e.kind === "config" || e.kind === "credits"))) break;
    }
  }
  throw last;
}
