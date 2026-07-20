"use client";

import { useEffect, useRef } from "react";

/**
 * An interactive, waving bookmark "flag".
 *
 * The bookmark is drawn as an SVG polygon whose left and right edges are
 * displaced horizontally by a traveling sine wave — like a hanging cloth
 * rippling in the wind. It is pinned at the top (amplitude ~0) and free at the
 * bottom (max amplitude), which reads as a bookmark flag waving.
 *
 * Interaction: moving the pointer over the stage adds "wind" and makes the flag
 * lean toward the cursor; pressing/clicking sends a ripple impulse down it.
 * The path is updated by writing `d` on the element inside a rAF loop, so React
 * never re-renders during animation.
 *
 * Honors `prefers-reduced-motion`: renders a gentle static curve instead.
 */

// --- geometry (in viewBox units) ---
const VB_W = 240;
const VB_H = 320;
const FLAG_W = 150; // flag width
const FLAG_H = 236; // flag height (top -> tips)
const NOTCH = 46; // depth of the bottom V-notch
const TOP = 30; // top padding inside the viewBox
const CX = VB_W / 2; // horizontal centre
const SEG = 26; // vertical segments per edge

const LEFT = CX - FLAG_W / 2;
const RIGHT = CX + FLAG_W / 2;

export default function WavingFlag() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const shadeRef = useRef<SVGPathElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const shade = shadeRef.current;
    const stage = stageRef.current;
    if (!path || !stage) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // animation state
    let lean = 0; // current lean (px, viewBox units)
    let targetLean = 0; // eased toward this from pointer X
    let wind = 0.55; // baseline wind (wave amplitude factor)
    let targetWind = 0.55;
    let poke = 0; // decaying impulse from a click/tap
    let raf = 0;
    let start = 0;

    // offset of a point at normalized height h (0=pinned top, 1=free bottom)
    const offset = (h: number, t: number) => {
      const grow = Math.pow(h, 1.25); // amplitude grows toward the free end
      const amp = 16 * wind + poke * 22;
      const wave = Math.sin(h * 6.0 - t * 2.4) * amp * grow;
      const secondary = Math.sin(h * 11 - t * 3.7) * amp * 0.28 * grow;
      return wave + secondary + lean * grow;
    };

    const buildPath = (t: number) => {
      // left edge, top -> bottom
      const left: string[] = [];
      const right: string[] = [];
      for (let i = 0; i <= SEG; i++) {
        const h = i / SEG;
        const y = TOP + h * FLAG_H;
        const dx = offset(h, t);
        left.push(`${(LEFT + dx).toFixed(2)},${y.toFixed(2)}`);
        right.push(`${(RIGHT + dx).toFixed(2)},${y.toFixed(2)}`);
      }
      const dxBottom = offset(1, t);
      const notchX = CX + dxBottom;
      const notchY = TOP + FLAG_H - NOTCH;

      const d =
        `M ${left[0]} ` +
        left
          .slice(1)
          .map((p) => `L ${p}`)
          .join(" ") +
        ` L ${notchX.toFixed(2)},${notchY.toFixed(2)} ` + // up into the V
        `L ${right[right.length - 1]} ` + // down to bottom-right tip
        right
          .slice(0, -1)
          .reverse()
          .map((p) => `L ${p}`)
          .join(" ") +
        " Z";
      return d;
    };

    const render = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      // ease lean & wind toward targets; decay poke
      lean += (targetLean - lean) * 0.08;
      wind += (targetWind - wind) * 0.06;
      targetWind += (0.55 - targetWind) * 0.02; // wind settles back to baseline
      poke *= 0.94;

      const d = buildPath(t);
      path.setAttribute("d", d);
      // shade path is a slightly inset copy for a soft fold highlight
      if (shade) shade.setAttribute("d", d);

      raf = requestAnimationFrame(render);
    };

    if (reduce) {
      // gentle static curve (t = fixed), no loop
      lean = 6;
      wind = 0.4;
      const d = buildPath(0.4);
      path.setAttribute("d", d);
      if (shade) shade.setAttribute("d", d);
      return;
    }

    raf = requestAnimationFrame(render);

    // --- interaction ---
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
      targetLean = Math.max(-1, Math.min(1, nx)) * 16;
      targetWind = 1.1; // moving stirs up wind
    };
    const onLeave = () => {
      targetLean = 0;
      targetWind = 0.55;
    };
    const onDown = () => {
      poke = 1; // ripple impulse
      targetWind = 1.5;
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="flag-interactive"
      role="img"
      aria-label="Read Control — an interactive waving bookmark"
      style={{ cursor: "grab", touchAction: "none", userSelect: "none" }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="300"
        height="400"
        style={{ maxWidth: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="flagFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4efe3" />
            <stop offset="0.55" stopColor="#ece6d8" />
            <stop offset="1" stopColor="#d8d1bf" />
          </linearGradient>
          <linearGradient id="flagShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(0,0,0,0)" />
            <stop offset="0.5" stopColor="rgba(0,0,0,0.10)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <filter id="flagShadow" x="-40%" y="-20%" width="180%" height="150%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="18"
              floodColor="#000"
              floodOpacity="0.55"
            />
          </filter>
        </defs>

        {/* faint glow behind the flag */}
        <ellipse
          cx={CX}
          cy={TOP + FLAG_H * 0.55}
          rx={FLAG_W * 0.9}
          ry={FLAG_H * 0.62}
          fill="rgba(236,230,216,0.06)"
        />

        <path ref={pathRef} fill="url(#flagFill)" filter="url(#flagShadow)" />
        {/* moving fold shading, multiplied over the fill */}
        <path
          ref={shadeRef}
          fill="url(#flagShade)"
          style={{ mixBlendMode: "multiply" }}
        />
      </svg>
    </div>
  );
}
