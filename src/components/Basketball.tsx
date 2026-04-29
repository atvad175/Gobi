export function BasketballSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="100" cy="100" r="90" />
      <path d="M10 100 Q100 100 190 100" />
      <path d="M100 10 Q100 100 100 190" />
      <path d="M30 30 Q100 100 170 170" />
      <path d="M170 30 Q100 100 30 170" />
    </svg>
  );
}

export function HoopSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="60" y="20" width="120" height="80" />
      <rect x="100" y="50" width="40" height="30" />
      <ellipse cx="120" cy="100" rx="50" ry="8" />
      <path d="M75 105 Q90 160 100 175 M105 105 Q108 160 110 175 M135 105 Q132 160 130 175 M165 105 Q150 160 140 175" />
    </svg>
  );
}
