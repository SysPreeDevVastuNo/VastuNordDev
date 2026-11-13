"use client";

import { useMemo, useState } from "react";
import { Chips, PanelSection, StageTag, SubLabel, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import { GCheckBold, GSnowflake, GSun, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { chip, timeIcons } from "@/app/app/editor/[fileId]/_tools/options";
import { GCar, GEye, GFlower, GLeaf, GUsersThree, OverlayCompare } from "@/app/app/editor/[fileId]/_tools/group-d/shared";
import { mockImage } from "@/lib/mock/entities";

type Season = { name: string; icon: Glyph; changes: string; swatch: string[]; grade: string };

const seasons: Season[] = [
  {
    name: "Spring",
    icon: GFlower,
    changes: "Blossom, fresh green, soft light",
    swatch: ["#f2d4dc", "#a9cf8d", "#e8ecd8"],
    grade: "saturate(1.12) hue-rotate(-6deg) brightness(1.06)",
  },
  {
    name: "Summer",
    icon: GSun,
    changes: "Full canopy, deep shade, long days",
    swatch: ["#3f7d3a", "#e9c46a", "#8fc0e0"],
    grade: "saturate(1.3) contrast(1.06)",
  },
  {
    name: "Autumn",
    icon: GLeaf,
    changes: "Turning leaves, leaf litter, low sun",
    swatch: ["#c8743a", "#8c4a2f", "#e0b15a"],
    grade: "sepia(0.45) saturate(1.6) hue-rotate(-22deg) contrast(1.04)",
  },
  {
    name: "Winter",
    icon: GSnowflake,
    changes: "Bare branches, frost or snow, pale light",
    swatch: ["#eef1f4", "#9aa7b2", "#4c5a63"],
    grade: "saturate(0.3) brightness(1.12) contrast(0.92)",
  },
];

/** How strongly the white snow wash shows, per snow cover. */
const snowWash: Record<string, number> = { None: 0, Frost: 0.28, "Light snow": 0.5, "Heavy snow": 0.75 };

const snowIcons: Record<string, Glyph> = { Frost: GSnowflake, "Light snow": GSnowflake, "Heavy snow": GSnowflake };

const garden = mockImage("0b9543badf86e146482a7224725d063a3635e938-3238x2160.png");

/** A quick colour grade for the season over the photo. Free, instant, not a render. */
function SeasonGrade({ season, snow, label = true }: { season: Season; snow: string; label?: boolean }) {
  const wash = season.name === "Winter" ? (snowWash[snow] ?? 0) : 0;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0" style={{ backdropFilter: season.grade, WebkitBackdropFilter: season.grade }} />
      {wash ? (
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent mix-blend-screen" style={{ opacity: wash }} />
      ) : null}
      {label && <StageTag className="bottom-3 left-3">{season.name} preview · not a render</StageTag>}
    </div>
  );
}

const info = {
  photo: "A photo of the outside as it is now. Add other angles if you have them; the highlighted one is used.",
  reference: "A place you like in that season. VastuNord borrows its light and colour.",
  prompt: "Anything the season should bring. Leave it empty and the choices below do the work.",
  time: "As photographed keeps your photo’s light. Each season also shifts where the sun sits.",
  season: "What changes: leaves, ground, light. Buildings and layout stay as they are.",
  scene: "Optional. How busy the scene should feel. Keep existing leaves it as the photo has it.",
};

export default function SeasonalTransformation({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);
  const [preview, setPreview] = useState(true);

  const season = seasons.find((x) => x.name === String(p.season)) ?? seasons[0];
  const snow = String(p.snow);
  const prompt = String(p.prompt ?? "");
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;

  const extras = [
    season.name === "Winter" && snow !== "None" ? snow.toLowerCase() : "",
    String(p.people) === "Keep existing" ? "" : `people: ${String(p.people).toLowerCase()}`,
    String(p.vehicles) === "Keep existing" ? "" : `vehicles: ${String(p.vehicles).toLowerCase()}`,
  ].filter(Boolean);
  const line = [season.name, ...extras].join(" · ");

  return (
    <ToolScreen
      screen={screen}
      place="outside"
      toolName="Seasonal Transformation"
      intro={{
        eyebrow: "Exterior & landscape",
        bullets: [
          "Upload a photo of the outside as it is now.",
          "Choose a season, how much snow, and how busy the scene should be.",
          "Generate. The same place, in another time of year.",
        ],
        before: garden,
        after: garden,
        demo: (
          <OverlayCompare
            before={garden}
            after={garden}
            beforeLabel="Today"
            afterLabel="Autumn · preview"
            start={42}
            afterOverlay={<SeasonGrade season={seasons[2]} snow="None" label={false} />}
          />
        ),
      }}
      steps={[
        { label: "Add your photo", short: "Photo" },
        { label: "Choose the season", short: "Season" },
        { label: "Generate", short: "Generate" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={() => prompt.trim() || line}
      generateLabel={{ first: `Show it in ${season.name.toLowerCase()}`, again: "Regenerate" }}
      phases={["Reading the scene", "Keeping buildings and layout", `Turning it to ${season.name.toLowerCase()}`, "Matching the season’s light"]}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Anything else?",
        info: info.prompt,
        label: "Describe the season",
        placeholder: "Late autumn, low sun, leaves gathered against the fence…",
        improve: (t) => {
          const built = `Show this place in ${season.name.toLowerCase()}: ${season.changes.toLowerCase()}${extras.length ? `, ${extras.join(", ")}` : ""}. Keep the buildings and layout exactly as they are.`;
          return t.trim() ? `${t.trim().replace(/[.\s]+$/, "")}. ${built}` : built;
        },
      }}
      marking={null}
      sourceOverlay={preview ? <SeasonGrade season={season} snow={snow} /> : null}
    >
      <PanelSection title="Time of day" info={info.time}>
        <Chips
          label="Time of day"
          options={optionsOf(def, "timeOfDay").map((o) => chip(o.value, timeIcons))}
          value={String(p.timeOfDay)}
          onChange={(v) => s.setParam("timeOfDay", v)}
        />
      </PanelSection>
      <PanelSection title="Season" info={info.season} meta={season.name}>
        <div role="radiogroup" aria-label="Season" className="grid grid-cols-2 gap-2">
          {seasons.map((x) => {
            const on = x.name === season.name;
            const Icon = x.icon;
            return (
              <button
                key={x.name}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => s.setParam("season", x.name)}
                className={`relative flex flex-col rounded-xl border p-3 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={18} fill={on} className={on ? "text-ember-soft" : "text-cream/70"} />
                  <span className="font-display text-[14px] font-semibold text-white">{x.name}</span>
                </span>
                <span className="mt-2 text-[11px] leading-[1.45] text-cream/55">{x.changes}</span>
                <span className="mt-3 flex h-1.5 overflow-hidden rounded-full">
                  {x.swatch.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                {on && (
                  <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-ember text-white">
                    <GCheckBold size={11} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {season.name === "Winter" && (
          <div className="mt-4">
            <SubLabel>Snow cover</SubLabel>
            <Chips
              label="Snow cover"
              options={optionsOf(def, "snow").map((o) => chip(o.value, snowIcons))}
              value={snow}
              onChange={(v) => s.setParam("snow", v)}
            />
          </div>
        )}
        <div className="mt-4 rounded-xl border border-white/8 bg-white/3 p-3">
          <Toggle
            icon={GEye}
            label="Preview on my photo"
            hint="A quick grade for the season. Free and instant; not a render."
            checked={preview}
            onChange={setPreview}
          />
        </div>
      </PanelSection>
      <PanelSection title="Scene elements" optional info={info.scene}>
        <div className="space-y-4">
          <div>
            <SubLabel>
              <span className="inline-flex items-center gap-1.5">
                <GUsersThree size={12} /> People
              </span>
            </SubLabel>
            <Chips
              label="People"
              options={optionsOf(def, "people").map((o) => chip(o.value))}
              value={String(p.people)}
              onChange={(v) => s.setParam("people", v)}
            />
          </div>
          <div>
            <SubLabel>
              <span className="inline-flex items-center gap-1.5">
                <GCar size={12} /> Vehicles
              </span>
            </SubLabel>
            <Chips
              label="Vehicles"
              options={optionsOf(def, "vehicles").map((o) => chip(o.value))}
              value={String(p.vehicles)}
              onChange={(v) => s.setParam("vehicles", v)}
            />
          </div>
        </div>
      </PanelSection>
    </ToolScreen>
  );
}
