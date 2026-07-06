const STAR_PATH =
  "M12 2l2.9 6.26 6.6.7-4.9 4.56 1.36 6.48L12 16.77 6.04 20l1.36-6.48L2.5 8.96l6.6-.7L12 2z";

function StarRow({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-[1em] w-[1em]" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

/** Read-only star display with fractional fill (e.g. 4.3 of 5). */
export default function Stars({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={`relative inline-flex leading-none ${className}`}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <StarRow className="text-cream/20" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        <StarRow className="text-gold" />
      </span>
    </span>
  );
}
