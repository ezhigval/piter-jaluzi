'use client'

import React, { useState } from 'react'
import { PageBlock } from '@/lib/pages-store'

type Props = {
  block: PageBlock
  onUpdate: (updates: Partial<PageBlock>) => void
  canEdit: boolean
}

export default function VisualBlockEditor({ block, onUpdate, canEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editField, setEditField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState('')

  const handleStartEdit = (field: string, currentValue: string) => {
    if (!canEdit) return
    setEditField(field)
    setTempValue(currentValue)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!editField) return
    
    const content = block.content || {}
    const keys = editField.split('.')
    let updatedContent = { ...content }
    
    // Handle nested keys like "cta.text"
    if (keys.length === 2) {
      updatedContent = {
        ...updatedContent,
        [keys[0]]: {
          ...(updatedContent[keys[0]] || {}),
          [keys[1]]: tempValue
        }
      }
    } else {
      updatedContent[editField] = tempValue
    }
    
    onUpdate({ content: updatedContent })
    setIsEditing(false)
    setEditField(null)
    setTempValue('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditField(null)
    setTempValue('')
  }

  const renderEditableText = (text: string, field: string, className: string = '') => {
    if (isEditing && editField === field) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          className={`bg-white border-2 border-blue-500 px-2 py-1 rounded text-gray-900 ${className}`}
          autoFocus
        />
      )
    }

    return (
      <span
        onClick={() => handleStartEdit(field, text)}
        className={`${canEdit ? 'hover:bg-blue-50 hover:border-blue-200 cursor-text' : ''} ${className}`}
        title={canEdit ? 'Нажмите для редактирования' : ''}
      >
        {text}
      </span>
    )
  }

  const c = block.content || {}

  if (block.type === 'hero') {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 text-gray-900 rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="space-y-4">
            <div className="inline-flex w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              {renderEditableText(c.subtitle || 'Подзаголовок', 'subtitle', 'block')}
            </div>
            <h1 className="text-3xl font-light tracking-tight text-gray-900 leading-tight">
              {renderEditableText(c.title || 'Заголовок', 'title', 'block')}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {renderEditableText(c.description || 'Описание', 'description', 'block')}
            </p>
            <div className="flex gap-4 pt-4">
              <div className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 font-medium">
                {renderEditableText(c.cta?.text || 'Кнопка', 'cta.text', 'block')}
              </div>
              <div className="inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-700 px-6 py-3 font-medium">
                {renderEditableText(c.ctaSecondary?.text || 'Вторая кнопка', 'ctaSecondary.text', 'block')}
              </div>
            </div>
          </div>
        </div>
        {c.backgroundImage && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img src={c.backgroundImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    )
  }

  if (block.type === 'text') {
    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-light mb-4 text-gray-900">
          {renderEditableText(c.title || 'Заголовок', 'title', 'block')}
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {renderEditableText(c.body || 'Текст блока', 'body', 'block')}
          </p>
        </div>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div className="bg-white rounded-lg overflow-hidden">
        {c.url && (
          <img src={c.url} alt={c.alt || ''} className="w-full h-64 object-cover" />
        )}
        <div className="p-4">
          <p className="text-sm text-gray-600">
            {renderEditableText(c.caption || 'Подпись изображения', 'caption', 'block')}
          </p>
        </div>
      </div>
    )
  }

  if (block.type === 'features') {
    const features = c.features || [
      { title: 'Особенность 1', description: 'Описание особенности 1', icon: '🪟' },
      { title: 'Особенность 2', description: 'Описание особенности 2', icon: '🛡️' },
      { title: 'Особенность 3', description: 'Описание особенности 3', icon: '🔧' }
    ]

    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-light mb-8 text-center text-gray-900">
          {renderEditableText(c.title || 'Наши преимущества', 'title', 'block')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature: any, index: number) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-light mb-2 text-gray-900">
                {renderEditableText(feature.title, `features.${index}.title`, 'block')}
              </h3>
              <p className="text-gray-600 text-sm">
                {renderEditableText(feature.description, `features.${index}.description`, 'block')}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === 'cta') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-light mb-4">
          {renderEditableText(c.title || 'Готовы заказать?', 'title', 'block')}
        </h2>
        <p className="text-xl text-slate-300 mb-6">
          {renderEditableText(c.subtitle || 'Подзаголовок CTA', 'subtitle', 'block')}
        </p>
        <div className="flex gap-4 justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-3 font-medium">
            {renderEditableText(c.primary?.text || 'Основная кнопка', 'primary.text', 'block')}
          </div>
          <div className="inline-flex items-center justify-center rounded-full border border-slate-600 text-white px-6 py-3 font-medium">
            {renderEditableText(c.secondary?.text || 'Вторичная кнопка', 'secondary.text', 'block')}
          </div>
        </div>
      </div>
    )
  }

  if (block.type === 'testimonials') {
    const testimonials = c.testimonials || [
      { name: 'Иван Петров', text: 'Отличная работа, рекомендую!', rating: 5 },
      { name: 'Мария Иванова', text: 'Быстро и качественно, спасибо!', rating: 5 }
    ]

    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-light mb-8 text-center text-gray-900">
          {renderEditableText(c.title || 'Отзывы клиентов', 'title', 'block')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {renderEditableText(testimonial.text, `testimonials.${index}.text`, 'block')}
              </p>
              <p className="font-medium text-gray-900">
                {renderEditableText(testimonial.name, `testimonials.${index}.name`, 'block')}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === 'gallery') {
    const images = c.images || [
      { url: '/images/materials/horizontal-white.jpg', caption: 'Горизонтальные жалюзи' },
      { url: '/images/materials/vertical-white.jpg', caption: 'Вертикальные жалюзи' }
    ]

    return (
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-light mb-8 text-center text-gray-900">
          {renderEditableText(c.title || 'Галерея работ', 'title', 'block')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {images.map((image: any, index: number) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <img src={image.url} alt={image.caption} className="w-full h-48 object-cover" />
              <div className="p-4 bg-slate-50">
                <p className="text-sm text-gray-600">
                  {renderEditableText(image.caption, `images.${index}.caption`, 'block')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center">
      <p className="text-gray-500">Неизвестный тип блока: {block.type}</p>
      <pre className="text-xs text-gray-400 mt-2 text-left">
        {JSON.stringify(block.content, null, 2)}
      </pre>
    </div>
  )
}
