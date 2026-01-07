"use client";

export default function NoiseOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{
        opacity,
        mixBlendMode: "overlay",
      }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

