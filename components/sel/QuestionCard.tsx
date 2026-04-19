"use client";

import { useState } from "react";
import type { EndQuestion } from "@/lib/sel/themes";

interface QuestionCardProps {
  question: EndQuestion;
  questionNumber: number;
  totalQuestions: number;
  themeAccent: string;
  themeText: string;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  themeAccent,
  themeText,
  onAnswer,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
    const isCorrect = index === question.correctIndex;

    // Delay to show feedback before advancing
    setTimeout(() => {
      onAnswer(index, isCorrect);
    }, 1200);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return {
        border: `2px solid ${themeAccent}30`,
        backgroundColor: 'white',
      };
    }
    if (index === question.correctIndex) {
      return {
        border: '2px solid #22c55e',
        backgroundColor: '#f0fdf4',
      };
    }
    if (index === selectedIndex && index !== question.correctIndex) {
      return {
        border: '2px solid #ef4444',
        backgroundColor: '#fef2f2',
      };
    }
    return {
      border: '2px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      opacity: 0.6,
    };
  };

  const label = question.type === 'mcq'
    ? 'Comprehension'
    : `SEL - ${question.selDimension === 'selfAwareness' ? 'Self-Awareness' : question.selDimension === 'socialAwareness' ? 'Social Awareness' : 'Relationship Skills'}`;

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: themeAccent + '20', color: themeAccent }}
        >
          {label}
        </span>
        <span className="text-xs text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        <h3
          className="text-lg font-semibold mb-6 leading-relaxed"
          style={{ color: themeText }}
        >
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className="w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium"
              style={getOptionStyle(index)}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: answered && index === question.correctIndex ? '#22c55e' : themeAccent + '20',
                    color: answered && index === question.correctIndex ? 'white' : themeAccent,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-700">{option}</span>
              </span>
              {answered && index === question.correctIndex && (
                <span className="float-right text-green-600 text-sm mt-0.5">&#10003;</span>
              )}
              {answered && index === selectedIndex && index !== question.correctIndex && (
                <span className="float-right text-red-500 text-sm mt-0.5">&#10007;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
