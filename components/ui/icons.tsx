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

export function IconCheck({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGrid({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function IconBolt({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBookmark({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M6 4h12v16l-6-4-6 4V4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShare({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="18" cy="5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="19" r="2.4" />
      <path d="M8.2 10.8 15.8 6.2M8.2 13.2l7.6 4.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeadset({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
    </svg>
  );
}

export function IconChart({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 20V10M11 20V4M18 20v-7" strokeLinecap="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  );
}

export function IconLink({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M9.5 14.5 14.5 9.5" strokeLinecap="round" />
      <path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5L16 11.5" strokeLinecap="round" />
      <path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5L8 12.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 5h16v11H8l-4 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSofa({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12.5A1.5 1.5 0 0 1 4.5 11h15a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5Z" />
      <path d="M4.5 17v2M19.5 17v2" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlask({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M10 3h4M10 3v6.5L5.5 18a1.5 1.5 0 0 0 1.3 2.2h10.4A1.5 1.5 0 0 0 18.5 18L14 9.5V3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15h9" strokeLinecap="round" />
    </svg>
  );
}

export function IconRuler({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="m3.5 15.5 5-5a1 1 0 0 1 1.4 0l7.6 7.6a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0L7.1 13.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12.5 8.5 14M9.5 10.5 11 12M12 8l1.5 1.5M14.5 5.5 16 7" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 3.5 5 6v5.5c0 4.2 3 7 7 9 4-2 7-4.8 7-9V6l-7-2.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.2 12 1.9 2 3.7-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClock({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
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
