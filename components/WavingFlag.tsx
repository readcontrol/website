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
  const [desktop, setDesktop] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dq = window.matchMedia("(min-width: 821px)"); // matches the CSS breakpoint
    const sync = () => {
      setReduced(rm.matches);
      setDesktop(dq.matches);
    };
    sync();
    rm.addEventListener("change", sync);
    dq.addEventListener("change", sync);
    return () => {
      rm.removeEventListener("change", sync);
      dq.removeEventListener("change", sync);
    };
  }, []);

  // Never render (nor load three.js) on mobile.
  if (!desktop) return null;

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
