import type { ReactNode } from "react";

/** Small inline icons (stroke, cream-dim) used across the page. */
type IconProps = { size?: number; className?: string };

export function Bookmark({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Apple({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M17.05 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.87 2.31 1.15-.05 1.58-.75 2.97-.75s1.78.75 3 .72c1.24-.02 2.02-1.13 2.78-2.24.87-1.28 1.23-2.52 1.25-2.59-.03-.01-2.4-.92-2.42-3.65M14.77 5.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.76-.95 2.8 1.02.08 2.05-.51 2.68-1.27"
        fill="currentColor"
      />
    </svg>
  );
}

export function Check({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tailwind aspect-ratio utilities the media frames are allowed to use. */
export type AspectRatio = "aspect-video" | "aspect-4/3";

/** Zig-zag feature rows. Each has a short lead + a few terse bullets. */
export type Feature = {
  title: string;
  lead: string;
  bullets: string[];
  image: string; // /images/...
  /** Tailwind aspect-ratio utility for the media frame. */
  ratio: AspectRatio;
};

export const FEATURES: Feature[] = [
  {
    title: "For readers",
    lead: "Navigate and manage your readings",
    bullets: [
      "Unread list",
      "Typography config",
      "Highlights",
      "Ratings",
      "Tags",
    ],
    image: "/images/native-reader.png",
    ratio: "aspect-4/3",
  },
  {
    title: "Save any page in one click",
    lead: "The browser extension cleans the page and saves it in your machine.",
    bullets: [
      "Ads, nav & clutter stripped",
      "Works on JS-rendered & logged-in pages",
      "Images saved locally",
      "Support Chrome and Firefox",
    ],
    image: "/images/save-from-browser.png",
    ratio: "aspect-4/3",
  },
  {
    title: "They are just files",
    lead: "Every reading is a Markdown file on your disk",
    bullets: [
      "YAML frontmatter",
      "Open in any editor",
      "No lock-in, no export needed",
      "Optional HTML snapshot",
    ],
    image: "/images/your-files.png",
    ratio: "aspect-4/3",
  },
  {
    title: "Bring your own sync",
    lead: "Point it at a folder and sync however you like.",
    bullets: [
      "iCloud, Dropbox, git — your call",
      "No accounts, no servers",
      "Fully offline",
      "Index rebuilds from files",
    ],
    image: "/images/sync.png",
    ratio: "aspect-4/3",
  },
];

/** Compact "everything else" grid. */
export type MiniFeature = { icon: ReactNode; title: string; body: string };
