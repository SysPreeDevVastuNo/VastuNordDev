// A numbered list of the steps a flow walks through (create file, open file):
// done steps get a navy tick, the current one an ember ring and a spinner.

const spinner =
  "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z";
const checkFill =
  "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z";

function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg aria-hidden width={13} height={13} fill="currentColor" viewBox="0 0 256 256" className={className}>
      <path d={d} />
    </svg>
  );
}

export default function FlowSteps({ steps, active }: { steps: string[]; active: number }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((label, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors duration-200 ${done ? "border-navy bg-navy text-white" : current ? "border-ember text-ember" : "border-line text-faint"}`}
            >
              {done ? <Glyph d={checkFill} /> : i + 1}
            </span>
            <span className={`text-[13px] leading-5 ${done ? "text-navy" : current ? "text-ink" : "text-faint"}`}>{label}</span>
            {current && <Glyph d={spinner} className="animate-spin text-ember" />}
          </li>
        );
      })}
    </ol>
  );
}
