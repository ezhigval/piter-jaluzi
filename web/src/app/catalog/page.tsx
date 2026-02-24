'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Material } from '@/lib/api'
import OpenRequestModalButton from '@/components/OpenRequestModalButton'

// Types
interface WindowDimensions {
  width: number
  height: number
}

interface BlindsConfig {
  material: Material | null
  dimensions: WindowDimensions
  category: 'horizontal' | 'vertical' | 'roller' | null
}

// Categories configuration
const categories = [
  {
    id: 'horizontal',
    name: 'Горизонтальные жалюзи',
    description: 'Классические горизонтальные жалюзи с алюминиевыми ламелями',
    icon: '🪟',
    color: 'bg-blue-500'
  },
  {
    id: 'vertical',
    name: 'Вертикальные жалюзи',
    description: 'Вертикальные тканевые жалюзи для больших окон',
    icon: '🪩',
    color: 'bg-green-500'
  },
  {
    id: 'roller',
    name: 'Рулонные шторы',
    description: 'Современные рулонные шторы с блэкаут тканями',
    icon: '🪭',
    color: 'bg-purple-500'
  }
]

export default function CatalogPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [blindsConfig, setBlindsConfig] = useState<BlindsConfig>({
    material: null,
    dimensions: { width: 100, height: 120 },
    category: null
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0)

  // Fetch materials on component mount
  useEffect(() => {
    fetchMaterials()
  }, [])

  // Calculate price when config changes
  useEffect(() => {
    calculatePrice()
  }, [blindsConfig.material, blindsConfig.dimensions])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      const payload = await response.json()
      const data = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload
      setMaterials(data)
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = async () => {
    if (!blindsConfig.material || !blindsConfig.dimensions.width || !blindsConfig.dimensions.height) {
      setEstimatedPrice(0)
      return
    }

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId: blindsConfig.material.id,
          width: blindsConfig.dimensions.width,
          height: blindsConfig.dimensions.height
        })
      })
      const result = await response.json()
      setEstimatedPrice(result.totalPrice || 0)
    } catch (error) {
      console.error('Error calculating price:', error)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setBlindsConfig(prev => ({
      ...prev,
      category: categoryId as 'horizontal' | 'vertical' | 'roller',
      material: null
    }))
  }

  const handleMaterialSelect = (material: Material) => {
    setBlindsConfig(prev => ({
      ...prev,
      material
    }))
  }

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setBlindsConfig(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }))
  }

  const filteredMaterials = selectedCategory
    ? materials.filter(m => {
        const materialCategory = m.category.toLowerCase()
        switch (selectedCategory.toLowerCase()) {
          case 'horizontal':
            return materialCategory.includes('профили') || materialCategory.includes('ламели')
          case 'vertical':
            return materialCategory.includes('ткани')
          case 'roller':
            return materialCategory.includes('ткани')
          default:
            return false
        }
      })
    : []

  // If no category selected, show category selection
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог жалюзи</h1>
            <p className="text-xl text-gray-600">Выберите тип жалюзи для вашего интерьера</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="cursor-pointer group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-48 ${category.color} flex items-center justify-center text-white text-6xl group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show materials and configuration for selected category
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2"
          >
            ← Вернуться к выбору категории
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Configuration */}
          <div className="space-y-6">
            {/* Materials Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите материал</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Загрузка материалов...</p>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Материалы не найдены</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      onClick={() => handleMaterialSelect(material)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                        blindsConfig.material?.id === material.id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-gray-200 hover:border-slate-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏠</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.name}</h4>
                          <p className="text-sm text-gray-600">{material.color}</p>
                          <p className="text-sm font-medium text-slate-900">
                            {material.pricePerM2} ₽/м²
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dimensions Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Размеры оконного проема</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ширина (см)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={blindsConfig.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Высота (см)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={blindsConfig.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Предварительная стоимость</h3>
              <div className="text-3xl font-bold text-slate-900">
                {estimatedPrice.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-gray-600 mt-2">
                *Точная стоимость будет определена после замера
              </p>
            </div>

            {/* Action Button */}
            <OpenRequestModalButton
              kind="measure"
              className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
            >
              Заказать замерщика
            </OpenRequestModalButton>
          </div>

          {/* Right side - Visualization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Итоговый вид</h3>
            
            <div className="relative bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <BlindsVisualization 
                config={blindsConfig}
                materials={materials}
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              Визуализация обновляется в реальном времени
            </div>
            
            {/* Material Parameters Display */}
            {blindsConfig.material && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Параметры материала</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Материал:</span>
                    <p className="font-medium text-gray-900">{blindsConfig.material.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Цвет:</span>
                    <p className="font-medium text-gray-900">{blindsConfig.material.color}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Светопропускаемость:</span>
                    <p className="font-medium text-gray-900">{blindsConfig.material.lightTransmission}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Цена за м²:</span>
                    <p className="font-medium text-gray-900">{blindsConfig.material.pricePerM2} ₽</p>
                  </div>
                  {(blindsConfig.material as any).composition && (
                    <div>
                      <span className="text-gray-600">Состав:</span>
                      <p className="font-medium text-gray-900">{(blindsConfig.material as any).composition}</p>
                    </div>
                  )}
                  {(blindsConfig.material as any).density && (
                    <div>
                      <span className="text-gray-600">Плотность:</span>
                      <p className="font-medium text-gray-900">{(blindsConfig.material as any).density}</p>
                    </div>
                  )}
                  {(blindsConfig.material as any).thickness && (
                    <div>
                      <span className="text-gray-600">Толщина:</span>
                      <p className="font-medium text-gray-900">{(blindsConfig.material as any).thickness}</p>
                    </div>
                  )}
                  {(blindsConfig.material as any).width && (
                    <div>
                      <span className="text-gray-600">Ширина:</span>
                      <p className="font-medium text-gray-900">{(blindsConfig.material as any).width}</p>
                    </div>
                  )}
                  {(blindsConfig.material as any).features && (blindsConfig.material as any).features.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Особенности:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(blindsConfig.material as any).features.map((feature: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Blinds Visualization Component
function BlindsVisualization({ config, materials }: { config: BlindsConfig; materials: Material[] }) {
  const { dimensions, material, category } = config
  
  // Calculate scale for visualization
  const maxWidth = 300
  const maxHeight = 400
  const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height, 1)
  
  const displayWidth = dimensions.width * scale
  const displayHeight = dimensions.height * scale

  // Get material color or use default
  const getMaterialColor = () => {
    if (!material) return '#e5e7eb'
    
    // Map material colors to actual colors
    const colorMap: { [key: string]: string } = {
      'Белый': '#ffffff',
      'Бежевый': '#f5deb3',
      'Серый': '#808080',
      'Коричневый': '#8b4513',
      'Черный': '#000000',
      'Синий': '#0000ff',
      'Зеленый': '#008000'
    }
    
    return colorMap[material.color || ''] || '#e5e7eb'
  }

  const materialColor = getMaterialColor()

  if (!category) {
    return (
      <div className="text-center text-gray-500">
        <div className="text-6xl mb-4">🪟</div>
        <p>Выберите тип жалюзи</p>
      </div>
    )
  }

  // Render different types based on category
  switch (category) {
    case 'horizontal':
      return (
        <div className="relative">
          {/* Window frame */}
          <div 
            className="border-4 border-gray-800 bg-white relative"
            style={{ width: displayWidth, height: displayHeight }}
          >
            {/* Horizontal slats */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: Math.ceil(displayHeight / 15) }).map((_, i) => (
                <div
                  key={i}
                  className="w-full border border-gray-300"
                  style={{
                    height: '14px',
                    backgroundColor: materialColor,
                    marginBottom: '1px'
                  }}
                />
              ))}
            </div>
            
            {/* Material texture overlay */}
            {material && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(0,0,0,0.1) 10px,
                    rgba(0,0,0,0.1) 20px
                  )`
                }}
              />
            )}
          </div>
          
          {/* Window handles */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-8 h-4 bg-gray-600 rounded-b"></div>
        </div>
      )
      
    case 'vertical':
      return (
        <div className="relative">
          {/* Window frame */}
          <div 
            className="border-4 border-gray-800 bg-white relative"
            style={{ width: displayWidth, height: displayHeight }}
          >
            {/* Vertical slats */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: Math.ceil(displayWidth / 20) }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-gray-300"
                  style={{
                    width: '19px',
                    backgroundColor: materialColor
                  }}
                />
              ))}
            </div>
            
            {/* Material texture overlay */}
            {material && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 10px,
                    rgba(0,0,0,0.1) 10px,
                    rgba(0,0,0,0.1) 20px
                  )`
                }}
              />
            )}
          </div>
          
          {/* Window handles */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-8 h-4 bg-gray-600 rounded-b"></div>
        </div>
      )
      
    case 'roller':
      return (
        <div className="relative">
          {/* Window frame */}
          <div 
            className="border-4 border-gray-800 bg-white relative"
            style={{ width: displayWidth, height: displayHeight }}
          >
            {/* Roller fabric */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: materialColor }}
            >
              {/* Roller texture */}
              {material && (
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 20px,
                      rgba(0,0,0,0.05) 20px,
                      rgba(0,0,0,0.05) 40px
                    )`
                  }}
                />
              )}
            </div>
            
            {/* Roller tube at top */}
            <div 
              className="absolute top-0 left-0 right-0 h-6 bg-gray-700 rounded-t"
            />
          </div>
          
          {/* Window handles */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-8 h-4 bg-gray-600 rounded-b"></div>
        </div>
      )
      
    default:
      return (
        <div className="text-center text-gray-500">
          <p>Выберите материал и размеры</p>
        </div>
      )
  }
}
