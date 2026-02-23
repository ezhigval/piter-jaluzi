'use client'

import { useState } from 'react'
import { SEOData } from '@/types/seo'
import SEOAnalysis from './SEOAnalysis'

interface SEOEditorProps {
  seo: SEOData
  onChange: (seo: SEOData) => void
  pageUrl?: string
}

export default function SEOEditor({ seo, onChange, pageUrl }: SEOEditorProps) {
  const [keywords, setKeywords] = useState(seo.keywords?.join(', ') || '')
  const [activeTab, setActiveTab] = useState<'editor' | 'analysis'>('editor')

  const updateField = (field: keyof SEOData, value: any) => {
    onChange({ ...seo, [field]: value })
  }

  const updateKeywords = (value: string) => {
    setKeywords(value)
    const keywordArray = value.split(',').map(k => k.trim()).filter(k => k.length > 0)
    updateField('keywords', keywordArray)
  }

  const generateTitle = () => {
    const defaultTitle = 'Jaluxi - Жалюзи в Санкт-Петербурге'
    if (seo.title && !seo.title.includes('Jaluxi')) {
      updateField('title', `${seo.title} | ${defaultTitle}`)
    } else if (!seo.title) {
      updateField('title', defaultTitle)
    }
  }

  const generateDescription = () => {
    const defaultDesc = 'Профессиональные жалюзи в Санкт-Петербурге. Изготовление, установка и ремонт всех видов жалюзи. Горизонтальные, вертикальные, рулонные, римские.'
    updateField('description', defaultDesc)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">SEO Настройки</h3>
        <div className="flex gap-2">
          <button
            onClick={generateTitle}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          >
            Генерировать заголовок
          </button>
          <button
            onClick={generateDescription}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          >
            Генерировать описание
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'editor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Редактор
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Анализ
          </button>
        </nav>
      </div>

      {activeTab === 'editor' && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок (Title)
              <span className="text-xs text-gray-500 ml-2">(~60 символов)</span>
            </label>
            <input
              type="text"
              value={seo.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Заголовок страницы"
              maxLength={70}
            />
            <div className="text-xs text-gray-500 mt-1">
              {seo.title?.length || 0} / 70 символов
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание (Description)
              <span className="text-xs text-gray-500 ml-2">(~160 символов)</span>
            </label>
            <textarea
              value={seo.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Описание страницы для поисковых систем"
              maxLength={170}
            />
            <div className="text-xs text-gray-500 mt-1">
              {seo.description?.length || 0} / 170 символов
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ключевые слова (Keywords)
              <span className="text-xs text-gray-500 ml-2">(через запятую)</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => updateKeywords(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="жалюзи, санкт-петербург, установка, ремонт"
            />
            <div className="text-xs text-gray-500 mt-1">
              {keywords.split(',').filter(k => k.trim()).length} ключевых слов
            </div>
          </div>

          {/* Open Graph */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Open Graph (соцсети)</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Title
                </label>
                <input
                  type="text"
                  value={seo.ogTitle || ''}
                  onChange={(e) => updateField('ogTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Заголовок для соцсетей"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Description
                </label>
                <textarea
                  value={seo.ogDescription || ''}
                  onChange={(e) => updateField('ogDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Описание для соцсетей"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Image
                </label>
                <input
                  type="url"
                  value={seo.ogImage || ''}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Рекомендуемый размер: 1200x630px
                </div>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Дополнительно</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seo.canonicalUrl || ''}
                  onChange={(e) => updateField('canonicalUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={pageUrl}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noIndex"
                  checked={seo.noIndex || false}
                  onChange={(e) => updateField('noIndex', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="noIndex" className="text-sm text-gray-700">
                  Не индексировать страницу (noindex)
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Предпросмотр Google</h4>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-blue-800 text-sm mb-1">
                {pageUrl || 'https://jaluxi.ru/...'}
              </div>
              <div className="text-xl text-blue-900 mb-2 font-medium">
                {seo.title || 'Jaluxi - Жалюзи в Санкт-Петербурге'}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {seo.description || 'Профессиональные жалюзи в Санкт-Петербурге. Изготовление, установка и ремонт всех видов жалюзи.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <SEOAnalysis seo={seo} pageUrl={pageUrl} />
      )}
    </div>
  )
}
