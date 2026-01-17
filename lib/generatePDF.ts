import jsPDF from 'jspdf';

interface ScanResult {
  url: string;
  overallScore: number;
  ageGroupScores: {
    [ageGroup: string]: {
      score: number;
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      risks: string[];
    };
  };
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities?: string[];
      unsafeKeywordsFound: string[];
      safeKeywordsFound: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels?: string[];
    };
    multimediaAnalysis?: {
      videoDetected: boolean;
      audioDetected: boolean;
      mediaTypes: string[];
      mediaSafetyScore: number;
      mediaConcerns: string[];
    };
    metadata?: {
      title?: string;
      description?: string;
      keywords?: string[];
      imageCount: number;
      linkCount: number;
      videoCount: number;
      audioCount: number;
    };
  };
  childSafetyAnalysis: {
    overallRisk: 'safe' | 'caution' | 'unsafe' | 'dangerous';
    riskCategories: {
      category: string;
      severity: string;
      matchCount: number;
      matchedKeywords: string[];
      contextSnippets: string[];
    }[];
    depthAnalysis: {
      titleSafe: boolean;
      metadataSafe: boolean;
      contentSafe: boolean;
      mediaSafe: boolean;
    };
  };
  timestamp: string;
  analysisMethod?: 'live' | 'demo';
  usedSearchFallback?: boolean;
}

// Colors matching the page exactly
const COLORS = {
  primary: [107, 78, 113] as [number, number, number],       // #6B4E71
  primaryLight: [247, 245, 248] as [number, number, number], // primary/5
  white: [255, 255, 255] as [number, number, number],
  gray50: [249, 250, 251] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  gray200: [229, 231, 235] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray600: [75, 85, 99] as [number, number, number],
  gray800: [31, 41, 55] as [number, number, number],
  green50: [240, 253, 244] as [number, number, number],
  green100: [220, 252, 231] as [number, number, number],
  green200: [187, 247, 208] as [number, number, number],
  green500: [34, 197, 94] as [number, number, number],
  green600: [22, 163, 74] as [number, number, number],
  green700: [21, 128, 61] as [number, number, number],
  amber50: [255, 251, 235] as [number, number, number],
  amber100: [254, 243, 199] as [number, number, number],
  amber200: [253, 230, 138] as [number, number, number],
  amber500: [245, 158, 11] as [number, number, number],
  amber600: [217, 119, 6] as [number, number, number],
  amber700: [180, 83, 9] as [number, number, number],
  red50: [254, 242, 242] as [number, number, number],
  red100: [254, 226, 226] as [number, number, number],
  red200: [254, 202, 202] as [number, number, number],
  red500: [239, 68, 68] as [number, number, number],
  red600: [220, 38, 38] as [number, number, number],
  red700: [185, 28, 28] as [number, number, number],
  blue100: [219, 234, 254] as [number, number, number],
  blue600: [37, 99, 235] as [number, number, number],
  purple50: [250, 245, 255] as [number, number, number],
  purple100: [243, 232, 255] as [number, number, number],
  purple600: [147, 51, 234] as [number, number, number],
  indigo50: [238, 242, 255] as [number, number, number],
  indigo600: [79, 70, 229] as [number, number, number],
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 12;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Helper function to load PNG logo as base64
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    // Use PNG logo directly (better compatibility with jsPDF)
    const response = await fetch('/komaliconnobg.png');
    if (!response.ok) {
      console.error('Failed to fetch logo:', response.status);
      return null;
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        console.error('Failed to read logo blob');
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
    return null;
  }
}

// Helper function to load an image as base64 from URL
async function loadImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    // Handle relative URLs
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : imageUrl;
    const response = await fetch(fullUrl);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateSafetyReportPDF(result: ScanResult): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  let currentY = MARGIN;
  let pageNum = 1;

  // Load logo
  const logoBase64 = await loadLogoAsBase64();

  // Check if blocked for under 16
  const isUnder16Blocked = result.childSafetyAnalysis?.overallRisk === 'dangerous' ||
    result.childSafetyAnalysis?.riskCategories?.some(r => r.severity === 'critical');
  const displayOverallScore = isUnder16Blocked ? 0 : result.overallScore;

  // Helper functions
  const getScoreColor = (score: number): [number, number, number] => {
    if (score >= 75) return COLORS.green500;
    if (score >= 50) return COLORS.amber500;
    return COLORS.red500;
  };

  const getScoreBgColor = (score: number): [number, number, number] => {
    if (score >= 75) return COLORS.green100;
    if (score >= 50) return COLORS.amber100;
    return COLORS.red100;
  };

  const getActionColors = (action: string): { bg: [number, number, number]; border: [number, number, number]; text: [number, number, number] } => {
    switch (action) {
      case 'BLOCK': return { bg: COLORS.red50, border: COLORS.red200, text: COLORS.red700 };
      case 'GATE': return { bg: COLORS.amber50, border: COLORS.amber200, text: COLORS.amber700 };
      case 'ALLOW': return { bg: COLORS.green50, border: COLORS.green200, text: COLORS.green700 };
      default: return { bg: COLORS.gray100, border: COLORS.gray200, text: COLORS.gray600 };
    }
  };

  const getSeverityColor = (severity: string): [number, number, number] => {
    switch (severity.toLowerCase()) {
      case 'critical': return COLORS.red500;
      case 'high': return COLORS.red600;
      case 'medium': return COLORS.amber500;
      case 'low': return [250, 204, 21] as [number, number, number];
      default: return COLORS.gray500;
    }
  };

  const checkNewPage = (neededHeight: number): boolean => {
    if (currentY + neededHeight > PAGE_HEIGHT - MARGIN - 10) {
      doc.addPage();
      pageNum++;
      currentY = MARGIN;
      return true;
    }
    return false;
  };

  const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fillColor: [number, number, number], strokeColor?: [number, number, number]) => {
    doc.setFillColor(...fillColor);
    if (strokeColor) {
      doc.setDrawColor(...strokeColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, w, h, r, r, 'FD');
    } else {
      doc.roundedRect(x, y, w, h, r, r, 'F');
    }
  };

  // ===== HEADER: KOMAL Branding with Logo & komalkids.com =====
  currentY = 5; // Start near top with minimal padding
  
  let logoAdded = false;
  
  // Add logo if available
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', MARGIN, currentY, 10, 10);
      logoAdded = true;
    } catch (e) {
      console.error('Failed to add logo to PDF:', e);
      logoAdded = false;
    }
  }
  
  const textOffset = logoAdded ? 12 : 0;
  
  // KOMAL text on the left
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('KOMAL', MARGIN + textOffset, currentY + 7);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);
  doc.text('URL / Keyword Safety Analysis Report', MARGIN + textOffset + 22, currentY + 7);
  
  // komalkids.com on the right (same size as KOMAL)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('komalkids.com', PAGE_WIDTH - MARGIN, currentY + 7, { align: 'right' });
  
  currentY += 14;

  // ===== SECTION 1: Overall Safety Score =====
  checkNewPage(55);
  drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 50, 4, COLORS.white, COLORS.gray200);
  
  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Overall Safety Score', MARGIN + 5, currentY + 8);
  
  // Score badge
  const scoreBadgeX = PAGE_WIDTH - MARGIN - 28;
  const scoreBadgeY = currentY + 5;
  drawRoundedRect(scoreBadgeX, scoreBadgeY, 23, 14, 3, getScoreBgColor(displayOverallScore));
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...getScoreColor(displayOverallScore));
  doc.text(`${displayOverallScore}`, scoreBadgeX + 11.5, scoreBadgeY + 8, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray600);
  doc.text('/100', scoreBadgeX + 11.5, scoreBadgeY + 12, { align: 'center' });
  
  // Progress bar
  const barY = currentY + 18;
  const barWidth = CONTENT_WIDTH - 45;
  drawRoundedRect(MARGIN + 5, barY, barWidth, 4, 2, COLORS.gray200);
  if (displayOverallScore > 0) {
    drawRoundedRect(MARGIN + 5, barY, (barWidth * displayOverallScore) / 100, 4, 2, getScoreColor(displayOverallScore));
  }
  
  // URL and badges
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);
  doc.text('Scanned:', MARGIN + 5, currentY + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  const urlText = result.url.length > 50 ? result.url.substring(0, 50) + '...' : result.url;
  doc.text(urlText, MARGIN + 22, currentY + 28);
  
  // Analysis method badge
  let badgeX = MARGIN + 5;
  const methodColor = result.analysisMethod === 'live' ? COLORS.green100 : COLORS.amber100;
  const methodTextColor = result.analysisMethod === 'live' ? COLORS.green700 : COLORS.amber700;
  drawRoundedRect(badgeX, currentY + 31, 20, 5, 2, methodColor);
  doc.setFontSize(6);
  doc.setTextColor(...methodTextColor);
  doc.text(result.analysisMethod === 'live' ? 'Live Analysis' : 'Demo Mode', badgeX + 10, currentY + 34.5, { align: 'center' });
  badgeX += 22;
  
  // Blocked badge if applicable
  if (isUnder16Blocked) {
    drawRoundedRect(badgeX, currentY + 31, 32, 5, 2, COLORS.red100);
    doc.setTextColor(...COLORS.red700);
    doc.text('🚫 Blocked for under 16', badgeX + 16, currentY + 34.5, { align: 'center' });
  }
  
  // Depth Analysis boxes
  const depthY = currentY + 39;
  const depthItems = [
    { label: 'Title', safe: result.childSafetyAnalysis.depthAnalysis.titleSafe },
    { label: 'Metadata', safe: result.childSafetyAnalysis.depthAnalysis.metadataSafe },
    { label: 'Content', safe: result.childSafetyAnalysis.depthAnalysis.contentSafe },
    { label: 'Media', safe: result.childSafetyAnalysis.depthAnalysis.mediaSafe },
  ];
  const depthBoxWidth = (CONTENT_WIDTH - 20) / 4;
  depthItems.forEach((item, idx) => {
    const x = MARGIN + 5 + (idx * (depthBoxWidth + 2));
    const bgColor = item.safe ? COLORS.green50 : COLORS.red50;
    const textColor = item.safe ? COLORS.green700 : COLORS.red700;
    drawRoundedRect(x, depthY, depthBoxWidth, 8, 2, bgColor);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(item.label, x + depthBoxWidth / 2, depthY + 3.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(item.safe ? 'Safe' : 'Unsafe', x + depthBoxWidth / 2, depthY + 6.5, { align: 'center' });
  });
  
  currentY += 52;

  // ===== Metadata Section (inside overall score area conceptually) =====
  if (result.contentAnalysis.metadata) {
    const meta = result.contentAnalysis.metadata;
    const hasStats = (meta.imageCount >= 1 || meta.linkCount >= 1 || meta.videoCount >= 1 || meta.audioCount >= 1);
    
    // Calculate description lines first for accurate height
    doc.setFontSize(7);
    const descMaxWidth = CONTENT_WIDTH - 25;
    const descLines = meta.description ? doc.splitTextToSize(meta.description, descMaxWidth) : [];
    const descLineCount = Math.min(descLines.length, 4); // Show up to 4 lines
    const descHeight = meta.description ? (descLineCount * 4) : 0;
    
    const metaHeight = (meta.title ? 5 : 0) + descHeight + (hasStats ? 5 : 0) + 6;
    
    if (metaHeight > 6) {
      checkNewPage(metaHeight);
      drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, metaHeight, 3, COLORS.gray50);
      
      let metaY = currentY + 4;
      
      if (meta.title) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.gray600);
        doc.text('Title: ', MARGIN + 3, metaY);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.title.substring(0, 80), MARGIN + 12, metaY);
        metaY += 5;
      }
      
      if (meta.description && descLines.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.gray600);
        doc.text('Description: ', MARGIN + 3, metaY);
        doc.setFont('helvetica', 'normal');
        doc.text(descLines.slice(0, 4), MARGIN + 22, metaY); // Show up to 4 lines
        metaY += descLineCount * 4;
      }
      
      if (hasStats) {
        const stats: string[] = [];
        if (meta.imageCount >= 1) stats.push(`${meta.imageCount} images`);
        if (meta.linkCount >= 1) stats.push(`${meta.linkCount} links`);
        if (meta.videoCount >= 1) stats.push(`${meta.videoCount} videos`);
        if (meta.audioCount >= 1) stats.push(`${meta.audioCount} audio`);
        doc.setFont('helvetica', 'bold');
        doc.text('Stats: ', MARGIN + 3, metaY);
        doc.setFont('helvetica', 'normal');
        doc.text(stats.join(', '), MARGIN + 14, metaY);
      }
      
      currentY += metaHeight + 3;
    }
  }

  // ===== SECTION 2: Safety Risks Detected =====
  if (result.childSafetyAnalysis.riskCategories.length > 0) {
    checkNewPage(35);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Safety Risks Detected', MARGIN, currentY + 5);
    currentY += 10;
    
    for (const risk of result.childSafetyAnalysis.riskCategories) {
      checkNewPage(18);
      
      drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 15, 3, COLORS.red50, COLORS.red100);
      
      // Severity badge
      const sevColor = getSeverityColor(risk.severity);
      doc.setFillColor(...sevColor);
      doc.roundedRect(MARGIN + 3, currentY + 2, 14, 4, 1, 1, 'F');
      doc.setFontSize(5);
      doc.setTextColor(...COLORS.white);
      doc.text(risk.severity.toUpperCase(), MARGIN + 10, currentY + 4.8, { align: 'center' });
      
      // Category and count
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.gray800);
      doc.text(risk.category, MARGIN + 20, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray500);
      doc.text(`(${risk.matchCount} matches)`, MARGIN + 20 + doc.getTextWidth(risk.category) + 2, currentY + 5);
      
      // Keywords
      doc.setFontSize(6);
      doc.setTextColor(...COLORS.red700);
      doc.text(`Keywords: ${risk.matchedKeywords.slice(0, 5).join(', ')}`, MARGIN + 3, currentY + 10);
      
      // Context snippet
      if (risk.contextSnippets.length > 0) {
        doc.setFontSize(5);
        doc.setTextColor(...COLORS.gray600);
        doc.setFont('helvetica', 'italic');
        doc.text(risk.contextSnippets[0].substring(0, 80) + '...', MARGIN + 3, currentY + 13);
      }
      
      currentY += 18;
    }
    
    currentY += 3;
  }

  // ===== SECTION 3: Safe Content Indicators =====
  const safeKeywords = result.contentAnalysis.textAnalysis.safeKeywordsFound;
  if (safeKeywords && safeKeywords.length > 0) {
    checkNewPage(25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Safe Content Indicators', MARGIN, currentY + 5);
    currentY += 10;
    
    drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 12, 3, COLORS.green50);
    
    // Draw keyword pills
    let pillX = MARGIN + 3;
    let pillY = currentY + 3;
    const displayKeywords = safeKeywords.slice(0, 12);
    
    doc.setFontSize(6);
    for (const keyword of displayKeywords) {
      const textWidth = doc.getTextWidth(keyword);
      const pillWidth = textWidth + 6;
      
      if (pillX + pillWidth > PAGE_WIDTH - MARGIN - 3) {
        pillX = MARGIN + 3;
        pillY += 5;
      }
      
      doc.setFillColor(...COLORS.white);
      doc.setDrawColor(...COLORS.green500);
      doc.setLineWidth(0.2);
      doc.roundedRect(pillX, pillY, pillWidth, 4, 2, 2, 'FD');
      doc.setTextColor(...COLORS.green700);
      doc.text(keyword, pillX + 3, pillY + 2.8);
      
      pillX += pillWidth + 2;
    }
    
    currentY += 16;
  }

  // ===== SECTION 4: NLP Text Analysis =====
  checkNewPage(40);
  
  const analysisBoxWidth = (CONTENT_WIDTH - 4) / 2;
  
  // NLP Box
  drawRoundedRect(MARGIN, currentY, analysisBoxWidth, 38, 4, COLORS.white, COLORS.gray200);
  
  // Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('NLP Text Analysis', MARGIN + 5, currentY + 9);
  
  // Sentiment
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);
  doc.text('Sentiment', MARGIN + 5, currentY + 17);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(isUnder16Blocked ? 'Blocked' : result.contentAnalysis.textAnalysis.sentiment, MARGIN + 5, currentY + 22);
  
  // Language Score
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);
  doc.text('Language Safety Score', MARGIN + 5, currentY + 28);
  const langScore = isUnder16Blocked ? 0 : result.contentAnalysis.textAnalysis.languageScore;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...getScoreColor(langScore));
  doc.text(`${langScore}/100`, MARGIN + 5, currentY + 33);
  
  // Key Topics
  const topics = isUnder16Blocked ? ['Flagged Content'] : result.contentAnalysis.textAnalysis.keyTopics.slice(0, 3);
  let topicX = MARGIN + 50;
  let topicY = currentY + 17;
  doc.setFontSize(6);
  for (const topic of topics) {
    if (topicX + 20 > MARGIN + analysisBoxWidth - 3) {
      topicX = MARGIN + 50;
      topicY += 6;
    }
    const tw = doc.getTextWidth(topic) + 4;
    drawRoundedRect(topicX, topicY, tw, 5, 2, COLORS.primaryLight);
    doc.setTextColor(...COLORS.primary);
    doc.text(topic, topicX + 2, topicY + 3.5);
    topicX += tw + 2;
  }

  // Vision AI Box (only if not search fallback)
  if (!result.usedSearchFallback) {
    const visionX = MARGIN + analysisBoxWidth + 4;
    drawRoundedRect(visionX, currentY, analysisBoxWidth, 38, 4, COLORS.white, COLORS.gray200);
    
    // Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Vision AI Analysis', visionX + 5, currentY + 9);
    
    // Visual Safety Score
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray500);
    doc.text('Visual Safety Score', visionX + 5, currentY + 17);
    const visualScore = isUnder16Blocked ? 0 : result.contentAnalysis.visualAnalysis.safetyScore;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...getScoreColor(visualScore));
    doc.text(`${visualScore}/100`, visionX + 5, currentY + 22);
    
    // Detected Objects
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray500);
    doc.text('Detected Objects', visionX + 5, currentY + 28);
    
    const objects = isUnder16Blocked ? ['Flagged'] : result.contentAnalysis.visualAnalysis.detectedObjects.slice(0, 4);
    let objX = visionX + 5;
    doc.setFontSize(6);
    for (const obj of objects) {
      const ow = doc.getTextWidth(obj) + 4;
      if (objX + ow > visionX + analysisBoxWidth - 3) break;
      drawRoundedRect(objX, currentY + 30, ow, 5, 2, COLORS.purple50);
      doc.setTextColor(...COLORS.purple600);
      doc.text(obj, objX + 2, currentY + 33.5);
      objX += ow + 2;
    }
  }
  
  currentY += 40;

  // ===== SECTION 5: Multimedia Analysis =====
  if (result.contentAnalysis.multimediaAnalysis) {
    checkNewPage(25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Multimedia Analysis', MARGIN, currentY + 5);
    currentY += 10;
    
    const mm = result.contentAnalysis.multimediaAnalysis;
    const mmBoxWidth = (CONTENT_WIDTH - 6) / 4;
    
    // Video box
    drawRoundedRect(MARGIN, currentY, mmBoxWidth, 15, 3, COLORS.gray50);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple600);
    doc.text('Video', MARGIN + mmBoxWidth / 2, currentY + 6, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor(...(mm.videoDetected ? COLORS.amber600 : COLORS.green600));
    doc.text(mm.videoDetected ? 'Detected' : 'None', MARGIN + mmBoxWidth / 2, currentY + 11, { align: 'center' });
    
    // Audio box
    drawRoundedRect(MARGIN + mmBoxWidth + 2, currentY, mmBoxWidth, 15, 3, COLORS.gray50);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue600);
    doc.text('Audio', MARGIN + mmBoxWidth + 2 + mmBoxWidth / 2, currentY + 6, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor(...(mm.audioDetected ? COLORS.amber600 : COLORS.green600));
    doc.text(mm.audioDetected ? 'Detected' : 'None', MARGIN + mmBoxWidth + 2 + mmBoxWidth / 2, currentY + 11, { align: 'center' });
    
    // Media Safety box (spans 2 columns)
    drawRoundedRect(MARGIN + (mmBoxWidth + 2) * 2, currentY, mmBoxWidth * 2 + 2, 15, 3, COLORS.gray50);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Media Safety', MARGIN + (mmBoxWidth + 2) * 2 + mmBoxWidth + 1, currentY + 6, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...getScoreColor(mm.mediaSafetyScore));
    doc.text(`${mm.mediaSafetyScore}/100`, MARGIN + (mmBoxWidth + 2) * 2 + mmBoxWidth + 1, currentY + 12, { align: 'center' });
    
    currentY += 20;
  }

  // ===== SECTION 6: Age-Appropriate Actions =====
  checkNewPage(50);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Age-Appropriate Actions', MARGIN, currentY + 5);
  currentY += 10;
  
  const ageGroups = Object.entries(result.ageGroupScores);
  const ageBoxWidth = (CONTENT_WIDTH - 9) / 4;
  
  ageGroups.forEach(([ageGroup, data], idx) => {
    const displayAction = isUnder16Blocked ? 'BLOCK' : data.action;
    const displayScore = isUnder16Blocked ? 0 : data.score;
    const colors = getActionColors(displayAction);
    
    const x = MARGIN + (idx * (ageBoxWidth + 3));
    
    // Box with colored border
    doc.setFillColor(...colors.bg);
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, currentY, ageBoxWidth, 38, 3, 3, 'FD');
    
    // Age group label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.text);
    doc.text(ageGroup, x + ageBoxWidth / 2, currentY + 7, { align: 'center' });
    
    // Action
    doc.setFontSize(14);
    doc.text(displayAction, x + ageBoxWidth / 2, currentY + 16, { align: 'center' });
    
    // Score
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${displayScore}/100`, x + ageBoxWidth / 2, currentY + 22, { align: 'center' });
    
    // Reason (with proper text wrapping)
    doc.setFontSize(5);
    const reason = isUnder16Blocked ? 'Blocked: Not age-appropriate' : data.reason;
    const reasonLines = doc.splitTextToSize(reason, ageBoxWidth - 4);
    doc.text(reasonLines.slice(0, 3), x + 2, currentY + 27);
  });
  
  currentY += 42;

  // ===== SECTION 7: Content Risk Summary (if risks exist) =====
  if (result.childSafetyAnalysis.riskCategories.length > 0) {
    checkNewPage(30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('Content Risk Summary', MARGIN, currentY + 5);
    currentY += 10;
    
    const riskBoxWidth = (CONTENT_WIDTH - 4) / 2;
    let riskIdx = 0;
    
    for (const risk of result.childSafetyAnalysis.riskCategories.slice(0, 4)) {
      const x = MARGIN + (riskIdx % 2) * (riskBoxWidth + 4);
      const y = currentY + Math.floor(riskIdx / 2) * 12;
      
      drawRoundedRect(x, y, riskBoxWidth, 10, 2, COLORS.gray50, COLORS.gray200);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.primary);
      doc.text(risk.category, x + 3, y + 6);
      
      // Severity pill
      const sevColor = getSeverityColor(risk.severity);
      const sevWidth = doc.getTextWidth(risk.severity.toUpperCase()) + 4;
      doc.setFillColor(...sevColor);
      doc.roundedRect(x + riskBoxWidth - sevWidth - 3, y + 3, sevWidth, 4, 1, 1, 'F');
      doc.setFontSize(5);
      doc.setTextColor(...COLORS.white);
      doc.text(risk.severity.toUpperCase(), x + riskBoxWidth - 3 - sevWidth / 2, y + 5.8, { align: 'center' });
      
      riskIdx++;
    }
    
    currentY += Math.ceil(result.childSafetyAnalysis.riskCategories.length / 2) * 12 + 5;
  }

  // ===== FOOTER: Info & Timestamp =====
  // Only add new page if absolutely necessary
  const footerHeight = 20;
  const spaceRemaining = PAGE_HEIGHT - MARGIN - 15 - currentY;
  
  if (spaceRemaining < footerHeight) {
    doc.addPage();
    pageNum++;
    currentY = MARGIN;
  }
  
  drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, footerHeight, 4, COLORS.primaryLight);
  
  doc.setFontSize(5);
  doc.setTextColor(...COLORS.gray500);
  doc.text('This analysis uses deep keyword context analysis, Vision AI, NLP, and multimedia scanning to evaluate child safety.', PAGE_WIDTH / 2, currentY + 6, { align: 'center' });
  doc.text('Scores are calculated based on age-appropriate content guidelines.', PAGE_WIDTH / 2, currentY + 10, { align: 'center' });
  
  // Timestamp
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(`Generated: ${dateStr} at ${timeStr}`, PAGE_WIDTH / 2, currentY + 16, { align: 'center' });

  // ===== PAGE FOOTERS =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.gray500);
    doc.text('www.komalkids.com', PAGE_WIDTH / 2, PAGE_HEIGHT - 8, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, { align: 'right' });
  }

  // Save
  const filename = `KOMAL_Safety_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
