import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateSessionToken, validateSessionToken } from '@/lib/sel/session-token';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// OPTIONS: return session token
export async function OPTIONS() {
  const { token } = generateSessionToken();
  return NextResponse.json({ token });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, theme, sceneIndex, sessionToken } = body;

    // Validate session token
    if (!sessionToken || !validateSessionToken(sessionToken)) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 403 });
    }

    // Validate inputs
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }
    if (!theme || typeof theme !== 'string') {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }
    if (typeof sceneIndex !== 'number' || sceneIndex < 0 || sceneIndex > 4) {
      return NextResponse.json({ error: 'Invalid scene index' }, { status: 400 });
    }

    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, returning fallback');
      return NextResponse.json({ imageBase64: null, fallback: true });
    }

    // Generate image with Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'] as unknown as undefined,
      } as Record<string, unknown>,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image from response
    let imageBase64: string | null = null;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageBase64) {
      // Gemini didn't return an image, fallback
      console.warn('Gemini did not return an image for scene', sceneIndex);
      return NextResponse.json({ imageBase64: null, fallback: true });
    }

    return NextResponse.json({ imageBase64, fallback: false });
  } catch (error: unknown) {
    console.error('Image generation error:', error);

    if (error instanceof Error && error.message?.includes('429')) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    return NextResponse.json({ imageBase64: null, fallback: true });
  }
}
