import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-export friendly: the landing page is fully static, so it can be
  // hosted on any static host (or Vercel). Images are plain <img> tags and the
  // flag is inline SVG, so no image optimizer is required.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
