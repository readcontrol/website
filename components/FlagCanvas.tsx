"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// cloth plane size (world units)
const PLANE_W = 2.9;
const PLANE_H = 5.0;

/* ----------------------------------------------------------------
   Procedural woven-cloth textures.

   A plain-weave height field (interlaced warp/weft threads) drives three
   maps so the fabric reads as real cloth:
     • albedo     — gray shaded by the weave (crowns lit, valleys darker)
     • normalMap  — micro-bump so light catches each thread as it waves
     • roughness  — thread crowns a touch shinier than the valleys
   The swallowtail silhouette lives in the albedo's alpha (alphaTest cuts it).
   ---------------------------------------------------------------- */
function useClothTextures() {
  return useMemo(() => {
    const w = 512;
    const h = 1024;
    const notch = 130;
    const P = 4.5; // thread pitch in px (warp = vertical, weft = horizontal)

    // deterministic per-thread jitter so threads vary but the result is stable
    const hash = (n: number) => {
      const s = Math.sin(n) * 43758.5453;
      return s - Math.floor(s);
    };

    // --- 1. weave height field --------------------------------------------
    const H = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cx = x / P;
        const cy = y / P;
        const ix = Math.floor(cx);
        const iy = Math.floor(cy);
        // rounded thread cross-sections
        const warp = Math.sin(Math.PI * (cx - ix));
        const weft = Math.sin(Math.PI * (cy - iy));
        // plain weave: alternate which thread rides on top
        const overWarp = ((ix + iy) & 1) === 0;
        let hgt = overWarp ? warp * 0.92 + weft * 0.3 : weft * 0.92 + warp * 0.3;
        // subtle per-thread thickness variation + fibre fuzz
        hgt += (overWarp ? hash(ix * 1.7) : hash(iy * 1.3 + 9.1)) * 0.08 - 0.04;
        hgt += (Math.random() - 0.5) * 0.09;
        H[y * w + x] = hgt;
      }
    }

    // helper: draw the swallowtail path (used for masking / clipping)
    const swallowtail = (c: CanvasRenderingContext2D) => {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(w, 0);
      c.lineTo(w, h);
      c.lineTo(w / 2, h - notch);
      c.lineTo(0, h);
      c.closePath();
    };

    // --- 2. albedo (with swallowtail alpha) -------------------------------
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const base = [196, 197, 201];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const hgt = H[i];
        // crowns brighter, valleys (weave lines) darker
        let shade = 0.8 + hgt * 0.3;
        // gentle large-scale mottle for a lived-in fabric feel
        shade +=
          Math.sin(x * 0.012 + y * 0.006) * 0.02 +
          Math.sin(x * 0.03 - y * 0.017) * 0.015;
        const o = i * 4;
        d[o] = Math.max(0, Math.min(255, base[0] * shade));
        d[o + 1] = Math.max(0, Math.min(255, base[1] * shade));
        d[o + 2] = Math.max(0, Math.min(255, base[2] * shade));
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // keep only the swallowtail shape
    ctx.globalCompositeOperation = "destination-in";
    swallowtail(ctx);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    // soft edge darkening, clipped to the shape
    ctx.save();
    swallowtail(ctx);
    ctx.clip();
    const vg = ctx.createLinearGradient(0, 0, w, 0);
    vg.addColorStop(0, "rgba(0,0,0,0.12)");
    vg.addColorStop(0.12, "rgba(0,0,0,0)");
    vg.addColorStop(0.88, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.1)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    const map = new THREE.CanvasTexture(canvas);
    map.anisotropy = 8;
    map.colorSpace = THREE.SRGBColorSpace;

    // --- 3. normal map (from the height gradient) -------------------------
    const nc = document.createElement("canvas");
    nc.width = w;
    nc.height = h;
    const nctx = nc.getContext("2d")!;
    const nimg = nctx.createImageData(w, h);
    const nd = nimg.data;
    const strength = 2.4;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const xm = (x - 1 + w) % w;
        const xp = (x + 1) % w;
        const ym = (y - 1 + h) % h;
        const yp = (y + 1) % h;
        const dx = (H[y * w + xm] - H[y * w + xp]) * strength;
        const dy = (H[ym * w + x] - H[yp * w + x]) * strength;
        const len = Math.hypot(dx, dy, 1);
        const o = (y * w + x) * 4;
        nd[o] = ((dx / len) * 0.5 + 0.5) * 255;
        nd[o + 1] = ((dy / len) * 0.5 + 0.5) * 255;
        nd[o + 2] = (1 / len) * 0.5 * 255 + 127.5;
        nd[o + 3] = 255;
      }
    }
    nctx.putImageData(nimg, 0, 0);
    const normalMap = new THREE.CanvasTexture(nc);
    normalMap.colorSpace = THREE.NoColorSpace; // linear data, not sRGB
    normalMap.anisotropy = 8;

    // --- 4. roughness (crowns a touch shinier) ----------------------------
    const rc = document.createElement("canvas");
    rc.width = w;
    rc.height = h;
    const rctx = rc.getContext("2d")!;
    const rimg = rctx.createImageData(w, h);
    const rd = rimg.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        // higher threads catch a little more light (lower roughness)
        const v = Math.max(
          0,
          Math.min(255, 214 - H[i] * 46 + (Math.random() - 0.5) * 20),
        );
        const o = i * 4;
        rd[o] = rd[o + 1] = rd[o + 2] = v;
        rd[o + 3] = 255;
      }
    }
    rctx.putImageData(rimg, 0, 0);
    const roughnessMap = new THREE.CanvasTexture(rc);
    roughnessMap.colorSpace = THREE.NoColorSpace;

    return { map, normalMap, roughnessMap };
  }, []);
}

/* ----------------------------------------------------------------
   Waving cloth: PBR material with a traveling-wave displacement in
   the vertex shader (pinned at the top, free at the swallowtail
   bottom). Amplitude (uAmp) rises on hover / click. Normals are
   recomputed by finite differences so lighting stays correct.
   ---------------------------------------------------------------- */
function Banner({ paused }: { paused: boolean }) {
  const { map, normalMap, roughnessMap } = useClothTextures();

  const idleAmplitude = 0.28; // waves noticeably at rest
  const hoverExtra = 0.16; // sustained extra wave while hovering

  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: idleAmplitude },
  });
  const gustActive = useRef(false);
  const gustElapsed = useRef(0);
  const clickBoost = useRef(0);
  const pointerInside = useRef(false);
  const sweep = useRef<THREE.PointLight>(null);

  const startGust = () => {
    pointerInside.current = true;
    gustActive.current = true;
    gustElapsed.current = 0;
  };
  const stopGust = () => {
    pointerInside.current = false;
    gustActive.current = false;
  };

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughnessMap,
      roughness: 0.85,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.current.uTime;
      shader.uniforms.uAmp = uniforms.current.uAmp;

      shader.vertexShader =
        `
        uniform float uTime;
        uniform float uAmp;

        vec3 clothPos(vec3 p, vec2 uvv) {
          float t = uTime;
          float freedom = pow(1.0 - uvv.y, 1.3);
          float w1 = sin(uvv.y * 2.6 + uvv.x * 1.2 - t * 1.4);
          float w2 = sin(uvv.y * 1.4 - t * 0.9);
          float w3 = sin(uvv.x * 2.0 + uvv.y * 3.4 - t * 1.9);
          float wave = (w1 * 0.55 + w2 * 0.32 + w3 * 0.13) * uAmp * freedom;
          p.z += wave;
          // gentle constant-rate sideways sway, independent of amplitude,
          // so hovering only changes how much it waves — not where it sits
          p.x += sin(t * 0.5) * 0.02 * freedom;
          return p;
        }
        ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `vec3 transformed = clothPos(position, uv);`,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
        float e = 0.01;
        vec3 pC = clothPos(position, uv);
        vec3 pX = clothPos(position + vec3(e, 0.0, 0.0), uv + vec2(e * 0.345, 0.0));
        vec3 pY = clothPos(position + vec3(0.0, e, 0.0), uv + vec2(0.0, e * 0.2));
        vec3 objectNormal = normalize(cross(pX - pC, pY - pC));
        `,
      );
    };

    return mat;
  }, [map, normalMap, roughnessMap]);

  useFrame((_, delta) => {
    if (paused) return;
    const dt = Math.min(delta, 0.05);
    uniforms.current.uTime.value += dt;
    const t = uniforms.current.uTime.value;

    // glide a soft light across the front of the cloth
    if (sweep.current) {
      sweep.current.position.x = Math.sin(t * 0.42) * 2.6;
      sweep.current.position.y = 0.7 + Math.sin(t * 0.31) * 0.5;
    }

    let target = idleAmplitude;
    if (pointerInside.current) target += hoverExtra;

    if (gustActive.current) {
      gustElapsed.current += dt;
      const rise = Math.min(gustElapsed.current / 0.16, 1);
      const decay = Math.exp(-2.0 * Math.max(0, gustElapsed.current - 0.16));
      target += 0.24 * rise * decay;
      if (gustElapsed.current >= 2) gustActive.current = false;
    }

    target += clickBoost.current;
    clickBoost.current = Math.max(0, clickBoost.current - dt * 0.05);

    // ease amplitude only — phase advances at a constant rate above, so the
    // wave never jumps; hover just makes it wave more
    const smoothing = 1 - Math.exp(-dt * 6);
    uniforms.current.uAmp.value +=
      (target - uniforms.current.uAmp.value) * smoothing;
  });

  return (
    <group rotation={[0, -0.3, 0.03]} position={[0.15, 0.85, 0]}>
      {/* soft light gliding across the cloth for a moving sheen */}
      <pointLight
        ref={sweep}
        position={[0, 0.7, 2.4]}
        intensity={7}
        distance={10}
        decay={2}
        color="#eaf1ff"
      />

      <mesh material={material}>
        <planeGeometry args={[PLANE_W, PLANE_H, 150, 220]} />
      </mesh>

      {/* fixed hit area so the moving cloth can't retrigger hover */}
      <mesh
        position={[0, 0, 0.6]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          startGust();
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          stopGust();
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          clickBoost.current = Math.min(clickBoost.current + 0.07, 0.32);
        }}
      >
        <planeGeometry args={[PLANE_W + 0.3, PLANE_H + 0.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function FlagCanvas({
  paused = false,
  onReady,
}: {
  paused?: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0.2, 0.4, 6.0], fov: 42 }}
      dpr={[1, 2]}
      frameloop={paused ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ width: "100%", height: "100%" }}
      onCreated={() => {
        // reveal only after a couple of frames have actually been drawn,
        // so the flag never flashes in half-rendered
        requestAnimationFrame(() =>
          requestAnimationFrame(() => onReady?.()),
        );
      }}
    >
      <fog attach="fog" args={["#0d0d0f", 9, 18]} />

      <ambientLight intensity={0.65} />
      {/* near-neutral key so the gray cloth stays gray */}
      <directionalLight position={[4, 5, 5]} intensity={1.4} color="#f6f5f2" />
      <spotLight
        position={[-5, 3, -4]}
        angle={0.5}
        penumbra={1}
        intensity={22}
        color="#8ba6ff"
      />
      <pointLight position={[-2, -1, 4]} intensity={9} color="#ffffff" />
      <pointLight position={[2, 1, 5]} intensity={5} color="#ffffff" />

      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={1.2}
          position={[0, 2, 4]}
          scale={[8, 8, 1]}
          color="#fff3dd"
        />
        <Lightformer
          intensity={0.7}
          position={[-4, 0, -3]}
          scale={[6, 6, 1]}
          color="#9fb2ff"
        />
        <Lightformer
          intensity={0.4}
          position={[3, -2, 2]}
          scale={[5, 5, 1]}
          color="#ffffff"
        />
      </Environment>

      <Banner paused={paused} />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.22}
        scale={11}
        blur={2.8}
        far={4.5}
        color="#000000"
      />
    </Canvas>
  );
}
