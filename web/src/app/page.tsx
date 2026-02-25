'use client'

import { useState, useEffect } from 'react'
import { Material, Promotion } from '@/lib/api'
import { useAnimation } from '@/hooks/useAnimation'
import OpenRequestModalButton from '@/components/OpenRequestModalButton'
import SEOHead from '@/components/SEOHead'
import BlockRenderer from '@/components/BlockRenderer'
import { 
  generateSEOTitle, 
  generateSEODescription, 
  generateKeywords,
  createWebPageStructuredData,
  createOrganizationStructuredData,
  createServiceStructuredData
} from '@/lib/seo-utils'

type PageContent = {
  id: string
  slug: string
  title: string
  description: string
  blocks: any[]
  isActive: boolean
  lastModified: string
  modifiedBy: string
}

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { showAnimation, isFirstVisit, completeAnimation } = useAnimation()

  // SEO Data
  const seoData = {
    title: generateSEOTitle('Жалюзи под заказ в Санкт-Петербурге', 'Северный Контур'),
    description: generateSEODescription('жалюзи', 'Санкт-Петербург'),
    keywords: generateKeywords('жалюзи', 'Санкт-Петербург'),
    ogImage: '/images/og-home.jpg',
    canonical: 'https://severnyj-kontur.onrender.com',
    robots: 'index,follow'
  }

  const breadcrumbs = [
    { name: 'Главная', url: '/' }
  ]

  const structuredData = [
    createWebPageStructuredData(
      seoData.canonical,
      seoData.title,
      seoData.description
    ),
    createOrganizationStructuredData(),
    createServiceStructuredData({
      name: 'Жалюзи',
      description: 'Изготовление и ремонт жалюзи в Санкт-Петербурге',
      area: 'Санкт-Петербург'
    })
  ]

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, promotionsRes, pageRes] = await Promise.all([
          fetch('/api/materials'),
          fetch('/api/promotions'),
          fetch('/api/pages?slug=/')
        ])
        
        const materialsData = await materialsRes.json()
        const promotionsData = await promotionsRes.json()
        const pageData = await pageRes.json().catch((error) => {
          console.error('Error fetching page data:', error)
          return null
        })
        
        console.log('Page data received:', pageData)
        
        setMaterials(materialsData.slice(0, 6)) // Показываем первые 6 материалов
        setPromotions(promotionsData)
        if (pageData?.success && pageData?.data) {
          console.log('Setting page content:', pageData.data)
          setPageContent(pageData.data)
        } else {
          console.warn('Invalid page data format:', pageData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Показываем анимацию только при первом посещении или обновлении страницы
  if (showAnimation) {
    return null // Анимация теперь обрабатывается в LayoutWithLoading
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Загрузка...</div>
      </div>
    )
  }

  // Если есть контент страницы из конструктора, используем его
  if (pageContent && pageContent.blocks && pageContent.blocks.length > 0) {
    // Сортируем блоки по порядку
    const sortedBlocks = pageContent.blocks
      .filter(block => block.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    return (
      <>
        <SEOHead seo={seoData} structuredData={structuredData} breadcrumbs={breadcrumbs} />
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

  // Иначе показываем статический контент (запасной вариант)
  return (
    <>
      <SEOHead seo={seoData} structuredData={structuredData} breadcrumbs={breadcrumbs} />
      <div className="min-h-screen">
        {/* Здесь можно добавить статические блоки как запасной вариант */}
        <div className="text-center py-20">
          <h1 className="text-4xl font-light mb-4">Северный Контур</h1>
          <p className="text-xl text-gray-600">Жалюзи под заказ в Санкт-Петербурге</p>
        </div>
      </div>
    </>
  )
}
