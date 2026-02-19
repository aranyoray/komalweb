import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// ============================================================================
// Auth helper
// ============================================================================

async function verifyAuth(request: NextRequest): Promise<{ uid: string } | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ') || !db) return null;

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAuth().verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

// ============================================================================
// GET /api/reports/categorized
// Group reports by subcategory for parent review.
// Query params: ?childId=xxx&limit=100
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

    // Fetch reports
    const snapshot = await db
      .collection('report-history')
      .where('uid', '==', auth.uid)
      .limit(limit)
      .get();

    const reports: any[] = [];
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });

    // Sort by timestamp descending
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Group by category
    const categorized: Record<string, {
      category: string;
      count: number;
      reports: {
        id: string;
        url: string;
        title: string;
        overallScore: number;
        overallRisk: string;
        timestamp: string;
      }[];
    }> = {};

    for (const report of reports) {
      const fullReport = report.fullReport || {};
      const riskCategories = fullReport.childSafetyAnalysis?.riskCategories || [];

      if (riskCategories.length === 0) {
        // No risk categories - file under "General"
        if (!categorized['General']) {
          categorized['General'] = { category: 'General', count: 0, reports: [] };
        }
        categorized['General'].count++;
        categorized['General'].reports.push({
          id: report.id,
          url: report.url,
          title: report.title || report.url,
          overallScore: report.overallScore,
          overallRisk: report.overallRisk,
          timestamp: report.timestamp,
        });
      } else {
        for (const rc of riskCategories) {
          const cat = rc.category || 'Unknown';
          if (!categorized[cat]) {
            categorized[cat] = { category: cat, count: 0, reports: [] };
          }
          categorized[cat].count++;
          categorized[cat].reports.push({
            id: report.id,
            url: report.url,
            title: report.title || report.url,
            overallScore: report.overallScore,
            overallRisk: report.overallRisk,
            timestamp: report.timestamp,
          });
        }
      }
    }

    // Sort categories by count descending
    const sortedCategories = Object.values(categorized)
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      totalReports: reports.length,
      categories: sortedCategories,
    });
  } catch (error) {
    console.error('[reports/categorized] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categorized reports' }, { status: 500 });
  }
}
