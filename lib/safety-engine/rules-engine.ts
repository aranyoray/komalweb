// ============================================================================
// CSV Rules Engine
// Loads Models_Masterdoc_Test.csv at startup and exposes rule lookups
// ============================================================================

import fs from 'fs';
import path from 'path';
import type { CsvRule, AgeAction } from './types';

let cachedRules: CsvRule[] | null = null;

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

function parseAgeAction(value: string): AgeAction {
  const v = value.trim().toUpperCase();
  if (v.startsWith('BLOCK')) return 'BLOCK';
  if (v.startsWith('GATE')) return 'GATE';
  return 'ALLOW';
}

/**
 * Load rules from the CSV file. Results are cached after first load.
 */
export function loadRules(): CsvRule[] {
  if (cachedRules) return cachedRules;

  try {
    const csvPath = path.join(process.cwd(), 'Models_Masterdoc_Test.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      console.warn('[RulesEngine] CSV file has insufficient lines');
      return [];
    }

    const rules: CsvRule[] = [];

    // Skip header (line 0)
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);

      // Column mapping based on CSV header:
      // 0: Category
      // 1: Tokenized_category_keywords_total
      // 2: Tokenized_category_keywords_contextual
      // 3: Subcategory
      // 4: Tokenized_subcategory_keywords_total
      // 5: Tokenized_subcategory_keywords_context
      // 6: NLP_category_check
      // 7: NLP_subcategory_check
      // 8: Schema
      // 9: rules_below_10
      // 10: rules_10_13
      // 11: rules_13_16
      // 12: rules_16_18
      // 13: Dataset_Links
      // 14: Vision_AI
      // 15: Audio

      const majorCategory = (values[0] || '').trim();
      const subcategory = (values[3] || '').trim();

      // Skip empty rows or header rows
      if (!majorCategory && !subcategory) continue;
      if (majorCategory === 'Category') continue;

      // Parse keywords
      const categoryKeywordsRaw = (values[1] || '').replace(/^"|"$/g, '');
      const subcategoryKeywordsRaw = (values[4] || '').replace(/^"|"$/g, '');

      const keywords = subcategoryKeywordsRaw
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);

      const contextualKeywords = (values[5] || '').replace(/^"|"$/g, '')
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);

      // Parse age actions
      const below10 = parseAgeAction(values[9] || 'ALLOW');
      const age10_13 = parseAgeAction(values[10] || 'ALLOW');
      const age13_16 = parseAgeAction(values[11] || 'ALLOW');
      const age16_18 = parseAgeAction(values[12] || 'ALLOW');

      if (subcategory) {
        rules.push({
          majorCategory: majorCategory || rules[rules.length - 1]?.majorCategory || '',
          subcategory,
          keywords,
          contextualKeywords,
          nlpCategoryCheck: (values[6] || '').trim(),
          nlpSubcategoryCheck: (values[7] || '').trim(),
          schema: (values[8] || '').trim(),
          ageActions: {
            '<10': below10,
            '10-13': age10_13,
            '13-16': age13_16,
            '16+': age16_18,
          },
          visionDescription: (values[14] || '').trim(),
          audioDescription: (values[15] || '').trim(),
        });
      }
    }

    cachedRules = rules;
    console.log(`[RulesEngine] Loaded ${rules.length} rules from CSV`);
    return rules;
  } catch (error) {
    console.error('[RulesEngine] Error loading CSV:', error);
    return [];
  }
}

/**
 * Get rules matching a major category and/or subcategory
 */
export function getRulesForCategory(category?: string, subcategory?: string): CsvRule[] {
  const rules = loadRules();

  return rules.filter(rule => {
    if (category && !rule.majorCategory.toLowerCase().includes(category.toLowerCase())) return false;
    if (subcategory && !rule.subcategory.toLowerCase().includes(subcategory.toLowerCase())) return false;
    return true;
  });
}

/**
 * Get all unique major categories
 */
export function getMajorCategories(): string[] {
  const rules = loadRules();
  return [...new Set(rules.map(r => r.majorCategory).filter(Boolean))];
}

/**
 * Get subcategories for a major category
 */
export function getSubcategories(majorCategory: string): string[] {
  const rules = loadRules();
  return rules
    .filter(r => r.majorCategory === majorCategory)
    .map(r => r.subcategory)
    .filter(Boolean);
}

/**
 * Clear cached rules (useful for testing / hot reload)
 */
export function clearRulesCache(): void {
  cachedRules = null;
}
