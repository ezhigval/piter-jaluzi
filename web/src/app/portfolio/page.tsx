'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: 'horizontal' | 'vertical' | 'roller' | 'repair'
  images: string[]
  beforeAfter?: {
    before: string
    after: string
  }
  tags: string[]
  featured: boolean
  createdAt: string
  modifiedAt: string
  createdBy: string
}

const categories = [
  { id: 'all', name: 'Все работы', icon: '🎨' },
  { id: 'horizontal', name: 'Горизонтальные', icon: '🪟' },
  { id: 'vertical', name: 'Вертикальные', icon: '🪩' },
  { id: 'roller', name: 'Рулонные', icon: '🪭' },
  { id: 'repair', name: 'Ремонт', icon: '🔧' }
]

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      const data = await response.json()
      if (data.success) {
        setPortfolio(data.data)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPortfolio = selectedCategory === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCategory)

  const featuredItems = portfolio.filter(item => item.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Наши работы - Северный Контур</title>
        <meta name="description" content="Портфолио выполненных работ по установке и ремонту жалюзи в Санкт-Петербурге" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Наши работы</h1>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto">
                Гордимся каждым проектом. Посмотрите примеры наших работ по установке и ремонту жалюзи
              </p>
            </div>
          </div>
        </div>

        {/* Featured Works */}
        {featuredItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Избранные работы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative h-64">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Избранное
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-64">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.beforeAfter && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      До/После
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPortfolio.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600 text-lg">Работы в этой категории пока не добавлены</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Хотите такой же результат?</h2>
              <p className="text-xl text-slate-200 mb-8">
                Свяжитесь с нами для бесплатной консультации и расчета стоимости
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/catalog"
                  className="bg-white text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Рассчитать стоимость
                </Link>
                <Link
                  href="/contacts"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-slate-900 transition-colors"
                >
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for selected item */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                  ✕
                </button>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {selectedItem.images.map((image, index) => (
                    <div key={index} className="relative h-64">
                      <Image
                        src={image}
                        alt={`${selectedItem.title} - изображение ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  
                  {selectedItem.beforeAfter && (
                    <>
                      <div className="relative h-64">
                        <Image
                          src={selectedItem.beforeAfter.before}
                          alt="До"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                          До
                        </div>
                      </div>
                      <div className="relative h-64">
                        <Image
                          src={selectedItem.beforeAfter.after}
                          alt="После"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                          После
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.title}</h3>
                  <p className="text-gray-600 mb-6">{selectedItem.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-500">
                      Дата добавления: {new Date(selectedItem.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
