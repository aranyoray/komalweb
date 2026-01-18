import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

// Mock auth for build
const auth = async () => ({ userId: 'guest_user' });

// Helper to get user reports file path
function getUserReportsPath(userId: string) {
  const reportsDir = path.join(process.cwd(), 'data', 'reports');
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

interface SavedReport {
  id: string;
  url: string;
  overallScore: number;
  overallRisk: string;
  timestamp: string;
  title?: string;
  fullReport: any;
}

// GET - Fetch a specific report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const reports = readUserReports(userId);
    const report = reports.find((r) => r.id === id);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}
