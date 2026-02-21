/**
 * Enhanced Keyword Vectorization & Similarity Search Engine
 *
 * Features:
 * 1. TF-IDF based vectorization
 * 2. N-gram support (unigrams, bigrams, trigrams)
 * 3. Context-aware depth search
 * 4. Cosine similarity matching
 * 5. Position-based depth scoring
 */

import fs from 'fs';
import path from 'path';

export interface KeywordVector {
  keyword: string;
  category: string;
  normalizedKeyword: string;
  words: string[]; // Individual words in the keyword
  idf: number; // Inverse Document Frequency weight
}

export interface CategoryKeywords {
  category: string;
  keywords: KeywordVector[];
  totalKeywords: number;
}

export interface WordFrequency {
  word: string;
  frequency: number;
  tf: number; // Term Frequency (normalized)
  tfidf: number; // TF-IDF score
  positions: number[]; // Positions where word appears
}

export interface SimilarityMatch {
  keyword: string;
  category: string;
  matchedWord: string;
  similarity: number;
  distance: number;
  frequency: number;
  score: number;
  priority: number;
  contextScore: number; // Score based on surrounding context
  depthScore: number; // Score based on position in document
  tfidfScore: number; // TF-IDF weighted score
}

export interface ContextWindow {
  before: string[];
  after: string[];
  position: number;
}

// Global cached data
let cachedCategoryKeywords: CategoryKeywords[] | null = null;
let globalIdfMap: Map<string, number> = new Map();

/**
 * Load keywords from CSV and create TF-IDF vectorized representations
 */
export function loadAndVectorizeKeywords(): CategoryKeywords[] {
  if (cachedCategoryKeywords) {
    return cachedCategoryKeywords;
  }

  try {
    const csvPath = path.join(process.cwd(), 'Models_Masterdoc_Test.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      console.warn('CSV file has insufficient lines');
      return [];
    }

    const categoryKeywords: CategoryKeywords[] = [];
    const allKeywords: Set<string> = new Set();
    const keywordDocCount: Map<string, number> = new Map();

    // First pass: collect all keywords for IDF calculation
    const tempCategories: Array<{ category: string; keywords: string[] }> = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCSVLine(line);

      if (values.length >= 2) {
        const category = values[0].trim();
        let keywordsStr = values[1]?.trim() || '';

        if (keywordsStr.startsWith('"') && keywordsStr.endsWith('"')) {
          keywordsStr = keywordsStr.slice(1, -1);
        }

        if (category && !category.startsWith('Category') && category !== 'Category' && keywordsStr) {
          const keywords = keywordsStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
          tempCategories.push({ category, keywords });

          // Track keyword document frequency
          const uniqueKeywordsInDoc = new Set(keywords.map(k => normalizeText(k)));
          for (const kw of uniqueKeywordsInDoc) {
            allKeywords.add(kw);
            keywordDocCount.set(kw, (keywordDocCount.get(kw) || 0) + 1);
          }
        }
      }
    }

    // Calculate IDF for each keyword
    const totalDocs = tempCategories.length;
    for (const [keyword, count] of keywordDocCount) {
      // Smoothed IDF: log((N + 1) / (df + 1)) + 1
      const idf = Math.log((totalDocs + 1) / (count + 1)) + 1;
      globalIdfMap.set(keyword, idf);
    }

    // Second pass: create vectorized keywords with IDF
    for (const { category, keywords } of tempCategories) {
      const vectorizedKeywords: KeywordVector[] = keywords.map(keyword => {
        const normalized = normalizeText(keyword);
        const words = tokenizeText(normalized);
        const idf = globalIdfMap.get(normalized) || 1;

        return {
          keyword,
          category,
          normalizedKeyword: normalized,
          words,
          idf,
        };
      });

      categoryKeywords.push({
        category,
        keywords: vectorizedKeywords,
        totalKeywords: vectorizedKeywords.length,
      });
    }

    cachedCategoryKeywords = categoryKeywords;
    console.log(`Loaded ${categoryKeywords.length} categories with ${allKeywords.size} unique keywords`);
    return categoryKeywords;
  } catch (error) {
    console.error('Error loading and vectorizing keywords:', error);
    return [];
  }
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
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
  return values;
}

/**
 * Normalize text: lowercase, remove special chars, trim
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
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
 * Create n-grams from tokens
 */
function createNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
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
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate string similarity (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLen);
}

/**
 * Calculate cosine similarity between two term frequency vectors
 */
function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const [term, value] of vec1) {
    if (vec2.has(term)) {
      dotProduct += value * vec2.get(term)!;
    }
    norm1 += value * value;
  }

  for (const value of vec2.values()) {
    norm2 += value * value;
  }

  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (norm1 * norm2);
}

/**
 * Extract word frequencies with TF-IDF and position tracking
 */
export function extractWordFrequencies(text: string): WordFrequency[] {
  const normalized = normalizeText(text);
  const tokens = tokenizeText(normalized);

  // Also create bigrams and trigrams for multi-word matching
  const bigrams = createNgrams(tokens, 2);
  const trigrams = createNgrams(tokens, 3);

  const allTerms = [...tokens, ...bigrams, ...trigrams];

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'what', 'which', 'who', 'when', 'where', 'why', 'how', 'can', 'cannot', 'not',
    'no', 'yes', 'all', 'any', 'some', 'most', 'other', 'such', 'only', 'same',
    'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then'
  ]);

  const wordData: Map<string, { frequency: number; positions: number[] }> = new Map();

  // Process unigrams with positions
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    if (word.length > 2 && !stopWords.has(word)) {
      const existing = wordData.get(word) || { frequency: 0, positions: [] };
      existing.frequency++;
      existing.positions.push(i);
      wordData.set(word, existing);
    }
  }

  // Process bigrams
  for (let i = 0; i < bigrams.length; i++) {
    const bigram = bigrams[i];
    const existing = wordData.get(bigram) || { frequency: 0, positions: [] };
    existing.frequency++;
    existing.positions.push(i);
    wordData.set(bigram, existing);
  }

  // Process trigrams
  for (let i = 0; i < trigrams.length; i++) {
    const trigram = trigrams[i];
    const existing = wordData.get(trigram) || { frequency: 0, positions: [] };
    existing.frequency++;
    existing.positions.push(i);
    wordData.set(trigram, existing);
  }

  // Calculate TF and TF-IDF
  const totalTerms = tokens.length;
  const maxFreq = Math.max(...Array.from(wordData.values()).map(d => d.frequency), 1);

  const result: WordFrequency[] = [];

  for (const [word, data] of wordData) {
    // Augmented Term Frequency (prevents bias toward longer docs)
    const tf = 0.5 + (0.5 * data.frequency) / maxFreq;

    // Get IDF from global map or default
    const idf = globalIdfMap.get(word) || Math.log((10 + 1) / (1 + 1)) + 1;

    const tfidf = tf * idf;

    result.push({
      word,
      frequency: data.frequency,
      tf,
      tfidf,
      positions: data.positions,
    });
  }

  return result.sort((a, b) => b.tfidf - a.tfidf);
}

/**
 * Calculate context score based on surrounding keywords
 */
function calculateContextScore(
  matchPosition: number,
  tokens: string[],
  categoryKeywords: KeywordVector[],
  windowSize: number = 10
): number {
  const start = Math.max(0, matchPosition - windowSize);
  const end = Math.min(tokens.length, matchPosition + windowSize);
  const contextTokens = tokens.slice(start, end);

  let relatedKeywordsFound = 0;
  const categoryKeywordSet = new Set(categoryKeywords.map(k => k.normalizedKeyword));
  const categoryWordSet = new Set(categoryKeywords.flatMap(k => k.words));

  for (const token of contextTokens) {
    if (categoryKeywordSet.has(token) || categoryWordSet.has(token)) {
      relatedKeywordsFound++;
    }
  }

  // Normalize context score (0.5 base + up to 0.5 bonus)
  return 0.5 + Math.min(relatedKeywordsFound / 10, 0.5);
}

/**
 * Calculate depth score based on position in document
 */
function calculateDepthScore(position: number, totalTokens: number): number {
  if (totalTokens === 0) return 0.5;

  const normalizedPosition = position / totalTokens;

  // Title/intro (first 10%) gets highest weight
  if (normalizedPosition < 0.1) return 1.0;
  // Conclusion (last 10%) gets high weight
  if (normalizedPosition > 0.9) return 0.85;
  // Early content (10-30%) gets moderate-high weight
  if (normalizedPosition < 0.3) return 0.75;
  // Late content (70-90%) gets moderate weight
  if (normalizedPosition > 0.7) return 0.65;
  // Middle content gets base weight
  return 0.5;
}

/**
 * Get priority weight for a category
 */
function getCategoryPriority(category: string): number {
  if (category === '1. Violence & Disturbing Content') return 10.0;
  if (category === '2. Explicit & Body-Related Content') return 9.5;
  if (category === '3. Substances & Addictive Behavior') return 8.0;
  if (category === '4. Financial & Commercial Content') return 6.0;
  if (category === '5. Media & Platform-Native Risks') return 5.0;
  if (category === '6. Social & Cultural Topics') return 3.0;
  return 0.5;
}

/**
 * Find similar keywords with enhanced scoring
 */
export function findSimilarKeywords(
  wordFrequencies: WordFrequency[],
  categoryKeywords: CategoryKeywords[],
  topN: number = 50,
  fullText?: string
): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];
  const similarityThreshold = 0.4;
  const matchedKeywords = new Set<string>();

  // Get full token list for context scoring
  const tokens = fullText ? tokenizeText(normalizeText(fullText)) : [];

  for (const categoryData of categoryKeywords) {
    for (const keywordVector of categoryData.keywords) {
      // Skip if already matched this keyword
      if (matchedKeywords.has(keywordVector.normalizedKeyword)) continue;

      let bestMatch: {
        word: string;
        similarity: number;
        distance: number;
        frequency: number;
        position: number;
        tfidf: number;
      } | null = null;

      for (const wordFreq of wordFrequencies) {
        const normalizedWord = normalizeText(wordFreq.word);

        // Exact match
        if (keywordVector.normalizedKeyword === normalizedWord) {
          bestMatch = {
            word: wordFreq.word,
            similarity: 1.0,
            distance: 0,
            frequency: wordFreq.frequency,
            position: wordFreq.positions[0] || 0,
            tfidf: wordFreq.tfidf,
          };
          break;
        }

        // Check if document word contains keyword or vice versa (substring match)
        if (normalizedWord.includes(keywordVector.normalizedKeyword) ||
            keywordVector.normalizedKeyword.includes(normalizedWord)) {
          const substringScore = 0.85;
          if (!bestMatch || substringScore > bestMatch.similarity) {
            bestMatch = {
              word: wordFreq.word,
              similarity: substringScore,
              distance: 0.15,
              frequency: wordFreq.frequency,
              position: wordFreq.positions[0] || 0,
              tfidf: wordFreq.tfidf,
            };
          }
          continue;
        }

        // Word-level matching for multi-word keywords
        for (const keywordWord of keywordVector.words) {
          if (keywordWord.length < 3) continue;

          // Exact word match
          if (keywordWord === normalizedWord) {
            const wordMatchScore = 0.95;
            if (!bestMatch || wordMatchScore > bestMatch.similarity) {
              bestMatch = {
                word: wordFreq.word,
                similarity: wordMatchScore,
                distance: 0.05,
                frequency: wordFreq.frequency,
                position: wordFreq.positions[0] || 0,
                tfidf: wordFreq.tfidf,
              };
            }
            break;
          }

          // Fuzzy match
          const similarity = calculateSimilarity(normalizedWord, keywordWord);
          if (similarity >= similarityThreshold && (!bestMatch || similarity > bestMatch.similarity)) {
            bestMatch = {
              word: wordFreq.word,
              similarity,
              distance: 1 - similarity,
              frequency: wordFreq.frequency,
              position: wordFreq.positions[0] || 0,
              tfidf: wordFreq.tfidf,
            };
          }
        }

        // Full keyword fuzzy match
        if (keywordVector.normalizedKeyword.length >= 4) {
          const fullSimilarity = calculateSimilarity(normalizedWord, keywordVector.normalizedKeyword);
          if (fullSimilarity >= similarityThreshold && (!bestMatch || fullSimilarity > bestMatch.similarity)) {
            bestMatch = {
              word: wordFreq.word,
              similarity: fullSimilarity,
              distance: 1 - fullSimilarity,
              frequency: wordFreq.frequency,
              position: wordFreq.positions[0] || 0,
              tfidf: wordFreq.tfidf,
            };
          }
        }
      }

      if (bestMatch && bestMatch.similarity >= similarityThreshold) {
        matchedKeywords.add(keywordVector.normalizedKeyword);

        // Calculate context score
        const contextScore = tokens.length > 0
          ? calculateContextScore(bestMatch.position, tokens, categoryData.keywords)
          : 0.5;

        // Calculate depth score
        const depthScore = tokens.length > 0
          ? calculateDepthScore(bestMatch.position, tokens.length)
          : 0.5;

        // Get category priority
        const categoryPriority = getCategoryPriority(categoryData.category);

        // Calculate combined score with TF-IDF weighting
        // Score = (similarity * 0.25) + (tfidf * 0.25) + (context * 0.2) + (depth * 0.15) + (frequency * 0.15)
        const normalizedFrequency = Math.min(bestMatch.frequency / 10, 1);
        const normalizedTfidf = Math.min(bestMatch.tfidf / 5, 1);

        const baseScore =
          (bestMatch.similarity * 0.25) +
          (normalizedTfidf * 0.25) +
          (contextScore * 0.2) +
          (depthScore * 0.15) +
          (normalizedFrequency * 0.15);

        // Apply category priority multiplier
        const score = baseScore * categoryPriority;

        matches.push({
          keyword: keywordVector.keyword,
          category: categoryData.category,
          matchedWord: bestMatch.word,
          similarity: bestMatch.similarity,
          distance: bestMatch.distance,
          frequency: bestMatch.frequency,
          score,
          priority: categoryPriority,
          contextScore,
          depthScore,
          tfidfScore: bestMatch.tfidf,
        });
      }
    }
  }

  // Sort by priority first, then by score
  matches.sort((a, b) => {
    if (Math.abs(b.priority - a.priority) > 0.1) {
      return b.priority - a.priority;
    }
    return b.score - a.score;
  });

  return matches.slice(0, topN);
}

/**
 * Perform deep context search in text
 */
export function deepContextSearch(
  text: string,
  categoryKeywords: CategoryKeywords[],
  windowSize: number = 50
): {
  category: string;
  contextMatches: Array<{
    keyword: string;
    context: string;
    position: number;
    relatedKeywords: string[];
  }>;
}[] {
  const textLower = text.toLowerCase();
  const results: Map<string, Array<{
    keyword: string;
    context: string;
    position: number;
    relatedKeywords: string[];
  }>> = new Map();

  for (const categoryData of categoryKeywords) {
    const categoryMatches: Array<{
      keyword: string;
      context: string;
      position: number;
      relatedKeywords: string[];
    }> = [];

    for (const keywordVector of categoryData.keywords) {
      // Skip very short keywords
      if (keywordVector.normalizedKeyword.length < 4) continue;

      let searchIndex = 0;
      while (true) {
        const position = textLower.indexOf(keywordVector.normalizedKeyword, searchIndex);
        if (position === -1) break;

        // Extract context window
        const contextStart = Math.max(0, position - windowSize);
        const contextEnd = Math.min(text.length, position + keywordVector.normalizedKeyword.length + windowSize);
        const context = text.slice(contextStart, contextEnd);

        // Find related keywords in context
        const relatedKeywords: string[] = [];
        for (const otherKeyword of categoryData.keywords) {
          if (otherKeyword.normalizedKeyword !== keywordVector.normalizedKeyword) {
            if (context.toLowerCase().includes(otherKeyword.normalizedKeyword)) {
              relatedKeywords.push(otherKeyword.keyword);
            }
          }
        }

        categoryMatches.push({
          keyword: keywordVector.keyword,
          context,
          position,
          relatedKeywords,
        });

        searchIndex = position + 1;
      }
    }

    if (categoryMatches.length > 0) {
      results.set(categoryData.category, categoryMatches);
    }
  }

  return Array.from(results.entries()).map(([category, contextMatches]) => ({
    category,
    contextMatches,
  }));
}

/**
 * Generate enhanced similarity report
 */
export function generateSimilarityReport(
  matches: SimilarityMatch[],
  wordFrequencies: WordFrequency[]
): {
  topCategories: Array<{
    category: string;
    matchCount: number;
    avgScore: number;
    avgTfidf: number;
    avgContextScore: number;
  }>;
  topKeywords: SimilarityMatch[];
  topWords: WordFrequency[];
  summary: string;
  overallRiskScore: number;
} {
  // Group matches by category
  const categoryStats = new Map<string, {
    count: number;
    totalScore: number;
    totalTfidf: number;
    totalContext: number;
    priority: number;
  }>();

  for (const match of matches) {
    const existing = categoryStats.get(match.category) || {
      count: 0,
      totalScore: 0,
      totalTfidf: 0,
      totalContext: 0,
      priority: match.priority,
    };
    categoryStats.set(match.category, {
      count: existing.count + 1,
      totalScore: existing.totalScore + match.score,
      totalTfidf: existing.totalTfidf + match.tfidfScore,
      totalContext: existing.totalContext + match.contextScore,
      priority: match.priority,
    });
  }

  const topCategories = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({
      category,
      matchCount: stats.count,
      avgScore: stats.totalScore / stats.count,
      avgTfidf: stats.totalTfidf / stats.count,
      avgContextScore: stats.totalContext / stats.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  // Calculate overall risk score (0-100, higher = more risky)
  let overallRiskScore = 0;
  for (const [category, stats] of categoryStats) {
    const categoryWeight = stats.priority / 10; // Normalize to 0-1
    const categoryRisk = (stats.totalScore / stats.count) * categoryWeight * 10;
    overallRiskScore += categoryRisk;
  }
  overallRiskScore = Math.min(100, overallRiskScore);

  // Get top keywords
  const topKeywords = matches.slice(0, 15);

  // Get top words by TF-IDF
  const topWords = wordFrequencies.slice(0, 25);

  // Generate summary
  let summary = `Analyzed content with ${matches.length} keyword matches across ${topCategories.length} categories. `;
  summary += `Overall risk score: ${overallRiskScore.toFixed(1)}/100. `;

  if (topCategories.length > 0) {
    summary += `Primary concern: ${topCategories[0].category} (${topCategories[0].matchCount} matches, avg score: ${topCategories[0].avgScore.toFixed(2)}). `;
  }

  if (topKeywords.length > 0) {
    summary += `Top match: "${topKeywords[0].keyword}" with score ${topKeywords[0].score.toFixed(2)}.`;
  }

  return {
    topCategories,
    topKeywords,
    topWords,
    summary,
    overallRiskScore,
  };
}

/**
 * Clear cached data (useful for testing)
 */
export function clearCache(): void {
  cachedCategoryKeywords = null;
  globalIdfMap.clear();
}
