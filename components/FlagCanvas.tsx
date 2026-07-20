"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// cloth plane size (world units)
const PLANE_W = 2.9;
const PLANE_H = 5.0;
const THICKNESS = 0.24; // gap between front face and dark back layer

type ClothUniforms = {
  current: { uTime: { value: number }; uAmp: { value: number } };
};

/* ----------------------------------------------------------------
   Solid light-gray cloth: a plain albedo with the swallowtail shape in
   its alpha and soft edge shading, plus a lightly-varied roughness.
   ---------------------------------------------------------------- */
function useClothTextures() {
  return useMemo(() => {
    const w = 512;
    const h = 1024;
    const notch = 130;

    const swallowtail = (c: CanvasRenderingContext2D) => {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(w, 0);
      c.lineTo(w, h);
      c.lineTo(w / 2, h - notch);
      c.lineTo(0, h);
      c.closePath();
    };

    // --- albedo (solid gray + swallowtail alpha) ---
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    swallowtail(ctx);
    ctx.clip();
    ctx.fillStyle = "#c4c5c9";
    ctx.fillRect(0, 0, w, h);
    // faint grain so it isn't perfectly flat
    const img = ctx.getImageData(0, 0, w, h);
    const dd = img.data;
    for (let i = 0; i < dd.length; i += 4) {
      const n = (Math.random() - 0.5) * 5;
      dd[i] += n;
      dd[i + 1] += n;
      dd[i + 2] += n;
    }
    ctx.putImageData(img, 0, 0);
    // soft edge darkening, clipped to the shape
    const vg = ctx.createLinearGradient(0, 0, w, 0);
    vg.addColorStop(0, "rgba(0,0,0,0.14)");
    vg.addColorStop(0.12, "rgba(0,0,0,0)");
    vg.addColorStop(0.88, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    const map = new THREE.CanvasTexture(canvas);
    map.anisotropy = 8;
    map.colorSpace = THREE.SRGBColorSpace;

    // --- roughness (matte, lightly varied) ---
    const rc = document.createElement("canvas");
    rc.width = w;
    rc.height = h;
    const rctx = rc.getContext("2d")!;
    rctx.fillStyle = "#dcdcdc";
    rctx.fillRect(0, 0, w, h);
    const rimg = rctx.getImageData(0, 0, w, h);
    const rd = rimg.data;
    for (let i = 0; i < rd.length; i += 4) {
      const n = (Math.random() - 0.5) * 24;
      rd[i] += n;
      rd[i + 1] += n;
      rd[i + 2] += n;
    }
    rctx.putImageData(rimg, 0, 0);
    const roughnessMap = new THREE.CanvasTexture(rc);
    roughnessMap.colorSpace = THREE.NoColorSpace;

    return { map, roughnessMap };
  }, []);
}

/* Inject the traveling-wave displacement + fold-depth shading into a standard
   material. Shared by the front face and the dark back layer so both waves stay
   perfectly in sync. */
function installClothShader(
  mat: THREE.MeshStandardMaterial,
  uniforms: ClothUniforms,
) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.current.uTime;
    shader.uniforms.uAmp = uniforms.current.uAmp;

    shader.vertexShader =
      `
      uniform float uTime;
      uniform float uAmp;
      varying float vDepth;

      vec3 clothPos(vec3 p, vec2 uvv) {
        float t = uTime;
        float freedom = pow(1.0 - uvv.y, 1.3);
        float w1 = sin(uvv.y * 2.6 + uvv.x * 1.2 - t * 1.4);
        float w2 = sin(uvv.y * 1.4 - t * 0.9);
        float w3 = sin(uvv.x * 2.0 + uvv.y * 3.4 - t * 1.9);
        float wave = (w1 * 0.55 + w2 * 0.32 + w3 * 0.13) * uAmp * freedom;
        p.z += wave;
        // gentle constant-rate sideways sway, independent of amplitude
        p.x += sin(t * 0.5) * 0.02 * freedom;
        return p;
      }
      ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `vec3 transformed = clothPos(position, uv);
       vDepth = transformed.z;`,
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

    // darken the wave troughs like AO in the concavities
    shader.fragmentShader = `varying float vDepth;\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       diffuseColor.rgb *= clamp(1.0 + vDepth * 0.85, 0.6, 1.1);`,
    );
  };
}

/* ----------------------------------------------------------------
   Waving cloth banner with real thickness: a lit front face and a dark
   back layer set behind it, both driven by the same wave shader so the
   offset between them reads as the flag's edge.
   ---------------------------------------------------------------- */
function Banner({ paused }: { paused: boolean }) {
  const { map, roughnessMap } = useClothTextures();

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

  // lit front face
  const frontMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map,
      roughnessMap,
      roughness: 0.95,
      metalness: 0,
      envMapIntensity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });
    installClothShader(mat, uniforms);
    return mat;
  }, [map, roughnessMap]);

  // dark underside — sits THICKNESS behind the front to form the edge
  const backMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map, // reuse for the swallowtail alpha
      color: new THREE.Color(0x35363a),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: 0.5,
    });
    installClothShader(mat, uniforms);
    return mat;
  }, [map]);

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

      {/* dark back layer — its offset from the front reads as thickness */}
      <mesh material={backMat} position={[0, 0, -THICKNESS]}>
        <planeGeometry args={[PLANE_W, PLANE_H, 150, 220]} />
      </mesh>
      {/* lit front face */}
      <mesh material={frontMat}>
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
        requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
      }}
    >
      <fog attach="fog" args={["#0d0d0f", 9, 18]} />

      {/* low ambient so the wave troughs stay in shadow (depth) */}
      <ambientLight intensity={0.3} />
      {/* strong near-neutral key — carves the folds with light and shadow */}
      <directionalLight position={[4, 5, 5]} intensity={2.1} color="#f6f5f2" />
      <spotLight
        position={[-5, 3, -4]}
        angle={0.5}
        penumbra={1}
        intensity={18}
        color="#8ba6ff"
      />
      {/* gentle fills — enough to lift the deepest troughs, not flatten them */}
      <pointLight position={[-2, -1, 4]} intensity={3.5} color="#ffffff" />
      <pointLight position={[2, 1, 5]} intensity={2.5} color="#ffffff" />

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
