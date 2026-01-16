import { NextRequest, NextResponse } from 'next/server';

// Content safety rules based on komalkids.com/content-safety
const CONTENT_RULES = {
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
};

interface ScanResult {
  url: string;
  overallScore: number;
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
    };
  };
  categoryScores: {
    [category: string]: {
      detected: boolean;
      confidence: number;
    };
  };
  ageGroupActions: {
    [ageGroup: string]: {
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      score: number;
    };
  };
  timestamp: string;
}

async function analyzeUrlWithAI(url: string): Promise<ScanResult> {
  // This is a demo implementation using placeholder ChatGPT API
  // In production, this would call actual Vision AI and NLP services

  // Placeholder API key as specified
  const apiKey = 'chatgpt-api-key';

  // Simulate AI analysis with realistic demo data
  const demoAnalysis = generateDemoAnalysis(url);

  // In production, you would call:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4-vision-preview',
  //     messages: [...]
  //   })
  // });

  return demoAnalysis;
}

function generateDemoAnalysis(url: string): ScanResult {
  // Generate realistic demo data based on URL patterns
  const urlLower = url.toLowerCase();

  // Detect content type from URL patterns
  const hasNews = urlLower.includes('news') || urlLower.includes('cnn') || urlLower.includes('bbc');
  const hasGaming = urlLower.includes('game') || urlLower.includes('steam') || urlLower.includes('xbox');
  const hasEducational = urlLower.includes('edu') || urlLower.includes('learn') || urlLower.includes('wiki');
  const hasSocial = urlLower.includes('facebook') || urlLower.includes('instagram') || urlLower.includes('tiktok');
  const hasVideo = urlLower.includes('youtube') || urlLower.includes('video') || urlLower.includes('vimeo');

  // Initialize category scores
  const categoryScores: { [key: string]: { detected: boolean; confidence: number } } = {};

  // Simulate content detection
  let detectedCategories: string[] = [];

  if (hasNews) {
    categoryScores['Crime Footage'] = { detected: true, confidence: 0.65 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.45 };
    detectedCategories.push('Crime Footage', 'Mild Language');
  }

  if (hasGaming) {
    categoryScores['Non-Graphic Violence'] = { detected: true, confidence: 0.72 };
    categoryScores['Heavy Fighting (Sports)'] = { detected: true, confidence: 0.58 };
    detectedCategories.push('Non-Graphic Violence');
  }

  if (hasEducational) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.95 };
    detectedCategories.push('Educational Content');
  }

  if (hasSocial) {
    categoryScores['Mild Language'] = { detected: true, confidence: 0.55 };
    categoryScores['Strong Language'] = { detected: true, confidence: 0.35 };
    detectedCategories.push('Mild Language');
  }

  if (hasVideo) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.40 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.50 };
  }

  // If no specific patterns detected, use generic safe content
  if (detectedCategories.length === 0) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.70 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.30 };
    detectedCategories.push('Educational Content');
  }

  // Calculate overall score (0-100, higher is safer)
  let overallScore = 75;
  if (hasEducational) overallScore += 15;
  if (categoryScores['Graphic Violence']?.detected) overallScore -= 40;
  if (categoryScores['Explicit Content']?.detected) overallScore -= 50;
  if (categoryScores['Crime Footage']?.detected) overallScore -= 15;
  if (categoryScores['Horror/Jumpscares']?.detected) overallScore -= 25;

  overallScore = Math.max(0, Math.min(100, overallScore));

  // Generate age group actions based on detected categories
  const ageGroupActions: { [key: string]: { action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; score: number } } = {};

  CONTENT_RULES.ageGroups.forEach((ageGroup) => {
    let worstAction: 'BLOCK' | 'GATE' | 'ALLOW' = 'ALLOW';
    let reasons: string[] = [];
    let ageScore = 100;

    Object.entries(categoryScores).forEach(([category, data]) => {
      if (data.detected && data.confidence > 0.5) {
        const rule = CONTENT_RULES.categories[category as keyof typeof CONTENT_RULES.categories];
        if (rule) {
          const action = rule[ageGroup as keyof typeof rule];

          if (action === 'BLOCK') {
            worstAction = 'BLOCK';
            ageScore = Math.min(ageScore, 30);
            reasons.push(`${category} detected (blocked for this age)`);
          } else if (action === 'GATE' && worstAction !== 'BLOCK') {
            worstAction = 'GATE';
            ageScore = Math.min(ageScore, 60);
            reasons.push(`${category} detected (requires parent approval)`);
          } else if (action === 'ALLOW') {
            ageScore = Math.min(ageScore, 85);
          }
        }
      }
    });

    if (reasons.length === 0) {
      reasons.push('Content appears age-appropriate');
    }

    ageGroupActions[ageGroup] = {
      action: worstAction,
      reason: reasons.join('; '),
      score: ageScore,
    };
  });

  return {
    url,
    overallScore,
    contentAnalysis: {
      textAnalysis: {
        sentiment: overallScore > 70 ? 'Positive' : overallScore > 40 ? 'Neutral' : 'Concerning',
        keyTopics: detectedCategories.length > 0 ? detectedCategories : ['General Content'],
        languageScore: Math.floor(overallScore * 0.8 + Math.random() * 15),
      },
      visualAnalysis: {
        detectedObjects: hasVideo ? ['people', 'text', 'indoor scene'] : ['webpage', 'text', 'images'],
        safetyScore: Math.floor(overallScore * 0.85 + Math.random() * 10),
        concerns: detectedCategories.filter(c =>
          c.includes('Violence') || c.includes('Horror') || c.includes('Crime') || c.includes('Explicit')
        ),
      },
    },
    categoryScores,
    ageGroupActions,
    timestamp: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Perform AI analysis
    const result = await analyzeUrlWithAI(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning URL:', error);
    return NextResponse.json(
      { error: 'Failed to scan URL' },
      { status: 500 }
    );
  }
}
