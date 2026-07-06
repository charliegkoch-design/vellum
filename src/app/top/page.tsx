import type { Metadata } from "next";
import Link from "next/link";
import { getTopBooks } from "@/lib/queries";
import { formatMean, formatScore } from "@/lib/ranking";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";

export const metadata: Metadata = { title: "Top Rated — Vellum" };

const MEDALS = ["text-gold", "text-cream-dim", "text-[#b0805a]"];

export default function TopPage() {
  const top = getTopBooks(20);

  return (
    <main className="page-enter mx-auto max-w-4xl px-6 pb-28 pt-32">
      <h1 className="heading-display text-5xl md:text-6xl">
        The <span className="italic">canon</span>, according to Vellum
      </h1>
      <p className="mt-4 max-w-xl text-cream-dim">
        Ranked by weighted score — a book needs both love <em>and</em> readers to climb. One
        five-star vote from your mom won&apos;t cut it.
      </p>

      <ol className="mt-14 flex flex-col">
        {top.map((b, i) => (
          <Reveal key={b.id} delay={Math.min(i * 40, 400)}>
            <li className="group flex items-center gap-5 border-b border-line py-5 md:gap-8">
              <span
                className={`heading-display w-12 shrink-0 text-right text-4xl italic md:text-5xl ${
                  MEDALS[i] ?? "text-cream-faint"
                }`}
              >
                {i + 1}
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
