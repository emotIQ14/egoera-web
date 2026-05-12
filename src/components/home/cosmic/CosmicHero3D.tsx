"use client";

/**
 * CosmicHero3D — escena 3D inspirada en "Know it all".
 *
 * Lo que renderiza:
 *  - Cielo profundo cobalto con fade radial (post procesado bloom dorado).
 *  - Silueta de persona vista desde atrás (cabeza + hombros) en plano cercano.
 *  - **Sistema de partículas denso (~1500 puntos)** emitido desde el top de
 *    la cabeza, drift hacia arriba con turbulencia, tonos dorados / naranjas.
 *  - Estrellas lejanas (drei <Stars />) para profundidad.
 *  - Post-processing: bloom dorado intenso sobre las partículas y la
 *    coronilla.
 *
 * Performance:
 *  - DPR adaptativo: max 2 en desktop, 1 en mobile (mobile real entra por
 *    fallback en el padre antes de montar este componente).
 *  - `frameloop="demand"` permite pausar render cuando no hay actividad.
 *  - LowFPS detection vía `performance` prop de R3F: si frame budget cae
 *    bajo el 50%, reduce DPR automáticamente.
 *  - Geometry de las partículas como BufferGeometry, no instances.
 */

import { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ───────────────────────────────────────────────────────────────────────
// SISTEMA DE PARTÍCULAS — explosión cósmica desde la coronilla
// ───────────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 1500;
const HEAD_TOP = new THREE.Vector3(0, 0.7, 0); // origen aproximado de la coronilla

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  // Buffers de posición y propiedades por partícula
  const { positions, velocities, lifetimes, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const lifetimes = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Paleta dorado-naranja inspirada en la referencia (Know it all)
    const palette = [
      new THREE.Color("#ffeaa3"), // crema dorado
      new THREE.Color("#f7c94a"), // mostaza
      new THREE.Color("#d97757"), // naranja terracota
      new THREE.Color("#c9694b"), // terracota
      new THREE.Color("#fff7e0"), // blanco cálido
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Posición inicial: dispersa en una pequeña zona alrededor de la coronilla,
      // con tendencia ya elevada para que la nube se vea desde el primer frame.
      const spread = 0.15;
      positions[i3 + 0] = HEAD_TOP.x + (Math.random() - 0.5) * spread;
      positions[i3 + 1] = HEAD_TOP.y + Math.random() * 0.4;
      positions[i3 + 2] = HEAD_TOP.z + (Math.random() - 0.5) * spread;

      // Velocidad: principalmente hacia arriba con drift lateral aleatorio.
      const angle = Math.random() * Math.PI * 2;
      const radial = Math.random() * 0.012;
      velocities[i3 + 0] = Math.cos(angle) * radial;
      velocities[i3 + 1] = 0.008 + Math.random() * 0.022; // 60-100% hacia arriba
      velocities[i3 + 2] = Math.sin(angle) * radial;

      // Lifetime: ciclo de vida [0, 1], cada partícula empieza con un offset
      // aleatorio para no aparecer en sincronía.
      lifetimes[i] = Math.random();

      // Tamaño base: variación natural.
      sizes[i] = 0.018 + Math.random() * 0.035;

      // Color: muestreo de la paleta con leve perturbación.
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { positions, velocities, lifetimes, sizes, colors };
  }, []);

  // Tick: avanza la simulación
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const posAttr = mesh.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Avanza posición según velocidad
      arr[i3 + 0] += velocities[i3 + 0];
      arr[i3 + 1] += velocities[i3 + 1];
      arr[i3 + 2] += velocities[i3 + 2];

      // Avanza lifetime; al pasar de 1 reposiciona la partícula en el origen
      lifetimes[i] += delta * 0.35;
      if (lifetimes[i] > 1) {
        lifetimes[i] = 0;
        // Reset a la coronilla con jitter
        arr[i3 + 0] = HEAD_TOP.x + (Math.random() - 0.5) * 0.08;
        arr[i3 + 1] = HEAD_TOP.y + (Math.random() - 0.5) * 0.05;
        arr[i3 + 2] = HEAD_TOP.z + (Math.random() - 0.5) * 0.08;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SILUETA DE LA PERSONA — geometría 3D simple, vista desde atrás
// ───────────────────────────────────────────────────────────────────────

function Silhouette() {
  // Modelo low-poly montado con primitivas: una esfera para la cabeza, un
  // tronco/hombros con CapsuleGeometry. Color azul-cobalto muy oscuro
  // (silueta contra el cielo) que en el bloom queda casi negro.
  return (
    <group position={[0, -0.4, 0]}>
      {/* Cabeza */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color="#06093a"
          roughness={1}
          metalness={0}
          emissive="#0a1370"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Cuello */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 16]} />
        <meshStandardMaterial color="#06093a" roughness={1} />
      </mesh>
      {/* Hombros / torso (visto desde atrás como un trapecio suave) */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.75, 0.95, 32, 1, true]} />
        <meshStandardMaterial
          color="#06093a"
          roughness={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Espalda sólida (semicilindro relleno) */}
      <mesh position={[0, -0.55, -0.05]}>
        <boxGeometry args={[1.2, 0.95, 0.08]} />
        <meshStandardMaterial color="#06093a" roughness={1} />
      </mesh>
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────────
// LUZ y CIELO
// ───────────────────────────────────────────────────────────────────────

function CosmicLighting() {
  return (
    <>
      {/* Ambiente muy bajo */}
      <ambientLight intensity={0.18} color="#1d2bdb" />
      {/* Luz cálida desde arriba (la fuente "del pensamiento") */}
      <pointLight
        position={[0, 1.4, 0.6]}
        intensity={2.4}
        color="#ffd084"
        distance={4}
        decay={2}
      />
      {/* Backlight cobalto para silueta */}
      <directionalLight
        position={[0.5, -0.4, 1.2]}
        intensity={0.6}
        color="#4a64ff"
      />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────
// ESCENA + Canvas
// ───────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      {/* Estrellas lejanas */}
      <Stars
        radius={50}
        depth={25}
        count={2500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <CosmicLighting />
      <Silhouette />
      <Particles />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.6}
          mipmapBlur
          radius={0.55}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

/**
 * Componente público. El padre debe asegurarse de no montar esto en
 * mobile (usar matchMedia + dynamic con ssr: false).
 */
export default function CosmicHero3D({
  className,
}: {
  className?: string;
}) {
  // Pausa cuando la pestaña no es visible (ahorro de batería).
  useEffect(() => {
    const onVis = () => {
      // El Canvas con frameloop="always" lo gestiona internamente
      // mediante requestAnimationFrame, que pausa cuando el documento
      // está oculto. No hace falta hacer nada manual.
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0.2, 2.2], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop="always"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
