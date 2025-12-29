"use client";

import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    glowSize: number;
}

export default function FloatingParticles({ count = 30 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generatedParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            generatedParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 5 + 3, // 3-8px (bigger sparkles)
                duration: Math.random() * 12 + 6, // 6-18s
                delay: Math.random() * 5, // 0-5s delay
                opacity: Math.random() * 0.4 + 0.6, // 0.6-1.0 opacity (brighter)
                glowSize: Math.random() * 15 + 10, // 10-25px glow radius (bigger glow)
            });
        }
        setParticles(generatedParticles);
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: `radial-gradient(circle, rgba(138, 43, 226, 0.9) 0%, rgba(75, 0, 130, 0.6) 50%, transparent 70%)`,
                        boxShadow: `
                            0 0 ${particle.glowSize}px rgba(138, 43, 226, 0.95),
                            0 0 ${particle.glowSize * 2}px rgba(138, 43, 226, 0.7),
                            0 0 ${particle.glowSize * 3}px rgba(138, 43, 226, 0.4),
                            0 0 ${particle.glowSize * 4}px rgba(138, 43, 226, 0.2)
                        `,
                        opacity: particle.opacity,
                        animation: `floatSparkle ${particle.duration}s ease-in-out ${particle.delay}s infinite, twinkle ${Math.random() * 2 + 1}s ease-in-out ${particle.delay}s infinite`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes floatSparkle {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(10px, -15px) scale(1.2);
                    }
                    50% {
                        transform: translate(-8px, -25px) scale(0.8);
                    }
                    75% {
                        transform: translate(12px, -10px) scale(1.1);
                    }
                }
                @keyframes twinkle {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
            `}</style>
        </div>
    );
}
