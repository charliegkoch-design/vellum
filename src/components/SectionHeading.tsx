/** Eyebrow label + big serif heading, the shared section-header treatment. */
export default function SectionHeading({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="heading-display text-4xl leading-[1.08] md:text-5xl">{children}</h2>
    </div>
  );
}
