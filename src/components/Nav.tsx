import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getIncomingRequests } from "@/lib/queries";
import { logOut } from "@/lib/actions";
import Avatar from "./Avatar";
import NavLinks from "./NavLinks";

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-ink-raised transition-colors group-hover:border-cream/30">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-cream" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3.5h9.5a2 2 0 0 1 2 2v15l-4-2.6-4 2.6v-15" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="heading-display text-2xl tracking-tight">Vellum</span>
    </Link>
  );
}

export default async function Nav() {
  const user = await getCurrentUser();
  const pending = user ? getIncomingRequests(user.id).length : 0;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-transparent" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <NavLinks pendingRequests={pending} />
        <div className="flex items-center justify-end gap-4">
          {user ? (
            <>
              <Link
                href={`/u/${user.username}`}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-cream/5"
              >
                <Avatar name={user.displayName} color={user.avatarColor} size={32} />
                <span className="hidden text-sm text-cream-dim sm:inline">
                  {user.displayName.split(" ")[0]}
                </span>
              </Link>
              <form action={logOut}>
                <button
                  className="cursor-pointer text-sm text-cream-faint transition-colors hover:text-cream"
                  title="Log out"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream-dim transition-colors hover:text-cream">
                Log in
              </Link>
              <Link href="/join" className="pill-solid !px-5 !py-2 text-sm">
                Join Vellum
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
