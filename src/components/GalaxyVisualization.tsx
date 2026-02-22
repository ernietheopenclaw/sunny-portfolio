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
import { useRouter } from "next/navigation";
import { computeClusterPositions } from "@/lib/embeddings";
import { renderLatex } from "@/lib/latex";

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
const GALAXY_SCALE = 0.03;

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

function getTimelinePositions(concepts: Concept[]): Map<string, THREE.Vector3> {
  const sorted = [...concepts].sort(
    (a, b) => new Date(a.date_learned).getTime() - new Date(b.date_learned).getTime()
  );
  const n = sorted.length;
  const spacing = 1.5;
  const startX = -(n - 1) * spacing * 0.5;
  const map = new Map<string, THREE.Vector3>();
  sorted.forEach((c, i) => {
    const x = startX + i * spacing;
    // Pure sin(x) wave
    const amplitude = 1.2;
    const freq = 0.5;
    const y = amplitude * Math.sin(freq * x);
    map.set(c.id, new THREE.Vector3(x, y, 0));
  });
  return map;
}

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
      1.5, 0.4, 0.2
    );
    comp.addPass(bloom);
    comp.addPass(new OutputPass());
    composer.current = comp;
    return () => { comp.dispose(); };
  }, [gl, scene, camera, size]);

  useEffect(() => {
    if (composer.current) composer.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    if (composer.current) composer.current.render();
  }, 1);

  return null;
}

// Galaxy stars with dispersion/gathering animation
function GalaxyStars({ dispersionProgress }: { dispersionProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const hazeRef = useRef<THREE.Points>(null!);

  const { stars, hazeStars, starTexture, disperseDirections, hazeDisperseDirections } = useMemo(() => {
    const allStars = generateGalaxy();
    const s = allStars.filter((st) => !st.isHaze);
    const h = allStars.filter((st) => st.isHaze);
    
    // Pre-compute random disperse directions for each star
    const sDirs = s.map(() => {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      const dist = 15 + Math.random() * 25; // fly far out
      return dir.multiplyScalar(dist);
    });
    const hDirs = h.map(() => {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      const dist = 15 + Math.random() * 25;
      return dir.multiplyScalar(dist);
    });

    return {
      stars: s,
      hazeStars: h,
      starTexture: createStarTexture(),
      disperseDirections: sDirs,
      hazeDisperseDirections: hDirs,
    };
  }, []);

  // Base positions (galaxy shape)
  const { baseStarPositions, starColors, starSizes } = useMemo(() => {
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
    return { baseStarPositions: positions, starColors: colors, starSizes: sizes };
  }, [stars]);

  const { baseHazePositions, hazeColors, hazeSizes } = useMemo(() => {
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
    return { baseHazePositions: positions, hazeColors: colors, hazeSizes: sizes };
  }, [hazeStars]);

  // Animated positions buffer
  const animatedStarPositions = useRef(new Float32Array(baseStarPositions.length));
  const animatedHazePositions = useRef(new Float32Array(baseHazePositions.length));

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
    if (hazeRef.current) {
      hazeRef.current.rotation.y += delta * 0.05;
    }

    // Apply dispersion: lerp from base positions to dispersed positions
    const p = dispersionProgress; // 0 = galaxy, 1 = fully dispersed
    
    // Stars
    const starPos = animatedStarPositions.current;
    for (let i = 0; i < stars.length; i++) {
      const i3 = i * 3;
      const dir = disperseDirections[i];
      starPos[i3] = baseStarPositions[i3] + dir.x * p;
      starPos[i3 + 1] = baseStarPositions[i3 + 1] + dir.y * p;
      starPos[i3 + 2] = baseStarPositions[i3 + 2] + dir.z * p;
    }
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      posAttr.array.set(starPos);
      posAttr.needsUpdate = true;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.9 * (1 - p);
    }

    // Haze
    const hazePos = animatedHazePositions.current;
    for (let i = 0; i < hazeStars.length; i++) {
      const i3 = i * 3;
      const dir = hazeDisperseDirections[i];
      hazePos[i3] = baseHazePositions[i3] + dir.x * p;
      hazePos[i3 + 1] = baseHazePositions[i3 + 1] + dir.y * p;
      hazePos[i3 + 2] = baseHazePositions[i3 + 2] + dir.z * p;
    }
    if (hazeRef.current) {
      const posAttr = hazeRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      posAttr.array.set(hazePos);
      posAttr.needsUpdate = true;
      (hazeRef.current.material as THREE.PointsMaterial).opacity = 0.08 * (1 - p);
    }
  });

  // Initialize animated positions
  useEffect(() => {
    animatedStarPositions.current.set(baseStarPositions);
    animatedHazePositions.current.set(baseHazePositions);
  }, [baseStarPositions, baseHazePositions]);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(baseStarPositions), 3]} />
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
          <bufferAttribute attach="attributes-position" args={[new Float32Array(baseHazePositions), 3]} />
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
  onClick: (concept: Concept) => void;
}

function ConceptDots({ concepts, onHover, onClick }: ConceptDotsProps) {
  const { mode } = useScroll();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const transitionRef = useRef({ progress: 0, currentMode: "galaxy" as string });

  const galaxyPositions = useMemo(() => placeConceptsInGalaxy(concepts), [concepts]);
  const timelinePositions = useMemo(() => getTimelinePositions(concepts), [concepts]);
  const clusterPositions = useMemo(() => computeClusterPositions(concepts), [concepts]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const prevPositions = useRef<THREE.Vector3[]>([]);
  const targetPositions = useRef<THREE.Vector3[]>([]);
  const currentPositions = useRef<THREE.Vector3[]>([]);

  // Ensure position arrays stay in sync with concepts length
  useEffect(() => {
    const len = concepts.length;
    while (prevPositions.current.length < len) prevPositions.current.push(new THREE.Vector3());
    while (targetPositions.current.length < len) targetPositions.current.push(new THREE.Vector3());
    while (currentPositions.current.length < len) currentPositions.current.push(new THREE.Vector3());
    prevPositions.current.length = len;
    targetPositions.current.length = len;
    currentPositions.current.length = len;
  }, [concepts]);

  useEffect(() => {
    if (prevPositions.current.length === 0) return;
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

    const len = Math.min(concepts.length, currentPositions.current.length);
    for (let i = 0; i < len; i++) {
      currentPositions.current[i].lerpVectors(prevPositions.current[i], targetPositions.current[i], ease);
      dummy.position.copy(currentPositions.current[i]);
      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      color.set(STAR_COLORS[i % STAR_COLORS.length]);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  const { camera, raycaster, pointer } = useThree();

  const findNearest = useCallback((): { concept: Concept; pos: THREE.Vector3 } | null => {
    if (!meshRef.current) return null;
    raycaster.setFromCamera(pointer, camera);
    const ray = raycaster.ray;
    const PROXIMITY = 0.5;
    let closest: { concept: Concept; pos: THREE.Vector3; dist: number } | null = null;
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    for (let i = 0; i < concepts.length; i++) {
      meshRef.current.getMatrixAt(i, mat);
      pos.setFromMatrixPosition(mat);
      const dist = ray.distanceToPoint(pos);
      if (dist < PROXIMITY && (!closest || dist < closest.dist)) {
        closest = { concept: concepts[i], pos: pos.clone(), dist };
      }
    }
    return closest;
  }, [concepts, camera, raycaster, pointer]);

  const handlePointerMove = useCallback(() => {
    const result = findNearest();
    if (result) {
      onHover(result.concept, result.pos);
    } else {
      onHover(null, null);
    }
  }, [findNearest, onHover]);

  const handleClick = useCallback(() => {
    const result = findNearest();
    if (result) {
      onClick(result.concept);
    }
  }, [findNearest, onClick]);

  return (
    <group onPointerMove={handlePointerMove} onClick={handleClick}>
      {/* Invisible large plane to capture pointer events across the whole scene */}
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
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
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }} dangerouslySetInnerHTML={{ __html: renderLatex(concept.short_summary) }} />
        {concept.date_learned && (
          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", opacity: 0.7 }}>
            Added: {new Date(concept.date_learned).toLocaleDateString()}
          </p>
        )}
      </div>
    </Html>
  );
}

// Dispersion controller — drives the dispersion progress inside the Canvas
function DispersionController({ dispersionRef }: { dispersionRef: React.MutableRefObject<{ target: number; current: number }> }) {
  useFrame((_, delta) => {
    const d = dispersionRef.current;
    const speed = 1.2; // ~1-1.5s transition
    if (d.current < d.target) {
      d.current = Math.min(d.current + delta * speed, d.target);
    } else if (d.current > d.target) {
      d.current = Math.max(d.current - delta * speed, d.target);
    }
  });
  return null;
}

// Zoom by holding right mouse button and dragging up/down
function RightClickZoom() {
  const { camera, gl } = useThree();
  const state = useRef({ active: false, lastY: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const onDown = (e: MouseEvent) => {
      if (e.button === 2) {
        state.current.active = true;
        state.current.lastY = e.clientY;
        e.preventDefault();
      }
    };

    const onUp = (e: MouseEvent) => {
      if (e.button === 2) {
        state.current.active = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!state.current.active) return;
      const dy = e.clientY - state.current.lastY;
      state.current.lastY = e.clientY;
      const zoomSpeed = 0.03;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.addScaledVector(direction, -dy * zoomSpeed);
    };

    const onContext = (e: Event) => {
      e.preventDefault();
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("contextmenu", onContext);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("contextmenu", onContext);
    };
  }, [camera, gl]);

  return null;
}

function Scene({ concepts, dispersionRef, onConceptClick }: { concepts: Concept[]; dispersionRef: React.MutableRefObject<{ target: number; current: number }>; onConceptClick: (concept: Concept) => void }) {
  const [hovered, setHovered] = useState<Concept | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const { mode } = useScroll();
  const [dispersionProgress, setDispersionProgress] = useState(0);

  const handleHover = useCallback((concept: Concept | null, pos: THREE.Vector3 | null) => {
    setHovered(concept);
    setHoveredPos(pos);
  }, []);

  // Read dispersion progress each frame
  useFrame(() => {
    setDispersionProgress(dispersionRef.current.current);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <group visible={dispersionProgress < 0.99}>
        <group>
          <GalaxyStars dispersionProgress={dispersionProgress} />
        </group>
      </group>
      <ConceptDots concepts={concepts} onHover={handleHover} onClick={onConceptClick} />
      <Tooltip concept={hovered} position={hoveredPos} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={mode === "galaxy"}
        autoRotateSpeed={0.3}
        mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: undefined as unknown as THREE.MOUSE, RIGHT: undefined as unknown as THREE.MOUSE }}
      />
      <RightClickZoom />
      <Bloom />
      <DispersionController dispersionRef={dispersionRef} />
    </>
  );
}

interface Props {
  concepts: Concept[];
  onReady?: () => void;
}

export default function GalaxyVisualization({ concepts, onReady }: Props) {
  const { mode, nextMode, prevMode, setMode, pastVisualization, setPastVisualization } = useScroll();
  const [mounted, setMounted] = useState(false);
  const lastWheelTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispersionRef = useRef({ target: 0, current: 0 });
  const router = useRouter();

  const handleConceptClick = useCallback((concept: Concept) => {
    router.push(`/concept/${concept.id}`);
  }, [router]);

  useEffect(() => setMounted(true), []);

  // Drive dispersion target based on mode
  useEffect(() => {
    dispersionRef.current.target = mode === "galaxy" ? 0 : 1;
  }, [mode]);

  // Track whether we're in a scroll transition to prevent re-entrant triggers
  const isTransitioning = useRef(false);

  // Helper: snap to a scroll position and lock during animation
  const snapTo = useCallback((top: number, onDone?: () => void) => {
    isTransitioning.current = true;
    window.scrollTo({ top, behavior: "smooth" });
    // Listen for scroll end (scrollend event with fallback timeout)
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      isTransitioning.current = false;
      onDone?.();
    };
    window.addEventListener("scrollend", finish, { once: true });
    // Fallback: release after 800ms in case scrollend doesn't fire (Safari)
    setTimeout(finish, 800);
  }, []);

  // Snap-back: when scrolling up and viz becomes partially visible, snap to top
  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    let lastY = window.scrollY;
    const handleScroll = () => {
      if (isTransitioning.current) return;

      const currentY = window.scrollY;
      const scrollingUp = currentY < lastY;
      lastY = currentY;

      if (!pastVisualization || !scrollingUp) return;

      const rect = container.getBoundingClientRect();
      // If any part of the viz is visible while scrolling up, snap back to it
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        setPastVisualization(false);
        setMode("timeline");
        snapTo(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, pastVisualization, setPastVisualization, setMode, snapTo]);

  // Stuck-in-between fix: if page is idle at a position between galaxy and content, resolve it
  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const checkStuck = () => {
      if (isTransitioning.current) return;
      const rect = container.getBoundingClientRect();
      const scrollY = window.scrollY;
      // "Stuck" = scrolled past top of viz but not fully past it (in the dead zone)
      if (scrollY > 0 && rect.bottom > 0 && rect.top < 0 && !pastVisualization) {
        // Snap to content below
        setPastVisualization(true);
        snapTo(rect.height + scrollY);
      }
    };

    const handleScrollEnd = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(checkStuck, 150);
    };

    window.addEventListener("scroll", handleScrollEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollEnd);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [mounted, pastVisualization, setPastVisualization, snapTo]);

  // Global scroll lock: intercept wheel events on the whole page
  useEffect(() => {
    if (!mounted) return;

    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Block all wheel events during transitions
      if (isTransitioning.current) { e.preventDefault(); return; }

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Check if visualization section is in view (at least partially)
      const vizInView = rect.top < viewportH && rect.bottom > 0;

      // If we're past the visualization, allow normal scroll in both directions
      // (snap-back is handled by the scroll listener above)
      if (pastVisualization) {
        return;
      }

      // If visualization is in view and not past it, lock scroll
      if (vizInView && !pastVisualization) {
        e.preventDefault();

        const now = Date.now();
        if (now - lastWheelTime.current < 800) return;
        lastWheelTime.current = now;

        if (e.deltaY > 0) {
          // Scrolling down
          if (mode === "timeline") {
            // Already at last mode, scroll past visualization
            setPastVisualization(true);
            snapTo(rect.height + window.scrollY);
          } else {
            nextMode();
          }
        } else if (e.deltaY < 0) {
          // Scrolling up — if at galaxy (first mode), allow normal page scroll
          if (mode === "galaxy") {
            return;
          }
          prevMode();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [mounted, mode, nextMode, prevMode, pastVisualization, setPastVisualization, snapTo]);

  // Reset pastVisualization when mode changes back from timeline
  useEffect(() => {
    if (mode !== "timeline") {
      setPastVisualization(false);
    }
  }, [mode, setPastVisualization]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div style={{ color: "var(--accent-mid)" }} className="animate-pulse text-lg">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} id="galaxy-container" className="w-full h-screen relative">
      {/* Dedication quote */}
      <div className="absolute top-20 left-6 z-10 pointer-events-none" style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.6, maxWidth: "280px", lineHeight: 1.5 }}>
        Dedicated to the bright lights that have guided me through wayward roads and tumultuous seas
      </div>
      {/* Mode title overlay */}
      <div className="absolute top-20 right-6 z-10 pointer-events-none text-right" style={{ transition: "opacity 0.6s ease" }}>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{
            color: "var(--accent-mid)",
            opacity: 0.85,
            transition: "opacity 0.5s ease",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          {mode === "galaxy" ? "Galaxy" : mode === "reduction" ? "Clusters" : "Timeline"}
        </h2>
        <p
          className="text-sm mt-1"
          style={{
            color: "var(--text-muted)",
            opacity: 0.7,
            maxWidth: "280px",
            marginLeft: "auto",
            transition: "opacity 0.5s ease",
          }}
        >
          {mode === "galaxy"
            ? "Each star is a concept — scroll to explore"
            : mode === "reduction"
            ? "Concepts clustered by semantic similarity"
            : "Concepts arranged chronologically"}
        </p>
      </div>
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => { if (onReady) onReady(); }}
      >
        <Scene concepts={concepts} dispersionRef={dispersionRef} onConceptClick={handleConceptClick} />
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
