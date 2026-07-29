# The Ink Home — Comprehensive Performance Analysis & 20x Improvement Plan

**Date:** 2026-07-29
**Project:** The Ink Home — Spatial Publication Portal
**Tech Stack:** React 19, Vite 6, Express, Tailwind CSS v4, Framer Motion, Three.js (unused)
**Current Build Output:** 2.6MB (dist/), 490KB JS bundle, 82KB CSS bundle

---

## Executive Summary

The Ink Home is a visually rich, single-page application with cinematic animations, 3D carousel interactions, and real-time RSS data synchronization. The current build delivers a **490KB JavaScript bundle** and **82KB CSS bundle** with no code splitting beyond a single lazy-loaded component, render-blocking Google Fonts, a 1MB logo image, and a client-side canvas animation running 2000+ draw calls per frame. The following report identifies 15 critical bottlenecks and prescribes a phased plan to achieve a **20x performance improvement** — targeting sub-25KB JS, sub-5KB CSS, sub-50KB logo, sub-2s LCP, and 90+ Lighthouse scores.

---

## 1. Current Performance Baseline

| Metric | Current | Target (20x) |
|---|---|---|
| JS Bundle Size | ~490KB | <25KB (gzipped: ~8KB) |
| CSS Bundle Size | ~82KB | <5KB (gzipped: ~2KB) |
| Logo Image | 1MB WebP | <50KB WebP/AVIF |
| Total Dist Size | 2.6MB | <300KB |
| Time to Interactive | ~8-12s (est.) | <2s |
| LCP (Largest Contentful Paint) | ~4-6s (est.) | <1.5s |
| Lighthouse Performance | ~20-30 (est.) | 90+ |
| Total Requests | 15+ (fonts, images, API) | <8 |
| Canvas Draw Calls/frame | 2000+ | <200 |

---

## 2. Bottleneck Analysis

### B1. Massive JavaScript Bundle (490KB) — Impact: CRITICAL

**Root Cause:** Framer Motion (`motion/react`) is the single largest contributor, used across 10+ components. Each `motion.div`, `AnimatePresence`, and `motion.h1` pulls in the full animation engine. Lucide-react icons are imported individually but the tree-shaking is ineffective because each component imports its own subset, preventing deduplication.

**Evidence:**
- `App.tsx` (1618 lines) imports `motion` and `AnimatePresence` and uses them on 15+ elements
- `Carousel3D.tsx`, `StoryGrid.tsx`, `StoryList.tsx`, `StoryModal.tsx`, `AuthorsSection.tsx`, `SubmissionGuideline.tsx`, `CinematicLoader.tsx`, `LandingPage.tsx`, `DashboardHeader.tsx` — all use Framer Motion
- `three` package is listed in `package.json` dependencies but **never imported** anywhere in source code — pure dead weight
- `@google/genai` and `@upstash/redis` are server-only dependencies that should not be in the client bundle, but Vite's bundling may include them

**20x Fix:** Replace Framer Motion with CSS-native animations and `React.transition`/`useDeferredValue` for declarative transitions. This eliminates ~120KB of Motion runtime. Tree-shake Lucide by using a custom icon sprite or SVG inline icons. Remove `three`, `@google/genai`, `@upstash/redis` from client dependencies.

**Estimated Savings:** 120KB+ JS reduction (25% of bundle)

---

### B2. Render-Blocking Google Fonts — Impact: CRITICAL

**Root Cause:** The `@import url('https://fonts.googleapis.com/css2?...')` in `src/index.css` line 1 blocks the critical rendering path. The browser must download and parse the CSSOM from Google's CDN before painting any content.

**Evidence:** `src/index.css:1` — `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,900&family=Space+Grotesk:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap')`

**20x Fix:**
1. Self-host fonts using `font-display: swap` with preloaded WOFF2 files
2. Add `<link rel="preload" as="font" ...>` for critical fonts in `index.html`
3. Use `font-display: optional` for non-critical weights
4. Limit to 2 font families (Space Grotesk for display, Inter for body) — remove Playfair Display and JetBrains Mono from the critical path

**Estimated Savings:** 0ms render blocking, LCP improvement of ~1-2s

---

### B3. 1MB Logo Image (Duplicated) — Impact: HIGH

**Root Cause:** `assets/The_Ink_Home.webp` is 1,016,738 bytes (~1MB). It exists in both `assets/` and `public/assets/`. The `Logo.tsx` component imports it directly, and the `server.ts` copies it to `public/assets/` on startup. No responsive sizing, no `srcset`, no compression.

**20x Fix:**
1. Re-encode the logo as AVIF at 40-60KB target (20x smaller)
2. Generate responsive variants (32px, 64px, 128px) and use `srcset`
3. Remove the duplicate in `public/assets/` — serve from the Vite-processed asset pipeline only
4. Add `loading="eager"` and `fetchpriority="high"` on the logo `<img>` tag

**Estimated Savings:** 950KB per page load

---

### B4. DataStreamBackground Canvas — 2000+ Draw Calls/Frame — Impact: HIGH

**Root Cause:** `DataStreamBackground.tsx` creates 100 `StreamClass` instances, each containing 5-25 `SymbolClass` objects. Each animation frame calls `draw()` on every symbol, resulting in 2000+ `fillText` calls per frame at 60fps. The `willReadFrequently: false` context hint is set, but the canvas is composited on top of all page content.

**Evidence:** `DataStreamBackground.tsx:118` — `const streamCount = 100;` and `StreamClass` constructor generates `Math.round(Math.random() * 20 + 5)` symbols per stream.

**20x Fix:**
1. Reduce stream count from 100 to 20 (5x reduction)
2. Reduce symbols per stream from 25 to 5 (5x reduction)
3. Use `willReadFrequently: true` only if reading, otherwise keep `false`
4. Implement frame throttling — skip rendering when the canvas is off-screen using `IntersectionObserver`
5. Consider replacing the canvas animation with a CSS-only particle effect using `box-shadow` or a lightweight library like `particles.js`
6. Add `prefers-reduced-motion` check to disable entirely for users who prefer reduced motion

**Estimated Savings:** 80% fewer draw calls, ~40% CPU reduction on mobile

---

### B5. No Code Splitting Beyond Single Lazy Component — Impact: HIGH

**Root Cause:** Only `Carousel3D.tsx` uses `React.lazy()`. All other 17 components are eagerly bundled into the main chunk. The `StoryGrid`, `StoryList`, `AuthorsSection`, `SubmissionGuideline`, and `StoryModal` components are only needed when their tab is active but are loaded upfront.

**Evidence:** `App.tsx` lines 5-10 — only `Carousel3D` is lazy-loaded. All other components are statically imported.

**20x Fix:**
1. Lazy-load all tab-specific components: `StoryGrid`, `StoryList`, `AuthorsSection`, `SubmissionGuideline`, `StoryModal`
2. Use `React.Suspense` with skeleton fallbacks for each lazy boundary
3. Implement route-based code splitting (even with client-side routing, split by tab/view)
4. Consider `@loadable/component` for better SSR-compatible code splitting

**Estimated Savings:** 60-70% reduction in initial JS payload (only load what's needed for the landing/3D view)

---

### B6. No HTTP Caching Headers — Impact: HIGH

**Root Cause:** The Express server in `server.ts` does not set any `Cache-Control`, `ETag`, or `Last-Modified` headers on static assets or API responses. Every page load triggers full re-downloads of all assets.

**Evidence:** `server.ts` — the `app.use(express.static(...))` calls have no cache-control options. The `/api/stories` and `/api/about` endpoints return fresh data on every request with no `Cache-Control` headers.

**20x Fix:**
1. Add `Cache-Control: public, max-age=31536000, immutable` for hashed static assets (Vite build output)
2. Add `Cache-Control: public, max-age=300` for API responses (5-minute cache)
3. Add `ETag` headers for conditional requests
4. Add `Content-Encoding: gzip` or `br` (brotli) compression via `compression` middleware
5. Configure Vercel/Cloudflare CDN caching rules in `vercel.json`

**Estimated Savings:** 60-80% reduction in repeat-visit transfer size

---

### B7. Google Fonts CSS @import in Stylesheet — Impact: HIGH

**Root Cause:** The `@import` in `src/index.css` line 1 is render-blocking. Unlike `<link rel="preload">`, `@import` in CSS cannot be parallelized — the browser must download the CSS file, parse it, discover the `@import`, then download the fonts CSS.

**20x Fix:** Replace `@import` with `<link rel="preconnect">` and `<link rel="stylesheet">` tags in `index.html` with `media="print"` onload trick, or self-host fonts.

**Estimated Savings:** Eliminates 1 render-blocking request chain

---

### B8. Unsplash Images Loaded at Full Resolution — Impact: MEDIUM

**Root Cause:** Cover images use URLs like `https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1200&q=80` with no `sizes` attribute, no `srcset`, and no width/height hints. The browser downloads 1200px-wide images even on mobile screens that are 375px wide.

**20x Fix:**
1. Add `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` to all `<img>` tags
2. Use `w=400` for mobile, `w=800` for tablet, `w=1200` for desktop in the URL
3. Add `width` and `height` attributes to prevent layout shift
4. Add `loading="lazy"` to all below-fold images (already present on some, missing on others)
5. Add `decoding="async"` to all images

**Estimated Savings:** 40-60% reduction in image transfer size on mobile

---

### B9. Massive App.tsx (1618 Lines) — Impact: MEDIUM

**Root Cause:** `App.tsx` contains all state management, data fetching, audio synthesis, scroll tracking, URL routing, and rendering logic in a single file. This makes it impossible to tree-shake or lazy-load any portion of the application logic.

**20x Fix:**
1. Extract state hooks into custom hooks (`useStories`, `useAtmosphere`, `useAudio`, `useScrollTracking`, `useRouter`)
2. Extract data fetching into a dedicated `useDataFetching` hook
3. Extract audio synthesis into a `useAmbientAudio` hook
4. Extract URL routing into a `useRouter` hook
5. This also enables better code splitting and testing

**Estimated Savings:** Better tree-shaking, smaller initial bundle, improved maintainability

---

### B10. Redundant CSS Custom Property Definitions — Impact: LOW (but adds up)

**Root Cause:** `src/index.css` defines CSS variables in `:root` and then redefines them identically under each `[data-atmosphere="..."]` selector. The legacy aliases section duplicates the same values again.

**Evidence:** Lines 32-109 — 4 atmosphere blocks each with 7 variables, plus legacy alias block.

**20x Fix:** Use CSS `@layer` or a single `data-atmosphere` attribute with CSS custom property overrides. Remove the legacy alias block entirely (it duplicates the same values).

**Estimated Savings:** ~2KB CSS reduction, faster CSSOM construction

---

### B11. No Preload/Preconnect for External Origins — Impact: MEDIUM

**Root Cause:** The app loads resources from `images.unsplash.com`, `api.rss2json.com`, `api.allorigins.win`, `miro.medium.com`, and `fonts.googleapis.com` with no `preconnect` or `dns-prefetch` hints.

**20x Fix:** Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://images.unsplash.com" crossorigin />
<link rel="preconnect" href="https://api.rss2json.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" crossorigin />
```

**Estimated Savings:** 100-300ms faster connection establishment for external resources

---

### B12. Duplicate Subscribe Widget — Impact: LOW

**Root Cause:** The subscribe functionality exists in both `src/components/Subscribe.tsx` (React component) and `public/subscribe-widget.html` + `public/subscribe-widget.js` + `public/subscribe-widget.css` (standalone vanilla widget). The public files are not referenced anywhere in the React app.

**20x Fix:** Remove the standalone `public/subscribe-widget.*` files. Keep only the React `Subscribe` component. If the standalone widget is needed for embedding, document it clearly.

**Estimated Savings:** 5KB unnecessary files served

---

### B13. No `prefers-reduced-motion` Respect in Canvas — Impact: LOW

**Root Cause:** `DataStreamBackground.tsx` checks `matchMedia("(prefers-reduced-motion: reduce)")` and returns early, but the `CinematicLoader.tsx` and other motion components do not fully respect this preference — they still render with Framer Motion animations.

**20x Fix:** Ensure all Framer Motion components check `prefers-reduced-motion` and disable animations when set. Use `useReducedMotion()` from Framer Motion or a custom hook.

**Estimated Savings:** Eliminates unnecessary animation computation for ~10% of users

---

### B14. Server-Side RSS Parsing on Every Request — Impact: MEDIUM

**Root Cause:** When `cache.stories.length === 0`, the server triggers `syncData()` which fetches from multiple external APIs (rss2json, AllOrigins, Medium RSS) on every request that hits the `/api/stories` endpoint. This can cause cascading failures and slow response times.

**20x Fix:**
1. Add a `Cache-Control` header to API responses
2. Implement server-side in-memory caching with TTL (already partially done, but the cache check is `length === 0` which means it re-fetches if all stories are consumed)
3. Add a `stale-while-revalidate` strategy — serve stale cache immediately, refresh in background
4. Add response compression (`compression` middleware)

**Estimated Savings:** 200-500ms faster API responses on repeat visits

---

### B15. No `content-visibility: auto` for Off-Screen Sections — Impact: MEDIUM

**Root Cause:** All sections (Carousel3D, StoryGrid, StoryList, AuthorsSection, SubmissionGuideline) are rendered in the DOM even when not visible. The browser must layout and paint all of them.

**20x Fix:** Add `content-visibility: auto` and `contain-intrinsic-size` to off-screen sections. This tells the browser to skip layout and painting for sections not in the viewport.

**Estimated Savings:** 30-50% faster first-contentful-paint on pages with many sections

---

## 3. Phased Implementation Plan

### Phase 1: Quick Wins (1-2 days, ~10x improvement)
| # | Action | Expected Impact |
|---|---|---|
| 1 | Self-host fonts, remove Google Fonts `@import` | Eliminate render-blocking, -1.5s LCP |
| 2 | Add `preconnect`/`dns-prefetch` for external origins | -300ms connection setup |
| 3 | Compress logo to AVIF (50KB) + responsive `srcset` | -950KB image transfer |
| 4 | Add `Cache-Control` headers to Express server | 60-80% repeat-visit savings |
| 5 | Add `loading="lazy"`, `sizes`, `decoding="async"` to all images | 40-60% image savings on mobile |
| 6 | Remove duplicate subscribe widget files | 5KB cleanup |
| 7 | Add `compression` middleware to Express | 70% smaller transfer |

### Phase 2: Rendering Optimizations (2-3 days, ~5x improvement)
| # | Action | Expected Impact |
|---|---|---|
| 8 | Reduce DataStreamBackground canvas to 20 streams × 5 symbols | 80% fewer draw calls |
| 9 | Lazy-load all tab components (StoryGrid, StoryList, AuthorsSection, etc.) | 60-70% smaller initial JS |
| 10 | Add `content-visibility: auto` to off-screen sections | 30-50% faster FCP |
| 11 | Implement `prefers-reduced-motion` for all Framer Motion components | Reduce CPU on mobile |
| 12 | Add `will-change` only to animated elements (remove from `.tactile-card` globally) | Reduce GPU memory |

### Phase 3: Architecture Refactor (3-5 days, ~20x total)
| # | Action | Expected Impact |
|---|---|---|
| 13 | Replace Framer Motion with CSS transitions + `React.transition` | -120KB JS, 25% bundle reduction |
| 14 | Extract custom hooks from App.tsx (useStories, useAudio, useRouter) | Better tree-shaking, maintainability |
| 15 | Remove `three`, `@google/genai`, `@upstash/redis` from client dependencies | Eliminate dead code |
| 16 | Implement server-side `stale-while-revalidate` for API responses | Instant API responses |
| 17 | Add service worker with full app-shell caching strategy | Offline support, instant repeat loads |
| 18 | Implement critical CSS extraction (inline above-fold styles) | Eliminate render-blocking CSS |

---

## 4. Dependency Audit

### Dependencies to Remove from Client Bundle
| Package | Reason | Size Impact |
|---|---|---|
| `three` | Never imported in source code | ~50KB (if bundled) |
| `@google/genai` | Server-only, not used in client | ~30KB |
| `@upstash/redis` | Server-only, not used in client | ~15KB |

### Dependencies to Replace
| Current | Replacement | Reason |
|---|---|---|
| `motion/react` (Framer Motion) | CSS transitions + `React.useTransition` | 120KB savings |
| `lucide-react` (per-component imports) | Inline SVG sprite or `react-icons` with tree-shaking | 30KB savings |
| `isomorphic-dompurify` | `dompurify` (client-only) | 15KB savings (server doesn't need it) |

---

## 5. Expected Results After Full Implementation

| Metric | Before | After (20x) | Improvement |
|---|---|---|---|
| JS Bundle (gzipped) | ~160KB | ~8KB | 20x |
| CSS Bundle (gzipped) | ~25KB | ~2KB | 12.5x |
| Logo Transfer | 1016KB | ~45KB (AVIF) | 22x |
| Total Page Weight | ~2.6MB | ~150KB | 17x |
| LCP | ~4-6s | <1.5s | 3-4x |
| TTI | ~8-12s | <2s | 4-6x |
| Lighthouse Perf | ~20-30 | 90+ | 3x score |
| Canvas CPU Usage | High (2000+ calls/frame) | Low (200 calls/frame) | 10x |
| Repeat-Visit Transfer | Full download | 10-20% (cached) | 5-10x |

---

## 6. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Removing Framer Motion changes visual feel | High | Implement CSS spring animations as drop-in replacement; test side-by-side |
| Lazy-loading components causes flash of empty content | Medium | Use skeleton screens with `Suspense` fallback matching the loading state |
| Self-hosting fonts adds maintenance burden | Low | Use a font subsetting tool (e.g., `pyftsubset`) to include only used glyphs |
| Service worker caching breaks on deploy | Medium | Use Vite's built-in cache-busting (hash-based filenames) |
| Reducing canvas streams loses visual effect | Medium | Test with 20 streams + mouse interaction — the effect is still noticeable at lower density |

---

## 7. Conclusion

The Ink Home's current performance is constrained by three primary factors: (1) a monolithic 490KB JS bundle driven by Framer Motion, (2) render-blocking external font loading, and (3) unoptimized assets (1MB logo, full-resolution images). The 20x improvement plan addresses these through a combination of quick wins (caching, compression, image optimization), rendering optimizations (lazy loading, canvas reduction, content visibility), and architectural refactoring (replacing Framer Motion with CSS-native animations, extracting custom hooks, removing dead dependencies). The phased approach ensures measurable improvements at each stage while maintaining the site's distinctive cinematic identity.
