// ============================================================================
// Pipeline Orchestrator
// Central orchestration: fetch -> parse -> NLP -> Vision -> Python -> score -> report
// ============================================================================

import { AGE_GROUPS } from './types';
import type { AgeGroup, ScanResult, SafetyReport, ChildSafetyAnalysis } from './types';
import { isDangerousSite, isSocialMediaSite } from './domain-lists';
import { initializeClients, getVisionClient, getLanguageClient, analyzeImagesWithVisionFast, analyzeTextFast, getLikelihoodScore } from './cloud-apis';
import { analyzeChildSafetyFast, calculateAgeGroupScores, detectTopics, CHILD_SAFETY_RISKS } from './age-scoring';
import { parseHTMLContentFast } from './html-parser';
import { fetchWebpageContentFast, searchForUrlInfo, analyzeFromSearchResults } from './content-fetcher';
import { runPythonAnalysis, mapPythonCategory } from './python-bridge';
import { checkParentControls } from './parent-controls';
import { preprocessText } from './text-preprocessor';
import { scoreCategories } from './category-scorer';
import { classifyImages } from './vision-classifier';
import { extractAudioSources, analyzeAudio } from './audio-analyzer';
import { detectSponsors } from './sponsor-detector';
import { escalateRisk } from './risk-escalator';
import { shouldTriggerCloudFallback, runCloudFallback } from './cloud-fallback';
import { mergeSignals } from './signal-merger';
import { scoreRevealingContent } from './revealing-scorer';

// ============================================================================
// URL Validation
// ============================================================================

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// ============================================================================
// Performance Tracking Helper
// ============================================================================

function createPerformanceTracker() {
  const startTime = Date.now();
  let lastStepTime = startTime;
  const steps: { name: string; durationMs: number; details?: string }[] = [];

  return {
    trackStep(name: string, details?: string) {
      const now = Date.now();
      steps.push({ name, durationMs: now - lastStepTime, details });
      lastStepTime = now;
    },
    getSteps() { return steps; },
    getTotalTime() { return Date.now() - startTime; },
  };
}

// ============================================================================
// Inject Python Analysis Results
// ============================================================================

function injectPythonResults(
  childSafetyAnalysis: ChildSafetyAnalysis,
  pythonResult: any,
  tracker: ReturnType<typeof createPerformanceTracker>
): any {
  let pythonDebug = pythonResult?._debug || null;

  if (pythonResult?.final_decision) {
    const decision = pythonResult.final_decision.decision;
    const weightedScore = pythonResult.final_decision.weighted_score;
    tracker.trackStep('Python Hybrid', `Decision: ${decision}, Score: ${weightedScore}`);

    if (decision === 'FLAG' || decision === 'REVIEW_QUEUE' || weightedScore >= 0.7) {
      const pythonCategory = (pythonResult.csv_analysis?.primary_category ||
        pythonResult.vector_analysis?.semantic_category ||
        'dangerous').toLowerCase();

      const mappedCategory = mapPythonCategory(pythonCategory);

      childSafetyAnalysis.unsafeKeywordsFound.push({
        category: mappedCategory,
        keyword: `[Hybrid] ${pythonResult.csv_analysis?.matched_keywords?.[0] || 'Semantic Match'}`,
        count: 10,
        context: [pythonResult.final_decision.reasoning || 'Flagged by Hybrid AI Model'],
        contextSafe: false,
        isDangerous: true,
        severity: 1,
        ageMultipliers: { '<10': 1, '10-13': 1, '13-16': 1, '16+': 1 }
      });
    }
  }

  return pythonDebug;
}

// ============================================================================
// Parent Control - Blocked/Allowed Result Builders
// ============================================================================

function buildParentBlockedResult(input: string, reason: string): SafetyReport {
  const blockedScores = {} as SafetyReport['ageGroupScores'];
  const blockedAgeActions = {} as SafetyReport['ageActions'];
  for (const ag of AGE_GROUPS) {
    blockedScores[ag] = { score: 0, action: 'BLOCK', reason, risks: ['Parent-blocked content'] };
    blockedAgeActions[ag] = { action: 'BLOCK', score: 0, reason, risks: ['Parent-blocked content'] };
  }

  return {
    url: input,
    overallsafetyscore: 0,
    languageSafetyScore: 0,
    visualSafetyScore: 0,
    audioSafetyScore: 0,
    ageActions: blockedAgeActions,
    majorCategories: [],
    subcategories: [],
    contextType: '',
    topicTags: ['parent-blocked'],
    flags: { bodyAnxiety: false, selfHarm: false, fraudOrScam: false, extremism: false },
    decisionSource: { nlp: { used: false, confidence: 0 }, vision: { used: false, confidence: 0 }, audio: { used: false, confidence: 0 }, links: { used: false, confidence: 0 }, cloud: { used: false, confidence: 0 } },
    overallScore: 0,
    ageGroupScores: blockedScores,
    contentAnalysis: {
      textAnalysis: { sentiment: 'Blocked', keyTopics: ['Parent Blocked'], languageScore: 0, unsafeKeywordsFound: [], safeKeywordsFound: [] },
      visualAnalysis: { detectedObjects: [], safetyScore: 0, concerns: [reason] },
      multimediaAnalysis: { videoDetected: false, audioDetected: false, mediaTypes: [], mediaSafetyScore: 0, mediaConcerns: [reason] },
      metadata: { title: 'Blocked by Parent Controls', description: reason, keywords: [], imageCount: 0, linkCount: 0, videoCount: 0, audioCount: 0 },
    },
    childSafetyAnalysis: {
      overallRisk: 'dangerous',
      riskCategories: [{ category: 'Parent Controls', severity: 'critical', matchCount: 1, matchedKeywords: ['parent-block'], contextSnippets: [reason] }],
      depthAnalysis: { titleSafe: false, metadataSafe: false, contentSafe: false, mediaSafe: false },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: 'live',
    performanceMetrics: { totalTimeMs: 0, steps: [{ name: 'Parent Controls', durationMs: 0, details: reason }] },
  };
}

function buildParentAllowedResult(input: string, reason: string): SafetyReport {
  const allowedScores = {} as SafetyReport['ageGroupScores'];
  const allowedAgeActions = {} as SafetyReport['ageActions'];
  for (const ag of AGE_GROUPS) {
    allowedScores[ag] = { score: 100, action: 'ALLOW', reason, risks: [] };
    allowedAgeActions[ag] = { action: 'ALLOW', score: 1, reason, risks: [] };
  }

  return {
    url: input,
    overallsafetyscore: 1,
    languageSafetyScore: 1,
    visualSafetyScore: 1,
    audioSafetyScore: 1,
    ageActions: allowedAgeActions,
    majorCategories: [],
    subcategories: [],
    contextType: '',
    topicTags: ['parent-approved'],
    flags: { bodyAnxiety: false, selfHarm: false, fraudOrScam: false, extremism: false },
    decisionSource: { nlp: { used: false, confidence: 0 }, vision: { used: false, confidence: 0 }, audio: { used: false, confidence: 0 }, links: { used: false, confidence: 0 }, cloud: { used: false, confidence: 0 } },
    overallScore: 100,
    ageGroupScores: allowedScores,
    contentAnalysis: {
      textAnalysis: { sentiment: 'Positive', keyTopics: ['Parent Approved'], languageScore: 100, unsafeKeywordsFound: [], safeKeywordsFound: [] },
      visualAnalysis: { detectedObjects: [], safetyScore: 100, concerns: [] },
      multimediaAnalysis: { videoDetected: false, audioDetected: false, mediaTypes: [], mediaSafetyScore: 100, mediaConcerns: [] },
      metadata: { title: 'Approved by Parent Controls', description: reason, keywords: [], imageCount: 0, linkCount: 0, videoCount: 0, audioCount: 0 },
    },
    childSafetyAnalysis: {
      overallRisk: 'safe',
      riskCategories: [],
      depthAnalysis: { titleSafe: true, metadataSafe: true, contentSafe: true, mediaSafe: true },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: 'live',
    performanceMetrics: { totalTimeMs: 0, steps: [{ name: 'Parent Controls', durationMs: 0, details: reason }] },
  };
}

// ============================================================================
// Main URL Analysis
// ============================================================================

export async function analyzeUrl(url: string, userId?: string | null): Promise<SafetyReport> {
  const tracker = createPerformanceTracker();

  console.log(`\n[KOMAL ANALYSIS] Starting scan for: ${url}`);

  // Step 0: Check parent controls FIRST (immediate BLOCK/ALLOW)
  if (userId) {
    const parentResult = await checkParentControls(userId, url);
    if (parentResult.action === 'BLOCK') {
      console.log(`[KOMAL] Parent control BLOCK: ${parentResult.reason}`);
      return buildParentBlockedResult(url, parentResult.reason);
    }
    if (parentResult.action === 'ALLOW') {
      console.log(`[KOMAL] Parent control ALLOW: ${parentResult.reason}`);
      return buildParentAllowedResult(url, parentResult.reason);
    }
    tracker.trackStep('Parent Controls', 'No rules matched, proceeding with analysis');
  }

  tracker.trackStep('Initialize', 'Setting up clients');
  initializeClients();

  let html: string | null = null;
  let fetchFailed = false;
  let useSearchFallback = false;

  // Step 1: Try to fetch HTML directly
  try {
    html = await fetchWebpageContentFast(url);
    tracker.trackStep('Fetch HTML', `${(html.length / 1024).toFixed(1)}KB`);
  } catch (error) {
    fetchFailed = true;
    tracker.trackStep('Fetch HTML', `FAILED - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  let parsed: ReturnType<typeof parseHTMLContentFast> | null = null;
  let childSafetyAnalysis: ChildSafetyAnalysis;
  let nlpResults: { sentiment: string; entities: string[] } | null = null;
  let visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null = null;

  if (html && !fetchFailed) {
    parsed = parseHTMLContentFast(html, url);
    tracker.trackStep('Parse HTML', `${parsed.imageCount} imgs, ${parsed.linkCount} links, ${parsed.videoCount} videos`);

    childSafetyAnalysis = analyzeChildSafetyFast(parsed.textContent, parsed.title, parsed.description, parsed.keywords);
    tracker.trackStep('Keyword Analysis', `${childSafetyAnalysis.unsafeKeywordsFound.length} risks, ${childSafetyAnalysis.filteredByContext} filtered`);

    const hasEnoughContent = parsed.imageUrls.length > 0 || parsed.textContent.length > 500;
    if (!hasEnoughContent) {
      useSearchFallback = true;
    }

    const apiPromises: Promise<void>[] = [];

    if (getLanguageClient() && parsed.textContent) {
      apiPromises.push(
        analyzeTextFast(parsed.textContent)
          .then(r => { nlpResults = r; })
          .catch(() => { })
      );
    }

    if (getVisionClient() && parsed.imageUrls.length > 0) {
      apiPromises.push(
        analyzeImagesWithVisionFast(parsed.imageUrls)
          .then(r => { visionResults = r; })
          .catch(() => { })
      );
    } else if (useSearchFallback) {
      const searchData = await searchForUrlInfo(url, false);
      tracker.trackStep('Search Images', `Found ${searchData.imageUrls.length} images from search`);

      if (getVisionClient() && searchData.imageUrls.length > 0) {
        apiPromises.push(
          analyzeImagesWithVisionFast(searchData.imageUrls)
            .then(r => { visionResults = r; })
            .catch(() => { })
        );
      }

      if (searchData.combinedText) {
        const searchSafetyAnalysis = analyzeChildSafetyFast(searchData.combinedText, '', '', []);
        childSafetyAnalysis.unsafeKeywordsFound.push(...searchSafetyAnalysis.unsafeKeywordsFound);
        childSafetyAnalysis.safeKeywordsFound.push(...searchSafetyAnalysis.safeKeywordsFound);
      }
    }

    if (apiPromises.length > 0) {
      await Promise.all(apiPromises);
      tracker.trackStep('AI APIs', `NLP=${nlpResults ? 'OK' : 'skip'}, Vision=${visionResults ? 'OK' : 'skip'}`);
    }

  } else {
    const searchData = await searchForUrlInfo(url, false);
    tracker.trackStep('Search Fallback', `${searchData.searchResults.length} results, ${searchData.imageUrls.length} images`);

    if (searchData.searchResults.length === 0 && searchData.combinedText.length < 50) {
      throw new Error('ANALYSIS_FAILED');
    }

    const searchAnalysis = await analyzeFromSearchResults(url, searchData, tracker.trackStep);
    childSafetyAnalysis = searchAnalysis.childSafetyAnalysis;
    visionResults = searchAnalysis.visionResults;
    nlpResults = searchAnalysis.nlpResults;
    parsed = searchAnalysis.parsed;
  }

  if (!parsed) {
    const urlObj = new URL(url);
    parsed = {
      title: urlObj.hostname,
      description: '',
      keywords: [],
      textContent: '',
      imageUrls: [],
      imageCount: 0,
      linkCount: 0,
      videoCount: 0,
      audioCount: 0,
      multimedia: { videoDetected: false, audioDetected: false, mediaTypes: [], mediaSafetyScore: 100, mediaConcerns: [] },
    };
    childSafetyAnalysis = analyzeChildSafetyFast(url, '', '', []);
  }

  // Phase 3: Enhanced NLP - Category scoring via TF-IDF + CSV rules
  let categoryScoringResult = null;
  try {
    const preprocessed = preprocessText(
      parsed.textContent || '',
      parsed.title,
      parsed.description,
      parsed.keywords
    );
    categoryScoringResult = scoreCategories(preprocessed);
    tracker.trackStep(
      'Category Scoring',
      `Rule ${categoryScoringResult.ruleApplied}, primary=${categoryScoringResult.primaryCategory?.category || 'none'} (P=${categoryScoringResult.primaryCategory?.probability || 0})`
    );
  } catch (error) {
    tracker.trackStep('Category Scoring', 'FAILED');
    console.error('[Pipeline] Category scoring failed:', error);
  }

  // Python hybrid analysis
  let pythonDebug = null;
  try {
    const pythonResult = await runPythonAnalysis(parsed.textContent || '');
    pythonDebug = injectPythonResults(childSafetyAnalysis, pythonResult, tracker);
  } catch {
    tracker.trackStep('Python Hybrid', 'FAILED');
  }

  // Calculate scores
  const multimediaRisk = 100 - parsed.multimedia.mediaSafetyScore;
  const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysis, visionResults?.safeSearchAnnotation, multimediaRisk, url);

  const allAgesBlocked = AGE_GROUPS.every(ag => ageGroupScores[ag].action === 'BLOCK');
  const overallScore = allAgesBlocked
    ? 0
    : Math.round(Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length);

  tracker.trackStep('Calculate Scores', `Score: ${overallScore}/100${allAgesBlocked ? ' (BLOCKED FOR ALL)' : ''}`);

  // Build risk categories - merge keyword-based + category-scorer results
  let riskCategories = childSafetyAnalysis.unsafeKeywordsFound.slice(0, 5).map(unsafe => ({
    category: unsafe.category,
    severity: CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category)?.severity || 'low',
    matchCount: unsafe.count,
    matchedKeywords: [unsafe.keyword],
    contextSnippets: unsafe.context,
  }));

  // Add major categories from the scorer if they contributed signal
  if (categoryScoringResult?.primaryCategory && categoryScoringResult.primaryCategory.probability >= 0.20) {
    const primary = categoryScoringResult.primaryCategory;
    const alreadyHas = riskCategories.some(r =>
      primary.category.toLowerCase().includes(r.category.toLowerCase())
    );
    if (!alreadyHas) {
      riskCategories.push({
        category: primary.category,
        severity: primary.probability >= 0.50 ? 'high' : 'medium',
        matchCount: primary.matchedKeywords.length,
        matchedKeywords: primary.matchedKeywords.slice(0, 5),
        contextSnippets: [`Category probability: ${(primary.probability * 100).toFixed(0)}%`],
      });
    }
  }

  if (allAgesBlocked && riskCategories.length === 0) {
    const dangerousInfo = isDangerousSite(url);
    if (dangerousInfo) {
      riskCategories = [{
        category: dangerousInfo.category,
        severity: dangerousInfo.severity,
        matchCount: 1,
        matchedKeywords: [dangerousInfo.category],
        contextSnippets: [dangerousInfo.reason],
      }];
    }
  }

  const titleLower = parsed.title.toLowerCase();
  const metaLower = (parsed.description + ' ' + parsed.keywords.join(' ')).toLowerCase();
  const titleSafe = allAgesBlocked ? false : !childSafetyAnalysis.unsafeKeywordsFound.some(u => titleLower.includes(u.keyword));
  const metadataSafe = allAgesBlocked ? false : !childSafetyAnalysis.unsafeKeywordsFound.some(u => metaLower.includes(u.keyword));

  // Phase 4: Enhanced Vision Classification (up to 5 images)
  let visionSignal = null;
  if (parsed.imageUrls.length > 0) {
    try {
      visionSignal = await classifyImages(parsed.imageUrls);
      tracker.trackStep('Vision Classifier', `${visionSignal.perImageActions.length} images, safety=${visionSignal.visualSafetyScore}`);
    } catch {
      tracker.trackStep('Vision Classifier', 'FAILED');
    }
  }

  // Phase 11: Revealing Content Scoring (body-region coverage)
  let revealingResult = null;
  if (visionSignal) {
    try {
      revealingResult = scoreRevealingContent(visionSignal);
      if (revealingResult.used) {
        tracker.trackStep('Revealing Scorer', `maxScore=${revealingResult.maxRevealingScore}, maps=${revealingResult.coverageMaps.length}`);
        // Apply revealing score escalations to age group scores (only upgrades)
        for (const ag of AGE_GROUPS) {
          const revAction = revealingResult.ageActions[ag];
          const severity = { ALLOW: 0, GATE: 1, BLOCK: 2 };
          if (severity[revAction] > severity[ageGroupScores[ag].action]) {
            ageGroupScores[ag].action = revAction;
            if (revAction === 'BLOCK') ageGroupScores[ag].score = Math.min(ageGroupScores[ag].score, 10);
            else if (revAction === 'GATE') ageGroupScores[ag].score = Math.min(ageGroupScores[ag].score, 50);
          }
        }
      }
    } catch {
      tracker.trackStep('Revealing Scorer', 'FAILED');
    }
  }

  // Phase 5: Audio Analysis
  let audioSignal = null;
  if (html) {
    try {
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);
      const audioSources = extractAudioSources(html, $);
      if (audioSources.length > 0) {
        const nlpConf = categoryScoringResult?.nlpSignal?.confidence || 0;
        const visConf = visionSignal?.confidence || 0;
        audioSignal = await analyzeAudio(audioSources, nlpConf, visConf, allAgesBlocked);
        tracker.trackStep('Audio Analyzer', `used=${audioSignal.used}, safety=${audioSignal.audioSafetyScore}`);
      }
    } catch {
      tracker.trackStep('Audio Analyzer', 'FAILED');
    }
  }

  // Phase 6: Sponsor/Affiliate Detection (in analyzeUrl only)
  let sponsorResult = null;
  let escalationResult = null;
  if (html) {
    try {
      const cheerio = await import('cheerio');
      const $ = cheerio.load(html);
      const pageLinks: { href: string; text: string; rel: string }[] = [];
      $('a').each((_: number, el: any) => {
        pageLinks.push({
          href: $(el).attr('href') || '',
          text: $(el).text().trim().slice(0, 100),
          rel: $(el).attr('rel') || '',
        });
      });
      sponsorResult = detectSponsors(pageLinks, parsed.textContent);
      tracker.trackStep('Sponsor Detection', `sponsors=${sponsorResult.sponsorCount}, affiliates=${sponsorResult.affiliateCount}`);

      // Risk escalation
      if (sponsorResult.links.length > 0) {
        const currentActions = {} as { [key in typeof AGE_GROUPS[number]]: 'BLOCK' | 'GATE' | 'ALLOW' };
        for (const ag of AGE_GROUPS) currentActions[ag] = ageGroupScores[ag].action;
        escalationResult = escalateRisk(sponsorResult.links, currentActions, sponsorResult.sponsorDetected, sponsorResult.affiliateDetected);
        if (escalationResult.escalated) {
          tracker.trackStep('Risk Escalation', `${escalationResult.escalations.length} escalations`);
          // Apply escalations to age group scores
          for (const ag of AGE_GROUPS) {
            if (escalationResult.ageActionOverrides[ag]) {
              ageGroupScores[ag].action = escalationResult.ageActionOverrides[ag]!;
              if (escalationResult.ageActionOverrides[ag] === 'BLOCK') ageGroupScores[ag].score = 0;
              else if (escalationResult.ageActionOverrides[ag] === 'GATE') ageGroupScores[ag].score = Math.min(ageGroupScores[ag].score, 50);
            }
          }
        }
      }
    } catch {
      tracker.trackStep('Sponsor Detection', 'FAILED');
    }
  }

  // Phase 8: Cloud Fallback (when confidence is low)
  let cloudSignal = null;
  const nlpConf = categoryScoringResult?.nlpSignal?.confidence || 0;
  const visConf = visionSignal?.confidence || 0;
  const audConf = audioSignal?.confidence || 0;
  if (shouldTriggerCloudFallback(nlpConf, visConf, audConf, allAgesBlocked)) {
    try {
      const cloudResult = await runCloudFallback(parsed.textContent || '', categoryScoringResult?.nlpSignal);
      if (cloudResult.used) {
        cloudSignal = { used: true, confidence: cloudResult.confidence };
        tracker.trackStep('Cloud Fallback', `${cloudResult.categories.length} categories, conf=${cloudResult.confidence}`);
      }
    } catch {
      tracker.trackStep('Cloud Fallback', 'FAILED');
    }
  }

  tracker.trackStep('Build Report', 'Complete');
  const totalTimeMs = tracker.getTotalTime();
  const analysisMethod = 'live';
  const finalRiskLevel = allAgesBlocked ? 'dangerous' : childSafetyAnalysis.riskLevel;

  // Build backward-compatible ScanResult
  const scanResult: ScanResult = {
    url,
    overallScore,
    ageGroupScores,
    contentAnalysis: {
      textAnalysis: {
        sentiment: allAgesBlocked ? 'Unsafe' : (nlpResults?.sentiment || 'Neutral'),
        keyTopics: allAgesBlocked ? ['Blocked Content'] : detectTopics(parsed.textContent, parsed.title),
        languageScore: allAgesBlocked ? 0 : Math.max(0, 100 - childSafetyAnalysis.riskScore * 2),
        entities: allAgesBlocked ? [] : (nlpResults?.entities || []),
        unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
        safeKeywordsFound: allAgesBlocked ? [] : childSafetyAnalysis.safeKeywordsFound,
      },
      visualAnalysis: {
        detectedObjects: allAgesBlocked ? ['Blocked'] : (visionResults?.detectedObjects || []),
        safetyScore: allAgesBlocked ? 0 : (visionResults?.safeSearchAnnotation
          ? Math.max(0, 100 - getLikelihoodScore(visionResults.safeSearchAnnotation.adult) * 20 - getLikelihoodScore(visionResults.safeSearchAnnotation.violence) * 15)
          : 100),
        concerns: allAgesBlocked
          ? ['Content blocked for all age groups']
          : (visionResults?.safeSearchAnnotation && getLikelihoodScore(visionResults.safeSearchAnnotation.adult) >= 3 ? ['Adult content detected'] : []),
        labels: allAgesBlocked ? [] : (visionResults?.labels || []),
      },
      multimediaAnalysis: allAgesBlocked
        ? { ...parsed.multimedia, mediaSafetyScore: 0, mediaConcerns: ['Content blocked'] }
        : parsed.multimedia,
      metadata: {
        title: parsed.title,
        description: parsed.description,
        keywords: parsed.keywords,
        imageCount: parsed.imageCount,
        linkCount: parsed.linkCount,
        videoCount: parsed.videoCount,
        audioCount: parsed.audioCount,
      },
    },
    childSafetyAnalysis: {
      overallRisk: finalRiskLevel,
      riskCategories,
      depthAnalysis: {
        titleSafe: allAgesBlocked ? false : titleSafe,
        metadataSafe: allAgesBlocked ? false : metadataSafe,
        contentSafe: allAgesBlocked ? false : (childSafetyAnalysis.riskLevel === 'safe' || childSafetyAnalysis.riskLevel === 'caution'),
        mediaSafe: allAgesBlocked ? false : (parsed.multimedia.mediaSafetyScore >= 80),
      },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: analysisMethod as 'live' | 'demo',
    usedSearchFallback: fetchFailed || useSearchFallback,
    performanceMetrics: {
      totalTimeMs,
      steps: tracker.getSteps(),
    },
    pythonDebug,
  };

  // Phase 7: Merge all signals into unified SafetyReport
  console.log('[Pipeline] Merging signals...');
  const safetyReport = mergeSignals({
    url,
    scanResult,
    categoryScoringResult,
    visionSignal,
    audioSignal,
    sponsorResult,
    escalationResult,
    cloudSignal,
  });
  console.log('[Pipeline] SafetyReport merged:', {
    overallsafetyscore: safetyReport.overallsafetyscore,
    languageSafetyScore: safetyReport.languageSafetyScore,
    visualSafetyScore: safetyReport.visualSafetyScore,
    contextType: safetyReport.contextType,
    topicTags: safetyReport.topicTags,
    majorCategories: safetyReport.majorCategories?.length,
    flags: safetyReport.flags,
    decisionSource: safetyReport.decisionSource,
  });

  tracker.trackStep('Signal Merge', `score=${safetyReport.overallsafetyscore}, ctx=${safetyReport.contextType || 'general'}, tags=${safetyReport.topicTags.length}`);

  // Update performance metrics with final steps
  safetyReport.performanceMetrics = {
    totalTimeMs: tracker.getTotalTime(),
    steps: tracker.getSteps(),
  };

  return safetyReport;
}

// ============================================================================
// Keyword Analysis
// ============================================================================

export async function analyzeKeyword(keyword: string, userId?: string | null): Promise<SafetyReport> {
  const tracker = createPerformanceTracker();

  console.log(`\n[KOMAL ANALYSIS] Starting keyword analysis for: "${keyword}"`);

  // Step 0: Check parent controls FIRST (immediate BLOCK/ALLOW)
  if (userId) {
    const parentResult = await checkParentControls(userId, keyword);
    if (parentResult.action === 'BLOCK') {
      console.log(`[KOMAL] Parent control BLOCK: ${parentResult.reason}`);
      return buildParentBlockedResult(keyword, parentResult.reason);
    }
    if (parentResult.action === 'ALLOW') {
      console.log(`[KOMAL] Parent control ALLOW: ${parentResult.reason}`);
      return buildParentAllowedResult(keyword, parentResult.reason);
    }
    tracker.trackStep('Parent Controls', 'No rules matched, proceeding with analysis');
  }

  tracker.trackStep('Initialize', 'Setting up clients');
  initializeClients();

  const searchData = await searchForUrlInfo(keyword, true);
  tracker.trackStep('Keyword Analysis', 'Direct pattern matching complete');

  const shouldFallbackToKeywordOnly = searchData.searchResults.length === 0 &&
    searchData.imageUrls.length === 0 &&
    searchData.combinedText.trim().length < 50;
  const keywordOnlyText = `${keyword} ${searchData.siteName} ${searchData.siteDescription}`.trim();
  const fallbackSearchData = shouldFallbackToKeywordOnly
    ? { ...searchData, combinedText: keywordOnlyText || keyword }
    : searchData;

  const searchAnalysis = await analyzeFromSearchResults(keyword, fallbackSearchData, tracker.trackStep);
  const childSafetyAnalysisRaw = searchAnalysis.childSafetyAnalysis;
  const visionResults = searchAnalysis.visionResults;
  const nlpResults = searchAnalysis.nlpResults;
  const parsed = searchAnalysis.parsed;

  // Phase 3: Enhanced NLP - Category scoring for keyword analysis
  let categoryScoringResult = null;
  try {
    const textToScore = fallbackSearchData.combinedText || keyword;
    const preprocessed = preprocessText(textToScore, searchData.siteName, searchData.siteDescription, parsed.keywords);
    categoryScoringResult = scoreCategories(preprocessed);
    tracker.trackStep(
      'Category Scoring',
      `Rule ${categoryScoringResult.ruleApplied}, primary=${categoryScoringResult.primaryCategory?.category || 'none'} (P=${categoryScoringResult.primaryCategory?.probability || 0})`
    );
  } catch (error) {
    tracker.trackStep('Category Scoring', 'FAILED');
    console.error('[Pipeline] Category scoring failed:', error);
  }

  // Python hybrid analysis
  let pythonDebug = null;
  try {
    const textForPython = fallbackSearchData.combinedText || keyword;
    const pythonResult = await runPythonAnalysis(textForPython);
    pythonDebug = injectPythonResults(childSafetyAnalysisRaw, pythonResult, tracker);
  } catch {
    tracker.trackStep('Python Hybrid', 'FAILED');
  }

  const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysisRaw, visionResults?.safeSearchAnnotation || null, 0, keyword);
  const allAgesBlocked = AGE_GROUPS.every(ag => ageGroupScores[ag].action === 'BLOCK');

  const overallScore = allAgesBlocked
    ? 0
    : Math.round(Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length);

  const riskCategories = childSafetyAnalysisRaw.unsafeKeywordsFound.slice(0, 5).map(unsafe => ({
    category: unsafe.category,
    severity: CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category)?.severity || 'low',
    matchCount: unsafe.count,
    matchedKeywords: [unsafe.keyword],
    contextSnippets: unsafe.context,
  }));

  const finalRiskLevel = allAgesBlocked ? 'dangerous' : childSafetyAnalysisRaw.riskLevel;

  const titleLower = (searchData.siteName || '').toLowerCase();
  const metaLower = (searchData.siteDescription || '').toLowerCase();
  const titleSafe = allAgesBlocked ? false : !childSafetyAnalysisRaw.unsafeKeywordsFound.some(u => titleLower.includes(u.keyword));
  const metadataSafe = allAgesBlocked ? false : !childSafetyAnalysisRaw.unsafeKeywordsFound.some(u => metaLower.includes(u.keyword));
  const contentSafe = allAgesBlocked ? false : (childSafetyAnalysisRaw.riskLevel === 'safe' || childSafetyAnalysisRaw.riskLevel === 'caution');

  const totalTime = tracker.getTotalTime();
  tracker.trackStep('Complete', `Total: ${(totalTime / 1000).toFixed(2)}s`);

  // Calculate visual safety score
  let visualSafetyScore = 85;
  const visualConcerns: string[] = [];
  if (visionResults?.safeSearchAnnotation) {
    const ss = visionResults.safeSearchAnnotation;
    let penalty = 0;
    if (ss.adult === 'LIKELY' || ss.adult === 'VERY_LIKELY') penalty += 40;
    if (ss.violence === 'LIKELY' || ss.violence === 'VERY_LIKELY') penalty += 30;
    if (ss.racy === 'LIKELY' || ss.racy === 'VERY_LIKELY') penalty += 20;
    visualSafetyScore = Math.max(0, 100 - penalty);

    if (ss.adult === 'LIKELY' || ss.adult === 'VERY_LIKELY') visualConcerns.push('Adult content detected');
    if (ss.violence === 'LIKELY' || ss.violence === 'VERY_LIKELY') visualConcerns.push('Violence detected');
    if (ss.racy === 'LIKELY' || ss.racy === 'VERY_LIKELY') visualConcerns.push('Suggestive content detected');
  }

  const keywordResult: ScanResult = {
    url: keyword,
    overallScore,
    ageGroupScores,
    contentAnalysis: {
      textAnalysis: {
        sentiment: allAgesBlocked ? 'Unsafe' : (nlpResults?.sentiment || 'Neutral'),
        keyTopics: allAgesBlocked ? ['Flagged Content'] : (parsed.keywords.length > 0 ? parsed.keywords : ['General Content']),
        languageScore: allAgesBlocked ? 0 : Math.max(0, 85 - childSafetyAnalysisRaw.unsafeKeywordsFound.length * 5),
        entities: nlpResults?.entities || [],
        unsafeKeywordsFound: childSafetyAnalysisRaw.unsafeKeywordsFound.map(k => k.keyword),
        safeKeywordsFound: childSafetyAnalysisRaw.safeKeywordsFound,
      },
      visualAnalysis: {
        safetyScore: allAgesBlocked ? 0 : visualSafetyScore,
        detectedObjects: allAgesBlocked ? ['Blocked'] : (visionResults?.detectedObjects || []),
        concerns: allAgesBlocked ? ['Content blocked for all age groups'] : visualConcerns,
        labels: visionResults?.labels || [],
      },
      multimediaAnalysis: {
        videoDetected: false,
        audioDetected: false,
        mediaTypes: [],
        mediaSafetyScore: allAgesBlocked ? 0 : 85,
        mediaConcerns: allAgesBlocked ? ['Content blocked'] : [],
      },
      metadata: {
        title: searchData.siteName || `Keyword Analysis: ${keyword}`,
        description: searchData.siteDescription || '',
        keywords: parsed.keywords || [],
        imageCount: 0,
        linkCount: 0,
        videoCount: 0,
        audioCount: 0,
      },
    },
    childSafetyAnalysis: {
      overallRisk: finalRiskLevel,
      riskCategories,
      depthAnalysis: {
        titleSafe,
        metadataSafe,
        contentSafe,
        mediaSafe: !allAgesBlocked,
      },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: 'live',
    usedSearchFallback: false,
    performanceMetrics: {
      totalTimeMs: totalTime,
      steps: tracker.getSteps(),
    },
    pythonDebug,
  };

  // Phase 7: Merge signals into unified SafetyReport
  const safetyReport = mergeSignals({
    url: keyword,
    scanResult: keywordResult,
    categoryScoringResult,
  });

  safetyReport.performanceMetrics = {
    totalTimeMs: tracker.getTotalTime(),
    steps: tracker.getSteps(),
  };

  return safetyReport;
}

// ============================================================================
// Demo Analysis (fallback when live fails)
// ============================================================================

export function generateDemoAnalysis(url: string, priorTimeMs: number = 0): ScanResult {
  const startTime = Date.now();
  const performanceSteps: { name: string; durationMs: number; details?: string }[] = [];

  if (priorTimeMs > 0) {
    performanceSteps.push({ name: 'Error Recovery', durationMs: priorTimeMs, details: 'Fallback to demo mode' });
  }

  const urlLower = url.toLowerCase();
  const childSafetyAnalysis = analyzeChildSafetyFast(urlLower, '', '', []);
  performanceSteps.push({ name: 'URL Analysis', durationMs: Date.now() - startTime, details: 'Keyword scan' });

  const isEducational = /edu|learn|wiki|school|kids|child/i.test(urlLower);
  const socialMedia = isSocialMediaSite(url);
  performanceSteps.push({ name: 'Pattern Detection', durationMs: 1, details: `Edu=${isEducational}, Social=${socialMedia}` });

  const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysis, null, 0, url);
  const allAgesBlocked = AGE_GROUPS.every(ag => ageGroupScores[ag].action === 'BLOCK');

  if (!allAgesBlocked && isEducational && !socialMedia) {
    for (const ag of AGE_GROUPS) {
      ageGroupScores[ag].score = Math.min(100, ageGroupScores[ag].score + 20);
      if (ageGroupScores[ag].score >= 80) {
        ageGroupScores[ag].action = 'ALLOW';
        ageGroupScores[ag].reason = 'Educational content detected';
      }
    }
  }

  const overallScore = allAgesBlocked
    ? 0
    : Math.round(Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length);

  const totalTimeMs = priorTimeMs + (Date.now() - startTime);
  performanceSteps.push({ name: 'Calculate Scores', durationMs: Date.now() - startTime, details: `Score: ${overallScore}${allAgesBlocked ? ' (BLOCKED)' : ''}` });

  let riskCategories = childSafetyAnalysis.unsafeKeywordsFound.slice(0, 3).map(u => ({
    category: u.category,
    severity: CHILD_SAFETY_RISKS.find(r => r.category === u.category)?.severity || 'low',
    matchCount: u.count,
    matchedKeywords: [u.keyword],
    contextSnippets: u.context,
  }));

  if (allAgesBlocked && riskCategories.length === 0) {
    const dangerousInfo = isDangerousSite(url);
    if (dangerousInfo) {
      riskCategories = [{
        category: dangerousInfo.category,
        severity: dangerousInfo.severity,
        matchCount: 1,
        matchedKeywords: [dangerousInfo.category],
        contextSnippets: [dangerousInfo.reason],
      }];
    }
  }

  const finalRiskLevel = allAgesBlocked ? 'dangerous' : childSafetyAnalysis.riskLevel;

  return {
    url,
    overallScore,
    ageGroupScores,
    contentAnalysis: {
      textAnalysis: {
        sentiment: allAgesBlocked ? 'Unsafe' : 'Neutral',
        keyTopics: allAgesBlocked ? ['Blocked Content'] : (isEducational ? ['Education'] : socialMedia ? ['Social Media'] : ['General']),
        languageScore: allAgesBlocked ? 0 : overallScore,
        unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
        safeKeywordsFound: allAgesBlocked ? [] : childSafetyAnalysis.safeKeywordsFound,
      },
      visualAnalysis: {
        detectedObjects: allAgesBlocked ? ['Blocked'] : [],
        safetyScore: allAgesBlocked ? 0 : 100,
        concerns: allAgesBlocked ? ['Content blocked for all age groups'] : []
      },
      multimediaAnalysis: {
        videoDetected: false,
        audioDetected: false,
        mediaTypes: [],
        mediaSafetyScore: allAgesBlocked ? 0 : 100,
        mediaConcerns: allAgesBlocked ? ['Content blocked'] : []
      },
      metadata: { title: 'Demo Mode', description: 'URL-based analysis', keywords: [], imageCount: 0, linkCount: 0, videoCount: 0, audioCount: 0 },
    },
    childSafetyAnalysis: {
      overallRisk: finalRiskLevel,
      riskCategories,
      depthAnalysis: {
        titleSafe: !allAgesBlocked,
        metadataSafe: !allAgesBlocked,
        contentSafe: allAgesBlocked ? false : (childSafetyAnalysis.riskLevel === 'safe'),
        mediaSafe: !allAgesBlocked,
      },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: 'demo',
    performanceMetrics: {
      totalTimeMs,
      steps: performanceSteps,
    },
  };
}
