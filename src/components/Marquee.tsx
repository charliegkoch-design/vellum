const WORDS = ["Rate", "Review", "Shelve", "Argue", "Lend", "Reread", "Annotate", "Recommend"];

/** Infinite scrolling serif strip used as a section divider. */
export default function Marquee() {
  const run = (key: string) => (
    <div key={key} aria-hidden={key === "b"} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="heading-display px-6 text-4xl italic text-cream/80 md:px-10 md:text-6xl">
            {w}
          </span>
          <span className="text-gold/70">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee border-y border-line py-6 md:py-8">
      <div className="marquee-track">
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}
