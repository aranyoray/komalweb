import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

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
// GET /api/reports/trends
// Trend analytics: categories over time, risk trends, per-child.
// Query params: ?days=30&childId=xxx
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`reports-trends:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedDays = parseInt(searchParams.get('days') || '30', 10);
    const days = Math.min(Math.max(Number.isNaN(parsedDays) ? 30 : parsedDays, 1), 90);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Fetch reports within the time window
    const snapshot = await db
      .collection('report-history')
      .where('uid', '==', auth.uid)
      .limit(500)
      .get();

    const reports: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (new Date(data.timestamp) >= cutoffDate) {
        reports.push(data);
      }
    });

    // Sort by timestamp ascending for trend analysis
    reports.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Daily scan counts
    const dailyCounts: Record<string, number> = {};
    // Daily average scores
    const dailyScores: Record<string, { total: number; count: number }> = {};
    // Risk level distribution
    const riskDistribution: Record<string, number> = {
      safe: 0, caution: 0, unsafe: 0, dangerous: 0,
    };
    // Category frequency over time
    const categoryTrends: Record<string, { count: number; firstSeen: string; lastSeen: string }> = {};
    // Weekly summaries
    const weeklySummaries: { week: string; scanCount: number; avgScore: number; topCategory: string }[] = [];

    for (const report of reports) {
      const date = new Date(report.timestamp).toISOString().split('T')[0];

      // Daily counts
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;

      // Daily scores
      if (!dailyScores[date]) dailyScores[date] = { total: 0, count: 0 };
      dailyScores[date].total += report.overallScore || 0;
      dailyScores[date].count++;

      // Risk distribution
      const risk = report.overallRisk || 'safe';
      if (riskDistribution[risk] !== undefined) {
        riskDistribution[risk]++;
      }

      // Category trends
      const fullReport = report.fullReport || {};
      const riskCategories = fullReport.childSafetyAnalysis?.riskCategories || [];
      for (const rc of riskCategories) {
        const cat = rc.category || 'Unknown';
        if (!categoryTrends[cat]) {
          categoryTrends[cat] = { count: 0, firstSeen: date, lastSeen: date };
        }
        categoryTrends[cat].count++;
        categoryTrends[cat].lastSeen = date;
      }
    }

    // Build daily average scores
    const dailyAvgScores: Record<string, number> = {};
    for (const [date, data] of Object.entries(dailyScores)) {
      dailyAvgScores[date] = Math.round(data.total / data.count);
    }

    // Build weekly summaries
    const weekMap = new Map<string, { scores: number[]; categories: Map<string, number> }>();
    for (const report of reports) {
      const date = new Date(report.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { scores: [], categories: new Map() });
      }
      const week = weekMap.get(weekKey)!;
      week.scores.push(report.overallScore || 0);

      const fullReport = report.fullReport || {};
      const riskCategories = fullReport.childSafetyAnalysis?.riskCategories || [];
      for (const rc of riskCategories) {
        const cat = rc.category || 'Unknown';
        week.categories.set(cat, (week.categories.get(cat) || 0) + 1);
      }
    }

    for (const [week, data] of weekMap) {
      const avgScore = data.scores.length > 0
        ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
        : 0;
      let topCategory = 'None';
      let topCount = 0;
      for (const [cat, count] of data.categories) {
        if (count > topCount) { topCategory = cat; topCount = count; }
      }
      weeklySummaries.push({ week, scanCount: data.scores.length, avgScore, topCategory });
    }

    // Top categories sorted by frequency
    const topCategories = Object.entries(categoryTrends)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([category, data]) => ({ category, ...data }));

    return NextResponse.json({
      period: { days, from: cutoffDate.toISOString(), to: new Date().toISOString() },
      totalScans: reports.length,
      dailyCounts,
      dailyAvgScores,
      riskDistribution,
      topCategories,
      weeklySummaries,
    });
  } catch (error) {
    console.error('[reports/trends] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}
