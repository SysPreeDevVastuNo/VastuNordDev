import clsx from "clsx";

/**
 * Renders an SVG asset as a CSS mask so its colour comes from the element's
 * background (e.g. `bg-white`, `bg-brand-orange`). Figma ships each icon in a
 * single colour, while interactive states recolour it — masking keeps the
 * asset untouched. Size it with `size-*` in `className`.
 */
export default function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden
      className={clsx("block shrink-0", className)}
      style={{ mask: `url(${src}) center / contain no-repeat` }}
    />
  );
}
