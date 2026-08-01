import type { ReactNode } from "react";

import FavoriteWord from "@/components/FavoriteWord";
import FilterWord from "@/components/FilterWord";
import RatingStars from "@/components/RatingStars";
import TagInput from "@/components/TagInput";
import ThemeWord from "@/components/ThemeWord";

/**
 * A plain-spoken letter under the video — 37signals style: one narrow column,
 * big comfortable type, a real person talking instead of feature bullets.
 *
 * The twist: the words demonstrate themselves. "Highlight" is highlighted,
 * the clutter strikes itself out, the typeface changes under "font type and
 * size". Each word shows its resting state and sharpens when you hover it.
 *
 * The effects here are CSS-only. The ones that answer to a click live in their
 * own client components: TagInput, FavoriteWord, ThemeWord, RatingStars.
 */

/** The signature, tagged so the other side can see the letter sent them. */
const AUTHOR = "https://rodrigoboniatti.com/?utm_source=readcontrol.app";

/** Highlighted, the way a highlight looks in the app. */
function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[0.2em] bg-fg/15 px-[0.25em] py-[0.06em] text-fg transition-colors duration-300 hover:bg-highlight hover:text-[#17181a] motion-reduce:transition-none">
      {children}
    </span>
  );
}

/** Plain text, in the typeface plain text gets saved as. */
function Mono({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[0.2em] bg-surface-2 px-[0.35em] py-[0.08em] font-mono text-[0.85em] text-cream">
      {children}
    </span>
  );
}

/** Clutter: still there, until you brush past it. */
function Clutter({ children }: { children: ReactNode }) {
  return (
    <span className="text-fg-muted decoration-fg-subtle decoration-2 transition-all duration-300 hover:text-fg-subtle hover:line-through hover:opacity-40 motion-reduce:transition-none">
      {children}
    </span>
  );
}

/** The words "font type and size", set in another face and a size up. */
function Typeface({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif text-[1.05em] tracking-wide">{children}</span>
  );
}

export default function Letter() {
  return (
    <section
      // the letter ends the page, so its foot carries the page's own margin
      className="pt-8 pb-20 md:pt-12 md:pb-26 lg:pt-14 lg:pb-32"
      id="letter"
    >
      <div className="mx-auto w-full max-w-[40rem] px-6">
        <p className="text-xs font-semibold tracking-widest text-fg-subtle uppercase">
          A note from the maker
        </p>

        <div className="mt-8 space-y-7 text-lg leading-[1.85] text-fg md:text-xl md:leading-[1.8]">
          <p>
            Read Control lets you manage your readings easily.
          </p>

          <p>
            The extension saves your pages and strips out all the clutter — the{" "}
            <Clutter>modals, the banners, the ads</Clutter>. The Mac app lets
            you set the <Typeface>font type and size</Typeface>, so everything
            you read looks the way you want it to. Ah, and it does{" "}
            <ThemeWord /> too.
          </p>

          <p>
            <Highlight>Highlight</Highlight>, <TagInput />, and{" "}
            <FavoriteWord>favorite</FavoriteWord> your readings, and build a
            library of everything you have ever come across. Then use the{" "}
            <FilterWord /> to find the one you want to send to a friend.
          </p>

          <p>
            Every page is saved on your machine as a{" "}
            <Mono>reading.md</Mono> file. You own them, and you can move them
            whenever you want. I would keep them in a folder that syncs to the
            cloud too — Dropbox, iCloud, Google Drive, whichever you already
            pay for.
          </p>

          <p>
            Don&apos;t forget to rate them at the end.
            <RatingStars />
          </p>

          <p>Enjoy your readings!</p>
        </div>

        <p className="mt-10">
          <a
            className="group relative inline-block font-hand text-3xl leading-none text-fg-muted transition-colors hover:text-fg motion-reduce:transition-none"
            href={AUTHOR}
          >
            Rodrigo Boniatti
            {/* the flourish under a signature: one curved stroke, drawn on
                hover from left to right the way a pen would */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              fill="none"
              className="pointer-events-none absolute inset-x-0 -bottom-1.5 h-[0.4em] w-full overflow-visible"
            >
              <path
                d="M2 7.5C36 2.6 78 .9 122 3.1c22 1.1 46 3.8 76 7.4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                // The whole stroke counts as 1, whatever it measures once the
                // viewBox is stretched to the name, so one dash covers it
                // exactly: offset 1 is hidden, offset 0 is fully drawn.
                // non-scaling-stroke cannot come back here — it moves the dash
                // into screen pixels, ignores this, and leaves a 1px-dotted
                // line showing at rest. The box is sized so the stroke lands
                // at its stated width instead.
                //
                // The gap is 2 rather than 1 so that at rest the hidden path
                // sits well inside it. With an equal gap the far end lands
                // exactly on the next dash, and the round cap draws a dot
                // there — one dash's worth of ink on a stroke meant to be
                // invisible.
                pathLength={1}
                className="[stroke-dasharray:1_2] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 group-hover:[stroke-dashoffset:0] motion-reduce:transition-none"
              />
            </svg>
          </a>
        </p>
      </div>
    </section>
  );
}
