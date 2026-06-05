import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Story } from "./types";

const ThreeBackground = lazy(() => import("./components/ThreeBackground"));
const Carousel3D = lazy(() => import("./components/Carousel3D"));
import StoryGrid from "./components/StoryGrid";
import StoryList from "./components/StoryList";
import AuthorsSection from "./components/AuthorsSection";
import StoryModal from "./components/StoryModal";
import { Logo } from "./components/Logo";
import FALLBACK_STORIES from "./data/fallbackStories";
import FALLBACK_ABOUT from "./data/fallbackAbout";
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
import Subscribe from "./components/Subscribe";

export default function App() {
  // Initialize stories from local fallback for instant rendering on static hosts
  const [stories, setStories] = useState<Story[]>(() => FALLBACK_STORIES || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editors, setEditors] = useState<any[]>(() => FALLBACK_ABOUT.editors || []);
  const [writers, setWriters] = useState<any[]>(() => FALLBACK_ABOUT.writers || []);
  const [aboutInfo, setAboutInfo] = useState<any>(() => ({
    description: FALLBACK_ABOUT.description,
    officialWebsite: FALLBACK_ABOUT.officialWebsite
  }));
  
  // Navigation & View Toggles
  const [entered, setEntered] = useState(false);
  const [bgMode, setBgMode] = useState<"stellar" | "ink" | "forest" | "constellation">("stellar");
  const [activeTab, setActiveTab] = useState<"3d" | "grid" | "list" | "authors" | "saved">("3d");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const pendingSlugRef = useRef<string | null>(null);

  // Mouse coords & Scroll tracking for Typographic Kinetic motion
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setCoords({ x, y });
  };

  useEffect(() => {
    const handleWinScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleWinScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWinScroll);
  }, []);

  // Helper to push history state and update URL
  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const handleSelectStory = (story: Story | null) => {
    setSelectedStory(story);
    if (story) {
      navigateTo(`/story/${story.slug}`);
    } else {
      navigateTo("/" + (activeTab === "authors" ? "about" : activeTab));
    }
  };

  const handleTabChange = (tab: "3d" | "grid" | "list" | "authors" | "saved") => {
    setActiveTab(tab);
    navigateTo("/" + (tab === "authors" ? "about" : tab));
  };

  // URL Path router synchronization listener
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      
      if (path === "/" || path === "") {
        setEntered(false);
        setSelectedStory(null);
      } else if (path === "/3d") {
        setEntered(true);
        setActiveTab("3d");
        setSelectedStory(null);
      } else if (path === "/grid") {
        setEntered(true);
        setActiveTab("grid");
        setSelectedStory(null);
      } else if (path === "/list") {
        setEntered(true);
        setActiveTab("list");
        setSelectedStory(null);
      } else if (path === "/about") {
        setEntered(true);
        setActiveTab("authors");
        setSelectedStory(null);
      } else if (path === "/saved") {
        setEntered(true);
        setActiveTab("saved");
        setSelectedStory(null);
      } else if (path.startsWith("/story/")) {
        const slug = path.replace("/story/", "");
        const found = stories.find(s => s.slug === slug);
        if (found) {
          setEntered(true);
          setSelectedStory(found);
        } else {
          pendingSlugRef.current = slug;
        }
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    handleUrlChange();

    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [stories]);

  useEffect(() => {
    if (pendingSlugRef.current && stories.length > 0) {
      const found = stories.find(s => s.slug === pendingSlugRef.current);
      if (found) {
        setSelectedStory(found);
        setEntered(true);
        pendingSlugRef.current = null;
      }
    }
  }, [stories]);

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
        console.log("Fetching stories and author board metadata in parallel (with timeout)...");

        // Helper: fetch with timeout
        const fetchWithTimeout = (input: RequestInfo, timeout = 5000) => {
          return Promise.race([
            fetch(input),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
          ] as any);
        };

        // Base API URL configurable via Vite env: VITE_API_BASE
        // If not provided, falls back to relative paths (useful for local dev or same-origin deploys)
        const API_BASE = (import.meta as any).env?.VITE_API_BASE
          ? String((import.meta as any).env.VITE_API_BASE).replace(/\/+$/g, "")
          : "";

        // Primary quick parallel attempt: server API (5s) and public proxy RSS (2s) raced
        const rss2jsonQuick = (async () => {
          try {
            const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://medium.com/feed/the-ink-home")}`;
            const r = await fetchWithTimeout(rss2jsonUrl, 2000);
            if (r && r.ok) return r.json();
          } catch (e) {}
          return null;
        })();

        const [storiesRes, aboutRes, rssQuickPayload] = await Promise.all([
          fetchWithTimeout(`${API_BASE}/api/stories`, 5000).catch((e) => null),
          fetchWithTimeout(`${API_BASE}/api/about`, 5000).catch((e) => null),
          rss2jsonQuick
        ]);
        
        if (storiesRes && storiesRes.ok) {
          const storiesData = await storiesRes.json();
          // Merge dynamic stories but keep fallback order as quick-first
          const dynamic = storiesData.stories || [];
          if (dynamic.length > 0) {
            setStories((prev) => {
              // Prefer dynamic stories but keep initial quick fallback while merging
              const slugs = new Set(dynamic.map((s: Story) => s.slug));
              const merged = [...dynamic, ...prev.filter((p) => !slugs.has(p.slug))];
              return merged;
            });
          }
        } else if (storiesRes === null) {
          console.warn("Stories fetch timed out or failed quickly; using fallback stories for now.");
        } else {
          console.warn(`Stories endpoint returned: ${storiesRes.status}`);
        }

        // If rss2json quick returned useful items, merge them immediately for faster UX
        if (rssQuickPayload && Array.isArray(rssQuickPayload.items) && rssQuickPayload.items.length > 0) {
          try {
            const mappedQuick: Story[] = rssQuickPayload.items.map((it: any) => {
              const title = it.title || "Untitled";
              const link = it.link || "";
              const author = it.author || "The Ink Home";
              const pubDate = it.pubDate || new Date().toUTCString();
              const content = it.content || it.description || "";
              const coverMatch = (content || "").match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
              const cover = coverMatch && coverMatch[1] ? coverMatch[1] : undefined;
              let slug = "";
              if (link) {
                const parts = link.split("/");
                const last = parts[parts.length - 1];
                slug = last ? last.split("?")[0] : "";
              }
              if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return {
                title,
                link,
                author,
                role: "",
                pubDate,
                categories: Array.isArray(it.categories) ? it.categories : ["Editorial"],
                description: (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...",
                content,
                cover,
                slug,
                avatar: undefined
              } as Story;
            });

            if (mappedQuick.length > 0) {
              setStories((prev) => {
                const slugs = new Set(prev.map((p) => p.slug));
                const merged = [...mappedQuick.filter((m) => !slugs.has(m.slug)), ...prev];
                return merged.slice(0, 30);
              });
            }
          } catch (e) {
            // ignore quick merge errors
          }
        }
        
        if (aboutRes && aboutRes.ok) {
          const aboutData = await aboutRes.json();
          setEditors(aboutData.editors || []);
          setWriters(aboutData.writers || []);
          if (aboutData.description) {
            setAboutInfo({
              description: aboutData.description,
              officialWebsite: aboutData.officialWebsite || "https://theinkhome.live/"
            });
          }
        } else if (aboutRes === null) {
          console.warn("About fetch timed out or failed quickly; showing fallback about info.");
        } else {
          console.warn(`About page endpoint returned: ${aboutRes.status}`);
        }
        
      } catch (err: any) {
        console.error("Failed to load initial data quickly: ", err);
        setError(err.message || "Unknown error connecting to publication");
      } finally {
        setLoading(false);
      }

      // If we still have fewer than desired stories, try public rss2json proxy directly (works on static hosts)
      try {
        const DESIRED = 30;
        const CACHE_KEY = "the-ink-home:stories-cache";
        const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

        const now = Date.now();
        // Use cached stories if recent
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed?.ts && now - parsed.ts < CACHE_TTL && Array.isArray(parsed.stories) && parsed.stories.length >= DESIRED) {
              setStories(parsed.stories.slice(0, DESIRED));
              console.log("Using cached stories from localStorage");
              return;
            }
          }
        } catch (e) {
          // ignore cache errors
        }

        if ((stories.length || 0) < DESIRED) {
          console.log("Attempting rss2json proxy fetch for additional stories (target 30)...");
          const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://medium.com/feed/the-ink-home")}`;

          const resp = await fetch(rss2jsonUrl, { cache: "no-cache" });
          let mapped: Story[] = [];
          if (resp.ok) {
            const payload = await resp.json();
            if (payload && Array.isArray(payload.items) && payload.items.length > 0) {
              mapped = payload.items.map((it: any) => {
                const title = it.title || "Untitled";
                const link = it.link || "";
                const author = it.author || "The Ink Home";
                const pubDate = it.pubDate || new Date().toUTCString();
                const content = it.content || it.description || "";
                const coverMatch = (content || "").match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
                const cover = coverMatch && coverMatch[1] ? coverMatch[1] : "";
                let slug = "";
                if (link) {
                  const parts = link.split("/");
                  const last = parts[parts.length - 1];
                  slug = last ? last.split("?")[0] : "";
                }
                if (!slug) {
                  slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                }

                return {
                  title,
                  link,
                  author,
                  role: "",
                  pubDate,
                  categories: Array.isArray(it.categories) ? it.categories : ["Editorial"],
                  description: (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...",
                  content,
                  cover: cover || undefined,
                  slug,
                  avatar: undefined
                } as Story;
              });
            }
          }

          // If rss2json didn't give enough items, try AllOrigins raw RSS and parse
          if (mapped.length < DESIRED) {
            try {
              console.log("rss2json returned fewer items; trying AllOrigins raw RSS fetch...");
              const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent("https://medium.com/feed/the-ink-home")}`;
              const rawResp = await fetch(allOriginsUrl, { cache: "no-cache" });
              if (rawResp.ok) {
                const rawJson = await rawResp.json();
                const xml = rawJson?.contents || rawJson;
                if (xml && typeof xml === "string") {
                  // Simple RSS parser to extract <item> blocks
                  const items: Story[] = [];
                  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
                  let m;
                  while ((m = itemRegex.exec(xml)) !== null) {
                    const item = m[1];
                    const titleMatch = item.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/title>/i);
                    const linkMatch = item.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i);
                    const authorMatch = item.match(/<dc:creator>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/dc:creator>/i) || item.match(/<creator>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/creator>/i);
                    const pubDateMatch = item.match(/<pubDate>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/pubDate>/i);
                    const contentMatch = item.match(/<content:encoded>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/content:encoded>/i) || item.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);

                    const title = (titleMatch ? (titleMatch[1] || titleMatch[2]) : "Untitled") || "Untitled";
                    const link = (linkMatch ? (linkMatch[1] || linkMatch[2]) : "") || "";
                    const author = (authorMatch ? (authorMatch[1] || authorMatch[2]) : "The Ink Home") || "The Ink Home";
                    const pubDate = (pubDateMatch ? (pubDateMatch[1] || pubDateMatch[2]) : new Date().toUTCString()) || new Date().toUTCString();
                    const content = (contentMatch ? (contentMatch[1] || contentMatch[2]) : "") || "";
                    const coverMatch = content.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
                    const cover = coverMatch && coverMatch[1] ? coverMatch[1] : undefined;

                    let slug = "";
                    if (link) {
                      const parts = link.split("/");
                      const last = parts[parts.length - 1];
                      slug = last ? last.split("?")[0] : "";
                    }
                    if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

                    items.push({
                      title,
                      link,
                      author,
                      role: "",
                      pubDate,
                      categories: ["Editorial"],
                      description: content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...",
                      content,
                      cover,
                      slug,
                      avatar: undefined
                    });
                  }

                  if (items.length > 0) {
                    // append items not already in mapped
                    const existingSlugs = new Set(mapped.map((s) => s.slug));
                    for (const it of items) {
                      if (!existingSlugs.has(it.slug)) mapped.push(it);
                      if (mapped.length >= DESIRED) break;
                    }
                  }
                }
              }
            } catch (allErr) {
              console.warn("AllOrigins RSS fetch failed:", allErr);
            }
          }

          // If still short, aggressively scrape the publication HTML for article links and fetch individual pages
          if (mapped.length < DESIRED) {
            try {
              console.log("Still short on items; scraping publication homepage for article links via AllOrigins...");
              const pubUrl = "https://medium.com/the-ink-home";
              const pubAllUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pubUrl)}`;
              const pubResp = await fetch(pubAllUrl, { cache: "no-cache" });
              if (pubResp.ok) {
                const pubJson = await pubResp.json();
                const html = pubJson?.contents || pubJson;
                if (html && typeof html === "string") {
                  // Find links to articles under the publication
                  const linkRegex = /https:\/\/medium.com\/the-ink-home\/[a-z0-9\-_%]+/ig;
                  const found = new Set<string>();
                  let m;
                  while ((m = linkRegex.exec(html)) !== null) {
                    found.add(m[0]);
                  }

                  // Also try relative links
                  const relRegex = /href=["']\/(?:the-ink-home)\/([a-z0-9\-_%]+)["']/ig;
                  while ((m = relRegex.exec(html)) !== null) {
                    found.add(`https://medium.com/the-ink-home/${m[1]}`);
                  }

                  const links = Array.from(found).slice(0, DESIRED * 2);
                  // Fetch each article page sequentially until we have DESIRED items
                  for (const link of links) {
                    if (mapped.length >= DESIRED) break;
                    try {
                      const articleAll = `https://api.allorigins.win/get?url=${encodeURIComponent(link)}`;
                      const artResp = await fetch(articleAll, { cache: "no-cache" });
                      if (!artResp.ok) continue;
                      const artJson = await artResp.json();
                      const artHtml = artJson?.contents || artJson;
                      if (!artHtml || typeof artHtml !== "string") continue;

                      // Extract title, content snippet, image, author, pubDate
                      const tMatch = artHtml.match(/<title>([^<]+)<\/title>/i);
                      const title = (tMatch && tMatch[1]) ? tMatch[1].replace(/\s+\|\s+Medium.*$/i, "").trim() : "Untitled";
                      const linkMatch = link;
                      const authorMatch = artHtml.match(/rel=\"author\"[^>]*>([^<]+)<\/a>/i) || artHtml.match(/<meta name=\"author\" content=\"([^\"]+)\"/i);
                      const author = authorMatch ? (authorMatch[1] || authorMatch[0]) : "The Ink Home";
                      const dateMatch = artHtml.match(/<meta property=\"article:published_time\" content=\"([^\"]+)\"/i) || artHtml.match(/<time[^>]*datetime=\"([^\"]+)\"/i);
                      const pubDate = dateMatch ? (dateMatch[1] || new Date().toUTCString()) : new Date().toUTCString();
                      const contentMatch = artHtml.match(/<article[\s\S]*?<\/article>/i) || artHtml.match(/<section[\s\S]*?<\/section>/i) || ["",""];
                      const content = contentMatch && contentMatch[0] ? contentMatch[0] : "";
                      const imgMatch = artHtml.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
                      const cover = imgMatch && imgMatch[1] ? imgMatch[1] : undefined;
                      let slug = "";
                      try {
                        const parts = link.split("/");
                        slug = parts[parts.length - 1] || parts[parts.length - 2] || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      } catch (e) {
                        slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      }

                      const item: Story = {
                        title: title.trim(),
                        link: linkMatch,
                        author: author.trim(),
                        role: "",
                        pubDate,
                        categories: ["Editorial"],
                        description: (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...",
                        content,
                        cover,
                        slug,
                        avatar: undefined
                      };

                      // Dedupe and add
                      if (!mapped.some((s) => s.slug === item.slug)) {
                        mapped.push(item);
                      }
                    } catch (e) {
                      // continue on per-article errors
                      continue;
                    }
                  }
                }
              }
            } catch (scrapeErr) {
              console.warn("Publication scraping failed:", scrapeErr);
            }
          }

          // Merge mapped with current stories (dedupe)
          if (mapped.length > 0) {
            setStories((prev) => {
              const slugs = new Set();
              const merged: Story[] = [];
              for (const s of mapped) {
                if (!slugs.has(s.slug)) {
                  merged.push(s);
                  slugs.add(s.slug);
                }
              }
              for (const p of prev) {
                if (!slugs.has(p.slug)) {
                  merged.push(p);
                  slugs.add(p.slug);
                }
              }
              const final = merged.slice(0, DESIRED);
              // Cache to localStorage
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), stories: final }));
              } catch (e) {}
              return final;
            });
          }
        }
      } catch (rssErr) {
        console.warn("rss2json/allorigins fallback failed:", rssErr);
      }
    }
    fetchInitialData();
  }, []);

  // Set up Ambient Soundscape & Scroll Velocity tracking
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useRef(0);

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
        
        // Lowpass filter for deep acoustic reading atmosphere
        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(220, audioContext.currentTime);
        filter.Q.setValueAtTime(1.0, audioContext.currentTime);

        // Soft volume to hold a gentle focus sound
        gainNode.gain.setValueAtTime(0.015, audioContext.currentTime);
        
        // Add subtle low frequency LFO pitch modulation
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.setValueAtTime(0.15, audioContext.currentTime); // Ultra slow rhythm
        lfoGain.gain.setValueAtTime(5, audioContext.currentTime);
        
        // Secondary shimmer oscillator (higher pitch) that emerges only when scrolling
        const shimmerOsc = audioContext.createOscillator();
        shimmerOsc.type = "triangle";
        shimmerOsc.frequency.setValueAtTime(440, audioContext.currentTime);
        const shimmerGain = audioContext.createGain();
        shimmerGain.gain.setValueAtTime(0.0, audioContext.currentTime); // Start silent

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(filter);
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(filter);
        
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        osc.start();
        lfo.start();
        shimmerOsc.start();
        
        (audioRef.current as any).audioContext = audioContext;
        (audioRef.current as any).oscillator = osc;
        (audioRef.current as any).lfo = lfo;
        (audioRef.current as any).shimmerOsc = shimmerOsc;
        (audioRef.current as any).shimmerGain = shimmerGain;
        (audioRef.current as any).filter = filter;
        (audioRef.current as any).gainNode = gainNode;
      },
      pause: () => {
        try {
          const ref = audioRef.current as any;
          if (ref.oscillator) ref.oscillator.stop();
          if (ref.lfo) ref.lfo.stop();
          if (ref.shimmerOsc) ref.shimmerOsc.stop();
          if (ref.audioContext) ref.audioContext.suspend();
        } catch (e) {}
      }
    } as any;

    // Scroll tracker
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const dt = Math.max(currentTime - lastScrollTime.current, 10);
      const dy = Math.abs(currentScrollY - lastScrollY.current);
      
      const velocity = dy / dt; // pixels per ms
      scrollVelocity.current = Math.min(velocity, 5); // cap at reasonable speed
      
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    // Animation frame tick loop to decay scroll velocity smoothly and modulate audio
    let animationFrameId: number;
    let lastTickTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = (now - lastTickTime) / 1000;
      lastTickTime = now;

      // Decay velocity
      if (scrollVelocity.current > 0) {
        scrollVelocity.current -= scrollVelocity.current * 3.5 * dt;
        if (scrollVelocity.current < 0.001) scrollVelocity.current = 0;
      }

      // Modulate synth properties if running
      const ref = audioRef.current as any;
      if (ref && ref.audioContext && ref.audioContext.state === "running") {
        const vel = scrollVelocity.current;
        const curTime = ref.audioContext.currentTime;

        // Modulate main filter frequency (up to 1800Hz)
        const targetFilterFreq = 220 + vel * 320; // 220Hz -> ~1820Hz at max velocity
        if (ref.filter) {
          ref.filter.frequency.setTargetAtTime(targetFilterFreq, curTime, 0.12);
          ref.filter.Q.setTargetAtTime(1.0 + vel * 2.0, curTime, 0.12);
        }

        // Modulate secondary shimmer volume & pitch based on velocity
        if (ref.shimmerGain && ref.shimmerOsc) {
          const targetShimmerVol = vel * 0.012; // max shimmer volume multiplier
          ref.shimmerGain.gain.setTargetAtTime(targetShimmerVol, curTime, 0.15);

          const targetShimmerFreq = 440 + vel * 80;
          ref.shimmerOsc.frequency.setTargetAtTime(targetShimmerFreq, curTime, 0.18);
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      try {
        const ref = audioRef.current as any;
        if (ref && ref.oscillator) ref.oscillator.stop();
        if (ref && ref.shimmerOsc) ref.shimmerOsc.stop();
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
    navigateTo("/" + (activeTab === "authors" ? "about" : activeTab));
    // Auto start the sound on entrance for premium cinematic audio feedback
    if (!musicPlaying) {
      try {
        audioRef.current?.play();
        setMusicPlaying(true);
      } catch (e) {}
    }
  };

  return (
    <div 
      data-atmosphere={bgMode}
      className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 selection:text-white"
    >
      
      {/* Carbon & Noise Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-overlay carbon-texture z-[2]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] noise-overlay z-[2]" />
      
      {/* Minimal Ambient lighting glows dynamic wrapper */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-[1] transition-all duration-1000" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none z-[1] transition-all duration-1000" />

      {/* 3D Cosmic Constellation Scene */}
      <Suspense fallback={null}>
        <ThreeBackground mode={bgMode} activeTab={selectedStory ? "story" : activeTab} />
      </Suspense>

      {/* Floating Atmosphere Customizer Deck */}
      <div 
        className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[var(--glow-text)]/40"
        id="atmosphere-deck"
      >
        <span className="hidden md:inline-block px-2 text-slate-500 font-bold select-none text-[9px] uppercase tracking-widest pl-2.5">Atmosphere:</span>
        <button
          onClick={() => setBgMode("stellar")}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
            bgMode === "stellar" 
              ? "bg-[#06b6d4] text-black font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.4)]" 
              : "text-slate-400 hover:text-[#06b6d4]"
          }`}
          title="Stellar Universe Node"
        >
          <span className={`w-1 h-1 rounded-full bg-cyan-400 ${bgMode === "stellar" ? "bg-black animate-pulse" : ""}`} />
          Cosmic
        </button>
        <button
          onClick={() => setBgMode("ink")}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
            bgMode === "ink" 
              ? "bg-[#6366f1] text-black font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.4)]" 
              : "text-slate-400 hover:text-[#6366f1]"
          }`}
          title="Flowing Writer's Ink"
        >
          <span className={`w-1 h-1 rounded-full bg-indigo-400 ${bgMode === "ink" ? "bg-black animate-pulse" : ""}`} />
          Ink
        </button>
        <button
          onClick={() => setBgMode("forest")}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
            bgMode === "forest" 
              ? "bg-[#f59e0b] text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)]" 
              : "text-slate-400 hover:text-[#f59e0b]"
          }`}
          title="Cozy Forest Cabin Embers"
        >
          <span className={`w-1 h-1 rounded-full bg-amber-400 ${bgMode === "forest" ? "bg-black animate-pulse" : ""}`} />
          Cabin
        </button>
        <button
          onClick={() => setBgMode("constellation")}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
            bgMode === "constellation" 
              ? "bg-[#10b981] text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
              : "text-slate-400 hover:text-[#10b981]"
          }`}
          title="Thought Constellations Network"
        >
          <span className={`w-1 h-1 rounded-full bg-emerald-400 ${bgMode === "constellation" ? "bg-black animate-pulse" : ""}`} />
          Neural
        </button>
      </div>

      {/* Floating Sound Controller */}
      <button 
        onClick={handleToggleSound}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2.5 bg-black/60 hover:bg-black/85 border border-white/10 hover:border-[var(--glow-text)]/40 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-all backdrop-blur-xl cursor-pointer shadow-2xl hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        title={musicPlaying ? "Mute Cosmic Hum" : "Unmute Cosmic Hum"}
      >
        {musicPlaying ? (
          <>
            <div className="sound-wave-container">
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
            </div>
            <span className="text-[9px] text-[var(--glow-text)] atmosphere-text pr-1 font-bold">AMBIENT</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="text-[9px] pr-1">MUTED</span>
          </>
        )}
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
            onMouseMove={handleMouseMove}
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
                {/* Main Heading title with custom gradient styling and 3D kinetic interaction */}
                <h1 
                  style={{
                    letterSpacing: `${-0.05 + Math.abs(coords.x) * 0.03}em`,
                    transform: `perspective(1000px) rotateY(${coords.x * 12}deg) rotateX(${-coords.y * 12}deg) translateY(${scrollY * -0.1}px)`,
                    textShadow: `${-coords.x * 12}px ${-coords.y * 12}px 24px var(--glow-color)`,
                    transition: "transform 0.08s ease-out, letter-spacing 0.15s ease-out, text-shadow 0.15s ease-out"
                  }}
                  className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-black tracking-tighter mb-6 italic uppercase font-display bg-gradient-to-r from-white via-cyan-400 to-indigo-400 bg-clip-text text-transparent select-none"
                >
                  The Ink<br />Home
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
                  className="px-8 py-4 bg-white text-black font-extrabold uppercase tracking-[0.2em] text-[11px] hover:bg-cyan-500 hover:scale-102 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-2.5 z-20 mx-auto"
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
                  {/* Subscribe card (inline) */}
                  <div className="max-w-4xl mx-auto mb-4 px-4">
                    <Subscribe />
                  </div>

                  <div className="relative w-full overflow-hidden border-t border-b border-white/10 py-4 bg-black/40 backdrop-blur-sm">
                    <div className="flex gap-4 animate-marquee hover:pause whitespace-nowrap">
                      {stories.map((story) => (
                        <div
                          key={story.slug}
                          onClick={() => {
                            setSelectedStory(story);
                            setEntered(true);
                            navigateTo(`/story/${story.slug}`);
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
            <header className="sticky top-0 md:top-4 md:mt-4 z-30 w-full md:max-w-6xl md:mx-auto border-b md:border border-white/10 bg-[#050505]/95 md:bg-black/60 backdrop-blur-xl md:rounded-full transition-all duration-300 md:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between px-6 h-16 md:h-16">
                
                {/* Brand Logo Wordmark */}
                <div 
                  onClick={() => {
                    setEntered(false);
                    navigateTo("/");
                  }} 
                  className="flex items-center cursor-pointer group"
                >
                  <Logo size={36} />
                </div>

                 {/* Dashboard Mode view buttons */}
                <nav className="hidden md:flex items-center gap-1 p-0.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-mono uppercase">
                  <button
                    onClick={() => handleTabChange("3d")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === "3d" 
                        ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Compass className="w-3 h-3" />
                    3D Universe
                  </button>
                  <button
                    onClick={() => handleTabChange("grid")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === "grid" 
                        ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="w-3 h-3" />
                    Bento Grid
                  </button>
                  <button
                    onClick={() => handleTabChange("list")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === "list" 
                        ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    Ledger List
                  </button>
                  <button
                    onClick={() => handleTabChange("authors")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeTab === "authors" 
                        ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    About Us
                  </button>
                  <button
                    onClick={() => handleTabChange("saved")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer relative ${
                      activeTab === "saved" 
                        ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    Saved
                    {savedSlugs.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--glow-text)] text-[9px] font-bold text-black font-mono shadow-[0_0_8px_var(--glow-color)]">
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
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-[var(--glow-text)]/10 border border-[var(--glow-text)]/30 text-[var(--glow-text)] hover:bg-[var(--glow-text)]/20 transition-all cursor-pointer"
                  >
                    Medium
                    <ExternalLink className="w-3 h-3 text-[var(--glow-text)]" />
                  </a>
                </div>
              </div>

              {/* Mobile Floating Tab selector */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-1">
                <div className="flex justify-around items-center text-[9px] font-mono leading-none">
                  <button
                    onClick={() => handleTabChange("3d")}
                    className={`py-2 px-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
                      activeTab === "3d" ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse" : "text-slate-400"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    3D
                  </button>
                  <button
                    onClick={() => handleTabChange("grid")}
                    className={`py-2 px-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
                      activeTab === "grid" ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse" : "text-slate-400"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Bento
                  </button>
                  <button
                    onClick={() => handleTabChange("list")}
                    className={`py-2 px-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
                      activeTab === "list" ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse" : "text-slate-400"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    List
                  </button>
                  <button
                    onClick={() => handleTabChange("authors")}
                    className={`py-2 px-3 rounded-full flex flex-col items-center gap-0.5 transition-all ${
                      activeTab === "authors" ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse" : "text-slate-400"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    About
                  </button>
                  <button
                    onClick={() => handleTabChange("saved")}
                    className={`py-2 px-3 rounded-full flex flex-col items-center gap-0.5 transition-all relative ${
                      activeTab === "saved" ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse" : "text-slate-400"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Saved
                    {savedSlugs.length > 0 && (
                      <span className="absolute top-1 right-2 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--glow-text)] text-[8px] font-bold text-black font-mono shadow-[0_0_6px_var(--glow-color)]">
                        {savedSlugs.length}
                      </span>
                    )}
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
                          <Suspense fallback={
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
                              <div className="w-8 h-8 border border-t-cyan-400 rounded-full animate-spin" />
                              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Constructing 3D Space...</span>
                            </div>
                          }>
                            <Carousel3D 
                              stories={stories} 
                              onSelectStory={handleSelectStory} 
                              likedSlugs={likedSlugs}
                              savedSlugs={savedSlugs}
                              onToggleLike={handleToggleLike}
                              onToggleSave={handleToggleSave}
                            />
                          </Suspense>
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
                            onSelectStory={handleSelectStory} 
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
                            onSelectStory={handleSelectStory} 
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
                          <AuthorsSection stories={stories} onSelectStory={handleSelectStory} editors={editors} writers={writers} aboutInfo={aboutInfo} />
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
                                onClick={() => handleTabChange("3d")}
                                className="px-5 py-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors font-bold cursor-pointer"
                              >
                                Explore Cosmos
                              </button>
                            </div>
                          ) : (
                            <StoryGrid 
                              stories={stories.filter(s => savedSlugs.includes(s.slug))} 
                              onSelectStory={handleSelectStory}
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
                      <AuthorsSection stories={stories} onSelectStory={handleSelectStory} editors={editors} writers={writers} aboutInfo={aboutInfo} />
                    </div>
                  )}

                </div>
              )}

            </main>

            {/* General Site Footer */}
            <footer className="w-full border-t border-white/10 bg-[#070707] pt-16 pb-28 md:pb-16 flex flex-col items-center justify-center space-y-4 text-center text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-12">
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
        onClose={() => handleSelectStory(null)} 
        isLiked={selectedStory ? likedSlugs.includes(selectedStory.slug) : false}
        isSaved={selectedStory ? savedSlugs.includes(selectedStory.slug) : false}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
