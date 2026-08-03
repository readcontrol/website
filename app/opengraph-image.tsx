import { ImageResponse } from "next/og";

/**
 * The social preview card, generated once at build time (1200×630, the size
 * Twitter/X, Slack, iMessage, and friends crop to). Next also serves this as
 * the Twitter image when no dedicated twitter-image exists.
 *
 * Deliberately self-contained: no remote fonts or images to fetch, so it builds
 * the same offline as on Vercel. Colours mirror the site's light theme.
 */
// Rendered once at build time — required under `output: export`.
export const dynamic = "force-static";
export const alt =
  "ReadControl: the native macOS reading manager. Save any webpage to your computer, read anytime.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#fdfcfb",
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, rgba(23,24,26,0.06), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "#17181a",
          }}
        >
          {/* the bookmark mark, matching lib/content.tsx */}
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z"
              fill="#17181a"
            />
          </svg>
          <span style={{ fontSize: "34px", fontWeight: 700 }}>ReadControl</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#85868b",
              marginBottom: "24px",
            }}
          >
            Free · Open-source · Local-first
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.08,
              color: "#17181a",
              letterSpacing: "-2px",
            }}
          >
            <span>The native macOS</span>
            <span>reading manager</span>
          </div>
          <span
            style={{
              fontSize: "32px",
              color: "#55565a",
              marginTop: "28px",
            }}
          >
            Save any webpage to your computer, read anytime.
          </span>
        </div>

        <span style={{ fontSize: "28px", fontWeight: 600, color: "#17181a" }}>
          readcontrol.app
        </span>
      </div>
    ),
    { ...size },
  );
}
