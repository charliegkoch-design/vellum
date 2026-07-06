import Link from "next/link";
import { GENRES } from "@/db/catalog";
import {
  getActivity,
  getTopBooks,
  getTrendingBooks,
  getUserTopBooks,
  type BookWithStats,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import ActivityItem from "@/components/ActivityItem";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import Hero, { type ShelfSet } from "@/components/home/Hero";
import type { ShelfBook } from "@/components/home/Shelf3D";

function toShelfBook(b: BookWithStats & { myStars?: number }): ShelfBook {
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    author: b.author,
    coverUrl: b.coverUrl,
    mean: b.mean,
    votes: b.votes,
    myStars: b.myStars ?? null,
  };
}

export default async function Home() {
  const user = await getCurrentUser();

  const sets: ShelfSet[] = [];
  if (user) {
    const mine = getUserTopBooks(user.id, 10);
    if (mine.length >= 3)
      sets.push({ key: "mine", label: "Your Top 10", books: mine.map(toShelfBook) });
  }
  sets.push({ key: "top", label: "Top 10 on Vellum", books: getTopBooks(10).map(toShelfBook) });
  for (const g of GENRES)
    sets.push({ key: g, label: `Best of ${g}`, books: getTopBooks(10, g).map(toShelfBook) });

  const trending = getTrendingBooks(8);
  const activity = getActivity("all", 7);

  return (
    <main>
      <Hero sets={sets} greeting={user ? `Hi ${user.displayName.split(" ")[0]}` : undefined} />

      {/* trending this week */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <h2 className="heading-display text-4xl md:text-5xl">
              Trending <span className="italic text-cream-dim">this week</span>
            </h2>
            <Link href="/books" className="text-sm text-cream-faint hover:text-cream">
              Browse all →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 lg:grid-cols-8">
          {trending.map((b, i) => (
            <Reveal key={b.id} delay={i * 60}>
              <BookCard {...b} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* recent activity */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="heading-display text-4xl md:text-5xl">
              The margins <span className="italic text-cream-dim">are talking</span>
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-cream-dim">
              Every rating, review, and new friendship on Vellum, as it happens. Reading is
              better with company.
            </p>
            <Link href={user ? "/feed" : "/join"} className="pill-solid mt-8 inline-flex">
              {user ? "Open your feed" : "Join the conversation"}
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="card divide-y divide-line px-6 py-2">
              {activity.map((item, i) => (
                <ActivityItem key={i} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* closing CTA */}
      {!user && (
        <section className="border-t border-line">
          <Reveal className="mx-auto max-w-7xl px-6 py-28 text-center">
            <p className="heading-display text-5xl leading-tight md:text-7xl">
              Shelve <span className="italic">your</span> life.
            </p>
            <p className="mx-auto mt-5 max-w-md text-cream-dim">
              Build your top ten, argue about it in the reviews, and steal your friends&apos;
              next read.
            </p>
            <Link href="/join" className="pill-solid mt-9 inline-flex !px-8 !py-3.5">
              Join Vellum — it&apos;s free
            </Link>
          </Reveal>
        </section>
      )}

      <footer className="border-t border-line py-10 text-center text-xs text-cream-faint">
        Vellum — rate, review &amp; shelve books with friends. Covers courtesy of Open Library.
      </footer>
    </main>
  );
}
