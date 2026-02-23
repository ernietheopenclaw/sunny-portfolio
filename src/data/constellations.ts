// Real constellation star patterns (normalized from RA/Dec to ~2 unit bounding boxes)
// Each constellation is offset along a winding 3D path

export interface ConstellationData {
  name: string;
  stars: { x: number; y: number; z: number }[];
  connections: [number, number][];
  offset: { x: number; y: number; z: number };
}

// Normalized star positions derived from actual RA/Dec patterns
const rawConstellations: Omit<ConstellationData, "offset">[] = [
  {
    name: "Orion",
    stars: [
      { x: 0.0, y: 2.0, z: 0 },    // Betelgeuse
      { x: 1.6, y: 2.0, z: 0 },     // Bellatrix
      { x: 0.5, y: 1.0, z: 0 },     // Alnitak
      { x: 0.8, y: 1.05, z: 0 },    // Alnilam
      { x: 1.1, y: 1.1, z: 0 },     // Mintaka
      { x: 0.2, y: 0.0, z: 0 },     // Saiph
      { x: 1.5, y: 0.0, z: 0 },     // Rigel
    ],
    connections: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1]],
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 0.0, y: 0.0, z: 0 },     // Alkaid
      { x: 0.5, y: 0.3, z: 0 },     // Mizar
      { x: 1.0, y: 0.2, z: 0 },     // Alioth
      { x: 1.5, y: 0.4, z: 0 },     // Megrez
      { x: 1.8, y: 0.0, z: 0 },     // Phecda
      { x: 2.0, y: 0.8, z: 0 },     // Merak
      { x: 1.5, y: 1.0, z: 0 },     // Dubhe
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 0.0, y: 0.0, z: 0 },
      { x: 0.6, y: 0.8, z: 0 },
      { x: 1.2, y: 0.3, z: 0 },
      { x: 1.8, y: 0.9, z: 0 },
      { x: 2.2, y: 0.2, z: 0 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: "Leo",
    stars: [
      { x: 0.0, y: 1.2, z: 0 },     // Regulus
      { x: 0.3, y: 1.8, z: 0 },     // Eta Leo
      { x: 0.8, y: 2.0, z: 0 },     // Algieba
      { x: 1.2, y: 1.6, z: 0 },     // Zosma
      { x: 1.8, y: 1.5, z: 0 },     // Denebola
      { x: 0.6, y: 0.8, z: 0 },     // Chertan
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 0]],
  },
  {
    name: "Scorpius",
    stars: [
      { x: 0.0, y: 2.0, z: 0 },     // Dschubba
      { x: 0.2, y: 1.5, z: 0 },     // Antares
      { x: 0.5, y: 1.0, z: 0 },
      { x: 0.8, y: 0.6, z: 0 },
      { x: 1.2, y: 0.3, z: 0 },
      { x: 1.6, y: 0.2, z: 0 },     // Shaula
      { x: 1.8, y: 0.5, z: 0 },     // Lesath
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  {
    name: "Cygnus",
    stars: [
      { x: 1.0, y: 2.0, z: 0 },     // Deneb
      { x: 1.0, y: 1.2, z: 0 },     // Sadr
      { x: 1.0, y: 0.0, z: 0 },     // Albireo
      { x: 0.0, y: 1.0, z: 0 },     // wing
      { x: 2.0, y: 1.0, z: 0 },     // wing
    ],
    connections: [[0, 1], [1, 2], [3, 1], [1, 4]],
  },
  {
    name: "Gemini",
    stars: [
      { x: 0.0, y: 2.0, z: 0 },     // Castor
      { x: 0.3, y: 1.8, z: 0 },     // Pollux
      { x: 0.0, y: 0.8, z: 0 },
      { x: 0.4, y: 0.5, z: 0 },
      { x: 0.1, y: 0.0, z: 0 },
    ],
    connections: [[0, 2], [2, 4], [1, 3], [3, 4]],
  },
  {
    name: "Lyra",
    stars: [
      { x: 0.5, y: 1.8, z: 0 },     // Vega
      { x: 0.0, y: 1.0, z: 0 },
      { x: 1.0, y: 1.0, z: 0 },
      { x: 0.1, y: 0.3, z: 0 },
      { x: 0.9, y: 0.3, z: 0 },
    ],
    connections: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]],
  },
  {
    name: "Aquila",
    stars: [
      { x: 0.5, y: 1.5, z: 0 },     // Altair
      { x: 0.0, y: 0.8, z: 0 },     // Tarazed
      { x: 1.0, y: 0.8, z: 0 },     // Alshain
      { x: 0.5, y: 0.0, z: 0 },
    ],
    connections: [[0, 1], [0, 2], [1, 3], [2, 3]],
  },
  {
    name: "Crux",
    stars: [
      { x: 0.5, y: 1.5, z: 0 },     // Gacrux (top)
      { x: 0.5, y: 0.0, z: 0 },     // Acrux (bottom)
      { x: 0.0, y: 0.7, z: 0 },     // left
      { x: 1.0, y: 0.7, z: 0 },     // right
    ],
    connections: [[0, 1], [2, 3]],
  },
];

// Place constellations along a winding 3D path
const pathRadius = 4;
export const constellations: ConstellationData[] = rawConstellations.map((c, i) => {
  const t = i / (rawConstellations.length - 1); // 0 to 1
  const angle = t * Math.PI * 1.8; // ~324 degrees of winding
  
  // Center each constellation's stars around origin first
  const xs = c.stars.map(s => s.x);
  const ys = c.stars.map(s => s.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  
  // Scale to fit ~1 unit radius
  const rangeX = Math.max(...xs) - Math.min(...xs) || 1;
  const rangeY = Math.max(...ys) - Math.min(...ys) || 1;
  const scale = 1.2 / Math.max(rangeX, rangeY);
  
  return {
    name: c.name,
    stars: c.stars.map(s => ({
      x: -(s.x - cx) * scale,  // negate x to match sky-chart orientation (RA increases leftward)
      y: (s.y - cy) * scale,
      z: (s.z) * scale,
    })),
    connections: c.connections,
    offset: {
      x: Math.cos(angle) * pathRadius * (0.5 + t * 0.5),
      y: Math.sin(angle * 0.7) * 1.5,
      z: Math.sin(angle) * pathRadius * (0.5 + t * 0.5),
    },
  };
});
