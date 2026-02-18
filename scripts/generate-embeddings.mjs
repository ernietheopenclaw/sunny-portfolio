// Generate embeddings for mock concepts using @huggingface/transformers
import { pipeline } from "@huggingface/transformers";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mock concepts - copied from src/data/mock.ts
const mockConcepts = [
  { id: "1", name: "Neural Networks", short_summary: "Computational models inspired by biological neural networks that learn patterns from data.", long_summary: "Neural networks are a class of machine learning algorithms modeled after the human brain. They consist of interconnected nodes (neurons) organized in layers that process information using connectionist approaches. Through training on data, they adjust connection weights to minimize prediction errors, enabling tasks like image recognition, language processing, and decision making." },
  { id: "2", name: "Transformer Architecture", short_summary: "Self-attention based architecture that revolutionized NLP and beyond.", long_summary: "The Transformer architecture, introduced in 'Attention Is All You Need' (2017), uses self-attention mechanisms to process sequences in parallel rather than sequentially. It consists of encoder and decoder stacks with multi-head attention, enabling models like GPT, BERT, and Claude to understand and generate human language with unprecedented quality." },
  { id: "3", name: "React Hooks", short_summary: "Functions that let you use state and lifecycle features in functional components.", long_summary: "React Hooks, introduced in React 16.8, allow functional components to manage state (useState), side effects (useEffect), context (useContext), and more without writing class components. Custom hooks enable reusable stateful logic extraction, leading to cleaner, more composable React code." },
  { id: "4", name: "WebGL Rendering", short_summary: "Low-level graphics API for rendering 2D and 3D graphics in web browsers.", long_summary: "WebGL (Web Graphics Library) is a JavaScript API for rendering high-performance 2D and 3D graphics within web browsers without plugins. It's based on OpenGL ES and provides direct GPU access, enabling complex visualizations, games, and interactive experiences on the web. Three.js and other libraries abstract its complexity." },
  { id: "5", name: "Dimensionality Reduction", short_summary: "Techniques for reducing high-dimensional data to fewer dimensions while preserving structure.", long_summary: "Dimensionality reduction encompasses techniques like PCA, t-SNE, and UMAP that project high-dimensional data into lower dimensions for visualization and analysis. These methods preserve important structural relationships—distances, clusters, or manifold geometry—making complex datasets interpretable while reducing computational requirements." },
  { id: "6", name: "TypeScript Generics", short_summary: "Type variables that enable creating reusable, type-safe components and functions.", long_summary: "TypeScript generics allow developers to write functions, classes, and interfaces that work with multiple types while maintaining type safety. Using type parameters like <T>, you can create flexible, reusable code that adapts to different data types at compile time, reducing duplication and catching errors early." },
  { id: "7", name: "Embedding Spaces", short_summary: "Dense vector representations where semantic similarity maps to geometric proximity.", long_summary: "Embedding spaces are learned vector representations where items (words, images, concepts) are mapped to dense numerical vectors. Semantically similar items end up close together in this space. This enables similarity search, clustering, and analogical reasoning. Models like Word2Vec, BERT, and CLIP create powerful embedding spaces used across ML applications." },
  { id: "8", name: "Supabase Auth", short_summary: "Open-source authentication system with row-level security and social login support.", long_summary: "Supabase Auth provides a complete authentication system built on top of PostgreSQL. It supports email/password, magic links, social OAuth providers, and phone authentication. Combined with Row Level Security (RLS) policies, it enables fine-grained access control directly at the database level." },
  { id: "9", name: "Framer Motion", short_summary: "Production-ready motion library for React with declarative animations.", long_summary: "Framer Motion is a React animation library that provides a declarative API for creating fluid animations and gestures. It supports layout animations, shared layout transitions, scroll-based animations, and physics-based spring animations. Its motion components make complex animations accessible through simple props." },
  { id: "10", name: "Attention Mechanisms", short_summary: "Neural network components that learn to focus on relevant parts of input data.", long_summary: "Attention mechanisms allow neural networks to dynamically focus on different parts of input when producing output. Self-attention computes relationships between all positions in a sequence, while cross-attention relates two different sequences. These mechanisms are foundational to transformers and have dramatically improved performance across NLP, vision, and multimodal tasks." },
  { id: "11", name: "Next.js App Router", short_summary: "File-based routing system with React Server Components and nested layouts.", long_summary: "Next.js App Router is a modern routing paradigm that leverages React Server Components by default. It uses a file-system based router with folders defining routes, and special files (layout.tsx, page.tsx, loading.tsx) for UI organization. It supports nested layouts, streaming, and server actions for a full-stack React experience." },
  { id: "12", name: "Reinforcement Learning", short_summary: "Learning paradigm where agents learn optimal behavior through trial, error, and rewards.", long_summary: "Reinforcement Learning (RL) trains agents to make sequential decisions by maximizing cumulative rewards. Through exploration and exploitation, agents learn policies mapping states to actions. Key concepts include value functions, policy gradients, and temporal difference learning. RL powers game-playing AIs, robotics, and recommendation systems." },
  { id: "13", name: "Three.js Scene Graph", short_summary: "Hierarchical structure organizing 3D objects, lights, and cameras for rendering.", long_summary: "The Three.js scene graph is a tree structure where the Scene object is the root, containing meshes, lights, cameras, and groups as children. Each object has position, rotation, and scale relative to its parent. This hierarchy enables complex 3D compositions, transformations, and efficient rendering through frustum culling and level-of-detail management." },
  { id: "14", name: "Vector Databases", short_summary: "Databases optimized for storing and querying high-dimensional vector embeddings.", long_summary: "Vector databases are specialized systems designed to store, index, and search high-dimensional vector embeddings efficiently. Using algorithms like HNSW, IVF, and product quantization, they enable fast approximate nearest neighbor searches. Tools like Pinecone, Weaviate, and pgvector power semantic search, recommendation engines, and RAG applications." },
  { id: "15", name: "CSS Container Queries", short_summary: "Style elements based on their container size rather than viewport size.", long_summary: "CSS Container Queries allow components to adapt their styling based on the size of their containing element rather than the viewport. This enables truly modular, responsive components that work correctly regardless of where they're placed in a layout. Combined with container query units (cqw, cqh), they represent a paradigm shift in responsive design." },
];

async function main() {
  console.log("Loading embedding model (all-MiniLM-L6-v2)...");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const embeddings = {};

  for (const concept of mockConcepts) {
    const text = concept.short_summary + " " + concept.long_summary;
    console.log(`Embedding: ${concept.name}...`);
    const output = await extractor(text, { pooling: "mean", normalize: true });
    embeddings[concept.id] = Array.from(output.data);
  }

  const outPath = join(__dirname, "..", "src", "data", "embeddings.json");
  writeFileSync(outPath, JSON.stringify(embeddings, null, 2));
  console.log(`Wrote embeddings to ${outPath}`);
  console.log(`Embedding dimension: ${Object.values(embeddings)[0].length}`);
}

main().catch(console.error);
