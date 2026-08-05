"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import MediaFrame from "@/components/MediaFrame";

/** Tiny blurred poster (base64) shown on first paint so the frame is never
 *  empty while the real poster loads. Generated from demo_thumb at 20px wide. */
const POSTER_BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ02xSSziZh82OSKuPbRbuUBrmtPvblbZAsrAAVLJfXOT++ai4EOsxAX7eWQFwOBRWTdTSNOxLkmipuFj/2Q==";

/**
 * Self-hosted promo video with a poster facade. The <video> only starts
 * loading/playing after the user clicks play, so the poster image is all that
 * ships on first paint. Drop the real files in:
 *   public/video/readcontrol-promo.mp4
 *   public/images/demo_thumb.webp   (16:9)
 */
export default function PromoVideo() {
  const [playing, setPlaying] = useState(false);
  // "warm" mounts the <video> (still hidden behind the poster) so the browser
  // begins buffering at the first sign of intent — hover, focus, or touch —
  // making playback near-instant on click. Nothing loads for visitors who
  // never engage, and warming is skipped when the client asked to save data.
  const [warm, setWarm] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const warmUp = () => {
    if (warm) return;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return; // respect Data Saver / metered connections
    setWarm(true);
  };

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
      {(warm || playing) && (
        // Mounted while warming (hidden under the poster button) and while
        // playing. Keeping the same element across both states means the bytes
        // buffered during warm-up are reused, not refetched, when play starts.
        <video
          ref={videoRef}
          controls={playing}
          playsInline
          preload="auto"
          poster="/images/demo_thumb.webp"
          className="absolute inset-0 size-full"
        >
          <source src="/video/demo.mp4" type="video/mp4" />
        </video>
      )}

      {!playing && (
        <button
          type="button"
          onClick={play}
          onPointerEnter={warmUp}
          onFocus={warmUp}
          onTouchStart={warmUp}
          aria-label="Play the ReadControl promo video"
          className="group absolute inset-0 flex cursor-pointer items-center justify-center"
        >
          {/* poster (shows through if present; placeholder shows otherwise) */}
          <Image
            src="/images/demo_thumb.webp"
            width={1600}
            height={900}
            alt=""
            priority
            placeholder="blur"
            blurDataURL={POSTER_BLUR}
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
      )}
    </MediaFrame>
  );
}
