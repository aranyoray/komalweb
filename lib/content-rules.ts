export const CONTENT_RULES = {
  ageGroups: ['<10', '10-13', '13-16', '16+'],
  categories: {
    'Graphic Violence': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-16': 'BLOCK',
      '16+': 'GATE',
    },
    'Non-Graphic Violence': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-16': 'ALLOW',
      '16+': 'ALLOW',
    },
    'Heavy Fighting (Sports)': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-16': 'ALLOW',
      '16+': 'ALLOW',
    },
    'Horror/Jumpscares': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-16': 'GATE',
      '16+': 'ALLOW',
    },
    'Crime Footage': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-16': 'GATE',
      '16+': 'ALLOW',
    },
    'Explicit Content': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-16': 'BLOCK',
      '16+': 'GATE',
    },
    'Educational Content': {
      '<10': 'ALLOW',
      '10-13': 'ALLOW',
      '13-16': 'ALLOW',
      '16+': 'ALLOW',
    },
    'Mild Language': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-16': 'ALLOW',
      '16+': 'ALLOW',
    },
    'Strong Language': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-16': 'GATE',
      '16+': 'ALLOW',
    },
    'Substance Use': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-16': 'GATE',
      '16+': 'ALLOW',
    },
  },
} as const;

export type CategoryScores = Record<string, { detected: boolean; confidence: number }>;

export const isBlockedForUnder16 = (categoryScores: CategoryScores): boolean => {
  return Object.entries(categoryScores).some(([category, data]) => {
    if (!data.detected || data.confidence <= 0.5) {
      return false;
    }

    const rule = CONTENT_RULES.categories[category as keyof typeof CONTENT_RULES.categories];
    return Boolean(rule && rule['13-16'] === 'BLOCK');
  });
};
