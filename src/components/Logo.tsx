import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  iconOnly?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 40,
  iconOnly = false,
  textColor = "text-white"
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-fidelity vector depiction of The Ink Home original hand-drawn style branding */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Main golden moon gradient */}
          <radialGradient id="moonGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="40%" stopColor="#F9D423" />
            <stop offset="85%" stopColor="#E65C00" />
            <stop offset="100%" stopColor="#8C1D00" />
          </radialGradient>

          {/* Glowing aura around moon */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients for elements to look dramatic and editorial */}
          <linearGradient id="cabinRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="cabinFacade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="groundShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="100%" stopColor="#090D16" />
          </linearGradient>
        </defs>

        {/* 1. Golden Moon in background slightly off-center (left-aligned behind house) */}
        <circle
          cx="220"
          cy="200"
          r="105"
          fill="url(#moonGradient)"
          opacity="0.95"
          filter="url(#glow)"
        />

        {/* Moon subtle texture spots to depict original publication illustration */}
        <circle cx="160" cy="150" r="18" fill="#E65C00" opacity="0.12" />
        <circle cx="185" cy="130" r="10" fill="#E65C00" opacity="0.1" />
        <circle cx="140" cy="180" r="14" fill="#8C1D00" opacity="0.08" />
        
        {/* 2. Stylized Flying Birds silhouettes */}
        {/* Bird 1 */}
        <path
          d="M152 108 C158 98, 162 98, 166 106 C171 98, 175 98, 180 108"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        {/* Bird 2 */}
        <path
          d="M378 128 C383 120, 386 120, 390 126 C394 120, 398 120, 402 128"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* 3. Base Ground (Island / Grassy Platform) */}
        <ellipse cx="256" cy="410" rx="200" ry="32" fill="url(#groundShadow)" stroke="#111827" strokeWidth="2" />
        {/* Additional grass base styling strokes */}
        <ellipse cx="256" cy="405" rx="175" ry="18" fill="#0A0F1E" />
        <path d="M120 405 L392 405" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

        {/* 4. Pine Tree on Left (Evergreen) */}
        {/* Trunk */}
        <rect x="138" y="320" width="10" height="90" fill="#2D1B10" />
        {/* Foiliage Layer 1 */}
        <polygon points="90,360 200,360 143,260" fill="#042F1A" stroke="#02140A" strokeWidth="2.5" />
        <polygon points="100,320 190,320 143,230" fill="#064E2A" stroke="#02140A" strokeWidth="2" />
        <polygon points="110,270 176,270 143,200" fill="#0D7A31" stroke="#02140A" strokeWidth="1.5" />

        {/* 5. Deciduous Tree on Right (Lush round tree) */}
        {/* Trunk */}
        <path d="M382 340 L382 410" stroke="#2D1B10" strokeWidth="11" strokeLinecap="round" />
        <path d="M382 360 C382 360, 355 350, 350 340" stroke="#2D1B10" strokeWidth="6" strokeLinecap="round" />
        {/* Round foliage cloud shadows */}
        <circle cx="385" cy="295" r="50" fill="#061D15" stroke="#020E0A" strokeWidth="3.5" />
        {/* Bright highlights on round tree */}
        <circle cx="370" cy="285" r="35" fill="#0E4431" />
        <circle cx="405" cy="295" r="30" fill="#082F21" />
        <circle cx="380" cy="270" r="22" fill="#155D40" />

        {/* 6. Cozy Writer Cabin / House (The Ink Home) */}
        {/* Chimney placed on Roof slant, behind */}
        <rect x="290" y="175" width="18" height="55" fill="#6B21A8" stroke="#3B0764" strokeWidth="2" />
        <rect x="286" y="170" width="26" height="8" fill="#581C87" rx="1" />
        {/* Puffs of smoke from chimney */}
        <path d="M299 155 Q305 145 295 130 T310 105" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.3" />

        {/* Main Timber Cabin Siding Body */}
        <rect x="180" y="240" width="150" height="152" fill="url(#cabinFacade)" stroke="#090D16" strokeWidth="5.5" />

        {/* Timber Planks horizontal paneling lines */}
        <line x1="183" y1="262" x2="327" y2="262" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="183" y1="284" x2="327" y2="284" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="183" y1="306" x2="327" y2="306" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="183" y1="328" x2="327" y2="328" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="183" y1="350" x2="327" y2="350" stroke="#64748B" strokeWidth="1.5" />
        <line x1="183" y1="372" x2="327" y2="372" stroke="#64748B" strokeWidth="1.5" />

        {/* Cozy light-filled Windows on Facade */}
        {/* Attic Round Window */}
        <circle cx="255" cy="180" r="16" fill="#FDE047" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="255" y1="164" x2="255" y2="196" stroke="#0F172A" strokeWidth="2.5" />
        <line x1="239" y1="180" x2="271" y2="180" stroke="#0F172A" strokeWidth="2.5" />

        {/* Ground Floor Left Window with warm orange glow */}
        <rect x="200" y="255" width="28" height="42" fill="#FACC15" rx="3" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="214" y1="255" x2="214" y2="297" stroke="#0F172A" strokeWidth="2" />
        <line x1="200" y1="272" x2="228" y2="272" stroke="#0F172A" strokeWidth="2" />

        {/* Ground Floor Right Window */}
        <rect x="282" y="255" width="28" height="42" fill="#FACC15" rx="3" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="296" y1="255" x2="296" y2="297" stroke="#0F172A" strokeWidth="2" />
        <line x1="282" y1="272" x2="310" y2="272" stroke="#0F172A" strokeWidth="2" />

        {/* Ground Floor Center/Right secondary Windows */}
        <rect x="282" y="318" width="28" height="42" fill="#E2E8F0" rx="3" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="296" y1="318" x2="296" y2="360" stroke="#0F172A" strokeWidth="2" />
        <line x1="282" y1="334" x2="310" y2="334" stroke="#0F172A" strokeWidth="2" />

        {/* Main High Slanted Cabin Roof */}
         {/* Main roof outline */}
        <polygon
          points="160,244 350,244 255,142"
          fill="url(#cabinRoof)"
          stroke="#090D16"
          strokeWidth="5.5"
          strokeLinejoin="miter"
        />
        {/* Shading panel on right of roof */}
        <polygon
          points="255,142 350,244 255,244"
          fill="#020617"
          opacity="0.32"
        />

        {/* 7. Cozy Covered Entry Porch on Left */}
        {/* Support Pillar */}
        <rect x="188" y="324" width="6" height="68" fill="#1E293B" stroke="#020617" strokeWidth="1.5" />
        <rect x="250" y="324" width="6" height="68" fill="#1E293B" stroke="#020617" strokeWidth="1.5" />
        {/* Porch slanted rooflet */}
        <polygon
          points="176,324 262,324 220,305"
          fill="#1E293B"
          stroke="#090D16"
          strokeWidth="3.5"
        />
        {/* Porch door */}
        <rect x="206" y="324" width="26" height="68" fill="#111827" stroke="#020617" strokeWidth="2.5" />
        <circle cx="226" cy="358" r="2.5" fill="#F59E0B" /> {/* Brass doorknob */}
        
        {/* Front Concrete steps */}
        <rect x="194" y="388" width="50" height="8" fill="#475569" stroke="#020617" strokeWidth="2" rx="1" />
        <rect x="188" y="396" width="62" height="10" fill="#334155" stroke="#020617" strokeWidth="2" rx="1" />
      </svg>

      {/* Optional typography lockup - condensed elegant display sans/serif pairing */}
      {!iconOnly && (
        <div className="flex flex-col items-start leading-none">
          <span className={`font-display text-base font-extrabold tracking-widest uppercase ${textColor}`}>
            The Ink Home
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-cyan-400 uppercase mt-0.5">
            Spatial Publication
          </span>
        </div>
      )}
    </div>
  );
};
