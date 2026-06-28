import React from "react";
import { motion } from "motion/react";
import {
  Compass,
  LayoutGrid,
  AlignLeft,
  Users,
  ExternalLink,
  Bookmark,
  Feather,
} from "lucide-react";
import { Logo } from "./Logo";

type Tab = "3d" | "grid" | "list" | "authors" | "saved" | "guideline";

interface DashboardHeaderProps {
  activeTab: Tab;
  savedSlugs: string[];
  onTabChange: (tab: Tab) => void;
  onLogoClick: () => void;
}

export default function DashboardHeader({
  activeTab,
  savedSlugs,
  onTabChange,
  onLogoClick,
}: DashboardHeaderProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "3d", label: "3D Universe", icon: <Compass className="w-3 h-3" /> },
    { id: "grid", label: "Bento Grid", icon: <LayoutGrid className="w-3 h-3" /> },
    { id: "list", label: "Ledger List", icon: <AlignLeft className="w-3 h-3" /> },
    { id: "guideline", label: "Guidelines", icon: <Feather className="w-3 h-3" /> },
    { id: "authors", label: "About Us", icon: <Users className="w-3 h-3" /> },
    { id: "saved", label: "Saved", icon: <Bookmark className="w-3 h-3" /> },
  ];

  return (
    <header className="sticky top-0 md:top-4 md:mt-4 z-30 w-full md:max-w-6xl md:mx-auto border-b md:border border-white/10 bg-[#050505]/95 md:bg-black/60 backdrop-blur-xl md:rounded-full transition-all duration-300 md:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between px-6 h-16 md:h-16">
        <div onClick={onLogoClick} className="flex items-center cursor-pointer group">
          <Logo size={36} />
        </div>

        <nav className="hidden md:flex items-center gap-1 p-0.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-mono uppercase">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-black font-extrabold shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

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

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md md:hidden rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-1">
        <div className="flex justify-around items-center text-[9px] font-mono leading-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-2.5 rounded-full flex flex-col items-center gap-0.5 transition-all relative ${
                activeTab === tab.id
                  ? "text-[var(--glow-text)] bg-white/5 font-extrabold scale-105 animate-pulse"
                  : "text-slate-400"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "saved" && savedSlugs.length > 0 && (
                <span className="absolute top-1 right-2.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--glow-text)] text-[8px] font-bold text-black font-mono shadow-[0_0_6px_var(--glow-color)]">
                  {savedSlugs.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
