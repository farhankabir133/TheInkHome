import React from "react";
import { motion } from "motion/react";
import { Story } from "../types";
import { ChevronRight, ExternalLink, Radio } from "lucide-react";
import Subscribe from "./Subscribe";
import { Logo } from "./Logo";

interface LandingPageProps {
  key?: string;
  stories: Story[];
  loading: boolean;
  coords: { x: number; y: number };
  scrollY: number;
  onEnterWebsite: () => void;
  onSelectStory: (story: Story | null) => void;
  navigateTo: (path: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onSetEntered: (entered: boolean) => void;
}

export default function LandingPage({
  stories,
  loading,
  onEnterWebsite,
  onSelectStory,
  navigateTo,
  coords,
  scrollY,
  onMouseMove,
  onSetEntered,
}: LandingPageProps) {
  return (
    <motion.div
      key="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        (e.currentTarget as any).__coordsSetter?.({ x, y });
      }}
      className="relative min-h-screen flex flex-col justify-between z-10 px-6 py-8"
    >
      <header className="w-full flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Logo size={46} textColor="text-slate-200" />
        </div>
        <a
          href="https://medium.com/the-ink-home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-[var(--atmo-text)] hover:border-[var(--atmo-border)] transition-all border border-transparent px-3 py-1.5 rounded bg-white/5"
          id="landing-medium-link"
        >
          MEDIUM EDITION <ExternalLink className="w-3 h-3 text-[var(--atmo-text)]" />
        </a>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto my-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-1.5 bg-[var(--atmo-surface)] border border-[var(--atmo-border)] rounded text-[10px] font-bold tracking-[0.2em] text-[var(--atmo-text)] uppercase">
            Featured Edition — Vol. 082
          </div>
          <h1
            style={{
              letterSpacing: `${-0.05 + Math.abs(coords.x) * 0.03}em`,
              transform: `perspective(1000px) rotateY(${coords.x * 12}deg) rotateX(${-coords.y * 12}deg) translateY(${scrollY * -0.1}px)`,
              textShadow: `${-coords.x * 12}px ${-coords.y * 12}px 24px var(--atmo-glow)`,
              transition: "transform 0.08s ease-out, letter-spacing 0.15s ease-out, text-shadow 0.15s ease-out",
            }}
            className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-black tracking-tighter mb-6 italic uppercase font-display bg-gradient-to-r from-white via-[var(--atmo-text)] to-[var(--atmo-text)] bg-clip-text text-transparent select-none"
          >
            The Ink<br />Home
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed font-light tracking-wide">
            Where spatial typography, code shaders, and cyber-philosophical stories merge into floating geometric objects in space.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button
            onClick={onEnterWebsite}
            className="px-8 py-4 bg-white text-black font-extrabold uppercase tracking-[0.2em] text-[11px] hover:bg-[var(--atmo-text)] hover:scale-102 hover:shadow-[0_0_35px_var(--atmo-glow)] transition-all duration-300 cursor-pointer flex items-center gap-2.5 z-20 mx-auto"
            id="enter-portal-btn"
          >
            Enter The Ink Home
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-4 h-4 border border-[var(--atmo-text)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500">
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[var(--atmo-text)] animate-pulse" />
                SATELLITE MAGAZINE LOOP
              </span>
              <span>Scroll or Click items to read</span>
            </div>

            <div className="max-w-4xl mx-auto mb-4 px-4">
              <Subscribe />
            </div>

            <div className="relative w-full overflow-hidden border-t border-b border-white/10 py-4 bg-black/40 backdrop-blur-sm">
              <div className="flex gap-4 animate-marquee hover:pause whitespace-nowrap">
                {stories.map((story) => (
                  <div
                    key={story.slug}
                    onClick={() => {
                      onSelectStory(story);
                      onSetEntered(true);
                      navigateTo(`/story/${story.slug}`);
                    }}
                          className="inline-flex items-center gap-3 px-4 py-2 border border-white/5 hover:border-[var(--atmo-border)] hover:bg-white/[0.02] transition-all cursor-pointer text-left"
                  >
<img
                       src={story.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"}
                       alt=""
                       className="w-8 h-8 rounded-none object-cover border border-white/10"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80";
                       }}
                     />
                    <div>
                      <p className="text-[11px] font-bold text-white line-clamp-1 max-w-[180px] uppercase tracking-wider">
                        {story.title}
                      </p>
                      <span className="text-[9px] font-mono text-[var(--atmo-text)] uppercase tracking-widest">
                        by {story.author}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
