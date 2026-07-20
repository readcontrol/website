"use client";

import { useRef, useState } from "react";

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
    <div className="media ratio-16-9" data-label="Promo video — video/readcontrol-promo.mp4">
      {!playing ? (
        <button
          type="button"
          onClick={play}
          aria-label="Play the Read Control promo video"
          style={{
            all: "unset",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {/* poster (shows through if present; placeholder shows otherwise) */}
          <img
            src="/images/video-poster.png"
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
            style={{ position: "absolute", inset: 0 }}
          />
          <span className="play-badge" aria-hidden="true">
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
          style={{ position: "absolute", inset: 0 }}
        >
          <source src="/video/readcontrol-promo.mp4" type="video/mp4" />
        </video>
      )}
      <style>{`
        .play-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          border-radius: 999px;
          background: rgba(236, 230, 216, 0.95);
          color: #161616;
          padding-left: 4px;
          box-shadow: 0 10px 40px -8px rgba(0, 0, 0, 0.7);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        button:hover .play-badge {
          transform: scale(1.06);
          background: #fff;
        }
      `}</style>
    </div>
  );
}
