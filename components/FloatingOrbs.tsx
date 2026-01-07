"use client";

import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const orbColors = [
  "rgba(107, 78, 113, 0.15)", // Purple
  "rgba(39, 2, 99, 0.1)",     // Deep violet
  "rgba(147, 112, 219, 0.12)", // Medium purple
  "rgba(186, 85, 211, 0.08)", // Orchid
  "rgba(75, 0, 130, 0.1)",    // Indigo
];

export default function FloatingOrbs({ count = 5 }: { count?: number }) {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const generated: Orb[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 200 + Math.random() * 400,
        color: orbColors[Math.floor(Math.random() * orbColors.length)],
        duration: 20 + Math.random() * 30,
        delay: Math.random() * -20,
      });
    }
    setOrbs(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(50px, -80px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-30px, 60px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translate(80px, 30px) scale(1.05);
            opacity: 0.7;
          }
        }
        
        @keyframes orbMorph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          50% {
            border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%;
          }
          75% {
            border-radius: 60% 30% 50% 40% / 70% 50% 30% 50%;
          }
        }
      `}</style>
      
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(ellipse at center, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            animation: `orbFloat ${orb.duration}s ease-in-out infinite, orbMorph ${orb.duration * 0.8}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

