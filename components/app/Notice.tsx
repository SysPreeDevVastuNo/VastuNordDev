import ScreenCode from "@/components/app/ScreenCode";

// A boxed message on light Studio screens: an icon for its tone, an optional
// title, the body, and optional actions (create file, open file).

const tones = {
  info: { box: "border-line bg-shell", icon: "text-muted" },
  warn: { box: "border-ember/30 bg-ember/[0.06]", icon: "text-ember" },
  error: { box: "border-ember/45 bg-ember/[0.10]", icon: "text-ember" },
  success: { box: "border-navy/15 bg-navy/[0.04]", icon: "text-navy" },
};

// Phosphor fill glyphs: info, warning, warning-circle, check-circle.
const glyphs = {
  info: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z",
  warn: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z",
  error: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z",
  success: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z",
};

export type NoticeTone = keyof typeof tones;

export default function Notice({
  tone = "info",
  title,
  children,
  actions,
}: {
  tone?: NoticeTone;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const t = tones[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-control border p-4 ${t.box}`}>
      <div className="flex gap-3">
        <svg aria-hidden width={18} height={18} fill="currentColor" viewBox="0 0 256 256" className={`mt-px shrink-0 ${t.icon}`}>
          <path d={glyphs[tone]} />
        </svg>
        <div className="min-w-0 flex-1">
          {title && <p className="font-display text-sm font-medium text-navy">{title}</p>}
          {children && <div className={`text-[13px] leading-6 text-body ${title ? "mt-1.5" : ""}`}>{children}</div>}
          {actions && <div className="mt-3.5 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

/** The row of buttons under a flow notice (stacked on phones). */
export function NoticeActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">{children}</div>;
}

/** A flow screen that ends in a notice: the screen code, then the boxed message (C-01, C-02 failures). */
export function FlowNotice({
  code,
  title,
  tone = "error",
  ends,
  children,
}: {
  code: string;
  title: string;
  tone?: NoticeTone;
  ends?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-6 sm:px-0">
      <div className="mx-auto max-w-[34rem]">
        <ScreenCode code={code} state={ends ? `${title} · flow ends` : title} />
        <Notice tone={tone} title={title}>
          {children}
        </Notice>
      </div>
    </div>
  );
}
