import fs from 'fs';
import path from 'path';

export interface KeywordVector {
  keyword: string;
  category: string;
  normalizedKeyword: string;
  words: string[]; // Individual words in the keyword
}

export interface CategoryKeywords {
  category: string;
  keywords: KeywordVector[];
}

export interface WordFrequency {
  word: string;
  frequency: number;
}

export interface SimilarityMatch {
  keyword: string;
  category: string;
  matchedWord: string;
  similarity: number;
  distance: number;
  frequency: number;
  score: number; // Combined score: frequency * (1 - normalized_distance)
  priority: number; // Priority weight based on category severity (higher = more dangerous)
}

/**
 * Load keywords from CSV and create vectorized representations
 */
export function loadAndVectorizeKeywords(): CategoryKeywords[] {
  try {
    const csvPath = path.join(process.cwd(), 'Models_Masterdoc.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.warn('CSV file has insufficient lines');
      return [];
    }

    const categoryKeywords: CategoryKeywords[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line (handle quoted values)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current || values.length > 0) {
        values.push(current.trim());
      }

      if (values.length >= 2) {
        const category = values[0].trim();
        let keywordsStr = values[1]?.trim() || '';

        // Remove surrounding quotes if present
        if (keywordsStr.startsWith('"') && keywordsStr.endsWith('"')) {
          keywordsStr = keywordsStr.slice(1, -1);
        }

        // Skip header row
        if (category && !category.startsWith('Category') && category !== 'Category' && keywordsStr) {
          // Split keywords by comma
          const keywords = keywordsStr.split(',').map(k => k.trim()).filter(Boolean);
          
          const vectorizedKeywords: KeywordVector[] = keywords.map(keyword => {
            const normalized = normalizeText(keyword);
            const words = tokenizeText(normalized);
            
            return {
              keyword,
              category,
              normalizedKeyword: normalized,
              words,
            };
          });

          categoryKeywords.push({
            category,
            keywords: vectorizedKeywords,
          });
        }
      }
    }

    return categoryKeywords;
  } catch (error) {
    console.error('Error loading and vectorizing keywords:', error);
    return [];
  }
}

/**
 * Normalize text: lowercase, remove special chars, trim
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize text into words
 */
function tokenizeText(text: string): string[] {
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase());
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity between two strings (0-1, where 1 is identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLen);
}

/**
 * Check if word is a substring match (for multi-word keywords)
 */
function isSubstringMatch(word: string, keywordWords: string[]): boolean {
  const normalizedWord = normalizeText(word);
  const keywordText = keywordWords.join(' ');
  
  return keywordText.includes(normalizedWord) || normalizedWord.includes(keywordText);
}

/**
 * Extract word frequencies from text content
 */
export function extractWordFrequencies(text: string): WordFrequency[] {
  const normalized = normalizeText(text);
  const words = tokenizeText(normalized);
  
  // Filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'what', 'which', 'who', 'when', 'where', 'why', 'how', 'can', 'cannot'
  ]);
  
  const wordFreq: Map<string, number> = new Map();
  
  for (const word of words) {
    if (word.length > 2 && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }
  
  return Array.from(wordFreq.entries())
    .map(([word, frequency]) => ({ word, frequency }))
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Get priority weight for a category (higher = more dangerous/not child-safe)
 */
function getCategoryPriority(category: string): number {
  // Non-child-safe categories get high priority
  if (category === '1. Violence & Disturbing Content') return 10.0; // Highest priority
  if (category === '2. Explicit & Body-Related Content') return 9.5; // Very high priority
  if (category === '3. Substances & Addictive Behavior') return 8.0; // High priority
  if (category === '4. Financial & Commercial Content') return 6.0; // Medium-high priority
  if (category === '5. Media & Platform-Native Risks') return 5.0; // Medium priority
  if (category === '6. Social & Cultural Topics') return 3.0; // Lower priority (can be neutral)
  
  // Safe/neutral categories get very low priority
  return 0.5; // Default low priority for any other categories
}

/**
 * Find similar keywords using vectorized search
 */
export function findSimilarKeywords(
  wordFrequencies: WordFrequency[],
  categoryKeywords: CategoryKeywords[],
  topN: number = 20
): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];
  const similarityThreshold = 0.3; // Minimum similarity to consider

  for (const categoryData of categoryKeywords) {
    for (const keywordVector of categoryData.keywords) {
      let bestMatch: { word: string; similarity: number; distance: number } | null = null;
      
      // Check each word in the URL content
      for (const wordFreq of wordFrequencies) {
        // Exact match on normalized keyword
        if (keywordVector.normalizedKeyword === normalizeText(wordFreq.word)) {
          bestMatch = {
            word: wordFreq.word,
            similarity: 1.0,
            distance: 0,
          };
          break;
        }
        
        // Check if word matches any part of the keyword
        if (isSubstringMatch(wordFreq.word, keywordVector.words)) {
          const similarity = 0.9; // High similarity for substring match
          const distance = 0.1;
          
          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = {
              word: wordFreq.word,
              similarity,
              distance,
            };
          }
        }
        
        // Check similarity with individual words in keyword
        for (const keywordWord of keywordVector.words) {
          const similarity = calculateSimilarity(wordFreq.word, keywordWord);
          
          if (similarity >= similarityThreshold) {
            const distance = 1 - similarity;
            
            if (!bestMatch || similarity > bestMatch.similarity) {
              bestMatch = {
                word: wordFreq.word,
                similarity,
                distance,
              };
            }
          }
        }
        
        // Check similarity with full keyword
        const fullSimilarity = calculateSimilarity(
          wordFreq.word,
          keywordVector.normalizedKeyword
        );
        
        if (fullSimilarity >= similarityThreshold) {
          const distance = 1 - fullSimilarity;
          
          if (!bestMatch || fullSimilarity > bestMatch.similarity) {
            bestMatch = {
              word: wordFreq.word,
              similarity: fullSimilarity,
              distance,
            };
          }
        }
      }
      
      if (bestMatch && bestMatch.similarity >= similarityThreshold) {
        // Find the frequency of the matched word
        const matchedWordFreq = wordFrequencies.find(wf => wf.word === bestMatch!.word);
        const frequency = matchedWordFreq?.frequency || 1;
        
        // Calculate combined score: frequency * similarity
        // Higher frequency and higher similarity = higher score
        const baseScore = frequency * bestMatch.similarity;
        
        // Get category priority (non-child-safe categories get higher priority)
        const categoryPriority = getCategoryPriority(categoryData.category);
        
        // Apply priority multiplier to score (non-child-safe keywords get much higher scores)
        const priorityMultiplier = categoryPriority;
        const score = baseScore * priorityMultiplier;
        
        matches.push({
          keyword: keywordVector.keyword,
          category: categoryData.category,
          matchedWord: bestMatch.word,
          similarity: bestMatch.similarity,
          distance: bestMatch.distance,
          frequency,
          score,
          priority: categoryPriority,
        });
      }
    }
  }

  // Sort by priority first (non-child-safe categories first), then by score, then by distance
  matches.sort((a, b) => {
    // First, sort by priority (higher priority = more dangerous = comes first)
    if (Math.abs(b.priority - a.priority) > 0.1) {
      return b.priority - a.priority;
    }
    // Then by score (higher score = better match)
    if (Math.abs(b.score - a.score) > 0.01) {
      return b.score - a.score;
    }
    // Finally by distance (lower distance = better match)
    return a.distance - b.distance;
  });

  return matches.slice(0, topN);
}

/**
 * Generate a report based on similarity matches
 */
export function generateSimilarityReport(
  matches: SimilarityMatch[],
  wordFrequencies: WordFrequency[]
): {
  topCategories: Array<{ category: string; matchCount: number; avgScore: number }>;
  topKeywords: SimilarityMatch[];
  topWords: WordFrequency[];
  summary: string;
} {
  // Group matches by category
  const categoryStats = new Map<string, { count: number; totalScore: number }>();
  
  for (const match of matches) {
    const existing = categoryStats.get(match.category) || { count: 0, totalScore: 0 };
    categoryStats.set(match.category, {
      count: existing.count + 1,
      totalScore: existing.totalScore + match.score,
    });
  }
  
  const topCategories = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({
      category,
      matchCount: stats.count,
      avgScore: stats.totalScore / stats.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);
  
  // Get top keywords (already sorted by score)
  const topKeywords = matches.slice(0, 10);
  
  // Get top words by frequency
  const topWords = wordFrequencies.slice(0, 20);
  
  // Generate summary
  let summary = `Found ${matches.length} keyword matches across ${topCategories.length} categories. `;
  
  if (topCategories.length > 0) {
    summary += `Primary concern: ${topCategories[0].category} (${topCategories[0].matchCount} matches). `;
  }
  
  if (topKeywords.length > 0) {
    summary += `Highest scoring match: "${topKeywords[0].keyword}" (score: ${topKeywords[0].score.toFixed(2)}).`;
  }
  
  return {
    topCategories,
    topKeywords,
    topWords,
    summary,
  };
}
