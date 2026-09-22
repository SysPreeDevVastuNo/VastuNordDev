import clsx from "clsx";

type Variant = "surface" | "outline" | "glass";

const variantStyles: Record<Variant, string> = {
  surface: "bg-white shadow-sm",
  outline: "border border-stone-200",
  glass: "bg-white/5",
};

export default function Card({
  children,
  variant = "surface",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-2xl p-6", variantStyles[variant], className)}>
      {children}
    </div>
  );
}
