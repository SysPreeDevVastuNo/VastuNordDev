import clsx from "clsx";

type Tone = "default" | "dark" | "cream" | "offwhite";

const toneStyles: Record<Tone, string> = {
  default: "",
  dark: "bg-brand-navy text-white",
  cream: "bg-brand-cream",
  offwhite: "bg-brand-offwhite",
};

export default function Section({
  children,
  tone = "default",
  padded = true,
  id,
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  padded?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={clsx(padded && "py-24", toneStyles[tone], className)}>
      {children}
    </section>
  );
}
