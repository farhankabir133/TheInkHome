import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DOMPurify from "isomorphic-dompurify";
import { Story } from "../types";
import { 
  X, 
  Calendar, 
  User, 
  ExternalLink, 
  Share2, 
  Compass, 
  Heart, 
  Bookmark, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link, 
  Check 
} from "lucide-react";
import { getLikesCount, getShareUrl } from "../lib/interaction";
import AvatarImage from "./AvatarImage";

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (slug: string) => void;
  onToggleSave: (slug: string) => void;
}

export default function StoryModal({ 
  story, 
  onClose,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave
}: StoryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!story) return;
    navigator.clipboard.writeText(story.link || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // Prevent background viewport scrolling when open
  useEffect(() => {
    if (story) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [story]);

  // Handle escape button exits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!story) return null;

  // Custom function to share story
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: story.link || window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(story.link || window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-text" id="story-modal-container">
        {/* Backdrop Glow Glass Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="relative w-full max-w-4xl bg-[#050505]/95 border border-white/5 rounded-none shadow-2xl flex flex-col max-h-[88vh] overflow-hidden z-10 glass-card"
        >
          {/* Header Action Row */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-black/60 backdrop-blur-md hover:bg-white/[0.05] border border-white/5 rounded-full text-slate-300 hover:text-[var(--glow-text)] hover:shadow-[0_0_12px_var(--glow-bg)] transition-all cursor-pointer"
              title="Share story"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-black/60 backdrop-blur-md hover:bg-white/[0.05] border border-white/5 rounded-full text-slate-300 hover:text-[var(--glow-text)] hover:shadow-[0_0_12px_var(--glow-bg)] transition-all cursor-pointer"
              aria-label="Close portal"
              id="close-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrolling Content Canvas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Hero Cover Frame */}
            <div className="relative w-full h-[20rem] md:h-[25rem] overflow-hidden">
              <img
                src={story.cover}
                alt={story.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/30" />
              
              {/* Bottom Hero Overlay */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3 max-w-3xl">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {story.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-none font-mono text-[9px] uppercase tracking-wider bg-black/80 text-[var(--glow-text)] border border-[var(--glow-text)]/20"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="font-sans font-bold text-2xl md:text-4xl text-white leading-tight tracking-tight uppercase">
                  {story.title}
                </h1>
              </div>
            </div>

            {/* Main Editorial Copy */}
            <div className="p-6 md:p-10 space-y-8 max-w-3xl mx-auto">
              {/* Author Card Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-none font-mono text-xs">
                <div className="flex items-center gap-3">
                  <AvatarImage
                    src={story.avatar}
                    alt={story.author}
                    fallbackSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                    className="w-9 h-9 rounded-none object-cover border border-white/5"
                  />
                  <div>
                    <h4 className="font-sans font-bold text-white uppercase tracking-wider">{story.author}</h4>
                    <p className="text-[10px] text-[var(--glow-text)] font-mono tracking-widest uppercase mt-0.5">{story.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--glow-text)]" />
                    {new Date(story.pubDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Interactions Toolbar: Likes, Saves, and Social Sharing Suite */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 border-l-2 border-[var(--glow-text)] bg-white/[0.02] border-t border-b border-r border-white/5 font-mono text-xs text-slate-400">
                {/* Left: Like & Save triggers */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => onToggleLike(story.slug)}
                    className={`flex items-center gap-2 px-3 py-1.5 border border-white/5 hover:border-[var(--glow-text)]/50 hover:text-[var(--glow-text)] hover:bg-[var(--glow-text)]/10 transition-all cursor-pointer rounded-full ${
                      isLiked ? "text-[var(--glow-text)] border-[var(--glow-text)]/30 bg-[var(--glow-text)]/10 font-bold" : ""
                    }`}
                    title={isLiked ? "Unlike story" : "Like story"}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-[var(--glow-text)]" : ""}`} />
                    <span>{getLikesCount(story.title, isLiked)} Likes</span>
                  </button>

                  <button
                    onClick={() => onToggleSave(story.slug)}
                    className={`flex items-center gap-2 px-3 py-1.5 border border-white/5 hover:border-[var(--glow-text)]/50 hover:text-[var(--glow-text)] hover:bg-[var(--glow-text)]/10 transition-all cursor-pointer rounded-full ${
                      isSaved ? "text-[var(--glow-text)] border-[var(--glow-text)]/30 bg-[var(--glow-text)]/10 font-bold" : ""
                    }`}
                    title={isSaved ? "Remove from saved archive" : "Save to library archive"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current text-[var(--glow-text)]" : ""}`} />
                    <span>{isSaved ? "Saved" : "Save Story"}</span>
                  </button>
                </div>

                {/* Right: Social Media Transmissions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end border-t border-white/5 sm:border-0 pt-2.5 sm:pt-0">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 hidden sm:inline">Transmit:</span>
                  
                  <a
                    href={getShareUrl("twitter", story.title, story.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-black/40 hover:bg-[var(--glow-text)]/10 border border-white/5 hover:border-[var(--glow-text)]/30 text-slate-400 hover:text-[var(--glow-text)] transition-all cursor-pointer rounded-full"
                    title="Transmit on X"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={getShareUrl("linkedin", story.title, story.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-black/40 hover:bg-[var(--glow-text)]/10 border border-white/5 hover:border-[var(--glow-text)]/30 text-slate-400 hover:text-[var(--glow-text)] transition-all cursor-pointer rounded-full"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={getShareUrl("facebook", story.title, story.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-black/40 hover:bg-[var(--glow-text)]/10 border border-white/5 hover:border-[var(--glow-text)]/30 text-slate-400 hover:text-[var(--glow-text)] transition-all cursor-pointer rounded-full"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 bg-black/40 hover:bg-[var(--glow-text)]/10 border border-white/5 hover:border-[var(--glow-text)]/30 text-slate-400 hover:text-[var(--glow-text)] transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-full"
                    title="Copy direct portal link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--glow-text)]" />
                        <span className="text-[9px] text-[var(--glow-text)] uppercase font-bold pr-1">Copied!</span>
                      </>
                    ) : (
                      <Link className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Renders Content safely with absolute professional typography styling */}
              {story.content ? (
                <div 
                  className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed text-sm md:text-base space-y-5
                  prose-headings:font-sans prose-headings:font-semibold prose-headings:text-white prose-headings:tracking-tight
                  prose-p:mb-4 prose-p:leading-relaxed
                  prose-figure:my-6 prose-figure:rounded-none prose-figure:overflow-hidden prose-figure:border prose-figure:border-white/5
                  prose-img:rounded-none prose-img:w-full prose-img:object-cover
                  prose-a:text-[var(--glow-text)] prose-a:underline hover:prose-a:text-white transition-colors"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed font-sans">{story.description}</p>
                  <p className="text-xs text-slate-500 italic">No further content stream in feed preview.</p>
                </div>
              )}

              {/* Divider */}
              <div className="w-full h-px bg-white/5 my-8" />

              {/* Call to Action: Read on Medium */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-none text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="font-sans text-sm font-semibold text-white flex items-center justify-center sm:justify-start gap-1 uppercase">
                    <Compass className="w-4 h-4 text-[var(--glow-text)]" />
                    Enjoying this piece from The Ink Home?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Interact directly with the authors and view comments on the official publication site on Medium.
                  </p>
                </div>
                
                <a
                  href={story.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-black font-extrabold uppercase tracking-widest text-[11px] hover:bg-[var(--glow-text)] hover:shadow-[0_0_15px_var(--glow-color)] transition-all cursor-pointer rounded-full"
                >
                  Medium Article
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
