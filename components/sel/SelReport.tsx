"use client";

import { useMemo } from "react";
import type { SceneResponse, QuestionAnswer } from "@/lib/sel/casel-scoring";
import { computeCaselScores } from "@/lib/sel/casel-scoring";
import type { ThemeConfig } from "@/lib/sel/themes";
import EmotionalJourney from "./EmotionalJourney";
import Link from "next/link";

interface SelReportProps {
  responses: SceneResponse[];
  theme: ThemeConfig;
  childName?: string;
  questionAnswers?: QuestionAnswer[];
  onPlayAgain?: () => void;
}

const caselLabels: Record<string, { icon: string; name: string }> = {
  selfAwareness: { icon: '🪞', name: 'Self-Awareness' },
  selfManagement: { icon: '🧘', name: 'Self-Management' },
  socialAwareness: { icon: '💛', name: 'Social Awareness' },
  relationshipSkills: { icon: '🤝', name: 'Relationship Skills' },
  responsibleDecisionMaking: { icon: '🧠', name: 'Thoughtful Engagement' },
};

export default function SelReport({ responses, theme, childName, questionAnswers, onPlayAgain }: SelReportProps) {
  const report = useMemo(() => computeCaselScores(responses, questionAnswers), [responses, questionAnswers]);

  const title = childName
    ? `${childName}'s Emotional Journey`
    : 'Your Emotional Journey';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.palette.text }}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500">
          {theme.name} — {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Emotional Journey Arc (HERO) */}
      <div className="mb-10 p-6 rounded-[1.5rem] bg-white shadow-lg">
        <h3
          className="text-lg font-semibold mb-4 text-center"
          style={{ color: theme.palette.text }}
        >
          How feelings changed across the story
        </h3>
        <EmotionalJourney responses={responses} themeAccent={theme.palette.accent} />
      </div>

      {/* Overall Summary */}
      <div
        className="mb-8 p-5 rounded-2xl text-center"
        style={{ backgroundColor: theme.palette.bg }}
      >
        <p
          className="text-base font-medium leading-relaxed"
          style={{ color: theme.palette.text }}
        >
          {report.overallSummary}
        </p>
      </div>

      {/* CASEL Scores */}
      <div className="space-y-4 mb-8">
        <h3
          className="text-lg font-semibold"
          style={{ color: theme.palette.text }}
        >
          Emotional Growth Areas
        </h3>
        {(Object.keys(report.scores) as (keyof typeof report.scores)[]).map(key => {
          const score = report.scores[key];
          const { icon, name } = caselLabels[key];
          const description = report.descriptions[key];

          return (
            <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{icon}</span>
                <span className="font-semibold text-sm text-gray-800">{name}</span>
                <span className="ml-auto text-sm font-bold" style={{ color: theme.palette.accent }}>
                  {score}/5
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(score / 5) * 100}%`,
                    backgroundColor: theme.palette.accent,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mb-8 italic">
        {report.disclaimer}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 rounded-full text-center font-semibold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: theme.palette.accent }}
        >
          Play New Session
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full text-center font-semibold border-2 transition-transform hover:scale-105"
          style={{ borderColor: theme.palette.accent, color: theme.palette.accent }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
