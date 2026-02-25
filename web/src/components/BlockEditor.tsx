'use client'

import { useState } from 'react'
import { Block, BlockType, BlockContent, BlockStyles, SEOData } from '@/lib/site-builder-types'
import PageSEOEditor from './PageSEOEditor'

interface BlockEditorProps {
  block?: Block
  onSave: (block: Block) => void
  onCancel: () => void
}

export default function BlockEditor({ block, onSave, onCancel }: BlockEditorProps) {
  const [localBlock, setLocalBlock] = useState<Block>(block || {
    id: '',
    type: 'text',
    content: {},
    styles: {},
    seo: {},
    order: 0,
    isActive: true
  })

  const [activeTab, setActiveTab] = useState<'content' | 'styles' | 'seo'>('content')

  const blockTypes: { value: BlockType; label: string; description: string }[] = [
    { value: 'hero', label: 'Hero', description: 'Главный экран с заголовком и кнопками' },
    { value: 'text', label: 'Текст', description: 'Текстовый блок с заголовком и описанием' },
    { value: 'image', label: 'Изображение', description: 'Одиночное изображение с подписью' },
    { value: 'button', label: 'Кнопка', description: 'Кнопка с ссылкой' },
    { value: 'gallery', label: 'Галерея', description: 'Набор изображений' },
    { value: 'features', label: 'Особенности', description: 'Преимущества и возможности' },
    { value: 'testimonials', label: 'Отзывы', description: 'Отзывы клиентов' },
    { value: 'cta', label: 'CTA', description: 'Призыв к действию' },
    { value: 'contact', label: 'Контакты', description: 'Контактная информация' },
    { value: 'form', label: 'Форма', description: 'Контактная форма' },
    { value: 'video', label: 'Видео', description: 'Видеоблок' },
    { value: 'pricing', label: 'Цены', description: 'Тарифные планы' },
    { value: 'team', label: 'Команда', description: 'Сотрудники компании' },
    { value: 'faq', label: 'FAQ', description: 'Вопросы и ответы' },
    { value: 'stats', label: 'Статистика', description: 'Цифры и достижения' }
  ]

  const handleTypeChange = (type: BlockType) => {
    // Сбрасываем контент при смене типа блока
    const defaultContent = getDefaultContent(type)
    setLocalBlock({
      ...localBlock,
      type,
      content: defaultContent
    })
  }

  const getDefaultContent = (type: BlockType): BlockContent => {
    switch (type) {
      case 'hero':
        return {
          title: 'Заголовок',
          subtitle: 'Подзаголовок',
          description: 'Описание главного экрана',
          buttons: [
            { text: 'Главная кнопка', link: '/', style: 'primary' },
            { text: 'Второстепенная кнопка', link: '/contacts', style: 'secondary' }
          ]
        }
      case 'text':
        return {
          title: 'Заголовок текстового блока',
          text: 'Содержимое текстового блока...'
        }
      case 'image':
        return {
          title: 'Заголовок изображения',
          image: {
            src: '/images/placeholder.jpg',
            alt: 'Описание изображения'
          }
        }
      case 'button':
        return {
          button: {
            text: 'Нажми меня',
            link: '/',
            style: 'primary'
          }
        }
      case 'cta':
        return {
          title: 'Готовы начать?',
          subtitle: 'Свяжитесь с нами прямо сейчас',
          buttons: [
            { text: 'Начать', link: '/contacts', style: 'primary' }
          ]
        }
      default:
        return {
          title: 'Заголовок блока',
          description: 'Описание блока'
        }
    }
  }

  const handleContentChange = (field: string, value: any) => {
    setLocalBlock({
      ...localBlock,
      content: {
        ...localBlock.content,
        [field]: value
      }
    })
  }

  const handleStylesChange = (field: keyof BlockStyles, value: any) => {
    setLocalBlock({
      ...localBlock,
      styles: {
        ...localBlock.styles,
        [field]: value
      }
    })
  }

  const handleSEOChange = (seo: SEOData) => {
    setLocalBlock({
      ...localBlock,
      seo
    })
  }

  const handleSave = () => {
    // Генерируем ID если его нет
    const blockToSave = {
      ...localBlock,
      id: localBlock.id || `block-${Date.now()}`,
      order: localBlock.order || 0
    }
    onSave(blockToSave)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {block ? 'Редактировать блок' : 'Создать блок'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {(['content', 'styles', 'seo'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'content' ? 'Контент' : tab === 'styles' ? 'Стили' : 'SEO'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Type selector */}
              {!block && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип блока
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {blockTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        className={`p-3 text-left border rounded-lg transition-colors ${
                          localBlock.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content fields based on type */}
              <ContentFields
                type={localBlock.type}
                content={localBlock.content}
                onChange={handleContentChange}
              />
            </div>
          )}

          {activeTab === 'styles' && (
            <StylesEditor
              styles={localBlock.styles}
              onChange={handleStylesChange}
            />
          )}

          {activeTab === 'seo' && (
            <PageSEOEditor
              seo={localBlock.seo}
              onChange={handleSEOChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Компонент для полей контента в зависимости от типа блока
function ContentFields({ 
  type, 
  content, 
  onChange 
}: { 
  type: BlockType; 
  content: BlockContent; 
  onChange: (field: string, value: any) => void 
}) {
  switch (type) {
    case 'hero':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => onChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={content.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )

    case 'text':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Текст</label>
            <textarea
              value={content.text || ''}
              onChange={(e) => onChange('text', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )

    case 'image':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
            <input
              type="text"
              value={content.image?.src || ''}
              onChange={(e) => onChange('image', { ...content.image, src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alt текст</label>
            <input
              type="text"
              value={content.image?.alt || ''}
              onChange={(e) => onChange('image', { ...content.image, alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )

    default:
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )
  }
}

// Компонент для редактора стилей
function StylesEditor({ 
  styles, 
  onChange 
}: { 
  styles?: BlockStyles; 
  onChange: (field: keyof BlockStyles, value: any) => void 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Цвет фона</label>
        <input
          type="text"
          value={styles?.backgroundColor || ''}
          onChange={(e) => onChange('backgroundColor', e.target.value)}
          placeholder="#ffffff"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Цвет текста</label>
        <input
          type="text"
          value={styles?.textColor || ''}
          onChange={(e) => onChange('textColor', e.target.value)}
          placeholder="#000000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Отступы</label>
        <input
          type="text"
          value={styles?.padding || ''}
          onChange={(e) => onChange('padding', e.target.value)}
          placeholder="2rem 0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Выравнивание текста</label>
        <select
          value={styles?.textAlign || 'left'}
          onChange={(e) => onChange('textAlign', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="left">По левому краю</option>
          <option value="center">По центру</option>
          <option value="right">По правому краю</option>
        </select>
      </div>
    </div>
  )
}
