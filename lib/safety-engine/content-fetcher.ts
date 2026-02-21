// ============================================================================
// Content Fetching & Search Utilities
// Extracted from app/api/scan-url/route.ts
// ============================================================================

import * as cheerio from 'cheerio';
import type {
  GoogleSearchResult,
  GoogleSearchResponse,
  GoogleImageSearchResponse,
  SearchAnalysisData,
  SerpApiResponse,
} from './types';
import { analyzeChildSafetyFast } from './age-scoring';
import { analyzeImagesWithVisionFast, analyzeTextFast, getLanguageClient, getVisionClient } from './cloud-apis';
import { analyzeMultimediaFast } from './html-parser';

// ============================================================================
// Google Custom Search Configuration
// ============================================================================

const GOOGLE_CUSTOM_SEARCH_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const GOOGLE_CUSTOM_SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

function isGoogleSearchConfigured(): boolean {
  return !!(GOOGLE_CUSTOM_SEARCH_API_KEY && GOOGLE_CUSTOM_SEARCH_ENGINE_ID);
}

// ============================================================================
// Google Custom Search API
// ============================================================================

export async function googleCustomSearch(query: string, numResults: number = 10): Promise<GoogleSearchResult[]> {
  if (!isGoogleSearchConfigured()) {
    return [];
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${Math.min(numResults, 10)}&safe=off`;

    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return [];
    }

    const data: GoogleSearchResponse = await response.json();
    if (data.error) {
      return [];
    }

    return data.items || [];
  } catch {
    return [];
  }
}

export async function googleImageSearch(query: string, numResults: number = 10): Promise<string[]> {
  if (!isGoogleSearchConfigured()) {
    return [];
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=${Math.min(numResults, 10)}&safe=off`;

    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return [];
    }

    const data: GoogleImageSearchResponse = await response.json();
    if (data.error) {
      return [];
    }

    return data.items?.map(item => item.link).filter(Boolean) || [];
  } catch {
    return [];
  }
}

// ============================================================================
// Keyword Search with Google
// ============================================================================

export async function searchKeywordWithGoogle(keyword: string): Promise<{
  searchResults: { title: string; snippet: string; link: string }[];
  imageUrls: string[];
  combinedText: string;
  siteName: string;
  siteDescription: string;
  usedGoogleSearch: boolean;
}> {
  const keywordLower = keyword.toLowerCase();

  const dangerousPatterns = [
    { pattern: /porn|xxx|nsfw|adult\s*content|explicit/i, category: 'explicit', severity: 'critical' },
    { pattern: /nude|naked|sex|erotic|fetish/i, category: 'explicit', severity: 'high' },
    { pattern: /gore|blood|violent|murder|kill|torture|brutal/i, category: 'violence', severity: 'high' },
    { pattern: /drug|cocaine|heroin|meth|weed|marijuana|cannabis|opioid/i, category: 'substances', severity: 'high' },
    { pattern: /gambling|casino|betting|poker|slots/i, category: 'gambling', severity: 'high' },
    { pattern: /suicide|self.?harm|cutting|overdose/i, category: 'self-harm', severity: 'critical' },
    { pattern: /hate|racist|nazi|supremacist|extremist/i, category: 'hate', severity: 'high' },
    { pattern: /predator|grooming|pedophil|trafficking/i, category: 'predatory', severity: 'critical' },
    { pattern: /weapon|gun|bomb|explosive|firearm/i, category: 'weapons', severity: 'medium' },
    { pattern: /alcohol|beer|wine|vodka|whiskey|drunk/i, category: 'alcohol', severity: 'medium' },
  ];

  const safePatterns = [
    { pattern: /education|learn|school|study|tutorial|lesson/i, category: 'educational' },
    { pattern: /kids|children|family|parents|child.?friendly/i, category: 'family-friendly' },
    { pattern: /science|math|history|geography|reading/i, category: 'educational' },
    { pattern: /cartoon|animation|disney|pixar|nickelodeon/i, category: 'entertainment' },
    { pattern: /nature|animals|wildlife|environment/i, category: 'nature' },
    { pattern: /safe|appropriate|wholesome|pbs|sesame/i, category: 'safe-content' },
    { pattern: /news|article|blog|review|guide/i, category: 'informational' },
    { pattern: /game|play|fun|entertainment|hobby/i, category: 'entertainment' },
  ];

  const foundDangerous: string[] = [];
  for (const { pattern, category } of dangerousPatterns) {
    if (pattern.test(keywordLower)) {
      foundDangerous.push(category);
    }
  }

  const foundSafe: string[] = [];
  for (const { pattern, category } of safePatterns) {
    if (pattern.test(keywordLower)) {
      foundSafe.push(category);
    }
  }

  if (!isGoogleSearchConfigured()) {
    let combinedText = `${keyword}`;
    let siteDescription = '';

    if (foundDangerous.length > 0) {
      combinedText += ` ${foundDangerous.join(' ')} content detected`;
      siteDescription = `Keyword "${keyword}" may relate to ${foundDangerous.join(', ')} content. Parental review recommended.`;
    } else if (foundSafe.length > 0) {
      combinedText += ` ${foundSafe.join(' ')} content`;
      siteDescription = `Keyword "${keyword}" appears to relate to ${foundSafe.join(', ')} content.`;
    } else {
      siteDescription = `Keyword "${keyword}" analyzed using pattern matching. Configure Google Custom Search API for enhanced analysis.`;
    }

    return {
      searchResults: [],
      imageUrls: [],
      combinedText,
      siteName: `Keyword Analysis: ${keyword}`,
      siteDescription,
      usedGoogleSearch: false,
    };
  }

  try {
    const [textResults, imageUrls] = await Promise.all([
      googleCustomSearch(keyword, 10),
      googleImageSearch(keyword, 5),
    ]);

    if (textResults.length === 0 && imageUrls.length === 0) {
      let combinedText = `${keyword}`;
      let siteDescription = '';

      if (foundDangerous.length > 0) {
        combinedText += ` ${foundDangerous.join(' ')} content detected`;
        siteDescription = `Keyword "${keyword}" may relate to ${foundDangerous.join(', ')} content. Parental review recommended.`;
      } else if (foundSafe.length > 0) {
        combinedText += ` ${foundSafe.join(' ')} content`;
        siteDescription = `Keyword "${keyword}" appears to relate to ${foundSafe.join(', ')} content.`;
      } else {
        siteDescription = `Keyword "${keyword}" analyzed. No specific safety concerns detected from keyword alone.`;
      }

      return {
        searchResults: [],
        imageUrls: [],
        combinedText,
        siteName: `Keyword Analysis: ${keyword}`,
        siteDescription,
        usedGoogleSearch: false,
      };
    }

    const searchResults = textResults.map(result => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
    }));

    let combinedText = keyword + ' ';
    combinedText += textResults.map(r => `${r.title} ${r.snippet}`).join(' ');

    const additionalImages: string[] = [];
    textResults.forEach(result => {
      if (result.pagemap?.cse_image?.[0]?.src) {
        additionalImages.push(result.pagemap.cse_image[0].src);
      }
      if (result.pagemap?.cse_thumbnail?.[0]?.src) {
        additionalImages.push(result.pagemap.cse_thumbnail[0].src);
      }
    });

    const allImageUrls = [...new Set([...imageUrls, ...additionalImages])].slice(0, 10);

    let siteDescription = `Found ${textResults.length} articles and ${allImageUrls.length} images related to "${keyword}".`;

    if (foundDangerous.length > 0) {
      siteDescription += ` Warning: Keyword matches ${foundDangerous.join(', ')} patterns.`;
    } else if (foundSafe.length > 0) {
      siteDescription += ` Content appears related to ${foundSafe.join(', ')}.`;
    }

    return {
      searchResults,
      imageUrls: allImageUrls,
      combinedText: combinedText.slice(0, 15000),
      siteName: `Search Results: ${keyword}`,
      siteDescription,
      usedGoogleSearch: true,
    };

  } catch {
    let combinedText = `${keyword}`;
    let siteDescription = '';

    if (foundDangerous.length > 0) {
      combinedText += ` ${foundDangerous.join(' ')} content detected`;
      siteDescription = `Keyword "${keyword}" may relate to ${foundDangerous.join(', ')} content. Parental review recommended.`;
    } else if (foundSafe.length > 0) {
      combinedText += ` ${foundSafe.join(' ')} content`;
      siteDescription = `Keyword "${keyword}" appears to relate to ${foundSafe.join(', ')} content.`;
    } else {
      siteDescription = `Keyword "${keyword}" analyzed using pattern matching (Google Search unavailable).`;
    }

    return {
      searchResults: [],
      imageUrls: [],
      combinedText,
      siteName: `Keyword Analysis: ${keyword}`,
      siteDescription,
      usedGoogleSearch: false,
    };
  }
}

// ============================================================================
// Fast Content Fetching
// ============================================================================

export async function fetchWebpageContentFast(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
}

// ============================================================================
// Search Fallback - When direct fetch fails
// ============================================================================

export async function searchForUrlInfo(targetUrl: string, isKeywordSearch: boolean = false): Promise<SearchAnalysisData> {
  // Keyword search: use Google Custom Search
  if (isKeywordSearch) {
    const googleResult = await searchKeywordWithGoogle(targetUrl);

    if (googleResult.usedGoogleSearch || googleResult.combinedText.length > targetUrl.length + 10) {
      return {
        searchResults: googleResult.searchResults,
        imageUrls: googleResult.imageUrls.slice(0, 5),
        combinedText: googleResult.combinedText.slice(0, 10000),
        siteName: googleResult.siteName,
        siteDescription: googleResult.siteDescription,
      };
    }
  }

  const searchResults: { title: string; snippet: string; link: string }[] = [];
  const imageUrls: string[] = [];
  let combinedText = '';
  let siteName = '';
  let siteDescription = '';
  let keywordFallbackName = '';
  let keywordFallbackDescription = '';

  let searchTerm: string;
  if (isKeywordSearch) {
    searchTerm = targetUrl;
    keywordFallbackName = `Keyword Analysis: ${searchTerm}`;
    keywordFallbackDescription = `Analysis of keyword "${searchTerm}" using available search methods.`;
  } else {
    try {
      const urlObj = new URL(targetUrl);
      searchTerm = urlObj.hostname.replace('www.', '');
    } catch {
      searchTerm = targetUrl;
    }
  }

  // Try SerpAPI
  const serpApiKey = process.env.SERPAPI_API_KEY;
  const serpApiEngines = isKeywordSearch ? ['google', 'bing'] : ['google'];
  const seenResultLinks = new Set<string>();

  if (serpApiKey) {
    for (const engine of serpApiEngines) {
      try {
        const serpQuery = encodeURIComponent(searchTerm);
        const serpUrl = `https://serpapi.com/search.json?engine=${engine}&q=${serpQuery}&api_key=${serpApiKey}`;
        const serpResponse = await fetch(serpUrl, { signal: AbortSignal.timeout(8000) });
        if (!serpResponse.ok) continue;

        const serpJson = (await serpResponse.json()) as SerpApiResponse;
        serpJson.organic_results?.slice(0, 10).forEach(result => {
          const link = result.link || '';
          const dedupeKey = link || result.title || '';
          if (result.title && result.snippet && !seenResultLinks.has(dedupeKey)) {
            searchResults.push({ title: result.title, snippet: result.snippet, link });
            seenResultLinks.add(dedupeKey);
            combinedText += ` ${result.title} ${result.snippet}`;
          }
        });
        if (!siteName && serpJson.knowledge_graph?.title) siteName = serpJson.knowledge_graph.title;
        if (!siteDescription && serpJson.knowledge_graph?.description) siteDescription = serpJson.knowledge_graph.description;
      } catch { /* continue */ }
    }

    // SerpAPI image search
    try {
      const serpQuery = encodeURIComponent(searchTerm);
      const serpImageUrl = `https://serpapi.com/search.json?engine=google_images&q=${serpQuery}&api_key=${serpApiKey}`;
      const serpImageResponse = await fetch(serpImageUrl, { signal: AbortSignal.timeout(8000) });
      if (serpImageResponse.ok) {
        const serpImageJson = (await serpImageResponse.json()) as SerpApiResponse;
        serpImageJson.images_results?.slice(0, 5).forEach(result => {
          const src = result.original || result.link;
          if (src && src.startsWith('http')) imageUrls.push(src);
        });
      }
    } catch { /* continue */ }
  }

  const hasSerpData = searchResults.length > 0 || imageUrls.length > 0 || Boolean(siteName || siteDescription);

  if (!hasSerpData) {
    // DuckDuckGo fallback
    try {
      const searchQuery = encodeURIComponent(`${searchTerm} site review safety`);
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${searchQuery}`;

      const response = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);

        const pageText = $('body').text().toLowerCase();
        if (!pageText.includes('captcha') && !pageText.includes('blocked') && !pageText.includes('unusual traffic')) {
          const selectors = ['.result', '.web-result', '.results_links', '[data-testid="result"]', '.result__body'];

          for (const selector of selectors) {
            $(selector).slice(0, 10).each((_, el) => {
              const title = $(el).find('.result__title, .result__a, a, h2, h3').first().text().trim();
              const snippet = $(el).find('.result__snippet, .result__body, p, .snippet').first().text().trim();
              const link = $(el).find('a').first().attr('href') || '';

              if (title && snippet && title.length > 3) {
                searchResults.push({ title, snippet, link });
                combinedText += ` ${title} ${snippet}`;
              }
            });

            if (searchResults.length > 0) break;
          }
        }
      }
    } catch { /* continue */ }

    // Bing Images fallback
    try {
      const searchQuery = encodeURIComponent(`${searchTerm}`);
      const bingImageUrl = `https://www.bing.com/images/search?q=${searchQuery}&first=1`;

      const imgResponse = await fetch(bingImageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);

      if (imgResponse?.ok) {
        const imgHtml = await imgResponse.text();
        const $img = cheerio.load(imgHtml);

        $img('img.mimg, .imgpt img, a.iusc').slice(0, 5).each((_, el) => {
          const src = $img(el).attr('src') || $img(el).attr('data-src') || '';
          if (src && src.startsWith('http') && !src.includes('bing.com/th')) {
            imageUrls.push(src);
          }
        });

        $img('a.iusc').slice(0, 5).each((_, el) => {
          try {
            const m = $img(el).attr('m');
            if (m) {
              const data = JSON.parse(m);
              if (data.murl) imageUrls.push(data.murl);
            }
          } catch { /* ignore */ }
        });
      }
    } catch { /* continue */ }
  }

  // Review sites fallback (only for URL searches)
  if (!isKeywordSearch) {
    const reviewSites = [
      `https://www.trustpilot.com/review/${searchTerm}`,
      `https://www.sitejabber.com/reviews/${searchTerm}`,
    ];

    for (const reviewUrl of reviewSites) {
      try {
        const reviewResp = await fetch(reviewUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
          signal: AbortSignal.timeout(3000),
        });

        if (reviewResp.ok) {
          const reviewHtml = await reviewResp.text();
          const $review = cheerio.load(reviewHtml);

          const reviewText = $review('meta[name="description"]').attr('content') || '';
          if (reviewText) {
            combinedText += ` ${reviewText}`;
            siteDescription = reviewText.slice(0, 500);
          }

          siteName = $review('title').text() || searchTerm;
          break;
        }
      } catch { /* continue */ }
    }
  }

  if (!siteName) siteName = keywordFallbackName || searchTerm;
  if (!siteDescription) {
    siteDescription = keywordFallbackDescription || combinedText.slice(0, 500) || `Analysis based on available data for ${searchTerm}`;
  }

  return {
    searchResults,
    imageUrls: [...new Set(imageUrls)].slice(0, 5),
    combinedText: combinedText.slice(0, 10000),
    siteName,
    siteDescription,
  };
}

// ============================================================================
// Analyze From Search Results
// ============================================================================

export async function analyzeFromSearchResults(
  url: string,
  searchData: SearchAnalysisData,
  trackStep: (name: string, details?: string) => void
): Promise<{
  childSafetyAnalysis: ReturnType<typeof analyzeChildSafetyFast>;
  visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null;
  nlpResults: { sentiment: string; entities: string[] } | null;
  parsed: {
    title: string;
    description: string;
    keywords: string[];
    textContent: string;
    imageUrls: string[];
    imageCount: number;
    linkCount: number;
    videoCount: number;
    audioCount: number;
    multimedia: ReturnType<typeof analyzeMultimediaFast>;
  };
}> {
  const childSafetyAnalysis = analyzeChildSafetyFast(
    searchData.combinedText,
    searchData.siteName,
    searchData.siteDescription,
    []
  );
  trackStep('Search Analysis', `${childSafetyAnalysis.unsafeKeywordsFound.length} risks from search data`);

  let visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null = null;
  if (getVisionClient() && searchData.imageUrls.length > 0) {
    visionResults = await analyzeImagesWithVisionFast(searchData.imageUrls).catch(() => null);
    trackStep('Vision Analysis', `Analyzed ${searchData.imageUrls.length} images from search`);
  }

  let nlpResults: { sentiment: string; entities: string[] } | null = null;
  if (getLanguageClient() && searchData.combinedText) {
    nlpResults = await analyzeTextFast(searchData.combinedText).catch(() => null);
    trackStep('NLP Analysis', nlpResults ? 'Sentiment analyzed' : 'Skipped');
  }

  return {
    childSafetyAnalysis,
    visionResults,
    nlpResults,
    parsed: {
      title: searchData.siteName,
      description: searchData.siteDescription,
      keywords: [],
      textContent: searchData.combinedText,
      imageUrls: searchData.imageUrls,
      imageCount: searchData.imageUrls.length,
      linkCount: searchData.searchResults.length,
      videoCount: 0,
      audioCount: 0,
      multimedia: {
        videoDetected: false,
        audioDetected: false,
        mediaTypes: [],
        mediaSafetyScore: 100,
        mediaConcerns: [],
      },
    },
  };
}
