"use client";

import { useReducer, useCallback, useRef, useEffect, useMemo } from "react";
import { themes, getShuffledSession } from "@/lib/sel/themes";
import type { ThemeConfig } from "@/lib/sel/themes";
import type { AgeGroup, EmojiOption } from "@/lib/sel/emoji-sets";
import type { SceneResponse } from "@/lib/sel/casel-scoring";
import ThemeCard from "@/components/sel/ThemeCard";
import SceneViewer from "@/components/sel/SceneViewer";
import EmojiPicker from "@/components/sel/EmojiPicker";
import SelReport from "@/components/sel/SelReport";

// ─── State Machine ───────────────────────────────────────────

type Screen = 'theme_select' | 'scene' | 'emoji' | 'report';

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
}

type Action =
  | { type: 'SELECT_THEME'; theme: ThemeConfig }
  | { type: 'SET_AGE_GROUP'; ageGroup: AgeGroup }
  | { type: 'SHOW_EMOJI' }
  | { type: 'EMOJI_SELECTED'; emoji: EmojiOption; responseTimeMs: number }
  | { type: 'EMOJI_TIMEOUT' }
  | { type: 'RESET' };

const initialState: State = {
  screen: 'theme_select',
  selectedTheme: null,
  ageGroup: '7-9',
  currentScene: 0,
  sessionScenes: [],
  responses: [],
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
        currentScene: isLast ? state.currentScene : state.currentScene + 1,
        screen: isLast ? 'report' : 'scene',
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
        currentScene: isLast ? state.currentScene : state.currentScene + 1,
        screen: isLast ? 'report' : 'scene',
      };
    }
    case 'RESET':
      return { ...initialState };
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

  // Sort themes by age-based ranking
  const sortedThemes = useMemo(() =>
    [...themes].sort((a, b) =>
      (a.ageRanking[state.ageGroup] ?? 99) - (b.ageRanking[state.ageGroup] ?? 99)
    ),
    [state.ageGroup]
  );

  // ─── Render ──────────────────────────────────────

  const currentSceneData = state.sessionScenes[state.currentScene];
  const themeStyle = state.selectedTheme
    ? { backgroundColor: state.selectedTheme.palette.bg }
    : { backgroundColor: '#faf9ff' };

  return (
    <div className="min-h-screen transition-colors duration-700" style={themeStyle}>
      <div className="max-w-5xl mx-auto px-4 pt-32 sm:pt-36 pb-8 sm:pb-12">

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
              {sortedThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  onSelect={handleThemeSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Scene Viewer (visible during both scene & emoji screens) ─── */}
        {(state.screen === 'scene' || state.screen === 'emoji') && state.selectedTheme && currentSceneData && (
          <div className="animate-fadeIn">
            <SceneViewer
              imageUrl={currentSceneData.image}
              caption={currentSceneData.caption}
              sceneIndex={state.currentScene}
              totalScenes={5}
              themeAccent={state.selectedTheme.palette.accent}
              isLoading={false}
              onPlayClick={() => dispatch({ type: 'SHOW_EMOJI' })}
              showPlayButton={state.screen === 'scene'}
            />
          </div>
        )}

        {/* ─── Emoji Picker Overlay ─── */}
        {state.screen === 'emoji' && state.selectedTheme && currentSceneData && (
          <EmojiPicker
            ageGroup={state.ageGroup}
            onSelect={handleEmojiSelect}
            onTimeout={handleEmojiTimeout}
            themeAccent={state.selectedTheme.palette.accent}
          />
        )}

        {/* ─── SEL Report ─── */}
        {state.screen === 'report' && state.selectedTheme && (
          <div className="animate-fadeIn">
            <SelReport
              responses={state.responses}
              theme={state.selectedTheme}
              onPlayAgain={() => dispatch({ type: 'RESET' })}
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
