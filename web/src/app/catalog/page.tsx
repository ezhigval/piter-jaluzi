'use client'

import { useState, useEffect } from 'react'
import { Material } from '@/lib/api'

export default function CatalogPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materials')
        const payload = await response.json()
        const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload
        setMaterials(data)
        setFilteredMaterials(data)
      } catch (error) {
        console.error('Error fetching materials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  useEffect(() => {
    let filtered = materials

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    // Фильтрация по цвету
    if (selectedColor !== 'all') {
      filtered = filtered.filter(material => 
        material.color?.toLowerCase().includes(selectedColor.toLowerCase())
      )
    }

    // Фильтрация по цене
    filtered = filtered.filter(material => 
      material.pricePerM2 >= priceRange[0] && material.pricePerM2 <= priceRange[1]
    )

    setFilteredMaterials(filtered)
  }, [materials, selectedCategory, selectedColor, priceRange])

  const categories = ['all', ...Array.from(new Set(materials.map(m => m.category)))]
  const colors = ['all', 'Белый', 'Серый', 'Коричневый', 'Бежевый', 'Синий', 'Зеленый']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Загрузка каталога...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Каталог материалов
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Выберите идеальные жалюзи для вашего интерьера из нашей коллекции качественных материалов
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-light mb-6 text-gray-900">Фильтры</h2>
              
              {/* Категория */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Все категории' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Цвет */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Цвет
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {colors.map(color => (
                    <option key={color} value={color}>
                      {color === 'all' ? 'Все цвета' : color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Диапазон цен */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Цена за м²: {priceRange[0]} - {priceRange[1]} ₽
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Сброс фильтров */}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedColor('all')
                  setPriceRange([0, 2000])
                }}
                className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Список материалов */}
          <div className="lg:col-span-3">
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">Материалы не найдены</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedColor('all')
                    setPriceRange([0, 2000])
                  }}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200"
                >
                  Показать все материалы
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredMaterials.map((material) => (
                  <div key={material.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <img 
                      src={material.imageURL || material.imageUrl || "/images/materials/horizontal-white.jpg"} 
                      alt={material.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-6">
                      <span className="text-sm text-slate-600 font-medium">
                        {material.category}
                      </span>
                      <h3 className="text-lg font-light mt-2 mb-4 text-gray-900">
                        {material.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Цвет:</span>
                          <span className="font-medium">{material.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Светопропускаемость:</span>
                          <span className="font-medium">{material.lightTransmission}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Цена:</span>
                          <span className="text-lg font-medium text-slate-900">
                            {material.pricePerM2} ₽/м²
                          </span>
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200">
                        Заказать расчет
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

