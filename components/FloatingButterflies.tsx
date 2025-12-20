"use client";

import { useEffect, useRef, useState } from "react";

interface ButterflyState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    wingPhase: number;
    size: number;
    id: number;
}

// Single butterfly with real physics - clean SVG design
function Butterfly({ state }: { state: ButterflyState }) {
    // Wing flap uses scaleX for a more natural look (0.3 to 1.0)
    const wingScale = 0.3 + Math.abs(Math.sin(state.wingPhase)) * 0.7;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: state.x,
                top: state.y,
                transform: `rotate(${state.angle + 90}deg)`,
            }}
        >
            <svg
                width={state.size}
                height={state.size}
                viewBox="0 0 40 40"
                fill="none"
            >
                {/* Left wing - scales for flapping */}
                <g style={{
                    transformOrigin: '20px 20px',
                    transform: `scaleX(${wingScale})`,
                }}>
                    <ellipse
                        cx="10"
                        cy="15"
                        rx="9"
                        ry="12"
                        fill="#A78BFA"
                        opacity="0.85"
                    />
                    <ellipse
                        cx="8"
                        cy="28"
                        rx="6"
                        ry="8"
                        fill="#C4B5FD"
                        opacity="0.75"
                    />
                </g>

                {/* Right wing - scales for flapping (mirrored) */}
                <g style={{
                    transformOrigin: '20px 20px',
                    transform: `scaleX(${wingScale})`,
                }}>
                    <ellipse
                        cx="30"
                        cy="15"
                        rx="9"
                        ry="12"
                        fill="#A78BFA"
                        opacity="0.85"
                    />
                    <ellipse
                        cx="32"
                        cy="28"
                        rx="6"
                        ry="8"
                        fill="#C4B5FD"
                        opacity="0.75"
                    />
                </g>

                {/* Body */}
                <ellipse cx="20" cy="20" rx="2" ry="10" fill="#7C3AED" />

                {/* Antennae */}
                <line x1="19" y1="10" x2="16" y2="5" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" />
                <line x1="21" y1="10" x2="24" y2="5" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" />
            </svg>
        </div>
    );
}

interface FloatingButterfliesProps {
    count?: number;
}

export default function FloatingButterflies({ count = 20 }: FloatingButterfliesProps) {
    const [butterflies, setButterflies] = useState<ButterflyState[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

    useEffect(() => {
        // Track mouse position relative to container
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                };
            }
        };

        const handleMouseLeave = () => {
            // Move mouse position far away when cursor leaves
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Initialize butterflies
        const initButterflies = (): ButterflyState[] => {
            return Array.from({ length: count }, (_, i) => ({
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 50 : 800),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500) + 50,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 1.5,
                angle: Math.random() * 30 - 15,
                wingPhase: Math.random() * Math.PI * 2,
                size: 18 + Math.random() * 10, // Smaller: 18-28px
                id: i,
            }));
        };

        setButterflies(initButterflies());

        const animate = (currentTime: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = currentTime;
            const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16, 3); // Normalize to ~60fps
            lastTimeRef.current = currentTime;

            const mousePos = mouseRef.current;

            setButterflies(prev => prev.map(butterfly => {
                let { x, y, vx, vy, angle, wingPhase, size, id } = butterfly;

                // Calculate distance from mouse cursor
                const dx = x - mousePos.x;
                const dy = y - mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Repulsion zone - butterflies flee when cursor is within 150px (larger radius)
                const repulsionRadius = 150;
                let isFleeing = false;
                if (distance < repulsionRadius && distance > 0) {
                    isFleeing = true;
                    // Calculate stronger repulsion force - more vigorous when closer
                    const repulsionStrength = (1 - distance / repulsionRadius) * 15;
                    const repulsionX = (dx / distance) * repulsionStrength;
                    const repulsionY = (dy / distance) * repulsionStrength;

                    vx += repulsionX;
                    vy += repulsionY;

                    // Add random perpendicular scatter for more chaotic, natural fleeing
                    const scatterAmount = (1 - distance / repulsionRadius) * 2.5;
                    const perpX = (-dy / distance) * scatterAmount * (Math.random() - 0.5) * 2;
                    const perpY = (dx / distance) * scatterAmount * (Math.random() - 0.5) * 2;
                    vx += perpX;
                    vy += perpY;

                    // Much faster wing flapping when fleeing (panicked)
                    wingPhase += 0.6 * deltaTime;
                }

                // Wing flapping - fast flutter
                wingPhase += 0.4 * deltaTime;

                // Random wandering behavior - change direction occasionally
                if (Math.random() < 0.02) {
                    vx += (Math.random() - 0.5) * 1.5;
                    vy += (Math.random() - 0.5) * 1;
                }

                // Gentle floating motion
                vy += Math.sin(currentTime * 0.002 + id) * 0.02;
                vx += Math.cos(currentTime * 0.001 + id * 0.5) * 0.01;

                // Apply velocity limits - higher when fleeing
                const maxSpeed = isFleeing ? 6 : 3;
                const speed = Math.sqrt(vx * vx + vy * vy);
                if (speed > maxSpeed) {
                    vx = (vx / speed) * maxSpeed;
                    vy = (vy / speed) * maxSpeed;
                }

                // Apply friction
                vx *= 0.99;
                vy *= 0.99;

                // Update position
                x += vx * deltaTime;
                y += vy * deltaTime;

                // Boundary wrapping - full width and height of container area
                const containerWidth = containerRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
                const containerHeight = containerRef.current?.offsetHeight || (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600);

                if (x < -50) x = containerWidth + 40;
                if (x > containerWidth + 50) x = -40;
                if (y < 20) { y = 20; vy = Math.abs(vy) * 0.5; }
                if (y > containerHeight - 50) { y = containerHeight - 50; vy = -Math.abs(vy) * 0.5; }

                // Angle follows movement direction
                const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI);
                angle += (targetAngle - angle) * 0.05;

                return { x, y, vx, vy, angle, wingPhase, size, id };
            }));

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [count]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {butterflies.map((butterfly) => (
                <Butterfly key={butterfly.id} state={butterfly} />
            ))}
        </div>
    );
}
