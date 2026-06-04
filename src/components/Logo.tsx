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
  // Vite-friendly static asset URL. This avoids typings issues with direct image imports.
  const logoSrc = new URL("../../assets/The_Ink_Home.webp", import.meta.url).href;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="The Ink Home logo"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        className="transition-all duration-300 drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] rounded"
      />

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
