import React from "react";
import { Bookmark } from "lucide-react";

interface EmptySavedStateProps {
  onExplore: () => void;
}

export default function EmptySavedState({ onExplore }: EmptySavedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] border border-white/10 bg-[#0c0c0c]/80 p-8 text-center max-w-xl mx-auto space-y-4">
      <Bookmark className="w-8 h-8 text-slate-600" />
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Your Archive is Empty</p>
      <p className="text-xs text-slate-500 leading-relaxed font-light">
        Connect to the 3D Universe or Bento Grid, find stories that challenge your cognitive horizons, and click their save trigger to register them here.
      </p>
      <button
        onClick={onExplore}
        className="px-5 py-2 border border-[var(--atmo-border)] text-[var(--atmo-text)] hover:bg-[var(--atmo-text)] hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors font-bold cursor-pointer"
      >
        Explore Cosmos
      </button>
    </div>
  );
}
