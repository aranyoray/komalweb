"use client";

import { ReactNode } from "react";

interface TextShimmerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export default function TextShimmer({ 
  children, 
  className = "",
  duration = 3 
}: TextShimmerProps) {
  return (
    <span 
      className={`relative inline-block ${className}`}
      style={{
        background: `linear-gradient(
          120deg,
          currentColor 0%,
          currentColor 40%,
          rgba(147, 112, 219, 0.9) 50%,
          currentColor 60%,
          currentColor 100%
        )`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `shimmer ${duration}s ease-in-out infinite`,
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
      {children}
    </span>
  );
}

