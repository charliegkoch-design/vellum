"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/books", label: "Discover" },
  { href: "/top", label: "Top Rated" },
  { href: "/feed", label: "Feed" },
  { href: "/friends", label: "Friends" },
];

export default function NavLinks({ pendingRequests }: { pendingRequests: number }) {
  const pathname = usePathname();
  return (
    <div className="hidden items-center gap-8 md:flex">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          data-active={pathname === l.href || pathname.startsWith(l.href + "/")}
          className="nav-link relative text-sm text-cream-dim transition-colors hover:text-cream"
        >
          {l.label}
          {l.href === "/friends" && pendingRequests > 0 && (
            <span className="absolute -right-3.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-semibold text-ink">
              {pendingRequests}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
