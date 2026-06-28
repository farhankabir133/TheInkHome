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
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

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
    setDragOffset(0);
    dragStartX.current = e.clientX;
    setAutoplay(false); // Pause autoplay on drag
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
    
    // Swipe sensitivity threshold
    if (Math.abs(diff) > 75) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragOffset(0);
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
      className="relative flex flex-col items-center justify-center py-8 sm:py-12 select-none w-full xl:max-w-6xl mx-auto"
      id="3d-carousel-root"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Perspective Container */}
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-[20rem] sm:h-[24rem] md:h-[28rem] overflow-visible cursor-grab active:cursor-grabbing touch-none px-2 sm:px-4"
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

            // Calculate distinct, viewport-aware spatial coordinates
            let rotateY = offset * -32;
            let translateX = offset * 130;
            let translateZ = absOffset * -150;
            let scale = 1 - absOffset * 0.15;
            let opacity = 1 - absOffset * 0.35;

            if (isMobile) {
              rotateY = offset * -15;
              translateX = offset * 65;
              translateZ = absOffset * -80;
              scale = 1 - absOffset * 0.12;
              opacity = 1 - absOffset * 0.55;
            } else if (isTablet) {
              rotateY = offset * -24;
              translateX = offset * 100;
              translateZ = absOffset * -110;
              scale = 1 - absOffset * 0.14;
              opacity = 1 - absOffset * 0.45;
            } else if (windowWidth >= 1024 && windowWidth < 1440) {
              // Desktop (1024-1440)
              rotateY = offset * -28;
              translateX = offset * 125;
              translateZ = absOffset * -135;
              scale = 1 - absOffset * 0.15;
              opacity = 1 - absOffset * 0.35;
            } else {
              // Ultrawide (>1440)
              rotateY = offset * -32;
              translateX = offset * 160;
              translateZ = absOffset * -160;
              scale = 1 - absOffset * 0.15;
              opacity = 1 - absOffset * 0.35;
            }

            return (
                <motion.div
                  key={story.slug}
                  className="absolute w-[13rem] xs:w-[15rem] sm:w-[17.5rem] md:w-[21rem] lg:w-[23rem] max-w-[85vw] group"
                  id={`carousel-card-${story.slug}`}
                  style={{
                    zIndex: stories.length - absOffset,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    x: translateX + (isActive ? dragOffset : 0),
                    y: 0,
                    z: translateZ,
                    rotateY: isActive ? rotateY + (dragOffset * 0.02) : rotateY,
                    scale: isActive ? Math.max(0.95, scale - Math.abs(dragOffset) * 0.0005) : scale,
                    opacity: opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    mass: 0.8
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (isActive) {
                      onSelectStory(story);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                >
                  {/* Story Panel Board - Glass Card */}
                  <div className={`relative flex flex-col justify-between h-[18rem] xs:h-[20rem] sm:h-[24rem] md:h-[25rem] p-3 sm:p-5 rounded-none border transition-all duration-300 overflow-hidden glass-card ${
                    isActive 
                      ? "border-[var(--atmo-text)] shadow-[0_0_40px_var(--atmo-glow),0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-[#070709]/95" 
                      : "border-white/5 hover:border-white/15 bg-black/60 shadow-lg"
                  }`}>
                  
                  {/* Subtle Neon Accents inside card */}
                  <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-500 ${
                    isActive ? "bg-[var(--atmo-text)] atmosphere-bg" : "bg-transparent"
                  }`} />

                  {/* Ambient Glow behind image */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--atmo-text)]/20 to-[var(--atmo-text)]/10 rounded-none opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl pointer-events-none" />

                   {/* Top: Image Section */}
                   <div className="relative w-full h-28 sm:h-36 md:h-40 rounded-none overflow-hidden mb-3 sm:mb-4 border border-white/5 z-10 select-none">
                     <img
                       src={story.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"}
                       alt={story.title}
                       referrerPolicy="no-referrer"
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                       }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
                    
                    {/* Floating Categories */}
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {story.categories.slice(0, 2).map((cat, cIdx) => (
                        <span 
                          key={cIdx} 
                          className="px-2 py-0.5 rounded-none font-mono text-[8px] sm:text-[9px] tracking-widest uppercase bg-black/80 text-[var(--atmo-text)] border border-[var(--atmo-text)]/20"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Auto-Rotation Flare indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-none bg-[var(--atmo-text)] text-black text-[8px] sm:text-[9px] font-mono tracking-widest uppercase font-black shadow-[0_0_8px_var(--atmo-glow)]">
                        <Flame className="w-2.5 h-2.5" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Middle: Content Section */}
                  <div className="flex-1 flex flex-col justify-between z-10">
                    <div>
                      {/* Author Line */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <AvatarImage 
                            src={story.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                            alt={story.author}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-none object-cover border border-white/10" 
                          />
                          <span className="text-[9px] sm:text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-400">
                            {story.author}
                          </span>
                        </div>
                        
                        {/* Interactive heart & save controls */}
                        <div className="flex items-center gap-1 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(story.slug);
                            }}
                            className={`p-1 transition-colors cursor-pointer flex items-center gap-1 text-[9px] sm:text-[10px] font-mono min-w-[28px] min-h-[28px] justify-center ${
                              likedSlugs.includes(story.slug) ? "text-[var(--atmo-text)] font-bold" : "text-slate-500 hover:text-[var(--atmo-text)]"
                            }`}
                            title={likedSlugs.includes(story.slug) ? "Unlike" : "Like"}
                          >
                            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${likedSlugs.includes(story.slug) ? "fill-current text-[var(--atmo-text)]" : ""}`} />
                            <span>{getLikesCount(story.title, likedSlugs.includes(story.slug))}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSave(story.slug);
                            }}
                            className={`p-1 transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center ${
                              savedSlugs.includes(story.slug) ? "text-[var(--atmo-text)]" : "text-slate-500 hover:text-[var(--atmo-text)]"
                            }`}
                            title={savedSlugs.includes(story.slug) ? "Remove bookmark" : "Bookmark"}
                          >
                            <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${savedSlugs.includes(story.slug) ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className={`font-sans tracking-tight transition-all duration-300 text-sm sm:text-base ${
                        isActive ? "text-white font-bold uppercase" : "text-gray-300"
                      }`}>
                        {story.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[10px] sm:text-[11px] sm:text-xs text-gray-400 line-clamp-2 mt-1 sm:mt-2 leading-relaxed font-light hidden sm:block">
                        {story.description}
                      </p>
                    </div>

                    {/* Bottom: Date & Interactive trigger */}
                    <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-white/5">
                      <span className="text-[8px] sm:text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        {new Date(story.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      
                      {isActive && (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-[var(--atmo-text)] font-bold group-hover:text-white transition-colors">
                          Enter Cosmos
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--atmo-text)]" />
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
      <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8 z-20">
        <button
          onClick={handlePrev}
          className="p-2.5 sm:p-3 bg-[#111113]/80 border border-white/5 text-white/70 hover:text-black hover:bg-[var(--atmo-text)] hover:border-[var(--atmo-text)] active:scale-95 transition-all duration-300 cursor-pointer rounded-full shadow-lg"
          id="prev-carousel-btn"
          aria-label="Previous story card"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dynamic Pagination Pips */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setAutoplay(false);
              }}
              className={`h-2 w-2 sm:h-1.5 sm:w-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                index === activeIndex 
                  ? "w-5 sm:w-8 bg-[var(--atmo-text)] shadow-[0_0_8px_var(--atmo-glow)]" 
                  : "w-2 sm:w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Jump to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2.5 sm:p-3 bg-[#111113]/80 border border-white/5 text-white/70 hover:text-black hover:bg-[var(--atmo-text)] hover:border-[var(--atmo-text)] active:scale-95 transition-all duration-300 cursor-pointer rounded-full shadow-lg"
          id="next-carousel-btn"
          aria-label="Next story card"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      
      {/* Help Note on drag orientation */}
      <p className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-3 sm:mt-4">
        <span>Drag or click outer cards to rotate</span>
      </p>
    </div>
  );
}
