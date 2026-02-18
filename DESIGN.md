# DESIGN.md — Sunny's Portfolio

## Overview

Interactive portfolio for Sunny Son featuring a 3D galaxy visualization built with Three.js/React Three Fiber. Concepts (learnings) are embedded as stars in a procedural spiral galaxy. Scroll-driven mode transitions let visitors explore the galaxy, then cluster and timeline views, before reaching traditional portfolio sections.

**Live:** https://sunny-portfolio-five.vercel.app
**Repo:** https://github.com/ernietheopenclaw/sunny-portfolio (private)
**Stack:** Next.js 14 (App Router), React Three Fiber, Three.js, NextAuth.js, @mariozechner/pi-ai, Tailwind CSS

---

## Theme

Matches the Agora project exactly.

### Colors (CSS Variables)
```
--bg:          #0a0a0a
--bg-card:     #111111
--bg-hover:    #1a1a1a
--text:        #e0e0e0
--text-muted:  #888888
--accent:      #218380    (teal)
--accent-mid:  #2ba8a4
--accent-light:#34d4cf
--border:      #1e1e1e
--error:       #e74c3c
```

### Fonts
- **Body:** Inter (variable, sans-serif)
- **Mono:** JetBrains Mono (monospace)

### Dark/Light Mode
Toggle in navbar. ThemeProvider in `src/lib/theme.tsx`.

---

## Architecture

### Components (`src/components/`)
| File | Purpose |
|------|---------|
| `GalaxyVisualization.tsx` | Main 3D viz (~790 lines). Galaxy generation, bloom, scroll trap, mode transitions, hover tooltips, concept stars |
| `Navbar.tsx` | Top nav with animated 🌞 gif, "Sunny Son", nav links, theme toggle, auth |
| `ConceptInput.tsx` | Add new concept form (authenticated only, uses `useSession()`) |
| `About.tsx` | Bio section with headshot |
| `Projects.tsx` | Project cards |
| `Skills.tsx` | Skills display (pending redesign — loading bars considered ineffective) |
| `Resume.tsx` | Resume/experience section |
| `Links.tsx` | Social/external links |
| `Contact.tsx` | Contact form |
| `Footer.tsx` | Page footer |
| `ScrollIndicator.tsx` | Visual scroll progress indicator |
| `ThemeToggle.tsx` | Dark/light mode toggle button |
| `SessionWrapper.tsx` | NextAuth SessionProvider wrapper |

### Pages (`src/app/`)
| Route | Purpose |
|-------|---------|
| `/` | Main page — galaxy viz + all portfolio sections |
| `/concept/[id]` | Concept detail page with editable in-depth overview |
| `/settings` | API key / OAuth token config + summary length slider |
| `/auth/error` | Auth error page |

### API Routes (`src/app/api/`)
| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | NextAuth.js Google OAuth handler |
| `/api/concepts` | Generate concept summaries via Claude (pi-ai) |
| `/api/oauth/anthropic/authorize` | Initiate Anthropic OAuth PKCE flow |
| `/api/oauth/anthropic/exchange` | Exchange OAuth code for token |

### State (`src/lib/`)
| File | Purpose |
|------|---------|
| `scroll.tsx` | ScrollProvider — manages mode state (galaxy/reduction/timeline), pastVisualization flag |
| `theme.tsx` | ThemeProvider — dark/light mode state |
| `auth.ts` | NextAuth config — Google OAuth restricted to `sunnys2327@gmail.com` |

### Data
| File | Purpose |
|------|---------|
| `src/data/mock.ts` | Mock concept data (id, name, short_summary, long_summary, x/y/z coords, date_learned) |
| `src/types/index.ts` | TypeScript types (Concept, etc.) |

---

## 3D Galaxy

### Algorithm (pickles976/GalaxyThreeJS)
Procedural spiral galaxy with:
- **7000 stars** total
- **Gaussian distribution** for core density
- **2 spiral arms** using `spiral(x, y)` function with SPIRAL_FACTOR = 3.0
- **4 populations:** core, outer core, arm 1, arm 2
- **Haze sprites** at 50% ratio for volumetric look
- **Bloom postprocessing** via UnrealBloomPass

### Key Constants
```
NUM_STARS = 7000
GALAXY_THICKNESS = 5
CORE_X/Y_DIST = 33
OUTER_CORE_X/Y_DIST = 100
ARM_X/Y_DIST = 100 / 50
ARM_X/Y_MEAN = 200 / 100
SPIRAL_FACTOR = 3.0
ARMS = 2
HAZE_RATIO = 0.5
```

### Concept Stars
Concepts from mock data are embedded INTO the galaxy as distinct colored stars (accent-colored). They participate in the galaxy's structure rather than floating on top.

### Hover Tooltips
- Invisible hit plane for raycasting
- Proximity threshold: 0.5 units
- Shows concept name + "Added: {date}"

---

## Scroll System

### Mode Transitions
`Galaxy → Clusters → Timeline` via scroll wheel.

1. **Galaxy** — Full spiral galaxy view, orbit controls active
2. **Clusters** — Stars disperse into semantic clusters with animated transition
3. **Timeline** — Concepts arranged chronologically

### Scroll Trap
- Wheel events intercepted with `preventDefault` during viz modes
- 800ms debounce between mode switches
- `pastVisualization` state tracks when user has scrolled through all 3 modes
- Page scroll unlocks only after exiting Timeline mode
- IntersectionObserver snaps back to viz on scroll-up

### Controls
- **Left-click drag** = orbit/rotate (OrbitControls)
- **Right-click drag** = zoom in/out (custom RightClickZoom component)
- **Scroll wheel** = switch modes (NOT zoom)
- OrbitControls `enableZoom = false`

### Nav Link Behavior
Clicking any navbar link sets mode to "timeline" and `setPastVisualization(true)` so the visualization slides up to reveal page content.

---

## Authentication

### Google OAuth (NextAuth.js)
- Provider: Google
- Restricted to single email: `sunnys2327@gmail.com`
- signIn callback checks `user.email` match
- Session wrapper in `SessionWrapper.tsx`

### Anthropic Auth (pi-ai)
Two modes available via Settings page toggle:
1. **API Key** — Direct Anthropic API key, stored in localStorage
2. **Claude OAuth** — Full PKCE flow via pi-ai
   - `/api/oauth/anthropic/authorize` initiates flow
   - `/api/oauth/anthropic/exchange` completes token exchange
   - Tokens encrypted at rest (AES-256-GCM)
   - Auto-refresh on expiry

### Security
- All stored credentials masked in UI (`••••••••`)
- In-memory sessions for pending logins (expire after 10 min)
- PKCE handled transparently by pi-ai

---

## LLM Integration

### Package: @mariozechner/pi-ai (v0.53.0)
Unified LLM API supporting both API key and OAuth token auth.

### Concept Generation (`/api/concepts`)
- Uses `getModel("anthropic", "claude-sonnet-4-20250514")` + `complete()`
- Summary length controlled by slider (1–10 sentences) from Settings page
- Stored in localStorage as `summary-length`
- Prompt template interpolates sentence count dynamically
- Message objects require `timestamp: Date.now()` field (build-breaking if omitted)

---

## Deployment

### Vercel
- Auto-deploys from `master` branch
- Environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL, AUTH_TRUST_HOST

### Favicon
Sun-with-face SVG (`public/favicon.svg`) from Google Noto Emoji (unicode-16.0). Referenced in `layout.tsx` metadata.icons.

### Quote
Galaxy view shows italic quote top-left:
> *"Dedicated to the bright lights that have guided me through wayward roads and rough seas"*

---

## Pending / TODO
- [ ] Skills section redesign (replace loading bars with tiered grid or project-linked approach)
- [ ] Quote/epigraph section between galaxy and About
- [ ] End-to-end test of Claude OAuth token flow
- [ ] Test concept generation with summary length slider
