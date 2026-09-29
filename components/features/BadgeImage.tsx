import clsx from "clsx";
import Placeholder from "@/components/ui/Placeholder";

export default function BadgeImage({
  badge,
  active = false,
  label,
  caption,
  tone = "light",
  aspect = "aspect-[4/3]",
}: {
  badge: string;
  active?: boolean;
  label: string;
  caption: string;
  tone?: "light" | "dark";
  aspect?: string;
}) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl">
        <Placeholder label={badge} className={clsx("w-full", aspect)} />
        <span
          className={clsx(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest",
            active ? "bg-brand-orange text-white" : "bg-white text-brand-navy"
          )}
        >
          {badge}
        </span>
      </div>
      <p className={clsx("mt-2 text-sm font-semibold", tone === "dark" ? "text-white" : "text-stone-900")}>
        {label}
      </p>
      <p className={clsx("text-xs", tone === "dark" ? "text-white/60" : "text-stone-500")}>{caption}</p>
    </div>
  );
}
