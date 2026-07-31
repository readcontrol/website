import type { Metadata, Viewport } from "next";
import { Caveat, Inter } from "next/font/google";
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

const title = "Read Control — save the web, read it later";
const description =
  "A local-first read-later app. Save any page from your browser as a Markdown file you own. No accounts, no servers, no telemetry.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://readcontrol.app"),
  openGraph: {
    title,
    description,
    url: "https://readcontrol.app",
    siteName: "Read Control",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
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
        {children}
      </body>
    </html>
  );
}
