"use client";

import Link from "next/link";
import AppSection from "@/components/app/AppSection";
import { IconArchive } from "@/components/app/AppIcons";
import ToolCard from "@/components/app/ToolCard";
import FileCard from "@/app/app/(shell)/_home/FileCard";
import LearnCard from "@/app/app/(shell)/_home/LearnCard";
import ProjectTile from "@/app/app/(shell)/_home/ProjectTile";
import Rail from "@/components/app/Rail";
import { learnArticles } from "@/lib/mock/learn";
import { activeProjects, archivedOrDeletedFileCount, continueWorkingFiles, useStudio } from "@/lib/mock/store";
import { homeownerToolIds, toolById } from "@/lib/mock/tools";

// Everything below the start card; it follows edits made from the file and project sheets.
export default function HomeFeed() {
  useStudio();
  const files = continueWorkingFiles();
  const triedTools = new Set<string>(files.map((f) => f.toolId));
  const recommended = homeownerToolIds
    .filter((id) => !triedTools.has(id))
    .slice(0, 4)
    .map((id) => toolById(id)!);
  const projects = activeProjects().slice(0, 4);
  const hiddenFiles = archivedOrDeletedFileCount();

  return (
    <div className="mt-10">
      <AppSection
        title="Continue Working"
        count={files.length}
        link={{ href: "/app/files", label: "All files" }}
        intro="Your recent files. Each one opens in its own tool, exactly where you left it."
      >
        <Rail>
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </Rail>
        {hiddenFiles > 0 && (
          <div className="mt-4 px-5 sm:px-0">
            <Link
              href="/app/files?view=archived"
              className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-navy transition-colors hover:text-ember"
            >
              <IconArchive />
              Archived &amp; deleted files ({hiddenFiles})
            </Link>
          </div>
        )}
      </AppSection>

      <AppSection
        title="Recommended for you"
        link={{ href: "/app/library", label: "Tool Library" }}
        intro="Tools that suit homeowner work, and that you have not tried yet."
        className="mt-12"
      >
        <Rail>
          {recommended.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </Rail>
      </AppSection>

      <AppSection title="Recent projects" link={{ href: "/app/projects", label: "All projects" }} className="mt-12">
        <Rail>
          {projects.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </Rail>
      </AppSection>

      <AppSection
        title="Learn"
        link={{ href: "/resources", label: "All articles" }}
        intro="Guides and comparisons for deciding what a space could become."
        className="mt-12"
      >
        <Rail cols={3}>
          {learnArticles.map((article) => (
            <LearnCard key={article.id} article={article} />
          ))}
        </Rail>
      </AppSection>
    </div>
  );
}
