import { pipeline } from "@huggingface/transformers";
import { readFileSync, writeFileSync } from "fs";

const mockPath = new URL("../src/data/mock.ts", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// Parse mock concepts from the TS file
const mockContent = readFileSync(mockPath, "utf-8");
const conceptRegex = /\{\s*id:\s*"(\d+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?short_summary:\s*"([^"]+)"[\s\S]*?long_summary:\s*"([^"]+)"/g;

const concepts = [];
let match;
while ((match = conceptRegex.exec(mockContent)) !== null) {
  concepts.push({
    id: match[1],
    name: match[2],
    text: match[2] + ". " + match[3] + " " + match[4],
  });
}

console.log(`Found ${concepts.length} concepts`);

const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32" });

const embeddings = {};
for (const c of concepts) {
  console.log(`Embedding: ${c.name}`);
  const output = await extractor(c.text, { pooling: "mean", normalize: true });
  embeddings[c.id] = Array.from(output.data);
}

const outPath = new URL("../src/data/embeddings.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
writeFileSync(outPath, JSON.stringify(embeddings, null, 2));
console.log(`Wrote embeddings to ${outPath}`);
