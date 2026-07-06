/**
 * Seeds the database with the book catalog, 8 demo users, ratings, reviews,
 * and friendships so every page is alive on first run.
 *
 * Run after fetch-covers + drizzle push:  npx tsx src/db/seed.ts
 */
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { users, books, ratings, reviews, friendships, sessions } from "./schema";
import { CATALOG } from "./catalog";

// deterministic PRNG so reseeding is stable
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260706);

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (min: number, max: number) =>
  new Date(NOW - (min + rand() * (max - min)) * DAY);

const DEMO_USERS = [
  { username: "charlie", displayName: "Charlie Koch", bio: "Reads on the train. Rates with his heart.", avatarColor: "#e2582a" },
  { username: "maya", displayName: "Maya Lindqvist", bio: "Fantasy first, sleep second.", avatarColor: "#8aa8e2" },
  { username: "theo", displayName: "Theo Okafor", bio: "Slow reader, strong opinions.", avatarColor: "#7fc2ac" },
  { username: "priya", displayName: "Priya Raman", bio: "Currently three book clubs deep.", avatarColor: "#d9a441" },
  { username: "jonah", displayName: "Jonah Beck", bio: "Thrillers and cold brew.", avatarColor: "#d45f5f" },
  { username: "elle", displayName: "Elle Fontaine", bio: "Annotating in pen. No regrets.", avatarColor: "#e28aa0" },
  { username: "marcus", displayName: "Marcus Webb", bio: "Sci-fi is just philosophy with lasers.", avatarColor: "#5fb7d4" },
  { username: "sofia", displayName: "Sofia Marchetti", bio: "Rereading my comfort classics forever.", avatarColor: "#b79ce0" },
];

// handwritten reviews: slug → { username, stars, body }
const REVIEWS: { slug: string; username: string; stars: number; body: string }[] = [
  { slug: "project-hail-mary", username: "charlie", stars: 5, body: "Read this in two sittings. The reveal a third of the way in genuinely made me put the book down and grin. The most fun I've had reading in years." },
  { slug: "the-name-of-the-wind", username: "charlie", stars: 5, body: "Rothfuss writes sentences you want to read aloud. Yes, book three may never come. I've made peace with it. Mostly." },
  { slug: "gone-girl", username: "charlie", stars: 4, body: "The diary twist is one of the great rug-pulls in modern fiction. Loses half a star because everyone in it is a monster, which is also the point." },
  { slug: "east-of-eden", username: "charlie", stars: 5, body: "Timshel. That's it, that's the review." },
  { slug: "piranesi", username: "maya", stars: 5, body: "The beauty and kindness of the House is infinite. A perfect, strange little book that I think about constantly." },
  { slug: "the-fifth-season", username: "maya", stars: 5, body: "The second-person narration shouldn't work. It works. The ending recontextualizes the entire structure of the book. Jemisin earned all three Hugos." },
  { slug: "the-way-of-kings", username: "maya", stars: 4, body: "A thousand pages of setup that pays off with the best final 100 pages in epic fantasy. Bridge Four forever." },
  { slug: "outlander", username: "maya", stars: 3, body: "Immersive and sweeping, but I have some notes for Jamie. And several for the pacing." },
  { slug: "dune", username: "marcus", stars: 5, body: "Sixty years old and still the standard. Ecology, religion, politics, giant worms — every sci-fi epic since is living in its shadow." },
  { slug: "neuromancer", username: "marcus", stars: 4, body: "Gibson saw the internet coming before it existed and made it noir. Dense as concrete but worth every reread." },
  { slug: "the-three-body-problem", username: "marcus", stars: 4, body: "The physics is audacious and the Cultural Revolution framing is devastating. Characters are chess pieces, but what a game." },
  { slug: "klara-and-the-sun", username: "sofia", stars: 4, body: "Ishiguro breaks your heart in that quiet way of his where you don't notice until the last page. Klara deserved better. We all deserved better." },
  { slug: "pride-and-prejudice", username: "sofia", stars: 5, body: "Two hundred years of romance novels and nobody has topped the hand flex. Perfect book, zero notes." },
  { slug: "jane-eyre", username: "sofia", stars: 5, body: "Reader, I reread it annually. Jane's refusal to shrink herself for anyone remains radical." },
  { slug: "one-hundred-years-of-solitude", username: "sofia", stars: 4, body: "You will need the family tree. Keep going anyway — the last page is worth a century." },
  { slug: "the-silent-patient", username: "jonah", stars: 4, body: "Saw the twist coming at the 70% mark and it still landed. Perfect airplane thriller." },
  { slug: "in-the-woods", username: "jonah", stars: 5, body: "French refuses to give you the answer you want and the book is better for it. The prose is way above the genre's pay grade." },
  { slug: "and-then-there-were-none", username: "jonah", stars: 5, body: "The blueprint. Every locked-room mystery since 1939 is a footnote to this." },
  { slug: "no-country-for-old-men", username: "jonah", stars: 4, body: "McCarthy doesn't use quotation marks and Chigurh doesn't use mercy. Bleak, spare, unforgettable." },
  { slug: "educated", username: "priya", stars: 5, body: "The scene with the journal entries — writing down two versions of the truth — explains memory better than any psychology book I've read." },
  { slug: "when-breath-becomes-air", username: "priya", stars: 5, body: "Read the epilogue by his wife in one breath, crying at a café. A doctor learning to be a patient. Essential." },
  { slug: "crying-in-h-mart", username: "priya", stars: 4, body: "Grief as a grocery list. The jatjuk chapter wrecked me completely." },
  { slug: "born-a-crime", username: "theo", stars: 5, body: "Funniest book ever written about apartheid, which sounds impossible until you read it. His mother is the real protagonist." },
  { slug: "kitchen-confidential", username: "theo", stars: 4, body: "Reads like Bourdain talked: fast, generous, a little dangerous. Still never ordering fish on a Monday." },
  { slug: "the-great-gatsby", username: "theo", stars: 4, body: "Assigned it to myself twenty years after high school. Turns out it's actually good when nobody's making you write an essay about the green light." },
  { slug: "beach-read", username: "elle", stars: 5, body: "Emily Henry writes banter you want to live inside. The genre-swap premise is a delivery mechanism for two people learning to be honest. Perfect summer book." },
  { slug: "book-lovers", username: "elle", stars: 5, body: "A romance novel about the woman who's always the cold career villain in other romance novels. Meta, sharp, and genuinely moving." },
  { slug: "red-white-and-royal-blue", username: "elle", stars: 4, body: "History, huh? Pure serotonin with footnotes of actual political anxiety." },
  { slug: "the-love-hypothesis", username: "elle", stars: 3, body: "Fun but I've read this exact fake-dating scaffolding a dozen times. The STEM setting carries it." },
  { slug: "the-hobbit", username: "theo", stars: 5, body: "Read it to my daughter over a month of bedtimes. Riddles in the dark still gets the biggest gasp, eighty years on." },
  { slug: "mistborn-the-final-empire", username: "charlie", stars: 4, body: "The magic system is basically a physics engine and the heist plot actually resolves. Sanderson delivers exactly what he promises." },
  { slug: "rebecca", username: "sofia", stars: 5, body: "The dead wife is the main character and she never appears on a single page. Mrs. Danvers remains terrifying. Gothic perfection." },
];

// friendships: [requester, addressee, status]
const FRIENDSHIPS: [string, string, "pending" | "accepted"][] = [
  ["charlie", "maya", "accepted"],
  ["theo", "charlie", "accepted"],
  ["charlie", "priya", "accepted"],
  ["marcus", "charlie", "accepted"],
  ["jonah", "charlie", "pending"], // incoming request for charlie
  ["charlie", "elle", "pending"], // outgoing request from charlie
  ["maya", "theo", "accepted"],
  ["maya", "sofia", "accepted"],
  ["priya", "elle", "accepted"],
  ["elle", "sofia", "accepted"],
  ["marcus", "maya", "pending"],
  ["jonah", "theo", "accepted"],
];

async function main() {
  console.log("Clearing existing data…");
  db.delete(sessions).run();
  db.delete(friendships).run();
  db.delete(reviews).run();
  db.delete(ratings).run();
  db.delete(books).run();
  db.delete(users).run();

  console.log("Inserting users…");
  const passwordHash = bcrypt.hashSync("books123", 10);
  const userRows = db
    .insert(users)
    .values(
      DEMO_USERS.map((u, i) => ({
        ...u,
        email: `${u.username}@vellum.demo`,
        passwordHash,
        createdAt: new Date(NOW - (120 - i * 7) * DAY),
      })),
    )
    .returning()
    .all();
  const userId = new Map(userRows.map((u) => [u.username, u.id]));

  console.log("Inserting books…");
  const coversDir = path.join(process.cwd(), "public", "covers");
  const bookRows = db
    .insert(books)
    .values(
      CATALOG.map((b) => ({
        slug: b.slug,
        title: b.title,
        author: b.author,
        year: b.year,
        genre: b.genre,
        description: b.description,
        coverUrl: fs.existsSync(path.join(coversDir, `${b.slug}.jpg`))
          ? `/covers/${b.slug}.jpg`
          : `/covers/${b.slug}.svg`,
      })),
    )
    .returning()
    .all();
  const bookId = new Map(bookRows.map((b) => [b.slug, b.id]));

  console.log("Inserting ratings…");
  // each book gets a hidden quality prior so the top-rated chart looks sane
  const quality = new Map(CATALOG.map((b) => [b.slug, 3.1 + rand() * 1.7]));
  const ratingKey = new Set<string>();
  const ratingRows: (typeof ratings.$inferInsert)[] = [];

  for (const u of DEMO_USERS) {
    const uid = userId.get(u.username)!;
    const count = u.username === "charlie" ? 26 : 16 + Math.floor(rand() * 12);
    const shuffled = [...CATALOG].sort(() => rand() - 0.5);
    for (const b of shuffled.slice(0, count)) {
      const q = quality.get(b.slug)!;
      const stars = Math.max(1, Math.min(5, Math.round(q + (rand() - 0.5) * 2)));
      ratingRows.push({ userId: uid, bookId: bookId.get(b.slug)!, stars, createdAt: daysAgo(0, 60) });
      ratingKey.add(`${uid}:${b.slug}`);
    }
  }
  // reviews imply ratings — upsert so review stars match the rating shown
  for (const r of REVIEWS) {
    const uid = userId.get(r.username)!;
    const key = `${uid}:${r.slug}`;
    if (ratingKey.has(key)) {
      const row = ratingRows.find((x) => x.userId === uid && x.bookId === bookId.get(r.slug)!)!;
      row.stars = r.stars;
    } else {
      ratingRows.push({ userId: uid, bookId: bookId.get(r.slug)!, stars: r.stars, createdAt: daysAgo(0, 45) });
      ratingKey.add(key);
    }
  }
  db.insert(ratings).values(ratingRows).run();

  console.log("Inserting reviews…");
  db.insert(reviews)
    .values(
      REVIEWS.map((r) => ({
        userId: userId.get(r.username)!,
        bookId: bookId.get(r.slug)!,
        body: r.body,
        createdAt: daysAgo(0, 45),
      })),
    )
    .run();

  console.log("Inserting friendships…");
  db.insert(friendships)
    .values(
      FRIENDSHIPS.map(([req, add, status]) => ({
        requesterId: userId.get(req)!,
        addresseeId: userId.get(add)!,
        status,
        createdAt: daysAgo(10, 90),
        acceptedAt: status === "accepted" ? daysAgo(1, 10) : null,
      })),
    )
    .run();

  console.log(
    `Seeded ${userRows.length} users, ${bookRows.length} books, ${ratingRows.length} ratings, ${REVIEWS.length} reviews, ${FRIENDSHIPS.length} friendships.`,
  );
  console.log("Demo login: charlie / books123");
}

main();
