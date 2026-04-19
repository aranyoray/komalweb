"use client";

import { useReducer, useCallback, useRef, useEffect, useMemo } from "react";
import { themes, getShuffledSession } from "@/lib/sel/themes";
import type { ThemeConfig } from "@/lib/sel/themes";
import type { AgeGroup, EmojiOption } from "@/lib/sel/emoji-sets";
import type { SceneResponse, QuestionAnswer } from "@/lib/sel/casel-scoring";
import { getShuffledEmojis } from "@/lib/sel/emoji-sets";
import ThemeCard from "@/components/sel/ThemeCard";
import SceneViewer from "@/components/sel/SceneViewer";
import EmojiPicker from "@/components/sel/EmojiPicker";
import SelReport from "@/components/sel/SelReport";
import QuestionCard from "@/components/sel/QuestionCard";

// ─── State Machine ───────────────────────────────────────────

// Emoji picker appears only after every 2nd slide (indices 1, 3)
const EMOJI_SLIDE_INDICES = new Set([1, 3]);

type Screen = 'theme_select' | 'scene' | 'emoji' | 'end_questions' | 'report';

interface SessionScene {
  image: string;
  caption: string;
  teacherLine: string;
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
  currentQuestionIndex: number;
  questionAnswers: QuestionAnswer[];
}

type Action =
  | { type: 'SELECT_THEME'; theme: ThemeConfig }
  | { type: 'SET_AGE_GROUP'; ageGroup: AgeGroup }
  | { type: 'NEXT_SCENE' } // advance without emoji (non-emoji slides)
  | { type: 'SHOW_EMOJI' }
  | { type: 'EMOJI_SELECTED'; emoji: EmojiOption; responseTimeMs: number }
  | { type: 'EMOJI_TIMEOUT' }
  | { type: 'ANSWER_QUESTION'; selectedIndex: number; isCorrect: boolean }
  | { type: 'RESET' };

const initialState: State = {
  screen: 'theme_select',
  selectedTheme: null,
  ageGroup: '7-9',
  currentScene: 0,
  sessionScenes: [],
  responses: [],
  currentQuestionIndex: 0,
  questionAnswers: [],
};

function advanceAfterEmoji(state: State, newResponse: SceneResponse): Partial<State> {
  const nextScene = state.currentScene + 1;
  if (nextScene >= 5) {
    // After last emoji, go to end questions
    return {
      responses: [...state.responses, newResponse],
      screen: 'end_questions',
      currentQuestionIndex: 0,
      questionAnswers: [],
    };
  }
  return {
    responses: [...state.responses, newResponse],
    currentScene: nextScene,
    screen: 'scene',
  };
}

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
        currentQuestionIndex: 0,
        questionAnswers: [],
      };
    }
    case 'SET_AGE_GROUP':
      return { ...state, ageGroup: action.ageGroup };
    case 'NEXT_SCENE': {
      // For non-emoji slides: advance to next scene or end questions
      const nextScene = state.currentScene + 1;
      if (nextScene >= 5) {
        return {
          ...state,
          screen: 'end_questions',
          currentQuestionIndex: 0,
          questionAnswers: [],
        };
      }
      return {
        ...state,
        currentScene: nextScene,
        screen: 'scene',
      };
    }
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
      return { ...state, ...advanceAfterEmoji(state, newResponse) };
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
      return { ...state, ...advanceAfterEmoji(state, timeoutResponse) };
    }
    case 'ANSWER_QUESTION': {
      const questions = state.selectedTheme?.endQuestions || [];
      const currentQ = questions[state.currentQuestionIndex];
      const newAnswer: QuestionAnswer = {
        questionType: currentQ?.type || 'mcq',
        selDimension: currentQ?.selDimension || undefined,
        selectedIndex: action.selectedIndex,
        correctIndex: currentQ?.correctIndex ?? 0,
        isCorrect: action.isCorrect,
      };
      const updatedAnswers = [...state.questionAnswers, newAnswer];
      const isLastQuestion = state.currentQuestionIndex >= questions.length - 1;
      if (isLastQuestion) {
        return {
          ...state,
          questionAnswers: updatedAnswers,
          screen: 'report',
        };
      }
      return {
        ...state,
        questionAnswers: updatedAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1,
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

  // Auto-show emoji popup after 5 seconds (only on emoji slides)
  useEffect(() => {
    if (state.screen === 'scene' && EMOJI_SLIDE_INDICES.has(state.currentScene)) {
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
        {(state.screen === 'scene' || state.screen === 'emoji') && state.selectedTheme && currentSceneData && (() => {
          const isEmojiSlide = EMOJI_SLIDE_INDICES.has(state.currentScene);
          return (
            <div className="animate-fadeIn">
              <SceneViewer
                imageUrl={currentSceneData.image}
                caption={currentSceneData.caption}
                teacherLine={currentSceneData.teacherLine}
                sceneIndex={state.currentScene}
                totalScenes={5}
                themeAccent={state.selectedTheme!.palette.accent}
                isLoading={false}
                onPlayClick={() => {
                  if (isEmojiSlide) {
                    dispatch({ type: 'SHOW_EMOJI' });
                  } else {
                    dispatch({ type: 'NEXT_SCENE' });
                  }
                }}
                showPlayButton={state.screen === 'scene'}
                playButtonLabel={isEmojiSlide ? undefined : 'Next'}
              />
            </div>
          );
        })()}

        {/* ─── Emoji Picker Overlay ─── */}
        {state.screen === 'emoji' && state.selectedTheme && currentSceneData && (() => {
          const shuffledEmojis = getShuffledEmojis(state.ageGroup, currentSceneData.empathyEmoji);
          // Alternate prompt: first emoji (index 1) asks about character, second (index 3) asks about self
          const promptText = state.currentScene === 1
            ? `What is ${state.selectedTheme!.mainCharacter} feeling?`
            : 'How do you feel?';
          return (
            <EmojiPicker
              ageGroup={state.ageGroup}
              onSelect={handleEmojiSelect}
              onTimeout={handleEmojiTimeout}
              themeAccent={state.selectedTheme!.palette.accent}
              customEmojis={shuffledEmojis}
              promptText={promptText}
            />
          );
        })()}

        {/* ─── End-of-Lesson Questions (MCQ + SEL) ─── */}
        {state.screen === 'end_questions' && state.selectedTheme && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: state.selectedTheme.palette.text }}
              >
                Let&apos;s Think About the Story
              </h2>
              <p className="text-sm text-gray-500">
                Answer these questions about what you just saw
              </p>
            </div>
            <QuestionCard
              key={state.currentQuestionIndex}
              question={state.selectedTheme.endQuestions[state.currentQuestionIndex]}
              questionNumber={state.currentQuestionIndex + 1}
              totalQuestions={state.selectedTheme.endQuestions.length}
              themeAccent={state.selectedTheme.palette.accent}
              themeText={state.selectedTheme.palette.text}
              onAnswer={(selectedIndex, isCorrect) => {
                dispatch({ type: 'ANSWER_QUESTION', selectedIndex, isCorrect });
              }}
            />
          </div>
        )}

        {/* ─── SEL Report ─── */}
        {state.screen === 'report' && state.selectedTheme && (
          <div className="animate-fadeIn">
            <SelReport
              responses={state.responses}
              theme={state.selectedTheme}
              questionAnswers={state.questionAnswers}
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
