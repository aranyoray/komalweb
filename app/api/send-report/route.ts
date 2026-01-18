import { NextRequest, NextResponse } from 'next/server';

const loadNodemailer = () => {
  try {
    const requireFn = eval('require') as NodeRequire;
    return requireFn('nodemailer') as {
      createTransport: (options: Record<string, unknown>) => {
        sendMail: (mailOptions: Record<string, unknown>) => Promise<unknown>;
      };
    };
  } catch (error) {
    console.error('Nodemailer dependency is missing:', error);
    throw new Error('Email service is unavailable. Please install nodemailer.');
  }
};

// Full ReportData interface matching the page structure
interface ReportData {
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

// Generate HTML email template matching the PDF layout exactly
const generateReportHTML = (report: ReportData): string => {
  // Check if blocked for under 16
  const isUnder16Blocked = report.childSafetyAnalysis?.overallRisk === 'dangerous' ||
    report.childSafetyAnalysis?.riskCategories?.some(r => r.severity === 'critical');
  const displayOverallScore = isUnder16Blocked ? 0 : report.overallScore;

  // Helper functions for colors
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return '#dcfce7';
    if (score >= 50) return '#fef3c7';
    return '#fee2e2';
  };

  const getActionStyles = (action: string) => {
    switch (action) {
      case 'BLOCK': return { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' };
      case 'GATE': return { bg: '#fffbeb', border: '#fde68a', text: '#b45309' };
      case 'ALLOW': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' };
      default: return { bg: '#f3f4f6', border: '#e5e7eb', text: '#4b5563' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#facc15';
      default: return '#6b7280';
    }
  };

  // Safe defaults
  const textAnalysis = report.contentAnalysis?.textAnalysis || { sentiment: 'N/A', keyTopics: [], languageScore: 0, safeKeywordsFound: [], unsafeKeywordsFound: [] };
  const visualAnalysis = report.contentAnalysis?.visualAnalysis || { safetyScore: 0, concerns: [], detectedObjects: [], labels: [] };
  const multimediaAnalysis = report.contentAnalysis?.multimediaAnalysis;
  const metadata = report.contentAnalysis?.metadata;
  const depthAnalysis = report.childSafetyAnalysis?.depthAnalysis || { titleSafe: true, metadataSafe: true, contentSafe: true, mediaSafe: true };
  const riskCategories = report.childSafetyAnalysis?.riskCategories || [];
  const safeKeywords = textAnalysis.safeKeywordsFound || [];
  const ageGroupScores = report.ageGroupScores || {};

  // Build depth analysis HTML
  const depthItems = [
    { label: 'Title', safe: depthAnalysis.titleSafe },
    { label: 'Metadata', safe: depthAnalysis.metadataSafe },
    { label: 'Content', safe: depthAnalysis.contentSafe },
    { label: 'Media', safe: depthAnalysis.mediaSafe },
  ];

  // Build risk categories HTML
  const riskCategoriesHTML = riskCategories.map(risk => `
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
      <div style="margin-bottom: 6px;">
        <span style="display: inline-block; background: ${getSeverityColor(risk.severity)}; color: white; font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${risk.severity}</span>
        <span style="font-weight: 600; color: #1f2937; margin-left: 6px; font-size: 12px;">${risk.category}</span>
        <span style="font-size: 10px; color: #6b7280;">(${risk.matchCount} matches)</span>
      </div>
      <div style="margin-bottom: 4px;">
        ${risk.matchedKeywords.slice(0, 5).map(kw => `<span style="display: inline-block; background: #fee2e2; color: #b91c1c; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-right: 3px; margin-bottom: 3px;">${kw}</span>`).join('')}
      </div>
      ${risk.contextSnippets.length > 0 ? `<div style="font-size: 10px; color: #4b5563; font-style: italic;">${risk.contextSnippets[0].substring(0, 80)}...</div>` : ''}
    </div>
  `).join('');

  // Build safe keywords HTML
  const safeKeywordsHTML = safeKeywords.length > 0 ? safeKeywords.slice(0, 12).map(keyword => `
    <span style="display: inline-block; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; font-size: 11px; padding: 3px 10px; border-radius: 16px; margin: 2px 3px 2px 0;">${keyword}</span>
  `).join('') : '';

  // Build age group actions HTML - don't trim reason, mobile optimized
  const ageGroupEntries = Object.entries(ageGroupScores);
  const ageGroupsHTML = ageGroupEntries.map(([age, data]) => {
    const displayAction = isUnder16Blocked ? 'BLOCK' : data.action;
    const displayScore = isUnder16Blocked ? 0 : data.score;
    const displayReason = isUnder16Blocked ? 'Flagged: not age-appropriate for under 16.' : data.reason;
    const styles = getActionStyles(displayAction);
    return `
      <td style="width: 25%; vertical-align: top; padding: 3px;">
        <div style="background: ${styles.bg}; border: 1px solid ${styles.border}; border-radius: 10px; padding: 10px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: ${styles.text}; margin-bottom: 4px;">${age}</div>
          <div style="font-size: 14px; font-weight: 700; color: ${styles.text}; margin-bottom: 3px;">${displayAction}</div>
          <div style="font-size: 9px; color: ${styles.text}; opacity: 0.75; margin-bottom: 4px;">Score: ${displayScore}/100</div>
          <div style="font-size: 8px; color: ${styles.text}; opacity: 0.9; line-height: 1.2;">${displayReason}</div>
        </div>
      </td>
    `;
  }).join('');

  // Build metadata stats
  const stats: string[] = [];
  if (metadata?.imageCount && metadata.imageCount >= 1) stats.push(`${metadata.imageCount} images`);
  if (metadata?.linkCount && metadata.linkCount >= 1) stats.push(`${metadata.linkCount} links`);
  if (metadata?.videoCount && metadata.videoCount >= 1) stats.push(`${metadata.videoCount} videos`);
  if (metadata?.audioCount && metadata.audioCount >= 1) stats.push(`${metadata.audioCount} audio`);

  // Format timestamp
  const reportDate = new Date(report.timestamp);
  const dateStr = reportDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = reportDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Base URL for images (use environment variable or default)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://komalkids.com';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Komal URL / Keyword Safety Report</title>
  <style>
    @media screen and (max-width: 600px) {
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-stack td { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .mobile-full { width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-hide { display: none !important; }
      .mobile-2col td { width: 50% !important; display: inline-block !important; }
      .age-group-table td { width: 50% !important; display: inline-block !important; vertical-align: top !important; }
      .header-table td { display: block !important; width: 100% !important; text-align: center !important; padding: 4px 0 !important; }
      .ai-table td { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <div style="max-width: 650px; margin: 0 auto; padding: 12px;">
    
    <!-- Header: KOMAL on left, komalkids.com on right -->
    <table class="header-table" style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: middle;">
          <table style="border-collapse: collapse; margin: 0 auto;">
            <tr>
              <td style="vertical-align: middle; padding-right: 6px;">
                <img src="${baseUrl}/komaliconnobg.png" alt="KOMAL Logo" style="width: 28px; height: 28px; display: block;" />
              </td>
              <td style="vertical-align: middle;">
                <span style="font-size: 16px; font-weight: 700; color: #6b4e71;">KOMAL</span>
                <span style="font-size: 9px; color: #6b7280; margin-left: 6px;">URL / Keyword Safety Analysis Report</span>
              </td>
            </tr>
          </table>
        </td>
        <td class="mobile-center" style="text-align: right; vertical-align: middle;">
          <span style="font-size: 16px; font-weight: 700; color: #6b4e71;">komalkids.com</span>
        </td>
      </tr>
    </table>

    <!-- Section 1: Overall Safety Score -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 14px; margin-bottom: 10px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <tr>
          <td style="vertical-align: middle;">
            <span style="font-size: 14px; font-weight: 700; color: #6b4e71;">Overall Safety Score</span>
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <div style="display: inline-block; background: ${getScoreBgColor(displayOverallScore)}; padding: 6px 12px; border-radius: 10px; text-align: center;">
              <span style="font-size: 20px; font-weight: 700; color: ${getScoreColor(displayOverallScore)};">${displayOverallScore}</span>
              <span style="font-size: 11px; color: #4b5563;">/100</span>
            </div>
          </td>
        </tr>
      </table>
      
      <!-- Progress Bar -->
      <div style="background: #e5e7eb; border-radius: 4px; height: 6px; overflow: hidden; margin-bottom: 10px;">
        <div style="background: ${getScoreColor(displayOverallScore)}; height: 100%; width: ${displayOverallScore}%; border-radius: 4px;"></div>
      </div>
      
      <!-- URL and Badges -->
      <div style="margin-bottom: 10px;">
        <p style="font-size: 10px; color: #6b7280; margin: 0 0 5px 0; word-break: break-all;">
          Scanned: <span style="font-family: monospace; color: #6b4e71; font-weight: 500;">${report.url}</span>
        </p>
        <div>
          <span style="display: inline-block; background: ${report.analysisMethod === 'live' ? '#dcfce7' : '#fef3c7'}; color: ${report.analysisMethod === 'live' ? '#15803d' : '#b45309'}; font-size: 9px; font-weight: 500; padding: 3px 6px; border-radius: 10px;">${report.analysisMethod === 'live' ? 'Live Analysis' : 'Demo Mode'}</span>
          ${isUnder16Blocked ? '<span style="display: inline-block; background: #fee2e2; color: #b91c1c; font-size: 9px; font-weight: 600; padding: 3px 6px; border-radius: 10px; margin-left: 4px; border: 1px solid #fecaca;">Blocked for under 16</span>' : ''}
        </div>
      </div>
      
      <!-- Depth Analysis -->
      <table class="mobile-2col" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <tr>
          ${depthItems.map(item => `
            <td style="width: 25%; padding: 2px;">
              <div style="background: ${item.safe ? '#f0fdf4' : '#fef2f2'}; color: ${item.safe ? '#15803d' : '#b91c1c'}; padding: 5px; border-radius: 5px; text-align: center;">
                <div style="font-size: 9px; font-weight: 600;">${item.label}</div>
                <div style="font-size: 8px;">${item.safe ? 'Safe' : 'Unsafe'}</div>
              </div>
            </td>
          `).join('')}
        </tr>
      </table>
      
      ${metadata ? `
      <!-- Metadata -->
      <div style="background: #f9fafb; border-radius: 6px; padding: 8px; font-size: 10px;">
        ${metadata.title ? `<p style="margin: 0 0 3px 0; word-break: break-word;"><strong>Title:</strong> ${metadata.title}</p>` : ''}
        ${metadata.description ? `<p style="margin: 0 0 3px 0; word-break: break-word;"><strong>Description:</strong> ${metadata.description}</p>` : ''}
        ${stats.length > 0 ? `<p style="margin: 0;"><strong>Stats:</strong> ${stats.join(', ')}</p>` : ''}
      </div>
      ` : ''}
    </div>

    ${riskCategories.length > 0 ? `
    <!-- Section 2: Safety Risks Detected -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #6b4e71; margin: 0 0 10px 0;">Safety Risks Detected</h2>
      ${riskCategoriesHTML}
    </div>
    ` : ''}

    ${safeKeywordsHTML ? `
    <!-- Section 3: Safe Content Indicators -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px;">
      <h3 style="font-size: 11px; font-weight: 700; color: #6b4e71; margin: 0 0 8px 0;">Safe Content Indicators</h3>
      <div>${safeKeywordsHTML}</div>
    </div>
    ` : ''}

    <!-- Section 4: AI Analysis -->
    <table class="ai-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
      <tr>
        <!-- NLP Text Analysis -->
        <td style="width: ${report.usedSearchFallback ? '100%' : '50%'}; vertical-align: top; padding-right: ${report.usedSearchFallback ? '0' : '5px'};">
          <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px;">
            <h3 style="font-size: 12px; font-weight: 700; color: #6b4e71; margin: 0 0 10px 0;">NLP Text Analysis</h3>
            <div style="margin-bottom: 8px;">
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 2px 0;">Sentiment</p>
              <p style="font-size: 12px; font-weight: 600; color: #6b4e71; margin: 0;">${isUnder16Blocked ? 'Blocked' : textAnalysis.sentiment}</p>
            </div>
            <div style="margin-bottom: 8px;">
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 2px 0;">Language Score</p>
              <p style="font-size: 12px; font-weight: 600; color: ${getScoreColor(isUnder16Blocked ? 0 : textAnalysis.languageScore)}; margin: 0;">${isUnder16Blocked ? 0 : textAnalysis.languageScore}/100</p>
            </div>
            <div>
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 4px 0;">Key Topics</p>
              <div>
                ${(isUnder16Blocked ? ['Flagged Content'] : textAnalysis.keyTopics).slice(0, 4).map(topic => `<span style="display: inline-block; background: rgba(107,78,113,0.1); color: #6b4e71; font-size: 9px; padding: 2px 6px; border-radius: 10px; margin: 1px 2px 1px 0;">${topic}</span>`).join('')}
              </div>
            </div>
          </div>
        </td>

        ${!report.usedSearchFallback ? `
        <!-- Vision AI Analysis -->
        <td style="width: 50%; vertical-align: top; padding-left: 5px;">
          <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px;">
            <h3 style="font-size: 12px; font-weight: 700; color: #6b4e71; margin: 0 0 10px 0;">Vision AI Analysis</h3>
            <div style="margin-bottom: 8px;">
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 2px 0;">Visual Score</p>
              <p style="font-size: 12px; font-weight: 600; color: ${getScoreColor(isUnder16Blocked ? 0 : visualAnalysis.safetyScore)}; margin: 0;">${isUnder16Blocked ? 0 : visualAnalysis.safetyScore}/100</p>
            </div>
            <div>
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 4px 0;">Detected Objects</p>
              <div>
                ${(isUnder16Blocked ? ['Flagged'] : visualAnalysis.detectedObjects).slice(0, 4).map(obj => `<span style="display: inline-block; background: #faf5ff; color: #9333ea; font-size: 9px; padding: 2px 6px; border-radius: 10px; margin: 1px 2px 1px 0;">${obj}</span>`).join('')}
              </div>
            </div>
            ${visualAnalysis.concerns && visualAnalysis.concerns.length > 0 ? `
            <div style="margin-top: 8px;">
              <p style="font-size: 9px; color: #6b7280; margin: 0 0 4px 0;">Concerns</p>
              <div>
                ${visualAnalysis.concerns.slice(0, 3).map(concern => `<span style="display: inline-block; background: #fef2f2; color: #dc2626; font-size: 9px; padding: 2px 6px; border-radius: 10px; margin: 1px 2px 1px 0;">${concern}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </td>
        ` : ''}
      </tr>
    </table>

    ${multimediaAnalysis ? `
    <!-- Section 5: Multimedia Analysis -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px;">
      <h3 style="font-size: 11px; font-weight: 700; color: #6b4e71; margin: 0 0 8px 0;">Multimedia Analysis</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 33%; padding: 3px;">
            <div style="background: #f9fafb; border-radius: 6px; padding: 8px; text-align: center;">
              <div style="font-size: 10px; font-weight: 600; color: #6b4e71;">Video</div>
              <div style="font-size: 9px; color: ${multimediaAnalysis.videoDetected ? '#d97706' : '#16a34a'};">${multimediaAnalysis.videoDetected ? 'Detected' : 'None'}</div>
            </div>
          </td>
          <td style="width: 33%; padding: 3px;">
            <div style="background: #f9fafb; border-radius: 6px; padding: 8px; text-align: center;">
              <div style="font-size: 10px; font-weight: 600; color: #6b4e71;">Audio</div>
              <div style="font-size: 9px; color: ${multimediaAnalysis.audioDetected ? '#d97706' : '#16a34a'};">${multimediaAnalysis.audioDetected ? 'Detected' : 'None'}</div>
            </div>
          </td>
          <td style="width: 34%; padding: 3px;">
            <div style="background: #f9fafb; border-radius: 6px; padding: 8px; text-align: center;">
              <div style="font-size: 10px; font-weight: 600; color: #6b4e71;">Media Safety</div>
              <div style="font-size: 11px; font-weight: 600; color: ${getScoreColor(multimediaAnalysis.mediaSafetyScore)};">${multimediaAnalysis.mediaSafetyScore}/100</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    ` : ''}

    <!-- Section 6: Age-Appropriate Actions -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #6b4e71; margin: 0 0 10px 0;">Age-Appropriate Actions</h2>
      <table class="age-group-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          ${ageGroupsHTML}
        </tr>
      </table>
    </div>

    ${riskCategories.length > 0 ? `
    <!-- Section 7: Content Risk Summary -->
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px; margin-bottom: 10px;">
      <h2 style="font-size: 12px; font-weight: 700; color: #6b4e71; margin: 0 0 8px 0;">Content Risk Summary</h2>
      <table class="mobile-2col" style="width: 100%; border-collapse: collapse;">
        <tr>
          ${riskCategories.slice(0, 4).map(risk => `
            <td style="width: 25%; padding: 3px;">
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; text-align: center;">
                <div style="font-size: 9px; font-weight: 500; color: #6b4e71; text-transform: capitalize; margin-bottom: 3px;">${risk.category}</div>
                <span style="display: inline-block; background: ${getSeverityColor(risk.severity)}; color: white; font-size: 7px; font-weight: 600; padding: 2px 5px; border-radius: 3px; text-transform: uppercase;">${risk.severity}</span>
              </div>
            </td>
          `).join('')}
        </tr>
      </table>
    </div>
    ` : ''}

    <!-- Footer Info -->
    <div style="background: rgba(107,78,113,0.05); border-radius: 12px; padding: 10px; text-align: center; margin-bottom: 10px;">
      <p style="font-size: 8px; color: #6b7280; margin: 0 0 6px 0; line-height: 1.4;">
        This analysis uses deep keyword context analysis, Vision AI, NLP, and multimedia scanning to evaluate child safety.
      </p>
      <p style="font-size: 8px; font-weight: 600; color: #6b4e71; margin: 0;">
        Generated: ${dateStr} at ${timeStr}
      </p>
    </div>

    <!-- Page Footer -->
    <div style="text-align: center; padding: 10px;">
      <p style="font-size: 12px; color: #6b7280; margin: 0;">www.komalkids.com</p>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, report } = body;

    if (!email || !report) {
      return NextResponse.json(
        { error: 'Email and report data are required' },
        { status: 400 }
      );
    }

    // Validate report has minimum required fields
    if (!report.url) {
      return NextResponse.json(
        { error: 'Report must include URL' },
        { status: 400 }
      );
    }

    // Ensure report has defaults for optional fields - matching page structure
    const sanitizedReport: ReportData = {
      url: report.url,
      overallScore: report.overallScore ?? 0,
      ageGroupScores: report.ageGroupScores || {},
      contentAnalysis: {
        textAnalysis: {
          sentiment: report.contentAnalysis?.textAnalysis?.sentiment || 'N/A',
          keyTopics: report.contentAnalysis?.textAnalysis?.keyTopics || [],
          languageScore: report.contentAnalysis?.textAnalysis?.languageScore ?? 0,
          entities: report.contentAnalysis?.textAnalysis?.entities || [],
          unsafeKeywordsFound: report.contentAnalysis?.textAnalysis?.unsafeKeywordsFound || [],
          safeKeywordsFound: report.contentAnalysis?.textAnalysis?.safeKeywordsFound || [],
        },
        visualAnalysis: {
          detectedObjects: report.contentAnalysis?.visualAnalysis?.detectedObjects || [],
          safetyScore: report.contentAnalysis?.visualAnalysis?.safetyScore ?? 0,
          concerns: report.contentAnalysis?.visualAnalysis?.concerns || [],
          labels: report.contentAnalysis?.visualAnalysis?.labels || [],
        },
        multimediaAnalysis: report.contentAnalysis?.multimediaAnalysis,
        metadata: report.contentAnalysis?.metadata,
      },
      childSafetyAnalysis: {
        overallRisk: report.childSafetyAnalysis?.overallRisk || 'safe',
        riskCategories: report.childSafetyAnalysis?.riskCategories || [],
        depthAnalysis: report.childSafetyAnalysis?.depthAnalysis || {
          titleSafe: true,
          metadataSafe: true,
          contentSafe: true,
          mediaSafe: true,
        },
      },
      timestamp: report.timestamp || new Date().toISOString(),
      analysisMethod: report.analysisMethod || 'demo',
      usedSearchFallback: report.usedSearchFallback || false,
    };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use SMTP credentials from environment
    const smtpUser = process.env.SMTP_USER;

    if (!smtpUser) {
      return NextResponse.json(
        { error: 'SMTP configuration is missing. Please configure SMTP_USER in environment variables.' },
        { status: 400 }
      );
    }

    // Create transporter for Titan Email
    const nodemailer = loadNodemailer();
    const port = parseInt(process.env.SMTP_PORT || '587');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.titan.email',
      port: port,
      // Port 587 uses STARTTLS (secure: false), Port 465 uses direct TLS (secure: true)
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = generateReportHTML(sanitizedReport);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"KOMAL Safety" <${smtpUser}>`,
      to: email,
      subject: `Komal URL Safety Report: ${sanitizedReport.url}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending report email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
