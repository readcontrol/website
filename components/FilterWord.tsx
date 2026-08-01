"use client";

import { useEffect, useRef, useState } from "react";

import { KEY, read, write } from "@/lib/persist";

/**
 * The filter pill in the letter, which is a real filter: click it and a little
 * menu drops open the way it does in the app. Pick a topic and it takes the
 * pill's place — the word you chose becomes the label — and it is kept, so the
 * pill comes back set to it next time.
 *
 * "filters" is only the resting label, shown until a topic is picked. The
 * chevron turns over while the menu is open, and the menu closes on a pick, on
 * Escape, or on a click anywhere outside it.
 */

/** The topics you can filter by, in the order they appear. */
const TOPICS = ["Science", "Sports", "Tech", "Cars"] as const;
type Topic = (typeof TOPICS)[number];

function isTopic(v: string | null): v is Topic {
  return TOPICS.includes(v as Topic);
}

export default function FilterWord() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Topic | null>(null);
  const wrap = useRef<HTMLSpanElement>(null);

  // after hydration, so the server and the first client render agree
  useEffect(() => {
    const saved = read(KEY.filter);
    if (isTopic(saved)) setPicked(saved);
  }, []);

  // a click outside the pill, or Escape, folds the menu back up
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // picking the topic you already have clears it, back to the "filters" label
  const choose = (topic: Topic) => {
    const next = picked === topic ? null : topic;
    setPicked(next);
    write(KEY.filter, next ?? "");
    setOpen(false);
  };

  return (
    <span ref={wrap} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mx-[0.05em] inline-flex cursor-pointer items-baseline gap-[0.3em] rounded-md border border-line-strong bg-surface-2 px-[0.45em] py-[0.05em] align-baseline transition duration-300 hover:border-fg-subtle hover:bg-surface motion-reduce:transition-none"
      >
        {picked ?? "filters"}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-[0.5em] w-[0.5em] self-center text-fg-subtle transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m5 9 7 7 7-7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-10 mt-[0.35em] min-w-[7em] overflow-hidden rounded-md border border-line-strong bg-surface py-[0.25em] text-[0.9em] shadow-lg"
        >
          {TOPICS.map((topic) => (
            <li key={topic} role="option" aria-selected={picked === topic}>
              <button
                type="button"
                onClick={() => choose(topic)}
                className={`block w-full cursor-pointer px-[0.9em] py-[0.35em] text-left transition-colors duration-150 hover:bg-surface-2 motion-reduce:transition-none ${
                  picked === topic ? "text-fg" : "text-fg-muted"
                }`}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
