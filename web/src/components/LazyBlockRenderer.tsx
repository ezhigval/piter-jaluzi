'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Block } from '@/lib/site-builder-types'
import BlockRenderer from './BlockRenderer'

interface LazyBlockRendererProps {
  block: Block
  className?: string
  threshold?: number
  rootMargin?: string
}

// Компонент-обертка для ленивой загрузки блоков
function LazyBlockWrapper({ 
  block, 
  className = '', 
  threshold = 0.1,
  rootMargin = '50px'
}: LazyBlockRendererProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isVisible, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {hasLoaded ? (
        <BlockRenderer block={block} />
      ) : (
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32" />
        </div>
      )}
    </div>
  )
}

export default LazyBlockWrapper

// Оптимизированный рендерер для списков блоков с виртуализацией
interface OptimizedBlockListProps {
  blocks: Block[]
  className?: string
  virtualize?: boolean
  itemHeight?: number
  containerHeight?: number
}

export function OptimizedBlockList({ 
  blocks, 
  className = '',
  virtualize = false,
  itemHeight = 400,
  containerHeight = 800
}: OptimizedBlockListProps) {
  const [visibleBlocks, setVisibleBlocks] = useState<Block[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Для обычного рендеринга с ленивой загрузкой
  if (!virtualize) {
    return (
      <div className={className}>
        {blocks.map((block) => (
          <LazyBlockWrapper 
            key={block.id} 
            block={block}
            threshold={0.1}
            rootMargin="100px"
          />
        ))}
      </div>
    )
  }

  // Виртуализация для больших списков
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const newStartIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(
        newStartIndex + Math.ceil(containerHeight / itemHeight) + 2,
        blocks.length
      )

      setStartIndex(newStartIndex)
      setVisibleBlocks(blocks.slice(newStartIndex, endIndex))
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Initial load

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [blocks, itemHeight, containerHeight])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ height: containerHeight, overflowY: 'auto' }}
    >
      {/* Верхний отступ для виртуализации */}
      <div style={{ height: startIndex * itemHeight }} />
      
      {/* Видимые блоки */}
      {visibleBlocks.map((block, index) => (
        <div key={block.id} style={{ height: itemHeight }}>
          <LazyBlockWrapper 
            block={block}
            threshold={0.1}
            rootMargin="50px"
          />
        </div>
      ))}
      
      {/* Нижний отступ для виртуализации */}
      <div style={{ height: (blocks.length - startIndex - visibleBlocks.length) * itemHeight }} />
    </div>
  )
}

// Компонент для предзагрузки следующих блоков
interface BlockPrefetcherProps {
  blocks: Block[]
  currentIndex: number
  prefetchCount?: number
}

export function BlockPrefetcher({ 
  blocks, 
  currentIndex, 
  prefetchCount = 3 
}: BlockPrefetcherProps) {
  const [prefetchedBlocks, setPrefetchedBlocks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const nextBlocks = blocks.slice(currentIndex + 1, currentIndex + 1 + prefetchCount)
    
    nextBlocks.forEach(block => {
      if (!prefetchedBlocks.has(block.id)) {
        // Предзагружаем изображения и другие ресурсы
        prefetchBlockResources(block)
        setPrefetchedBlocks(prev => new Set(prev).add(block.id))
      }
    })
  }, [blocks, currentIndex, prefetchCount, prefetchedBlocks])

  return null // Этот компонент только для предзагрузки
}

function prefetchBlockResources(block: Block) {
  // Предзагрузка изображений
  if (block.content.image?.src) {
    const img = new Image()
    img.src = block.content.image.src
  }

  // Предзагрузка галереи
  if (block.content.images) {
    block.content.images.forEach(image => {
      const img = new Image()
      img.src = image.src
    })
  }

  // Предзагрузка OG изображения
  if (block.seo?.ogImage) {
    const img = new Image()
    img.src = block.seo.ogImage
  }
}

// Хук для оптимизации производительности рендеринга
export function useBlockOptimization(blocks: Block[]) {
  const [optimizedBlocks, setOptimizedBlocks] = useState<Block[]>([])

  useEffect(() => {
    // Оптимизируем структуру блоков для рендеринга
    const optimized = blocks.map(block => ({
      ...block,
      // Убираем лишние данные для рендеринга
      content: optimizeContent(block.content),
      // Компилируем стили
      styles: compileStyles(block.styles)
    }))

    setOptimizedBlocks(optimized)
  }, [blocks])

  return optimizedBlocks
}

function optimizeContent(content: any): any {
  // Глубокая оптимизация контента
  if (!content) return content

  const optimized: any = {}
  
  Object.keys(content).forEach(key => {
    const value = content[key]
    
    if (typeof value === 'string') {
      // Оптимизация строк
      optimized[key] = value.trim()
    } else if (Array.isArray(value)) {
      // Оптимизация массивов
      optimized[key] = value.filter(item => item !== null && item !== undefined)
    } else if (typeof value === 'object' && value !== null) {
      // Рекурсивная оптимизация объектов
      optimized[key] = optimizeContent(value)
    } else {
      optimized[key] = value
    }
  })

  return optimized
}

function compileStyles(styles?: any): any {
  if (!styles) return {}

  // Компилируем стили в CSS-in-JS формат
  const compiled: any = {}

  if (styles.backgroundColor) {
    compiled.backgroundColor = styles.backgroundColor
  }

  if (styles.textColor) {
    compiled.color = styles.textColor
  }

  if (styles.padding) {
    compiled.padding = styles.padding
  }

  if (styles.margin) {
    compiled.margin = styles.margin
  }

  if (styles.borderRadius) {
    compiled.borderRadius = styles.borderRadius
  }

  if (styles.border) {
    compiled.border = styles.border
  }

  if (styles.textAlign) {
    compiled.textAlign = styles.textAlign
  }

  if (styles.fontSize) {
    compiled.fontSize = styles.fontSize
  }

  if (styles.fontWeight) {
    compiled.fontWeight = styles.fontWeight
  }

  if (styles.customCSS) {
    compiled.cssText = styles.customCSS
  }

  return compiled
}
