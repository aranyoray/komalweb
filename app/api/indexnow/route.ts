import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { getAuth } from 'firebase-admin/auth'

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  try {
    await getAuth().verifyIdToken(authHeader.split('Bearer ')[1])
    return true
  } catch {
    return false
  }
}

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || ''
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://komalkids.com'

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
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request.headers)
    if (isRateLimited(`indexnow:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!INDEXNOW_KEY) {
      return NextResponse.json({ error: 'IndexNow not configured' }, { status: 500 })
    }

    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0 || urls.length > 100) {
      return NextResponse.json(
        { error: 'Please provide an array of 1-100 URLs to submit' },
        { status: 400 }
      )
    }

    // Only allow URLs under our own domain to prevent SEO spam abuse
    const siteHost = new URL(SITE_URL).host
    for (const u of urls) {
      if (typeof u !== 'string') {
        return NextResponse.json({ error: 'All URLs must be strings' }, { status: 400 })
      }
      // Allow relative paths (will be resolved by submitToIndexNow) and own-domain URLs
      if (u.startsWith('/')) continue
      try {
        const parsed = new URL(u)
        if (parsed.host !== siteHost) {
          return NextResponse.json(
            { error: `URL not allowed: only ${siteHost} URLs accepted` },
            { status: 400 }
          )
        }
      } catch {
        return NextResponse.json({ error: `Invalid URL: ${u.slice(0, 100)}` }, { status: 400 })
      }
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
export async function GET(request: NextRequest) {
  try {
    // Rate limit: 2 bulk submissions per minute per IP
    const ip = getClientIp(request.headers)
    if (isRateLimited(`indexnow-bulk:${ip}`, 2, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!INDEXNOW_KEY) {
      return NextResponse.json({ error: 'IndexNow not configured' }, { status: 500 })
    }

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
