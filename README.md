# Vellum

A social library: rate the books you love, write reviews, browse the site's
top-rated canon, add friends, and follow their reading lives. The landing page
is a draggable 3D shelf of your ten highest-rated books.

## Stack

- **Next.js 16** (App Router, Turbopack, server actions) + TypeScript
- **Tailwind CSS v4** — warm-dark editorial theme, Instrument Serif + Inter
- **GSAP 3.15** — Draggable + InertiaPlugin drive the hero shelf; entrance
  timelines animate the wordmark and books
- **SQLite** (better-sqlite3) + **Drizzle ORM** — zero-config local persistence
- Hand-rolled cookie-session auth (bcryptjs + sessions table)

## Getting started

```bash
npm install
npm run setup   # downloads covers from Open Library, pushes schema, seeds demo data
npm run dev     # http://localhost:3000
```

Demo login: **charlie / books123** (all 8 demo users share the password).

## Scripts

| Script         | What it does                                            |
| -------------- | ------------------------------------------------------- |
| `npm run dev`  | dev server on :3000                                     |
| `npm run build`| production build                                        |
| `npm run covers` | fetch real covers → `public/covers/` (SVG fallback if offline) |
| `npm run db:push` | create/update SQLite schema (`.data/vellum.db`)      |
| `npm run db:seed` | reset + seed 8 users, 60 books, ratings, reviews, friendships |

## Notes

- The hero shelf is pure CSS 3D (perspective + preserve-3d boxes) driven by
  GSAP Draggable with inertia snapping; click a book to pull it forward,
  drag/scroll/arrow-key to browse, genre pills to swap the set.
- Top Rated uses a Bayesian weighted score `(v·R + m·C)/(v + m)` so books need
  both love *and* readers to rank.
- All motion respects `prefers-reduced-motion`; `?instant` skips entrance
  animations (used by automated checks).
- Book covers are fetched from Open Library at setup time and served locally.
