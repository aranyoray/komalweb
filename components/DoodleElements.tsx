"use client";

import { useState, useEffect } from "react";

interface DoodleElementsProps {
    className?: string;
}

export default function DoodleElements({ className = "" }: DoodleElementsProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Animation style for stroke draw-in effect
    const drawStyle = (delay: number, duration: number = 1) => ({
        strokeDasharray: 300,
        strokeDashoffset: isVisible ? 0 : 300,
        transition: `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    });

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}>

            {/* === TOP-RIGHT CORNER CURVE ONLY === */}
            <svg className="absolute right-[-2px] top-[-2px] w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                <path d="M2 3 C6 2, 12 1, 18 2 C24 3, 27 6, 28 12 C29 18, 29 24, 28 28" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.55" style={drawStyle(0.1)} />
            </svg>
            <svg className="absolute right-[-6px] top-[-6px] w-[36px] h-[36px]" viewBox="0 0 38 38" fill="none">
                <path d="M2 5 C8 3, 16 2, 24 3 C30 4, 34 8, 35 14 C36 22, 36 30, 35 36" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" style={drawStyle(0.16)} />
            </svg>
            <svg className="absolute right-[-10px] top-[-10px] w-[42px] h-[42px]" viewBox="0 0 46 46" fill="none">
                <path d="M2 6 C10 3, 20 2, 28 3 C36 5, 40 10, 42 18 C44 28, 44 38, 42 44" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.18" style={drawStyle(0.22)} />
            </svg>

            {/* === BOTTOM-LEFT CORNER CURVE ONLY === */}
            <svg className="absolute left-[-2px] bottom-[-2px] w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                <path d="M2 2 C2 8, 2 14, 2 18 C3 24, 6 27, 12 28 C18 29, 24 29, 28 28" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.52" style={drawStyle(0.12)} />
            </svg>
            <svg className="absolute left-[-6px] bottom-[-6px] w-[36px] h-[36px]" viewBox="0 0 38 38" fill="none">
                <path d="M3 2 C2 10, 2 18, 3 24 C4 30, 8 34, 14 35 C22 36, 30 36, 36 35" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.32" style={drawStyle(0.18)} />
            </svg>
            <svg className="absolute left-[-10px] bottom-[-10px] w-[42px] h-[42px]" viewBox="0 0 46 46" fill="none">
                <path d="M4 2 C3 12, 3 22, 4 30 C5 38, 10 42, 18 44 C28 45, 38 45, 44 44" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.16" style={drawStyle(0.24)} />
            </svg>

            {/* === LEFT SIDE - Middle areas only === */}
            <svg className="absolute left-[-2px] top-[38%] w-[4px] h-[15%]" viewBox="0 0 4 100" fill="none">
                <path d="M2 2 C3 28, 1 55, 3 80 C1 92, 2 98, 2 100" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.55" style={drawStyle(0.1)} />
            </svg>
            <svg className="absolute left-[-6px] top-[42%] w-[4px] h-[12%]" viewBox="0 0 6 100" fill="none">
                <path d="M3 0 C5 35, 1 65, 4 95 C2 98, 3 100, 3 100" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.38" style={drawStyle(0.16)} />
            </svg>
            <svg className="absolute left-[-10px] top-[36%] w-[5px] h-[18%]" viewBox="0 0 8 100" fill="none">
                <path d="M4 2 C2 32, 6 62, 3 90 C5 96, 4 100, 4 100" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.2" style={drawStyle(0.22)} />
            </svg>

            <svg className="absolute left-[-2px] top-[58%] w-[4px] h-[14%]" viewBox="0 0 4 100" fill="none">
                <path d="M2 3 C1 32, 3 62, 1 88 C3 95, 2 100, 2 100" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.52" style={drawStyle(0.12)} />
            </svg>
            <svg className="absolute left-[-6px] top-[62%] w-[4px] h-[10%]" viewBox="0 0 6 100" fill="none">
                <path d="M3 0 C1 40, 5 70, 2 95 C4 98, 3 100, 3 100" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" style={drawStyle(0.18)} />
            </svg>

            {/* === RIGHT SIDE - Middle areas only === */}
            <svg className="absolute right-[-2px] top-[40%] w-[4px] h-[14%]" viewBox="0 0 4 100" fill="none">
                <path d="M2 0 C0 28, 4 55, 1 82 C3 93, 2 98, 2 100" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.55" style={drawStyle(0.11)} />
            </svg>
            <svg className="absolute right-[-6px] top-[44%] w-[4px] h-[10%]" viewBox="0 0 6 100" fill="none">
                <path d="M3 2 C5 35, 1 65, 4 92 C2 97, 3 100, 3 100" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.38" style={drawStyle(0.17)} />
            </svg>
            <svg className="absolute right-[-10px] top-[38%] w-[5px] h-[18%]" viewBox="0 0 8 100" fill="none">
                <path d="M4 0 C2 30, 6 60, 3 88 C5 95, 4 100, 4 100" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.2" style={drawStyle(0.23)} />
            </svg>

            <svg className="absolute right-[-2px] top-[60%] w-[4px] h-[12%]" viewBox="0 0 4 100" fill="none">
                <path d="M2 2 C4 32, 0 62, 3 90 C1 96, 2 100, 2 100" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.52" style={drawStyle(0.13)} />
            </svg>
            <svg className="absolute right-[-6px] top-[64%] w-[4px] h-[10%]" viewBox="0 0 6 100" fill="none">
                <path d="M3 0 C1 38, 5 70, 2 95 C4 98, 3 100, 3 100" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" style={drawStyle(0.19)} />
            </svg>

            {/* === TOP EDGE - Center only === */}
            <svg className="absolute left-[35%] top-[-2px] w-[30%] h-[4px]" viewBox="0 0 100 4" fill="none">
                <path d="M2 2 C28 0, 55 4, 82 1 C92 3, 97 2, 98 2" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.52" style={drawStyle(0.1)} />
            </svg>
            <svg className="absolute left-[40%] top-[-6px] w-[22%] h-[4px]" viewBox="0 0 100 6" fill="none">
                <path d="M0 3 C30 1, 60 5, 88 2 C95 4, 98 3, 100 3" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" style={drawStyle(0.16)} />
            </svg>
            <svg className="absolute left-[32%] top-[-10px] w-[35%] h-[5px]" viewBox="0 0 100 8" fill="none">
                <path d="M0 4 C25 2, 55 6, 82 3 C92 5, 97 4, 100 4" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.18" style={drawStyle(0.22)} />
            </svg>

            {/* === BOTTOM EDGE - Center only === */}
            <svg className="absolute left-[32%] bottom-[-2px] w-[32%] h-[4px]" viewBox="0 0 100 4" fill="none">
                <path d="M0 2 C28 4, 55 0, 82 3 C92 1, 97 2, 100 2" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" style={drawStyle(0.12)} />
            </svg>
            <svg className="absolute left-[38%] bottom-[-6px] w-[24%] h-[4px]" viewBox="0 0 100 6" fill="none">
                <path d="M0 3 C32 1, 62 5, 90 2 C96 4, 99 3, 100 3" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.32" style={drawStyle(0.18)} />
            </svg>
            <svg className="absolute left-[28%] bottom-[-10px] w-[38%] h-[5px]" viewBox="0 0 100 8" fill="none">
                <path d="M0 4 C28 2, 58 6, 85 3 C93 5, 98 4, 100 4" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.16" style={drawStyle(0.24)} />
            </svg>
        </div>
    );
}
