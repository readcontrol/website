"use client";

import { useEffect, useRef, useState } from "react";

import MediaFrame from "@/components/MediaFrame";
import type { AspectRatio } from "@/lib/content";

/**
 * An image in a media frame. When the file is missing the <img> 404s and we
 * hide it, leaving just the frame's placeholder; once the user drops the real
 * file in, it loads and covers the placeholder with proper alt text.
 */
export default function Media({
  src,
  alt,
  ratio,
  label,
}: {
  src: string;
  alt: string;
  ratio: AspectRatio;
  label: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  // A missing file usually 404s before React hydrates, so onError never fires
  // for it — re-check on mount, otherwise the broken-image icon and the alt
  // text show through the placeholder.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <MediaFrame ratio={ratio} label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setMissing(true)}
        className={
          missing ? "hidden" : "relative size-full object-cover"
        }
      />
    </MediaFrame>
  );
}
