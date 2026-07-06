import {
  and,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  like,
  ne,
  or,
  sql,
  type AnyColumn,
} from "drizzle-orm";
import { db } from "@/db/client";
import {
  books,
  friendships,
  ratings,
  reviews,
  users,
  type Book,
  type User,
} from "@/db/schema";
import { weightedScore } from "./ranking";

export type BookWithStats = Book & {
  mean: number;
  votes: number;
  score: number;
};

const meanExpr = sql<number>`coalesce(avg(${ratings.stars}), 0)`;
const votesExpr = sql<number>`count(${ratings.stars})`;

function siteMean(): number {
  const row = db.select({ m: sql<number>`coalesce(avg(${ratings.stars}), 3.5)` }).from(ratings).get();
  return row?.m ?? 3.5;
}

function withScore(rows: (Book & { mean: number; votes: number })[]): BookWithStats[] {
  const C = siteMean();
  return rows.map((r) => ({ ...r, score: weightedScore(r.mean, r.votes, C) }));
}

/** Site-wide top books, optionally within a genre. */
export function getTopBooks(limit = 10, genre?: string): BookWithStats[] {
  const rows = db
    .select({ ...getTableColumns(books), mean: meanExpr, votes: votesExpr })
    .from(books)
    .leftJoin(ratings, eq(ratings.bookId, books.id))
    .where(genre ? eq(books.genre, genre) : undefined)
    .groupBy(books.id)
    .all();
  return withScore(rows)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** A user's own highest-rated books (their personal top shelf). */
export function getUserTopBooks(userId: number, limit = 10): (BookWithStats & { myStars: number })[] {
  const rows = db
    .select({
      book: books,
      myStars: ratings.stars,
      createdAt: ratings.createdAt,
    })
    .from(ratings)
    .innerJoin(books, eq(books.id, ratings.bookId))
    .where(eq(ratings.userId, userId))
    .orderBy(desc(ratings.stars), desc(ratings.createdAt))
    .limit(limit)
    .all();
  const stats = getBookStatsMap(rows.map((r) => r.book.id));
  const C = siteMean();
  return rows.map((r) => {
    const s = stats.get(r.book.id) ?? { mean: 0, votes: 0 };
    return { ...r.book, ...s, score: weightedScore(s.mean, s.votes, C), myStars: r.myStars };
  });
}

export function getBookStatsMap(bookIds: number[]): Map<number, { mean: number; votes: number }> {
  if (bookIds.length === 0) return new Map();
  const rows = db
    .select({ bookId: ratings.bookId, mean: meanExpr, votes: votesExpr })
    .from(ratings)
    .where(inArray(ratings.bookId, bookIds))
    .groupBy(ratings.bookId)
    .all();
  return new Map(rows.map((r) => [r.bookId, { mean: r.mean, votes: r.votes }]));
}

/** Books rated in the last N days ranked by momentum (votes × mean). */
export function getTrendingBooks(limit = 8, days = 21): (BookWithStats & { recentVotes: number })[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = db
    .select({
      book: books,
      recentVotes: votesExpr,
      recentMean: meanExpr,
    })
    .from(ratings)
    .innerJoin(books, eq(books.id, ratings.bookId))
    .where(gt(ratings.createdAt, cutoff))
    .groupBy(books.id)
    .all();
  const stats = getBookStatsMap(rows.map((r) => r.book.id));
  const C = siteMean();
  return rows
    .map((r) => {
      const s = stats.get(r.book.id) ?? { mean: 0, votes: 0 };
      return {
        ...r.book,
        ...s,
        score: weightedScore(s.mean, s.votes, C),
        recentVotes: r.recentVotes,
        momentum: r.recentVotes * r.recentMean,
      };
    })
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, limit);
}

export function searchBooks(q?: string, genre?: string): BookWithStats[] {
  const conds = [];
  if (q) conds.push(or(like(books.title, `%${q}%`), like(books.author, `%${q}%`)));
  if (genre) conds.push(eq(books.genre, genre));
  const rows = db
    .select({ ...getTableColumns(books), mean: meanExpr, votes: votesExpr })
    .from(books)
    .leftJoin(ratings, eq(ratings.bookId, books.id))
    .where(conds.length ? and(...conds) : undefined)
    .groupBy(books.id)
    .orderBy(books.title)
    .all();
  return withScore(rows);
}

export function getBookBySlug(slug: string) {
  return db.select().from(books).where(eq(books.slug, slug)).get() ?? null;
}

export function getBookRatingBreakdown(bookId: number): number[] {
  const rows = db
    .select({ stars: ratings.stars, n: votesExpr })
    .from(ratings)
    .where(eq(ratings.bookId, bookId))
    .groupBy(ratings.stars)
    .all();
  const breakdown = [0, 0, 0, 0, 0];
  for (const r of rows) breakdown[r.stars - 1] = r.n;
  return breakdown;
}

export function getUserRating(userId: number, bookId: number): number | null {
  const row = db
    .select({ stars: ratings.stars })
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.bookId, bookId)))
    .get();
  return row?.stars ?? null;
}

export function getBookReviews(bookId: number) {
  return db
    .select({ review: reviews, user: users, stars: ratings.stars })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.userId))
    .leftJoin(
      ratings,
      and(eq(ratings.userId, reviews.userId), eq(ratings.bookId, reviews.bookId)),
    )
    .where(eq(reviews.bookId, bookId))
    .orderBy(desc(reviews.createdAt))
    .all();
}

// ---------------- users & social ----------------

export function getUserByUsername(username: string): User | null {
  return db.select().from(users).where(eq(users.username, username)).get() ?? null;
}

export function getFriendIds(userId: number): number[] {
  const rows = db
    .select()
    .from(friendships)
    .where(
      and(
        eq(friendships.status, "accepted"),
        or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId)),
      ),
    )
    .all();
  return rows.map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId));
}

export function getFriends(userId: number): User[] {
  const ids = getFriendIds(userId);
  if (ids.length === 0) return [];
  return db.select().from(users).where(inArray(users.id, ids)).all();
}

export function getIncomingRequests(userId: number) {
  return db
    .select({ friendship: friendships, user: users })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.requesterId))
    .where(and(eq(friendships.addresseeId, userId), eq(friendships.status, "pending")))
    .orderBy(desc(friendships.createdAt))
    .all();
}

export function getOutgoingRequests(userId: number) {
  return db
    .select({ friendship: friendships, user: users })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.addresseeId))
    .where(and(eq(friendships.requesterId, userId), eq(friendships.status, "pending")))
    .orderBy(desc(friendships.createdAt))
    .all();
}

export type FriendState =
  | { kind: "none" }
  | { kind: "friends"; friendshipId: number }
  | { kind: "outgoing"; friendshipId: number }
  | { kind: "incoming"; friendshipId: number };

export function getFriendState(viewerId: number, otherId: number): FriendState {
  const row = db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.requesterId, viewerId), eq(friendships.addresseeId, otherId)),
        and(eq(friendships.requesterId, otherId), eq(friendships.addresseeId, viewerId)),
      ),
    )
    .get();
  if (!row) return { kind: "none" };
  if (row.status === "accepted") return { kind: "friends", friendshipId: row.id };
  return row.requesterId === viewerId
    ? { kind: "outgoing", friendshipId: row.id }
    : { kind: "incoming", friendshipId: row.id };
}

export function searchUsers(q: string, excludeId: number): User[] {
  if (!q.trim()) return [];
  return db
    .select()
    .from(users)
    .where(
      and(
        ne(users.id, excludeId),
        or(like(users.username, `%${q}%`), like(users.displayName, `%${q}%`)),
      ),
    )
    .limit(12)
    .all();
}

export function getUserStats(userId: number) {
  const rated = db
    .select({ n: votesExpr, mean: meanExpr })
    .from(ratings)
    .where(eq(ratings.userId, userId))
    .get();
  const reviewed = db
    .select({ n: sql<number>`count(*)` })
    .from(reviews)
    .where(eq(reviews.userId, userId))
    .get();
  return {
    rated: rated?.n ?? 0,
    meanGiven: rated?.mean ?? 0,
    reviews: reviewed?.n ?? 0,
    friends: getFriendIds(userId).length,
  };
}

export function getUserRecentReviews(userId: number, limit = 6) {
  return db
    .select({ review: reviews, book: books, stars: ratings.stars })
    .from(reviews)
    .innerJoin(books, eq(books.id, reviews.bookId))
    .leftJoin(
      ratings,
      and(eq(ratings.userId, reviews.userId), eq(ratings.bookId, reviews.bookId)),
    )
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .all();
}

// ---------------- activity feed ----------------

export type FeedItem =
  | { type: "rating"; at: Date; user: User; book: Book; stars: number }
  | { type: "review"; at: Date; user: User; book: Book; body: string; stars: number | null }
  | { type: "friendship"; at: Date; user: User; other: User };

/** Recent activity from a set of users (friends, or everyone for the site feed). */
export function getActivity(userIds: number[] | "all", limit = 30): FeedItem[] {
  const items: FeedItem[] = [];
  const userFilter = (col: AnyColumn) =>
    userIds === "all" ? undefined : inArray(col, userIds);
  if (userIds !== "all" && userIds.length === 0) return [];

  const ratingRows = db
    .select({ r: ratings, user: users, book: books })
    .from(ratings)
    .innerJoin(users, eq(users.id, ratings.userId))
    .innerJoin(books, eq(books.id, ratings.bookId))
    .where(userFilter(ratings.userId))
    .orderBy(desc(ratings.createdAt))
    .limit(limit)
    .all();
  for (const row of ratingRows)
    items.push({ type: "rating", at: row.r.createdAt, user: row.user, book: row.book, stars: row.r.stars });

  const reviewRows = db
    .select({ rv: reviews, user: users, book: books, stars: ratings.stars })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.userId))
    .innerJoin(books, eq(books.id, reviews.bookId))
    .leftJoin(
      ratings,
      and(eq(ratings.userId, reviews.userId), eq(ratings.bookId, reviews.bookId)),
    )
    .where(userFilter(reviews.userId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .all();
  for (const row of reviewRows)
    items.push({
      type: "review",
      at: row.rv.createdAt,
      user: row.user,
      book: row.book,
      body: row.rv.body,
      stars: row.stars,
    });

  const requester = users;
  const friendRows = db
    .select()
    .from(friendships)
    .where(
      and(
        eq(friendships.status, "accepted"),
        userIds === "all"
          ? undefined
          : or(inArray(friendships.requesterId, userIds), inArray(friendships.addresseeId, userIds)),
      ),
    )
    .orderBy(desc(friendships.acceptedAt))
    .limit(limit)
    .all();
  for (const f of friendRows) {
    const a = db.select().from(requester).where(eq(requester.id, f.requesterId)).get();
    const b = db.select().from(requester).where(eq(requester.id, f.addresseeId)).get();
    if (a && b)
      items.push({ type: "friendship", at: f.acceptedAt ?? f.createdAt, user: a, other: b });
  }

  return items.sort((x, y) => y.at.getTime() - x.at.getTime()).slice(0, limit);
}
