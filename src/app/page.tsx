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
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Hero, { type ShelfSet } from "@/components/home/Hero";
import IntroScroll from "@/components/home/IntroScroll";
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
      <IntroScroll videoSrc="/intro/library.mp4" posterSrc="/intro/library.jpg" />

      <Hero sets={sets} greeting={user ? `Hi ${user.displayName.split(" ")[0]}` : undefined} />

      <Marquee />

      {/* trending this week */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-28">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="01 — Momentum">
              Trending <span className="italic text-cream-dim">this week</span>
            </SectionHeading>
            <Link
              href="/books"
              className="nav-link text-sm text-cream-faint transition-colors hover:text-cream"
            >
              Browse the full library →
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
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:py-28">
          <Reveal>
            <SectionHeading eyebrow="02 — Right now">
              The margins <span className="italic text-cream-dim">are talking</span>
            </SectionHeading>
            <p className="mt-5 max-w-sm leading-relaxed text-cream-dim">
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
        <section className="relative overflow-hidden border-t border-line">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_110%,rgba(226,88,42,0.12),transparent_70%)]"
          />
          <Reveal className="relative mx-auto max-w-7xl px-6 py-28 text-center md:py-36">
            <p className="eyebrow justify-center before:hidden">Your shelf is waiting</p>
            <p className="heading-display mt-5 text-5xl leading-[1.05] md:text-8xl">
              Shelve <span className="italic text-ember">your</span> life.
            </p>
            <p className="mx-auto mt-6 max-w-md text-cream-dim">
              Build your top ten, argue about it in the reviews, and steal your friends&apos;
              next read.
            </p>
            <Link href="/join" className="pill-solid mt-10 inline-flex !px-9 !py-4 !text-base">
              Join Vellum — it&apos;s free
            </Link>
          </Reveal>
        </section>
      )}
    </main>
  );
}
