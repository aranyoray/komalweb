import fs from 'fs';
import path from 'path';

export interface CategoryRule {
  category: string;
  rules: {
    '<10': string;
    '10-13': string;
    '13-16': string;
    '16-18': string;
  };
}

/**
 * Parse CSV file and convert to category rules
 */
export function loadContentRulesFromCSV(): CategoryRule[] {
  try {
    const csvPath = path.join(process.cwd(), 'Models_Masterdoc.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.warn('CSV file has insufficient lines, using default rules');
      return getDefaultRules();
    }

    // Skip header row
    const rules: CategoryRule[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing - split by comma, but handle quoted values
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
      // Add the last value
      if (current || values.length > 0) {
        values.push(current.trim());
      }

      // Expect: Category, Rules <10, Rules 10-13, Rules 13-16, Rules 16-18
      // Data format: "1. Violence & Disturbing Content,Block/Gate,Block/Gate,Block/Gate,Gate"
      if (values.length >= 2) {
        const category = values[0].trim();
        // Skip header row
        if (category && !category.startsWith('Category') && category !== 'Category') {
          rules.push({
            category,
            rules: {
              '<10': values[1]?.trim() || '',
              '10-13': values[2]?.trim() || '',
              '13-16': values[3]?.trim() || '',
              '16-18': values[4]?.trim() || '',
            },
          });
        }
      }
    }

    if (rules.length === 0) {
      console.warn('No rules parsed from CSV, using default rules');
      return getDefaultRules();
    }

    return rules;
  } catch (error) {
    console.error('Error loading content rules from CSV:', error);
    // Return default rules if CSV can't be loaded
    return getDefaultRules();
  }
}

/**
 * Get default rules if CSV loading fails
 */
function getDefaultRules(): CategoryRule[] {
  return [
    {
      category: '1. Violence & Disturbing Content',
      rules: { '<10': 'Block/Gate', '10-13': 'Block/Gate', '13-16': 'Block/Gate', '16-18': 'Gate' },
    },
    {
      category: '2. Explicit & Body-Related Content',
      rules: { '<10': 'Block', '10-13': 'Block', '13-16': 'Block', '16-18': 'Block' },
    },
    {
      category: '3. Substances & Addictive Behavior',
      rules: { '<10': 'Block', '10-13': 'Gate/Allow', '13-16': 'Gate', '16-18': 'Allow' },
    },
    {
      category: '4. Financial & Commercial Content',
      rules: { '<10': 'Block', '10-13': 'Block', '13-16': 'Gate', '16-18': 'Block/Gate' },
    },
    {
      category: '5. Media & Platform-Native Risks',
      rules: { '<10': 'Block', '10-13': 'Gate', '13-16': 'Gate', '16-18': 'Allow' },
    },
    {
      category: '6. Social & Cultural Topics',
      rules: { '<10': 'Block', '10-13': 'Block', '13-16': 'Gate', '16-18': 'Gate' },
    },
  ];
}

/**
 * Parse action string (e.g., "Block/Gate") to determine worst case action
 */
export function parseAction(actionStr: string): 'BLOCK' | 'GATE' | 'ALLOW' {
  if (!actionStr) return 'ALLOW';
  
  const upper = actionStr.toUpperCase();
  if (upper.includes('BLOCK')) return 'BLOCK';
  if (upper.includes('GATE')) return 'GATE';
  if (upper.includes('ALLOW')) return 'ALLOW';
  
  return 'ALLOW';
}

/**
 * Map detected content to granular categories from CSV
 */
export function mapToGranularCategories(
  detectedCategories: { [key: string]: { detected: boolean; confidence: number } },
  contentRules: CategoryRule[]
): {
  [category: string]: {
    detected: boolean;
    confidence: number;
    matchedRule?: CategoryRule;
  };
} {
  const granularCategories: {
    [category: string]: {
      detected: boolean;
      confidence: number;
      matchedRule?: CategoryRule;
    };
  } = {};

  // Map existing categories to granular CSV categories
  const categoryMapping: { [key: string]: string[] } = {
    'Graphic Violence': ['1. Violence & Disturbing Content'],
    'Non-Graphic Violence': ['1. Violence & Disturbing Content'],
    'Heavy Fighting (Sports)': ['1. Violence & Disturbing Content'],
    'Horror/Jumpscares': ['1. Violence & Disturbing Content'],
    'Crime Footage': ['1. Violence & Disturbing Content'],
    'Explicit Content': ['2. Explicit & Body-Related Content'],
    'Substance Use': ['3. Substances & Addictive Behavior'],
    'Financial & Commercial Content': ['4. Financial & Commercial Content'],
    'Media & Platform-Native Risks': ['5. Media & Platform-Native Risks'],
    'Social & Cultural Topics': ['6. Social & Cultural Topics'],
    'Strong Language': ['5. Media & Platform-Native Risks', '6. Social & Cultural Topics'],
    'Mild Language': ['5. Media & Platform-Native Risks', '6. Social & Cultural Topics'],
    'Educational Content': [], // No restrictions
  };

  // Process detected categories
  for (const [category, data] of Object.entries(detectedCategories)) {
    if (data.detected) {
      const mappedCategories = categoryMapping[category] || [];
      
      for (const granularCategory of mappedCategories) {
        const rule = contentRules.find((r) => r.category === granularCategory);
        
        if (rule) {
          if (!granularCategories[granularCategory]) {
            granularCategories[granularCategory] = {
              detected: true,
              confidence: data.confidence,
              matchedRule: rule,
            };
          } else {
            // Take highest confidence
            granularCategories[granularCategory].confidence = Math.max(
              granularCategories[granularCategory].confidence,
              data.confidence
            );
          }
        }
      }
    }
  }

  // Also check for financial/commercial content
  // This would need to be detected in the analysis
  // For now, we'll add it if certain keywords are found

  return granularCategories;
}
