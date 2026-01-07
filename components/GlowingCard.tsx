"use client";

import { useRef, useState, ReactNode } from "react";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlowingCard({
  children,
  className = "",
  glowColor = "rgba(107, 78, 113, 0.4)",
}: GlowingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? `radial-gradient(circle 200px at ${position.x}px ${position.y}px, ${glowColor}, transparent)`
          : "transparent",
        transition: "background 0.3s ease-out",
      }}
    >
      {/* Border glow effect */}
      <div 
        className="absolute inset-0 rounded-inherit pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 150px at ${position.x}px ${position.y}px, ${glowColor}, transparent)`,
          filter: "blur(20px)",
        }}
      />
      {children}
    </div>
  );
}

