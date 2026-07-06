import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getFriendState,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  searchUsers,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import Avatar from "@/components/Avatar";
import FriendButton from "@/components/FriendButton";

export const metadata: Metadata = { title: "Friends — Vellum" };

function PersonRow({
  person,
  children,
}: {
  person: { username: string; displayName: string; avatarColor: string; bio: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Link href={`/u/${person.username}`}>
        <Avatar name={person.displayName} color={person.avatarColor} size={44} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/u/${person.username}`} className="font-medium hover:underline">
          {person.displayName}
        </Link>
        <p className="truncate text-xs text-cream-faint">
          @{person.username}
          {person.bio ? ` · ${person.bio}` : ""}
        </p>
      </div>
      {children}
    </div>
  );
}

export default async function FriendsPage(props: PageProps<"/friends">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const incoming = getIncomingRequests(user.id);
  const outgoing = getOutgoingRequests(user.id);
  const friends = getFriends(user.id);
  const results = q ? searchUsers(q, user.id) : [];

  return (
    <main className="page-enter mx-auto max-w-3xl px-6 pb-28 pt-32">
      <h1 className="heading-display text-5xl md:text-6xl">
        Reading is <span className="italic text-cream-dim">better with company</span>
      </h1>

      {/* find readers */}
      <section className="card mt-12 p-6">
        <h2 className="text-sm uppercase tracking-widest text-cream-faint">Find readers</h2>
        <form action="/friends" className="mt-4">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name or username…"
            className="input-dark"
          />
        </form>
        {q && (
          <div className="mt-4 divide-y divide-line">
            {results.length === 0 && (
              <p className="py-3 text-sm italic text-cream-faint">Nobody by that name yet.</p>
            )}
            {results.map((p) => (
              <PersonRow key={p.id} person={p}>
                <FriendButton state={getFriendState(user.id, p.id)} otherId={p.id} />
              </PersonRow>
            ))}
          </div>
        )}
      </section>

      {/* incoming requests */}
      {incoming.length > 0 && (
        <section className="mt-12">
          <h2 className="heading-display text-3xl">
            Requests <span className="text-ember">({incoming.length})</span>
          </h2>
          <div className="mt-4 divide-y divide-line">
            {incoming.map(({ friendship, user: p }) => (
              <PersonRow key={friendship.id} person={p}>
                <FriendButton
                  state={{ kind: "incoming", friendshipId: friendship.id }}
                  otherId={p.id}
                />
              </PersonRow>
            ))}
          </div>
        </section>
      )}

      {/* outgoing requests */}
      {outgoing.length > 0 && (
        <section className="mt-12">
          <h2 className="heading-display text-3xl text-cream-dim">Sent requests</h2>
          <div className="mt-4 divide-y divide-line">
            {outgoing.map(({ friendship, user: p }) => (
              <PersonRow key={friendship.id} person={p}>
                <FriendButton
                  state={{ kind: "outgoing", friendshipId: friendship.id }}
                  otherId={p.id}
                />
              </PersonRow>
            ))}
          </div>
        </section>
      )}

      {/* friends */}
      <section className="mt-12">
        <h2 className="heading-display text-3xl">
          Friends <span className="text-cream-faint">({friends.length})</span>
        </h2>
        <div className="mt-4 divide-y divide-line">
          {friends.length === 0 && (
            <p className="py-4 text-sm italic text-cream-faint">
              No friends yet — search above to find readers you know.
            </p>
          )}
          {friends.map((p) => (
            <PersonRow key={p.id} person={p}>
              <FriendButton state={getFriendState(user.id, p.id)} otherId={p.id} />
            </PersonRow>
          ))}
        </div>
      </section>
    </main>
  );
}
