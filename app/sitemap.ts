import type { MetadataRoute } from "next";

const SITE_URL = "https://readcontrol.app";

// Emitted to a static file — required under `output: export`.
export const dynamic = "force-static";

/** Emitted as /sitemap.xml at build time. A single-page site, so one entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
