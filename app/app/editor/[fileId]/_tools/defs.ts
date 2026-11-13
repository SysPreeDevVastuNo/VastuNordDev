// Every tool's settings, defaults and labels, as the prototype defines them
// (defs.json is its tool table, extracted as data). Tool components read their
// options from here so a change to a tool's choices is one edit.

import raw from "@/app/app/editor/[fileId]/_tools/defs.json";
import type { ToolId } from "@/lib/mock/tools";

export type Control =
  | { kind: "prompt" | "negative"; id: string; label: string; placeholder: string }
  | { kind: "chips"; id: string; label: string; options: string[] }
  | { kind: "grid"; id: string; label: string; options: { value: string; preview?: string }[] }
  | { kind: "palette"; id: string; label: string; options: { value: string; swatch?: string[]; hint?: string }[] }
  | { kind: "slider"; id: string; label: string; min: number; max: number; value: number; unit?: string }
  | { kind: "toggle"; id: string; label: string; hint?: string }
  | { kind: "group"; id: string; label: string; controls: Control[] }
  | { kind: "method"; id: string; label: string; options: { value: string; hint?: string; reveals?: Control[] }[] };

export type ToolDef = {
  id: ToolId;
  category: string;
  supportsReferenceImage: boolean;
  supportsMultiImage: boolean;
  config: Control[];
  labels: { generate: string; result: string; modify: string };
  engine: string;
  zones?: unknown;
};

export type ParamValue = string | number | boolean;
export type Params = Record<string, ParamValue>;

const defs = raw as unknown as Record<string, ToolDef>;

export const toolDef = (id: string): ToolDef => defs[id] ?? defs["room-reimagination"];

/** Values that mean "leave it to us": summaries and prompt builders skip them. */
const AUTO_VALUES = new Set(["Auto", "Auto-detect", "As photographed", "Keep existing", "Original"]);
export const isAuto = (v: unknown) => typeof v === "string" && AUTO_VALUES.has(v);

function findControl(config: Control[], id: string): Control | undefined {
  for (const c of config) {
    if (c.id === id) return c;
    if (c.kind === "group") {
      const hit = findControl(c.controls, id);
      if (hit) return hit;
    }
    if (c.kind === "method")
      for (const o of c.options) {
        const hit = o.reveals && findControl(o.reveals, id);
        if (hit) return hit;
      }
  }
}

/** The options of control `id` as { value, preview?, swatch?, hint? } (chips become { value }). */
export function optionsOf(def: ToolDef, id: string): { value: string; preview?: string; swatch?: string[]; hint?: string }[] {
  const c = findControl(def.config, id);
  if (!c) return [];
  if (c.kind === "chips") return c.options.map((value) => ({ value }));
  if (c.kind === "grid" || c.kind === "palette" || c.kind === "method") return c.options;
  return [];
}

export const sliderOf = (def: ToolDef, id: string) => {
  const c = findControl(def.config, id);
  return c && c.kind === "slider" ? c : undefined;
};

/** Every control's starting value: the first option, the slider's value, empty text, toggles off. */
export function defaultParams(def: ToolDef): Params {
  const out: Params = {};
  const walk = (list: Control[]) => {
    for (const c of list)
      switch (c.kind) {
        case "prompt":
        case "negative":
          out[c.id] = "";
          break;
        case "chips":
          out[c.id] = c.options[0];
          break;
        case "grid":
        case "palette":
          out[c.id] = c.options[0].value;
          break;
        case "slider":
          out[c.id] = c.value;
          break;
        case "toggle":
          out[c.id] = false;
          break;
        case "method":
          out[c.id] = c.options[0].value;
          c.options.forEach((o) => o.reveals && walk(o.reveals));
          break;
        case "group":
          walk(c.controls);
          break;
      }
  };
  walk(def.config);
  return out;
}

/** Whether any setting other than the prompt fields moved off its default. */
export function settingsChanged(def: ToolDef, params: Params) {
  const d = defaultParams(def);
  return Object.keys(d).some((k) => k !== "prompt" && k !== "negative" && params[k] !== undefined && params[k] !== d[k]);
}

/** A one-line summary of a run: the prompt, else up to three chosen settings. */
export function summarize(def: ToolDef, params: Params) {
  const prompt = params.prompt;
  if (typeof prompt === "string" && prompt.trim()) return prompt.trim();
  const picked: string[] = [];
  const walk = (list: Control[]) => {
    for (const c of list) {
      if (picked.length >= 3) return;
      if (c.kind === "chips" || c.kind === "grid" || c.kind === "palette" || c.kind === "method") {
        const v = params[c.id];
        if (typeof v === "string" && v && !isAuto(v)) picked.push(v);
      }
      if (c.kind === "group") walk(c.controls);
    }
  };
  walk(def.config);
  return picked.length ? picked.join(" · ") : "Default settings";
}
