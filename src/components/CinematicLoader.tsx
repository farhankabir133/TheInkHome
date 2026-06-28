import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [phase, setPhase] = useState<"init" | "reveal" | "enter">("init");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 300);
    const t2 = setTimeout(() => setPhase("enter"), 2200);
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          {/* Cinematic grain + vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay noise-overlay pointer-events-none" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6">
            {/* Decorative markers */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-24 h-px bg-white/20 mb-8 origin-left"
            />

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic uppercase leading-[0.85] tracking-tighter font-display bg-gradient-to-r from-white via-[var(--atmo-text)] to-[var(--atmo-text)] bg-clip-text text-transparent select-none"
                style={{ textShadow: "0 0 80px var(--atmo-glow)" }}
              >
                The Ink<br />Home
              </h1>
            </motion.div>

            {/* Subtitle with typewriter feel */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-6 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-white/50 text-center max-w-md"
            >
              Initializing spatial narrative matrix
            </motion.p>

            {/* Cinematic progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-10 w-64 sm:w-80 h-[2px] bg-white/5 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase === "enter" ? 1 : 0.6 }}
                transition={{
                  duration: phase === "enter" ? 0.6 : 2.2,
                  ease: "easeInOut",
                }}
                className="h-full bg-gradient-to-r from-transparent via-[var(--atmo-text)] to-transparent origin-left"
                style={{ boxShadow: "0 0 12px var(--atmo-glow)" }}
              />
            </motion.div>

            {/* Bottom status line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.25em] text-white/30"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--atmo-text)] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--atmo-text)]" />
              </span>
              <span>System Online</span>
            </motion.div>

            {/* Decorative corner brackets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute top-8 left-8 w-8 h-8 border-l border-t border-white/20"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute top-8 right-8 w-8 h-8 border-r border-t border-white/20"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-white/20"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-white/20"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
