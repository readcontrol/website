"use client";

import { useEffect, useState } from "react";

import { KEY, read, write } from "@/lib/persist";

/**
 * Five empty stars at the foot of the letter. Click one to give the letter
 * that many; click the one you already gave to take it back. Like the heart,
 * nothing fills on hover — a star only lights up for a real choice, and the
 * choice is kept.
 */

const STARS = [1, 2, 3, 4, 5];

export default function RatingStars() {
  const [rating, setRating] = useState(0);

  // after hydration, so the server and the first client render agree
  useEffect(() => {
    const saved = Number(read(KEY.rating));
    if (Number.isInteger(saved) && saved >= 0 && saved <= STARS.length) {
      setRating(saved);
    }
  }, []);

  const give = (n: number) => {
    const next = rating === n ? 0 : n; // the star you already gave takes it back
    setRating(next);
    write(KEY.rating, String(next));
  };

  return (
    <span
      role="group"
      aria-label="Rate this letter"
      className="ml-[0.35em] inline-flex items-center gap-[0.1em] align-[-0.15em]"
    >
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} out of 5`}
          aria-pressed={n <= rating}
          onClick={() => give(n)}
          className="cursor-pointer px-[0.02em]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-[0.85em] w-[0.85em] stroke-[1.8] transition duration-300 motion-reduce:transition-none ${
              n <= rating
                ? "scale-110 fill-cream stroke-cream"
                : "fill-none stroke-cream-dim"
            }`}
          >
            <path
              d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44 6.19 20.5l1.11-6.47-4.7-4.58 6.5-.95L12 2.6Z"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </span>
  );
}
