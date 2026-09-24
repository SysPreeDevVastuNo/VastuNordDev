import clsx from "clsx";
import Placeholder from "@/components/ui/Placeholder";

export default function MediaCard({
  label,
  aspect = "aspect-[4/5]",
  children,
  className = "",
}: {
  label: string;
  aspect?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden rounded-2xl", className)}>
      <Placeholder label={label} className={clsx("w-full", aspect)} />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">{children}</div>
    </div>
  );
}
