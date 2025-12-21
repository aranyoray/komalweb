'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function IntroLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if we've already shown the intro in this session
        const hasShown = sessionStorage.getItem('introShown');

        if (hasShown) {
            setIsVisible(false);
            return;
        }

        // Mark as shown immediately so refresh doesn't trigger it again
        sessionStorage.setItem('introShown', 'true');
    }, []);

    const handleVideoPlay = () => {
        setTimeout(() => {
            setIsVisible(false);
        }, 3500); // Play for at least 3.5 seconds
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
