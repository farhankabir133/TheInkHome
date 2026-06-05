import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Story } from "../types";
import { ArrowUpRight, Heart, Bookmark } from "lucide-react";
import { getLikesCount } from "../lib/interaction";
import AvatarImage from "./AvatarImage";

interface StoryGridProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  likedSlugs: string[];
  savedSlugs: string[];
  onToggleLike: (slug: string) => void;
  onToggleSave: (slug: string) => void;
}

export default function StoryGrid({ 
  stories, 
  onSelectStory,
  likedSlugs,
  savedSlugs,
  onToggleLike,
  onToggleSave
}: StoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Dynamically extract all available unique categories across stories
  const categories = useMemo(() => {
    const list = new Set<string>();
    stories.forEach((story) => {
      story.categories.forEach((cat) => {
        if (cat) list.add(cat);
      });
    });
    return ["All", ...Array.from(list).slice(0, 8)];
  }, [stories]);

  // Filter items in memory
  const filteredStories = useMemo(() => {
    if (selectedCategory === "All") return stories;
    return stories.filter((story) =>
      story.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [stories, selectedCategory]);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-4" id="story-grid-root">
      {/* Dynamic Filters Nav Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 overflow-x-auto custom-scrollbar max-w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer border rounded-full ${
              selectedCategory === category
                ? "bg-white text-black border-white font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                : "bg-white/[0.02] text-slate-400 border-white/5 hover:border-[var(--glow-text)]/40 hover:text-[var(--glow-text)] hover:shadow-[0_0_12px_var(--glow-bg)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Canvas */}
      {filteredStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] border border-white/5 bg-black/40 rounded-none">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">No matching stories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              layout
              key={story.slug}
              className="group cursor-pointer glass-card overflow-hidden flex flex-col justify-between h-[25rem] hover:border-[var(--glow-text)]/30 hover:shadow-[0_0_30px_var(--glow-bg)] transition-all duration-500"
              onClick={() => onSelectStory(story)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              id={`grid-card-${story.slug}`}
            >
              {/* Media Section */}
              <div className="relative w-full h-44 overflow-hidden border-b border-white/5">
                <img
                  src={story.cover}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
                
                {/* Floating Date Badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-none font-mono text-[9px] uppercase tracking-wider bg-black border border-white/5 text-slate-300">
                  {new Date(story.pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
 
                {/* Primary Tag */}
                {story.categories[0] && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-none font-mono text-[9px] uppercase tracking-wider bg-black/80 text-[var(--glow-text)] border border-[var(--glow-text)]/25">
                    {story.categories[0]}
                  </span>
                )}
              </div>
 
              {/* Data Section */}
              <div className="flex-1 p-5 flex flex-col justify-between bg-black/20">
                <div>
                  {/* Author Line */}
                  <div className="flex items-center gap-2 mb-2">
                    <AvatarImage 
                      src={story.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                      alt={story.author} 
                      className="w-4 h-4 rounded-none object-cover border border-white/5" 
                    />
                    <span className="text-[11px] font-mono text-slate-400">
                      {story.author}
                    </span>
                  </div>
 
                  {/* Title */}
                  <h3 className="font-sans font-medium text-white text-base group-hover:text-[var(--glow-text)] line-clamp-2 leading-snug transition-colors">
                    {story.title}
                  </h3>
 
                  {/* Snippet Description */}
                  <p className="text-xs mt-2.5 text-slate-400 line-clamp-2 leading-relaxed h-[2.5rem] font-light">
                    {story.description}
                  </p>
                </div>
 
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono mt-4">
                  <span className="text-slate-500">
                    by {story.role || "Staff"}
                  </span>
                  
                  {/* Floating Like & Save quick controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(story.slug);
                      }}
                      className={`flex items-center gap-1 transition-colors p-1 cursor-pointer hover:text-[var(--glow-text)] ${
                        likedSlugs.includes(story.slug) ? "text-[var(--glow-text)] font-bold" : "text-slate-500"
                      }`}
                      title={likedSlugs.includes(story.slug) ? "Unlike" : "Like"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedSlugs.includes(story.slug) ? "fill-current text-[var(--glow-text)]" : ""}`} />
                      <span>{getLikesCount(story.title, likedSlugs.includes(story.slug))}</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(story.slug);
                      }}
                      className={`flex items-center gap-1 transition-colors p-1 cursor-pointer hover:text-[var(--glow-text)] ${
                        savedSlugs.includes(story.slug) ? "text-[var(--glow-text)]" : "text-slate-500"
                      }`}
                      title={savedSlugs.includes(story.slug) ? "Remove Bookmark" : "Bookmark Story"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${savedSlugs.includes(story.slug) ? "fill-current" : ""}`} />
                    </button>

                    <span className="flex items-center gap-1 text-[var(--glow-text)] font-bold group-hover:text-white transition-colors ml-1">
                      Read
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
