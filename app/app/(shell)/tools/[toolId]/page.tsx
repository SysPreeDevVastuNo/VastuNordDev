import Image from "next/image";
import Link from "next/link";
import AppButton from "@/components/app/AppButton";
import { IconArrowLeft, IconArrowRight, IconWarning } from "@/components/app/AppIcons";
import { categoryIcons } from "@/components/app/categoryIcons";
import EmptyState from "@/components/app/EmptyState";
import ScreenCode from "@/components/app/ScreenCode";
import ToolFiles from "@/app/app/(shell)/tools/[toolId]/ToolFiles";
import { toolDetails } from "@/lib/mock/toolDetails";
import { toolById, toolCategories, tools, type ToolId } from "@/lib/mock/tools";

export function generateStaticParams() {
  return tools.map((t) => ({ toolId: t.id }));
}

function BulletList({ items, dot }: { items: string[]; dot: string }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-body">
          <span aria-hidden className={`mt-2 size-1.5 shrink-0 rounded-full ${dot}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

// Tool entry (WD-04): what the tool does, what it needs and makes, and the
// files already made with it. `?project=` carries through to the new file.
export default async function ToolEntryPage({ params, searchParams }: PageProps<"/app/tools/[toolId]">) {
  const { toolId } = await params;
  const { project } = await searchParams;
  const tool = toolById(toolId);

  if (!tool) {
    return (
      <div className="px-5 py-6 sm:px-0">
        <ScreenCode code="SN-01" state="Unknown tool" />
        <EmptyState
          roomy
          icon={<IconWarning size={20} />}
          title="That tool is not available"
          body="The link did not point at a tool in the library, so nothing was started. Pick one from the library and we will set it up."
        >
          <AppButton href="/app/library">Back to the tool library</AppButton>
          <AppButton href="/app" variant="outline">
            Go home
          </AppButton>
        </EmptyState>
      </div>
    );
  }

  const detail = toolDetails[tool.id as ToolId];
  const category = toolCategories.find((c) => c.id === tool.category)!;
  const CategoryIcon = categoryIcons[tool.category];
  const projectId = typeof project === "string" ? project : undefined;
  const startHref = `/app/new?tool=${tool.id}${projectId ? `&project=${projectId}` : ""}`;

  return (
    <div>
      <div className="px-5 sm:px-0">
        <ScreenCode code="WD-04" state={`Tool entry · ${tool.name}`} />
        <Link
          href="/app/library"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors duration-200 hover:text-navy"
        >
          <IconArrowLeft size={14} />
          Tool library
        </Link>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
        <div className="relative aspect-4/3 overflow-hidden bg-navy-deep sm:rounded-card lg:aspect-4/5">
          <Image
            src={tool.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
            className="object-cover"
          />
          <span className="absolute top-4 left-0 inline-flex items-center gap-1.5 bg-navy py-1.5 pr-5 pl-3 font-display text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-white uppercase [clip-path:polygon(0_0,100%_0,calc(100%_-_8px)_50%,100%_100%,0_100%)]">
            <CategoryIcon size={12} className="text-ember-soft" />
            {category.label}
          </span>
        </div>

        <div className="px-5 sm:px-0">
          <p className="eyebrow text-ember">{category.label}</p>
          <h1 className="mt-2.5 text-[clamp(1.6rem,5.5vw,2.4rem)] leading-tight font-semibold text-navy">{tool.name}</h1>
          <p className="mt-3 text-[15px] leading-7 text-body">{detail.long}</p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <AppButton href={startHref}>
              <IconArrowRight size={15} />
              Start a new file
            </AppButton>
            <AppButton href="/app/library" variant="outline">
              Back to the tool library
            </AppButton>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-faint">What you bring</p>
              <BulletList items={detail.inputs} dot="bg-navy/30" />
            </div>
            <div>
              <p className="eyebrow text-faint">What you get</p>
              <BulletList items={detail.outputs} dot="bg-ember" />
            </div>
          </div>

          <div className="mt-7 rounded-control border border-line bg-shell p-5">
            <p className="eyebrow text-faint">Highlights</p>
            <BulletList items={detail.highlights} dot="bg-navy/30" />
          </div>
        </div>
      </div>

      <ToolFiles toolId={tool.id} toolName={tool.name} startHref={startHref} />
    </div>
  );
}
