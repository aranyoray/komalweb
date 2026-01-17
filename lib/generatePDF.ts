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

// Colors
const COLORS = {
  primary: [107, 78, 113] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [243, 244, 246] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  text: [31, 41, 55] as [number, number, number],
  textDim: [107, 114, 128] as [number, number, number],
};

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const FOOTER_HEIGHT = 15;
const HEADER_HEIGHT = 25;

export async function generateSafetyReportPDF(result: ScanResult): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let currentY = MARGIN;
  let currentPage = 1;

  // Load logo as base64
  const logoBase64 = await loadLogoAsBase64();

  // Helper function to add header with logo
  const addHeader = () => {
    // White background for logo area
    doc.setFillColor(...COLORS.white);
    doc.rect(MARGIN, MARGIN, 25, 10, 'F');

    // Add logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', MARGIN + 2, MARGIN + 1, 8, 8);
    }

    // Add KOMAL text next to logo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('KOMAL', MARGIN + 12, MARGIN + 6);

    // Add report title
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textDim);
    doc.text('URL Safety Analysis Report', MARGIN + 12, MARGIN + 10);

    // Header line
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, MARGIN + 13, PAGE_WIDTH - MARGIN, MARGIN + 13);

    return MARGIN + HEADER_HEIGHT;
  };

  // Helper function to add footer
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = PAGE_HEIGHT - FOOTER_HEIGHT;

    // Footer line
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, footerY, PAGE_WIDTH - MARGIN, footerY);

    // Website URL
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.primary);
    doc.text('www.komalkids.com', PAGE_WIDTH / 2, footerY + 5, { align: 'center' });

    // Page number
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textDim);
    doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_WIDTH - MARGIN, footerY + 5, { align: 'right' });
  };

  // Helper function to check if we need a new page
  const checkNewPage = (neededHeight: number): boolean => {
    const maxY = PAGE_HEIGHT - FOOTER_HEIGHT - MARGIN;
    if (currentY + neededHeight > maxY) {
      return true;
    }
    return false;
  };

  // Helper function to add a new page
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    currentY = addHeader();
  };

  // Helper function to get score color
  const getScoreColor = (score: number): [number, number, number] => {
    if (score >= 75) return COLORS.green;
    if (score >= 50) return COLORS.amber;
    return COLORS.red;
  };

  // Helper function to get action color
  const getActionColor = (action: string): [number, number, number] => {
    switch (action) {
      case 'BLOCK': return COLORS.red;
      case 'GATE': return COLORS.amber;
      case 'ALLOW': return COLORS.green;
      default: return COLORS.gray;
    }
  };

  // Helper function to draw a rounded rectangle
  const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fillColor: [number, number, number], strokeColor?: [number, number, number]) => {
    doc.setFillColor(...fillColor);
    if (strokeColor) {
      doc.setDrawColor(...strokeColor);
      doc.setLineWidth(0.3);
    }
    doc.roundedRect(x, y, w, h, r, r, strokeColor ? 'FD' : 'F');
  };

  // Helper function to draw section title
  const drawSectionTitle = (title: string, y: number): number => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(title, MARGIN, y);
    return y + 8;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // Check if blocked for under 16
  const isUnder16Blocked = result.childSafetyAnalysis?.overallRisk === 'dangerous' ||
    result.childSafetyAnalysis?.riskCategories?.some(r => r.severity === 'critical');
  const displayOverallScore = isUnder16Blocked ? 0 : result.overallScore;

  // Start building PDF
  currentY = addHeader();

  // ===== OVERALL SAFETY SCORE SECTION =====
  if (checkNewPage(50)) addNewPage();

  // Section background
  drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 45, 3, COLORS.white, COLORS.lightGray);

  currentY += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Overall Safety Score', MARGIN + 5, currentY + 5);

  // Score circle
  const scoreX = PAGE_WIDTH - MARGIN - 25;
  const scoreY = currentY + 15;
  const scoreColor = getScoreColor(displayOverallScore);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2], 0.2);
  doc.circle(scoreX, scoreY, 12, 'F');
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...scoreColor);
  doc.text(`${displayOverallScore}`, scoreX, scoreY + 2, { align: 'center' });
  doc.setFontSize(8);
  doc.text('/100', scoreX, scoreY + 7, { align: 'center' });

  // Progress bar
  const barY = currentY + 15;
  const barWidth = CONTENT_WIDTH - 60;
  doc.setFillColor(...COLORS.lightGray);
  doc.roundedRect(MARGIN + 5, barY, barWidth, 5, 2, 2, 'F');
  doc.setFillColor(...scoreColor);
  doc.roundedRect(MARGIN + 5, barY, (barWidth * displayOverallScore) / 100, 5, 2, 2, 'F');

  // URL
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textDim);
  doc.text(`Scanned URL: ${result.url}`, MARGIN + 5, currentY + 30);

  // Analysis method badge
  const methodText = result.analysisMethod === 'live' ? 'Live Analysis' : 'Demo Mode';
  const methodColor = result.analysisMethod === 'live' ? COLORS.green : COLORS.amber;
  doc.setFillColor(methodColor[0], methodColor[1], methodColor[2], 0.2);
  doc.roundedRect(MARGIN + 5, currentY + 33, 25, 5, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setTextColor(...methodColor);
  doc.text(methodText, MARGIN + 7, currentY + 36.5);

  // Blocked badge if applicable
  if (isUnder16Blocked) {
    doc.setFillColor(COLORS.red[0], COLORS.red[1], COLORS.red[2], 0.2);
    doc.roundedRect(MARGIN + 35, currentY + 33, 35, 5, 2, 2, 'F');
    doc.setTextColor(...COLORS.red);
    doc.text('Blocked for under 16', MARGIN + 37, currentY + 36.5);
  }

  currentY += 50;

  // ===== DEPTH ANALYSIS SECTION =====
  if (checkNewPage(25)) addNewPage();

  currentY = drawSectionTitle('Content Depth Analysis', currentY);

  const depthItems = [
    { label: 'Title', safe: result.childSafetyAnalysis.depthAnalysis.titleSafe },
    { label: 'Metadata', safe: result.childSafetyAnalysis.depthAnalysis.metadataSafe },
    { label: 'Content', safe: result.childSafetyAnalysis.depthAnalysis.contentSafe },
    { label: 'Media', safe: result.childSafetyAnalysis.depthAnalysis.mediaSafe },
  ];

  const itemWidth = (CONTENT_WIDTH - 15) / 4;
  depthItems.forEach((item, idx) => {
    const x = MARGIN + (idx * (itemWidth + 5));
    const bgColor = item.safe ? [220, 252, 231] as [number, number, number] : [254, 226, 226] as [number, number, number];
    const textColor = item.safe ? COLORS.green : COLORS.red;

    drawRoundedRect(x, currentY, itemWidth, 15, 2, bgColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text(item.label, x + itemWidth / 2, currentY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(item.safe ? 'Safe' : 'Unsafe', x + itemWidth / 2, currentY + 11, { align: 'center' });
  });

  currentY += 22;

  // ===== RISK CATEGORIES SECTION =====
  if (result.childSafetyAnalysis.riskCategories.length > 0) {
    if (checkNewPage(40)) addNewPage();

    currentY = drawSectionTitle('Safety Risks Detected', currentY);

    for (const risk of result.childSafetyAnalysis.riskCategories) {
      if (checkNewPage(25)) addNewPage();

      // Risk box
      drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 20, 2, [254, 242, 242] as [number, number, number], [254, 202, 202] as [number, number, number]);

      // Severity badge
      const severityColors: { [key: string]: [number, number, number] } = {
        'critical': COLORS.red,
        'high': [220, 38, 38] as [number, number, number],
        'medium': COLORS.amber,
        'low': [250, 204, 21] as [number, number, number],
      };
      const sevColor = severityColors[risk.severity.toLowerCase()] || COLORS.gray;
      doc.setFillColor(...sevColor);
      doc.roundedRect(MARGIN + 3, currentY + 3, 18, 5, 1, 1, 'F');
      doc.setFontSize(6);
      doc.setTextColor(...COLORS.white);
      doc.text(risk.severity.toUpperCase(), MARGIN + 12, currentY + 6.5, { align: 'center' });

      // Category name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.text);
      doc.text(`${risk.category} (${risk.matchCount} matches)`, MARGIN + 25, currentY + 7);

      // Keywords
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.red);
      const keywordsText = risk.matchedKeywords.slice(0, 5).join(', ');
      doc.text(`Keywords: ${keywordsText}`, MARGIN + 3, currentY + 14);

      currentY += 25;
    }
  }

  // ===== SAFE KEYWORDS SECTION =====
  const safeKeywords = result.contentAnalysis.textAnalysis.safeKeywordsFound;
  if (safeKeywords && safeKeywords.length > 0) {
    if (checkNewPage(30)) addNewPage();

    currentY = drawSectionTitle('Safe Content Indicators', currentY);

    drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 15, 2, [220, 252, 231] as [number, number, number]);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.green);
    const safeText = safeKeywords.slice(0, 10).join(', ');
    doc.text(safeText, MARGIN + 5, currentY + 9);

    currentY += 22;
  }

  // ===== NLP TEXT ANALYSIS SECTION =====
  if (checkNewPage(45)) addNewPage();

  currentY = drawSectionTitle('NLP Text Analysis', currentY);

  drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 35, 3, COLORS.white, COLORS.lightGray);

  // Sentiment
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textDim);
  doc.text('Sentiment:', MARGIN + 5, currentY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text(isUnder16Blocked ? 'Blocked' : result.contentAnalysis.textAnalysis.sentiment, MARGIN + 30, currentY + 8);

  // Language Score
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textDim);
  doc.text('Language Safety:', MARGIN + 5, currentY + 16);
  const langScore = isUnder16Blocked ? 0 : result.contentAnalysis.textAnalysis.languageScore;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...getScoreColor(langScore));
  doc.text(`${langScore}/100`, MARGIN + 35, currentY + 16);

  // Key Topics
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textDim);
  doc.text('Key Topics:', MARGIN + 5, currentY + 24);
  const topics = isUnder16Blocked ? ['Flagged Content'] : result.contentAnalysis.textAnalysis.keyTopics;
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.primary);
  doc.text(topics.slice(0, 5).join(', '), MARGIN + 28, currentY + 24);

  currentY += 42;

  // ===== VISUAL ANALYSIS SECTION =====
  if (!result.usedSearchFallback) {
    if (checkNewPage(35)) addNewPage();

    currentY = drawSectionTitle('Vision AI Analysis', currentY);

    drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 25, 3, COLORS.white, COLORS.lightGray);

    // Visual Safety Score
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textDim);
    doc.text('Visual Safety:', MARGIN + 5, currentY + 8);
    const visualScore = isUnder16Blocked ? 0 : result.contentAnalysis.visualAnalysis.safetyScore;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...getScoreColor(visualScore));
    doc.text(`${visualScore}/100`, MARGIN + 32, currentY + 8);

    // Detected Objects
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textDim);
    doc.text('Objects:', MARGIN + 5, currentY + 16);
    const objects = isUnder16Blocked ? ['Flagged'] : result.contentAnalysis.visualAnalysis.detectedObjects;
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.primary);
    doc.text(objects.slice(0, 6).join(', '), MARGIN + 22, currentY + 16);

    currentY += 32;
  }

  // ===== MULTIMEDIA ANALYSIS SECTION =====
  if (result.contentAnalysis.multimediaAnalysis) {
    if (checkNewPage(30)) addNewPage();

    currentY = drawSectionTitle('Multimedia Analysis', currentY);

    drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 20, 3, COLORS.white, COLORS.lightGray);

    const mm = result.contentAnalysis.multimediaAnalysis;
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textDim);

    doc.text(`Video: ${mm.videoDetected ? 'Detected' : 'None'}`, MARGIN + 5, currentY + 8);
    doc.text(`Audio: ${mm.audioDetected ? 'Detected' : 'None'}`, MARGIN + 50, currentY + 8);
    doc.text('Media Safety:', MARGIN + 95, currentY + 8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...getScoreColor(mm.mediaSafetyScore));
    doc.text(`${mm.mediaSafetyScore}/100`, MARGIN + 120, currentY + 8);

    if (mm.mediaTypes.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.primary);
      doc.text(`Types: ${mm.mediaTypes.join(', ')}`, MARGIN + 5, currentY + 15);
    }

    currentY += 27;
  }

  // ===== AGE GROUP ACTIONS SECTION =====
  if (checkNewPage(60)) addNewPage();

  currentY = drawSectionTitle('Age-Appropriate Actions', currentY);

  const ageGroups = Object.entries(result.ageGroupScores);
  const ageBoxWidth = (CONTENT_WIDTH - 15) / 4;

  ageGroups.forEach(([ageGroup, data], idx) => {
    const x = MARGIN + (idx * (ageBoxWidth + 5));
    const displayAction = isUnder16Blocked ? 'BLOCK' : data.action;
    const displayScore = isUnder16Blocked ? 0 : data.score;
    const actionColor = getActionColor(displayAction);

    // Background
    const bgColor = displayAction === 'BLOCK' ? [254, 242, 242] as [number, number, number]
      : displayAction === 'GATE' ? [255, 251, 235] as [number, number, number]
      : [220, 252, 231] as [number, number, number];

    drawRoundedRect(x, currentY, ageBoxWidth, 40, 3, bgColor, actionColor);

    // Age group label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...actionColor);
    doc.text(ageGroup, x + ageBoxWidth / 2, currentY + 8, { align: 'center' });

    // Action
    doc.setFontSize(12);
    doc.text(displayAction, x + ageBoxWidth / 2, currentY + 18, { align: 'center' });

    // Score
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${displayScore}/100`, x + ageBoxWidth / 2, currentY + 26, { align: 'center' });

    // Risks summary (truncated)
    if (data.risks.length > 0 && !isUnder16Blocked) {
      doc.setFontSize(5);
      doc.setTextColor(...COLORS.textDim);
      const riskText = data.risks[0]?.substring(0, 25) + '...';
      doc.text(riskText, x + ageBoxWidth / 2, currentY + 35, { align: 'center' });
    }
  });

  currentY += 50;

  // ===== METADATA SECTION =====
  if (result.contentAnalysis.metadata) {
    if (checkNewPage(30)) addNewPage();

    currentY = drawSectionTitle('Page Metadata', currentY);

    drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 25, 3, COLORS.lightGray);

    const meta = result.contentAnalysis.metadata;
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.text);

    if (meta.title) {
      const titleLines = wrapText(`Title: ${meta.title}`, CONTENT_WIDTH - 10, 7);
      doc.text(titleLines[0], MARGIN + 5, currentY + 7);
    }

    if (meta.description) {
      const descText = meta.description.substring(0, 100) + '...';
      const descLines = wrapText(`Description: ${descText}`, CONTENT_WIDTH - 10, 7);
      doc.text(descLines[0], MARGIN + 5, currentY + 14);
    }

    const stats = [];
    if (meta.imageCount) stats.push(`${meta.imageCount} images`);
    if (meta.linkCount) stats.push(`${meta.linkCount} links`);
    if (meta.videoCount) stats.push(`${meta.videoCount} videos`);
    if (meta.audioCount) stats.push(`${meta.audioCount} audio`);
    if (stats.length > 0) {
      doc.text(`Stats: ${stats.join(', ')}`, MARGIN + 5, currentY + 21);
    }

    currentY += 32;
  }

  // ===== LAST PAGE - TIMESTAMP AND TAGLINE =====
  if (checkNewPage(40)) addNewPage();

  // Add some spacing before final section
  currentY += 10;

  // Final section background
  drawRoundedRect(MARGIN, currentY, CONTENT_WIDTH, 35, 3, [245, 243, 255] as [number, number, number]);

  // Get local date and time
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  const dateStr = now.toLocaleDateString(undefined, dateOptions);
  const timeStr = now.toLocaleTimeString(undefined, timeOptions);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Date & Time
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('Report Generated', MARGIN + 5, currentY + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  doc.text(`${dateStr}`, MARGIN + 5, currentY + 15);
  doc.text(`${timeStr}`, MARGIN + 5, currentY + 21);
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textDim);
  doc.text(`Timezone: ${timezone}`, MARGIN + 5, currentY + 27);

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.primary);
  doc.text('KOMAL - Ethical AI that guides, not just blocks', PAGE_WIDTH / 2, currentY + 32, { align: 'center' });

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the PDF
  const filename = `KOMAL_Safety_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

// Helper function to load logo as base64
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    const response = await fetch('/logo_bg-remove.svg');
    const svgText = await response.text();

    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 40, 40);

    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 40, 40);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
    return null;
  }
}
