"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { KEY, read, write } from "@/lib/persist";

/**
 * The word in the letter with a heart in front of it. Clicking fills the heart
 * red, the way the app does; clicking again lets it go. Nothing happens on
 * hover — the heart only ever shows a real choice, and the choice is kept.
 */
export default function FavoriteWord({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  // after hydration, so the server and the first client render agree
  useEffect(() => setOn(read(KEY.favorite) === "1"), []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    write(KEY.favorite, next ? "1" : "0");
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      className="inline-flex cursor-pointer items-baseline gap-[0.3em] align-baseline whitespace-nowrap"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`h-[0.8em] w-[0.8em] self-center stroke-2 transition duration-300 motion-reduce:transition-none ${
          on ? "scale-115 fill-heart stroke-heart" : "fill-none stroke-cream-dim"
        }`}
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </button>
  );
}
