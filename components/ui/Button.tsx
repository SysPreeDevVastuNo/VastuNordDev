import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variantStyles: Record<Variant, string> = {
  primary: "bg-brand-orange text-white hover:bg-brand-orange-dark",
  secondary: "bg-white text-brand-navy hover:bg-stone-100",
  ghost: "border border-white/30 text-white hover:bg-white/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-3.5 text-sm",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
