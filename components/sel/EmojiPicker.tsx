"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { EmojiOption, AgeGroup } from "@/lib/sel/emoji-sets";
import { emojiSets } from "@/lib/sel/emoji-sets";

interface EmojiPickerProps {
  ageGroup: AgeGroup;
  onSelect: (emoji: EmojiOption, responseTimeMs: number) => void;
  onTimeout: () => void;
  themeAccent: string;
  customEmojis?: EmojiOption[]; // shuffled emoji set
  promptText?: string; // dynamic question text
}

export default function EmojiPicker({ ageGroup, onSelect, onTimeout, themeAccent, customEmojis, promptText }: EmojiPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const startTimeRef = useRef(Date.now());
  const hasSelectedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { size, showLabels } = emojiSets[ageGroup];
  const emojis = customEmojis || emojiSets[ageGroup].emojis;

  // 30-second timeout
  useEffect(() => {
    startTimeRef.current = Date.now();
    hasSelectedRef.current = false;
    setSelectedIndex(null);

    timeoutRef.current = setTimeout(() => {
      if (!hasSelectedRef.current) {
        onTimeout();
      }
    }, 30000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onTimeout]);

  const handleSelect = useCallback((index: number) => {
    if (hasSelectedRef.current) return; // debounce
    hasSelectedRef.current = true;
    setSelectedIndex(index);

    const responseTime = Date.now() - startTimeRef.current;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Delay callback to allow animation
    setTimeout(() => {
      onSelect(emojis[index], responseTime);
    }, 800);
  }, [emojis, onSelect]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(i => (i + 1) % emojis.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => (i - 1 + emojis.length) % emojis.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(focusedIndex);
    }
  }, [focusedIndex, emojis.length, handleSelect]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      role="dialog"
      aria-label="How do you feel?"
    >
      {/* Overlay with minimal blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px] animate-fadeIn" />

      {/* Bottom sheet */}
      <div
        className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl px-6 py-8 animate-scaleIn"
        ref={containerRef}
        onKeyDown={handleKeyDown}
      >
        <h2
          className="text-center text-xl font-semibold mb-6"
          style={{ color: themeAccent }}
        >
          {promptText || 'What do you feel?'}
        </h2>

        <div
          className="flex justify-center items-center gap-4 sm:gap-6"
          role="radiogroup"
          aria-label="Select your emotion"
        >
          {emojis.map((emoji, index) => (
            <button
              key={emoji.label}
              onClick={() => handleSelect(index)}
              onFocus={() => setFocusedIndex(index)}
              tabIndex={index === focusedIndex ? 0 : -1}
              disabled={hasSelectedRef.current}
              aria-label={emoji.label}
              aria-checked={selectedIndex === index}
              role="radio"
              className={`
                flex flex-col items-center gap-1 transition-all duration-300 outline-none
                ${selectedIndex === index ? 'scale-[1.4]' : 'hover:scale-110'}
                ${index === focusedIndex ? 'ring-2 ring-offset-2 rounded-lg' : ''}
                ${selectedIndex !== null && selectedIndex !== index ? 'opacity-40' : ''}
              `}
              style={{
                '--tw-ring-color': themeAccent,
              } as React.CSSProperties}
            >
              <span
                style={{ fontSize: `${size}px`, lineHeight: 1 }}
                className="block"
              >
                {emoji.emoji}
              </span>
              {showLabels && (
                <span className="text-xs font-medium text-gray-500 mt-1">
                  {emoji.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </div>
  );
}
