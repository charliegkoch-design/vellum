import Link from "next/link";
import { notFound } from "next/navigation";
import { timeAgo } from "@/lib/format";
import {
  getFriendState,
  getUserByUsername,
  getUserRecentReviews,
  getUserStats,
  getUserTopBooks,
} from "@/lib/queries";
import { formatMean } from "@/lib/ranking";
import { getCurrentUser } from "@/lib/session";
import Avatar from "@/components/Avatar";
import BookCard from "@/components/BookCard";
import FriendButton from "@/components/FriendButton";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";

export default async function ProfilePage(props: PageProps<"/u/[username]">) {
  const { username } = await props.params;
  const person = getUserByUsername(username);
  if (!person) notFound();

  const viewer = await getCurrentUser();
  const isSelf = viewer?.id === person.id;
  const stats = getUserStats(person.id);
  const shelf = getUserTopBooks(person.id, 10);
  const recentReviews = getUserRecentReviews(person.id);

  return (
    <main className="page-enter mx-auto max-w-6xl px-6 pb-28 pt-32">
      {/* header */}
      <div className="flex flex-wrap items-center gap-6">
        <Avatar name={person.displayName} color={person.avatarColor} size={88} />
        <div className="min-w-0 flex-1">
          <h1 className="heading-display text-4xl md:text-5xl">{person.displayName}</h1>
          <p className="mt-1 text-cream-faint">@{person.username}</p>
          {person.bio && <p className="mt-2 max-w-md text-sm text-cream-dim">{person.bio}</p>}
        </div>
        <div>
          {isSelf ? (
            <span className="pill !py-2 text-sm">This is you</span>
          ) : viewer ? (
            <FriendButton state={getFriendState(viewer.id, person.id)} otherId={person.id} />
          ) : (
            <Link href="/login" className="pill !py-2 text-sm">
              Log in to add friend
            </Link>
          )}
        </div>
      </div>

      {/* stats */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          [stats.rated, "books rated"],
          [stats.reviews, "reviews"],
          [stats.friends, "friends"],
          [stats.rated ? formatMean(stats.meanGiven) : "—", "avg rating given"],
        ].map(([n, label]) => (
          <div key={label as string} className="card px-5 py-4">
            <p className="heading-display text-4xl">{n}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-cream-faint">{label}</p>
          </div>
        ))}
      </div>

      {/* top shelf */}
      <section className="mt-16">
        <h2 className="heading-display text-3xl">
          {isSelf ? "Your" : `${person.displayName.split(" ")[0]}’s`}{" "}
          <span className="italic text-cream-dim">top shelf</span>
        </h2>
        {shelf.length === 0 ? (
          <p className="mt-6 text-sm italic text-cream-faint">
            Nothing rated yet — the shelf is bare.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
            {shelf.map((b, i) => (
              <Reveal key={b.id} delay={i * 50}>
                <div className="relative">
                  <span className="heading-display absolute -left-2 -top-4 z-10 text-4xl italic text-cream/90 drop-shadow-lg">
                    {i + 1}
                  </span>
                  <BookCard {...b} />
                  <p className="mt-1 text-xs text-gold">rated {b.myStars}★</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* recent reviews */}
      <section className="mt-16">
        <h2 className="heading-display text-3xl">Recent reviews</h2>
        <div className="mt-6 flex flex-col divide-y divide-line">
          {recentReviews.length === 0 && (
            <p className="py-4 text-sm italic text-cream-faint">No reviews yet.</p>
          )}
          {recentReviews.map(({ review, book, stars }) => (
            <article key={review.id} className="py-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <Link
                  href={`/books/${book.slug}`}
                  className="heading-display text-xl italic hover:underline"
                >
                  {book.title}
                </Link>
                {stars != null && <Stars value={stars} className="text-[13px]" />}
                <span className="text-xs text-cream-faint">{timeAgo(review.createdAt)}</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream-dim">{review.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
