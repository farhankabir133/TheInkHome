import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Story } from "./types";
import ThreeBackground from "./components/ThreeBackground";
import Carousel3D from "./components/Carousel3D";
import StoryGrid from "./components/StoryGrid";
import StoryList from "./components/StoryList";
import AuthorsSection from "./components/AuthorsSection";
import StoryModal from "./components/StoryModal";
import { Logo } from "./components/Logo";
import { 
  Compass, 
  LayoutGrid, 
  AlignLeft, 
  Users, 
  ExternalLink,
  BookOpen, 
  ArrowDown, 
  Cpu, 
  Radio,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  Heart,
  Bookmark
} from "lucide-react";

export default function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editors, setEditors] = useState<any[]>([]);
  const [writers, setWriters] = useState<any[]>([]);
  const [aboutInfo, setAboutInfo] = useState<any>({
    description: "The Ink Home is a place where words feel at home. Here, we share stories that explore life, writing, technology, productivity, relationships and mental health. Every piece is a reflection, a lesson, or a moment meant to inspire, connect, and spark thought.",
    officialWebsite: "https://farhankabir133.github.io/The-Ink-Home/"
  });
  
  // Navigation & View Toggles
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState<"3d" | "grid" | "list" | "authors" | "saved">("3d");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // User Interaction State: Likes & Bookmarks saved to LocalStorage
  const [likedSlugs, setLikedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("the-ink-home:likes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("the-ink-home:saves");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("the-ink-home:likes", JSON.stringify(likedSlugs));
  }, [likedSlugs]);

  useEffect(() => {
    localStorage.setItem("the-ink-home:saves", JSON.stringify(savedSlugs));
  }, [savedSlugs]);

  const handleToggleLike = (slug: string) => {
    setLikedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleToggleSave = (slug: string) => {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };
  
  // Ambient Music State (Non-intrusive sound effects)
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-fetch stories & About board profiles from Express proxy servers
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        console.log("Fetching stories and author board metadata in parallel...");
        
        const [storiesRes, aboutRes] = await Promise.all([
          fetch("/api/stories"),
          fetch("/api/about")
        ]);
        
        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          setStories(storiesData.stories || []);
        } else {
          console.warn(`Stories endpoint returned: ${storiesRes.status}`);
        }
        
        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          setEditors(aboutData.editors || []);
          setWriters(aboutData.writers || []);
          if (aboutData.description) {
            setAboutInfo({
              description: aboutData.description,
              officialWebsite: aboutData.officialWebsite || "https://farhankabir133.github.io/The-Ink-Home/"
            });
          }
        } else {
          console.warn(`About page endpoint returned: ${aboutRes.status}`);
        }
        
      } catch (err: any) {
        console.error("Failed to load initial data: ", err);
        setError(err.message || "Unknown error connecting to publication");
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // Set up Ambient Soundscape
  useEffect(() => {
    // Generate a beautiful, low-frequency cosmic synth tone as standard audio
    // helper so we don't have to pool heavy external audio files. 
    // This is creative web acoustics at its finest!
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create an audio oscillator that acts as a soothing hum when toggled
    audioRef.current = {
      play: () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
        // Synthesize an infinite ambient wave
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(55, audioContext.currentTime); // Low A hum
        
        // Soft volume to hold a gentle focus sound
        gainNode.gain.setValueAtTime(0.015, audioContext.currentTime);
        
        // Add subtle harmonic modulation
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.15, audioContext.currentTime); // Ultra slow rhythm
        lfoGain.gain.setValueAtTime(5, audioContext.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        osc.start();
        lfo.start();
        
        (audioRef.current as any).oscillator = osc;
        (audioRef.current as any).lfo = lfo;
        (audioRef.current as any).gainNode = gainNode;
      },
      pause: () => {
        try {
          const ref = audioRef.current as any;
          if (ref.oscillator) ref.oscillator.stop();
          if (ref.lfo) ref.lfo.stop();
        } catch (e) {}
      }
    } as any;

    return () => {
      try {
        const ref = audioRef.current as any;
        if (ref && ref.oscillator) ref.oscillator.stop();
      } catch (e) {}
    };
  }, []);

  const handleToggleSound = () => {
    if (musicPlaying) {
      audioRef.current?.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current?.play();
      setMusicPlaying(true);
    }
  };

  const enterWebsite = () => {
    setEntered(true);
    // Auto start the sound on entrance for premium cinematic audio feedback
    if (!musicPlaying) {
      try {
        audioRef.current?.play();
        setMusicPlaying(true);
      } catch (e) {}
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* Carbon Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-overlay carbon-texture z-[2]" />
      
      {/* Minimal Ambient Cyan and Indigo lighting glows */}
      <div className="absolute top-[-10%) right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none z-[1]" />

      {/* 3D Cosmic Constellation Scene */}
      <ThreeBackground />

      {/* Floating Sound Controller */}
      <button 
        onClick={handleToggleSound}
        className="fixed bottom-6 right-6 z-40 p-3 rounded bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all backdrop-blur-md cursor-pointer"
        title={musicPlaying ? "Mute Cosmic Hum" : "Unmute Cosmic Hum"}
      >
        {musicPlaying ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: CINEMATIC PORTAL LANDING PAGE */}
        {!entered ? (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative min-h-screen flex flex-col justify-between z-10 px-6 py-8"
          >
            {/* Top Logotype Row */}
            <header className="w-full flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-2.5">
                <Logo size={46} textColor="text-slate-200" />
              </div>
              <a 
                href="https://medium.com/the-ink-home" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all border border-transparent px-3 py-1.5 rounded bg-white/5"
                id="landing-medium-link"
              >
                MEDIUM EDITION <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </header>

            {/* Core Cinematic Hero */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto my-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Visual Label Banner */}
                <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">
                  Featured Edition — Vol. 082
                </div>
                
                {/* Main Heading title with custom gradient styling */}
                <h1 className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-black tracking-tighter mb-6 italic uppercase font-display text-white">
                  The Ink<br /><span className="text-cyan-500">Home</span>
                </h1>
                
                {/* Subtitle statement */}
                <p className="max-w-xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed font-light tracking-wide">
                  Where spatial typography, code shaders, and cyber-philosophical stories merge into floating geometric objects in space.
                </p>
              </motion.div>

              {/* Enter CTA Trigger BUTTON */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <button
                  onClick={enterWebsite}
                  className="px-8 py-4 bg-white text-black font-extrabold uppercase tracking-[0.2em] text-[11px] hover:bg-cyan-400 transition-colors duration-300 cursor-pointer flex items-center gap-2.5 z-20 mx-auto"
                  id="enter-portal-btn"
                >
                  Enter The Ink Home
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </motion.div>
            </div>

            {/* Bottom Section: Auto-scrolling Featured Stories Cinematic strip */}
            <div className="w-full max-w-6xl mx-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-4 h-4 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500">
                    <span className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      SATELLITE MAGAZINE LOOP
                    </span>
                    <span>Scroll or Click items to read</span>
                  </div>

                  {/* Horizontal Auto-Scroller ticker containing stories summaries */}
                  <div className="relative w-full overflow-hidden border-t border-b border-white/10 py-4 bg-black/40 backdrop-blur-sm">
                    <div className="flex gap-4 animate-marquee hover:pause whitespace-nowrap">
                      {stories.map((story) => (
                        <div
                          key={story.slug}
                          onClick={() => {
                            setSelectedStory(story);
                            setEntered(true);
                          }}
                          className="inline-flex items-center gap-3 px-4 py-2 border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.02] transition-all cursor-pointer text-left"
                        >
                          <img
                            src={story.cover}
                            alt=""
                            className="w-8 h-8 rounded-none object-cover border border-white/10"
                          />
                          <div>
                            <p className="text-[11px] font-bold text-white line-clamp-1 max-w-[180px] uppercase tracking-wider">
                              {story.title}
                            </p>
                            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
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
        ) : (
          
          /* VIEW 2: CORE INTERACTIVE SPATIAL DASHBOARD PLATFORM */
          <motion.div
            key="dashboard-app"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col min-h-screen bg-[#050505]"
          >
            {/* Top Workspace Header */}
            <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
              <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">
                
                {/* Brand Logo Wordmark */}
                <div 
                  onClick={() => setEntered(false)} 
                  className="flex items-center cursor-pointer group"
                >
                  <Logo size={42} />
                </div>

                 {/* Dashboard Mode view buttons */}
                <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#111111] border border-white/10 text-[11px] font-mono uppercase">
                  <button
                    onClick={() => setActiveTab("3d")}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-all cursor-pointer ${
                      activeTab === "3d" ? "bg-white text-black font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    3D Universe
                  </button>
                  <button
                    onClick={() => setActiveTab("grid")}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-all cursor-pointer ${
                      activeTab === "grid" ? "bg-white text-black font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Bento Grid
                  </button>
                  <button
                    onClick={() => setActiveTab("list")}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-all cursor-pointer ${
                      activeTab === "list" ? "bg-white text-black font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    Ledger List
                  </button>
                  <button
                    onClick={() => setActiveTab("authors")}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-all cursor-pointer ${
                      activeTab === "authors" ? "bg-white text-black font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    About Us
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-all cursor-pointer relative ${
                      activeTab === "saved" ? "bg-white text-black font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Saved Archive
                    {savedSlugs.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-black font-mono">
                        {savedSlugs.length}
                      </span>
                    )}
                  </button>
                </nav>

                {/* Direct Action triggers */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://medium.com/the-ink-home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    Medium
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                </div>
              </div>

              {/* Mobile Tab selector fallback */}
              <div className="flex md:hidden border-t border-white/10 bg-[#0d0d0d]">
                <div className="grid grid-cols-5 w-full text-center text-[10px] font-mono leading-none">
                  <button
                    onClick={() => setActiveTab("3d")}
                    className={`py-4 border-r border-white/10 flex flex-col items-center gap-1 ${
                      activeTab === "3d" ? "text-cyan-400 bg-white/5 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    3D
                  </button>
                  <button
                    onClick={() => setActiveTab("grid")}
                    className={`py-4 border-r border-white/10 flex flex-col items-center gap-1 ${
                      activeTab === "grid" ? "text-cyan-400 bg-white/5 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Bento
                  </button>
                  <button
                    onClick={() => setActiveTab("list")}
                    className={`py-4 border-r border-white/10 flex flex-col items-center gap-1 ${
                      activeTab === "list" ? "text-cyan-400 bg-white/5 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    List
                  </button>
                  <button
                    onClick={() => setActiveTab("authors")}
                    className={`py-4 border-r border-white/10 flex flex-col items-center gap-1 ${
                      activeTab === "authors" ? "text-cyan-400 bg-white/5 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    About Us
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`py-4 flex flex-col items-center gap-1 ${
                      activeTab === "saved" ? "text-cyan-400 bg-white/5 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Saved
                  </button>
                </div>
              </div>
            </header>

            {/* Core View Dashboard Body Container */}
            <main className="flex-1 py-12 px-6">
              
              {/* Fetching state feedback loops */}
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                  {/* Neon Spinner */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border border-white/10 rounded-full" />
                    <div className="absolute inset-0 border border-t-cyan-400 rounded-full animate-spin" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase animate-pulse">
                    Parsing Medium Telemetry Feed...
                  </span>
                </div>
              ) : error && stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 p-8 border border-red-500/20 bg-red-950/10 rounded-none max-w-lg mx-auto">
                  <p className="text-sm font-semibold text-red-400 font-sans">Satellite link offline.</p>
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    {error}. Reconnecting to fallback network coordinates.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest bg-cyan-500 text-black font-extrabold"
                  >
                    Retry Portal Sync
                  </button>
                </div>
              ) : (
                <div className="space-y-16">
                  
                  {/* Dynamic Heading per tab */}
                  <div className="text-center md:pb-6 space-y-2">
                    {activeTab === "3d" && (
                      <>
                        <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight uppercase italic">The Volumetric <span className="text-cyan-500">Universe</span></h2>
                        <p className="text-xs text-slate-400 font-mono tracking-[0.25em] uppercase">ROUTING AND ALIGNING THE COGNITIVE MATRIX IN IMMERSIVE SPACE</p>
                      </>
                    )}
                    {activeTab === "grid" && (
                      <>
                        <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight uppercase italic">The Bento <span className="text-cyan-500">Archive</span></h2>
                        <p className="text-xs text-slate-400 font-mono tracking-[0.25em] uppercase">HIGH CAPACITY CELLS STRUCTURED FOR SPEED SENSORY CARDS</p>
                      </>
                    )}
                    {activeTab === "list" && (
                      <>
                        <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight uppercase italic">The Narrative <span className="text-cyan-500">Ledger</span></h2>
                        <p className="text-xs text-slate-400 font-mono tracking-[0.25em] uppercase">MINIMALIST CHRONOLOGICAL INDEX SHIFTED FOR METADATA SCANNING</p>
                      </>
                    )}
                    {activeTab === "authors" && (
                      <>
                        {/* Title inside the authors component itself */}
                      </>
                    )}
                    {activeTab === "saved" && (
                      <>
                        <h2 className="font-sans font-bold text-3xl md:text-5xl text-white tracking-tight uppercase italic">The Saved <span className="text-cyan-500">Archive</span></h2>
                        <p className="text-xs text-slate-400 font-mono tracking-[0.25em] uppercase">YOUR PERSONALLY CURATED COGNITIVE MATRIX COLLECTED FROM THE SPATIAL NODE</p>
                      </>
                    )}
                  </div>

                  {/* Render Tab Views with state transitions */}
                  <div className="min-h-[55vh]" id="tab-viewport">
                    <AnimatePresence mode="wait">
                      {activeTab === "3d" && (
                        <motion.div
                          key="nav-3d"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Carousel3D 
                            stories={stories} 
                            onSelectStory={setSelectedStory} 
                            likedSlugs={likedSlugs}
                            savedSlugs={savedSlugs}
                            onToggleLike={handleToggleLike}
                            onToggleSave={handleToggleSave}
                          />
                        </motion.div>
                      )}
                      
                      {activeTab === "grid" && (
                        <motion.div
                          key="nav-grid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <StoryGrid 
                            stories={stories} 
                            onSelectStory={setSelectedStory} 
                            likedSlugs={likedSlugs}
                            savedSlugs={savedSlugs}
                            onToggleLike={handleToggleLike}
                            onToggleSave={handleToggleSave}
                          />
                        </motion.div>
                      )}

                      {activeTab === "list" && (
                        <motion.div
                          key="nav-list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <StoryList 
                            stories={stories} 
                            onSelectStory={setSelectedStory} 
                            likedSlugs={likedSlugs}
                            savedSlugs={savedSlugs}
                            onToggleLike={handleToggleLike}
                            onToggleSave={handleToggleSave}
                          />
                        </motion.div>
                      )}

                      {activeTab === "authors" && (
                        <motion.div
                          key="nav-authors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <AuthorsSection stories={stories} onSelectStory={setSelectedStory} editors={editors} writers={writers} aboutInfo={aboutInfo} />
                        </motion.div>
                      )}

                      {activeTab === "saved" && (
                        <motion.div
                          key="nav-saved"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {stories.filter(s => savedSlugs.includes(s.slug)).length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[300px] border border-white/10 bg-[#0c0c0c]/80 p-8 text-center max-w-xl mx-auto space-y-4">
                              <Bookmark className="w-8 h-8 text-slate-600 animate-pulse" />
                              <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Your Archive is Empty</p>
                              <p className="text-xs text-slate-500 leading-relaxed font-light">
                                Connect to the 3D Universe or Bento Grid, find stories that challenge your cognitive horizons, and click their save trigger to register them here.
                              </p>
                              <button
                                onClick={() => setActiveTab("3d")}
                                className="px-5 py-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors font-bold cursor-pointer"
                              >
                                Explore Cosmos
                              </button>
                            </div>
                          ) : (
                            <StoryGrid 
                              stories={stories.filter(s => savedSlugs.includes(s.slug))} 
                              onSelectStory={setSelectedStory}
                              likedSlugs={likedSlugs}
                              savedSlugs={savedSlugs}
                              onToggleLike={handleToggleLike}
                              onToggleSave={handleToggleSave}
                            />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Interactive Dynamic Footnote - Show stats in visual dashboard footer */}
                  {activeTab !== "authors" && (
                    <div className="w-full max-w-6xl mx-auto border-t border-white/10 pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {/* Section 1 */}
                      <div className="space-y-2 border-l-2 border-cyan-500 pl-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">TELEMETRY SOURCES</h4>
                        <p className="text-xs text-slate-400 font-light">
                          Stories ingested automatically from `https://medium.com/the-ink-home` via background parsing array.
                        </p>
                      </div>
                      
                      {/* Section 2 */}
                      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white">NODE RECEPTOR</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          Online / Synced dynamically
                        </p>
                      </div>

                      {/* Section 3 */}
                      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white">CATALOG STATUS</h4>
                        <p className="text-xs text-slate-400 font-light">
                          {stories.length} interactive stories floating in coordinates. {new Set(stories.map(s => s.author)).size} accredited editors.
                        </p>
                      </div>

                      {/* Section 4 */}
                      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">WebGL MATRIX</h4>
                        <p className="text-xs text-slate-400 font-light">
                          Designed with custom constellations for spatial immersion. Read full layouts via Medium native links.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Dynamic full-width Editorial Board view below standard carousel/grid/list layouts to enrich experience */}
                  {activeTab !== "authors" && (
                    <div className="pt-8 pb-12 border-t border-white/10">
                      <AuthorsSection stories={stories} onSelectStory={setSelectedStory} editors={editors} writers={writers} aboutInfo={aboutInfo} />
                    </div>
                  )}

                </div>
              )}

            </main>

            {/* General Site Footer */}
            <footer className="w-full border-t border-white/10 bg-[#070707] py-16 flex flex-col items-center justify-center space-y-4 text-center text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-12">
              <Logo size={48} iconOnly className="opacity-80 hover:opacity-100 transition-opacity" />
              <div className="space-y-1">
                <span className="block text-slate-400">The Ink Home © 2026</span>
                <span>Visualizing dynamic literature in multi-dimensional cosmos</span>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Volumetric Story Modal Popup */}
      <StoryModal 
        story={selectedStory} 
        onClose={() => setSelectedStory(null)} 
        isLiked={selectedStory ? likedSlugs.includes(selectedStory.slug) : false}
        isSaved={selectedStory ? savedSlugs.includes(selectedStory.slug) : false}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
