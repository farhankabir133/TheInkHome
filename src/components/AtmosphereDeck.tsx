import React from "react";

interface AtmosphereDeckProps {
  bgMode: "stellar" | "ink" | "forest" | "constellation";
  setBgMode: (mode: "stellar" | "ink" | "forest" | "constellation") => void;
}

export default function AtmosphereDeck({ bgMode, setBgMode }: AtmosphereDeckProps) {
  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[var(--glow-text)]/40"
      id="atmosphere-deck"
    >
      <span className="hidden md:inline-block px-2 text-slate-500 font-bold select-none text-[9px] uppercase tracking-widest pl-2.5">Atmosphere:</span>
      <button
        onClick={() => setBgMode("stellar")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
          bgMode === "stellar"
            ? "bg-[var(--atmo-text)] text-black font-extrabold shadow-[0_0_12px_var(--atmo-glow)]"
            : "text-slate-400 hover:text-[var(--atmo-text)]"
        }`}
        title="Stellar Universe Node"
      >
          <span className={`w-1 h-1 rounded-full ${bgMode === "stellar" ? "bg-black animate-pulse" : "bg-current opacity-70"}`} />
        Cosmic
      </button>
      <button
        onClick={() => setBgMode("ink")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
          bgMode === "ink"
            ? "bg-[var(--atmo-text)] text-black font-extrabold shadow-[0_0_12px_var(--atmo-glow)]"
            : "text-slate-400 hover:text-[var(--atmo-text)]"
        }`}
        title="Flowing Writer's Ink"
      >
          <span className={`w-1 h-1 rounded-full ${bgMode === "ink" ? "bg-black animate-pulse" : "bg-current opacity-70"}`} />
        Ink
      </button>
      <button
        onClick={() => setBgMode("forest")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
          bgMode === "forest"
            ? "bg-[var(--atmo-text)] text-black font-extrabold shadow-[0_0_12px_var(--atmo-glow)]"
            : "text-slate-400 hover:text-[var(--atmo-text)]"
        }`}
        title="Cozy Forest Cabin Embers"
      >
          <span className={`w-1 h-1 rounded-full ${bgMode === "forest" ? "bg-black animate-pulse" : "bg-current opacity-70"}`} />
        Cabin
      </button>
      <button
        onClick={() => setBgMode("constellation")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
          bgMode === "constellation"
            ? "bg-[var(--atmo-text)] text-black font-extrabold shadow-[0_0_12px_var(--atmo-glow)]"
            : "text-slate-400 hover:text-[var(--atmo-text)]"
        }`}
        title="Thought Constellations Network"
      >
          <span className={`w-1 h-1 rounded-full ${bgMode === "constellation" ? "bg-black animate-pulse" : "bg-current opacity-70"}`} />
        Neural
      </button>
    </div>
  );
}
