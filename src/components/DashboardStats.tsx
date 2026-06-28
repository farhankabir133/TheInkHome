import React from "react";
import { Bookmark } from "lucide-react";

interface DashboardStatsProps {
  activeTab: string;
  stories: any[];
  editors: any[];
  writers: any[];
  aboutInfo: any;
}

export default function DashboardStats({
  activeTab,
  stories,
  editors,
  writers,
  aboutInfo,
}: DashboardStatsProps) {
  if (activeTab === "authors" || activeTab === "guideline") return null;

  return (
    <div className="w-full max-w-6xl mx-auto border-t border-white/10 pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-2 border-l-2 border-[var(--atmo-border)] pl-4">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--atmo-text)]">TELEMETRY SOURCES</h4>
        <p className="text-xs text-slate-400 font-light">
          Stories ingested automatically from `https://medium.com/the-ink-home` via background parsing array.
        </p>
      </div>

      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white">NODE RECEPTOR</h4>
        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-light">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--atmo-text)] animate-ping" />
          Online / Synced dynamically
        </p>
      </div>

      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white">CATALOG STATUS</h4>
        <p className="text-xs text-slate-400 font-light">
          {stories.length} interactive stories floating in coordinates.{" "}
          {new Set(stories.map((s: any) => s.author)).size} accredited editors.
        </p>
      </div>

      <div className="space-y-2 border-l-2 border-slate-700 pl-4">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--atmo-text)]">WebGL MATRIX</h4>
        <p className="text-xs text-slate-400 font-light">
          Designed with custom constellations for spatial immersion. Read full layouts via Medium native links.
        </p>
      </div>
    </div>
  );
}
