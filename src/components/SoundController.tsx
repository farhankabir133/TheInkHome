import React from "react";
import { VolumeX, Volume2 } from "lucide-react";

interface SoundControllerProps {
  musicPlaying: boolean;
  onToggle: () => void;
}

export default function SoundController({ musicPlaying, onToggle }: SoundControllerProps) {
  return (
    <button
      onClick={onToggle}
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
  );
}
