import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/components/app/AppIcons";
import type { Tool } from "@/lib/mock/tools";

// One tool in the library grid or a Home recommendation rail.
export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/app/tools/${tool.id}`}
      aria-label={`${tool.name}. ${tool.blurb} Start this tool.`}
      className="group flex h-full w-full flex-col rounded-card border border-line bg-white p-2.5 transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-navy-deep">
        <Image
          src={tool.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 72vw"
          className="object-cover transition-transform duration-300 ease-out-soft motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-3.5 pb-1.5">
        <h3 className="font-display text-[15px] leading-snug font-medium text-navy">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-body">{tool.blurb}</p>
        <span className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-control bg-navy px-3.5 py-2 text-[13px] font-semibold text-white transition-colors duration-200 ease-out-soft group-hover:bg-navy-ink">
            Start
            <IconArrowRight className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
