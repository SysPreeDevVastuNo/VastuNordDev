"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Chips, PanelSection, Slider, StageTag, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import { GArrowsHorizontal } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { GEye } from "@/app/app/editor/[fileId]/_tools/group-c/icons";
import { withOwnWords } from "@/app/app/editor/[fileId]/_tools/group-c/shared";
import { chip, timeIcons, weatherIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { mockImage } from "@/lib/mock/entities";

/** Sky gradient for each time of day: top, middle, horizon. */
const skies: Record<string, string[]> = {
  Morning: ["#8fb8e3", "#cfe0f0", "#f6d2ad"],
  Midday: ["#3f86d1", "#7fb3e3", "#d4e7f6"],
  "Golden hour": ["#5f86c4", "#f0b97a", "#f59a52"],
  "Blue hour": ["#1b2a5a", "#45629e", "#c48a8a"],
  Night: ["#050b1f", "#0e1a3a", "#26365e"],
};
/** A wash over the sky for each weather: colour and opacity. */
const weathers: Record<string, [string, number]> = {
  Clear: ["#ffffff", 0],
  Overcast: ["#9aa1a8", 0.55],
  Hazy: ["#f2efe8", 0.4],
  Rain: ["#4a5058", 0.6],
  Snow: ["#dfe3e8", 0.5],
};
const cloudSpots = [
  [18, 22, 26, 9],
  [46, 14, 22, 7],
  [70, 26, 30, 10],
  [88, 12, 18, 6],
  [34, 36, 24, 8],
];
// Fades the sky out towards the horizon so the building shows through.
const skyMask = "linear-gradient(to bottom, black 0%, black 38%, transparent 64%)";

type Sky = { time: string; weather: string; clouds: number; saturation: number };

/** A drawing of the sky the settings describe (gradient, weather wash, clouds). */
function SkyDrawing({ time, weather, clouds, saturation }: Sky) {
  const sky = skies[time] ?? skies.Midday;
  const [wash, washOpacity] = weathers[weather] ?? weathers.Clear;
  const cloud = time === "Night" || time === "Blue hour" ? "rgba(160,170,200,0.55)" : "rgba(255,255,255,0.9)";
  return (
    <div className="absolute inset-0" style={{ filter: `saturate(${0.3 + (saturation / 100) * 1.4})` }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${sky[0]}, ${sky[1]} 55%, ${sky[2]})` }} />
      <div className="absolute inset-0" style={{ backgroundColor: wash, opacity: washOpacity }} />
      <div
        className="absolute inset-0"
        style={{
          opacity: clouds / 100,
          background: cloudSpots.map(([x, y, w, h]) => `radial-gradient(${w}% ${h}% at ${x}% ${y}%, ${cloud}, transparent 70%)`).join(", "),
        }}
      />
    </div>
  );
}

/** The sky washed over the top of a photo. */
function SkyWash(sky: Sky) {
  return (
    <div className="absolute inset-0 opacity-95" style={{ maskImage: skyMask, WebkitMaskImage: skyMask }}>
      <SkyDrawing {...sky} />
    </div>
  );
}

/** The sky preview over the user's photo on the stage. */
function SkyOverlay(sky: Sky) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <SkyWash {...sky} />
      <StageTag className="bottom-3 left-3">Sky preview · not a render</StageTag>
    </div>
  );
}

const demoPhoto = mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png");
const demoRatio = 3238 / 2160;

/** The intro's before/after: the same photo, with the preview sky drawn over the "after" side. */
function SkyDemo() {
  const [pos, setPos] = useState(42);
  const move = (el: HTMLElement, clientX: number) => {
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div className="flex size-full items-center justify-center" style={{ containerType: "size" }}>
      <div
        className="relative cursor-ew-resize touch-none overflow-hidden rounded-xl select-none"
        style={{ width: `min(100cqw, calc(100cqh * ${demoRatio}))`, aspectRatio: demoRatio }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.currentTarget, e.clientX);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e.currentTarget, e.clientX)}
      >
        <Image src={demoPhoto} alt="Golden hour · preview" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" draggable={false} />
        <div className="pointer-events-none absolute inset-0">
          <SkyWash time="Golden hour" weather="Clear" clouds={55} saturation={65} />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={demoPhoto} alt="Today" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" draggable={false} />
        </div>
        <StageTag className="bottom-3 left-3">Today</StageTag>
        <StageTag className="right-3 bottom-3">Golden hour · preview</StageTag>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            <GArrowsHorizontal size={16} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          aria-label="Compare Today with Golden hour · preview"
          onChange={(e) => setPos(Number(e.target.value))}
          className="sr-only"
        />
      </div>
    </div>
  );
}

const info = {
  photo: "A photo with plenty of sky in it. Add other angles if you have them; the highlighted one is used.",
  reference: "A sky you like. VastuNord borrows its colour and cloud, not the place.",
  prompt: "Anything about the sky the settings do not cover. Leave it empty and they do the work.",
  time: "Where the sun is: it sets the colour of the sky and the light on everything under it.",
  weather: "What the sky is doing. The light on the building changes with it.",
  clouds: "From a clear sky to full cover. Saturation sets how vivid the colour is.",
};

export default function SkyTransformation({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);
  const [preview, setPreview] = useState(true);

  const time = String(p.timeOfDay);
  const weather = String(p.weather);
  const clouds = Number(p.cloudIntensity ?? 45);
  const saturation = Number(p.skySaturation ?? 50);
  const prompt = String(p.prompt ?? "");
  const sky: Sky = { time, weather, clouds, saturation };
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;
  const spec = `${time} sky, ${weather.toLowerCase()}, ${clouds}% cloud, ${saturation}% saturation`;

  return (
    <ToolScreen
      screen={screen}
      place="outside"
      toolName="Sky Transformation"
      intro={{
        eyebrow: "Exterior & landscape",
        bullets: [
          "Upload a photo with plenty of sky in it.",
          "Set the time of day, the weather and the clouds, and see the sky change as you go.",
          "Generate. The sky changes, and the light on everything under it follows.",
        ],
        before: demoPhoto,
        after: demoPhoto,
        demo: <SkyDemo />,
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Set the sky", short: "Sky" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={() => prompt.trim() || spec}
      generateLabel={{ first: "Change the sky", again: "Regenerate" }}
      phases={["Finding the skyline", "Keeping the building and trees", `Painting a ${time.toLowerCase()} sky`, "Relighting everything under it"]}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Anything else?",
        info: info.prompt,
        label: "Describe the sky",
        placeholder: "A softer sky: late afternoon, high thin cloud…",
        improve: (t) => withOwnWords(t, `Replace the sky with a ${spec}. Relight the building and garden to match, and keep everything else as it is.`),
      }}
      marking={null}
      sourceOverlay={preview ? <SkyOverlay {...sky} /> : null}
    >
      <PanelSection title="Sky preview" info="A drawing of the sky your settings describe. Generate makes the real one.">
        <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-white/10">
          <SkyDrawing {...sky} />
          <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/70 to-black/30" aria-hidden />
          <span className="absolute bottom-2 left-3 text-[10.5px] text-white/80">{spec}</span>
        </div>
        <div className="mt-3 rounded-xl border border-white/8 bg-white/3 p-3">
          <Toggle
            icon={GEye}
            label="Preview on my photo"
            hint="Washes the sky over the top of your photo. Free and instant; not a render."
            checked={preview}
            onChange={setPreview}
          />
        </div>
      </PanelSection>
      <PanelSection title="Time of day" info={info.time}>
        <Chips
          label="Time of day"
          options={optionsOf(def, "timeOfDay").map((o) => chip(o.value, timeIcons))}
          value={time}
          onChange={(v) => s.setParam("timeOfDay", v)}
        />
      </PanelSection>
      <PanelSection title="Weather" info={info.weather}>
        <Chips
          label="Weather"
          options={optionsOf(def, "weather").map((o) => chip(o.value, weatherIcons))}
          value={weather}
          onChange={(v) => s.setParam("weather", v)}
        />
      </PanelSection>
      <PanelSection title="Clouds and colour" info={info.clouds}>
        <div className="space-y-5">
          <Slider
            label="Cloud intensity"
            min={0}
            max={100}
            step={5}
            value={clouds}
            format={(v) => `${v === 0 ? "Clear" : v < 35 ? "A few" : v < 70 ? "Broken" : "Full cover"} · ${v}%`}
            onChange={(v) => s.setParam("cloudIntensity", v)}
          />
          <Slider
            label="Sky saturation"
            min={0}
            max={100}
            step={5}
            value={saturation}
            format={(v) => `${v < 30 ? "Muted" : v < 70 ? "Natural" : "Vivid"} · ${v}%`}
            onChange={(v) => s.setParam("skySaturation", v)}
          />
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
