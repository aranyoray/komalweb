/**
 * Language Switcher Component
 * ===========================
 *
 * A dropdown component that allows users to switch between
 * the local language and English on country-specific pages.
 *
 * Usage:
 * <LanguageSwitcher
 *   currentLang="hi"
 *   localLang={{ code: "hi", name: "हिन्दी", flag: "🇮🇳" }}
 *   onLanguageChange={(lang) => setLanguage(lang)}
 * />
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSwitcherProps {
  currentLang: string;
  localLang: Language;
  onLanguageChange: (lang: string) => void;
}

const englishLang: Language = {
  code: 'en',
  name: 'English',
  flag: '🇬🇧',
};

export default function LanguageSwitcher({
  currentLang,
  localLang,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [localLang, englishLang];
  const currentLanguage = languages.find(l => l.code === currentLang) || localLang;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-border hover:bg-surface transition-colors"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-text">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 text-text-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-surface/50 transition-colors ${
                currentLang === lang.code ? 'bg-primary/5 text-primary' : 'text-text'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
              {currentLang === lang.code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
