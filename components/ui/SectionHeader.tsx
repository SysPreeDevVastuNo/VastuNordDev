import clsx from "clsx";
import Eyebrow from "@/components/ui/Eyebrow";

type Tone = "light" | "dark";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  constrain = true,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: Tone;
  /** Caps the heading/description width (matches the 7xl-wide sections). */
  constrain?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow light={tone === "dark"}>{eyebrow}</Eyebrow>
      <h2
        className={clsx(
          "mt-3 text-3xl font-semibold sm:text-4xl",
          constrain && "max-w-xl",
          tone === "dark" ? "text-white" : "text-brand-teal"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={clsx(
            "mt-5",
            constrain && "max-w-xl",
            tone === "dark" ? "text-white/70" : "text-stone-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
