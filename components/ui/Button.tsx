import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md";

const variantStyles: Record<Variant, string> = {
  primary: "bg-brand-orange text-white hover:bg-brand-orange-dark",
  secondary: "bg-white text-brand-navy hover:bg-stone-100",
  ghost: "border border-white/35 text-white hover:bg-white/10",
  outline: "border border-stone-200 text-brand-teal hover:border-brand-teal/40 hover:bg-brand-offwhite",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm leading-5",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-[transform,background-color,border-color,color] active:translate-y-px",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
