import clsx from "clsx";

// Horizontal snap-scroller on phones that becomes a grid from `sm` up.
export default function Rail({ cols = 4, children }: { cols?: 3 | 4; children: React.ReactNode[] }) {
  return (
    <div
      className={clsx(
        "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0",
        cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {children.map((child, i) => (
        <div key={i} className="w-[72vw] shrink-0 snap-start sm:w-auto">
          {child}
        </div>
      ))}
    </div>
  );
}
