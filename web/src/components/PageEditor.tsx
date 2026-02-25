'use client'

import { useState } from 'react'
import { Page, Block } from '@/lib/site-builder-types'
import PageSEOEditor from './PageSEOEditor'
import BlockEditor from './BlockEditor'

interface PageEditorProps {
  page?: Page
  onSave: (page: Page) => void
  onCancel: () => void
}

export default function PageEditor({ page, onSave, onCancel }: PageEditorProps) {
  const [localPage, setLocalPage] = useState<Page>(page || {
    id: '',
    slug: '',
    title: '',
    description: '',
    blocks: [],
    isActive: true,
    isInNavigation: true,
    navigationTitle: '',
    navigationOrder: 999,
    lastModified: new Date().toISOString(),
    modifiedBy: 'admin'
  })

  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'blocks'>('basic')
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)

  const handlePageChange = (field: keyof Page, value: any) => {
    setLocalPage({
      ...localPage,
      [field]: value
    })
  }

  const handleSEOChange = (seo: any) => {
    setLocalPage({
      ...localPage,
      seo
    })
  }

  const handleAddBlock = () => {
    setEditingBlock(null) // Создание нового блока
  }

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block)
  }

  const handleSaveBlock = (block: Block) => {
    const updatedBlocks = editingBlock
      ? localPage.blocks.map(b => b.id === block.id ? block : block)
      : [...localPage.blocks, block]
    
    setLocalPage({
      ...localPage,
      blocks: updatedBlocks.sort((a, b) => a.order - b.order)
    })
    setEditingBlock(null)
  }

  const handleDeleteBlock = (blockId: string) => {
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.filter(b => b.id !== blockId)
    })
  }

  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    const blocks = [...localPage.blocks]
    const [movedBlock] = blocks.splice(fromIndex, 1)
    blocks.splice(toIndex, 0, movedBlock)
    
    // Обновляем порядок
    const reorderedBlocks = blocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    setLocalPage({
      ...localPage,
      blocks: reorderedBlocks
    })
  }

  const handleSave = () => {
    // Генерируем ID если его нет
    const pageToSave = {
      ...localPage,
      id: localPage.id || `page-${Date.now()}`,
      lastModified: new Date().toISOString(),
      modifiedBy: 'admin'
    }
    onSave(pageToSave)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {page ? 'Редактировать страницу' : 'Создать страницу'}
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
            {(['basic', 'seo', 'blocks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'basic' ? 'Основное' : tab === 'seo' ? 'SEO' : 'Блоки'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL страницы (slug)
                  </label>
                  <input
                    type="text"
                    value={localPage.slug || ''}
                    onChange={(e) => handlePageChange('slug', e.target.value)}
                    placeholder="/page-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название страницы
                  </label>
                  <input
                    type="text"
                    value={localPage.title || ''}
                    onChange={(e) => handlePageChange('title', e.target.value)}
                    placeholder="Название страницы"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание страницы
                </label>
                <textarea
                  value={localPage.description || ''}
                  onChange={(e) => handlePageChange('description', e.target.value)}
                  rows={3}
                  placeholder="Краткое описание страницы"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Показывать в навигации
                  </label>
                  <select
                    value={localPage.isInNavigation ? 'true' : 'false'}
                    onChange={(e) => handlePageChange('isInNavigation', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Порядок в навигации
                  </label>
                  <input
                    type="number"
                    value={localPage.navigationOrder || 999}
                    onChange={(e) => handlePageChange('navigationOrder', parseInt(e.target.value))}
                    placeholder="999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название в меню
                </label>
                <input
                  type="text"
                  value={localPage.navigationTitle || ''}
                  onChange={(e) => handlePageChange('navigationTitle', e.target.value)}
                  placeholder="Если отличается от названия страницы"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Активна
                </label>
                <select
                  value={localPage.isActive ? 'true' : 'false'}
                  onChange={(e) => handlePageChange('isActive', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="true">Да</option>
                  <option value="false">Нет</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <PageSEOEditor
              seo={localPage.seo}
              onChange={handleSEOChange}
            />
          )}

          {activeTab === 'blocks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Блоки страницы</h3>
                <button
                  onClick={handleAddBlock}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Добавить блок
                </button>
              </div>

              <div className="space-y-2">
                {localPage.blocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    Нет блоков. Нажмите "Добавить блок" чтобы создать первый блок.
                  </div>
                ) : (
                  localPage.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, index) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{block.type}</div>
                            <div className="text-sm text-gray-500">
                              {block.content.title || 'Без заголовка'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditBlock(block)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
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

      {/* Block Editor Modal */}
      {editingBlock !== null && (
        <BlockEditor
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => setEditingBlock(null)}
        />
      )}
    </div>
  )
}
