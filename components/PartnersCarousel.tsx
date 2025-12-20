"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const partners = [
    { src: "/startup_yale_logo.png", name: "Yale University", caption: "Early Learning Partner" },
    { src: "/reservoir_neurodiversity_consultants_india_logo.png", name: "Reservoir Neurodiversity Consultants", caption: "Research Partner" },
    { src: "/trehaus_singapore_logo.png", name: "Trehaus Singapore", caption: "Brand Partner" },
    { src: "/california-state-university-longbeach_seal-pilot-partners-komalkids.png", name: "California State University Long Beach", caption: "Pilot Partners" },
    { src: "/ucb.png", name: "UC Berkeley", caption: "Developmental Research" },
    { src: "/ips.png", name: "IPS", caption: "Pedagogical Advisor" },
    { src: "/zeelearn.png", name: "Zee Learn", caption: "Scaling Partner" },
    { src: "/ucal.jpg", name: "UCAL", caption: "Institutional Partner" },
    { src: "/unep.png", name: "UNEP", caption: "Global Impact Collaborator" },
];

// Duplicate for seamless infinite loop
const extendedPartners = [...partners, ...partners, ...partners];

export default function PartnersCarousel() {
    const [translateX, setTranslateX] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemWidth = useRef(180); // Base item width estimate
    const gapWidth = 48; // gap-12 = 3rem = 48px

    // Calculate single set width
    const singleSetWidth = partners.length * (itemWidth.current + gapWidth);

    useEffect(() => {
        // Start at the middle set
        setTranslateX(-singleSetWidth);
    }, [singleSetWidth]);

    const nextSlide = useCallback(() => {
        setIsTransitioning(true);
        setTranslateX(prev => prev - (itemWidth.current + gapWidth));
    }, []);

    // Handle seamless loop reset
    useEffect(() => {
        // If we've scrolled past two sets, reset to the middle
        if (translateX <= -singleSetWidth * 2) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setTranslateX(-singleSetWidth);
            }, 800); // After transition completes
            return () => clearTimeout(timeout);
        }
        // Re-enable transition after instant reset
        if (!isTransitioning) {
            const timeout = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [translateX, singleSetWidth, isTransitioning]);

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    // Handle navigation dot clicks
    const goToSlide = (idx: number) => {
        setIsTransitioning(true);
        const targetTranslate = -singleSetWidth - (idx * (itemWidth.current + gapWidth));
        setTranslateX(targetTranslate);
    };

    // Calculate current index for dots
    const currentIndex = Math.round(Math.abs(translateX + singleSetWidth) / (itemWidth.current + gapWidth)) % partners.length;

    return (
        <div className="relative overflow-hidden py-5">
            <div
                ref={containerRef}
                className="flex gap-12 items-center"
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isTransitioning
                        ? 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
                        : 'none',
                }}
            >
                {extendedPartners.map((partner, idx) => (
                    <div
                        key={`partner-${idx}`}
                        className="partner-logo-item relative flex flex-col items-center gap-3 group shrink-0"
                        style={{ width: `${itemWidth.current}px` }}
                    >
                        <Image
                            src={partner.src}
                            alt={partner.name}
                            width={200}
                            height={80}
                            className="h-16 md:h-20 w-auto opacity-80 grayscale transition-all duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:-translate-y-0.5"
                        />
                        <span className="partner-caption text-[10px] uppercase tracking-[0.1em] text-primary opacity-0 transform translate-y-1 transition-all duration-400 ease-out whitespace-nowrap group-hover:opacity-60 group-hover:translate-y-0">
                            {partner.caption}
                        </span>
                    </div>
                ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-1.5 mt-4 md:mt-6">
                {partners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                            ? "bg-primary scale-125"
                            : "bg-primary/30 hover:bg-primary/50"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
