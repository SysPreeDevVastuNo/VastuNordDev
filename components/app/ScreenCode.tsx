// The screen-code tag above each Studio screen ("HE-06 · Home ready"), as in
// the prototype, so a screen can be matched to its spec at a glance.
export default function ScreenCode({ code, state }: { code: string; state: string }) {
  return (
    <p className="mb-4 flex flex-wrap items-center gap-2 font-display text-[10px] tracking-[0.14em] text-faint uppercase">
      <span className="rounded-full border border-line px-2 py-1">{code}</span>
      <span className="text-faint/80">{state}</span>
    </p>
  );
}
