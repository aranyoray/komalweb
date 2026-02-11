import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = 'abfcb24594d9c1abc2e2656951e70958'
const SITE_URL = 'https://komalkids.com'

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of URLs to submit' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'komalkids.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.map((url: string) =>
          url.startsWith('http') ? url : `${SITE_URL}${url}`
        ),
      }),
    })

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
