// ============================================================================
// Age-Based Safety Scoring
// Extracted from app/api/scan-url/route.ts
// ============================================================================

import { AGE_GROUPS } from './types';
import type { AgeGroup, ChildSafetyRisk, ChildSafetyAnalysis, KeywordFinding } from './types';
import { isDangerousSite, isSocialMediaSite } from './domain-lists';
import {
  CHILD_UNSAFE_PATTERNS,
  CHILD_SAFE_KEYWORDS,
  SAFE_PATTERN,
  analyzeKeywordContext,
  getExtendedContext,
} from './keyword-patterns';
import { getLikelihoodScore } from './cloud-apis';

// ============================================================================
// Child Safety Risk Definitions
// ============================================================================

export const CHILD_SAFETY_RISKS: ChildSafetyRisk[] = [
  { category: 'explicit', severity: 'critical', deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 80 } },
  { category: 'predatory', severity: 'critical', deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 100 } },
  { category: 'violence', severity: 'high', deduction: { '<10': 80, '10-13': 70, '13-16': 50, '16+': 30 } },
  { category: 'substances', severity: 'high', deduction: { '<10': 90, '10-13': 80, '13-16': 60, '16+': 40 } },
  { category: 'gambling', severity: 'high', deduction: { '<10': 90, '10-13': 85, '13-16': 70, '16+': 50 } },
  { category: 'hate', severity: 'high', deduction: { '<10': 90, '10-13': 85, '13-16': 75, '16+': 60 } },
  { category: 'profanity', severity: 'medium', deduction: { '<10': 60, '10-13': 50, '13-16': 30, '16+': 15 } },
  { category: 'dangerous', severity: 'high', deduction: { '<10': 85, '10-13': 75, '13-16': 55, '16+': 35 } },
];

// ============================================================================
// Context-Aware Child Safety Analysis
// ============================================================================

export function analyzeChildSafetyFast(
  text: string,
  title: string = '',
  description: string = '',
  keywords: string[] = []
): ChildSafetyAnalysis {
  const allContent = `${title} ${description} ${keywords.join(' ')} ${text}`.toLowerCase().slice(0, 20000);
  const unsafeKeywordsFound: KeywordFinding[] = [];
  let filteredByContext = 0;
  const ageSpecificRiskScores: { [key in AgeGroup]: number } = { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 };

  for (const [category, pattern] of Object.entries(CHILD_UNSAFE_PATTERNS)) {
    pattern.lastIndex = 0;

    const keywordMatches: { keyword: string; position: number; context: string }[] = [];
    const regex = new RegExp(pattern.source, 'gi');
    let match;

    while ((match = regex.exec(allContent)) !== null) {
      const keyword = match[0].toLowerCase();
      const position = match.index;
      const extendedContext = getExtendedContext(allContent, keyword, position);
      keywordMatches.push({ keyword, position, context: extendedContext });
    }

    if (keywordMatches.length > 0) {
      const keywordGroups: {
        [key: string]: {
          flaggedCount: number;
          notFlaggedCount: number;
          contexts: string[];
          severity: number;
          ageMultipliers: { [key in AgeGroup]: number };
        }
      } = {};

      for (const km of keywordMatches) {
        if (!keywordGroups[km.keyword]) {
          keywordGroups[km.keyword] = {
            flaggedCount: 0,
            notFlaggedCount: 0,
            contexts: [],
            severity: 0,
            ageMultipliers: { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 }
          };
        }

        const contextAnalysis = analyzeKeywordContext(km.keyword, km.context);

        if (contextAnalysis.shouldFlag) {
          keywordGroups[km.keyword].flaggedCount++;
          keywordGroups[km.keyword].severity = Math.max(keywordGroups[km.keyword].severity, contextAnalysis.severity);

          for (const ageGroup of AGE_GROUPS) {
            keywordGroups[km.keyword].ageMultipliers[ageGroup] = Math.max(
              keywordGroups[km.keyword].ageMultipliers[ageGroup],
              contextAnalysis.ageMultipliers[ageGroup]
            );
          }

          if (keywordGroups[km.keyword].contexts.length < 2) {
            keywordGroups[km.keyword].contexts.push(km.context.trim().slice(0, 80));
          }
        } else {
          keywordGroups[km.keyword].notFlaggedCount++;
          filteredByContext++;
        }
      }

      for (const [keyword, data] of Object.entries(keywordGroups)) {
        if (data.flaggedCount > 0) {
          unsafeKeywordsFound.push({
            category,
            keyword,
            count: data.flaggedCount,
            context: data.contexts,
            contextSafe: false,
            isDangerous: data.severity >= 0.8,
            severity: data.severity,
            ageMultipliers: data.ageMultipliers,
          });
        }
      }
    }
  }

  // Find safe keywords
  const safeMatches = allContent.match(SAFE_PATTERN);
  const safeKeywordsFound = safeMatches ? [...new Set(safeMatches.map(m => m.toLowerCase()))] : [];

  // Calculate age-specific risk scores
  for (const unsafe of unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      const baseSeverity = risk.severity === 'critical' ? 10 : risk.severity === 'high' ? 6 : risk.severity === 'medium' ? 3 : 1;
      const countFactor = Math.min(unsafe.count, 5);
      const severityFactor = unsafe.severity;

      for (const ageGroup of AGE_GROUPS) {
        const ageMultiplier = unsafe.ageMultipliers[ageGroup];
        ageSpecificRiskScores[ageGroup] += countFactor * baseSeverity * severityFactor * ageMultiplier;
      }
    }
  }

  // Bonus for safe content
  const safeBonus = Math.min(safeKeywordsFound.length * 3, 40);
  for (const ageGroup of AGE_GROUPS) {
    ageSpecificRiskScores[ageGroup] = Math.max(0, ageSpecificRiskScores[ageGroup] - safeBonus);
  }

  // Overall risk score
  const riskScore = Math.round(
    (ageSpecificRiskScores['<10'] * 0.35 +
      ageSpecificRiskScores['10-13'] * 0.30 +
      ageSpecificRiskScores['13-16'] * 0.20 +
      ageSpecificRiskScores['16+'] * 0.15)
  );

  let riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous' = 'safe';
  if (riskScore >= 50 || unsafeKeywordsFound.some(u => u.isDangerous)) {
    riskLevel = 'dangerous';
  } else if (riskScore >= 25) {
    riskLevel = 'unsafe';
  } else if (riskScore >= 10) {
    riskLevel = 'caution';
  }

  return {
    unsafeKeywordsFound,
    safeKeywordsFound,
    riskScore,
    riskLevel,
    filteredByContext,
    ageSpecificRiskScores
  };
}

// ============================================================================
// Age Group Score Calculation
// ============================================================================

export function calculateAgeGroupScores(
  childSafetyAnalysis: ChildSafetyAnalysis,
  visionSafeSearch: any,
  multimediaRisk: number = 0,
  url?: string
): {
  [key in AgeGroup]: { score: number; action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; risks: string[] };
} {
  const scores: { [key in AgeGroup]: { score: number; action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; risks: string[] } } = {
    '<10': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '10-13': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '13-16': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '16+': { score: 100, action: 'ALLOW', reason: '', risks: [] },
  };

  // DANGEROUS SITES - BLOCK FOR ALL AGES
  if (url) {
    const dangerousInfo = isDangerousSite(url);
    if (dangerousInfo) {
      const categoryLabels: { [key: string]: string } = {
        'pornography': 'Age-inappropriate content (adult)',
        'violence': 'Age-inappropriate content (violent/graphic)',
        'gambling': 'Age-inappropriate content (gambling/betting)',
        'dangerous_chat': 'Age-inappropriate chat room',
        'dangerous_forum': 'Age-inappropriate forum/community',
        'adult_dating': 'Age-inappropriate content (adult dating)',
        'hate_extremist': 'Age-inappropriate content (hate/extremist)',
        'illegal_activities': 'Age-inappropriate content (illegal activities)',
        'dangerous': 'Age-inappropriate content',
      };

      const categoryLabel = categoryLabels[dangerousInfo.category] || 'Age-inappropriate content';

      return {
        '<10': { score: 0, action: 'BLOCK', reason: dangerousInfo.reason, risks: [categoryLabel, 'Not appropriate for any age group', 'Blocked by safety policy'] },
        '10-13': { score: 0, action: 'BLOCK', reason: dangerousInfo.reason, risks: [categoryLabel, 'Not appropriate for any age group', 'Blocked by safety policy'] },
        '13-16': { score: 0, action: 'BLOCK', reason: dangerousInfo.reason, risks: [categoryLabel, 'Not appropriate for any age group', 'Blocked by safety policy'] },
        '16+': { score: 0, action: 'BLOCK', reason: dangerousInfo.reason, risks: [categoryLabel, 'Age-inappropriate content', 'Blocked by safety policy'] },
      };
    }
  }

  // SOCIAL MEDIA SPECIAL HANDLING
  if (url && isSocialMediaSite(url)) {
    const socialMediaScore = Math.floor(Math.random() * 11) + 20;

    return {
      '<10': { score: 0, action: 'BLOCK', reason: 'Social media platforms are not appropriate for children under 10', risks: ['Social media platform', 'Age-inappropriate content possible', 'Privacy concerns'] },
      '10-13': { score: 0, action: 'BLOCK', reason: 'Social media platforms require users to be 13+ (COPPA compliance)', risks: ['Social media platform', 'COPPA age restriction', 'Privacy concerns'] },
      '13-16': { score: socialMediaScore, action: 'GATE', reason: 'Social media requires parental awareness - monitor usage and privacy settings', risks: ['Social media platform', 'Privacy concerns', 'Content moderation varies'] },
      '16+': { score: socialMediaScore, action: 'GATE', reason: 'Social media - be aware of privacy settings and content exposure', risks: ['Social media platform', 'User-generated content'] },
    };
  }

  // Apply deductions based on unsafe keywords
  for (const unsafe of childSafetyAnalysis.unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      for (const ageGroup of AGE_GROUPS) {
        const ageMultiplier = unsafe.ageMultipliers?.[ageGroup] ?? 1;
        const effectiveMultiplier = unsafe.isDangerous ? 1 : ageMultiplier;
        const baseDeduction = risk.deduction[ageGroup] * (Math.min(unsafe.count, 5) / 5);
        const deduction = baseDeduction * effectiveMultiplier;

        scores[ageGroup].score -= deduction;

        if (deduction > 5 && scores[ageGroup].risks.length < 3) {
          const riskLabel = unsafe.isDangerous
            ? `${unsafe.category}: "${unsafe.keyword}"`
            : `${unsafe.category}: "${unsafe.keyword}"`;
          scores[ageGroup].risks.push(riskLabel);
        }
      }
    }
  }

  // Apply Vision API safe search results
  if (visionSafeSearch) {
    const adultScore = getLikelihoodScore(visionSafeSearch.adult);
    const violenceScore = getLikelihoodScore(visionSafeSearch.violence);

    if (adultScore >= 3) {
      scores['<10'].score -= 100; scores['10-13'].score -= 100;
      scores['13-16'].score -= 100; scores['16+'].score -= 80;
      for (const ag of AGE_GROUPS) scores[ag].risks.push('Adult content in images');
    }
    if (violenceScore >= 3) {
      scores['<10'].score -= 70; scores['10-13'].score -= 60;
      scores['13-16'].score -= 40; scores['16+'].score -= 20;
      for (const ag of AGE_GROUPS) scores[ag].risks.push('Violence in images');
    }
  }

  // Apply multimedia risk
  if (multimediaRisk > 20) {
    for (const ageGroup of AGE_GROUPS) {
      scores[ageGroup].score -= multimediaRisk * (ageGroup === '<10' ? 0.5 : 0.3);
    }
  }

  // Bonus for safe content
  const safeBonus = Math.min(childSafetyAnalysis.safeKeywordsFound.length * 3, 20);
  for (const ageGroup of AGE_GROUPS) {
    scores[ageGroup].score += safeBonus;
  }

  // Bonus for content filtered by safe context
  if (childSafetyAnalysis.filteredByContext > 0) {
    const contextBonus = Math.min(childSafetyAnalysis.filteredByContext * 2, 15);
    for (const ageGroup of AGE_GROUPS) {
      scores[ageGroup].score += contextBonus;
    }
  }

  // Clamp scores and determine actions
  for (const ageGroup of AGE_GROUPS) {
    scores[ageGroup].score = Math.max(0, Math.min(100, Math.round(scores[ageGroup].score)));
    const s = scores[ageGroup];

    if (s.score >= 80) {
      s.action = 'ALLOW';
      s.reason = s.risks.length === 0 ? 'Content appears safe for this age group' : 'Minor concerns but generally appropriate';
    } else if (s.score >= 50) {
      s.action = 'GATE';
      s.reason = `Parental guidance recommended: ${s.risks.slice(0, 2).join('; ')}`;
    } else {
      s.action = 'BLOCK';
      s.reason = `Content not suitable: ${s.risks.slice(0, 2).join('; ')}`;
    }
  }

  return scores;
}

// ============================================================================
// Topic Detection
// ============================================================================

export function detectTopics(text: string, title: string): string[] {
  const content = (title + ' ' + text).toLowerCase();
  const topics: string[] = [];

  const topicPatterns: { [key: string]: RegExp } = {
    'Education': /\b(learn|education|school|study|course|tutorial|lesson|teach)\b/i,
    'News': /\b(news|breaking|report|headline|journalist|media)\b/i,
    'Entertainment': /\b(movie|music|game|entertainment|video|stream|watch)\b/i,
    'Social Media': /\b(social|share|post|follow|like|comment|profile)\b/i,
    'Shopping': /\b(buy|shop|cart|price|sale|discount|order)\b/i,
    'Technology': /\b(tech|software|app|computer|digital|internet|online)\b/i,
    'Health': /\b(health|medical|doctor|wellness|fitness|diet)\b/i,
    'Sports': /\b(sport|game|team|player|score|match|championship)\b/i,
  };

  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(content)) {
      topics.push(topic);
      if (topics.length >= 3) break;
    }
  }

  return topics.length > 0 ? topics : ['General'];
}
