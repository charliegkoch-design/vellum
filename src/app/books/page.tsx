import type { Metadata } from "next";
import Link from "next/link";
import { GENRES } from "@/db/catalog";
import { searchBooks } from "@/lib/queries";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "Discover — Vellum" };

export default async function DiscoverPage(props: PageProps<"/books">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const genre = typeof sp.genre === "string" ? sp.genre : undefined;
  const results = searchBooks(q, genre);

  const genreLink = (g?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (g) params.set("genre", g);
    const s = params.toString();
    return s ? `/books?${s}` : "/books";
  };

  return (
    <main className="page-enter mx-auto max-w-7xl px-6 pb-28 pt-32">
      <h1 className="heading-display text-5xl md:text-6xl">
        Discover <span className="italic text-cream-dim">your next obsession</span>
      </h1>

      <form className="mt-9 max-w-md" action="/books">
        {genre && <input type="hidden" name="genre" value={genre} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search titles or authors…"
          className="input-dark"
        />
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={genreLink(undefined)} data-active={!genre} className="pill !py-2 text-xs">
          All
        </Link>
        {GENRES.map((g) => (
          <Link key={g} href={genreLink(g)} data-active={genre === g} className="pill !py-2 text-xs">
            {g}
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-cream-faint">
        {results.length} book{results.length === 1 ? "" : "s"}
        {q ? ` for “${q}”` : ""}
        {genre ? ` in ${genre}` : ""}
      </p>

      {results.length === 0 ? (
        <p className="mt-16 text-center italic text-cream-faint">
          Nothing on this shelf. Try a different search.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map((b, i) => (
            <Reveal key={b.id} delay={(i % 6) * 50}>
              <BookCard {...b} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
