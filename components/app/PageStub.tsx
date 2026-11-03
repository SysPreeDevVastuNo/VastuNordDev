// Temporary placeholder for app screens that are not built yet. Each screen is
// replaced by its real section-by-section build and this file goes away with the last one.
export default function PageStub({ code, title }: { code: string; title: string }) {
  return (
    <div className="px-4 sm:px-0">
      <p className="eyebrow text-faint">{code}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy">{title}</h1>
      <p className="mt-3 text-sm text-muted">This screen is not built yet.</p>
    </div>
  );
}
