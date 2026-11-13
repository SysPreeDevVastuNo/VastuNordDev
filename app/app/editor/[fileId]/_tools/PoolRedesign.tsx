"use client";

import { useId, useMemo } from "react";
import { Chips, PanelSection, SubLabel, SwatchDot } from "@/app/app/editor/[fileId]/_ui/controls";
import type { Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { GArrowsHorizontalRegular, GDrop, GSquaresFour, GWaves } from "@/app/app/editor/[fileId]/_tools/group-c/icons";
import { GLeaf, withOwnWords } from "@/app/app/editor/[fileId]/_tools/group-c/shared";
import { mockImage } from "@/lib/mock/entities";

const poolTypes: Record<string, { icon: Glyph; brief: string }> = {
  Infinity: { icon: GArrowsHorizontalRegular, brief: "One edge disappears into the view." },
  Lap: { icon: GWaves, brief: "Long and narrow, for swimming lengths." },
  Plunge: { icon: GDrop, brief: "Small and deep, to cool off." },
  Natural: { icon: GLeaf, brief: "Planted edges, filtered by plants." },
  Courtyard: { icon: GSquaresFour, brief: "Compact, framed by walls." },
};

/** Water colour for each lining: [shallow, deep]. */
const linings: Record<string, [string, string]> = {
  Tile: ["#2b8fd6", "#6cc2ee"],
  Plaster: ["#5cc3d6", "#a6e3ea"],
  Pebble: ["#2f7f86", "#58a8a6"],
  Stone: ["#3b5f5a", "#64897e"],
};
/** Ground around the pool, per style. */
const decks: Record<string, string> = { Contemporary: "#d9d6cf", Natural: "#9a8a6c", Resort: "#efe6d6", Classic: "#c9c3b6" };
/** Coping (the pool's edge), per style. */
const copings: Record<string, string> = { Contemporary: "#f2f0ea", Natural: "#7a6b52", Resort: "#ffffff", Classic: "#e6e0d3" };

const info = {
  photo: "A photo of the garden or the pool as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A pool you like. VastuNord borrows its materials and mood, not its size.",
  prompt: "Anything the choices below do not cover. Leave it empty and they do the work.",
  type: "The kind of pool. It sets the proportions before anything else.",
  config: "Style, construction, shape and lining. The plan above redraws as you choose.",
};

const shapeName = (shape: string) => (shape === "L-shape" ? shape : shape.toLowerCase());

/** A small top-down plan of the pool that redraws as the settings change. */
function PoolPlan({ type, style, construction, shape, material }: { type: string; style: string; construction: string; shape: string; material: string }) {
  const id = useId().replace(/:/g, "");
  const [shallow, deep] = linings[material] ?? linings.Tile;
  const size =
    type === "Lap" ? { w: 124, h: 26 } : type === "Plunge" ? { w: 52, h: 38 } : type === "Courtyard" ? { w: 78, h: 44 } : { w: 104, h: 50 };
  const x = (160 - size.w) / 2;
  const y = (90 - size.h) / 2 + (type === "Infinity" ? -6 : 0);
  const edge = construction === "Raised" ? 6 : construction === "Partially raised" ? 4.5 : 3;
  const coping = copings[style] ?? "#f2f0ea";
  const { w, h } = size;
  const path =
    shape === "L-shape"
      ? `M${x},${y} h${w} v${h * 0.55} h${-w * 0.55} v${h * 0.45} h${-w * 0.45} Z`
      : shape === "Freeform"
        ? `M${x + w * 0.1},${y + h * 0.2} C${x + w * 0.3},${y - h * 0.15} ${x + w * 0.75},${y + h * 0.05} ${x + w * 0.92},${y + h * 0.25} C${x + w * 1.08},${y + h * 0.5} ${x + w * 0.85},${y + h * 1.05} ${x + w * 0.55},${y + h * 0.95} C${x + w * 0.3},${y + h * 0.88} ${x - w * 0.08},${y + h * 0.75} ${x + w * 0.1},${y + h * 0.2} Z`
        : null;
  const water = `url(#w${id})`;

  return (
    <figure className="overflow-hidden rounded-xl border border-white/10">
      <svg
        viewBox="0 0 160 90"
        className="block w-full"
        role="img"
        aria-label={`Plan of a ${shape.toLowerCase()} ${type.toLowerCase()} pool, ${material.toLowerCase()} lining`}
      >
        <defs>
          <linearGradient id={`w${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shallow} />
            <stop offset="1" stopColor={deep} />
          </linearGradient>
          <filter id={`s${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy={construction === "In-ground" ? 0.4 : 2}
              stdDeviation={construction === "In-ground" ? 0.4 : 1.6}
              floodOpacity="0.35"
            />
          </filter>
        </defs>
        <rect width="160" height="90" fill={decks[style] ?? "#d9d6cf"} />
        {type === "Courtyard" ? <rect x="3" y="3" width="154" height="84" fill="none" stroke="#5b5b58" strokeWidth="5" /> : null}
        {type === "Natural"
          ? [
              [22, 18],
              [30, 72],
              [138, 20],
              [132, 70],
              [80, 12],
              [84, 80],
            ].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#5d7a4a" opacity="0.85" />)
          : null}
        <g filter={`url(#s${id})`}>
          {shape === "Circular" ? (
            <ellipse cx="80" cy={y + h / 2} rx={Math.min(w, h * 1.6) / 2} ry={h / 2 + 4} fill={water} stroke={coping} strokeWidth={edge} />
          ) : path ? (
            <path d={path} fill={water} stroke={coping} strokeWidth={edge} strokeLinejoin="round" />
          ) : (
            <rect x={x} y={y} width={w} height={h} rx="3" fill={water} stroke={coping} strokeWidth={edge} />
          )}
        </g>
        {type === "Infinity" ? (
          <>
            <line x1={x} y1={y} x2={x + w} y2={y} stroke={shallow} strokeWidth={edge + 1} />
            <text x="80" y={y - 5} textAnchor="middle" fontSize="5" fill="#2a2a28">
              vanishing edge
            </text>
          </>
        ) : null}
      </svg>
      <figcaption className="flex items-center justify-between gap-2 border-t border-white/8 bg-white/3 px-3 py-2 text-[11px] text-cream/55">
        <span>
          {type} · {shapeName(shape)} · {construction.toLowerCase()} · {material.toLowerCase()}
        </span>
        <span className="shrink-0 text-cream/40">Plan, not to scale</span>
      </figcaption>
    </figure>
  );
}

export default function PoolRedesign({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);

  const type = String(p.poolType);
  const style = String(p.poolStyle);
  const construction = String(p.construction);
  const shape = String(p.shape);
  const material = String(p.material);
  const prompt = String(p.prompt ?? "");
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;
  const spec = `${style} ${type.toLowerCase()} pool, ${shapeName(shape)}, ${construction.toLowerCase()}, ${material.toLowerCase()} lining`;

  return (
    <ToolScreen
      screen={screen}
      place="outside"
      toolName="Spa & Pool Redesign"
      intro={{
        eyebrow: "Exterior & landscape",
        bullets: [
          "Upload a photo of the garden, or the pool you have now.",
          "Choose the kind of pool, its shape, construction and lining. A plan redraws as you go.",
          "Generate. The house and garden around it stay as they are.",
        ],
        before: mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png"),
        after: mockImage("a31398339ac88259ccdc0160743d83d212554611-1537x1023.png"),
        afterLabel: "Natural pool",
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Specify the pool", short: "Pool" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={() => prompt.trim() || spec.charAt(0).toUpperCase() + spec.slice(1)}
      generateLabel={{ first: "Design the pool", again: "Regenerate" }}
      phases={[
        "Reading the garden and levels",
        "Keeping the house and planting",
        `Building a ${type.toLowerCase()} pool`,
        "Filling it with light and reflection",
      ]}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Anything else?",
        info: info.prompt,
        label: "Describe the pool",
        placeholder: "A quieter pool: dark lining, stone coping, planting right to the edge…",
        improve: (t) => withOwnWords(t, `A ${spec}. Keep the house and garden around it as they are.`),
      }}
      marking={null}
    >
      <PanelSection title="Pool type" info={info.type} meta={type}>
        <div role="radiogroup" aria-label="Pool type" className="grid grid-cols-2 gap-2">
          {optionsOf(def, "poolType").map((o) => {
            const t = poolTypes[o.value];
            const on = o.value === type;
            const Icon = t?.icon ?? GWaves;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => s.setParam("poolType", o.value)}
                className={`flex flex-col rounded-xl border p-3 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} fill={on} className={on ? "text-ember-soft" : "text-cream/70"} />
                  <span className="font-display text-[13px] font-semibold text-white">{o.value}</span>
                </span>
                <span className="mt-1.5 text-[11px] leading-[1.45] text-cream/55">{t?.brief}</span>
              </button>
            );
          })}
        </div>
      </PanelSection>
      <PanelSection title="Pool configuration" info={info.config}>
        <PoolPlan type={type} style={style} construction={construction} shape={shape} material={material} />
        <div className="mt-4 space-y-4">
          <div>
            <SubLabel>Style</SubLabel>
            <Chips
              label="Pool style"
              options={optionsOf(def, "poolStyle").map((o) => ({ value: o.value, glyph: <SwatchDot color={decks[o.value] ?? "#ccc"} /> }))}
              value={style}
              onChange={(v) => s.setParam("poolStyle", v)}
            />
          </div>
          <div>
            <SubLabel>Construction</SubLabel>
            <Chips
              label="Construction"
              options={optionsOf(def, "construction").map((o) => ({ value: o.value }))}
              value={construction}
              onChange={(v) => s.setParam("construction", v)}
            />
          </div>
          <div>
            <SubLabel>Shape</SubLabel>
            <Chips
              label="Shape"
              options={optionsOf(def, "shape").map((o) => ({ value: o.value }))}
              value={shape}
              onChange={(v) => s.setParam("shape", v)}
            />
          </div>
          <div>
            <SubLabel>Lining</SubLabel>
            <Chips
              label="Lining material"
              options={optionsOf(def, "material").map((o) => ({
                value: o.value,
                glyph: <SwatchDot color={(linings[o.value] ?? linings.Tile)[0]} />,
              }))}
              value={material}
              onChange={(v) => s.setParam("material", v)}
            />
          </div>
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
