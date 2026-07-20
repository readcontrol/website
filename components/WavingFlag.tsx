"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/** Static gray bookmark — shown while the 3D scene loads and as a fallback. */
function FlagFallback() {
  return (
    <svg
      viewBox="0 0 150 236"
      width="180"
      height="283"
      aria-hidden="true"
      style={{ maxWidth: "70%", height: "auto", opacity: 0.9 }}
    >
      <path
        d="M0 0h150v236l-75-46-75 46V0Z"
        fill="#c4c5c9"
      />
    </svg>
  );
}

// WebGL + canvas texture generation must run client-side only (no SSR).
const FlagCanvas = dynamic(() => import("./FlagCanvas"), {
  ssr: false,
  loading: () => <FlagFallback />,
});

export default function WavingFlag() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div
      className="flag-canvas"
      role="img"
      aria-label="Read Control — an interactive waving bookmark. Hover to stir it; click for a gust."
    >
      <FlagCanvas paused={reduced} />
    </div>
  );
}
