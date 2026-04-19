"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import { themes, getShuffledSession } from "@/lib/sel/themes";
import type { ThemeConfig } from "@/lib/sel/themes";
import type { AgeGroup, EmojiOption } from "@/lib/sel/emoji-sets";
import type { SceneResponse } from "@/lib/sel/casel-scoring";
import ThemeCard from "@/components/sel/ThemeCard";
import SceneViewer from "@/components/sel/SceneViewer";
import EmojiPicker from "@/components/sel/EmojiPicker";
import BreathingCircle from "@/components/sel/BreathingCircle";
import SelReport from "@/components/sel/SelReport";

// ─── State Machine ───────────────────────────────────────────

type Screen = 'theme_select' | 'scene' | 'emoji' | 'breathing' | 'report';

interface SessionScene {
  image: string;
  caption: string;
  empathyEmoji: string;
  isBondScene: boolean;
}

interface State {
  screen: Screen;
  selectedTheme: ThemeConfig | null;
  ageGroup: AgeGroup;
  currentScene: number;
  sessionScenes: SessionScene[];
  responses: SceneResponse[];
  unlockedThemes: string[];
}

type Action =
  | { type: 'SELECT_THEME'; theme: ThemeConfig }
  | { type: 'SET_AGE_GROUP'; ageGroup: AgeGroup }
  | { type: 'SHOW_EMOJI' }
  | { type: 'EMOJI_SELECTED'; emoji: EmojiOption; responseTimeMs: number }
  | { type: 'EMOJI_TIMEOUT' }
  | { type: 'BREATHING_DONE' }
  | { type: 'RESET' };

const initialState: State = {
  screen: 'theme_select',
  selectedTheme: null,
  ageGroup: '7-9',
  currentScene: 0,
  sessionScenes: [],
  responses: [],
  unlockedThemes: ['ramayana'],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_THEME': {
      const shuffled = getShuffledSession(action.theme);
      return {
        ...state,
        selectedTheme: action.theme,
        screen: 'scene',
        currentScene: 0,
        sessionScenes: shuffled,
        responses: [],
      };
    }
    case 'SET_AGE_GROUP':
      return { ...state, ageGroup: action.ageGroup };
    case 'SHOW_EMOJI':
      return { ...state, screen: 'emoji' };
    case 'EMOJI_SELECTED': {
      const scene = state.sessionScenes[state.currentScene];
      const newResponse: SceneResponse = {
        emojiPicked: action.emoji.emoji,
        emojiLabel: action.emoji.label,
        emojiValence: action.emoji.valence,
        responseTimeMs: action.responseTimeMs,
        empathyTag: scene?.empathyEmoji || '',
        isBondScene: scene?.isBondScene || false,
      };
      const isLast = state.currentScene >= 4;
      return {
        ...state,
        responses: [...state.responses, newResponse],
        screen: isLast ? 'report' : 'breathing',
      };
    }
    case 'EMOJI_TIMEOUT': {
      const scene = state.sessionScenes[state.currentScene];
      const timeoutResponse: SceneResponse = {
        emojiPicked: null,
        emojiLabel: null,
        emojiValence: null,
        responseTimeMs: 30000,
        empathyTag: scene?.empathyEmoji || '',
        isBondScene: scene?.isBondScene || false,
      };
      const isLast = state.currentScene >= 4;
      return {
        ...state,
        responses: [...state.responses, timeoutResponse],
        screen: isLast ? 'report' : 'breathing',
      };
    }
    case 'BREATHING_DONE':
      return {
        ...state,
        currentScene: state.currentScene + 1,
        screen: 'scene',
      };
    case 'RESET':
      return { ...initialState, unlockedThemes: state.unlockedThemes };
    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────────────

export default function SelPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const emojiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle theme selection
  const handleThemeSelect = useCallback((themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    dispatch({ type: 'SELECT_THEME', theme });
  }, []);

  // Auto-show emoji popup after 5 seconds
  useEffect(() => {
    if (state.screen === 'scene') {
      emojiTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SHOW_EMOJI' });
      }, 5000);

      return () => {
        if (emojiTimerRef.current) clearTimeout(emojiTimerRef.current);
      };
    }
  }, [state.screen, state.currentScene]);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji: EmojiOption, responseTimeMs: number) => {
    dispatch({ type: 'EMOJI_SELECTED', emoji, responseTimeMs });
  }, []);

  // Handle emoji timeout
  const handleEmojiTimeout = useCallback(() => {
    dispatch({ type: 'EMOJI_TIMEOUT' });
  }, []);

  // Breathing auto-advance after 5 seconds
  useEffect(() => {
    if (state.screen === 'breathing') {
      const timeout = setTimeout(() => {
        dispatch({ type: 'BREATHING_DONE' });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [state.screen]);

  // ─── Render ──────────────────────────────────────

  const currentSceneData = state.sessionScenes[state.currentScene];
  const themeStyle = state.selectedTheme
    ? { backgroundColor: state.selectedTheme.palette.bg }
    : { backgroundColor: '#faf9ff' };

  return (
    <div className="min-h-screen transition-colors duration-700" style={themeStyle}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">

        {/* ─── Theme Selection ─── */}
        {state.screen === 'theme_select' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
                Explore Stories, Discover Feelings
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Experience Komal&apos;s emotional AI in action
              </p>

              {/* Age group picker */}
              <div className="flex justify-center gap-2 mb-8">
                {(['3-6', '7-9', '10-12'] as AgeGroup[]).map(ag => (
                  <button
                    key={ag}
                    onClick={() => dispatch({ type: 'SET_AGE_GROUP', ageGroup: ag })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      state.ageGroup === ag
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Ages {ag}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {themes.map((theme, i) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isUnlocked={state.unlockedThemes.includes(theme.id)}
                  isFeatured={i === 0}
                  onSelect={handleThemeSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Scene Viewer ─── */}
        {state.screen === 'scene' && state.selectedTheme && currentSceneData && (
          <div className="animate-fadeIn">
            <SceneViewer
              imageUrl={currentSceneData.image}
              caption={currentSceneData.caption}
              sceneIndex={state.currentScene}
              totalScenes={5}
              themeAccent={state.selectedTheme.palette.accent}
              isLoading={false}
              onPlayClick={() => dispatch({ type: 'SHOW_EMOJI' })}
              showPlayButton={true}
            />
          </div>
        )}

        {/* ─── Emoji Picker ─── */}
        {state.screen === 'emoji' && state.selectedTheme && currentSceneData && (
          <div>
            <SceneViewer
              imageUrl={currentSceneData.image}
              caption={currentSceneData.caption}
              sceneIndex={state.currentScene}
              totalScenes={5}
              themeAccent={state.selectedTheme.palette.accent}
              isLoading={false}
              onPlayClick={() => {}}
              showPlayButton={false}
            />
            <EmojiPicker
              ageGroup={state.ageGroup}
              onSelect={handleEmojiSelect}
              onTimeout={handleEmojiTimeout}
              themeAccent={state.selectedTheme.palette.accent}
            />
          </div>
        )}

        {/* ─── Breathing Transition ─── */}
        {state.screen === 'breathing' && state.selectedTheme && (
          <BreathingCircle
            themeAccent={state.selectedTheme.palette.accent}
            message="Take a breath before the next story..."
          />
        )}

        {/* ─── SEL Report ─── */}
        {state.screen === 'report' && state.selectedTheme && (
          <div className="animate-fadeIn">
            <SelReport
              responses={state.responses}
              theme={state.selectedTheme}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}
