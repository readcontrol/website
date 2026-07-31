import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
  themeColor: "#0d0d0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} motion-safe:scroll-smooth`}
    >
      <body
        className="bg-bg bg-fixed font-sans text-base leading-[1.6] text-fg antialiased [text-rendering:optimizeLegibility]
          bg-[radial-gradient(120%_80%_at_50%_-10%,rgb(202_203_207_/_0.05),transparent_60%)]"
      >
        {children}
      </body>
    </html>
  );
}
