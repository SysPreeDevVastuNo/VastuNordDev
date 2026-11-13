"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { appButtonNavy, appButtonPrimary } from "@/components/app/AppButton";
import { IconArrowRight, IconArrowSquareOut, IconCheckBold, IconShareNetwork } from "@/components/app/AppIcons";
import Notice from "@/components/app/Notice";
import Sheet, { SheetTitle } from "@/components/app/Sheet";
import { mockVersions, versionImage, type Project } from "@/lib/mock/entities";
import { defaultShareSettings, reviewUrl, settingsValid, type Share } from "@/lib/mock/delivery";
import { CopyLink, ShareSettings } from "@/components/app/ShareControls";
import { createShare, useStudio } from "@/lib/mock/store";
import { TextField, useWait } from "@/app/app/(shell)/projects/[projectId]/ui";

const MAX_FILES = 8;
const label = "font-display text-[10px] font-semibold tracking-[0.16em] text-muted uppercase";

type State = { kind: "form" } | { kind: "creating" } | { kind: "ready"; share: Share; url: string };

// Send a set of this project's files, each at its current version, as one review link.
export default function ShareForReview({ open, project, onClose }: { open: boolean; project: Project; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="share-project-title" maxWidth="32rem">
      {open && <ShareBody project={project} onClose={onClose} />}
    </Sheet>
  );
}

function ShareBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const { files } = useStudio();
  const wait = useWait();
  const messageId = useId();
  const shareable = files
    .filter((f) => f.projectId === project.id && f.status === "active")
    .map((file) => {
      const version = mockVersions.find((v) => v.id === file.currentVersionId);
      return { file, version, image: version && versionImage(version.id) };
    })
    .filter((s) => s.version && s.image);

  const [selected, setSelected] = useState(() => shareable.slice(0, MAX_FILES).map((s) => s.file.id));
  const [title, setTitle] = useState(project.name);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState(defaultShareSettings);
  const [state, setState] = useState<State>({ kind: "form" });

  const ready = selected.length > 0 && title.trim() !== "" && settingsValid(settings);

  const create = () => {
    if (!ready) return;
    setState({ kind: "creating" });
    wait(() => {
      const items = shareable
        .filter((s) => selected.includes(s.file.id))
        .map((s) => ({ fileId: s.file.id, versionId: s.version!.id }));
      const share = createShare({
        title: title.trim(),
        message: message.trim(),
        items,
        settings,
        projectId: project.id,
        kind: items.length > 1 ? "set" : "options",
      });
      setState({ kind: "ready", share, url: reviewUrl(share.token) });
    }, 0.9);
  };

  return (
    <>
      <SheetTitle title="Share for review" onClose={onClose} />
      <p id="share-project-title" className="sr-only">
        Share {project.name} for review
      </p>
      {state.kind === "ready" ? (
        <div>
          <Notice tone="success" title="Your link is ready">
            {state.share.items.length} {state.share.items.length === 1 ? "image" : "images"} from {project.name}.{" "}
            {state.share.settings.review ? "They can approve them or ask for changes." : "To look at."}
          </Notice>
          <div className="mt-4">
            <CopyLink url={state.url} tone="light" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={state.url}
              target="_blank"
              rel="noopener"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-control border border-line px-4 py-3 text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy/40"
            >
              <IconArrowSquareOut size={15} />
              See it as your client
            </a>
            <button type="button" onClick={onClose} className={clsx(appButtonNavy, "flex-1")}>
              Done
            </button>
          </div>
          <Link
            href={`/app/shared/${state.share.id}`}
            className="mt-4 inline-flex items-center gap-1 text-[13px] text-muted hover:text-navy"
          >
            Follow it in Shared <IconArrowRight size={12} />
          </Link>
        </div>
      ) : shareable.length === 0 ? (
        <p className="py-6 text-[14px] leading-6 text-body">
          None of this project’s files has a version yet. Generate in any of them, then share from here.
        </p>
      ) : (
        <div className="space-y-6">
          <fieldset>
            <legend className={clsx("mb-2", label)}>Files · each shows its current version</legend>
            <ul className="grid gap-2">
              {shareable.map(({ file, version, image }) => {
                const on = selected.includes(file.id);
                const full = !on && selected.length >= MAX_FILES;
                return (
                  <li key={file.id}>
                    <label
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-control border p-2 pr-3 transition-colors duration-200",
                        on ? "border-navy/30 bg-shell" : "border-line",
                        full && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={full}
                        onChange={() => setSelected((s) => (on ? s.filter((id) => id !== file.id) : [...s, file.id]))}
                        className="peer sr-only"
                      />
                      <Image src={image!} alt="" width={48} height={48} className="size-12 shrink-0 rounded-xl object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[14px] font-medium text-navy">{file.name}</span>
                        <span className="block text-[12px] text-muted">Version {version!.number}</span>
                      </span>
                      <span
                        aria-hidden
                        className={clsx(
                          "order-last flex size-6 shrink-0 items-center justify-center rounded-md border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember",
                          on ? "border-navy bg-navy text-white" : "border-line"
                        )}
                      >
                        {on && <IconCheckBold size={13} />}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {selected.length === 0 && <p className="mt-2 text-[13px] text-ember">Pick at least one file.</p>}
          </fieldset>

          <TextField
            label="Title"
            value={title}
            onChange={(v) => setTitle(v.slice(0, 80))}
            error={title.trim() ? undefined : "Give it a title."}
          />

          <div>
            <label htmlFor={messageId} className="block text-sm font-medium text-navy">
              Message <span className="font-normal text-muted">optional</span>
            </label>
            <textarea
              id={messageId}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 400))}
              rows={3}
              placeholder="What should they look at, and what do you need from them…"
              className="mt-2 w-full resize-none rounded-control border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:border-navy/40 focus:shadow-none focus:outline-none sm:text-[15px]"
            />
          </div>

          <ShareSettings value={settings} onChange={setSettings} tone="light" />

          <button
            type="button"
            onClick={create}
            disabled={state.kind === "creating" || !ready}
            className={clsx(appButtonPrimary, "w-full")}
          >
            <IconShareNetwork size={15} />
            {state.kind === "creating" ? "Creating the link…" : "Create review link"}
          </button>
        </div>
      )}
    </>
  );
}
