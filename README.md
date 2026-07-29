# The Ink Home

An immersive, cinematic spatial publication portal and dynamic metadata indexer for "The Ink Home" on Medium. High-performance, fully responsive, and styled with modern editorial design principles.

[![Tech Stack](https://img.shields.io/badge/tech--stack-Vite%206%20%7C%20React%2019%20%7C%20TS%20%7C%20Node.js-blue?style=for-the-badge)](https://github.com)
[![Animation](https://img.shields.io/badge/Animations-Framer%20Motion-purple?style=for-the-badge)](https://motion.dev)
[![Styles](https://img.shields.io/badge/Styles-Tailwind%20CSS%20v4-cyan?style=for-the-badge)](https://tailwindcss.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)](https://vercel.com)

---

## 1. Hero Section

*   **Platform Tagline:** Spatial Literature in a Multi-Dimensional Cosmos
*   **Live Production:** [theinkhome.live](https://theinkhome.live)
*   **Vercel Preview:** [the-ink-home.vercel.app](https://the-ink-home.vercel.app)
*   **Publication Base:** [The Ink Home on Medium](https://medium.com/the-ink-home)
*   **Developer Contact/Portfolio:** [Farhan Kabir @ Github](https://github.com/farhankabir133)

---

## 2. Executive Summary

**The Ink Home** is a production-grade, immersive spatial publishing platform that transforms traditional blog layouts into cinematic, interactive digital experiences. Built with **React 19**, **Vite 6**, **Tailwind CSS v4**, **Framer Motion**, and **Node.js 24**, it serves as an automated sync agent and cinematic gateway for the official Medium publication *The Ink Home*.

The system implements a real-time data synchronization engine that ingests the publication's RSS feed, aggregates active posts, and resolves high-fidelity author profile metrics. Content is delivered through four interactive presentation layers: an immersive 3D floating carousel, a responsive bento grid, a sleek editorial list view, and a full-screen story modal. The platform features dynamic atmosphere theming, tactile card interactions, skeleton loading states, and a cinematic opening sequence.

### Deployment Architecture

*   **Local Development:** Express + Vite middleware (`server.ts`) on port 3000
*   **Production:** Vercel serverless functions (`api/stories.ts`, `api/about.ts`, `api/track.ts`, `api/health.ts`) + static SPA build
*   **Custom Domain:** `theinkhome.live` served via Vercel with auto-provisioned SSL
*   **No Service Worker:** Removed for Vercel to avoid stale-cache issues; relies on Vercel CDN + immutable asset caching

---

## 3. Key Features

### Cinematic Experience
*   **Game-Opening Loader:** Full-screen Framer Motion animated entrance sequence with progress bar, grain effects, and corner bracket decorations.
*   **Dynamic Atmosphere Theming:** Four distinct visual modes (Cosmic, Ink, Cabin, Neural) that propagate across the entire UI — text, borders, glows, accents, and backgrounds.
*   **Kinetic Typography:** Dramatic scale contrast between massive tight headlines and wide line-height body copy, with mouse-reactive 3D transforms.
*   **Tactile Cards:** 3D tilt on hover, spring-physics lift, inner glow on active states, and ripple micro-interactions on all interactive surfaces.

### Navigation & Layout
*   **Floating Left Sidebar (Desktop):** Fixed vertical rail with icon-only nav, active state indicators, and atmosphere-colored accents.
*   **Hamburger Menu (Mobile):** Slide-up bottom sheet with all navigation options in a responsive 3-column grid layout.
*   **Floating Right Dock:** Sound toggle and atmosphere mode selector as a vertical floating panel.
*   **Centered Content:** Max-width containers with balanced whitespace for comfortable reading.

### 3D Carousel & Views
*   **Physics-Based Rotation:** Smooth spring animations with drag/swipe support and haptic-style visual feedback.
*   **Depth & Shadow:** Strong shadow depth on active cards, perspective transforms, and drag-offset visual feedback.
*   **Touch Optimized:** Native pointer events for mobile swipe gestures.

### Performance & Accessibility
*   **Skeleton Screens:** Shimmer placeholder cards during loading instead of spinners.
*   **Accessibility First:** Skip-to-content links, visible focus rings (`--atmo-text`), 44px minimum touch targets, and `prefers-reduced-motion` respect.
*   **Full-Screen Mobile Modal:** Story reading modal goes edge-to-edge on mobile for distraction-free reading.
*   **Vercel SPA Routing:** Client-side routes (`/story/:slug`, `/about`, etc.) correctly fall back to `index.html`.
*   **Self-Hosted Fonts:** Inter and Space Grotesk served from `/fonts/` with `font-display: swap` to eliminate render-blocking external font requests.
*   **Immutable Asset Caching:** Vite hashed assets served with long-term cache headers via Vercel CDN.

### Full-Stack Data Layer
*   **Vercel Serverless APIs:** Self-contained functions in `/api/` for stories, about data, telemetry, and health checks.
*   **Local Express Dev Server:** `server.ts` provides hot-reloaded development environment with API proxying.
*   **High-Fidelity Avatar Resolver:** Multi-tier fallback resolution with deterministic `djb2Hash` avatars for known authors.
*   **Authors & Editors Profiler:** Programmatic parsing of active author signatures and contextual metrics.

---

## 4. Technical Deep Dive

### Current Architecture

```
[ Client Browser ]
    │
    ├── Vercel CDN Edge ──► Static Assets (/assets/*, /fonts/*, index.html)
    │                         └─ Immutable cache, long TTL
    │
    ├── Vercel Serverless Functions (/api/*)
    │     ├── /api/stories   ──► Medium RSS → cached JSON
    │     ├── /api/about     ──► Editorial board + writers metadata
    │     ├── /api/track     ──► Telemetry ingest
    │     └── /api/health    ──► Uptime + memory diagnostics
    │
    └── React SPA Client
          ├── Tailwind CSS v4 + CSS custom properties
          ├── Framer Motion animations
          ├── Lazy-loaded route chunks
          └── Fallback data bundled for instant first paint
```

### Local Development Topology

```
[ Browser ] ──► Express (server.ts:3000)
                  │
                  ├─ Vite middleware (HMR, module resolution)
                  ├─ API routes (/api/stories, /api/about, /api/track, /api/health)
                  └─ SPA fallback with dynamic SEO injection
```

### Architectural Decisions

*   **Vercel-First Production:** `server.ts` is retained for local development only. Production runs on Vercel's Node.js runtime via `/api/` serverless functions and static `dist/` output.
*   **Self-Contained API Functions:** Each `/api/*.ts` file is fully self-contained to avoid Vercel module-resolution failures. Shared parsing logic lives in `src/lib/api-server.ts`.
*   **Tailwind CSS v4:** Uses `@import "tailwindcss"` with the `@tailwindcss/vite` plugin and `@theme` directives for design tokens.
*   **Dynamic Theming via CSS Variables:** Atmosphere modes set `data-atmosphere` on the root, propagating `--atmo-text`, `--atmo-border`, `--atmo-glow`, etc., throughout the component tree.
*   **Framer Motion for Cinematics:** All page transitions, card animations, and the opening loader use `motion/react` with spring physics and custom easing curves.
*   **Component-Driven Design:** Modular architecture with isolated components for each view layer (Carousel3D, StoryGrid, StoryList, AuthorsSection, SubmissionGuideline).
*   **Defensive Data Fetching:** Client fetches from local `/api/*` first, then falls back to bundled static data and public RSS proxies. No exposed secrets or server-only credentials reach the browser.

---

## 5. Feature Breakdown Table

| Area | Key Capabilities | Implementation Details |
| :--- | :--- | :--- |
| **Opening Sequence** | Cinematic Loader | Framer Motion blur-to-sharp title reveal, progress bar, grain overlay |
| **Theming System** | 4 Atmosphere Modes | CSS custom properties on `[data-atmosphere]` for full palette control |
| **Navigation** | Responsive Sidebar + Hamburger | Desktop left rail with icons; mobile slide-up sheet with 3-column grid |
| **3D Carousel** | Physics-Based Carousel | Pointer events, spring animations, drag-offset feedback, depth shadows |
| **Card UX** | Tactile Interactions | 3D tilt (`rotateX`/`rotateY`), spring lift, ripple effect, inner glow |
| **Loading States** | Skeleton Screens | Shimmer animations with cinematic progress bar during data fetch |
| **Typography** | Scale & Rhythm | Self-hosted Inter + Space Grotesk, CSS custom properties for type scale |
| **Accessibility** | A11y First | Skip links, focus rings, 44px touch targets, `prefers-reduced-motion` |
| **Ingestion Engine** | RSS-to-JSON Pipeline | Fetches from official Medium RSS and sanitizes HTML nodes |
| **Avatar Resolution** | Tiered Fallbacks | Direct fetch → RSS2JSON → AllOrigins → Unavatar proxy → deterministic hash avatars |
| **Production Hosting** | Vercel Serverless | Static SPA build + `/api/*` serverless functions, custom domain SSL |
| **Local Dev** | Express + Vite | Hot reload, API routes, SEO injection for `/story/:slug` |

---

## 6. UX / UI Highlights

*   **Cinematic Opening:** Game-style loader with blur reveal, gradient progress bar, and status indicators.
*   **Atmospheric Illumination:** Active elements emit soft glows that shift color with the selected atmosphere mode.
*   **Tactile Feedback:** Every button, card, and navigation item has spring-physics hover states and active press feedback.
*   **Reader Mode Focus:** The StoryModal provides a distraction-free reading environment with full-screen support on mobile.
*   **Micro-Interactions:** Ripple effects on cards, scale transforms on buttons, and smooth tab transitions.
*   **Instant First Paint:** Bundled fallback stories and author data ensure content appears before network fetches complete.

---

## 7. Project Structure

```
├── api/
│   ├── stories.ts        # Vercel serverless function: Medium RSS → cached JSON
│   ├── about.ts          # Vercel serverless function: editorial board metadata
│   ├── track.ts          # Vercel serverless function: telemetry ingest
│   └── health.ts         # Vercel serverless function: uptime + memory diagnostics
├── src/
│   ├── components/
│   │   ├── AuthorsSection.tsx      # About page with editors/writers profiles
│   │   ├── AvatarImage.tsx         # Resilient avatar with fallback chain
│   │   ├── Carousel3D.tsx          # 3D orbital story carousel
│   │   ├── CinematicLoader.tsx     # Game-opening cinematic loading sequence
│   │   ├── DataStreamBackground.tsx # Reduced-density canvas background
│   │   ├── LandingPage.tsx         # Cinematic landing/entry page
│   │   ├── Logo.tsx                # Publication logo component
│   │   ├── StoryGrid.tsx           # Bento grid story layout
│   │   ├── StoryList.tsx           # Editorial list view
│   │   ├── StoryModal.tsx          # Full-screen story reader modal
│   │   └── SubmissionGuideline.tsx # Writer submission guidelines
│   ├── data/
│   │   ├── fallbackStories.ts      # Static story fallback data
│   │   └── fallbackAbout.ts        # Static about/author fallback data
│   ├── lib/
│   │   └── api-server.ts           # Shared RSS parsing, avatar resolution, djb2Hash
│   ├── types.ts                    # TypeScript interfaces
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles, CSS variables, animations
├── public/
│   ├── fonts/                      # Self-hosted Inter + Space Grotesk
│   └── The_Ink_Home.webp           # Publication logo
├── dist/                           # Vite production build output
├── server.ts                       # Express dev server (local only)
├── vite.config.ts                  # Vite 6 + @tailwindcss/vite config
├── vercel.json                     # Vercel routing: static + serverless functions
├── package.json                    # Node 24.x, Vercel-ready scripts
└── README.md                       # Project documentation
```

---

## 8. Developer Experience (DX)

### Prerequisites

*   Node.js 24.x
*   npm 10+
*   Git

### Setup Instructions

1. **Clone and navigate:**
    ```bash
    git clone https://github.com/farhankabir133/TheInkHome.git
    cd TheInkHome
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Environment variables:**
    ```bash
    cp .env.example .env
    ```
    Populate `.env` with any required API keys or overrides. For local dev, defaults are bundled.

### Execution Commands

*   **Development server (Express + Vite HMR):**
    ```bash
    npm run dev
    ```
    Spins up on `http://localhost:3000` with hot module replacement.

*   **Production build:**
    ```bash
    npm run build
    ```
    Outputs static SPA to `dist/`.

*   **Type checking / lint:**
    ```bash
    npm run lint
    ```

*   **Run tests:**
    ```bash
    npm test
    ```

---

## 9. Component Architecture

### Core Components

| Component | Purpose | Key Features |
| :--- | :--- | :--- |
| `CinematicLoader` | Opening sequence | Framer Motion blur reveal, progress bar, grain overlay |
| `AtmosphereDeck` | Theme controller | 4 atmosphere modes, CSS variable propagation |
| `DashboardHeader` | Desktop navigation | Fixed left sidebar with icon tabs and active indicators |
| `Carousel3D` | 3D story carousel | Pointer drag, spring physics, depth shadows |
| `StoryGrid` | Bento grid view | Tactile cards, 3D tilt, skeleton loading |
| `StoryList` | Editorial list | Hover states, like/save interactions |
| `StoryModal` | Story reader | Full-screen mobile, share actions, social links |
| `AuthorsSection` | About page | Editor/writer profiles, publication info, avatar resolution |
| `SubmissionGuideline` | Writer guidelines | Interactive checklist, writing specs |
| `AvatarImage` | Resilient avatar | `onError` fallback chain, `referrerPolicy="no-referrer"` |

### State Management

The application uses React's built-in `useState` and `useEffect` hooks for:
*   Route synchronization (`entered`, `activeTab`, `selectedStory`)
*   Atmosphere mode (`bgMode`)
*   Interaction state (`likedSlugs`, `savedSlugs`)
*   Loading states (`loading`, `error`, `stories`)
*   Data hydration from `/api/stories` and `/api/about`

---

## 10. Design System

### Atmosphere Modes

| Mode | Primary Color | Glow Color | Mood |
| :--- | :--- | :--- | :--- |
| `stellar` | `#06b6d4` (Cyan) | `rgba(6, 182, 212, 0.4)` | Cosmic, futuristic |
| `ink` | `#6366f1` (Indigo) | `rgba(99, 102, 241, 0.4)` | Creative, literary |
| `forest` | `#f59e0b` (Amber) | `rgba(245, 158, 11, 0.4)` | Warm, cozy |
| `constellation` | `#10b981` (Emerald) | `rgba(16, 185, 129, 0.4)` | Natural, neural |

### Typography Scale

*   **Display / Headings:** Space Grotesk (self-hosted)
*   **Body:** Inter (self-hosted)
*   **Scale:** `--text-5xl` through `--text-8xl` for headings, relaxed line-height (`1.65`) for body text
*   **Font Loading:** `font-display: swap` with preloaded local TTF files to eliminate render-blocking

### Motion Tokens

*   **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)
*   **Spring:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
*   **Durations:** Fast `150ms`, Normal `300ms`, Slow `500ms`

---

## 11. Deployment

### Production: Vercel

The production site runs on **Vercel** with a custom domain:

*   **Custom Domain:** [https://theinkhome.live](https://theinkhome.live)
*   **Vercel URL:** [https://the-ink-home.vercel.app](https://the-ink-home.vercel.app)
*   **Build Output:** `dist/` (static SPA)
*   **Serverless Functions:** `/api/stories`, `/api/about`, `/api/track`, `/api/health`
*   **SSL:** Auto-provisioned by Vercel
*   **Node Runtime:** 24.x

### Vercel Configuration

`vercel.json` routes:
```json
{
  "version": 2,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/assets/(.*)", "dest": "/dist/assets/$1" },
    { "src": "/fonts/(.*)", "dest": "/dist/fonts/$1" },
    { "src": "/manifest.json", "dest": "/dist/manifest.json" },
    { "src": "/sw.js", "dest": "/dist/sw.js" },
    { "src": "/(.*)", "dest": "/dist/index.html" }
  ]
}
```

### Local Development

`server.ts` provides:
*   Express app with `compression`, `helmet`, rate limiting, and request logging
*   Vite middleware for HMR
*   API routes for stories, about, track, and health
*   Dynamic SEO injection for `/story/:slug`
*   Graceful shutdown and error handling

---

## 12. Security & Stability

1.  **XSS Prevention:** All dynamic SEO meta values in `server.ts` are escaped via `escapeHtml()` before injection into HTML.
2.  **HTML Sanitization:** Story content is sanitized with `isomorphic-dompurify` before rendering in `StoryModal`.
3.  **Server-Client Isolation:** All RSS fetching and avatar resolution happens server-side or in Vercel functions. No external scraping secrets are exposed to the browser.
4.  **Rate Limiting:** Express API routes use `express-rate-limit` locally; Vercel functions have bounded retry logic and timeouts.
5.  **Request Hardening:** All outbound fetches use `AbortController` timeouts. Avatar resolution uses bounded concurrency (`MAX_PREFETCH_CONCURRENCY = 5`).
6.  **Caching Strategy:** API responses include `Cache-Control: public, max-age=300, stale-while-revalidate=600`. Static assets are immutable with content hashes.
7.  **Graceful Degradation:** Bundled fallback stories and author data ensure the UI renders even if API fetches fail.

---

## 13. Known Limitations & Future Roadmap

*   [ ] Client-side vector audio synthesizers for ambient soundscapes during reading sessions.
*   [ ] Instant newsletter subscription proxy feeding directly into Substack or ConvertKit APIs.
*   [ ] Local indexing via SQLite or IndexedDB for offline reading of cached books and drafts.
*   [ ] User preference persistence (default atmosphere mode, layout preference).
*   [ ] Swipe gesture support for carousel on mobile devices.
*   [ ] Replace Framer Motion with CSS-native animations for lighter bundle size.
*   [ ] Extract `App.tsx` into smaller custom hooks (`useStories`, `useAtmosphere`, `useAudio`) for better tree-shaking.

---

## 14. Author Section

*   **Name:** Farhan Kabir
*   **Username:** farhankabir133
*   **Email:** farhankabir133@gmail.com
*   **Role:** Founder & Lead AI/Software Engineer
*   **Short Bio:** Pushes the envelope on spatial web engineering, creating responsive, physics-based user interfaces and interactive publication systems.
*   **Links:** [Medium Portal](https://medium.com/@farhankabir133) | [GitHub Profile](https://github.com/farhankabir133)

---

*Enjoy spatial reading on The Ink Home. Made with love and precision.*
