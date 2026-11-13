// Client-side file making for exports (the prototype's renderDelivery): the
// version is drawn on a canvas (alone, or beside the original photo), with
// labels and marks, then encoded as JPG / PNG or laid out on a one-page PDF.
// Everything runs in the browser; nothing is uploaded.

/** Browsers refuse canvases much past this, so "8K" is drawn at 4096 px. */
const MAX_EDGE = 4096;
const PAGE = { w: 595.28, h: 841.89 };

export type RenderSpec = {
  after: string;
  before?: string;
  layout: "result" | "before-after";
  /** Width / height of the output; defaults to the image's own (doubled side by side). */
  ratio?: number;
  longEdge: number;
  /** Trial mark, bottom right. */
  watermark?: boolean;
  /** "Made with VastuNord", bottom right. */
  credit?: boolean;
  /** Studio name, bottom left. */
  brand?: string;
  labels?: [string, string];
};

const images = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string) {
  const cached = images.get(src);
  if (cached) return cached;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // Remote images must allow CORS, or the canvas could not be exported.
    if (!src.startsWith("data:") && !src.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => {
      images.delete(src);
      reject(new Error("image-failed"));
    };
    img.src = src;
  });
  images.set(src, p);
  return p;
}

/** Draws `img` to fill the box, cropping the overflow evenly (object-fit: cover). */
function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / k;
  const sh = h / k;
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
}

/** A rounded label pill. `dark`: navy with white text, else white with ink text. */
function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, unit: number, dark: boolean) {
  ctx.font = `600 ${Math.round(unit * 0.9)}px "Zalando Sans Expanded", system-ui, sans-serif`;
  const pad = unit * 0.9;
  const h = unit * 1.9;
  const w = ctx.measureText(text).width + pad * 2;
  ctx.fillStyle = dark ? "rgba(4, 43, 60, 0.82)" : "rgba(255, 255, 255, 0.88)";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = dark ? "#ffffff" : "#1c1917";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + pad, y + h / 2 + unit * 0.05);
}

export async function renderCanvas(spec: RenderSpec) {
  const after = await loadImage(spec.after);
  const before = spec.layout === "before-after" && spec.before ? await loadImage(spec.before) : undefined;
  const edge = Math.min(spec.longEdge, MAX_EDGE);
  const own = after.naturalWidth / after.naturalHeight;
  const ratio = spec.ratio ?? (before ? own * 2 : own);
  const w = Math.round(ratio >= 1 ? edge : edge * ratio);
  const h = Math.round(ratio >= 1 ? edge / ratio : edge);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#03151d";
  ctx.fillRect(0, 0, w, h);
  const unit = Math.max(12, Math.round(Math.min(w, h) / 42));

  if (before) {
    const gap = Math.round(unit * 0.35);
    const [first, second] = spec.labels ?? ["Before", "After"];
    if (h > w) {
      // Tall formats stack the two.
      const half = (h - gap) / 2;
      cover(ctx, before, 0, 0, w, half);
      cover(ctx, after, 0, half + gap, w, half);
      pill(ctx, first, unit, unit, unit, false);
      pill(ctx, second, unit, half + gap + unit, unit, true);
    } else {
      const half = (w - gap) / 2;
      cover(ctx, before, 0, 0, half, h);
      cover(ctx, after, half + gap, 0, half, h);
      pill(ctx, first, unit, unit, unit, false);
      pill(ctx, second, half + gap + unit, unit, unit, true);
    }
  } else cover(ctx, after, 0, 0, w, h);

  if (spec.brand && !spec.watermark) pill(ctx, spec.brand, unit, h - unit * 3, unit, false);
  if (spec.watermark || spec.credit) {
    const text = spec.watermark ? "VastuNord · Trial" : "Made with VastuNord";
    ctx.font = `600 ${Math.round(unit * 0.95)}px "Zalando Sans Expanded", system-ui, sans-serif`;
    pill(ctx, text, w - (ctx.measureText(text).width + unit * 1.8) - unit, h - unit * 3, unit, true);
  }
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: "JPG" | "PNG", quality = 0.86) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode-failed"))), format === "PNG" ? "image/png" : "image/jpeg", quality)
  );
}

/** Hands a file to the browser's downloads. False when the browser would not start it. */
export function saveBlob(blob: Blob, filename: string) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    return true;
  } catch {
    return false;
  }
}

// --- PDF: one A4 page with a title, the image and a footer, written by hand ---

// The standard PDF fonts only cover Latin-1.
const latin1 = (t: string) =>
  t
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/€/g, "EUR ")
    .replace(/[^\x20-\x7e\xa0-\xff]/g, "?");
const pdfText = (t: string) => latin1(t).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const pdfColor = (c: number[] = [28, 25, 23]) => c.map((v) => (v / 255).toFixed(3)).join(" ");

type PdfItem =
  | { kind: "text"; x: number; y: number; size: number; text: string; bold?: boolean; color?: number[] }
  | { kind: "rule"; x: number; y: number; w: number; color?: number[] }
  | { kind: "image"; x: number; y: number; w: number; h: number };

async function writePdf(items: PdfItem[], image?: { jpeg: Blob; width: number; height: number }) {
  const ops = items.map((r) =>
    r.kind === "text"
      ? `BT /${r.bold ? "F2" : "F1"} ${r.size} Tf ${pdfColor(r.color)} rg ${r.x.toFixed(2)} ${(PAGE.h - r.y).toFixed(2)} Td (${pdfText(r.text)}) Tj ET`
      : r.kind === "rule"
        ? `${pdfColor(r.color ?? [231, 229, 228])} RG 0.75 w ${r.x.toFixed(2)} ${(PAGE.h - r.y).toFixed(2)} m ${(r.x + r.w).toFixed(2)} ${(PAGE.h - r.y).toFixed(2)} l S`
        : image
          ? `q ${r.w.toFixed(2)} 0 0 ${r.h.toFixed(2)} ${r.x.toFixed(2)} ${(PAGE.h - r.y - r.h).toFixed(2)} cm /Im1 Do Q`
          : ""
  );
  const content = ops.filter(Boolean).join("\n");
  const jpeg = image ? new Uint8Array(await image.jpeg.arrayBuffer()) : null;
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const write = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? enc.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (n: number, body: string | (() => void)) => {
    offsets[n] = length;
    write(`${n} 0 obj\n`);
    if (typeof body === "string") write(body);
    else body();
    write("\nendobj\n");
  };

  write("%PDF-1.4\n%âãÏÓ\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.w} ${PAGE.h}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >>${jpeg ? " /XObject << /Im1 7 0 R >>" : ""} >> /Contents 6 0 R >>`
  );
  object(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  object(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  object(6, `<< /Length ${enc.encode(content).length} >>\nstream\n${content}\nendstream`);
  if (jpeg && image)
    object(7, () => {
      write(
        `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
      );
      write(jpeg);
      write("\nendstream");
    });
  const count = jpeg ? 8 : 7;
  const xrefAt = length;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  write(xref);
  write(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}

/** A one-page PDF: title, subtitle, the image fitted to the page, a footer line. */
export async function renderPdf(spec: RenderSpec & { title: string; subtitle: string; footer: string }) {
  const canvas = await renderCanvas({ ...spec, longEdge: Math.min(spec.longEdge, 2400) });
  const jpeg = await canvasToBlob(canvas, "JPG", 0.9);
  const maxW = PAGE.w - 96;
  const fitH = maxW * (canvas.height / canvas.width);
  const h = Math.min(PAGE.h - 260, fitH);
  const w = h < fitH ? h * (canvas.width / canvas.height) : maxW;
  return writePdf(
    [
      { kind: "text", x: 48, y: 64, size: 20, text: spec.title, bold: true, color: [1, 60, 85] },
      { kind: "text", x: 48, y: 84, size: 10, text: spec.subtitle, color: [121, 113, 107] },
      { kind: "image", x: 48 + (maxW - w) / 2, y: 108, w, h },
      { kind: "rule", x: 48, y: PAGE.h - 60, w: maxW },
      { kind: "text", x: 48, y: PAGE.h - 42, size: 9, text: spec.footer, color: [121, 113, 107] },
    ],
    { jpeg, width: canvas.width, height: canvas.height }
  );
}

/** Copies text, falling back to a hidden textarea where the clipboard API is blocked. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand("copy");
      t.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Whether this device has a share sheet that takes files (most phones; few desktops). */
export function canShareFiles(file?: File) {
  try {
    return typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare(file ? { files: [file] } : { text: "x" });
  } catch {
    return false;
  }
}
