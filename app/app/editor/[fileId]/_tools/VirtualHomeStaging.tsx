"use client";

import { useMemo } from "react";
import { Callout, OptionCard, PanelSection, PillButton, Thumb, Toggle } from "@/app/app/editor/[fileId]/_ui/controls";
import { GCheckBold, GShieldCheck, glyph, type Glyph } from "@/app/app/editor/[fileId]/_ui/icons";
import ToolScreen from "@/app/app/editor/[fileId]/_ui/ToolScreen";
import { useToolFile } from "@/app/app/editor/[fileId]/_ui/useToolFile";
import { useToolScreen } from "@/app/app/editor/[fileId]/_ui/useToolScreen";
import { optionsOf, settingsChanged } from "@/app/app/editor/[fileId]/_tools/defs";
import { withOwnWords } from "@/app/app/editor/[fileId]/_tools/group-c/shared";
import { mockImage } from "@/lib/mock/entities";

const GUsersThree = glyph(
  "M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z",
  "M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z"
);
const GBriefcase = glyph(
  "M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z",
  "M152,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,112Zm80-40V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56H80V48a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24v8h40A16,16,0,0,1,232,72ZM96,56h64V48a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8Zm120,57.61V72H40v41.61A184,184,0,0,0,128,136,184,184,0,0,0,216,113.61Z"
);
const GHouseSimple = glyph(
  "M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z",
  "M224,120v96a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a15.87,15.87,0,0,1,4.69-11.32l80-80a16,16,0,0,1,22.62,0l80,80A15.87,15.87,0,0,1,224,120Z"
);
const GDiamond = glyph(
  "M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z",
  "M240,128a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Z"
);
const GCircleHalf = glyph(
  "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,16.37a86.4,86.4,0,0,1,16,3V212.67a86.4,86.4,0,0,1-16,3Zm32,9.26a87.81,87.81,0,0,1,16,10.54V195.83a87.81,87.81,0,0,1-16,10.54ZM40,128a88.11,88.11,0,0,1,80-87.63V215.63A88.11,88.11,0,0,1,40,128Zm160,50.54V77.46a87.82,87.82,0,0,1,0,101.08Z",
  "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM40,128a88.1,88.1,0,0,1,88-88V216A88.1,88.1,0,0,1,40,128Z"
);
const GCheckCircleFill = glyph(
  "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"
);

const buyers: Record<string, { icon: Glyph; brief: string }> = {
  Family: { icon: GUsersThree, brief: "Durable fabrics, a table for four, a corner for the kids." },
  "Young professional": { icon: GBriefcase, brief: "A desk nook, compact sofa, clean lines." },
  Downsizer: { icon: GHouseSimple, brief: "Fewer, better pieces and easy room to move." },
  Luxury: { icon: GDiamond, brief: "Statement lighting, rich materials, art on the walls." },
  Neutral: { icon: GCircleHalf, brief: "Light oak and white linen, so buyers imagine their own." },
};

const info = {
  photo: "One photo per room of the listing, empty or lived-in. Stage them one at a time; Export can take them all together.",
  reference: "A staged room you like. VastuNord borrows its furniture and styling.",
  prompt: "Anything the staging should do. Leave it empty and the buyer below does the work.",
  style: "Stage for the person most likely to buy. It sets the furniture, how much of it, and the finish.",
  listing: "Each room is staged separately. Export → Batch takes the latest staged version of every room.",
};

const phases = (buyer: string) => [
  "Measuring the empty room",
  "Keeping walls, floor and windows",
  `Furnishing it for a ${buyer.toLowerCase()} buyer`,
  "Adding shadows and finishing touches",
];

type Staged = { number: number; image: string };

export default function VirtualHomeStaging({ fileId }: { fileId: string }) {
  const s = useToolFile(fileId);
  const { def, working } = s;
  const p = working.params;
  const screen = useToolScreen(s);

  const buyer = String(p.stagingStyle);
  const prompt = String(p.prompt ?? "");
  const childSafe = p.childSafe === true;

  // Latest staged version of each room photo. The prototype reads this from the
  // file's version history; generation isn't connected yet, so none exist.
  const staged = useMemo(() => new Map<string, Staged>(), []);

  const photos = screen.photos;
  const stagedRooms = photos.filter((ph) => staged.has(ph));
  const nextUnstaged = photos.find((ph) => !staged.has(ph) && ph !== working.sourceImage);
  const changed = useMemo(() => settingsChanged(def, p), [def, p]);
  const described = !!(prompt.trim() || changed);
  const canGenerate = !!working.sourceImage;
  const room = Math.max(1, photos.indexOf(working.sourceImage) + 1);

  const summary = () => {
    const base = prompt.trim() ? prompt.trim() : `Room ${room} staged for a ${buyer.toLowerCase()} buyer`;
    return childSafe ? `${base} · child-safe` : base;
  };
  const improve = (text: string) =>
    withOwnWords(
      text,
      `Stage this room for a ${buyer.toLowerCase()} buyer: ${buyers[buyer]?.brief.toLowerCase() ?? ""} Keep the walls, floor, windows and fixtures exactly as they are.`
    );

  return (
    <ToolScreen
      screen={screen}
      toolName="Virtual Home Staging"
      intro={{
        eyebrow: "Virtual staging",
        bullets: [
          "Upload a photo of each room in the listing. Empty rooms work best.",
          "Choose who you are staging for: a family, a professional, a downsizer.",
          "Generate room by room, then export the whole listing at once.",
        ],
        before: mockImage("34a3780f9da44ee6349230293e82dd15e910075a-1500x1000.jpg"),
        after: mockImage("bdcf717e30b4020f8232728cca42fb940025c473-1535x1024.png"),
        afterLabel: "Staged",
      }}
      steps={[
        { label: "Add the rooms", short: "Rooms" },
        { label: "Choose the buyer", short: "Buyer" },
        { label: "Stage", short: "Stage" },
      ]}
      described={described}
      canGenerate={canGenerate}
      summary={summary}
      generateLabel={{
        first: photos.length > 1 ? `Stage room ${room}` : "Stage this room",
        again: staged.has(working.sourceImage) ? "Restage this room" : `Stage room ${room}`,
      }}
      phases={phases(buyer)}
      photoInfo={info.photo}
      referenceInfo={info.reference}
      prompt={{
        title: "Anything specific?",
        info: info.prompt,
        label: "Describe the staging",
        placeholder: "Warm and lived-in, not showroom. A dining table that seats six…",
        improve,
      }}
      marking={null}
      stripBadge={(src) =>
        staged.has(src) ? (
          <span className="pointer-events-none absolute top-1 left-1 flex size-4 items-center justify-center rounded-full bg-white text-navy" aria-label="Staged">
            <GCheckBold size={9} />
          </span>
        ) : null
      }
    >
      <PanelSection title="Who is it for?" info={info.style} meta={buyer}>
        <div role="radiogroup" aria-label="Staging style" className="space-y-1.5">
          {optionsOf(def, "stagingStyle").map((o) => {
            const b = buyers[o.value];
            const on = o.value === buyer;
            const Icon = b?.icon ?? GCircleHalf;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => s.setParam("stagingStyle", o.value)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${on ? "bg-ember/15 text-ember-soft" : "bg-white/6 text-cream/65"}`}>
                  <Icon size={16} fill={on} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[12.5px] font-medium text-white">{o.value}</span>
                  <span className="mt-0.5 block text-[11px] leading-[1.45] text-cream/50">{b?.brief}</span>
                </span>
              </button>
            );
          })}
        </div>
      </PanelSection>
      {photos.length ? (
        <PanelSection
          title="Listing"
          info={info.listing}
          meta={`${stagedRooms.length} of ${photos.length} ${photos.length === 1 ? "room" : "rooms"} staged`}
        >
          <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div
              className="h-full rounded-full bg-ember transition-[width] duration-300 ease-out-soft"
              style={{ width: `${(stagedRooms.length / photos.length) * 100}%` }}
            />
          </div>
          <ul className="mt-3 space-y-1.5">
            {photos.map((ph, i) => {
              const done = staged.get(ph);
              const inUse = ph === working.sourceImage;
              return (
                <li key={ph.slice(-24) + i} className="flex items-center gap-3">
                  <div className="w-11 shrink-0">
                    <Thumb src={done?.image ?? ph} label={`Work on room ${i + 1}`} active={inUse} onClick={() => screen.selectPhoto(ph)} />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[12px] font-medium text-white">
                      Room {i + 1}
                      {inUse ? <span className="ml-1.5 font-sans text-[11px] font-normal text-cream/45">in use</span> : null}
                    </span>
                    <span className="block text-[11px] text-cream/50">{done ? `Staged · v${done.number}` : "Not staged yet"}</span>
                  </span>
                  {done ? (
                    <span aria-label="Staged" className="shrink-0 text-cream/70">
                      <GCheckCircleFill size={16} />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {nextUnstaged ? (
            <PillButton
              size="sm"
              variant="ghost"
              label="Go to the next unstaged room"
              onClick={() => screen.selectPhoto(nextUnstaged)}
              className="mt-3 w-full"
            />
          ) : photos.length > 1 && stagedRooms.length === photos.length ? (
            <p className="mt-3 text-[11.5px] leading-5 text-cream/60">Every room is staged. Export → Batch takes them all at once.</p>
          ) : null}
          <div className="mt-3">
            <Callout tone="info">Label these as virtually staged when you list them. Many markets require it, and buyers trust it.</Callout>
          </div>
        </PanelSection>
      ) : null}
      <PanelSection title="Staging options" optional info="Skip it and staging works the same.">
        <OptionCard>
          <Toggle
            icon={GShieldCheck}
            label="Make it child safe"
            hint="Rounded furniture, nothing fragile within reach. A design direction, not a safety check."
            checked={childSafe}
            onChange={(v) => s.setParam("childSafe", v)}
          />
        </OptionCard>
      </PanelSection>
    </ToolScreen>
  );
}
