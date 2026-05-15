"use client";

/**
 * /inmersivo · experiencia inmersiva R3F (Three.js)
 *
 * Concepto:
 *   Escena 1 · ENTRAR · plano grande con el vídeo Velorah; la cámara
 *              hace un zoom inmersivo hacia la chica desde z=5 hasta
 *              z=1.4.  Conforme nos acercamos, DepthOfField empieza a
 *              desenfocar los bordes y el bloom dorado se intensifica.
 *   Escena 2 · CUADERNO · al cruzar la mitad del scroll, el plano del
 *              vídeo retrocede + se desenfoca, y un libro flotante
 *              (RoundedBox + materiales PBR + spotLight cálida) entra
 *              por delante, ligeramente orbitado.
 *   Escena 3 · BRÚJULA · el libro se aleja, aparecen 14 cartas en
 *              círculo (Instances) sobre un mar de polen y estrellas;
 *              la cámara orbita lentamente alrededor.
 *
 * Stack:
 *   - React Three Fiber 9 + @react-three/drei 10
 *   - @react-three/postprocessing 3 (Bloom + DOF)
 *   - GSAP no se usa aquí — sustituido por <ScrollControls> + damp3
 *     de drei (más fluido para R3F que ScrollTrigger DOM).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeElements,
} from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Float,
  Html,
  RoundedBox,
  Text,
  PerspectiveCamera,
  Instances,
  Instance,
  Stars,
  useTexture,
} from "@react-three/drei";
import { damp3, damp } from "maath/easing";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";

// ─── paleta egoera ─────────────────────────────────────────────
const BLUE = "#1d2bdb";
const BLUE_DEEP = "#0f1baa";
const CREAM = "#f1ead8";
const MUSTARD = "#f4c842";
const CORAL = "#d97757";
const PINK = "#f3a8c4";

const GLYPHS = ["◌", "❋", "◐", "◯", "◈", "◎", "◉", "◐", "◈", "◌", "◎", "❋", "◈", "✦"];

// Video Velorah hospedado en WP
const VIDEO_URL =
  "https://egoera.es/wp-content/uploads/2026/05/hero-velorah-v8.mp4";
const POSTER_URL =
  "https://egoera.es/wp-content/uploads/2026/05/hero-velorah-v8-poster.jpg";

// ─────────────────────────────────────────────────────────────────
//  VideoPlane · escena 1 (chica de Velorah)
// ─────────────────────────────────────────────────────────────────
function VideoPlane({
  textureRef,
}: {
  textureRef: React.MutableRefObject<THREE.VideoTexture | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  // El plano se mueve ligeramente hacia atrás al avanzar, para dejar
  // sitio al libro de la escena 2 sin que choque.
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = scroll.offset;
    // Escala creciente hasta ~25%, luego ligero retroceso
    const targetScale = 1 + t * 0.4 - Math.max(0, t - 0.32) * 0.8;
    const targetZ = -0.2 - Math.max(0, t - 0.35) * 6;
    damp(groupRef.current.scale, "x", targetScale, 0.25, delta);
    damp(groupRef.current.scale, "y", targetScale, 0.25, delta);
    damp(groupRef.current.position, "z", targetZ, 0.25, delta);
    // Sutil parallax horizontal con el ratón
    const m = state.mouse;
    damp(groupRef.current.rotation, "y", m.x * 0.05, 0.3, delta);
    damp(groupRef.current.rotation, "x", -m.y * 0.03, 0.3, delta);
  });

  if (!textureRef.current) return null;
  // aspect 16:9
  const W = 8;
  const H = 4.5;
  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[W, H, 32, 18]} />
        <meshBasicMaterial map={textureRef.current} toneMapped={false} />
      </mesh>
      {/* Halo cálido que rodea el plano (aura del atardecer) */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[W * 1.8, H * 1.8]} />
        <meshBasicMaterial
          color={MUSTARD}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Book · escena 2 (cuaderno)
// ─────────────────────────────────────────────────────────────────
function Book() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = scroll.offset;
    // Aparece a partir de 0.30
    const visible = t > 0.28 && t < 0.72;
    const tIn = THREE.MathUtils.clamp((t - 0.28) / 0.18, 0, 1);
    const tOut = THREE.MathUtils.clamp((t - 0.6) / 0.12, 0, 1);
    const opacity = (visible ? 1 : 0) * (1 - tOut) * tIn;

    // Posición: entra desde la derecha y abajo
    const targetX = THREE.MathUtils.lerp(2.4, 0, tIn);
    const targetY = THREE.MathUtils.lerp(-1.4, 0, tIn);
    const targetZ = 1.2 - tOut * 4;
    damp3(
      groupRef.current.position,
      [targetX, targetY, targetZ],
      0.25,
      delta
    );

    // Rotación: gira suavemente, abre hacia el lector
    const targetRotY = -0.5 + tIn * 0.6;
    damp(groupRef.current.rotation, "y", targetRotY, 0.3, delta);
    damp(groupRef.current.rotation, "x", -0.15 + Math.sin(state.clock.elapsedTime * 0.6) * 0.04, 0.3, delta);

    // Opacity de los materiales
    groupRef.current.traverse((o) => {
      if ((o as THREE.Mesh).material) {
        const mat = (o as THREE.Mesh).material as THREE.Material;
        if ("opacity" in mat) {
          (mat as THREE.MeshStandardMaterial).transparent = true;
          (mat as THREE.MeshStandardMaterial).opacity = opacity;
        }
      }
    });
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={groupRef} position={[2.4, -1.4, 1.2]} rotation={[-0.15, -0.5, 0]}>
        {/* Tapa izquierda */}
        <RoundedBox
          args={[1.2, 0.06, 1.7]}
          radius={0.02}
          smoothness={4}
          position={[-0.62, 0, 0]}
        >
          <meshStandardMaterial color={BLUE_DEEP} roughness={0.55} metalness={0.05} />
        </RoundedBox>
        {/* Tapa derecha */}
        <RoundedBox
          args={[1.2, 0.06, 1.7]}
          radius={0.02}
          smoothness={4}
          position={[0.62, 0, 0]}
        >
          <meshStandardMaterial color={BLUE_DEEP} roughness={0.55} metalness={0.05} />
        </RoundedBox>
        {/* Lomo */}
        <RoundedBox
          args={[0.05, 0.1, 1.7]}
          radius={0.01}
          smoothness={2}
          position={[0, 0.02, 0]}
        >
          <meshStandardMaterial color={BLUE_DEEP} roughness={0.55} />
        </RoundedBox>
        {/* Páginas izq */}
        <mesh position={[-0.62, 0.04, 0]}>
          <boxGeometry args={[1.12, 0.04, 1.6]} />
          <meshStandardMaterial color={CREAM} roughness={0.95} />
        </mesh>
        {/* Páginas der */}
        <mesh position={[0.62, 0.04, 0]}>
          <boxGeometry args={[1.12, 0.04, 1.6]} />
          <meshStandardMaterial color={CREAM} roughness={0.95} />
        </mesh>
        {/* Líneas de texto izq */}
        {[-0.55, -0.42, -0.29, -0.16, -0.03, 0.1, 0.23, 0.36, 0.49, 0.62].map((z, i) => (
          <mesh key={`l-${i}`} position={[-0.6, 0.063, z]}>
            <boxGeometry args={[0.92 - (i % 3) * 0.08, 0.004, 0.018]} />
            <meshBasicMaterial color={BLUE} opacity={0.7 - (i % 3) * 0.12} transparent />
          </mesh>
        ))}
        {/* Título en página derecha */}
        <Text
          position={[0.62, 0.07, -0.55]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18}
          color={BLUE}
          anchorX="center"
          anchorY="middle"
          maxWidth={1}
        >
          el cuaderno
        </Text>
        <Text
          position={[0.62, 0.07, -0.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.06}
          color={BLUE}
          anchorX="center"
          letterSpacing={0.12}
        >
          PSICOLOGÍA, DESPACIO
        </Text>
        {/* Líneas texto derecha */}
        {[-0.05, 0.08, 0.21, 0.34, 0.47].map((z, i) => (
          <mesh key={`r-${i}`} position={[0.6, 0.063, z]}>
            <boxGeometry args={[0.85 - (i % 2) * 0.06, 0.004, 0.018]} />
            <meshBasicMaterial color={BLUE} opacity={0.55} transparent />
          </mesh>
        ))}
        {/* Marcador (cinta mostaza) */}
        <mesh position={[0.3, 0.08, 0.85]}>
          <boxGeometry args={[0.04, 0.005, 0.4]} />
          <meshStandardMaterial color={MUSTARD} roughness={0.55} />
        </mesh>
      </group>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Brujula · escena 3 (14 cartas + estrellas)
// ─────────────────────────────────────────────────────────────────
function Brujula() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = scroll.offset;
    // Aparece a partir de 0.62
    const tIn = THREE.MathUtils.clamp((t - 0.62) / 0.18, 0, 1);
    const opacity = tIn;

    // Posición — centrada
    damp(groupRef.current.position, "z", 0, 0.3, delta);

    // Rotación lenta del conjunto
    groupRef.current.rotation.z =
      state.clock.elapsedTime * 0.08 - 0.5 + tIn * 0.5;

    // Escala de entrada
    const targetScale = THREE.MathUtils.lerp(0.4, 1, tIn);
    damp3(
      groupRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.3,
      delta
    );

    groupRef.current.traverse((o) => {
      if ((o as THREE.Mesh).material) {
        const mat = (o as THREE.Mesh).material as THREE.Material;
        if ("opacity" in mat) {
          (mat as THREE.MeshStandardMaterial).transparent = true;
          (mat as THREE.MeshStandardMaterial).opacity = opacity;
        }
      }
    });
  });

  const cards = useMemo(() => {
    const arr = [];
    for (let i = 0; i < GLYPHS.length; i++) {
      const angle = (i / GLYPHS.length) * Math.PI * 2;
      const radius = 2.2;
      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rot: angle + Math.PI / 2,
        glyph: GLYPHS[i],
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef} scale={0.4} position={[0, 0, -2]}>
      {/* Aura central mostaza */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={5}
        color={MUSTARD}
        distance={8}
        decay={2}
      />
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial
          color={MUSTARD}
          emissive={MUSTARD}
          emissiveIntensity={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Halo cobalto */}
      <mesh position={[0, 0, -0.6]}>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial
          color={BLUE_DEEP}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
      {/* Cartas */}
      {cards.map((c, i) => (
        <Float
          key={i}
          speed={0.6 + (i % 3) * 0.25}
          rotationIntensity={0.4}
          floatIntensity={0.55}
        >
          <group position={[c.x, c.y, (i % 3) * 0.12 - 0.1]} rotation={[0, 0, c.rot]}>
            <RoundedBox args={[0.7, 1, 0.05]} radius={0.05} smoothness={3}>
              <meshStandardMaterial
                color={CREAM}
                roughness={0.5}
                emissive={CREAM}
                emissiveIntensity={0.15}
              />
            </RoundedBox>
            <Text
              position={[0, 0.05, 0.035]}
              fontSize={0.34}
              color={BLUE}
              anchorX="center"
              anchorY="middle"
            >
              {c.glyph}
            </Text>
            <Text
              position={[0, -0.32, 0.035]}
              fontSize={0.05}
              color={BLUE}
              anchorX="center"
              letterSpacing={0.18}
            >
              EGOERA
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Camera Rig · zoom hacia la chica + DOF dinámico
// ─────────────────────────────────────────────────────────────────
function CameraRig({
  setFocusDistance,
}: {
  setFocusDistance: (v: number) => void;
}) {
  const scroll = useScroll();
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 5), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    const t = scroll.offset;
    // Camera path:
    //  0%   → (0, 0, 5)         lejos · ve el plano completo
    //  30%  → (0, 0, 1.4)       muy cerca de la chica · zoom inmersivo
    //  50%  → (1, 0.2, 1.8)     ligero pan para mostrar el libro
    //  70%  → (0, 0, 4)         retroceso · prepara brújula
    //  100% → órbita alrededor de la brújula
    let px = 0,
      py = 0,
      pz = 5,
      lx = 0,
      ly = 0,
      lz = 0;
    if (t < 0.3) {
      const u = t / 0.3;
      // suave easing in-out (smoothstep)
      const e = u * u * (3 - 2 * u);
      pz = 5 - e * 3.6; // 5 → 1.4
      py = -e * 0.05;
    } else if (t < 0.55) {
      const u = (t - 0.3) / 0.25;
      const e = u * u * (3 - 2 * u);
      px = e * 1.1;
      py = -0.05 + e * 0.25;
      pz = 1.4 + e * 0.4;
    } else if (t < 0.75) {
      const u = (t - 0.55) / 0.2;
      const e = u * u * (3 - 2 * u);
      px = 1.1 - e * 1.1;
      py = 0.2 - e * 0.2;
      pz = 1.8 + e * 2.4;
    } else {
      // Órbita alrededor de la brújula (eje Y)
      const u = (t - 0.75) / 0.25;
      const angle = u * Math.PI * 0.6;
      const radius = 4 - u * 0.8;
      px = Math.sin(angle) * radius * 0.4;
      py = Math.cos(angle) * 0.4;
      pz = Math.cos(angle) * radius;
    }
    targetPos.set(px, py, pz);

    // Look-at: chica al inicio, libro en medio, brújula al final
    if (t < 0.5) {
      lx = 0;
      ly = 0;
      lz = 0;
    } else if (t < 0.7) {
      const u = (t - 0.5) / 0.2;
      lx = u * 0.4;
      ly = 0;
      lz = -1 * u;
    } else {
      lx = 0;
      ly = 0;
      lz = -2;
    }
    targetLook.set(lx, ly, lz);

    // Aplicar con damping
    damp3(camera.position, targetPos, 0.18, delta);
    camera.lookAt(targetLook);

    // DOF focus distance dinámico:
    //   - inicio: enfoca lejos (toda la escena visible)
    //   - cerca de la chica: enfoca chica (~1.4m)
    //   - libro: enfoca libro (~1m)
    //   - brújula: enfoca centro de la brújula
    let focus = 0;
    if (t < 0.3) focus = THREE.MathUtils.lerp(5, 1.4, t / 0.3);
    else if (t < 0.55) focus = 1.6;
    else if (t < 0.75) focus = 2.8;
    else focus = 3.4;
    setFocusDistance(focus);
  });
  return null;
}

// ─────────────────────────────────────────────────────────────────
//  HUD overlay
// ─────────────────────────────────────────────────────────────────
function HUD() {
  const scroll = useScroll();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useFrame(() => {
    const t = scroll.offset;
    setProgress(t);
    let s = 0;
    if (t < 0.25) s = 0;
    else if (t < 0.55) s = 1;
    else if (t < 0.78) s = 2;
    else s = 3;
    if (s !== stage) setStage(s);
  });

  return (
    <Html
      fullscreen
      style={{
        pointerEvents: "none",
        color: CREAM,
        fontFamily: "var(--font-sans), Inter, sans-serif",
      }}
    >
      {/* Letterbox cinemático */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(11,6,32,0.92)",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(11,6,32,0.92)",
          zIndex: 10,
        }}
      />

      {/* Cap esquina superior izq */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 36,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.75,
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        }}
      >
        ◦ inmersivo · egoera
      </div>

      {/* Cap esquina superior der */}
      <div
        style={{
          position: "absolute",
          top: 64,
          right: 36,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.75,
          textAlign: "right",
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        }}
      >
        Escena {stage + 1} / 4
      </div>

      {/* Big type centrado por escena */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 720,
            opacity: stage === 0 ? 1 : 0,
            transition: "opacity 0.7s ease",
            textShadow: "0 4px 30px rgba(0,0,0,0.75)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              margin: 0,
              opacity: 0.85,
              marginBottom: 28,
            }}
          >
            ◦  egoera · psicología, despacio  ◦
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Caveat', cursive",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(64px, 10vw, 144px)",
              lineHeight: 0.94,
              margin: 0,
              color: CREAM,
            }}
          >
            mírate sin <em style={{ color: MUSTARD }}>prisa</em>.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontStyle: "italic",
              fontSize: 20,
              marginTop: 24,
              opacity: 0.9,
            }}
          >
            desliza · acércate · entra en el campo
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: "0 24px",
            opacity: stage === 1 ? 1 : 0,
            transition: "opacity 0.7s ease",
            textAlign: "center",
            textShadow: "0 4px 30px rgba(0,0,0,0.75)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                opacity: 0.78,
                margin: "0 0 24px",
              }}
            >
              — el campo de flores —
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), 'Caveat', cursive",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(56px, 8vw, 124px)",
                lineHeight: 0.94,
                margin: 0,
              }}
            >
              quédate aquí
              <br />
              <em style={{ color: PINK }}>un momento</em>.
            </h2>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "8%",
            transform: "translateY(-50%)",
            maxWidth: 380,
            opacity: stage === 2 ? 1 : 0,
            transition: "opacity 0.7s ease",
            textShadow: "0 2px 14px rgba(0,0,0,0.75)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              opacity: 0.78,
              margin: "0 0 18px",
            }}
          >
            02 · el cuaderno
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display), 'Caveat', cursive",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            una idea,
            <br />
            <em style={{ color: MUSTARD }}>no diez</em>.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              marginTop: 22,
              opacity: 0.9,
            }}
          >
            Una entrada cada domingo, basada en evidencia.
          </p>
          <a
            href="/blog/"
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 24,
              padding: "11px 22px",
              background: MUSTARD,
              color: BLUE_DEEP,
              borderRadius: 999,
              fontFamily: "var(--font-sans), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              textDecoration: "none",
            }}
          >
            leer el cuaderno →
          </a>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "8%",
            transform: "translateY(-50%)",
            maxWidth: 380,
            textAlign: "right",
            opacity: stage === 3 ? 1 : 0,
            transition: "opacity 0.7s ease",
            textShadow: "0 2px 14px rgba(0,0,0,0.75)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              opacity: 0.78,
              margin: "0 0 18px",
            }}
          >
            03 · la brújula
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display), 'Caveat', cursive",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 0.92,
              margin: 0,
            }}
          >
            antes de leer,
            <br />
            <em style={{ color: PINK }}>mírate</em>.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontStyle: "italic",
              fontSize: 18,
              marginTop: 22,
              opacity: 0.9,
              marginLeft: "auto",
            }}
          >
            14 cartas, 3 minutos, una región a la que volver.
          </p>
          <a
            href="/sentir/"
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 24,
              padding: "11px 22px",
              background: MUSTARD,
              color: BLUE_DEEP,
              borderRadius: 999,
              fontFamily: "var(--font-sans), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              textDecoration: "none",
            }}
          >
            empezar el mazo →
          </a>
        </div>
      </div>

      {/* Hint scroll + progress */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 11,
        }}
      >
        <div
          style={{
            width: 200,
            height: 2,
            background: "rgba(241,234,216,0.18)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${MUSTARD}, ${PINK})`,
              boxShadow: "0 0 10px rgba(244,200,66,0.55)",
              transition: "width 0.08s linear",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            opacity: stage === 0 ? 0.7 : 0.3,
            transition: "opacity 0.4s ease",
          }}
        >
          ↓ desliza ↓
        </div>
      </div>
    </Html>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Scene root
// ─────────────────────────────────────────────────────────────────
function Scene() {
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [focusDistance, setFocusDistance] = useState(5);

  // Crear video + VideoTexture en cliente (R3F is client)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (textureRef.current) return;
    const v = document.createElement("video");
    v.src = VIDEO_URL;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true;
    v.preload = "auto";
    v.play().catch(() => undefined);
    const tex = new THREE.VideoTexture(v);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureRef.current = tex;
    return () => {
      v.pause();
      tex.dispose();
      textureRef.current = null;
    };
  }, []);

  return (
    <>
      <fog attach="fog" args={["#0a1340", 6, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 6]} intensity={0.85} color={CREAM} />
      <pointLight position={[-4, 2, 3]} intensity={1.2} color={PINK} distance={10} />
      <spotLight
        position={[0, 5, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={1.6}
        color={MUSTARD}
        target-position={[0, -1, 0]}
      />

      <ScrollControls pages={4} damping={0.18}>
        <CameraRig setFocusDistance={setFocusDistance} />
        <VideoPlane textureRef={textureRef} />
        <Book />
        <Brujula />
        <HUD />
      </ScrollControls>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.55}
          luminanceSmoothing={0.7}
          intensity={1.05}
          mipmapBlur
        />
        <DepthOfField
          focusDistance={focusDistance / 12}
          focalLength={0.05}
          bokehScale={3.5}
          height={480}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.7} />
        <Noise opacity={0.05} />
      </EffectComposer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Root component
// ─────────────────────────────────────────────────────────────────
export default function InmersivoExperience() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
    // Pequeño retardo para evitar pico inicial
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(ellipse 120% 80% at 50% 40%, #1a2470 0%, #0a1340 45%, #050a26 100%)",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {ready && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.6]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
          performance={{ min: 0.4 }}
          camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 50 }}
        >
          <Scene />
        </Canvas>
      )}

      {/* Poster mientras carga */}
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${POSTER_URL}")`,
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
}
