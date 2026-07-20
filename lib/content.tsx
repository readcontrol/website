import type { ReactNode } from "react";

/** Small inline icons (stroke, cream-dim) used across the page. */
export function Bookmark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Check({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/** Zig-zag feature rows. Each has a short lead + a few terse bullets. */
export type Feature = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets: string[];
  image: string; // /images/...
  ratio: "ratio-16-9" | "ratio-4-3";
};

export const FEATURES: Feature[] = [
  {
    eyebrow: "Save",
    title: "Clip any page in one click",
    lead: "The browser extension cleans the page and saves it as Markdown.",
    bullets: [
      "Works on JS-rendered & logged-in pages",
      "Ads, nav & clutter stripped",
      "Images saved locally",
      "Duplicates detected",
    ],
    image: "/images/save-from-browser.png",
    ratio: "ratio-4-3",
  },
  {
    eyebrow: "Own your data",
    title: "Plain files, forever",
    lead: "Every reading is a Markdown file on your disk — not a database row.",
    bullets: [
      "YAML frontmatter",
      "Open in any editor",
      "No lock-in, no export needed",
      "Optional HTML snapshot",
    ],
    image: "/images/your-files.png",
    ratio: "ratio-4-3",
  },
  {
    eyebrow: "Sync",
    title: "Bring your own sync",
    lead: "Point it at a folder and sync however you like.",
    bullets: [
      "iCloud, Dropbox, git — your call",
      "No accounts, no servers",
      "Fully offline",
      "Index rebuilds from files",
    ],
    image: "/images/sync.png",
    ratio: "ratio-4-3",
  },
  {
    eyebrow: "Read",
    title: "A native reader",
    lead: "Markdown rendered natively on macOS — never a WebView.",
    bullets: [
      "Typography you control",
      "Native text selection & copy",
      "Highlights",
      "Tables, code, task lists",
    ],
    image: "/images/native-reader.png",
    ratio: "ratio-4-3",
  },
  {
    eyebrow: "Organize",
    title: "Find & sort anything",
    lead: "Full-text search across titles, content and tags.",
    bullets: [
      "Instant SQLite FTS5 search",
      "Smart views: All · Unread · Archive · Favorites",
      "Tags & 0–5★ ratings",
      "Read / archive / favorite",
    ],
    image: "/images/search.png",
    ratio: "ratio-4-3",
  },
];

/** Compact "everything else" grid. */
export type MiniFeature = { icon: ReactNode; title: string; body: string };

export const EXTRAS: { title: string; body: string }[] = [
  { title: "Keyboard-first", body: "Shortcuts for every action, with a cheat sheet." },
  { title: "Optimistic UI", body: "Actions apply instantly, reconcile from files." },
  { title: "Highlights", body: "Saved as their own Markdown files." },
  { title: "Smart views", body: "All, Unread, Archive, Favorites." },
  { title: "Tags & ratings", body: "Organize with tags and 0–5 stars." },
  { title: "Live sync watch", body: "Folder changes reconcile automatically." },
];

export const NON_FEATURES = [
  "No accounts",
  "No servers",
  "No telemetry",
  "No lock-in",
];
