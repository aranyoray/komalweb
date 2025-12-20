"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const floatingImages = [
    {
        src: "/newbaby.png",
        alt: "KOMAL App Screen",
        position: "left-[-20px] md:left-[-120px] top-[5%] md:top-auto md:bottom-[5%]",
        size: "w-[100px] md:w-[280px]",
        delay: "0.2s",
        rotation: "-6deg",
        mobileRotation: "-4deg",
        aspect: "aspect-[3/4]", // Taller
    },
    {
        src: "/brownbaby.png",
        alt: "Sitting Elephant",
        position: "right-[-15px] md:right-[-100px] bottom-[3%] md:bottom-[8%]",
        size: "w-[110px] md:w-[320px]",
        delay: "0.35s",
        rotation: "5deg",
        mobileRotation: "3deg",
        aspect: "aspect-[4/3]", // Wider (4:3 width to height)
    },
];

export default function HeroImageGallery() {
    const [isVisible, setIsVisible] = useState(false);
    const [showFloatingImages, setShowFloatingImages] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.3,
                rootMargin: "-50px",
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Track scroll position for floating images - show only when hero text is out of view
    // Once shown, they stay visible forever
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || showFloatingImages) return; // Don't update if already showing

            const rect = containerRef.current.getBoundingClientRect();
            // Show floating images only when the top of the image container is near the top of the viewport
            // This means the hero text above has scrolled out of view
            const shouldShow = rect.top <= 500; // When image container is near top of viewport

            if (shouldShow) {
                setShowFloatingImages(true);
            }
        };

        handleScroll(); // Check initial position
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showFloatingImages]);

    return (
        <div ref={containerRef} className="relative w-full max-w-[950px]">
            {/* Floating Images Around Main Image - Appear on scroll, stay forever */}
            {floatingImages.map((img, index) => (
                <div
                    key={index}
                    className={`absolute ${img.position} ${img.size} z-10`}
                    style={{
                        opacity: showFloatingImages ? 1 : 0,
                        transform: showFloatingImages
                            ? `translateY(0) translateX(0) rotate(${img.rotation}) scale(1)`
                            : `translateY(80px) translateX(${index === 0 ? '-30px' : '30px'}) rotate(0deg) scale(0.7)`,
                        transition: `all 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${img.delay}`,
                        pointerEvents: showFloatingImages ? "auto" : "none",
                    }}
                >
                    <div className={`relative w-full ${img.aspect} rounded-2xl overflow-hidden shadow-2xl border-4 border-white`}>
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            ))}

            {/* Main Hero Image */}
            <div
                className="hero-image relative w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 h-[400px] md:h-[550px]"
                style={{
                    opacity: isVisible ? 1 : 0.5,
                    transform: isVisible ? "scale(1)" : "scale(0.95)",
                }}
            >
                {/* Mobile: landingphone.png */}
                <Image
                    src="/landingphone.png"
                    alt="KOMAL - AI Learning Companion"
                    width={1400}
                    height={900}
                    className="w-full h-full object-cover object-center md:hidden"
                    priority
                />
                {/* Desktop/Tablet: newlanding.png */}
                <Image
                    src="/newlanding.png"
                    alt="KOMAL - AI Learning Companion"
                    width={1400}
                    height={900}
                    className="w-full h-full object-cover object-bottom hidden md:block"
                    priority
                />
            </div>
        </div>
    );
}
