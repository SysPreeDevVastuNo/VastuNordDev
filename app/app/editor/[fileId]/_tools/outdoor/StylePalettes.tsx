import { GSparkle, GSparkleFill } from "@/app/app/editor/[fileId]/_ui/icons";

// The shared Palettes control with the prototype's `wide` layout (two columns)
// and a hint line under each name, as the outdoor style cards use it.
export default function StylePalettes({
  label,
  options,
  value,
  onChange,
  wide,
}: {
  label: string;
  options: { value: string; swatch: string[]; hint?: string }[];
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-2 ${wide ? "grid-cols-2" : "grid-cols-2 min-[400px]:grid-cols-3"}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-xl border p-2 text-left transition-colors duration-200 ${on ? "border-ember bg-ember/10" : "border-white/10 bg-white/4 hover:border-white/30"}`}
          >
            {o.swatch.length ? (
              <span className="flex h-7 overflow-hidden rounded-md">
                {o.swatch.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </span>
            ) : (
              <span className="flex h-7 items-center justify-center gap-1 rounded-md border border-dashed border-white/25 text-cream/60">
                {on ? <GSparkleFill size={13} className="text-ember-soft" /> : <GSparkle size={13} />}
              </span>
            )}
            <span className={`mt-1.5 block truncate text-[11px] ${on ? "text-white" : "text-cream/65"}`}>{o.value}</span>
            {o.hint && <span className="mt-0.5 block text-[10.5px] leading-4 text-cream/45">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
