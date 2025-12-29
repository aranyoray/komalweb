'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function IntroLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const hasStartedDismiss = useRef(false);

    // Helper to safely dismiss the loader only once
    const dismissLoader = (delay: number = 0) => {
        if (hasStartedDismiss.current) return;
        hasStartedDismiss.current = true;

        if (delay > 0) {
            setTimeout(() => {
                setIsVisible(false);
            }, delay);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        // Check if we've already shown the intro in this session
        const hasShown = sessionStorage.getItem('introShown');

        if (hasShown) {
            setIsVisible(false);
            return;
        }

        // Mark as shown immediately so refresh doesn't trigger it again
        sessionStorage.setItem('introShown', 'true');

        // FAILSAFE: Guaranteed maximum timeout - loader will ALWAYS dismiss
        // after 5 seconds no matter what happens with the video
        const maxTimeout = setTimeout(() => {
            dismissLoader();
        }, 5000);

        return () => {
            clearTimeout(maxTimeout);
        };
    }, []);

    const handleVideoPlay = () => {
        // Video started playing - dismiss after 3.5 seconds
        dismissLoader(3500);
    };

    const handleVideoEnded = () => {
        // Video ended naturally - dismiss immediately
        dismissLoader();
    };

    const handleVideoError = () => {
        // Video failed to load - dismiss immediately so user isn't stuck
        dismissLoader();
    };

    const handleVideoCanPlay = () => {
        // Video can start playing - set a backup timer in case onPlaying doesn't fire
        setTimeout(() => {
            dismissLoader(3500);
        }, 100);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                >
                    <div className="relative">
                        <video
                            src="/finalvideo.mp4"
                            autoPlay
                            muted
                            playsInline
                            onPlaying={handleVideoPlay}
                            onEnded={handleVideoEnded}
                            onError={handleVideoError}
                            onCanPlay={handleVideoCanPlay}
                            className="h-auto w-[250px] max-w-[80vw]" // Small size as requested
                        >
                            Your browser does not support the video tag.
                        </video>
                        {/* Cover bottom right corner icon */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-black" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
