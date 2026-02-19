// ============================================================================
// Text Block Preprocessor
// Segments page content into 4 blocks for independent scoring:
//   1. Main content (body text, articles, descriptions)
//   2. Creator metadata (author info, channel names, bios)
//   3. Sponsor metadata (affiliate links, sponsored content, ads)
//   4. Link context (anchor text, outbound link descriptions)
// ============================================================================

export interface TextBlock {
  type: 'main' | 'creator' | 'sponsor' | 'link';
  text: string;
  weight: number; // 0-1, importance weight for scoring
}

export interface PreprocessedText {
  blocks: TextBlock[];
  fullText: string;
  wordCount: number;
}

// Patterns to identify sponsor/affiliate content
const SPONSOR_PATTERNS = [
  /\bsponsored\s+by\b/i,
  /\b#ad\b/i,
  /\b#sponsored\b/i,
  /\baffiliate\s+link/i,
  /\bpaid\s+partnership/i,
  /\bpromo\s+code/i,
  /\bdiscount\s+code/i,
  /\buse\s+code\b/i,
  /\bcourtesy\s+of\b/i,
  /\bin\s+collaboration\s+with\b/i,
  /\bpartner(ed)?\s+with\b/i,
];

// Patterns for creator metadata
const CREATOR_PATTERNS = [
  /\b(uploaded|posted|published|written)\s+by\b/i,
  /\b(author|creator|channel|by)\s*:\s*/i,
  /\b(subscribe|follow|like)\s+(for|to|my|this)\b/i,
  /\b(my\s+channel|my\s+page|my\s+blog)\b/i,
  /\babout\s+(the\s+)?(author|creator|channel)\b/i,
];

// Patterns for link context
const LINK_PATTERNS = [
  /\b(click\s+here|learn\s+more|read\s+more|visit|see\s+more)\b/i,
  /\b(external\s+link|related\s+link|source|reference)\b/i,
  /https?:\/\/\S+/gi,
];

/**
 * Segment raw page text + metadata into weighted text blocks.
 */
export function preprocessText(
  textContent: string,
  title: string = '',
  description: string = '',
  keywords: string[] = [],
  anchorTexts: string[] = []
): PreprocessedText {
  const blocks: TextBlock[] = [];
  const fullText = `${title} ${description} ${keywords.join(' ')} ${textContent}`;
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  // Split content into paragraphs/sections
  const paragraphs = textContent.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim().length > 10);

  const mainParts: string[] = [];
  const sponsorParts: string[] = [];
  const creatorParts: string[] = [];
  const linkParts: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();

    // Check if paragraph matches sponsor patterns
    if (SPONSOR_PATTERNS.some(p => p.test(trimmed))) {
      sponsorParts.push(trimmed);
      continue;
    }

    // Check if paragraph matches creator patterns
    if (CREATOR_PATTERNS.some(p => p.test(trimmed))) {
      creatorParts.push(trimmed);
      continue;
    }

    // Check if paragraph is mostly link context
    if (LINK_PATTERNS.some(p => p.test(trimmed)) && trimmed.length < 200) {
      linkParts.push(trimmed);
      continue;
    }

    // Default: main content
    mainParts.push(trimmed);
  }

  // Add anchor texts to link context
  if (anchorTexts.length > 0) {
    linkParts.push(...anchorTexts.filter(t => t.trim().length > 2));
  }

  // Build blocks with weights
  // Main content: highest weight (title + description + body)
  const mainText = [title, description, keywords.join(', '), ...mainParts]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (mainText) {
    blocks.push({ type: 'main', text: mainText, weight: 1.0 });
  }

  // Creator metadata: moderate weight
  if (creatorParts.length > 0) {
    blocks.push({ type: 'creator', text: creatorParts.join(' '), weight: 0.6 });
  }

  // Sponsor metadata: elevated weight (sponsors in unsafe categories → risk escalation)
  if (sponsorParts.length > 0) {
    blocks.push({ type: 'sponsor', text: sponsorParts.join(' '), weight: 0.8 });
  }

  // Link context: moderate weight
  if (linkParts.length > 0) {
    blocks.push({ type: 'link', text: linkParts.join(' '), weight: 0.5 });
  }

  // If no blocks were created, use the full text as main
  if (blocks.length === 0 && fullText.trim()) {
    blocks.push({ type: 'main', text: fullText.trim(), weight: 1.0 });
  }

  return { blocks, fullText, wordCount };
}

/**
 * Get the combined text from all blocks (weighted by importance).
 * Useful for single-pass analysis that still benefits from segmentation.
 */
export function getCombinedWeightedText(preprocessed: PreprocessedText): string {
  return preprocessed.blocks
    .sort((a, b) => b.weight - a.weight)
    .map(b => b.text)
    .join(' ');
}
