import clsx from "clsx";

type Size = "default" | "narrow";

const sizeStyles: Record<Size, string> = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
};

export default function PageContainer({
  children,
  size = "default",
  className = "",
}: {
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full px-6 md:px-10 lg:px-14", sizeStyles[size], className)}>
      {children}
    </div>
  );
}
