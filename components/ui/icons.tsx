type IconProps = {
  className?: string;
};

const base = "h-5 w-5";

export function IconSpaces({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M3 11 12 4l9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconOutdoors({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 3c3 3 4.5 5.5 4.5 8a4.5 4.5 0 0 1-9 0c0-2.5 1.5-5 4.5-8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15v6" strokeLinecap="round" />
    </svg>
  );
}

export function IconDetails({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconImages({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M3 15l3.5-3.5a1.5 1.5 0 0 1 2.1 0L13 15" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="9.5" r="1.4" />
      <path d="M9 3h9a2 2 0 0 1 2 2v10" strokeLinecap="round" />
    </svg>
  );
}

export function IconUpload({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 15V4M12 4 8 8M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevron({ className = base, direction = "right" }: IconProps & { direction?: "left" | "right" | "down" }) {
  const rotation = direction === "left" ? "rotate-180" : direction === "down" ? "rotate-90" : "";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${className} ${rotation}`}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
