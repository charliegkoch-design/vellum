import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getActivity, getFriendIds } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import ActivityItem from "@/components/ActivityItem";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "Feed — Vellum" };

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const friendIds = getFriendIds(user.id);
  const items = getActivity(friendIds, 40);

  return (
    <main className="page-enter mx-auto max-w-2xl px-6 pb-28 pt-32">
      <p className="eyebrow mb-4">Fresh ink</p>
      <h1 className="heading-display text-5xl leading-[1.05] md:text-7xl">
        Your <span className="italic text-cream-dim">margins</span>
      </h1>
      <p className="mt-4 text-cream-dim">What your friends are reading, rating, and arguing about.</p>

      {friendIds.length === 0 ? (
        <div className="card mt-12 p-10 text-center">
          <p className="heading-display text-3xl">It&apos;s quiet in here.</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-cream-dim">
            Your feed fills up when you add friends. Go find the people whose taste you trust
            (or love to fight with).
          </p>
          <Link href="/friends" className="pill-solid mt-6 inline-flex">
            Find friends
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex flex-col divide-y divide-line">
          {items.length === 0 && (
            <p className="py-6 text-sm italic text-cream-faint">
              Your friends have been suspiciously quiet. Rate something and set an example.
            </p>
          )}
          {items.map((item, i) => (
            <Reveal key={`${item.type}-${i}`} delay={Math.min(i * 30, 300)}>
              <ActivityItem item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
