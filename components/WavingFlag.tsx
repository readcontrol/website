"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL + canvas texture generation must run client-side only (no SSR).
// No loading placeholder — we keep the space empty until the 3D scene is
// actually ready, then fade it in (avoids a small bookmark popping to full size).
const FlagCanvas = dynamic(() => import("./FlagCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function WavingFlag() {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

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
      <div className="flag-fade" data-ready={ready}>
        <FlagCanvas paused={reduced} onReady={() => setReady(true)} />
      </div>
    </div>
  );
}
