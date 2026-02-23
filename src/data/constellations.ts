// Real constellation star patterns (normalized from RA/Dec to ~2 unit bounding boxes)
// Each constellation is offset along a winding 3D path

export interface ConstellationData {
  name: string;
  stars: { x: number; y: number; z: number }[];
  connections: [number, number][];
  offset: { x: number; y: number; z: number };
}

// Real star positions from Hipparcos/BSC catalogs (x = RA in hours, y = Dec in degrees)
// The export mapping centers, scales, and negates x for sky-chart orientation
const rawConstellations: Omit<ConstellationData, "offset">[] = [
  {
    name: "Orion",
    stars: [
      { x: 5.92, y: 7.41, z: 0 },   // Betelgeuse
      { x: 5.42, y: 6.35, z: 0 },   // Bellatrix
      { x: 5.68, y: -1.94, z: 0 },  // Alnitak
      { x: 5.60, y: -1.20, z: 0 },  // Alnilam
      { x: 5.53, y: -0.30, z: 0 },  // Mintaka
      { x: 5.80, y: -9.67, z: 0 },  // Saiph
      { x: 5.24, y: -8.20, z: 0 },  // Rigel
    ],
    connections: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 13.79, y: 49.31, z: 0 }, // Alkaid
      { x: 13.40, y: 54.93, z: 0 }, // Mizar
      { x: 12.90, y: 55.96, z: 0 }, // Alioth
      { x: 12.26, y: 57.03, z: 0 }, // Megrez
      { x: 11.90, y: 53.69, z: 0 }, // Phecda
      { x: 11.03, y: 56.38, z: 0 }, // Merak
      { x: 11.06, y: 61.75, z: 0 }, // Dubhe
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 0.68, y: 56.54, z: 0 },  // Schedar
      { x: 0.15, y: 59.15, z: 0 },  // Caph
      { x: 0.95, y: 60.72, z: 0 },  // Gamma Cas
      { x: 1.36, y: 60.24, z: 0 },  // Ruchbah
      { x: 1.91, y: 63.67, z: 0 },  // Segin
    ],
    connections: [[1, 0], [0, 2], [2, 3], [3, 4]],
  },
  {
    name: "Leo",
    stars: [
      { x: 10.14, y: 11.97, z: 0 }, // Regulus
      { x: 10.12, y: 16.76, z: 0 }, // Eta Leo
      { x: 10.33, y: 19.84, z: 0 }, // Algieba
      { x: 11.24, y: 20.52, z: 0 }, // Zosma
      { x: 11.82, y: 14.57, z: 0 }, // Denebola
      { x: 11.24, y: 15.43, z: 0 }, // Chertan
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 0]],
  },
  {
    name: "Scorpius",
    stars: [
      { x: 16.01, y: -22.62, z: 0 },// Dschubba
      { x: 16.49, y: -26.43, z: 0 },// Antares
      { x: 16.60, y: -28.22, z: 0 },// Tau Sco
      { x: 16.84, y: -34.29, z: 0 },// Epsilon Sco
      { x: 16.86, y: -38.05, z: 0 },// Mu1 Sco
      { x: 17.56, y: -37.10, z: 0 },// Shaula
      { x: 17.51, y: -37.29, z: 0 },// Lesath
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  {
    name: "Cygnus",
    stars: [
      { x: 20.69, y: 45.28, z: 0 }, // Deneb
      { x: 20.37, y: 40.26, z: 0 }, // Sadr
      { x: 19.51, y: 27.96, z: 0 }, // Albireo
      { x: 20.77, y: 33.97, z: 0 }, // Gienah
      { x: 19.75, y: 45.13, z: 0 }, // Delta Cyg
    ],
    connections: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    name: "Gemini",
    stars: [
      { x: 7.58, y: 31.89, z: 0 },  // Castor
      { x: 7.76, y: 28.03, z: 0 },  // Pollux
      { x: 6.63, y: 16.40, z: 0 },  // Alhena
      { x: 6.38, y: 22.51, z: 0 },  // Tejat
      { x: 6.73, y: 25.13, z: 0 },  // Mebsuta
    ],
    connections: [[0, 1], [1, 2], [0, 3], [3, 4]],
  },
  {
    name: "Lyra",
    stars: [
      { x: 18.62, y: 38.78, z: 0 }, // Vega
      { x: 18.83, y: 33.36, z: 0 }, // Sheliak
      { x: 18.98, y: 32.69, z: 0 }, // Sulafat
      { x: 18.91, y: 36.90, z: 0 }, // Delta1 Lyr
      { x: 18.75, y: 37.61, z: 0 }, // Zeta1 Lyr
    ],
    connections: [[0, 1], [0, 2], [1, 2], [0, 4], [4, 3]],
  },
  {
    name: "Aquila",
    stars: [
      { x: 19.85, y: 8.87, z: 0 },  // Altair
      { x: 19.77, y: 10.61, z: 0 }, // Tarazed
      { x: 19.92, y: 6.41, z: 0 },  // Alshain
      { x: 20.19, y: -0.82, z: 0 }, // Theta Aql
    ],
    connections: [[0, 1], [0, 2], [2, 3]],
  },
  {
    name: "Crux",
    stars: [
      { x: 12.52, y: -57.11, z: 0 },// Gacrux
      { x: 12.44, y: -63.10, z: 0 },// Acrux
      { x: 12.80, y: -59.69, z: 0 },// Mimosa
      { x: 12.25, y: -58.75, z: 0 },// Delta Cru
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
