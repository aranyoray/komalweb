"use client";

import { useState, useEffect, useRef } from "react";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Check if loading screen has been shown before
        const hasSeenLoading = localStorage.getItem("komal_loading_seen");

        if (hasSeenLoading) {
            setIsVisible(false);
            setShouldRender(false);
            return;
        }

        // Play the video when component mounts
        if (videoRef.current) {
            videoRef.current.play().catch(console.error);
        }
    }, []);

    const handleVideoEnd = () => {
        // Mark as seen
        localStorage.setItem("komal_loading_seen", "true");
        // Start fade out animation
        setIsVisible(false);
        // Remove from DOM after animation
        setTimeout(() => {
            setShouldRender(false);
        }, 500);
    };

    // Also handle cases where video might not load properly
    const handleVideoError = () => {
        localStorage.setItem("komal_loading_seen", "true");
        setIsVisible(false);
        setTimeout(() => {
            setShouldRender(false);
        }, 500);
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] flex items-center justify-center">
                <video
                    ref={videoRef}
                    src="/123123.mov"
                    onEnded={handleVideoEnd}
                    onError={handleVideoError}
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
}
