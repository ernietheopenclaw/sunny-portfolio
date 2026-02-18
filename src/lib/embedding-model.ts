"use client";

import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

let extractor: FeatureExtractionPipeline | null = null;
let loading = false;
let loadPromise: Promise<FeatureExtractionPipeline> | null = null;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    if (!loadPromise) {
      loading = true;
      loadPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
        dtype: "fp32",
      }).then((p) => {
        extractor = p as FeatureExtractionPipeline;
        loading = false;
        return extractor;
      });
    }
    extractor = await loadPromise;
  }

  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export function isModelLoading(): boolean {
  return loading;
}
