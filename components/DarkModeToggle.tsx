"use client";

import { useDarkMode } from "./DarkModeProvider";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 z-50 group"
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Cute animated background circle */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out ${
            isDark
              ? "bg-gradient-to-br from-purple-500 to-indigo-600 scale-100"
              : "bg-gradient-to-br from-yellow-300 to-orange-400 scale-100"
          }`}
        />
        
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isDark
              ? "bg-purple-400/30 blur-xl scale-150"
              : "bg-yellow-300/30 blur-xl scale-150"
          }`}
        />

        {/* Icon container with cute bounce */}
        <div
          className={`relative z-10 transition-all duration-500 ${
            isDark ? "rotate-0 scale-100" : "rotate-180 scale-100"
          } group-hover:scale-110`}
        >
          {isDark ? (
            <Moon className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" />
          ) : (
            <Sun className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" />
          )}
        </div>

        {/* Cute sparkle effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </button>
  );
}

