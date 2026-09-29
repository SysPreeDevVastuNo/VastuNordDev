"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Button from "@/components/ui/Button";

// Figma exports the selected icon (space) at full white and the others at 80%
// white; the space icon is dimmed to match when it isn't selected.
const options = [
  { key: "spaces", label: "Reimagine a space", body: "Rooms, interiors & homes", icon: "/icons/transform-space.svg" },
  { key: "outdoors", label: "Transform outdoors", body: "Gardens, landscapes & pools", icon: "/icons/transform-outdoors.svg" },
  { key: "details", label: "Refine the details", body: "Furniture, decor & lighting", icon: "/icons/transform-details.svg" },
  { key: "images", label: "Perfect an image", body: "Cleanup, enhancement & perspective", icon: "/icons/transform-image.svg" },
] as const;

export default function QuickTransformBar() {
  const [active, setActive] = useState<(typeof options)[number]["key"]>("spaces");

  return (
    <div className="pt-14">
      <div className="rounded-3xl border border-white/12 bg-white/5 p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-white/55">What do you want to transform?</p>
            <p className="mt-3 max-w-[448px] text-sm leading-6 text-brand-cream/70">
              Start with what you want to change. VastuNord adapts to the task.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button href="/pricing" className="w-full sm:w-auto">
              <Image src="/icons/upload.svg" alt="" width={16} height={16} />
              Upload an Image
            </Button>
            <Button href="/pricing" variant="ghost" className="w-full sm:w-auto">
              <Image src="/icons/folder.svg" alt="" width={16} height={16} />
              Choose from Assets
            </Button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {options.map(({ key, label, body, icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(key)}
                className={clsx(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-brand-orange/60 bg-brand-orange/12"
                    : "border-white/12 bg-white/3 hover:border-white/25"
                )}
              >
                <span
                  className={clsx(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    isActive ? "bg-brand-orange" : "bg-white/10"
                  )}
                >
                  <Image
                    src={icon}
                    alt=""
                    width={18}
                    height={18}
                    className={clsx(key === "spaces" && !isActive && "opacity-80")}
                  />
                </span>
                <span>
                  <span className="block font-heading text-sm font-medium leading-5 text-white">{label}</span>
                  <span className="block pt-0.5 text-xs leading-5 text-brand-cream/55">{body}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
