"use client";

import type { SceneResponse } from "@/lib/sel/casel-scoring";

interface EmotionalJourneyProps {
  responses: SceneResponse[];
  themeAccent: string;
}

const valenceToY: Record<string, number> = {
  positive: 30,
  neutral: 70,
  negative: 110,
};

export default function EmotionalJourney({ responses, themeAccent }: EmotionalJourneyProps) {
  const width = 500;
  const height = 140;
  const padding = 40;
  const usableWidth = width - padding * 2;

  const points = responses.map((r, i) => {
    const x = padding + (i / Math.max(1, responses.length - 1)) * usableWidth;
    const y = valenceToY[r.emojiValence || 'neutral'] || 70;
    return { x, y, response: r };
  });

  // Build smooth SVG path using quadratic bezier curves
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      pathD += ` Q ${cpX} ${prev.y}, ${curr.x} ${curr.y}`;
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[500px] mx-auto"
        role="img"
        aria-label="Emotional journey showing how feelings changed across 5 scenes"
      >
        <defs>
          <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeAccent} stopOpacity="0.3" />
            <stop offset="50%" stopColor={themeAccent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={themeAccent} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Y-axis labels */}
        <text x="8" y="34" fontSize="10" fill="#9ca3af" fontFamily="Poppins">
          Positive
        </text>
        <text x="8" y="74" fontSize="10" fill="#9ca3af" fontFamily="Poppins">
          Neutral
        </text>
        <text x="8" y="114" fontSize="10" fill="#9ca3af" fontFamily="Poppins">
          Negative
        </text>

        {/* Grid lines */}
        {[30, 70, 110].map(y => (
          <line
            key={y}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Flowing path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#journeyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Emoji markers */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Circle background */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="16"
              fill="white"
              stroke={themeAccent}
              strokeWidth="2"
            />
            {/* Emoji text */}
            <text
              x={pt.x}
              y={pt.y + 5}
              textAnchor="middle"
              fontSize="16"
            >
              {pt.response.emojiPicked || (pt.response.responseTimeMs === 0 ? '📖' : '⏭️')}
            </text>
            {/* Scene number */}
            <text
              x={pt.x}
              y={height - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
              fontFamily="Poppins"
            >
              Scene {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
