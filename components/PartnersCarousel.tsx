"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const partners = [
    { src: "/startup_yale_logo.png", name: "Yale University", caption: "Early Learning Partner" },
    { src: "/reservoir_neurodiversity_consultants_india_logo.png", name: "Reservoir Neurodiversity Consultants", caption: "Research Partner" },
    { src: "/trehaus_singapore_logo.png", name: "Trehaus Singapore", caption: "Brand Partner" },
    { src: "/california-state-university-longbeach_seal-pilot-partners-komalkids.png", name: "California State University Long Beach", caption: "Pilot Partners" },
    { src: "/ucb.png", name: "UC Berkeley", caption: "Developmental Research" },
    { src: "/zeelearn.png", name: "Zee Learn", caption: "Scaling Partner" },
    { src: "/ucal.jpg", name: "UCAL", caption: "Institutional Partner" },
    { src: "/unep.png", name: "UNEP", caption: "Global Impact Collaborator" },
];

export default function PartnersCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 5;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    // Get visible partners (with wrap-around)
    const getVisiblePartners = () => {
        const visible = [];
        for (let i = 0; i < visibleCount; i++) {
            const index = (currentIndex + i) % partners.length;
            visible.push({ ...partners[index], originalIndex: index });
        }
        return visible;
    };

    return (
        <div className="relative overflow-hidden py-5">
            <div
                className="flex gap-8 md:gap-12 items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
                {getVisiblePartners().map((partner, idx) => (
                    <div
                        key={`${partner.originalIndex}-${currentIndex}-${idx}`}
                        className="partner-logo-item relative flex flex-col items-center gap-3 group shrink-0 animate-[fadeIn_0.5s_ease_forwards]"
                    >
                        <Image
                            src={partner.src}
                            alt={partner.name}
                            width={200}
                            height={80}
                            className="h-16 md:h-20 w-auto opacity-80 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:-translate-y-0.5"
                        />
                        <span className="partner-caption text-[10px] uppercase tracking-[0.1em] text-primary opacity-0 transform translate-y-1 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap group-hover:opacity-60 group-hover:translate-y-0">
                            {partner.caption}
                        </span>
                    </div>
                ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
                {partners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
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
