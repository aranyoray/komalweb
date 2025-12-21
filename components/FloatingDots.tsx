"use client";

interface FloatingDotsProps {
    dotSize?: number;
    spacing?: number;
    color?: string;
    opacity?: number;
}

export default function FloatingDots({
    dotSize = 1.5,
    spacing = 24,
    color = "#7C3AED",
    opacity = 0.15
}: FloatingDotsProps) {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
                backgroundSize: `${spacing}px ${spacing}px`,
                opacity: opacity,
            }}
        />
    );
}
