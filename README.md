# Sunny's Portfolio

An interactive portfolio website featuring a scroll-driven 3D visualization journey through learned concepts, built with Next.js, Three.js, and Tailwind CSS.

## ✨ Features

### Scroll-Driven Visualization Journey
The hero section is a full-screen interactive 3D visualization that transforms as you scroll:

1. **🌌 Galaxy Mode** — A swirling galaxy of stars where each real concept is a glowing data point. Filler dots pad the galaxy when there aren't enough concepts. Hover over concept dots to see names and summaries.

2. **🔬 Dimensionality Reduction Mode** — Filler dots disperse and real concepts rearrange into semantic clusters (t-SNE/UMAP style). Similar concepts cluster together based on pre-computed coordinates.

3. **📅 Timeline Mode** — Concepts transition to a chronological timeline showing when each was learned.

### AI-Powered Concept Management
- Type a concept name and Claude auto-generates short and long summaries
- Concepts are stored with semantic coordinates for visualization positioning
- Supports Anthropic API key or OAuth

### Portfolio Sections
- **About** — Bio with photo placeholder
- **Projects** — Card grid with tech tags and links
- **Skills** — Animated progress bars by category
- **Resume** — Timeline-style experience and education
- **Links** — Social links (GitHub, LinkedIn, X, email)
- **Contact** — Contact form

### Design
- Dark/light mode toggle
- Particle background effects
- Smooth scroll animations via Framer Motion
- Electric blue/purple/cyan gradient aesthetic
- Fully responsive

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Particles:** Canvas 2D particle system
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Auth & Data:** Supabase
- **AI:** Anthropic Claude API
- **Icons:** Lucide React

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
src/
├── app/
│   ├── api/concepts/    # Claude API route for concept generation
│   ├── globals.css      # Global styles + theme
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Main page
├── components/
│   ├── GalaxyVisualization.tsx  # Three.js 3D visualization
│   ├── ParticleBackground.tsx   # Canvas particle effects
│   ├── ScrollIndicator.tsx      # Scroll prompt
│   ├── ConceptInput.tsx         # Add concept form
│   ├── Navbar.tsx               # Navigation
│   ├── ThemeToggle.tsx          # Dark/light toggle
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── Resume.tsx
│   ├── Links.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── data/
│   └── mock.ts          # Mock concepts, projects, skills
├── lib/
│   ├── scroll.tsx       # Scroll context provider
│   ├── supabase.ts      # Supabase client
│   └── theme.tsx        # Theme context provider
└── types/
    └── index.ts         # TypeScript interfaces
```

## 🔧 Configuration

### Supabase Schema

```sql
create table concepts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  name text not null,
  short_summary text,
  long_summary text,
  x float,
  y float,
  z float,
  date_learned date default current_date,
  created_at timestamptz default now()
);

alter table concepts enable row level security;
```

### Environment Variables

See `.env.local.example` for required variables.

## 📄 License

MIT
