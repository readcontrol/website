"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ----------------------------------------------------------------
   Cream cloth texture with subtle woven detail + swallowtail mask.
   Tinted to the Read Control bookmark cream instead of gray so the
   hero stays on-brand while reading as real fabric.
   ---------------------------------------------------------------- */
function useClothTextures() {
  return useMemo(() => {
    const w = 512;
    const h = 1024;
    const notch = 130;

    // --- color / alpha map (the swallowtail silhouette lives in alpha) ---
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(w / 2, h - notch);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.clip();

    // base cream
    ctx.fillStyle = "#e7e0cf";
    ctx.fillRect(0, 0, w, h);

    // subtle woven fabric grain
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const weave =
          Math.sin(x * 0.9) * 3 +
          Math.sin(y * 0.9) * 3 +
          (Math.random() - 0.5) * 9;
        d[i] += weave;
        d[i + 1] += weave;
        d[i + 2] += weave;
      }
    }
    ctx.putImageData(img, 0, 0);

    // soft edge darkening for depth
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

    // --- roughness map: break up highlights like real cloth ---
    const rc = document.createElement("canvas");
    rc.width = w;
    rc.height = h;
    const rctx = rc.getContext("2d")!;
    rctx.fillStyle = "#c8c8c8";
    rctx.fillRect(0, 0, w, h);
    const rimg = rctx.getImageData(0, 0, w, h);
    const rd = rimg.data;
    for (let i = 0; i < rd.length; i += 4) {
      const n = (Math.random() - 0.5) * 40;
      rd[i] += n;
      rd[i + 1] += n;
      rd[i + 2] += n;
    }
    rctx.putImageData(rimg, 0, 0);
    const roughnessMap = new THREE.CanvasTexture(rc);

    return { map, roughnessMap };
  }, []);
}

/* ----------------------------------------------------------------
   Waving cloth: PBR material with wave displacement injected into
   the vertex stage; normals recomputed for correct lighting.
   ---------------------------------------------------------------- */
function Banner({ paused }: { paused: boolean }) {
  const { map, roughnessMap } = useClothTextures();
  const idleAmplitude = 0.075;
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: idleAmplitude },
    uSpeed: { value: 1 },
  });
  const gustActive = useRef(false);
  const gustElapsed = useRef(0);
  const clickBoost = useRef(0);
  const pointerInside = useRef(false);

  const startGust = () => {
    if (pointerInside.current) return;
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
      roughnessMap,
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.current.uTime;
      shader.uniforms.uAmp = uniforms.current.uAmp;
      shader.uniforms.uSpeed = uniforms.current.uSpeed;

      shader.vertexShader =
        `
        uniform float uTime;
        uniform float uAmp;
        uniform float uSpeed;

        vec3 wavePos(vec3 p, vec2 uvv) {
          float t = uTime * uSpeed;
          float freedom = pow(1.0 - uvv.y, 1.3);
          float w1 = sin(uvv.y * 2.6 + uvv.x * 1.2 - t * 1.4);
          float w2 = sin(uvv.y * 1.4 - t * 0.9);
          float wave = (w1 * 0.62 + w2 * 0.38) * uAmp * freedom;
          p.z += wave;
          p.x += sin(t * 0.5) * uAmp * 0.035 * freedom;
          return p;
        }
        ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `vec3 transformed = wavePos(position, uv);`,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
        float e = 0.01;
        vec3 pC = wavePos(position, uv);
        vec3 pX = wavePos(position + vec3(e, 0.0, 0.0), uv + vec2(e * 0.385, 0.0));
        vec3 pY = wavePos(position + vec3(0.0, e, 0.0), uv + vec2(0.0, e * 0.238));
        vec3 objectNormal = normalize(cross(pX - pC, pY - pC));
        `,
      );
    };

    return mat;
  }, [map, roughnessMap]);

  useFrame((_, delta) => {
    if (paused) return;
    // clamp delta so a backgrounded tab doesn't jump the sim
    const dt = Math.min(delta, 0.05);
    uniforms.current.uTime.value += dt;

    let targetAmplitude = idleAmplitude;
    if (gustActive.current) {
      gustElapsed.current += dt;
      const rise = Math.min(gustElapsed.current / 0.18, 1);
      const decay = Math.exp(-2.2 * Math.max(0, gustElapsed.current - 0.18));
      targetAmplitude += 0.22 * rise * decay;
      if (gustElapsed.current >= 2) gustActive.current = false;
    }

    targetAmplitude += clickBoost.current;
    clickBoost.current = Math.max(0, clickBoost.current - dt * 0.045);

    const smoothing = 1 - Math.exp(-dt * 7);
    uniforms.current.uAmp.value +=
      (targetAmplitude - uniforms.current.uAmp.value) * smoothing;
    uniforms.current.uSpeed.value = 1 + Math.min(clickBoost.current * 0.8, 0.24);
  });

  return (
    <group rotation={[0, -0.35, 0.04]} position={[0.4, 0, 0]}>
      {/* wooden dowel the banner hangs from */}
      <group position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 3.1, 32]} />
          <meshStandardMaterial color="#8a6234" roughness={0.75} metalness={0} />
        </mesh>
        <mesh position={[0, 1.58, 0]}>
          <sphereGeometry args={[0.085, 32, 32]} />
          <meshStandardMaterial color="#734f28" roughness={0.65} metalness={0} />
        </mesh>
        <mesh position={[0, -1.58, 0]}>
          <sphereGeometry args={[0.085, 32, 32]} />
          <meshStandardMaterial color="#734f28" roughness={0.65} metalness={0} />
        </mesh>
      </group>

      {/* the waving cloth */}
      <mesh position={[0, 0, 0]} material={material}>
        <planeGeometry args={[2.6, 4.2, 120, 180]} />
      </mesh>

      {/* fixed hit area so the moving cloth can't retrigger hover */}
      <mesh
        position={[0, 0, 0.45]}
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
          clickBoost.current = Math.min(clickBoost.current + 0.065, 0.3);
        }}
      >
        <planeGeometry args={[2.7, 4.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function FlagCanvas({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0.3, 0.4, 7], fov: 42 }}
      dpr={[1, 2]}
      frameloop={paused ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true, // transparent — blends into the page background
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* fog color matches the page so banner edges fade into it */}
      <fog attach="fog" args={["#0d0d0f", 9, 18]} />

      <ambientLight intensity={0.65} />
      {/* warm key */}
      <directionalLight position={[4, 5, 5]} intensity={1.4} color="#fff0d4" />
      {/* cool rim for separation */}
      <spotLight
        position={[-5, 3, -4]}
        angle={0.5}
        penumbra={1}
        intensity={22}
        color="#8ba6ff"
      />
      {/* soft fills to lift the wave troughs */}
      <pointLight position={[-2, -1, 4]} intensity={9} color="#ffffff" />
      <pointLight position={[2, 1, 5]} intensity={5} color="#ffffff" />

      {/* procedural environment (no external HDR/CDN — works offline & static) */}
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
        opacity={0.32}
        scale={10}
        blur={2.8}
        far={4.5}
        color="#000000"
      />
    </Canvas>
  );
}
