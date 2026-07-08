import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteReview, postReview } from "@/lib/actions";
import { timeAgo } from "@/lib/format";
import {
  getBookBySlug,
  getBookRatingBreakdown,
  getBookReviews,
  getUserRating,
} from "@/lib/queries";
import { formatMean } from "@/lib/ranking";
import { getCurrentUser } from "@/lib/session";
import Avatar from "@/components/Avatar";
import Book3D from "@/components/Book3D";
import ReviewForm from "@/components/ReviewForm";
import StarRating from "@/components/StarRating";
import Stars from "@/components/Stars";
import TiltCard from "@/components/TiltCard";

export default async function BookPage(props: PageProps<"/books/[slug]">) {
  const { slug } = await props.params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const user = await getCurrentUser();
  const breakdown = getBookRatingBreakdown(book.id);
  const votes = breakdown.reduce((a, b) => a + b, 0);
  const mean = votes ? breakdown.reduce((a, n, i) => a + n * (i + 1), 0) / votes : 0;
  const maxBar = Math.max(...breakdown, 1);
  const myRating = user ? getUserRating(user.id, book.id) : null;
  const reviews = getBookReviews(book.id);

  return (
    <main className="page-enter relative mx-auto max-w-6xl px-6 pb-28 pt-32">
      {/* ambient wash from the cover art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-40 -top-24 -z-10 h-[70vh] opacity-[0.16]"
        style={{
          backgroundImage: `url(${book.coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "blur(90px) saturate(1.3)",
          maskImage: "radial-gradient(65% 65% at 50% 22%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(65% 65% at 50% 22%, black, transparent 78%)",
        }}
      />
      <div className="grid gap-14 md:grid-cols-[360px_1fr] md:gap-20">
        {/* left: the physical book */}
        <div
          className="mx-auto md:sticky md:top-32 md:self-start"
          style={
            {
              "--bw": "290px",
              "--bh": "420px",
              "--bt": "48px",
              perspective: "1100px",
            } as React.CSSProperties
          }
        >
          <TiltCard max={10} className="[transform-style:preserve-3d]">
            <div style={{ transform: "rotateY(-22deg)", transformStyle: "preserve-3d" }}>
              <Book3D
                coverUrl={book.coverUrl}
                title={book.title}
                style={{ filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.55))" }}
              />
            </div>
          </TiltCard>
        </div>

        {/* right: everything else */}
        <div>
          <Link
            href={`/books?genre=${encodeURIComponent(book.genre)}`}
            className="pill !py-1.5 text-xs uppercase tracking-widest"
          >
            {book.genre}
          </Link>
          <h1 className="heading-display mt-6 text-5xl leading-[1.03] md:text-7xl">{book.title}</h1>
          <p className="mt-4 text-lg text-cream-dim">
            <span className="heading-display italic">{book.author}</span>
            <span className="mx-3 text-gold/70">✦</span>
            <span className="text-cream-faint">{book.year}</span>
          </p>
          <p className="mt-6 max-w-xl leading-relaxed text-cream-dim">{book.description}</p>

          {/* rating summary */}
          <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
            <div>
              <p className="heading-display text-7xl leading-none md:text-8xl">
                {votes ? formatMean(mean) : "—"}
                <span className="ml-1 text-2xl text-cream-faint">/5</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Stars value={mean} className="text-lg" />
                <span className="text-sm text-cream-faint">
                  {votes} rating{votes === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            <div className="flex w-56 flex-col-reverse gap-1.5">
              {breakdown.map((n, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-cream-faint">
                  <span className="w-3 text-right">{i + 1}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream/8">
                    <div
                      className="hist-bar h-full rounded-full"
                      style={
                        {
                          "--w": `${(n / maxBar) * 100}%`,
                          "--d": `${(4 - i) * 90}ms`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <span className="w-5">{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* your rating */}
          <div className="card mt-10 p-6">
            <p className="mb-3 text-sm uppercase tracking-widest text-cream-faint">Your rating</p>
            {user ? (
              <StarRating bookId={book.id} initial={myRating} />
            ) : (
              <p className="text-sm text-cream-dim">
                <Link href="/login" className="underline underline-offset-4 hover:text-cream">
                  Log in
                </Link>{" "}
                to rate this book and add it to your shelf.
              </p>
            )}
          </div>

          {/* reviews */}
          <section className="mt-16">
            <p className="eyebrow mb-3">In the margins</p>
            <h2 className="heading-display text-3xl md:text-4xl">
              Reviews <span className="text-cream-faint">({reviews.length})</span>
            </h2>

            {user && (
              <div className="mt-6">
                <ReviewForm action={postReview.bind(null, book.id)} />
              </div>
            )}

            <div className="mt-8 flex flex-col divide-y divide-line">
              {reviews.length === 0 && (
                <p className="py-6 text-sm italic text-cream-faint">
                  No reviews yet. The margins are empty — say something.
                </p>
              )}
              {reviews.map(({ review, user: author, stars }) => (
                <article key={review.id} className="py-6">
                  <div className="flex items-center gap-3">
                    <Link href={`/u/${author.username}`}>
                      <Avatar name={author.displayName} color={author.avatarColor} size={34} />
                    </Link>
                    <div>
                      <Link
                        href={`/u/${author.username}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {author.displayName}
                      </Link>
                      <p className="text-xs text-cream-faint">
                        {stars != null && (
                          <>
                            <Stars value={stars} className="relative top-[1.5px] mr-1.5 text-[11px]" />
                          </>
                        )}
                        {timeAgo(review.createdAt)}
                      </p>
                    </div>
                    {user?.id === author.id && (
                      <form action={deleteReview.bind(null, review.id)} className="ml-auto">
                        <button className="cursor-pointer text-xs text-cream-faint hover:text-ember">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                  <p className="mt-3 max-w-2xl leading-relaxed text-cream-dim">{review.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
