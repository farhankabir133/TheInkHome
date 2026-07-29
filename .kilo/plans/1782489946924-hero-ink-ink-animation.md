# Insane Hero Background Animation Plan

## Brand Context
**The Ink Home** is a spatial literature publication merging "spatial typography, code shaders, and cyber-philosophical stories." Current hero uses generic 3D particles that don't reflect the "ink" or "publication" identity.

## Proposed Animation: "Ink Glyph Constellation Nexus"

### Core Concept
Replace the generic particle system with an expressive **ink-and-paper physics simulation** that represents storytelling emerging from the void. The hero becomes a living manuscript where ink droplets coalesce into floating words, forming constellations of stories.

### Key Visual Layers

**1. Ink Droplet Physics Layer (Primary)**
- 200-300 ink droplet particles with fluid surface tension simulation
- Each droplet contains micro-glyphs (letters from story titles) visible under magnification
- Droplets merge on collision with organic "ink bleed" shader effects
- Velocity responds to mouse movement with viscous drag physics

**2. Typographic Glyph Swarm Layer (Midground)**
- Floating transparent glyphs (letters from "The Ink Home" + story titles) as instanced meshes
- Glyphs form magnetic clusters around invisible "story nodes"
- On hover, glyphs surge toward cursor forming temporary words
- Physics-based repulsion/attraction with tunable magnetic fields

**3. Paper Fiber Depth Field (Background)**
- Subtle paper texture shader with parallax fiber lines
- Fiber density increases toward center creating vignette effect
- Micro-paper fibers subtly shift revealing hidden words/text under cursor

**4. Ink Bleed Transition Shader (Overlay)**
- Full-screen shader pass for ink bleed effects on tab transitions
- Radial waves emanate from click points with fractal noise boundaries
- Color matches current atmosphere mode

### Animation Sequences

**On Landing Page Load:**
1. Black void fades in
2. Single ink droplet spawns at center, blooms into "THE INK HOME" glyphs
3. Glyphs scatter outward forming constellation of 12-15 story nodes
4. Each node pulses with orbital story particles
5. Camera performs slow 8-second reveal arc

**On Scroll/Interaction:**
- Parallax particles accelerate with scroll velocity
- Glyph opacity increases on upward scroll (revealing text), decreases on downward
- Ink viscosity parameter shifts based on scroll speed

**On Tab Switch:**
- Ink ripple originates from click, dissolves current view
- New atmosphere color bleeds across screen
- Glyphs reform into new pattern for new view

### Technical Implementation

**New Component:** `InkNexusHero.tsx`
- Extend Three.js with custom shaders (no new dependencies)
- Use WebGL2 features: OES_texture_float for fluid dynamics
- Implement GPU-based collision detection via shader tricks
- Raycasting for glyph interaction with mouse hover

**Shader Innovations:**
- Vertex shader uses curl noise for organic fluid motion
- Fragment shader implements ink spread with distance field text
- Custom metaball blending for droplet merging

**Performance Guardrails:**
- Adaptive LOD: reduce glyph count on mobile
- Frustum culling for off-screen particles
- Shader complexity clamped based on device pixel ratio

### Assets Required
- Font texture atlas for glyphs (procedural from Space Grotesk)
- Noise textures for fluid distortion (procedural)
- No external assets needed

### Integration Points
- Replace `ThreeBackground.tsx` or augment with `InkNexusHero`
- Hook into existing `bgMode` state for color themes
- Connect to scroll velocity from App.tsx

**Glyph Choice:** Actual rendered text glyphs from story titles (Space Grotesk) for readability
**Audio Integration:** Sync ink droplet pulses to existing ambient audio system
**Reduced Motion:** Auto-disable physics animations when `prefers-reduced-motion` is set

## Success Metrics
- Hero immediately communicates "spatial literature" concept
- Animation feels premium, not templated
- Maintains 60fps on mid-range devices
- Works in reduced motion preference mode

## Implementation Steps
1. Create InkNexusHero component with base Three.js scene
2. Implement ink droplet physics with GPU-based collision
3. Build glyph instancing system for story text
4. Add paper fiber background shader
5. Create ink bleed transition shader
6. Integrate with App.tsx and atmosphere modes
7. Add performance optimizations and fallbacks