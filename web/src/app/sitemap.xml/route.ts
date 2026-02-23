import { NextResponse } from 'next/server'

interface SitemapEntry {
  url: string
  lastModified: string
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export async function GET() {
  const baseUrl = 'https://jaluxi.ru'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: currentDate,
      changeFreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: currentDate,
      changeFreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/repair`,
      lastModified: currentDate,
      changeFreq: 'weekly',
      priority: 0.8
    }
  ]

  // Dynamic pages (materials, services)
  let dynamicPages: SitemapEntry[] = []

  try {
    // Fetch materials for catalog pages
    const materialsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/materials`)
    if (materialsRes.ok) {
      const materials = await materialsRes.json()
      
      // Add category pages
      const categories = [...new Set(materials.map((m: any) => m.category))] as string[]
      categories.forEach((category: string) => {
        dynamicPages.push({
          url: `${baseUrl}/catalog?category=${encodeURIComponent(category)}`,
          lastModified: currentDate,
          changeFreq: 'weekly',
          priority: 0.8
        })
      })

      // Add individual material pages
      materials.forEach((material: any) => {
        dynamicPages.push({
          url: `${baseUrl}/catalog/${material.id}`,
          lastModified: new Date(material.updatedAt || currentDate).toISOString(),
          changeFreq: 'monthly',
          priority: 0.6
        })
      })
    }

    // Fetch pages from CMS
    const pagesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/pages`)
    if (pagesRes.ok) {
      const pages = await pagesRes.json()
      pages.forEach((page: any) => {
        if (page.slug && page.slug !== '/' && page.isActive) {
          dynamicPages.push({
            url: `${baseUrl}${page.slug}`,
            lastModified: page.lastModified || currentDate,
            changeFreq: 'weekly',
            priority: 0.7
          })
        }
      })
    }
  } catch (error) {
    console.error('Error fetching dynamic data for sitemap:', error)
  }

  const allPages = [...staticPages, ...dynamicPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
