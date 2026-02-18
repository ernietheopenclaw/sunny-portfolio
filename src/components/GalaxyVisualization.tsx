"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Concept } from "@/types";
import { useScroll } from "@/lib/scroll";

extend({ EffectComposer, RenderPass, UnrealBloomPass, OutputPass });

// --- Galaxy generation config ---
const NUM_STARS = 7000;
const GALAXY_THICKNESS = 5;
const CORE_X_DIST = 33;
const CORE_Y_DIST = 33;
const OUTER_CORE_X_DIST = 100;
const OUTER_CORE_Y_DIST = 100;
const ARM_X_DIST = 100;
const ARM_Y_DIST = 50;
const ARM_X_MEAN = 200;
const ARM_Y_MEAN = 100;
const SPIRAL_FACTOR = 3.0;
const ARMS = 2;
const HAZE_RATIO = 0.5;
const GALAXY_SCALE = 0.03; // scale down to fit scene

const STAR_COLORS = [0xffcc6f, 0xffd2a1, 0xfff4ea, 0xf8f7ff, 0xcad7ff, 0xaabfff];
const STAR_PERCENTAGES = [76.45, 12.1, 7.6, 3.0, 0.6, 0.13];
const STAR_SIZES = [0.7, 0.7, 1.15, 1.48, 2.0, 2.5];

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

function spiral(x: number, y: number, z: number, offset: number): THREE.Vector3 {
  const r = Math.sqrt(x ** 2 + y ** 2);
  let theta = offset;
  theta += x > 0 ? Math.atan(y / x) : Math.atan(y / x) + Math.PI;
  theta += (r / ARM_X_DIST) * SPIRAL_FACTOR;
  return new THREE.Vector3(r * Math.cos(theta) * GALAXY_SCALE, z * GALAXY_SCALE, r * Math.sin(theta) * GALAXY_SCALE);
}

function pickStarType(): number {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (let i = 0; i < STAR_PERCENTAGES.length; i++) {
    cumulative += STAR_PERCENTAGES[i];
    if (roll <= cumulative) return i;
  }
  return 0;
}

interface StarData {
  position: THREE.Vector3;
  color: THREE.Color;
  size: number;
  isHaze: boolean;
}

function generateGalaxy(): StarData[] {
  const stars: StarData[] = [];
  const quarter = Math.floor(NUM_STARS / 4);

  // Core stars
  for (let i = 0; i < quarter; i++) {
    const x = gaussianRandom(0, CORE_X_DIST);
    const y = gaussianRandom(0, CORE_Y_DIST);
    const z = gaussianRandom(0, GALAXY_THICKNESS);
    const type = pickStarType();
    stars.push({
      position: new THREE.Vector3(x * GALAXY_SCALE, z * GALAXY_SCALE, y * GALAXY_SCALE),
      color: new THREE.Color(STAR_COLORS[type]),
      size: STAR_SIZES[type] * 0.15,
      isHaze: false,
    });
  }

  // Outer core
  for (let i = 0; i < quarter; i++) {
    const x = gaussianRandom(0, OUTER_CORE_X_DIST);
    const y = gaussianRandom(0, OUTER_CORE_Y_DIST);
    const z = gaussianRandom(0, GALAXY_THICKNESS);
    const type = pickStarType();
    stars.push({
      position: new THREE.Vector3(x * GALAXY_SCALE, z * GALAXY_SCALE, y * GALAXY_SCALE),
      color: new THREE.Color(STAR_COLORS[type]),
      size: STAR_SIZES[type] * 0.15,
      isHaze: false,
    });
  }

  // Arm stars
  const armStars = NUM_STARS - 2 * quarter;
  const perArm = Math.floor(armStars / ARMS);
  for (let j = 0; j < ARMS; j++) {
    const offset = (j * 2 * Math.PI) / ARMS;
    for (let i = 0; i < perArm; i++) {
      const x = gaussianRandom(ARM_X_MEAN, ARM_X_DIST);
      const y = gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST);
      const z = gaussianRandom(0, GALAXY_THICKNESS);
      const pos = spiral(x, y, z, offset);
      const type = pickStarType();
      stars.push({
        position: pos,
        color: new THREE.Color(STAR_COLORS[type]),
        size: STAR_SIZES[type] * 0.15,
        isHaze: false,
      });
    }
  }

  // Haze sprites
  const numHaze = Math.floor(NUM_STARS * HAZE_RATIO);
  for (let i = 0; i < numHaze; i++) {
    const x = gaussianRandom(0, OUTER_CORE_X_DIST * 1.5);
    const y = gaussianRandom(0, OUTER_CORE_Y_DIST * 1.5);
    const z = gaussianRandom(0, GALAXY_THICKNESS * 0.5);
    stars.push({
      position: new THREE.Vector3(x * GALAXY_SCALE, z * GALAXY_SCALE, y * GALAXY_SCALE),
      color: new THREE.Color(0x2244aa),
      size: 0.8 + Math.random() * 1.2,
      isHaze: true,
    });
  }

  return stars;
}

function createStarTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.7, "rgba(255,255,255,0.15)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Timeline positions
function getTimelinePositions(concepts: Concept[]): Map<string, THREE.Vector3> {
  const sorted = [...concepts].sort(
    (a, b) => new Date(a.date_learned).getTime() - new Date(b.date_learned).getTime()
  );
  const spacing = 1.5;
  const startX = -(sorted.length - 1) * spacing * 0.5;
  const map = new Map<string, THREE.Vector3>();
  sorted.forEach((c, i) => map.set(c.id, new THREE.Vector3(startX + i * spacing, 0, 0)));
  return map;
}

// Place concepts along spiral arms
function placeConceptsInGalaxy(concepts: Concept[]): Map<string, THREE.Vector3> {
  const map = new Map<string, THREE.Vector3>();
  concepts.forEach((c, i) => {
    const armIdx = i % ARMS;
    const offset = (armIdx * 2 * Math.PI) / ARMS;
    const x = gaussianRandom(ARM_X_MEAN * 0.8, ARM_X_DIST * 0.5);
    const y = gaussianRandom(ARM_Y_MEAN * 0.3, ARM_Y_DIST * 0.3);
    const z = gaussianRandom(0, GALAXY_THICKNESS * 0.3);
    const pos = spiral(x, y, z, offset);
    map.set(c.id, pos);
  });
  return map;
}

// Bloom post-processing
function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const comp = new EffectComposer(gl);
    comp.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.5, // strength
      0.4, // radius
      0.2  // threshold
    );
    comp.addPass(bloom);
    comp.addPass(new OutputPass());
    composer.current = comp;

    return () => {
      comp.dispose();
    };
  }, [gl, scene, camera, size]);

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}

// Galaxy stars rendered as Points
function GalaxyStars() {
  const pointsRef = useRef<THREE.Points>(null!);
  const hazeRef = useRef<THREE.Points>(null!);

  const { stars, hazeStars, starTexture } = useMemo(() => {
    const allStars = generateGalaxy();
    return {
      stars: allStars.filter((s) => !s.isHaze),
      hazeStars: allStars.filter((s) => s.isHaze),
      starTexture: createStarTexture(),
    };
  }, []);

  const { starPositions, starColors, starSizes } = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    const sizes = new Float32Array(stars.length);
    stars.forEach((s, i) => {
      positions[i * 3] = s.position.x;
      positions[i * 3 + 1] = s.position.y;
      positions[i * 3 + 2] = s.position.z;
      colors[i * 3] = s.color.r;
      colors[i * 3 + 1] = s.color.g;
      colors[i * 3 + 2] = s.color.b;
      sizes[i] = s.size;
    });
    return { starPositions: positions, starColors: colors, starSizes: sizes };
  }, [stars]);

  const { hazePositions, hazeColors, hazeSizes } = useMemo(() => {
    const positions = new Float32Array(hazeStars.length * 3);
    const colors = new Float32Array(hazeStars.length * 3);
    const sizes = new Float32Array(hazeStars.length);
    hazeStars.forEach((s, i) => {
      positions[i * 3] = s.position.x;
      positions[i * 3 + 1] = s.position.y;
      positions[i * 3 + 2] = s.position.z;
      colors[i * 3] = s.color.r;
      colors[i * 3 + 1] = s.color.g;
      colors[i * 3 + 2] = s.color.b;
      sizes[i] = s.size;
    });
    return { hazePositions: positions, hazeColors: colors, hazeSizes: sizes };
  }, [hazeStars]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
    if (hazeRef.current) {
      hazeRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[starSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          size={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={hazeRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[hazePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[hazeColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[hazeSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          vertexColors
          transparent
          opacity={0.08}
          sizeAttenuation
          size={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// Concept dots that transition between modes
interface ConceptDotsProps {
  concepts: Concept[];
  onHover: (concept: Concept | null, pos: THREE.Vector3 | null) => void;
}

function ConceptDots({ concepts, onHover }: ConceptDotsProps) {
  const { mode } = useScroll();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const transitionRef = useRef({ progress: 0, currentMode: "galaxy" as string });

  const galaxyPositions = useMemo(() => placeConceptsInGalaxy(concepts), [concepts]);
  const timelinePositions = useMemo(() => getTimelinePositions(concepts), [concepts]);

  // Cluster positions: use stored x,y,z
  const clusterPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    concepts.forEach((c) => map.set(c.id, new THREE.Vector3(c.x, c.y, c.z)));
    return map;
  }, [concepts]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const prevPositions = useRef<THREE.Vector3[]>(concepts.map(() => new THREE.Vector3()));
  const targetPositions = useRef<THREE.Vector3[]>(concepts.map(() => new THREE.Vector3()));
  const currentPositions = useRef<THREE.Vector3[]>(concepts.map(() => new THREE.Vector3()));

  // Update targets when mode changes
  useEffect(() => {
    const posMap = mode === "galaxy" ? galaxyPositions : mode === "reduction" ? clusterPositions : timelinePositions;
    concepts.forEach((c, i) => {
      prevPositions.current[i].copy(currentPositions.current[i]);
      const target = posMap.get(c.id) || new THREE.Vector3();
      targetPositions.current[i].copy(target);
    });
    transitionRef.current.progress = 0;
    transitionRef.current.currentMode = mode;
  }, [mode, concepts, galaxyPositions, clusterPositions, timelinePositions]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const t = transitionRef.current;
    t.progress = Math.min(t.progress + delta / 1.5, 1);
    const ease = t.progress < 0.5
      ? 4 * t.progress * t.progress * t.progress
      : 1 - Math.pow(-2 * t.progress + 2, 3) / 2;

    for (let i = 0; i < concepts.length; i++) {
      currentPositions.current[i].lerpVectors(prevPositions.current[i], targetPositions.current[i], ease);
      dummy.position.copy(currentPositions.current[i]);

      // In galaxy mode, rotate with the galaxy
      if (mode === "galaxy") {
        const galaxyRotation = meshRef.current.parent?.parent?.rotation.y || 0;
        // Concept dots don't need extra rotation since they're children
      }

      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      color.set(STAR_COLORS[i % STAR_COLORS.length]);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Rotate with galaxy in galaxy mode
    if (meshRef.current.parent) {
      // Handled by parent group rotation
    }
  });

  const { camera, raycaster, pointer } = useThree();

  const handlePointerMove = useCallback(() => {
    if (!meshRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
      const idx = intersects[0].instanceId;
      if (idx < concepts.length) {
        const pos = new THREE.Vector3();
        const mat = new THREE.Matrix4();
        meshRef.current.getMatrixAt(idx, mat);
        pos.setFromMatrixPosition(mat);
        onHover(concepts[idx], pos);
        return;
      }
    }
    onHover(null, null);
  }, [concepts, camera, raycaster, pointer, onHover]);

  return (
    <group onPointerMove={handlePointerMove}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, concepts.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

function Tooltip({ concept, position }: { concept: Concept | null; position: THREE.Vector3 | null }) {
  if (!concept || !position) return null;
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        color: "var(--text)",
        padding: "8px 16px",
        borderRadius: "8px",
        maxWidth: "240px",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        <p style={{ fontWeight: 600, color: "var(--accent-mid)", fontSize: "13px" }}>{concept.name}</p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{concept.short_summary}</p>
        {concept.date_learned && (
          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", opacity: 0.7 }}>
            Learned: {new Date(concept.date_learned).toLocaleDateString()}
          </p>
        )}
      </div>
    </Html>
  );
}

function GalaxyGroup({ concepts }: { concepts: Concept[] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { mode } = useScroll();

  useFrame((_, delta) => {
    if (groupRef.current && mode === "galaxy") {
      // Galaxy auto-rotates; concept dots are children so they rotate too
    }
  });

  return (
    <group ref={groupRef}>
      <GalaxyStars />
    </group>
  );
}

function Scene({ concepts }: { concepts: Concept[] }) {
  const [hovered, setHovered] = useState<Concept | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const { mode } = useScroll();

  const handleHover = useCallback((concept: Concept | null, pos: THREE.Vector3 | null) => {
    setHovered(concept);
    setHoveredPos(pos);
  }, []);

  // Fade galaxy stars based on mode
  const galaxyOpacity = mode === "galaxy" ? 1 : 0;

  return (
    <>
      <ambientLight intensity={0.2} />
      <group visible={mode === "galaxy"}>
        <GalaxyGroup concepts={concepts} />
      </group>
      <ConceptDots concepts={concepts} onHover={handleHover} />
      <Tooltip concept={hovered} position={hoveredPos} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={mode === "galaxy"}
        autoRotateSpeed={0.3}
      />
      <Bloom />
    </>
  );
}

interface Props {
  concepts: Concept[];
}

export default function GalaxyVisualization({ concepts }: Props) {
  const { mode, nextMode, prevMode, setMode } = useScroll();
  const [mounted, setMounted] = useState(false);
  const lastWheelTime = useRef(0);

  useEffect(() => setMounted(true), []);

  // Scroll wheel mode switching
  useEffect(() => {
    if (!mounted) return;
    const handleWheel = (e: WheelEvent) => {
      // Only intercept when the visualization is in view
      const now = Date.now();
      if (now - lastWheelTime.current < 800) return;
      
      if (e.deltaY > 0) {
        nextMode();
      } else if (e.deltaY < 0) {
        prevMode();
      }
      lastWheelTime.current = now;
      e.preventDefault();
    };

    const container = document.getElementById("galaxy-container");
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [mounted, nextMode, prevMode]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div style={{ color: "var(--accent-mid)" }} className="animate-pulse text-lg">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div id="galaxy-container" className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene concepts={concepts} />
      </Canvas>
      {/* Mode buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {(["galaxy", "reduction", "timeline"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 cursor-pointer"
            style={{
              background: mode === m ? "rgba(33,131,128,0.2)" : "rgba(255,255,255,0.03)",
              color: mode === m ? "var(--accent-mid)" : "var(--text-muted)",
              border: mode === m ? "1px solid rgba(33,131,128,0.5)" : "1px solid var(--border)",
            }}
          >
            {m === "galaxy" ? "🌌 Galaxy" : m === "reduction" ? "🔬 Clusters" : "📅 Timeline"}
          </button>
        ))}
      </div>
    </div>
  );
}
