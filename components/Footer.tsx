"use client";

import Link from "next/link";
import Image from "next/image";
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

export default function Footer() {
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
      const count = 20; // More butterflies
      return Array.from({ length: count }, (_, i) => ({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 50 : 800),
        y: Math.random() * 300 + 50,
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

        // Boundary wrapping - full width and height of footer area
        const containerWidth = containerRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
        const containerHeight = containerRef.current?.offsetHeight || 400; // Default height if ref not available

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
  }, []);

  return (
    <footer className="footer py-12 border-t border-border bg-surface relative overflow-hidden" id="contact" ref={containerRef}>
      {/* Flying butterflies */}
      {butterflies.map((butterfly) => (
        <Butterfly key={butterfly.id} state={butterfly} />
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center">

        {/* Top Row: Logo + Social Icons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/finalstrokemonkey.png"
              alt="Komal Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-2xl tracking-tight text-text">KOMAL</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* Twitter/X */}
            <Link href="#" className="text-text-dim hover:text-text transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            {/* LinkedIn */}
            <Link href="https://www.linkedin.com/company/komaltech/" target="_blank" rel="noopener noreferrer" className="text-text-dim hover:text-text transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            {/* Instagram */}
            <Link href="#" className="text-text-dim hover:text-text transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
            {/* YouTube */}
            <Link href="#" className="text-text-dim hover:text-text transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="#"
            className="flex items-center gap-2 bg-text text-surface px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] leading-none opacity-80">Download on the</span>
              <span className="text-sm font-semibold leading-tight">App Store</span>
            </div>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 bg-text text-surface px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] leading-none opacity-80">GET IT ON</span>
              <span className="text-sm font-semibold leading-tight">Google Play</span>
            </div>
          </Link>
        </div>



        {/* Copyright Line */}
        <div className="border-t border-border pt-6 mb-6">
          <p className="text-text-dim text-sm">
            © 2024-2025 ChildCog Pvt Ltd. All rights reserved.<br />
            ISO27001, DPDA, GDPR, and HIPAA compliant.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-8">
          <Link href="/how-komal-works" className="text-text-dim hover:text-text transition-colors">
            How It Works
          </Link>
          <span className="text-border">|</span>
          <Link href="/privacypolicy" className="text-text-dim hover:text-text transition-colors">
            Privacy Policy
          </Link>
          <span className="text-border">|</span>
          <Link href="/team" className="text-text-dim hover:text-text transition-colors">
            About Us
          </Link>
        </div>

        {/* Privacy Statement */}
        <div className="pt-6 border-t border-border/50 mb-4">
          <p className="text-text-dim text-xs leading-relaxed max-w-[900px] mx-auto">
            Private by design. No raw video, audio, or biometric identifiers are stored.<br />
            Only deidentified scores are used for long-term analyses. Raw media is auto-deleted after 24 hours or if app is uninstalled.
          </p>
        </div>

        {/* Powered by KomalSense */}
        <div>
          <p className="text-primary text-xs font-medium">
            Built on 20+ years of extensive research and ~2 billion played sessions.
          </p>
        </div>

      </div>
    </footer>
  );
}
