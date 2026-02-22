import { Concept, Project, Skill, Post } from "@/types";

export const mockConcepts: Concept[] = [
  {
    id: "1",
    name: "Neural Networks",
    short_summary: "Computational models inspired by biological neural networks that learn patterns from data.",
    long_summary: "Neural networks are a class of machine learning algorithms modeled after the human brain. They consist of interconnected nodes (neurons) organized in layers that process information using connectionist approaches. Through training on data, they adjust connection weights to minimize prediction errors, enabling tasks like image recognition, language processing, and decision making.",
    x: -2.1, y: 1.5, z: 0.8,
    date_learned: "2024-01-15",
  },
  {
    id: "2",
    name: "Transformer Architecture",
    short_summary: "Self-attention based architecture that revolutionized NLP and beyond.",
    long_summary: "The Transformer architecture, introduced in 'Attention Is All You Need' (2017), uses self-attention mechanisms to process sequences in parallel rather than sequentially. It consists of encoder and decoder stacks with multi-head attention, enabling models like GPT, BERT, and Claude to understand and generate human language with unprecedented quality.",
    x: -1.8, y: 1.2, z: 1.1,
    date_learned: "2024-02-20",
  },
  {
    id: "3",
    name: "React Hooks",
    short_summary: "Functions that let you use state and lifecycle features in functional components.",
    long_summary: "React Hooks, introduced in React 16.8, allow functional components to manage state (useState), side effects (useEffect), context (useContext), and more without writing class components. Custom hooks enable reusable stateful logic extraction, leading to cleaner, more composable React code.",
    x: 2.5, y: -0.5, z: -1.2,
    date_learned: "2024-03-10",
  },
  {
    id: "4",
    name: "WebGL Rendering",
    short_summary: "Low-level graphics API for rendering 2D and 3D graphics in web browsers.",
    long_summary: "WebGL (Web Graphics Library) is a JavaScript API for rendering high-performance 2D and 3D graphics within web browsers without plugins. It's based on OpenGL ES and provides direct GPU access, enabling complex visualizations, games, and interactive experiences on the web. Three.js and other libraries abstract its complexity.",
    x: 3.0, y: 0.2, z: -0.8,
    date_learned: "2024-03-25",
  },
  {
    id: "5",
    name: "Dimensionality Reduction",
    short_summary: "Techniques for reducing high-dimensional data to fewer dimensions while preserving structure.",
    long_summary: "Dimensionality reduction encompasses techniques like PCA, t-SNE, and UMAP that project high-dimensional data into lower dimensions for visualization and analysis. These methods preserve important structural relationships—distances, clusters, or manifold geometry—making complex datasets interpretable while reducing computational requirements.",
    x: -1.5, y: 2.0, z: -0.3,
    date_learned: "2024-04-05",
  },
  {
    id: "6",
    name: "TypeScript Generics",
    short_summary: "Type variables that enable creating reusable, type-safe components and functions.",
    long_summary: "TypeScript generics allow developers to write functions, classes, and interfaces that work with multiple types while maintaining type safety. Using type parameters like <T>, you can create flexible, reusable code that adapts to different data types at compile time, reducing duplication and catching errors early.",
    x: 2.8, y: -0.8, z: -1.5,
    date_learned: "2024-04-18",
  },
  {
    id: "7",
    name: "Embedding Spaces",
    short_summary: "Dense vector representations where semantic similarity maps to geometric proximity.",
    long_summary: "Embedding spaces are learned vector representations where items (words, images, concepts) are mapped to dense numerical vectors. Semantically similar items end up close together in this space. This enables similarity search, clustering, and analogical reasoning. Models like Word2Vec, BERT, and CLIP create powerful embedding spaces used across ML applications.",
    x: -2.5, y: 1.8, z: 0.2,
    date_learned: "2024-05-02",
  },
  {
    id: "8",
    name: "Supabase Auth",
    short_summary: "Open-source authentication system with row-level security and social login support.",
    long_summary: "Supabase Auth provides a complete authentication system built on top of PostgreSQL. It supports email/password, magic links, social OAuth providers, and phone authentication. Combined with Row Level Security (RLS) policies, it enables fine-grained access control directly at the database level.",
    x: 1.5, y: -2.0, z: 0.5,
    date_learned: "2024-05-20",
  },
  {
    id: "9",
    name: "Framer Motion",
    short_summary: "Production-ready motion library for React with declarative animations.",
    long_summary: "Framer Motion is a React animation library that provides a declarative API for creating fluid animations and gestures. It supports layout animations, shared layout transitions, scroll-based animations, and physics-based spring animations. Its motion components make complex animations accessible through simple props.",
    x: 2.2, y: 0.5, z: -0.5,
    date_learned: "2024-06-08",
  },
  {
    id: "10",
    name: "Attention Mechanisms",
    short_summary: "Neural network components that learn to focus on relevant parts of input data.",
    long_summary: "Attention mechanisms allow neural networks to dynamically focus on different parts of input when producing output. Self-attention computes relationships between all positions in a sequence, while cross-attention relates two different sequences. These mechanisms are foundational to transformers and have dramatically improved performance across NLP, vision, and multimodal tasks.",
    x: -2.3, y: 1.0, z: 1.3,
    date_learned: "2024-06-25",
  },
  {
    id: "11",
    name: "Next.js App Router",
    short_summary: "File-based routing system with React Server Components and nested layouts.",
    long_summary: "Next.js App Router is a modern routing paradigm that leverages React Server Components by default. It uses a file-system based router with folders defining routes, and special files (layout.tsx, page.tsx, loading.tsx) for UI organization. It supports nested layouts, streaming, and server actions for a full-stack React experience.",
    x: 2.0, y: -1.2, z: -0.9,
    date_learned: "2024-07-12",
  },
  {
    id: "12",
    name: "Reinforcement Learning",
    short_summary: "Learning paradigm where agents learn optimal behavior through trial, error, and rewards.",
    long_summary: "Reinforcement Learning (RL) trains agents to make sequential decisions by maximizing cumulative rewards. Through exploration and exploitation, agents learn policies mapping states to actions. Key concepts include value functions, policy gradients, and temporal difference learning. RL powers game-playing AIs, robotics, and recommendation systems.",
    x: -3.0, y: 0.5, z: 0.0,
    date_learned: "2024-08-01",
  },
  {
    id: "13",
    name: "Three.js Scene Graph",
    short_summary: "Hierarchical structure organizing 3D objects, lights, and cameras for rendering.",
    long_summary: "The Three.js scene graph is a tree structure where the Scene object is the root, containing meshes, lights, cameras, and groups as children. Each object has position, rotation, and scale relative to its parent. This hierarchy enables complex 3D compositions, transformations, and efficient rendering through frustum culling and level-of-detail management.",
    x: 3.2, y: 0.8, z: -0.3,
    date_learned: "2024-08-20",
  },
  {
    id: "14",
    name: "Vector Databases",
    short_summary: "Databases optimized for storing and querying high-dimensional vector embeddings.",
    long_summary: "Vector databases are specialized systems designed to store, index, and search high-dimensional vector embeddings efficiently. Using algorithms like HNSW, IVF, and product quantization, they enable fast approximate nearest neighbor searches. Tools like Pinecone, Weaviate, and pgvector power semantic search, recommendation engines, and RAG applications.",
    x: -1.0, y: 2.5, z: -0.8,
    date_learned: "2024-09-05",
  },
  {
    id: "15",
    name: "CSS Container Queries",
    short_summary: "Style elements based on their container size rather than viewport size.",
    long_summary: "CSS Container Queries allow components to adapt their styling based on the size of their containing element rather than the viewport. This enables truly modular, responsive components that work correctly regardless of where they're placed in a layout. Combined with container query units (cqw, cqh), they represent a paradigm shift in responsive design.",
    x: 1.8, y: -1.8, z: -1.0,
    date_learned: "2024-09-22",
  },
];

export const mockProjects: Project[] = [
  {
    title: "Agentic BI Decision Engine",
    description: "Designing an agentic BI decision engine at Globalink AI combining ML models, LLMs, and Knowledge Graphs to generate actionable e-commerce merchant recommendations across growth, margin optimization, and inventory risk.",
    tech: ["Python", "LLM", "Knowledge Graphs", "Machine Learning", "Deep Learning", "NLP"],
  },
  {
    title: "Extending Non-Vacuous Generalization Bounds for LLMs",
    description: "Extended SubLoRA framework for PAC-Bayes generalization bounds on GPT-2 with adaptive per-layer subspace allocation. Resolved 857x performance bottleneck on A100 GPUs via tensor caching.",
    tech: ["Python", "PyTorch", "Deep Learning", "HPC", "Machine Learning"],
  },
  {
    title: "Curiosity – AI Chat Platform",
    description: "Full-stack AI chat app with conversation branching, dialogue tree visualization, multi-provider LLM support (OpenAI, Anthropic, Gemini, Ollama), OAuth, and vector-embedding memory for RAG context.",
    tech: ["TypeScript", "JavaScript", "Next.js", "React", "Supabase", "RAG", "NLP", "Tailwind CSS"],
    link: "https://curiositylm.app",
    github: "https://github.com/sunnydigital/curiosity",
  },
  {
    title: "Enterprise RAG LLM System",
    description: "Engineered an enterprise-scale RAG system at Amazon serving 15,000 tables across 200 schemas with automated DDL generation, git-style versioning, and Slack notifications using AWS S3, Bedrock, and Redshift.",
    tech: ["Python", "AWS Bedrock", "Redshift", "S3", "RAG", "SQL", "Slack API"],
  },
  {
    title: "DDPM for Histopathologic Images",
    description: "Built denoising diffusion probabilistic models for histopathologic cancer detection on the Patch Camelyon dataset with comprehensive ablation studies.",
    tech: ["Python", "PyTorch", "Diffusion Models", "Computer Vision", "Deep Learning"],
  },
  {
    title: "Medical Imaging Pipeline (NYU Langone)",
    description: "End-to-end ML pipeline for biomedical data with U-Net CNN architectures, transfer learning, and pathway analysis for cardiovascular research. Reduced processing from 8 hours to 45 minutes.",
    tech: ["Python", "PyTorch", "Keras", "Computer Vision", "Deep Learning", "R", "Scikit-Learn", "OpenCV"],
  },
  {
    title: "ChatGPT Web Summarizer Plugin",
    description: "A ChatGPT companion plugin that parses URL content (HTML/PDF) for conversational agents, enabling real-time webpage summarization and information extraction.",
    tech: ["Python", "ChatGPT Plugins", "HTML Parsing", "NLP"],
    github: "https://github.com/sunnydigital/web-sum",
  },
  {
    title: "NYU DSC x Peak AI Datathon — Winner",
    description: "Built a winning recommender system using k-NN with GloVe-50d embeddings, competing against 50+ teams in the NYU Data Science Club x Peak.AI datathon.",
    tech: ["Python", "k-NN", "GloVe", "Recommender Systems", "Scikit-Learn"],
    github: "https://github.com/sunnydigital/datathon-f22",
  },
  {
    title: "NeuralProphet Stock Forecasting",
    description: "Stock price forecasting using NeuralProphet time-series decomposition with AR-Net and additive events for IT sector stocks.",
    tech: ["Python", "NeuralProphet", "Time Series", "PyTorch"],
  },
  {
    title: "ESG NLP Classification",
    description: "Fine-tuned language models on Reddit ESG data with SHAP feature attribution for interpretable ESG scoring and analysis.",
    tech: ["Python", "NLP", "SHAP", "Hugging Face Transformers", "Scikit-Learn"],
    github: "https://github.com/sunnydigital/nlp-f22",
  },
  {
    title: "Persona Emulation & Dialogue",
    description: "Fine-tuning GPT-3 on movie, book, and game dialogue (LotR, Harry Potter, FF XIV) to generate character-specific responses.",
    tech: ["Python", "GPT-3", "Fine-tuning", "NLP"],
  },
  {
    title: "Cover Letter Generator",
    description: "A Python CLI tool that generates tailored cover letters using AI, streamlining the job application process.",
    tech: ["Python", "CLI", "NLP", "OpenAI"],
    github: "https://github.com/sunnydigital/cover-gen",
  },
  {
    title: "3D Galaxy Portfolio",
    description: "This portfolio site — interactive 3D galaxy visualization with Three.js, scroll-driven mode transitions, UMAP clustering, and concept management.",
    tech: ["TypeScript", "JavaScript", "Next.js", "React", "Three.js", "Tailwind CSS", "WebGL"],
    link: "https://www.sunnyson.dev",
  },
];

export const mockSkills: Skill[] = [
  // Programming Languages
  { name: "Python", level: 95, category: "Programming Languages" },
  { name: "R", level: 80, category: "Programming Languages" },
  { name: "Java", level: 70, category: "Programming Languages" },
  { name: "SQL", level: 85, category: "Programming Languages" },
  { name: "JavaScript", level: 78, category: "Programming Languages" },
  { name: "TypeScript", level: 78, category: "Programming Languages" },
  { name: "HTML / CSS", level: 75, category: "Programming Languages" },
  { name: "Bash", level: 70, category: "Programming Languages" },
  // AI / ML Frameworks
  { name: "PyTorch", level: 90, category: "AI / ML Frameworks" },
  { name: "Keras", level: 85, category: "AI / ML Frameworks" },
  { name: "Scikit-Learn", level: 92, category: "AI / ML Frameworks" },
  { name: "XGBoost", level: 85, category: "AI / ML Frameworks" },
  { name: "Hugging Face Transformers", level: 88, category: "AI / ML Frameworks" },
  { name: "spaCy", level: 80, category: "AI / ML Frameworks" },
  { name: "OpenCV", level: 78, category: "AI / ML Frameworks" },
  { name: "LoRA", level: 75, category: "AI / ML Frameworks" },
  { name: "Ollama", level: 72, category: "AI / ML Frameworks" },
  // Data & Compute
  { name: "NumPy / Pandas / SciPy", level: 95, category: "Data & Compute" },
  { name: "W&B / MLflow", level: 80, category: "Data & Compute" },
  { name: "Apache Airflow", level: 75, category: "Data & Compute" },
  { name: "Raytune", level: 70, category: "Data & Compute" },
  // Cloud & Infrastructure
  { name: "AWS (S3, Bedrock, Redshift)", level: 82, category: "Cloud & Infrastructure" },
  { name: "NYU HPC (SLURM)", level: 78, category: "Cloud & Infrastructure" },
  { name: "Vercel", level: 80, category: "Cloud & Infrastructure" },
  { name: "Supabase", level: 78, category: "Cloud & Infrastructure" },
  // MLOps & Tools
  { name: "Git", level: 88, category: "MLOps & Tools" },
  { name: "Docker / Singularity", level: 75, category: "MLOps & Tools" },
  { name: "Next.js", level: 82, category: "MLOps & Tools" },
  { name: "React", level: 80, category: "MLOps & Tools" },
  { name: "Three.js", level: 75, category: "MLOps & Tools" },
  { name: "Tailwind CSS", level: 80, category: "MLOps & Tools" },
  // Specializations
  { name: "NLP", level: 92, category: "Specializations" },
  { name: "Computer Vision", level: 85, category: "Specializations" },
  { name: "Deep Learning", level: 90, category: "Specializations" },
  { name: "Machine Learning", level: 92, category: "Specializations" },
  { name: "Time Series", level: 82, category: "Specializations" },
];

export const mockPosts: Post[] = [
  {
    id: "rag-at-scale",
    title: "Building RAG Systems at Scale: Lessons from Amazon",
    excerpt: "What I learned engineering an enterprise RAG pipeline serving 15,000 tables — from chunking strategies to hallucination guardrails.",
    content: `# Building RAG Systems at Scale: Lessons from Amazon

Retrieval-Augmented Generation sounds simple in theory: fetch relevant context, feed it to an LLM, get a grounded answer. In practice, scaling this to **15,000 tables across 200 schemas** at Amazon taught me that the devil is in the details.

## The Chunking Problem

The first challenge was figuring out *what* to retrieve. Database schemas aren't documents — they're structured metadata with implicit relationships. We ended up building a custom DDL generator that produced natural-language-friendly descriptions of each table, including column semantics, join paths, and usage patterns.

## Embedding Strategy

We experimented with several embedding models before settling on a hybrid approach: dense embeddings for semantic similarity combined with sparse BM25 for exact keyword matching. This was crucial for handling technical terms and table names that semantic models often mangle.

## Hallucination Guardrails

The biggest risk in enterprise RAG is confident wrong answers. We implemented a multi-layer verification system:

- **Schema validation**: Generated SQL is checked against actual DDL
- **Result sanity checks**: Row counts and value distributions are verified
- **Confidence scoring**: Low-confidence answers are flagged for human review

## Key Takeaways

1. **Chunking strategy matters more than model choice** — garbage in, garbage out
2. **Hybrid retrieval beats pure semantic search** for technical domains
3. **Version your knowledge base** — we used git-style versioning for DDL changes
4. **Monitor everything** — Slack alerts on retrieval failures saved us countless times`,
    date: "2025-01-15",
    tags: ["RAG", "LLM", "AWS", "Enterprise ML"],
  },
  {
    id: "diffusion-histopath",
    title: "Diffusion Models for Medical Imaging: A Practical Guide",
    excerpt: "How we applied DDPMs to histopathologic cancer detection — architecture choices, training tricks, and what the ablation studies revealed.",
    content: `# Diffusion Models for Medical Imaging: A Practical Guide

Denoising Diffusion Probabilistic Models (DDPMs) have taken the generative AI world by storm, but their application to **medical imaging** presents unique challenges and opportunities.

## Why Diffusion for Histopathology?

The Patch Camelyon (PCam) dataset contains 327,680 histopathologic patches — a massive dataset by medical imaging standards, but tiny compared to what models like Stable Diffusion train on. We wanted to explore whether diffusion models could augment limited medical training data.

## Architecture Decisions

We started with a standard U-Net backbone but found that **attention at multiple resolutions** was critical for capturing both cellular-level and tissue-level patterns. Our final architecture used:

- Residual blocks with group normalization
- Self-attention at 16x16 and 8x8 resolutions
- Sinusoidal time embeddings
- Linear noise schedule (β₁ = 1e-4, βT = 0.02)

## Training Insights

Medical images have different statistical properties than natural images. Key findings:

1. **Longer training schedules** — convergence took 2-3x longer than natural image datasets
2. **Lower learning rates** — 1e-5 worked better than the typical 2e-4
3. **Color augmentation hurts** — unlike natural images, stain colors carry diagnostic meaning

## Ablation Results

Our ablation studies revealed that the noise schedule had the largest impact on sample quality, followed by the number of attention layers. Surprisingly, increasing model depth beyond 4 blocks showed diminishing returns.

## The Bigger Picture

Diffusion models aren't just for generation — the learned representations transfer beautifully to classification tasks. Our diffusion-pretrained features improved cancer detection accuracy by 3.2% over training from scratch.`,
    date: "2024-11-20",
    tags: ["Diffusion Models", "Medical Imaging", "PyTorch", "Deep Learning"],
  },
  {
    id: "embeddings-demystified",
    title: "Embedding Spaces Demystified: From Word2Vec to CLIP",
    excerpt: "A visual tour through embedding spaces — what they are, why they work, and how to build intuition for high-dimensional geometry.",
    content: `# Embedding Spaces Demystified: From Word2Vec to CLIP

If there's one concept that underpins modern ML, it's **embeddings**. But what does it actually mean to represent a word, image, or concept as a point in high-dimensional space?

## The Core Idea

An embedding is a learned mapping from discrete objects to continuous vectors. The magic: **semantic relationships become geometric relationships**. Similar things end up close together.

## Word2Vec: Where It Started

Word2Vec (2013) showed that training a simple neural network to predict neighboring words produces vectors where:

\`king - man + woman ≈ queen\`

This wasn't engineered — it *emerged* from the training objective. The geometry of language was hiding in co-occurrence statistics all along.

## From Words to Everything

The embedding paradigm has since expanded to:

- **Sentences** (Sentence-BERT): Encode entire sentences for semantic search
- **Images** (ResNet features, DINO): Visual similarity in vector space
- **Multimodal** (CLIP): Images and text in a *shared* space
- **Code** (CodeBERT): Programming language semantics

## Building Intuition

High-dimensional spaces are weird. Some counterintuitive properties:

1. **Most volume is near the surface** — in high dimensions, almost everything is "far from the center"
2. **Random vectors are nearly orthogonal** — in 768 dimensions, any two random vectors will have cosine similarity near 0
3. **Curse of dimensionality** — distances become less meaningful as dimensions increase, which is why approximate methods (HNSW, IVF) work so well

## Practical Tips

When working with embeddings:

- **Always normalize** before computing cosine similarity
- **Dimensionality reduction** (PCA to ~256) often improves downstream performance
- **Domain-specific fine-tuning** beats larger generic models
- **Monitor embedding drift** in production systems`,
    date: "2024-09-10",
    tags: ["Embeddings", "NLP", "Machine Learning", "Tutorial"],
  },
  {
    id: "galaxy-portfolio",
    title: "Building a 3D Galaxy Portfolio with Three.js and Next.js",
    excerpt: "The story behind this portfolio site — how I turned a knowledge graph into an interactive 3D galaxy visualization.",
    content: `# Building a 3D Galaxy Portfolio with Three.js and Next.js

When I set out to build my portfolio, I wanted something that reflected how I think about knowledge — as an interconnected, ever-expanding universe of ideas.

## The Concept

Each concept I've learned becomes a star in a 3D galaxy. Related concepts cluster together, forming constellations of knowledge. Visitors can fly through this space, clicking on stars to explore what I've learned.

## Technical Stack

- **Next.js 14** with App Router for the framework
- **Three.js** via React Three Fiber for 3D rendering
- **Framer Motion** for section animations
- **NextAuth** for authentication
- **Vercel** for deployment

## The Galaxy Visualization

The hardest part was making the galaxy feel *alive*. Key techniques:

1. **Instanced rendering** — Drawing 1000+ stars with a single draw call
2. **Custom shaders** — GLSL for the glow effect and color gradients
3. **Smooth camera transitions** — Interpolating between overview and focus modes
4. **Scroll-driven modes** — The visualization changes based on scroll position

## Performance Optimization

3D on the web is expensive. Optimizations that mattered:

- **Level of detail** — Distant stars render as simple points
- **Frustum culling** — Only render what's in view
- **Adaptive quality** — Detect GPU capability and adjust particle count
- **Lazy loading** — The galaxy component loads via dynamic import

## Lessons Learned

Building this taught me that the intersection of **data visualization, 3D graphics, and web development** is incredibly rewarding. Every concept I add to my knowledge base literally makes the galaxy bigger.`,
    date: "2024-08-05",
    tags: ["Three.js", "Next.js", "WebGL", "Portfolio"],
  },
];
