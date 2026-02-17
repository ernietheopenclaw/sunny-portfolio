"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Concept } from "@/types";
import { useScroll } from "@/lib/scroll";

// Generate filler dots to pad the galaxy
function generateFillerDots(count: number): Concept[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `filler-${i}`,
    name: "",
    short_summary: "",
    long_summary: "",
    x: (Math.random() - 0.5) * 12,
    y: (Math.random() - 0.5) * 12,
    z: (Math.random() - 0.5) * 12,
    date_learned: "",
    isFiller: true,
  }));
}

// Timeline positions: spread concepts along X axis by date
function getTimelinePositions(concepts: Concept[]): THREE.Vector3[] {
  const sorted = [...concepts].sort(
    (a, b) => new Date(a.date_learned).getTime() - new Date(b.date_learned).getTime()
  );
  const spacing = 1.5;
  const startX = -(sorted.length - 1) * spacing * 0.5;
  return sorted.map((_, i) => new THREE.Vector3(startX + i * spacing, 0, 0));
}

interface ConceptDotsProps {
  concepts: Concept[];
  fillers: Concept[];
  onHover: (concept: Concept | null, pos: THREE.Vector3 | null) => void;
  onClick: (concept: Concept | null) => void;
}

function ConceptDots({ concepts, fillers, onHover, onClick }: ConceptDotsProps) {
  const { scrollProgress, mode } = useScroll();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const fillerRef = useRef<THREE.InstancedMesh>(null!);
  const timeRef = useRef(0);

  const allConcepts = concepts;
  const timelinePositions = useMemo(() => getTimelinePositions(concepts), [concepts]);

  // Sort concepts by date for timeline mapping
  const sortedIndices = useMemo(() => {
    const indexed = concepts.map((c, i) => ({ c, i }));
    indexed.sort(
      (a, b) => new Date(a.c.date_learned).getTime() - new Date(b.c.date_learned).getTime()
    );
    // Map from sorted position -> original index
    const map = new Map<number, number>();
    indexed.forEach((item, sortIdx) => map.set(item.i, sortIdx));
    return map;
  }, [concepts]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!meshRef.current) return;

    const t = timeRef.current;
    // Galaxy -> Reduction blend at 0-0.33, Reduction -> Timeline at 0.33-0.66
    const reductionBlend = Math.min(scrollProgress / 0.33, 1);
    const timelineBlend = Math.max(0, Math.min((scrollProgress - 0.33) / 0.33, 1));

    for (let i = 0; i < allConcepts.length; i++) {
      const c = allConcepts[i];
      const sortedIdx = sortedIndices.get(i) ?? i;

      // Galaxy position: spiral rotation
      const galaxyAngle = Math.atan2(c.z, c.x) + t * 0.1;
      const galaxyRadius = Math.sqrt(c.x * c.x + c.z * c.z);
      const galaxyX = Math.cos(galaxyAngle) * galaxyRadius;
      const galaxyY = c.y + Math.sin(t * 0.5 + i) * 0.05;
      const galaxyZ = Math.sin(galaxyAngle) * galaxyRadius;

      // Reduction position (the stored x,y,z)
      const redX = c.x;
      const redY = c.y;
      const redZ = c.z;

      // Timeline position
      const tlPos = timelinePositions[sortedIdx] || new THREE.Vector3();

      // Blend galaxy -> reduction
      let x = THREE.MathUtils.lerp(galaxyX, redX, reductionBlend);
      let y = THREE.MathUtils.lerp(galaxyY, redY, reductionBlend);
      let z = THREE.MathUtils.lerp(galaxyZ, redZ, reductionBlend);

      // Blend reduction -> timeline
      x = THREE.MathUtils.lerp(x, tlPos.x, timelineBlend);
      y = THREE.MathUtils.lerp(y, tlPos.y, timelineBlend);
      z = THREE.MathUtils.lerp(z, tlPos.z, timelineBlend);

      dummy.position.set(x, y, z);
      const pulse = 1 + Math.sin(t * 2 + i * 0.5) * 0.1;
      dummy.scale.setScalar(0.08 * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color: electric blue/cyan/purple
      const hue = 0.55 + Math.sin(i * 0.3) * 0.08;
      color.setHSL(hue, 0.9, 0.65);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Filler dots
    if (fillerRef.current) {
      // Fade out fillers as we scroll past galaxy mode
      const fillerScale = Math.max(0, 1 - reductionBlend * 2);
      for (let i = 0; i < fillers.length; i++) {
        const f = fillers[i];
        const angle = Math.atan2(f.z, f.x) + t * 0.08;
        const radius = Math.sqrt(f.x * f.x + f.z * f.z);
        // Fillers disperse outward during transition
        const disperse = 1 + reductionBlend * 3;
        dummy.position.set(
          Math.cos(angle) * radius * disperse,
          f.y * disperse + Math.sin(t * 0.3 + i * 0.2) * 0.03,
          Math.sin(angle) * radius * disperse
        );
        dummy.scale.setScalar(0.04 * fillerScale);
        dummy.updateMatrix();
        fillerRef.current.setMatrixAt(i, dummy.matrix);
        color.setHSL(0.6, 0.3, 0.35);
        fillerRef.current.setColorAt(i, color);
      }
      fillerRef.current.instanceMatrix.needsUpdate = true;
      if (fillerRef.current.instanceColor) fillerRef.current.instanceColor.needsUpdate = true;
    }
  });

  const { camera, raycaster, pointer } = useThree();

  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      if (!meshRef.current) return;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        const idx = intersects[0].instanceId;
        if (idx < allConcepts.length) {
          const pos = new THREE.Vector3();
          const mat = new THREE.Matrix4();
          meshRef.current.getMatrixAt(idx, mat);
          pos.setFromMatrixPosition(mat);
          onHover(allConcepts[idx], pos);
          return;
        }
      }
      onHover(null, null);
    },
    [allConcepts, camera, raycaster, pointer, onHover]
  );

  const handleClick = useCallback(() => {
    if (!meshRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
      const idx = intersects[0].instanceId;
      if (idx < allConcepts.length) {
        onClick(allConcepts[idx]);
        return;
      }
    }
    onClick(null);
  }, [allConcepts, camera, raycaster, pointer, onClick]);

  return (
    <group onPointerMove={handlePointerMove} onClick={handleClick}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, allConcepts.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial emissive="#4488ff" emissiveIntensity={0.5} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={fillerRef} args={[undefined, undefined, fillers.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          emissive="#334466"
          emissiveIntensity={0.2}
          toneMapped={false}
          transparent
          opacity={0.6}
        />
      </instancedMesh>
    </group>
  );
}

function Tooltip({
  concept,
  position,
}: {
  concept: Concept | null;
  position: THREE.Vector3 | null;
}) {
  if (!concept || !position) return null;
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl border border-cyan-500/30 max-w-xs whitespace-nowrap">
        <p className="font-bold text-cyan-400 text-sm">{concept.name}</p>
        <p className="text-xs text-gray-300 mt-1 whitespace-normal">{concept.short_summary}</p>
        {concept.date_learned && (
          <p className="text-[10px] text-gray-500 mt-1">
            Learned: {new Date(concept.date_learned).toLocaleDateString()}
          </p>
        )}
      </div>
    </Html>
  );
}

function Scene({ concepts }: { concepts: Concept[] }) {
  const [hovered, setHovered] = useState<Concept | null>(null);
  const [hoveredPos, setHoveredPos] = useState<THREE.Vector3 | null>(null);
  const [, setSelected] = useState<Concept | null>(null);

  const fillers = useMemo(() => generateFillerDots(200), []);

  const handleHover = useCallback((concept: Concept | null, pos: THREE.Vector3 | null) => {
    setHovered(concept);
    setHoveredPos(pos);
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#88ccff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#aa66ff" />
      <ConceptDots
        concepts={concepts}
        fillers={fillers}
        onHover={handleHover}
        onClick={setSelected}
      />
      <Tooltip concept={hovered} position={hoveredPos} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxDistance={20}
        minDistance={3}
      />
    </>
  );
}

interface Props {
  concepts: Concept[];
}

export default function GalaxyVisualization({ concepts }: Props) {
  const { mode } = useScroll();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse text-lg">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen sticky top-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene concepts={concepts} />
      </Canvas>
      {/* Mode indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {(["galaxy", "reduction", "timeline"] as const).map((m) => (
          <div
            key={m}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-500 ${
              mode === m
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "bg-gray-800/50 text-gray-500 border border-gray-700/30"
            }`}
          >
            {m === "galaxy" ? "🌌 Galaxy" : m === "reduction" ? "🔬 Clusters" : "📅 Timeline"}
          </div>
        ))}
      </div>
    </div>
  );
}
