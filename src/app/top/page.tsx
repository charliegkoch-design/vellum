import type { Metadata } from "next";
import Link from "next/link";
import { getTopBooks } from "@/lib/queries";
import { formatMean, formatScore } from "@/lib/ranking";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = { title: "Top Rated — Vellum" };

const PODIUM = [
  { ring: "ring-gold/60", glow: "shadow-[0_30px_70px_-20px_rgba(217,164,65,0.35)]", num: "text-gold" },
  { ring: "ring-cream/30", glow: "shadow-[0_30px_70px_-24px_rgba(242,237,227,0.25)]", num: "text-cream-dim" },
  { ring: "ring-[#b0805a]/50", glow: "shadow-[0_30px_70px_-24px_rgba(176,128,90,0.3)]", num: "text-[#b0805a]" },
];

export default function TopPage() {
  const top = getTopBooks(20);
  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  return (
    <main className="page-enter mx-auto max-w-5xl px-6 pb-28 pt-32">
      <p className="eyebrow mb-4">The leaderboard</p>
      <h1 className="heading-display text-5xl leading-[1.05] md:text-7xl">
        The <span className="italic text-ember">canon</span>, according to Vellum
      </h1>
      <p className="mt-5 max-w-xl text-cream-dim">
        Ranked by weighted score — a book needs both love <em>and</em> readers to climb. One
        five-star vote from your mom won&apos;t cut it.
      </p>

      {/* podium */}
      <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6 md:gap-10">
        {podium.map((b, i) => (
          <Reveal key={b.id} delay={i * 120}>
            <Link href={`/books/${b.slug}`} className="group block text-center">
              <div className="relative mx-auto w-fit">
                <span
                  className={`heading-display absolute -left-5 -top-7 z-10 text-6xl italic md:text-7xl ${PODIUM[i].num}`}
                >
                  {i + 1}
                </span>
                <TiltCard
                  className={`overflow-hidden rounded-lg ring-1 ${PODIUM[i].ring} ${PODIUM[i].glow}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    className="aspect-[2/3] w-44 object-cover transition-transform duration-500 group-hover:scale-[1.04] md:w-52"
                  />
                </TiltCard>
              </div>
              <p className="heading-display mt-5 text-2xl leading-tight group-hover:underline">
                {b.title}
              </p>
              <p className="mt-1 text-sm text-cream-faint">{b.author}</p>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-cream-dim">
                <Stars value={b.mean} className="text-[13px]" />
                {formatScore(b.score)}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* the rest */}
      <ol className="mt-20 flex flex-col border-t border-line">
        {rest.map((b, i) => (
          <Reveal key={b.id} delay={Math.min(i * 40, 400)}>
            <li className="group flex items-center gap-5 border-b border-line py-5 transition-colors hover:bg-cream/[0.03] md:gap-8">
              <span className="heading-display w-12 shrink-0 text-right text-4xl italic text-cream-faint md:text-5xl">
                {i + 4}
              </span>
              <Link href={`/books/${b.slug}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  loading="lazy"
                  className="h-24 w-16 rounded object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-28 md:w-[76px]"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/books/${b.slug}`}
                  className="heading-display block truncate text-2xl leading-tight hover:underline md:text-3xl"
                >
                  {b.title}
                </Link>
                <p className="mt-0.5 truncate text-sm text-cream-faint">
                  {b.author} · {b.genre}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-cream-dim">
                  <Stars value={b.mean} className="text-[13px]" />
                  {formatMean(b.mean)} · {b.votes} ratings
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="heading-display text-3xl text-cream">{formatScore(b.score)}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream-faint">score</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </main>
  );
}
