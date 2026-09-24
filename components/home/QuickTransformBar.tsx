"use client";

import { useState } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import PageContainer from "@/components/layout/PageContainer";
import { IconSpaces, IconOutdoors, IconDetails, IconImages, IconUpload } from "@/components/ui/icons";

const options = [
  { key: "spaces", label: "Reimagine a space", body: "Rooms, interiors & homes", Icon: IconSpaces },
  { key: "outdoors", label: "Transform outdoors", body: "Gardens, landscapes & pools", Icon: IconOutdoors },
  { key: "details", label: "Refine the details", body: "Furniture, decor & lighting", Icon: IconDetails },
  { key: "images", label: "Perfect an image", body: "Cleanup, enhancement & perspective", Icon: IconImages },
] as const;

export default function QuickTransformBar() {
  const [active, setActive] = useState<(typeof options)[number]["key"]>("spaces");

  return (
    <div className="relative z-10 -mt-12">
      <PageContainer>
        <div className="rounded-3xl bg-brand-navy-light p-6 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow light>What do you want to transform?</Eyebrow>
              <p className="mt-1 text-sm text-white/70">
                Start with what you want to change. VastuNord adapts to the task.
              </p>
            </div>
            <div className="cta-group">
              <Button href="/pricing" size="sm">
                <IconUpload className="h-4 w-4" />
                Upload an Image
              </Button>
              <Button href="/pricing" variant="ghost" size="sm">
                Choose from Assets
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {options.map(({ key, label, body, Icon }) => {
              const isActive = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(key)}
                  className={clsx(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                    isActive ? "border-brand-orange bg-white/10" : "border-white/10 hover:border-white/30"
                  )}
                >
                  <Icon className={clsx("h-5 w-5 shrink-0", isActive ? "text-brand-orange" : "text-white/50")} />
                  <span>
                    <span className="block text-sm font-semibold text-white">{label}</span>
                    <span className="mt-0.5 block text-xs text-white/50">{body}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
