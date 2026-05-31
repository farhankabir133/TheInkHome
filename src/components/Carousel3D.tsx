import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Story } from "../types";
import { ChevronLeft, ChevronRight, ArrowUpRight, Flame, Layers, Heart, Bookmark } from "lucide-react";
import { getLikesCount } from "../lib/interaction";
import AvatarImage from "./AvatarImage";

interface Carousel3DProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  likedSlugs: string[];
  savedSlugs: string[];
  onToggleLike: (slug: string) => void;
  onToggleSave: (slug: string) => void;
}

export default function Carousel3D({ 
  stories, 
  onSelectStory,
  likedSlugs,
  savedSlugs,
  onToggleLike,
  onToggleSave
}: Carousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay loop
  useEffect(() => {
    if (!autoplay || stories.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoplay, stories.length]);

  const handleNext = () => {
    if (stories.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    if (stories.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Drag and swipe mechanics
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    setAutoplay(false); // Pause autoplay on drag
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    
    // Swipe sensitivity threshold
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      setIsDragging(false); // Action taken, reset drag
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="font-mono text-sm tracking-widest uppercase">Initializing Quantum Scribe Link...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col items-center justify-center py-12 select-none w-full xl:max-w-6xl mx-auto"
      id="3d-carousel-root"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Perspective Container */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-[32rem] overflow-visible cursor-grab active:cursor-grabbing touch-none px-4"
        style={{ perspective: "1000px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <AnimatePresence mode="popLayout">
          {stories.map((story, idx) => {
            // Calculate spatial offset relative to active story
            let offset = idx - activeIndex;
            
            // Loop offset correctly for seamless infinite circle effect
            if (offset < -Math.floor(stories.length / 2)) {
              offset += stories.length;
            } else if (offset > Math.floor(stories.length / 2)) {
              offset -= stories.length;
            }

            const isActive = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Render only items in proximity
            if (absOffset > 2) return null;

            // Compute custom custom spatial translations
            const rotateY = offset * -32; // Inward angle rotation
            const translateX = offset * 130; // X offset gap
            const translateZ = absOffset * -150; // Deep spatial Z retreat
            const scale = 1 - absOffset * 0.15; // Depth scaling
            const opacity = 1 - absOffset * 0.35; // Depth fog fade

            return (
              <motion.div
                key={story.slug}
                className="absolute w-[18rem] sm:w-[22rem] md:w-[25rem] group"
                id={`carousel-card-${story.slug}`}
                style={{
                  zIndex: stories.length - absOffset,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: translateX,
                  y: 0,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 18,
                }}
                onClick={() => {
                  if (isActive) {
                    onSelectStory(story);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
              >
                {/* Story Panel Board */}
                <div className={`relative flex flex-col justify-between h-[26rem] p-6 rounded-none border bg-black/80 transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? "border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.25)] bg-[#0c0c0c]" 
                    : "border-white/10 hover:border-white/20"
                }`}>
                  
                  {/* Subtle Neon Accents inside card */}
                  <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-500 ${
                    isActive ? "bg-cyan-400" : "bg-transparent"
                  }`} />

                  {/* Ambient Glow behind image */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-none opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl pointer-events-none" />

                  {/* Top: Image Section */}
                  <div className="relative w-full h-44 rounded-none overflow-hidden mb-4 border border-white/10 z-10 select-none">
                    <img
                      src={story.cover}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Floating Categories */}
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {story.categories.slice(0, 2).map((cat, cIdx) => (
                        <span 
                          key={cIdx} 
                          className="px-2 py-0.5 rounded-none font-mono text-[9px] tracking-widest uppercase bg-cyan-950/90 text-cyan-400 border border-cyan-500/20"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Auto-Rotation Flare indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-none bg-cyan-500 text-black text-[9px] font-mono tracking-widest uppercase font-black">
                        <Flame className="w-2.5 h-2.5" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Middle: Content Section */}
                  <div className="flex-1 flex flex-col justify-between z-10">
                    <div>
                      {/* Author Line */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <AvatarImage 
                            src={story.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                            alt={story.author}
                            className="w-5 h-5 rounded-none object-cover border border-white/15" 
                          />
                          <span className="text-[11px] font-mono tracking-wider text-slate-400">
                            {story.author}
                          </span>
                        </div>
                        
                        {/* Interactive heart & save controls */}
                        <div className="flex items-center gap-2.5 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(story.slug);
                            }}
                            className={`p-1 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono ${
                              likedSlugs.includes(story.slug) ? "text-cyan-400 font-bold" : "text-slate-500 hover:text-cyan-400"
                            }`}
                            title={likedSlugs.includes(story.slug) ? "Unlike" : "Like"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${likedSlugs.includes(story.slug) ? "fill-current text-cyan-400" : ""}`} />
                            <span>{getLikesCount(story.title, likedSlugs.includes(story.slug))}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSave(story.slug);
                            }}
                            className={`p-1 hover:text-cyan-400 transition-colors cursor-pointer ${
                              savedSlugs.includes(story.slug) ? "text-cyan-400" : "text-slate-500 hover:text-cyan-400"
                            }`}
                            title={savedSlugs.includes(story.slug) ? "Remove bookmark" : "Bookmark"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedSlugs.includes(story.slug) ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className={`font-sans tracking-tight transition-all duration-300 ${
                        isActive ? "text-lg text-white font-bold uppercase" : "text-base text-gray-300"
                      }`}>
                        {story.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed font-light">
                        {story.description}
                      </p>
                    </div>

                    {/* Bottom: Date & Interactive trigger */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        {new Date(story.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      
                      {isActive && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-bold group-hover:text-white transition-colors">
                          Enter Cosmos
                          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Manual UI Navigation Row */}
      <div className="flex items-center gap-6 mt-8 z-20">
        <button
          onClick={handlePrev}
          className="p-3 bg-[#111111] border border-white/10 text-white/70 hover:text-black hover:bg-cyan-500 hover:border-cyan-500 active:scale-95 transition-all duration-300 cursor-pointer"
          id="prev-carousel-btn"
          aria-label="Previous story card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Pagination Pips */}
        <div className="flex items-center gap-1.5">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setAutoplay(false);
              }}
              className={`h-1.5 transition-all duration-500 rounded-none cursor-pointer ${
                index === activeIndex 
                  ? "w-8 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Jump to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-[#111111] border border-white/10 text-white/70 hover:text-black hover:bg-cyan-500 hover:border-cyan-500 active:scale-95 transition-all duration-300 cursor-pointer"
          id="next-carousel-btn"
          aria-label="Next story card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Help Note on drag orientation */}
      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-4">
        <span>Drag or click outer cards to rotate</span>
      </p>
    </div>
  );
}
