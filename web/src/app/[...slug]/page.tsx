'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import BlockRenderer from '@/components/BlockRenderer'
import SEOHead from '@/components/SEOHead'
import { Page } from '@/lib/site-builder-types'

export default function DynamicPage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? `/${params.slug.join('/')}` : `/${params.slug || ''}`
  
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPage()
  }, [slug])

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setPage(data.data)
      } else {
        setError(data.error || 'Страница не найдена')
      }
    } catch (err) {
      setError('Ошибка при загрузке страницы')
      console.error('Error fetching page:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Загрузка...</div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Страница не найдена</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <a 
            href="/" 
            className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-medium hover:bg-slate-800 transition-colors duration-200"
          >
            Вернуться на главную
          </a>
        </div>
      </div>
    )
  }

  // Сортируем блоки по порядку
  const sortedBlocks = page.blocks
    .filter(block => block.isActive)
    .sort((a, b) => a.order - b.order)

  // Генерируем SEO данные
  const seoData = {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description,
    keywords: page.seo?.keywords || [],
    ogImage: page.seo?.ogImage,
    canonical: page.seo?.canonical || `https://severnyj-kontur.onrender.com${page.slug}`,
    robots: page.seo?.robots || 'index,follow',
    structuredData: page.seo?.structuredData
  }

  return (
    <>
      <SEOHead seo={seoData} />
      <div className="min-h-screen">
        {sortedBlocks.map((block) => (
          <BlockRenderer 
            key={block.id} 
            block={block}
          />
        ))}
      </div>
    </>
  )
}
