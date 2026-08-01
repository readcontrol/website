"use client";

import { useEffect, useState } from "react";

import { KEY, read, write } from "@/lib/persist";

/**
 * The word in the letter that names the theme you are *not* in — "dark theme"
 * while you are on paper, "light theme" while you are on charcoal.
 *
 * Clicking it swaps the whole page to that theme and keeps it, and the word
 * flips to name the way back. The choice is stored, and `layout.tsx`
 * re-applies it before first paint.
 */

type Theme = "light" | "dark";

/** What the page is actually showing right now. */
function current(): Theme {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === "light" || pinned === "dark") return pinned;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function stored(): Theme | null {
  const v = read(KEY.theme);
  return v === "light" || v === "dark" ? v : null;
}

/** Paint a theme on the page. */
function show(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function Sun() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[0.8em] w-[0.8em] self-center"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
  );
}

function Moon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[0.8em] w-[0.8em] self-center"
      fill="currentColor"
    >
      <path d="M21 14.2A9.2 9.2 0 0 1 9.8 3a9.3 9.3 0 1 0 11.2 11.2Z" />
    </svg>
  );
}

export default function ThemeWord() {
  // Until React takes over, the label is decided in CSS (see below) so the
  // server and the first client render agree no matter which theme is on.
  const [live, setLive] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(current());
    setLive(true);

    // follow the system while the reader has not pinned anything
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!stored()) setTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  const target: Theme = theme === "dark" ? "light" : "dark";

  const keep = () => {
    write(KEY.theme, target);
    show(target);
    setTheme(target);
  };

  return (
    <button
      type="button"
      onClick={keep}
      aria-label={`Switch to the ${target} theme`}
      className="mx-[0.05em] inline-flex cursor-pointer items-baseline gap-[0.3em] rounded-md border border-line-strong bg-surface-2 px-[0.45em] py-[0.05em] align-baseline transition duration-300 hover:border-fg-subtle hover:bg-surface motion-reduce:transition-none"
    >
      {live ? (
        <>
          {target === "dark" ? <Moon /> : <Sun />}
          {target} theme
        </>
      ) : (
        // pre-hydration: CSS picks the label, since it knows the theme and we
        // do not. Both spellings ship; the wrong one is display:none.
        <>
          <span className="contents dark:hidden">
            <Moon />
            dark theme
          </span>
          <span className="hidden dark:contents">
            <Sun />
            light theme
          </span>
        </>
      )}
    </button>
  );
}
