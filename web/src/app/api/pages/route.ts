import { NextRequest, NextResponse } from 'next/server'
import { getPublicPageBySlug, listPages } from '@/lib/pages-store-persistent'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  console.log('Fetching pages:', { slug })

  try {
    // Если указан slug, возвращаем конкретную страницу
    if (slug) {
      const page = await getPublicPageBySlug(slug)
      console.log('Page found:', page ? 'yes' : 'no')
      
      if (!page) {
        console.log('Page not found for slug:', slug)
        return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
      }

      console.log('Returning page data:', { id: page.id, blocksCount: page.blocks?.length })
      return NextResponse.json({ success: true, data: page })
    }

    // Иначе возвращаем все страницы (для навигации)
    const pages = await listPages()
    console.log('Returning all pages:', pages.length)
    
    return NextResponse.json({ 
      success: true, 
      data: pages,
      total: pages.length 
    })

  } catch (error) {
    console.error('Error in /api/pages:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
