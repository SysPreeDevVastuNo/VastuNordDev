export default function Placeholder({
  label,
  className = "",
  dark = false,
}: {
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border text-center text-xs font-medium uppercase tracking-wide ${
        dark
          ? "border-white/10 bg-white/5 text-white/40"
          : "border-stone-200 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400"
      } ${className}`}
    >
      {label}
    </div>
  );
}
