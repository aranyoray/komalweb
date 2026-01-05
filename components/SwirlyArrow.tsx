import React from "react";

export default function SwirlyArrow({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="none"
        >
            <path
                d="M20 80 C 40 100, 80 120, 120 80 C 160 40, 140 10, 100 20 C 60 30, 40 60, 80 80 C 120 100, 160 60, 180 30"
                stroke="#FF6B35"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[draw_1s_ease-out_forwards]"
                style={{ strokeDasharray: 300, strokeDashoffset: 300 }}
            />
            <path
                d="M170 40 L 180 30 L 175 50"
                stroke="#FF6B35"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[fadeIn_0.5s_ease-out_0.8s_forwards] opacity-0"
            />
            <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
        </svg>
    );
}
