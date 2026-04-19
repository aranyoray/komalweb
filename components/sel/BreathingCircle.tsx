"use client";

interface BreathingCircleProps {
  themeAccent: string;
  message?: string;
}

export default function BreathingCircle({ themeAccent, message = "Take a breath..." }: BreathingCircleProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div
        className="w-[120px] h-[120px] rounded-full animate-breathe-sel"
        style={{ backgroundColor: themeAccent, opacity: 0.25 }}
      />
      <p className="text-lg font-medium text-gray-400 animate-pulse">
        {message}
      </p>

      <style jsx>{`
        @keyframes breatheSel {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.3); opacity: 0.35; }
        }
        .animate-breathe-sel {
          animation: breatheSel 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
