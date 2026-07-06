type Props = {
  name: string;
  color: string;
  size?: number;
  className?: string;
};

export default function Avatar({ name, color, size = 36, className = "" }: Props) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium text-ink select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
