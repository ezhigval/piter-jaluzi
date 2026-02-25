'use client'

import { useState } from 'react'
import { SEOData } from '@/lib/site-builder-types'

interface PageSEOEditorProps {
  seo?: SEOData
  onChange: (seo: SEOData) => void
}

export default function PageSEOEditor({ seo, onChange }: PageSEOEditorProps) {
  const [localSeo, setLocalSeo] = useState<SEOData>(seo || {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    canonical: '',
    robots: 'index,follow'
  })

  const handleChange = (field: keyof SEOData, value: any) => {
    const newSeo = { ...localSeo, [field]: value }
    setLocalSeo(newSeo)
    onChange(newSeo)
  }

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0)
    handleChange('keywords', keywords)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO настройки страницы</h3>
        
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (заголовок страницы)
          </label>
          <input
            type="text"
            value={localSeo.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Заголовок страницы (60-70 символов)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Длина: {localSeo.title?.length || 0} символов (рекомендуется 60-70)
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (описание страницы)
          </label>
          <textarea
            value={localSeo.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Описание страницы (150-160 символов)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Длина: {localSeo.description?.length || 0} символов (рекомендуется 150-160)
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (ключевые слова)
          </label>
          <input
            type="text"
            value={localSeo.keywords?.join(', ') || ''}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="ключевое1, ключевое2, ключевое3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Через запятую, 5-10 ключевых слов
          </p>
        </div>

        {/* OG Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Image (изображение для соцсетей)
          </label>
          <input
            type="text"
            value={localSeo.ogImage || ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            placeholder="/images/og-page.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Рекомендуемый размер: 1200x630px
          </p>
        </div>

        {/* Canonical URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canonical URL (канонический URL)
          </label>
          <input
            type="text"
            value={localSeo.canonical || ''}
            onChange={(e) => handleChange('canonical', e.target.value)}
            placeholder="https://severnyj-kontur.onrender.com/page"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Robots */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Robots (индексация)
          </label>
          <select
            value={localSeo.robots || 'index,follow'}
            onChange={(e) => handleChange('robots', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="index,follow">index,follow (индексировать, следовать ссылкам)</option>
            <option value="noindex,follow">noindex,follow (не индексировать, следовать ссылкам)</option>
            <option value="index,nofollow">index,nofollow (индексировать, не следовать ссылкам)</option>
            <option value="noindex,nofollow">noindex,nofollow (не индексировать, не следовать)</option>
          </select>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр в Google</h4>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="text-blue-600 text-sm hover:underline cursor-pointer">
              {localSeo.title || 'Заголовок страницы'}
            </div>
            <div className="text-green-600 text-sm">
              {localSeo.canonical || 'https://severnyj-kontur.onrender.com/page'}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {localSeo.description || 'Описание страницы будет отображаться здесь...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
