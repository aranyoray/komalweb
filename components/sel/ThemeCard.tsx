"use client";

import type { ThemeConfig } from "@/lib/sel/themes";

interface ThemeCardProps {
  theme: ThemeConfig;
  onSelect: (themeId: string) => void;
}

export default function ThemeCard({ theme, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      className="relative group text-left rounded-[1.5rem] overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
      style={{
        backgroundColor: theme.palette.bg,
        boxShadow: `0 4px 24px ${theme.palette.accent}20`,
      }}
    >
      {/* Theme preview area */}
      <div
        className="aspect-[4/3] w-full relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.palette.accent}30, ${theme.palette.bg})` }}
      >
        {/* Card image from theme's image library */}
        <img
          src={theme.staticImages[0]}
          alt={theme.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${theme.palette.bg}cc, transparent 60%)` }}
        />

        {/* Theme name large */}
        <div className="absolute bottom-3 left-4">
          <span
            className="text-2xl sm:text-3xl font-bold opacity-60"
            style={{ color: theme.palette.text }}
          >
            {theme.name}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: theme.palette.text }}
        >
          {theme.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {theme.description}
        </p>
        <div className="mt-4">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white transition-transform group-hover:scale-105"
            style={{ backgroundColor: theme.palette.accent }}
          >
            Start Story
          </span>
        </div>
      </div>
    </button>
  );
}
