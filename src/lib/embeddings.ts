import { UMAP } from "umap-js";
import * as THREE from "three";
import { Concept } from "@/types";
import mockEmbeddings from "@/data/embeddings.json";

/**
 * Compute UMAP 3D positions from concept embeddings.
 * Falls back to concept x/y/z for any concept without an embedding.
 */
export function computeClusterPositions(
  concepts: Concept[]
): Map<string, THREE.Vector3> {
  const map = new Map<string, THREE.Vector3>();

  // Collect concepts that have embeddings
  const withEmbedding: { id: string; embedding: number[] }[] = [];
  const withoutEmbedding: { id: string; x: number; y: number; z: number }[] = [];

  for (const c of concepts) {
    const emb =
      c.embedding ??
      (mockEmbeddings as Record<string, number[]>)[c.id] ??
      null;
    if (emb) {
      withEmbedding.push({ id: c.id, embedding: emb });
    } else {
      withoutEmbedding.push({ id: c.id, x: c.x, y: c.y, z: c.z });
    }
  }

  // If fewer than 2 concepts have embeddings, fall back entirely
  if (withEmbedding.length < 2) {
    for (const c of concepts) {
      map.set(c.id, new THREE.Vector3(c.x, c.y, c.z));
    }
    return map;
  }

  // Run UMAP
  const data = withEmbedding.map((c) => c.embedding);
  const nNeighbors = Math.min(5, withEmbedding.length - 1);

  const umap = new UMAP({
    nComponents: 3,
    nNeighbors,
    minDist: 0.3,
    spread: 1.5,
  });

  const projected = umap.fit(data);

  // Find min/max for scaling to [-3, 3]
  const mins = [Infinity, Infinity, Infinity];
  const maxs = [-Infinity, -Infinity, -Infinity];
  for (const row of projected) {
    for (let d = 0; d < 3; d++) {
      if (row[d] < mins[d]) mins[d] = row[d];
      if (row[d] > maxs[d]) maxs[d] = row[d];
    }
  }

  const scale = (val: number, dim: number) => {
    const range = maxs[dim] - mins[dim];
    if (range === 0) return 0;
    return ((val - mins[dim]) / range) * 6 - 3; // map to [-3, 3]
  };

  for (let i = 0; i < withEmbedding.length; i++) {
    const row = projected[i];
    map.set(
      withEmbedding[i].id,
      new THREE.Vector3(scale(row[0], 0), scale(row[1], 1), scale(row[2], 2))
    );
  }

  // Concepts without embeddings keep their original positions
  for (const c of withoutEmbedding) {
    map.set(c.id, new THREE.Vector3(c.x, c.y, c.z));
  }

  return map;
}
