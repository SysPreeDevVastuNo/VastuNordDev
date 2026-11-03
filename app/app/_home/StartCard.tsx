import Image from "next/image";
import clsx from "clsx";
import AppButton from "@/components/app/AppButton";
import { IconFiles, IconPlus, IconProjects } from "@/components/app/AppIcons";
import Greeting from "@/app/app/_home/Greeting";
import { tools } from "@/lib/mock/tools";

// Fanned-out covers of the first three tools; they spread a little on hover.
const fan = [
  "left-0 z-0 -rotate-8 group-hover/start:-translate-x-2 group-hover/start:-rotate-10",
  "left-25 z-10",
  "left-50 z-20 rotate-8 group-hover/start:translate-x-2 group-hover/start:rotate-10",
];

export default function StartCard({ firstName }: { firstName: string }) {
  return (
    <section className="group/start relative isolate overflow-hidden rounded-card bg-linear-to-br from-navy to-navy-deep px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex items-center gap-10">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-ember-soft">Explore home possibilities</p>
          <Greeting firstName={firstName} />
          <p className="mt-2 max-w-md text-[15px] leading-7 text-cream/70">
            You don&apos;t have to picture it in your head. Start with the room you keep going back and forth on.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <AppButton href="/app/library" className="col-span-2">
              <IconPlus />
              New visualization
            </AppButton>
            <AppButton href="/app/files" variant="glass">
              <IconFiles size={15} />
              My files
            </AppButton>
            <AppButton href="/app/projects" variant="glass">
              <IconProjects size={15} />
              Projects
            </AppButton>
          </div>
        </div>
        <div className="relative hidden h-44 w-80 shrink-0 md:block">
          {tools.slice(0, 3).map((tool, i) => (
            <Image
              key={tool.id}
              src={tool.image}
              alt=""
              width={120}
              height={160}
              sizes="120px"
              className={clsx(
                "absolute top-1/2 aspect-3/4 w-30 -translate-y-1/2 rounded-control object-cover shadow-xl ring-1 shadow-navy-ink/40 ring-white/20 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out-soft",
                fan[i]
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
