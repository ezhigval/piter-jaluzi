import { NextRequest, NextResponse } from 'next/server'
import { getPublicPageBySlug } from '@/lib/pages-store'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? '/'

  const page = getPublicPageBySlug(slug)
  if (!page) {
    return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: page })
}
