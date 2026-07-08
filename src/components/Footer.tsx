import Link from "next/link";

const COLUMNS: [string, { href: string; label: string }[]][] = [
  [
    "Library",
    [
      { href: "/books", label: "Discover" },
      { href: "/top", label: "Top Rated" },
    ],
  ],
  [
    "Social",
    [
      { href: "/feed", label: "Feed" },
      { href: "/friends", label: "Friends" },
    ],
  ],
  [
    "Account",
    [
      { href: "/join", label: "Join Vellum" },
      { href: "/login", label: "Log in" },
    ],
  ],
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-20">
        <div>
          <p className="heading-display text-5xl md:text-6xl">
            Vellum<span className="text-ember">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-faint">
            A social library. Every book you loved, every argument in the margins, every friend
            whose taste you trust.
          </p>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title}>
            <p className="eyebrow mb-5 !gap-3 before:!w-4">{title}</p>
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream-dim transition-colors hover:text-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs text-cream-faint/80">
          Vellum — rate, review &amp; shelve books with friends. Cover art courtesy of{" "}
          <a
            href="https://openlibrary.org"
            className="underline underline-offset-4 hover:text-cream"
          >
            Open Library
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
