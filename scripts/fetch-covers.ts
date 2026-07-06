/**
 * Downloads real book covers from Open Library into public/covers/{slug}.jpg.
 * Any book whose cover can't be found gets a generated SVG fallback instead,
 * so the app renders fully offline.
 *
 * Run: npx tsx scripts/fetch-covers.ts
 */
import fs from "node:fs";
import path from "node:path";
import { CATALOG, type CatalogBook } from "../src/db/catalog";

const OUT_DIR = path.join(process.cwd(), "public", "covers");
const UA = "Vellum/0.1 (local dev book site; contact: none)";

const PALETTES: Record<string, { bg: string; bg2: string; fg: string; accent: string }> = {
  Romance: { bg: "#4a1d2e", bg2: "#2b0f1b", fg: "#f4dfe2", accent: "#e28aa0" },
  Fantasy: { bg: "#1d2b4a", bg2: "#0f172b", fg: "#e3e8f4", accent: "#8aa8e2" },
  Classic: { bg: "#3a3324", bg2: "#211d12", fg: "#f0e9d6", accent: "#d9a441" },
  Memoir: { bg: "#1f3a33", bg2: "#102019", fg: "#dfeee8", accent: "#7fc2ac" },
  "Sci-Fi": { bg: "#17323e", bg2: "#0b1a21", fg: "#dcedf4", accent: "#5fb7d4" },
  Thriller: { bg: "#3d1a1a", bg2: "#1f0d0d", fg: "#f2dede", accent: "#d45f5f" },
};

function esc(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapTitle(title: string, max = 14): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 5);
}

function fallbackSvg(book: CatalogBook): string {
  const p = PALETTES[book.genre] ?? PALETTES.Classic;
  const lines = wrapTitle(book.title);
  const lineHeight = 64;
  const startY = 320 - ((lines.length - 1) * lineHeight) / 2;
  const titleSpans = lines
    .map((l, i) => `<tspan x="300" y="${startY + i * lineHeight}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg}"/>
      <stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#g)"/>
  <rect x="28" y="28" width="544" height="844" fill="none" stroke="${p.accent}" stroke-opacity="0.55" stroke-width="2"/>
  <rect x="40" y="40" width="520" height="820" fill="none" stroke="${p.accent}" stroke-opacity="0.25" stroke-width="1"/>
  <text text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="${p.fg}">${titleSpans}</text>
  <path d="M270 ${startY + lines.length * lineHeight + 10} h60 M300 ${startY + lines.length * lineHeight + 2} v16" stroke="${p.accent}" stroke-width="1.5"/>
  <text x="300" y="770" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="4" fill="${p.accent}">${esc(book.author.toUpperCase())}</text>
  <text x="300" y="820" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="${p.fg}" fill-opacity="0.5">${book.year}</text>
</svg>`;
}

async function findCoverId(book: CatalogBook): Promise<number | null> {
  const url =
    `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}` +
    `&author=${encodeURIComponent(book.author)}&limit=5&fields=cover_i,title`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = (await res.json()) as { docs?: { cover_i?: number }[] };
  const doc = data.docs?.find((d) => d.cover_i);
  return doc?.cover_i ?? null;
}

async function downloadCover(coverId: number, dest: string): Promise<boolean> {
  const url = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) return false; // blank placeholder
  fs.writeFileSync(dest, buf);
  return true;
}

async function processBook(book: CatalogBook): Promise<string> {
  const jpg = path.join(OUT_DIR, `${book.slug}.jpg`);
  const svg = path.join(OUT_DIR, `${book.slug}.svg`);
  if (fs.existsSync(jpg)) return "cached";
  if (fs.existsSync(svg)) return "cached-svg";
  try {
    const coverId = await findCoverId(book);
    if (coverId && (await downloadCover(coverId, jpg))) return "jpg";
  } catch {
    // fall through to svg
  }
  fs.writeFileSync(svg, fallbackSvg(book));
  return "svg-fallback";
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let done = 0;
  const results: Record<string, string> = {};
  const queue = [...CATALOG];
  const workers = Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const book = queue.shift()!;
      results[book.slug] = await processBook(book);
      done++;
      process.stdout.write(`\r${done}/${CATALOG.length} covers processed`);
    }
  });
  await Promise.all(workers);
  const fallbacks = Object.entries(results).filter(([, r]) => r === "svg-fallback");
  console.log(`\nDone. ${fallbacks.length} SVG fallbacks:`, fallbacks.map(([s]) => s).join(", ") || "none");
}

main();
