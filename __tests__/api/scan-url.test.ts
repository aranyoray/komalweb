import { POST } from '@/app/api/scan-url/route';
import { NextRequest } from 'next/server';

// Mock firebase-admin to avoid credential issues in tests
jest.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: () => ({
      add: jest.fn().mockResolvedValue({ id: 'test-id' }),
    }),
  },
}));

// Mock Google Cloud clients
jest.mock('@google-cloud/vision', () => ({
  ImageAnnotatorClient: jest.fn().mockImplementation(() => ({
    annotateImage: jest.fn().mockResolvedValue([{}]),
  })),
}));

jest.mock('@google-cloud/language', () => ({
  LanguageServiceClient: jest.fn().mockImplementation(() => ({
    analyzeSentiment: jest.fn().mockResolvedValue([{
      documentSentiment: { score: 0.5, magnitude: 0.5 },
    }]),
    analyzeEntities: jest.fn().mockResolvedValue([{ entities: [] }]),
  })),
}));

describe('Scan URL API', () => {
  it('should return 400 for empty input', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: '' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return 400 for missing url field', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should analyze a safe educational keyword', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'math learning for kids' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('overallScore');
    expect(data).toHaveProperty('ageGroupScores');
    expect(data).toHaveProperty('childSafetyAnalysis');
    expect(data.overallScore).toBeGreaterThanOrEqual(0);
  });

  it('should block dangerous keywords', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'pornhub' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.overallScore).toBe(0);
    expect(data.ageGroupScores['<10'].action).toBe('BLOCK');
  });

  it('should handle social media platforms appropriately', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'facebook.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('ageGroupScores');
    // Social media should be blocked for young children
    expect(data.ageGroupScores['<10'].action).toBe('BLOCK');
  });

  it('should return proper response structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'wikipedia' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('overallScore');
    expect(data).toHaveProperty('ageGroupScores');
    expect(data).toHaveProperty('contentAnalysis');
    expect(data).toHaveProperty('childSafetyAnalysis');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('analysisMethod');
  });
});
