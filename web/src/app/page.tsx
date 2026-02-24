'use client'

import { useState, useEffect } from 'react'
import { Material, Promotion } from '@/lib/api'
import BlindsLoader from '@/components/BlindsLoader'
import { useAnimation } from '@/hooks/useAnimation'
import OpenRequestModalButton from '@/components/OpenRequestModalButton'
import SEOHead from '@/components/SEOHead'
import { 
  generateSEOTitle, 
  generateSEODescription, 
  generateKeywords,
  createWebPageStructuredData,
  createOrganizationStructuredData,
  createServiceStructuredData
} from '@/lib/seo-utils'

type PageBlock = { type: string; content: any; order?: number }
type PageContent = { blocks?: PageBlock[] }

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { showAnimation, isFirstVisit, completeAnimation } = useAnimation()

  // SEO Data
  const seoData = {
    title: generateSEOTitle('Жалюзи в Санкт-Петербурге - Изготовление и установка'),
    description: generateSEODescription('жалюзи всех видов: горизонтальные, вертикальные, рулонные, римские'),
    keywords: generateKeywords('жалюзи'),
    ogTitle: 'Северный Контур - Профессиональные жалюзи в Санкт-Петербурге',
    ogDescription: 'Изготовление, установка и ремонт жалюзи. Горизонтальные, вертикальные, рулонные. Гарантия качества.',
    ogImage: '/images/og-home.jpg',
    canonicalUrl: 'https://severnyj-kontur.ru/'
  }

  const structuredData = [
    createWebPageStructuredData(
      'https://severnyj-kontur.ru/',
      seoData.title,
      seoData.description
    ),
    createOrganizationStructuredData(),
    createServiceStructuredData({
      name: 'Изготовление и установка жалюзи',
      description: 'Профессиональные услуги по изготовлению, установке и ремонту всех видов жалюзи в Санкт-Петербурге',
      area: 'Санкт-Петербург',
      priceRange: '₽₽-₽₽₽'
    })
  ]

  const breadcrumbs = [
    { name: 'Главная', url: 'https://jaluxi.ru/' }
  ]

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
        const pageData = await pageRes.json().catch(() => null)
        
        setMaterials(materialsData.slice(0, 6)) // Показываем первые 6 материалов
        setPromotions(promotionsData)
        if (pageData?.success && pageData?.data) setPageContent(pageData.data)
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
    return <BlindsLoader onComplete={completeAnimation} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Загрузка...</div>
      </div>
    )
  }

  const blocks = (pageContent?.blocks ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const hero = blocks.find((b) => b.type === 'hero')?.content
  const cta = blocks.find((b) => b.type === 'cta')?.content

  const heroSubtitle = hero?.subtitle ?? 'Изготовление и ремонт жалюзи в Санкт-Петербурге'
  const heroTitle = hero?.title ?? 'Жалюзи под ваш размер окна за 3–5 дней'
  const heroDescription =
    hero?.description ??
    'Подбираем материалы у надежных поставщиков, собираем жалюзи под ваш проем и выезжаем на замер и установку. Также быстро ремонтируем уже установленные изделия.'

  const ctaTitle = cta?.title ?? 'Готовы заказать жалюзи?'
  const ctaSubtitle = cta?.subtitle ?? 'Получите бесплатную консультацию и расчет стоимости'
  const ctaPrimaryText = cta?.primary?.text ?? 'Рассчитать стоимость'
  const ctaPrimaryLink = cta?.primary?.link ?? '/catalog'
  const ctaSecondaryText = cta?.secondary?.text ?? 'Оставить заявку'

  return (
    <>
      <SEOHead seo={seoData} structuredData={structuredData} breadcrumbs={breadcrumbs} />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-600">
                {heroSubtitle}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <a
                  href={hero?.ctaPrimary?.link ?? '/catalog'}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium hover:bg-slate-800 transition-colors duration-200"
                >
                  {hero?.ctaPrimary?.text ?? 'Рассчитать стоимость'}
                </a>
                <OpenRequestModalButton
                  kind="measure"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-700 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium hover:bg-slate-50 transition-colors duration-200"
                >
                  Вызвать замерщика
                </OpenRequestModalButton>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
                <img 
                  src="/images/materials/horizontal-white.jpg" 
                  alt="Горизонтальные жалюзи в интерьере"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg sm:rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 lg:p-8 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-xl sm:text-2xl">🪟</span>
              </div>
              <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3 text-gray-900">От 1 окна</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Работаем с частными заказами и небольшими офисами.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 lg:p-8 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-xl sm:text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3 text-gray-900">Гарантия 12 месяцев</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Используем сертифицированную фурнитуру и ткани.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 lg:p-8 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-xl sm:text-2xl">🔧</span>
              </div>
              <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3 text-gray-900">Ремонт любых жалюзи</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Восстановим механизм, цепочки, ламели и полотно.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Materials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Популярные материалы
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Качественные ткани и фурнитура от проверенных поставщиков
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <img 
                  src={material.imageURL || material.imageUrl || "/images/materials/horizontal-white.jpg"} 
                  alt={`${material.name} - ${material.category} жалюзи. Светопропускаемость ${material.lightTransmission}%. Jaluxi Санкт-Петербург`}
                  className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 sm:p-6">
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">
                    {material.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-light mt-2 mb-3 sm:mb-4 text-gray-900">
                    {material.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
                    <span>Светопропускаемость: {material.lightTransmission}%</span>
                    <span className="font-medium text-gray-900">
                      {material.pricePerM2} ₽/м²
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium hover:bg-slate-800 transition-colors duration-200"
            >
              Смотреть весь каталог
            </a>
          </div>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
                Акции и специальные предложения
              </h2>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="bg-slate-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  {promotion.badge && (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 mb-4 sm:mb-6">
                      {promotion.badge}
                    </span>
                  )}
                  <h3 className="text-lg sm:text-xl font-light mb-3 sm:mb-4 text-gray-900">{promotion.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{promotion.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            {ctaTitle}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href={ctaPrimaryLink}
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium hover:bg-slate-100 transition-colors duration-200"
            >
              {ctaPrimaryText}
            </a>
            <OpenRequestModalButton
              kind="request"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium hover:bg-slate-800 transition-colors duration-200"
            >
              {ctaSecondaryText}
            </OpenRequestModalButton>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
