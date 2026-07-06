import Link from "next/link";
import Avatar from "./Avatar";
import Stars from "./Stars";
import { timeAgo } from "@/lib/format";
import type { FeedItem } from "@/lib/queries";

export default function ActivityItem({ item }: { item: FeedItem }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <Link href={`/u/${item.user.username}`} className="mt-0.5 shrink-0">
        <Avatar name={item.user.displayName} color={item.user.avatarColor} size={38} />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-cream-dim">
          <Link href={`/u/${item.user.username}`} className="font-medium text-cream hover:underline">
            {item.user.displayName}
          </Link>{" "}
          {item.type === "rating" && (
            <>
              rated{" "}
              <Link href={`/books/${item.book.slug}`} className="italic text-cream hover:underline">
                {item.book.title}
              </Link>{" "}
              <Stars value={item.stars} className="relative top-[2px] text-[13px]" />
            </>
          )}
          {item.type === "review" && (
            <>
              reviewed{" "}
              <Link href={`/books/${item.book.slug}`} className="italic text-cream hover:underline">
                {item.book.title}
              </Link>
              {item.stars != null && (
                <>
                  {" "}
                  <Stars value={item.stars} className="relative top-[2px] text-[13px]" />
                </>
              )}
            </>
          )}
          {item.type === "friendship" && (
            <>
              became friends with{" "}
              <Link href={`/u/${item.other.username}`} className="font-medium text-cream hover:underline">
                {item.other.displayName}
              </Link>
            </>
          )}
        </p>
        {item.type === "review" && (
          <p className="mt-1.5 line-clamp-2 border-l-2 border-line pl-3 text-sm italic text-cream-faint">
            “{item.body}”
          </p>
        )}
        <p className="mt-1 text-xs text-cream-faint/70">{timeAgo(item.at)}</p>
      </div>
    </div>
  );
}
