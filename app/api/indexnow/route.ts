import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = 'abfcb24594d9c1abc2e2656951e70958'
const SITE_URL = 'https://komalkids.com'

// All public URLs to submit for indexing
const ALL_URLS = [
  '/',
  '/content-safety',
  '/meet-komal',
  '/why',
  '/mindfulness',
  '/about-komal',
  '/safety-trust',
  '/ai-companion-for-kids',
  '/pricing',
  '/demo',
  '/pioneer',
  '/parents',
  '/parents/0-5',
  '/parents/6-10',
  '/parents/10-13',
  '/parents/13-16',
  '/parents/16-plus',
  '/children',
  '/caregivers',
  '/institutions',
  '/for-schools',
  '/for-clinics',
  '/for-healthcare',
  '/for-employers',
  '/for-government',
  '/geo/usa',
  '/geo/india',
  '/blog',
  '/blog/is-ai-safe-for-kids',
  '/blog/what-is-digital-buddy-for-children',
  '/blog/is-ai-safe-for-kids-parent',
  '/blog/is-ai-safe-for-kids-tech',
  '/blog/is-ai-safe-for-kids-educator',
  '/blog/is-ai-safe-for-kids-trust',
  '/blog/is-ai-safe-for-kids-policy',
  '/team',
  '/investors',
  '/marketing',
  '/help',
  '/ambassador',
  '/privacy-policy',
  '/terms-of-service',
]

async function submitToIndexNow(urls: string[]) {
  const fullUrls = urls.map((url: string) =>
    url.startsWith('http') ? url : `${SITE_URL}${url}`
  )

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'komalkids.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: fullUrls,
    }),
  })

  return response
}

// POST: Submit specific URLs
export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of URLs to submit' },
        { status: 400 }
      )
    }

    const response = await submitToIndexNow(urls)

    if (response.ok || response.status === 200 || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: `Submitted ${urls.length} URL(s) to IndexNow`,
      })
    }

    return NextResponse.json(
      { error: `IndexNow returned status ${response.status}` },
      { status: response.status }
    )
  } catch (error) {
    console.error('IndexNow submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow' },
      { status: 500 }
    )
  }
}

// GET: Submit all known public URLs (useful for post-deploy indexing)
export async function GET() {
  try {
    const response = await submitToIndexNow(ALL_URLS)

    if (response.ok || response.status === 200 || response.status === 202) {
      return NextResponse.json({
        success: true,
        message: `Submitted all ${ALL_URLS.length} URLs to IndexNow`,
        urls: ALL_URLS,
      })
    }

    return NextResponse.json(
      { error: `IndexNow returned status ${response.status}` },
      { status: response.status }
    )
  } catch (error) {
    console.error('IndexNow bulk submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow' },
      { status: 500 }
    )
  }
}
