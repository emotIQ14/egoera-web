"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";

// --- Data ---

interface BrainRegionData {
  id: string;
  label: string;
  category: string;
  color: string;
  /** Spherical coords: theta (horizontal), phi (vertical) in radians, relative to brain center */
  theta: number;
  phi: number;
}

const BRAIN_REGIONS: BrainRegionData[] = [
  {
    id: "prefrontal",
    label: "Corteza Prefrontal",
    category: "regulacion-emocional",
    color: "#6BA3BE",
    theta: 0.3,
    phi: 0.5,
  },
  {
    id: "temporal",
    label: "Lobulo Temporal",
    category: "relaciones-apego",
    color: "#7FB5A0",
    theta: -1.2,
    phi: Math.PI / 2 + 0.1,
  },
  {
    id: "parietal",
    label: "Lobulo Parietal",
    category: "autoconocimiento",
    color: "#A8D5C8",
    theta: Math.PI - 0.4,
    phi: 0.5,
  },
  {
    id: "amigdala",
    label: "Amigdala",
    category: "desmitificacion",
    color: "#E8A87C",
    theta: 0.0,
    phi: Math.PI / 2 + 0.25,
  },
  {
    id: "broca",
    label: "Area de Broca",
    category: "limites-asertividad",
    color: "#B8A9C9",
    theta: -0.7,
    phi: Math.PI / 3,
  },
  {
    id: "cerebelo",
    label: "Cerebelo",
    category: "psicologia-cotidiana",
    color: "#F4B8C1",
    theta: Math.PI,
    phi: Math.PI / 2 + 0.4,
  },
];

// --- Watercolor shader ---

const watercolorVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // simplex noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472786226 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;

    // organic deformation — brain-like bumps (high amplitude for visible sulci)
    float displacement = snoise(position * 2.5) * 0.15
                       + snoise(position * 5.0) * 0.07
                       + snoise(position * 10.0) * 0.03;

    vec3 newPosition = position + normal * displacement;
    vPosition = newPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const watercolorFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Simplex noise for fragment shader
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472786226 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Base watercolor blending — animated flowing paint
    float n1 = snoise(vPosition * 3.0 + uTime * 0.05);
    float n2 = snoise(vPosition * 6.0 - uTime * 0.03);
    float n3 = snoise(vPosition * 1.5 + uTime * 0.02);

    // Watercolor-style mixing: soft transitions between palette colors
    float blend1 = smoothstep(-0.3, 0.5, n1);
    float blend2 = smoothstep(-0.2, 0.6, n2);

    vec3 color = mix(uColor1, uColor2, blend1);
    color = mix(color, uColor3, blend2 * 0.5);

    // Paper texture — tiny grain
    float grain = snoise(vPosition * 40.0) * 0.06;
    color += grain;

    // Watercolor edge darkening — paint pools at edges
    float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float edgeDark = smoothstep(0.3, 0.95, edgeFactor);
    color = mix(color, color * 0.7, edgeDark * 0.4);

    // Soft rim light for depth
    float rimLight = pow(edgeFactor, 3.0) * 0.3;
    color += rimLight * vec3(1.0, 0.98, 0.95);

    // Paint blotch effect — random dark/light patches
    float blotch = snoise(vPosition * 8.0 + vec3(42.0));
    float blotchMask = smoothstep(0.4, 0.6, blotch);
    color = mix(color, color * 0.88, blotchMask * 0.25);

    // Light paint drip streaks along Y
    float drip = snoise(vec3(vPosition.x * 12.0, vPosition.y * 3.0 - uTime * 0.02, vPosition.z * 12.0));
    float dripMask = smoothstep(0.5, 0.7, drip);
    color = mix(color, color * 1.08, dripMask * 0.15);

    // Fresnel-like soft translucency
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    color += fresnel * 0.08 * uColor1;

    gl_FragColor = vec4(color, 0.92);
  }
`;

// --- Region Hotspot ---

function RegionHotspot({
  region,
  brainRadius,
  hovered,
  onHover,
  onUnhover,
  onClick,
}: {
  region: BrainRegionData;
  brainRadius: number;
  hovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(region.color), [region.color]);

  // Position on the brain surface from spherical coordinates
  const position = useMemo(() => {
    const r = brainRadius + 0.02;
    const x = r * Math.sin(region.phi) * Math.cos(region.theta);
    const y = r * Math.cos(region.phi);
    const z = r * Math.sin(region.phi) * Math.sin(region.theta);
    return new THREE.Vector3(x, y, z);
  }, [region.theta, region.phi, brainRadius]);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + region.theta * 3) * 0.003;
      meshRef.current.scale.setScalar(hovered ? 1.4 : 1.0 + pulse);
    }
    if (glowRef.current) {
      glowRef.current.visible = hovered;
      if (hovered) {
        const glowPulse = 1.0 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
        glowRef.current.scale.setScalar(glowPulse * 2.2);
      }
    }
  });

  return (
    <group position={position}>
      {/* Glow sphere (behind) */}
      <mesh ref={glowRef} visible={false}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Interactive hotspot */}
      <mesh
        ref={meshRef}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onUnhover();
          document.body.style.cursor = "auto";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.4}
          transparent
          opacity={hovered ? 1.0 : 0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Tooltip */}
      {hovered && (
        <Html
          position={[0, 0.18, 0]}
          center
          distanceFactor={4}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg border border-white/20"
            style={{
              backgroundColor: region.color,
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {region.label}
          </div>
        </Html>
      )}
    </group>
  );
}

// --- Brain Mesh (two hemispheres + cerebellum + brain stem with watercolor shader) ---

function BrainMesh({
  hoveredRegion,
}: {
  hoveredRegion: string | null;
}) {
  const materialRefs = useRef<(THREE.ShaderMaterial | null)[]>([]);

  const makeUniforms = useCallback(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#6BA3BE") },
      uColor2: { value: new THREE.Color("#7FB5A0") },
      uColor3: { value: new THREE.Color("#A8D5C8") },
    }),
    [],
  );

  const uniformSets = useMemo(
    () => [makeUniforms(), makeUniforms(), makeUniforms(), makeUniforms()],
    [makeUniforms],
  );

  useFrame((state) => {
    for (const mat of materialRefs.current) {
      if (!mat) continue;
      mat.uniforms.uTime.value = state.clock.elapsedTime;

      if (hoveredRegion) {
        const region = BRAIN_REGIONS.find((r) => r.id === hoveredRegion);
        if (region) {
          const hoverColor = new THREE.Color(region.color);
          mat.uniforms.uColor1.value.lerp(hoverColor, 0.02);
        }
      } else {
        mat.uniforms.uColor1.value.lerp(new THREE.Color("#6BA3BE"), 0.01);
      }
    }
  });

  const setRef = (idx: number) => (el: THREE.ShaderMaterial | null) => {
    materialRefs.current[idx] = el;
  };

  return (
    <group>
      {/* Left hemisphere */}
      <mesh position={[-0.28, 0.05, 0]} scale={[0.55, 0.75, 0.65]}>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          ref={setRef(0)}
          vertexShader={watercolorVertexShader}
          fragmentShader={watercolorFragmentShader}
          uniforms={uniformSets[0]}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right hemisphere */}
      <mesh position={[0.28, 0.05, 0]} scale={[0.55, 0.75, 0.65]}>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          ref={setRef(1)}
          vertexShader={watercolorVertexShader}
          fragmentShader={watercolorFragmentShader}
          uniforms={uniformSets[1]}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cerebellum — smaller sphere at back-bottom */}
      <mesh position={[0, -0.45, -0.35]} scale={[0.38, 0.28, 0.32]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={setRef(2)}
          vertexShader={watercolorVertexShader}
          fragmentShader={watercolorFragmentShader}
          uniforms={uniformSets[2]}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Brain stem — cylinder at the bottom */}
      <mesh position={[0, -0.72, -0.18]} rotation={[0.3, 0, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.08, 0.06, 0.35, 24]} />
        <shaderMaterial
          ref={setRef(3)}
          vertexShader={watercolorVertexShader}
          fragmentShader={watercolorFragmentShader}
          uniforms={uniformSets[3]}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// --- Brain fissure / sulcus lines for organic feel ---

function BrainFissures() {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    const result: THREE.CatmullRomCurve3[] = [];
    // Central longitudinal fissure (between hemispheres)
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.7, 0.15),
        new THREE.Vector3(0, 0.45, 0.35),
        new THREE.Vector3(0, 0.1, 0.42),
        new THREE.Vector3(0, -0.25, 0.35),
        new THREE.Vector3(0, -0.55, 0.15),
      ]),
    );
    // Left lateral fissure (Sylvian)
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0.15, 0.45),
        new THREE.Vector3(-0.35, 0.1, 0.55),
        new THREE.Vector3(-0.2, 0.0, 0.52),
      ]),
    );
    // Right lateral fissure
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, 0.15, 0.45),
        new THREE.Vector3(0.35, 0.1, 0.55),
        new THREE.Vector3(0.2, 0.0, 0.52),
      ]),
    );
    // Left parietal sulcus
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.45, 0.5, 0.2),
        new THREE.Vector3(-0.4, 0.2, 0.4),
        new THREE.Vector3(-0.3, -0.1, 0.48),
        new THREE.Vector3(-0.15, -0.35, 0.4),
      ]),
    );
    // Right parietal sulcus
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.45, 0.5, 0.2),
        new THREE.Vector3(0.4, 0.2, 0.4),
        new THREE.Vector3(0.3, -0.1, 0.48),
        new THREE.Vector3(0.15, -0.35, 0.4),
      ]),
    );
    // Parieto-occipital (back)
    result.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.08, 0.55, -0.25),
        new THREE.Vector3(0.04, 0.25, -0.45),
        new THREE.Vector3(0.0, -0.05, -0.5),
      ]),
    );
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 32, 0.008, 6, false]} />
          <meshBasicMaterial
            color="#5a8a9a"
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// --- Paint splatter particles ---

function PaintSplatters() {
  const count = 40;
  const ref = useRef<THREE.InstancedMesh>(null);

  const { matrices, colors } = useMemo(() => {
    const palette = ["#6BA3BE", "#7FB5A0", "#A8D5C8", "#E8A87C", "#B8A9C9", "#F4B8C1"];
    const mats: THREE.Matrix4[] = [];
    const cols: THREE.Color[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // Random position around the brain surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.05 + Math.random() * 0.3;
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta) * 0.85,
        r * Math.cos(phi) * 0.78,
        r * Math.sin(phi) * Math.sin(theta) * 0.7,
      );
      const scale = 0.01 + Math.random() * 0.025;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
      cols.push(new THREE.Color(palette[Math.floor(Math.random() * palette.length)]));
    }
    return { matrices: mats, colors: cols };
  }, []);

  useMemo(() => {
    if (!ref.current) return;
    const colorArray = new Float32Array(count * 3);
    matrices.forEach((mat, i) => {
      ref.current!.setMatrixAt(i, mat);
      colors[i].toArray(colorArray, i * 3);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colorArray, 3),
    );
  }, [matrices, colors]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.35} vertexColors />
    </instancedMesh>
  );
}

// --- Auto-rotation wrapper ---

function AutoRotate({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// --- Responsive camera ---

function ResponsiveCamera() {
  const { viewport } = useThree();
  const { camera } = useThree();

  useFrame(() => {
    // Adjust camera distance based on viewport width for mobile responsiveness
    const target = viewport.width < 5 ? 3.8 : 3.2;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z += (target - cam.position.z) * 0.05;
  });

  return null;
}

// --- Scene ---

function BrainScene() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();
  const brainRadius = 0.78;

  const handleRegionClick = useCallback(
    (category: string) => {
      router.push(`/blog?cat=${category}`);
    },
    [router],
  );

  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff5ee" />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color="#d4e6ec" />
      <pointLight position={[0, 3, 2]} intensity={0.2} color="#E8A87C" />

      <AutoRotate>
        <BrainMesh hoveredRegion={hoveredRegion} />
        <BrainFissures />
        <PaintSplatters />

        {BRAIN_REGIONS.map((region) => (
          <RegionHotspot
            key={region.id}
            region={region}
            brainRadius={brainRadius}
            hovered={hoveredRegion === region.id}
            onHover={() => setHoveredRegion(region.id)}
            onUnhover={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick(region.category)}
          />
        ))}
      </AutoRotate>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
}

// --- Loading state ---

function BrainLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "#6BA3BE",
            borderRightColor: "#A8D5C8",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          style={{
            animationDirection: "reverse",
            animationDuration: "1.5s",
            borderBottomColor: "#7FB5A0",
            borderLeftColor: "#F4B8C1",
          }}
        />
      </div>
      <p className="text-sm text-grey-text animate-pulse">
        Cargando cerebro 3D...
      </p>
    </div>
  );
}

// --- Main exported component ---

export default function Brain3D() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto sm:max-w-[550px] lg:max-w-[600px]">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        fallback={<BrainLoader />}
      >
        <BrainScene />
      </Canvas>

      {/* Instruction text */}
      <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-grey-text/60 pointer-events-none">
        Arrastra para rotar &middot; Toca una zona para explorar
      </p>
    </div>
  );
}
