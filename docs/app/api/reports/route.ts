import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

// Mock auth for build
const auth = async () => ({ userId: 'guest_user' });

// Helper to get user reports file path
function getUserReportsPath(userId: string) {
  const reportsDir = path.join(process.cwd(), 'data', 'reports');
  // Ensure directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  return path.join(reportsDir, `${userId}.json`);
}

// Helper to read user reports
function readUserReports(userId: string): SavedReport[] {
  const filePath = getUserReportsPath(userId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write user reports
function writeUserReports(userId: string, reports: SavedReport[]) {
  const filePath = getUserReportsPath(userId);
  fs.writeFileSync(filePath, JSON.stringify(reports, null, 2));
}

interface SavedReport {
  id: string;
  url: string;
  overallScore: number;
  overallRisk: string;
  timestamp: string;
  title?: string;
  fullReport: any;
}

// GET - Fetch all reports for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = readUserReports(userId);

    // Return reports sorted by timestamp (newest first)
    const sortedReports = reports.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ reports: sortedReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST - Save a new report for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { report } = body;

    if (!report) {
      return NextResponse.json({ error: 'Report is required' }, { status: 400 });
    }

    // Read existing reports
    const reports = readUserReports(userId);

    // Create saved report object
    const savedReport: SavedReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: report.url,
      overallScore: report.overallScore,
      overallRisk: report.childSafetyAnalysis?.overallRisk || 'unknown',
      timestamp: report.timestamp || new Date().toISOString(),
      title: report.contentAnalysis?.metadata?.title || report.url,
      fullReport: report,
    };

    // Add new report at the beginning
    reports.unshift(savedReport);

    // Keep only last 100 reports per user
    const trimmedReports = reports.slice(0, 100);

    // Write reports back
    writeUserReports(userId, trimmedReports);

    return NextResponse.json({
      success: true,
      report: savedReport,
      message: 'Report saved successfully'
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}

// DELETE - Delete a specific report
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Read existing reports
    const reports = readUserReports(userId);

    // Filter out the report to delete
    const filteredReports = reports.filter((r) => r.id !== reportId);

    if (filteredReports.length === reports.length) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Write reports back
    writeUserReports(userId, filteredReports);

    return NextResponse.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
