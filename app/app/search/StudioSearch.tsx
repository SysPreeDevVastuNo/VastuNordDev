"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AppButton, { appButtonOutline } from "@/components/app/AppButton";
import AppSection from "@/components/app/AppSection";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClockCounterClockwise,
  IconFolderOpen,
  IconSearch,
  IconSparkle,
  IconStack,
} from "@/components/app/AppIcons";
import EmptyState from "@/components/app/EmptyState";
import { FileStatusBadge, FileToolLine } from "@/components/app/FileMeta";
import FilterChip from "@/components/app/FilterChip";
import ScreenCode from "@/components/app/ScreenCode";
import SearchField from "@/components/app/SearchField";
import {
  fileThumbnail,
  inlineLabel,
  mockFiles,
  mockProjects,
  projectFileCount,
  type Project,
  type StudioFile,
} from "@/lib/mock/entities";
import { toolById, toolCategories, tools, type Tool } from "@/lib/mock/tools";

// Seeded until searches are stored per user; searches that find something join the front.
const seededRecent = ["kitchen", "staging", "garden terrace"];
const MAX_RECENT = 5;
const suggestions = ["Room Reimagination", "Virtual staging", "Upscale a photo"];

const contains = (fields: string[], q: string) => fields.some((f) => f.toLowerCase().includes(q));
const categoryLabel = (tool: Tool) => toolCategories.find((c) => c.id === tool.category)?.label ?? "";

// Tools match on name, description and category; files on name, tool and tags;
// projects on name, description and tags. Archived and deleted items stay out.
function search(query: string) {
  const q = query.trim().toLowerCase();
  return {
    tools: tools.filter((t) => contains([t.name, t.blurb, categoryLabel(t)], q)),
    files: mockFiles.filter(
      (f) =>
        (f.status === "active" || f.status === "draft") &&
        contains([f.name, toolById(f.toolId)?.name ?? "", ...f.tags], q)
    ),
    projects: mockProjects.filter((p) => p.status === "active" && contains([p.name, p.description ?? "", ...p.tags], q)),
  };
}

type Kind = "tools" | "files" | "projects";
const kinds: { id: Kind; label: string; Icon: typeof IconSparkle }[] = [
  { id: "tools", label: "Tools", Icon: IconSparkle },
  { id: "files", label: "Files", Icon: IconStack },
  { id: "projects", label: "Projects", Icon: IconFolderOpen },
];

const resultCard =
  "group flex w-full items-start gap-4 rounded-card border border-line bg-white p-3 text-left transition-[border-color,background-color] duration-200 ease-out-soft hover:border-navy/30 hover:bg-shell/60";

function EntityResult({
  image,
  Icon,
  title,
  meta,
  body,
  onOpen,
}: {
  image: string;
  Icon: typeof IconSparkle;
  title: string;
  meta: string;
  body: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className={resultCard}>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-cream sm:size-20">
        <Image
          src={image}
          alt=""
          fill
          sizes="80px"
          className="object-cover transition-transform duration-200 ease-out-soft group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start gap-2">
          <Icon size={15} className="mt-0.5 shrink-0 text-ember" />
          <p className="min-w-0 flex-1 font-display text-[15px] leading-snug font-medium text-navy">{title}</p>
        </div>
        <p className="mt-1 truncate text-xs text-muted">{meta}</p>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-body">{body}</p>
      </div>
    </button>
  );
}

function FileResult({ file, onOpen }: { file: StudioFile; onOpen: () => void }) {
  return (
    <div className="relative h-full">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${file.name}, ${toolById(file.toolId)?.name}`}
        className="group flex w-full items-center gap-4 rounded-card border border-navy/12 bg-shell p-3 text-left transition-[border-color,background-color] duration-200 ease-out-soft hover:border-navy/30 hover:bg-white sm:p-3.5"
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream sm:size-24">
          <Image src={fileThumbnail(file)} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <FileStatusBadge file={file} />
            <FileToolLine file={file} />
          </div>
          <h3 className="font-display text-[15px] leading-snug font-medium text-navy">{file.name}</h3>
          <p className="truncate text-xs text-muted">Edited {inlineLabel(file.lastEdited)}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
            Continue
            <IconArrowRight className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </div>
  );
}

const resultCount = (found: ReturnType<typeof search>) => found.tools.length + found.files.length + found.projects.length;

function Results({
  query,
  kindFilter,
  onKindChange,
  onClear,
}: {
  query: string;
  kindFilter: Kind | null;
  onKindChange: (kind: Kind | null) => void;
  onClear: () => void;
}) {
  const router = useRouter();
  const found = search(query);
  const total = resultCount(found);
  // The kind filter carries over between searches, unless the new one has nothing of that kind.
  const kind = kindFilter && found[kindFilter].length > 0 ? kindFilter : null;

  if (total === 0) {
    return (
      <div className="mt-6">
        <ScreenCode code="HS-02" state="No results" />
        <EmptyState
          roomy
          title={`Nothing matches “${query.trim()}”`}
          body="Try a shorter word, or browse the library instead."
        >
          <AppButton href="/app/library">Browse the tool library</AppButton>
          <button type="button" onClick={onClear} className={appButtonOutline}>
            Clear search
          </button>
        </EmptyState>
      </div>
    );
  }

  const show = (k: Kind) => !kind || kind === k;
  const projectBody = (p: Project) => p.description ?? p.tags.join(" · ");

  return (
    <div className="mt-6">
      <ScreenCode code="HS-03 → HS-05" state={`${total} results`} />
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterChip pressed={!kind} onClick={() => onKindChange(null)}>
          All {total}
        </FilterChip>
        {kinds
          .filter((k) => found[k.id].length > 0)
          .map(({ id, label, Icon }) => (
            <FilterChip
              key={id}
              pressed={kind === id}
              onClick={() => onKindChange(kind === id ? null : id)}
              icon={<Icon className={kind === id ? "text-ember-soft" : "text-muted"} />}
            >
              {label} {found[id].length}
            </FilterChip>
          ))}
      </div>
      <div className="mt-5 grid gap-3">
        {show("tools") &&
          found.tools.map((tool) => (
            <EntityResult
              key={tool.id}
              image={tool.image}
              Icon={IconSparkle}
              title={tool.name}
              meta={`Tool · ${categoryLabel(tool)}`}
              body={tool.blurb}
              onOpen={() => router.push(`/app/tools/${tool.id}`)}
            />
          ))}
        {show("files") &&
          found.files.map((file) => (
            <FileResult key={file.id} file={file} onOpen={() => router.push(`/app/files/${file.id}`)} />
          ))}
        {show("projects") &&
          found.projects.map((project) => {
            const files = projectFileCount(project.id);
            return (
              <EntityResult
                key={project.id}
                image={project.cover}
                Icon={IconFolderOpen}
                title={project.name}
                meta={`Project · ${files} ${files === 1 ? "file" : "files"} · ${project.lastUpdated}`}
                body={projectBody(project)}
                onOpen={() => router.push(`/app/projects/${project.id}`)}
              />
            );
          })}
      </div>
      <div className="mt-8">
        <AppButton href="/app" variant="outline" className="w-full sm:w-auto">
          Back to home
        </AppButton>
      </div>
    </div>
  );
}

// HS-01 → HS-05 — one search across tools, files and projects.
export default function StudioSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind | null>(null);
  const [recent, setRecent] = useState(seededRecent);
  const term = query.trim().toLowerCase();
  const searching = term !== "";

  // Remember a search once the user pauses on it and it found something.
  useEffect(() => {
    if (!term || resultCount(search(term)) === 0) return;
    const timer = setTimeout(() => setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, MAX_RECENT)), 1000);
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div className="px-5 sm:px-0">
      <div className="sticky top-14 z-20 -mx-5 border-b border-line bg-shell/95 px-5 py-3 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none md:top-16">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-white sm:hidden"
          >
            <IconArrowLeft />
          </button>
          <SearchField
            label="Search"
            placeholder="Tools, files and projects"
            value={query}
            onChange={setQuery}
            autoFocus
            className="flex-1"
          />
        </div>
      </div>

      {searching ? (
        <Results query={query} kindFilter={kind} onKindChange={setKind} onClear={() => setQuery("")} />
      ) : (
        <div className="mt-6">
          <ScreenCode code="HS-01" state="Search entry" />
          <AppSection title="Recent searches" className="mt-9">
            <div className="flex flex-wrap gap-2">
              {recent.map((s) => (
                <FilterChip key={s} pressed={false} onClick={() => setQuery(s)} icon={<IconClockCounterClockwise className="text-muted" />}>
                  {s}
                </FilterChip>
              ))}
            </div>
          </AppSection>
          <AppSection title="Try one of these" className="mt-9">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <FilterChip key={s} pressed={false} onClick={() => setQuery(s)} icon={<IconSearch size={14} className="text-muted" />}>
                  {s}
                </FilterChip>
              ))}
            </div>
          </AppSection>
        </div>
      )}
    </div>
  );
}
