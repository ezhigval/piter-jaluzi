import { NextRequest, NextResponse } from 'next/server'
import { getPublicPageBySlug } from '@/lib/pages-store-persistent'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? '/'

  console.log('Fetching page for slug:', slug)

  try {
    const page = await getPublicPageBySlug(slug)
    console.log('Page found:', page ? 'yes' : 'no')
    
    if (!page) {
      console.log('Page not found for slug:', slug)
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    console.log('Returning page data:', { id: page.id, blocksCount: page.blocks?.length })
    return NextResponse.json({ success: true, data: page })
  } catch (error) {
    console.error('Error in /api/pages:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
