import type { Metadata, Viewport } from "next";
import { Caveat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** The hand the letter is signed in, and nothing else. */
const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: "600",
  variable: "--font-caveat",
});

const SITE_URL = "https://readcontrol.app";
const title = "ReadControl: the native macOS reading manager";
const description =
  "Save any webpage to your computer, read anytime. No account needed. It’s totally free!";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s · ReadControl",
  },
  description,
  applicationName: "ReadControl",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "ReadControl",
    "read later",
    "reading manager",
    "read-it-later app",
    "macOS",
    "local-first",
    "open source",
    "Markdown",
    "save webpages",
    "offline reading",
    "browser extension",
    "no account",
  ],
  authors: [{ name: "Rodrigo Boniatti", url: "https://rodrigoboniatti.com" }],
  creator: "Rodrigo Boniatti",
  publisher: "ReadControl",
  category: "productivity",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "ReadControl",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@boniattirodrigo",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
  ],
  colorScheme: "light dark",
};

/**
 * Re-applies a stored theme choice before the page paints, so a reader who
 * picked the theme that opposes their system setting never sees the other one
 * flash first. Runs synchronously as the first thing in <body>; anything that
 * throws (Safari private mode blocking localStorage) just leaves the system
 * setting in charge.
 *
 * The key is spelled out because this runs before any module loads — it is
 * KEY.theme in lib/persist.ts, and the two have to stay in step.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("rc-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * Structured data for search engines: describes ReadControl as a free macOS
 * application so it can qualify for rich results. Kept in step with the human
 * copy above — same name, price, and platform the page itself states.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ReadControl",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "macOS 14 Sonoma or later",
  url: SITE_URL,
  description,
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: {
    "@type": "Person",
    name: "Rodrigo Boniatti",
    url: "https://rodrigoboniatti.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} motion-safe:scroll-smooth`}
      // the theme script rewrites data-theme before React hydrates
      suppressHydrationWarning
    >
      <body
        className="bg-bg bg-fixed font-sans text-base leading-[1.6] text-fg antialiased [text-rendering:optimizeLegibility]
          bg-[radial-gradient(120%_80%_at_50%_-10%,var(--rc-glow),transparent_60%)]"
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
