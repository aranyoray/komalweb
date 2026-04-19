"use client";

import { Lock } from "lucide-react";
import type { ThemeConfig } from "@/lib/sel/themes";

interface ThemeCardProps {
  theme: ThemeConfig;
  isUnlocked: boolean;
  isFeatured: boolean;
  onSelect: (themeId: string) => void;
}

export default function ThemeCard({ theme, isUnlocked, isFeatured, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={() => isUnlocked && onSelect(theme.id)}
      disabled={!isUnlocked}
      className={`
        relative group text-left rounded-[1.5rem] overflow-hidden transition-all duration-500
        ${isFeatured ? 'col-span-full md:col-span-1' : ''}
        ${isUnlocked
          ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1'
          : 'opacity-60 cursor-not-allowed'
        }
      `}
      style={{
        backgroundColor: isUnlocked ? theme.palette.bg : '#f3f4f6',
        boxShadow: isUnlocked ? `0 4px 24px ${theme.palette.accent}20` : 'none',
      }}
    >
      {/* Theme preview area */}
      <div
        className="h-36 sm:h-44 w-full relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.palette.accent}30, ${theme.palette.bg})` }}
      >
        {/* Decorative watercolor circles */}
        <div
          className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: theme.palette.accent }}
        />
        <div
          className="absolute bottom-4 left-8 w-14 h-14 rounded-full opacity-15"
          style={{ backgroundColor: theme.palette.accent }}
        />

        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <Lock className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        )}

        {/* Theme name large */}
        <div className="absolute bottom-3 left-4">
          <span
            className="text-2xl sm:text-3xl font-bold opacity-10"
            style={{ color: theme.palette.text }}
          >
            {theme.name}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: theme.palette.text }}
        >
          {theme.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {theme.description}
        </p>
        <div className="mt-4">
          {isUnlocked ? (
            <span
              className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-white transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.palette.accent }}
            >
              Start Story
            </span>
          ) : (
            <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-gray-400 bg-gray-100">
              Complete previous theme
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
