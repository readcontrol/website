import type { MetadataRoute } from "next";

const SITE_URL = "https://readcontrol.app";

// Emitted to a static file — required under `output: export`.
export const dynamic = "force-static";

/** Emitted as /robots.txt at build time — allow everything, point at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
