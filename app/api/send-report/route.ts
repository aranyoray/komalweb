import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ReportData {
  url: string;
  overallScore: number;
  ageGroupActions: {
    [key: string]: {
      action: string;
      reason: string;
      score: number;
    };
  };
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
    };
    visualAnalysis: {
      safetyScore: number;
      concerns: string[];
    };
    metadata?: {
      title?: string;
      description?: string;
    };
  };
  timestamp: string;
}

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate HTML email template for the report
const generateReportHTML = (report: ReportData): string => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getActionColor = (action: string) => {
    if (action === 'BLOCK') return '#ef4444';
    if (action === 'GATE') return '#f59e0b';
    return '#22c55e';
  };

  const ageGroupsHTML = Object.entries(report.ageGroupActions)
    .map(([age, data]) => `
      <div style="background: ${getActionColor(data.action)}15; border: 2px solid ${getActionColor(data.action)}40; border-radius: 12px; padding: 16px; text-align: center;">
        <div style="font-size: 14px; font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">${age}</div>
        <div style="font-size: 24px; font-weight: 700; color: ${getActionColor(data.action)}; margin-bottom: 4px;">${data.action}</div>
        <div style="font-size: 12px; color: #666;">Score: ${data.score}/100</div>
      </div>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KOMAL URL Safety Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #6b4e71 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">KOMAL</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">URL Safety Analysis Report</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- URL Info -->
      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Analyzed URL</p>
        <p style="margin: 0; font-size: 14px; color: #1e3a5f; word-break: break-all; font-family: monospace; background: #f5f5f7; padding: 12px; border-radius: 8px;">${report.url}</p>
      </div>

      <!-- Overall Score -->
      <div style="background: ${getScoreColor(report.overallScore)}15; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Overall Safety Score</p>
        <div style="font-size: 48px; font-weight: 700; color: ${getScoreColor(report.overallScore)};">${report.overallScore}<span style="font-size: 24px; color: #666;">/100</span></div>
        <div style="background: #e5e5e5; border-radius: 8px; height: 8px; margin-top: 16px; overflow: hidden;">
          <div style="background: ${getScoreColor(report.overallScore)}; height: 100%; width: ${report.overallScore}%; border-radius: 8px;"></div>
        </div>
      </div>

      <!-- Age Group Actions -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e3a5f;">Age-Appropriate Actions</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${ageGroupsHTML}
        </div>
      </div>

      <!-- Analysis Summary -->
      <div style="background: #f5f5f7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e3a5f;">Analysis Summary</h3>
        <div style="display: grid; gap: 12px;">
          <div>
            <span style="font-size: 12px; color: #666;">Sentiment:</span>
            <span style="font-size: 14px; color: #1e3a5f; font-weight: 500; margin-left: 8px;">${report.contentAnalysis.textAnalysis.sentiment}</span>
          </div>
          <div>
            <span style="font-size: 12px; color: #666;">Language Score:</span>
            <span style="font-size: 14px; color: #1e3a5f; font-weight: 500; margin-left: 8px;">${report.contentAnalysis.textAnalysis.languageScore}/100</span>
          </div>
          <div>
            <span style="font-size: 12px; color: #666;">Visual Safety:</span>
            <span style="font-size: 14px; color: #1e3a5f; font-weight: 500; margin-left: 8px;">${report.contentAnalysis.visualAnalysis.safetyScore}/100</span>
          </div>
          ${report.contentAnalysis.textAnalysis.keyTopics.length > 0 ? `
          <div>
            <span style="font-size: 12px; color: #666;">Key Topics:</span>
            <span style="font-size: 14px; color: #1e3a5f; font-weight: 500; margin-left: 8px;">${report.contentAnalysis.textAnalysis.keyTopics.join(', ')}</span>
          </div>
          ` : ''}
          ${report.contentAnalysis.visualAnalysis.concerns.length > 0 ? `
          <div>
            <span style="font-size: 12px; color: #666;">Concerns:</span>
            <span style="font-size: 14px; color: #ef4444; font-weight: 500; margin-left: 8px;">${report.contentAnalysis.visualAnalysis.concerns.join(', ')}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Timestamp -->
      <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
        Report generated on ${new Date(report.timestamp).toLocaleString()}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Powered by</p>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1e3a5f;">KOMAL - Digital Guardian for Kids</p>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
        <a href="https://komalkids.com" style="color: #6b4e71; text-decoration: none;">komalkids.com</a>
      </p>
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();
    const htmlContent = generateReportHTML(report);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"KOMAL Safety" <noreply@komalkids.com>',
      to: email,
      subject: `URL Safety Report: ${report.url}`,
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
