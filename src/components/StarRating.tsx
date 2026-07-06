"use client";

import { useState, useTransition } from "react";
import { rateBook, removeRating } from "@/lib/actions";

const STAR_PATH =
  "M12 2l2.9 6.26 6.6.7-4.9 4.56 1.36 6.48L12 16.77 6.04 20l1.36-6.48L2.5 8.96l6.6-.7L12 2z";

export default function StarRating({
  bookId,
  initial,
}: {
  bookId: number;
  initial: number | null;
}) {
  const [value, setValue] = useState(initial);
  const [hover, setHover] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const shown = hover ?? value ?? 0;

  const choose = (n: number) => {
    setValue(n);
    startTransition(() => rateBook(bookId, n));
  };
  const clear = () => {
    setValue(null);
    startTransition(() => removeRating(bookId));
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex" onPointerLeave={() => setHover(null)}>
        {Array.from({ length: 5 }, (_, i) => {
          const n = i + 1;
          const lit = shown >= n;
          return (
            <button
              key={n}
              onPointerEnter={() => setHover(n)}
              onClick={() => choose(n)}
              aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              className="cursor-pointer p-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-8 w-8 transition-colors duration-150 ${
                  lit ? "text-gold drop-shadow-[0_0_10px_rgba(217,164,65,0.35)]" : "text-cream/20"
                }`}
                fill="currentColor"
              >
                <path d={STAR_PATH} />
              </svg>
            </button>
          );
        })}
      </div>
      {value != null && (
        <button
          onClick={clear}
          className="cursor-pointer text-xs text-cream-faint underline-offset-4 hover:text-cream hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
