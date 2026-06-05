import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  mode?: "stellar" | "ink" | "forest" | "constellation";
  activeTab?: string;
}

export default function ThreeBackground({ mode = "stellar", activeTab }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleUniformsRef = useRef<{
    uProgress: { value: number };
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uInkColor: { value: THREE.Color };
  } | null>(null);
  const currentTabRef = useRef<string>("");

  useEffect(() => {
    if (activeTab && rippleUniformsRef.current) {
      // Trigger ink ripple bleed animation on tab switches
      if (currentTabRef.current && currentTabRef.current !== activeTab) {
        rippleUniformsRef.current.uProgress.value = 0.0;
      }
      currentTabRef.current = activeTab;
    }
  }, [activeTab]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Choose ambient background color based on theme mode
    let fogColor = 0x050508; // default deep void
    if (mode === "stellar") fogColor = 0x0a0a0f;      // Indigo slate stellar fog
    else if (mode === "ink") fogColor = 0x010206;     // Midnight ink black-blue
    else if (mode === "forest") fogColor = 0x060805;   // Deep moss wood pine shadows
    else if (mode === "constellation") fogColor = 0x030408; // Cybernetic network teal-black

    // Create Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogColor, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Setup Custom Particle Textures based on theme
    const genParticleTexture = (modeType: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.clearRect(0, 0, 64, 64);

        if (modeType === "ink") {
          // Typographic Glyph Canvas representation for "Writer's Ink" mode
          // Generate a typewriter ink-stamped character in circle
          const glyphs = ["i", "n", "k", "h", "o", "m", "e", "f", "x", "@", "&", "{", "}", "+"];
          const glyph1 = glyphs[Math.floor(Math.random() * glyphs.length)];
          const glyph2 = glyphs[Math.floor(Math.random() * glyphs.length)];

          // Ink glow backplane
          const radial = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          radial.addColorStop(0, "rgba(56, 189, 248, 0.4)");  // cyan glow center
          radial.addColorStop(0.3, "rgba(99, 102, 241, 0.25)"); // indigo shadow
          radial.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(32, 32, 32, 0, Math.PI * 2);
          ctx.fill();

          // Vector Text stamp
          ctx.font = "bold 26px 'Courier New', monospace, 'JetBrains Mono'";
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // Render overlapping glyphs to look like Calligraphic Ink Stains
          ctx.fillText(glyph1, 28, 30);
          ctx.font = "18px sans-serif";
          ctx.fillStyle = "rgba(14, 165, 233, 0.7)";
          ctx.fillText(glyph2, 42, 40);
        } else if (modeType === "forest") {
          // Warm glowing ember sparks for cozy forest fireplace
          const radial = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          radial.addColorStop(0, "rgba(255, 243, 219, 1.0)");
          radial.addColorStop(0.15, "rgba(245, 158, 11, 0.85)"); // bright amber
          radial.addColorStop(0.45, "rgba(234, 88, 12, 0.4)");   // dark orange fire
          radial.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(32, 32, 32, 0, Math.PI * 2);
          ctx.fill();
        } else if (modeType === "constellation") {
          // Clean pinpoint starry sparkles for neural connections
          const radial = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          radial.addColorStop(0, "rgba(255, 255, 255, 1.0)");
          radial.addColorStop(0.2, "rgba(16, 185, 129, 0.9)");  // emerald teal core
          radial.addColorStop(0.5, "rgba(59, 130, 246, 0.35)");  // cobalt halo
          radial.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(32, 32, 32, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stellar default cosmic glow
          const radial = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
          radial.addColorStop(0, "rgba(255, 255, 255, 1)");
          radial.addColorStop(0.2, "rgba(168, 85, 247, 0.8)"); // purple aura
          radial.addColorStop(0.6, "rgba(56, 189, 248, 0.2)");  // cyan ring bleed
          radial.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(32, 32, 32, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Create Cosmic Particle Arrays
    const particleCount = mode === "constellation" ? 120 : (mode === "forest" ? 220 : 180);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount); // Dynamic variable sizes

    // Custom velocities & offsets stored as plain metadata array for custom motion formulas
    const velocities: { x: number; y: number; z: number; speedMultiplier: number; wiggleFreq: number }[] = [];

    // Thematic color choices
    const colorCyan = new THREE.Color(0x06b6d4);
    const colorPurple = new THREE.Color(0x8b5cf6);
    const colorPink = new THREE.Color(0xec4899);
    const colorGold = new THREE.Color(0xf59e0b);
    const colorEmber = new THREE.Color(0xea580c);
    const colorMint = new THREE.Color(0x10b981);
    const colorSapphire = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount; i++) {
      let x = 0, y = 0, z = 0;
      let clr = colorCyan;

      if (mode === "forest") {
        // Firefly / fireplace embers: Spread throughout planar box floating upward
        x = (Math.random() - 0.5) * 60;
        y = (Math.random() - 0.5) * 50;
        z = (Math.random() - 0.5) * 35;
        // warm gold and ember gradients
        clr = Math.random() > 0.4 ? colorGold : colorEmber;
        sizes[i] = 0.8 + Math.random() * 2.2;
      } else if (mode === "ink") {
        // Watery ink suspension: Drifts in flat streamline bands
        x = (Math.random() - 0.5) * 70;
        y = (Math.random() - 0.5) * 45;
        z = (Math.random() - 0.5) * 20;
        // deep indigo, purple, and typewriter blue-grey
        clr = Math.random() > 0.6 ? colorPurple : (Math.random() > 0.3 ? colorCyan : colorPink);
        sizes[i] = 1.4 + Math.random() * 2.5;
      } else if (mode === "constellation") {
        // Star network nodes: spherical cluster
        const r = 12 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        clr = Math.random() > 0.5 ? colorMint : colorSapphire;
        sizes[i] = 1.0 + Math.random() * 1.5;
      } else {
        // Stellar spherical cosmos config
        const r = 20 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        clr = Math.random() > 0.65 ? colorPurple : (Math.random() > 0.3 ? colorCyan : colorPink);
        sizes[i] = 1.2 + Math.random() * 1.8;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = clr.r;
      colors[i * 3 + 1] = clr.g;
      colors[i * 3 + 2] = clr.b;

      // Metadatas for movement equations
      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: mode === "forest" ? (0.05 + Math.random() * 0.08) : (Math.random() - 0.5) * 0.04, // upward drift for embers
        z: (Math.random() - 0.5) * 0.02,
        speedMultiplier: 0.5 + Math.random() * 1.2,
        wiggleFreq: 0.3 + Math.random() * 1.2
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Points Material integration
    const material = new THREE.PointsMaterial({
      size: mode === "forest" ? 2.5 : 2.0,
      map: genParticleTexture(mode),
      vertexColors: true,
      transparent: true,
      opacity: mode === "forest" ? 0.9 : 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);

    // Setup geometric wireframes (The Astrolabe structures)
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);

    const wireframeColor = mode === "forest" ? 0xd97706 : (mode === "constellation" ? 0x059669 : 0xa855f7);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: mode === "forest" ? 0.03 : (mode === "ink" ? 0.04 : 0.09),
    });

    const rings: THREE.Mesh[] = [];
    
    // Only spawn the massive orbit rings in non-constellation and stellar modes
    if (mode === "stellar" || mode === "ink") {
      const sizesArray = [16, 26, 38];
      sizesArray.forEach((radius, idx) => {
        // Make ink rings look flat and script-like by sizing differently (like elliptical plates)
        const ringGeo = mode === "ink" 
          ? new THREE.TorusGeometry(radius, 0.1, 4, 32)
          : new THREE.IcosahedronGeometry(radius, 1);
        
        const ringMesh = new THREE.Mesh(ringGeo, wireframeMaterial);
        ringMesh.rotation.x = Math.random() * Math.PI;
        ringMesh.rotation.y = Math.random() * Math.PI;
        orbitsGroup.add(ringMesh);
        rings.push(ringMesh);
      });
    }

    // Dynamic Connections Line Renderer for Neural Constellations Mode
    let lineSegments: THREE.LineSegments | null = null;
    let linePositions: Float32Array;
    let lineColors: Float32Array;
    let maxConnections = 120;
    
    if (mode === "constellation") {
      const lineGeometry = new THREE.BufferGeometry();
      // 2 vertices per segment * 3 dims * maxConnections
      linePositions = new Float32Array(maxConnections * 2 * 3);
      lineColors = new Float32Array(maxConnections * 2 * 3);

      lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lineSegments);
    }

    // Add Ambient Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, mode === "forest" ? 0.25 : 0.15);
    scene.add(ambientLight);

    const lightColor1 = mode === "forest" ? 0xf59e0b : (mode === "constellation" ? 0x10b981 : 0x00d2ff);
    const lightColor2 = mode === "forest" ? 0xea580c : (mode === "constellation" ? 0x2563eb : 0x9d00ff);

    const pointLight1 = new THREE.PointLight(lightColor1, 1.5, 60);
    pointLight1.position.set(20, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(lightColor2, 1.5, 60);
    pointLight2.position.set(-20, -15, 10);
    scene.add(pointLight2);

    // Post-processing Ink Bleed Ripple Custom Shader Overlay Pass (Zero extra dependency)
    // Dynamic ink base colored on the current editor environment context
    let inkHex = 0x06122d; // Stellar classic ink
    if (mode === "ink") inkHex = 0x010204;
    else if (mode === "forest") inkHex = 0x040e06;
    else if (mode === "constellation") inkHex = 0x030818;

    const rippleUniforms = {
      uTime: { value: 0.0 },
      uProgress: { value: 1.0 }, // Initialized at 1.0 to prevent bleed rendering on initial paint
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uInkColor: { value: new THREE.Color(inkHex) }
    };
    rippleUniformsRef.current = rippleUniforms;

    const screenMeshGeo = new THREE.PlaneGeometry(2, 2);
    const screenMeshMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uResolution;
        uniform vec3 uInkColor;
        varying vec2 vUv;

        // Fast high-performing trigonometric pseudo-noise
        float noise(vec2 p) {
          return sin(p.x * 12.0 + sin(p.y * 7.0 + uTime * 1.5)) * cos(p.y * 9.0 + cos(p.x * 6.0));
        }

        void main() {
          if (uProgress >= 1.0) {
            discard; // Fully skip pixel pipeline when inactive to conserve execution cycles
          }

          vec2 aspectCorrected = vUv - 0.5;
          aspectCorrected.x *= uResolution.x / uResolution.y;
          float dist = length(aspectCorrected);

          // Bleed circle expansion boundary
          float radius = uProgress * 2.5;

          // Compute highly distorted fractal-like ripples representing ink flow channels
          float n = noise(vUv * 6.0) * 0.16;
          float n2 = sin(atan(aspectCorrected.y, aspectCorrected.x) * 6.0 + uTime * 0.5) * 0.09;
          float n3 = cos(atan(aspectCorrected.y, aspectCorrected.x) * 12.0 - uTime * 0.3) * 0.04;

          float distortedDist = dist + n + n2 + n3;

          // Create ink bleed core shape
          float edge = smoothstep(radius - 0.4, radius, distortedDist);
          float innerFriction = smoothstep(radius - 1.4, radius - 0.15, distortedDist);

          float shape = (1.0 - edge) * innerFriction;

          // Organic ease in-out of the overlay alpha profile
          float alpha = sin(uProgress * 3.14159) * 0.98;
          float finalBleed = clamp(shape * alpha, 0.0, 1.0);

          if (finalBleed < 0.005) {
            discard;
          }

          // Celestial ink coloring with contrasting highlights to emulate ink bleeding on paper fibers
          vec3 fringeColor = vec3(0.06, 0.71, 0.83); // glowing cyan halo rim
          vec3 baseInkColor = uInkColor;
          
          vec3 finalColor = mix(fringeColor, baseInkColor, smoothstep(0.15, 0.65, finalBleed));

          gl_FragColor = vec4(finalColor, finalBleed);
        }
      `,
      uniforms: rippleUniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const screenMesh = new THREE.Mesh(screenMeshGeo, screenMeshMat);
    screenMesh.renderOrder = 999;
    scene.add(screenMesh);

    // Mouse control parallax integration
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalise mouse vectors
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic sizing resize observer
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      // Update our shader uniform screen dimensions resolution!
      if (rippleUniformsRef.current) {
        rippleUniformsRef.current.uResolution.value.set(width, height);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastTime = performance.now();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Calculate independent delta time to prevent clock interference
      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      // Update shader uniforms
      if (rippleUniformsRef.current) {
        rippleUniformsRef.current.uTime.value = elapsedTime;
        
        if (rippleUniformsRef.current.uProgress.value < 1.0) {
          rippleUniformsRef.current.uProgress.value += deltaTime * 0.82; // Animates over ~1.2s
          if (rippleUniformsRef.current.uProgress.value > 1.0) {
            rippleUniformsRef.current.uProgress.value = 1.0;
          }
        }
      }

      // Mode-specific movement mechanics
      if (mode === "forest") {
        // FOREST EMBERS: Rise mimicking physical chimney sparks upwards with wind wiggles
        for (let i = 0; i < particleCount; i++) {
          const py = posAttr.getY(i);
          const px = posAttr.getX(i);
          const pz = posAttr.getZ(i);

          const vel = velocities[i];
          const nextY = py + vel.y * vel.speedMultiplier;
          // sway dynamically with sine frequency
          const wiggle = Math.sin(elapsedTime * vel.wiggleFreq + i) * 0.05;
          const nextX = px + wiggle + vel.x * 0.1;

          // If ember reaches top, wrap to bottom of screen box
          if (nextY > 30) {
            posAttr.setY(i, -30);
            posAttr.setX(i, (Math.random() - 0.5) * 60);
          } else {
            posAttr.setY(i, nextY);
            posAttr.setX(i, nextX);
          }
        }
        posAttr.needsUpdate = true;
        
        // Gentle scene rotation
        starParticles.rotation.y = elapsedTime * 0.01;

      } else if (mode === "ink") {
        // WRITER'S INK: Fluid floating streamlines with periodic sinusoidal swell
        for (let i = 0; i < particleCount; i++) {
          const py = posAttr.getY(i);
          const px = posAttr.getX(i);
          const pz = posAttr.getZ(i);
          const vel = velocities[i];

          // Slowly float ink along circular/spiral trajectories
          const swirlSpeed = 0.005 * vel.speedMultiplier;
          const theta = elapsedTime * swirlSpeed + i;
          
          // Ripple positions like ink diluting in high-concept stream paths
          const rippleX = px + Math.sin(theta) * 0.015;
          const rippleY = py + Math.cos(theta) * 0.015;
          
          posAttr.setX(i, rippleX);
          posAttr.setY(i, rippleY);
        }
        posAttr.needsUpdate = true;

        // Astrolabe rings rotate with heavy fluid pace
        rings.forEach((ring, index) => {
          ring.rotation.z = elapsedTime * (0.015 * (index + 1));
          ring.rotation.y = elapsedTime * (0.008 * (index + 1));
        });
        
        starParticles.rotation.y = elapsedTime * 0.02;

      } else if (mode === "constellation") {
        // NEURAL CONSTELLATION NODE drift and connection calculations
        for (let i = 0; i < particleCount; i++) {
          const px = posAttr.getX(i);
          const py = posAttr.getY(i);
          const pz = posAttr.getZ(i);
          const vel = velocities[i];

          // Small random walking floating drift inside coordinate caps
          let nextX = px + vel.x * 0.3;
          let nextY = py + vel.y * 0.3;
          let nextZ = pz + vel.z * 0.3;

          // Bounce back from spherical limits
          const distFromOrig = Math.sqrt(nextX * nextX + nextY * nextY + nextZ * nextZ);
          if (distFromOrig > 38) {
            vel.x = -vel.x;
            vel.y = -vel.y;
            vel.z = -vel.z;
          }

          posAttr.setX(i, nextX);
          posAttr.setY(i, nextY);
          posAttr.setZ(i, nextZ);
        }
        posAttr.needsUpdate = true;
        
        starParticles.rotation.y = elapsedTime * 0.015;
        starParticles.rotation.x = elapsedTime * 0.005;

        // Perform geometric connection distance check and build drawing array
        if (lineSegments && linePositions && lineColors) {
          let lineIndex = 0;
          
          // Check particle nodes pairs (N^2 check restricted to keep performance flawless)
          for (let i = 0; i < Math.min(particleCount, 80); i++) {
            if (lineIndex >= maxConnections) break;

            const ix = posAttr.getX(i);
            const iy = posAttr.getY(i);
            const iz = posAttr.getZ(i);

            for (let j = i + 1; j < Math.min(particleCount, 80); j++) {
              if (lineIndex >= maxConnections) break;

              const jx = posAttr.getX(j);
              const jy = posAttr.getY(j);
              const jz = posAttr.getZ(j);

              // Calculate geometric distance
              const dx = ix - jx;
              const dy = iy - jy;
              const dz = iz - jz;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

              // Create lines between close mental nodes
              if (dist < 13.5) {
                // Set vertex coordinates for connection line segment
                const idx1 = lineIndex * 6;
                const idx2 = lineIndex * 6 + 3;

                linePositions[idx1] = ix;
                linePositions[idx1 + 1] = iy;
                linePositions[idx1 + 2] = iz;

                linePositions[idx2] = jx;
                linePositions[idx2 + 1] = jy;
                linePositions[idx2 + 2] = jz;

                // Color lines with a smooth gradient matching node proximity
                const pct = 1.0 - (dist / 13.5); // Closer = brighter glow
                const lineCol = Math.random() > 0.5 ? colorMint : colorSapphire;

                const colorIdx1 = lineIndex * 6;
                const colorIdx2 = lineIndex * 6 + 3;

                lineColors[colorIdx1] = lineCol.r * pct * 0.8;
                lineColors[colorIdx1 + 1] = lineCol.g * pct * 0.8;
                lineColors[colorIdx1 + 2] = lineCol.b * pct * 0.8;

                lineColors[colorIdx2] = lineCol.r * pct * 0.8;
                lineColors[colorIdx2 + 1] = lineCol.g * pct * 0.8;
                lineColors[colorIdx2 + 2] = lineCol.b * pct * 0.8;

                lineIndex++;
              }
            }
          }

          lineSegments.geometry.getAttribute("position").needsUpdate = true;
          lineSegments.geometry.getAttribute("color").needsUpdate = true;
          lineSegments.geometry.setDrawRange(0, lineIndex * 2);
        }

      } else {
        // STELLAR (Default Cosmos Mode): Pure spherical rotation
        const speedScale = currentTabRef.current === "story" ? 2.5 : 1.0;
        starParticles.rotation.y = elapsedTime * 0.035 * speedScale;
        starParticles.rotation.x = elapsedTime * 0.012 * speedScale;

        rings.forEach((ring, index) => {
          ring.rotation.x += 0.001 * (index + 1) * speedScale;
          ring.rotation.y += 0.002 * (index + 2) * speedScale;
        });
      }

      // Camera Z distance transition based on active tab
      const targetZ = currentTabRef.current === "story" ? 18 : 35;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      // Camera parallax smooth inertia calculations
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up WebGL thread instances on mode transitions or unmount to avoid memory leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
      screenMeshGeo.dispose();
      screenMeshMat.dispose();
      if (lineSegments) {
        lineSegments.geometry.dispose();
        (lineSegments.material as THREE.Material).dispose();
      }
    };
  }, [mode]); // Re-initialize the setup cleanly when the atmospheric mode changes

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      id="3d-scene-container"
    />
  );
}
