"use client";

import { useRef, useState } from "react";

import MediaFrame from "@/components/MediaFrame";

/**
 * Self-hosted promo video with a poster facade. The <video> only starts
 * loading/playing after the user clicks play, so the poster image is all that
 * ships on first paint. Drop the real files in:
 *   public/video/readcontrol-promo.mp4
 *   public/images/video-poster.png   (16:9)
 */
export default function PromoVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const play = () => {
    setPlaying(true);
    // let React mount controls, then start playback
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  return (
    <MediaFrame
      ratio="aspect-video"
      label="Promo video — video/readcontrol-promo.mp4"
    >
      {!playing ? (
        <button
          type="button"
          onClick={play}
          aria-label="Play the ReadControl promo video"
          className="group absolute inset-0 flex cursor-pointer items-center justify-center"
        >
          {/* poster (shows through if present; placeholder shows otherwise) */}
          <img
            src="/images/video-poster.png"
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
            className="absolute inset-0 size-full object-cover"
          />
          <span
            aria-hidden="true"
            className="relative flex size-19 items-center justify-center rounded-full bg-cream/95 pl-1 text-bg shadow-2xl transition group-hover:scale-105 group-hover:bg-fg"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      ) : (
        <video
          ref={videoRef}
          controls
          playsInline
          poster="/images/video-poster.png"
          className="absolute inset-0 size-full"
        >
          <source src="/video/readcontrol-promo.mp4" type="video/mp4" />
        </video>
      )}
    </MediaFrame>
  );
}
