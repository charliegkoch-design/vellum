import Link from "next/link";
import Stars from "./Stars";
import TiltCard from "./TiltCard";
import { formatMean } from "@/lib/ranking";

type Props = {
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  mean: number;
  votes: number;
};

export default function BookCard({ slug, title, author, coverUrl, mean, votes }: Props) {
  return (
    <Link href={`/books/${slug}`} className="group block">
      <TiltCard className="overflow-hidden rounded-lg border border-line shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] transition-shadow duration-300 group-hover:shadow-[0_26px_60px_-16px_rgba(0,0,0,0.95)]">
        <div className="relative aspect-[2/3] overflow-hidden bg-ink-raised">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />
          <div className="cover-shade" />
        </div>
      </TiltCard>
      <div className="mt-3 px-0.5">
        <p className="truncate text-sm font-medium text-cream">{title}</p>
        <p className="truncate text-xs text-cream-faint">{author}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-cream-dim">
          <Stars value={mean} className="text-[11px]" />
          {votes > 0 ? `${formatMean(mean)} · ${votes}` : "No ratings yet"}
        </p>
      </div>
    </Link>
  );
}
