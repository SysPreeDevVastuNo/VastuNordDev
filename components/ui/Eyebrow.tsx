import clsx from "clsx";

export default function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={clsx("eyebrow", light ? "text-white/70" : "text-brand-orange")}>
      {children}
    </p>
  );
}
