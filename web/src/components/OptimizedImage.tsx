'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { imageCache } from '@/lib/cache-manager'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  placeholder?: string
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  sizes?: string
  srcSet?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder = '/images/placeholder.jpg',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  srcSet
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Загружаем изображение через кэш
    imageCache.loadImage(src)
      .then((img) => {
        setCurrentSrc(src)
        setIsLoaded(true)
        setIsError(false)
        onLoad?.()
      })
      .catch(() => {
        setIsError(true)
        onError?.()
      })
  }, [src, onLoad, onError])

  // Intersection Observer для ленивой загрузки
  useEffect(() => {
    if (loading !== 'lazy' || !imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          // Устанавливаем реальный src когда элемент виден
          if (imgRef.current && currentSrc === placeholder) {
            imgRef.current.src = src
          }
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [loading, placeholder, src, currentSrc])

  // Генерация srcSet для адаптивных изображений
  const generateSrcSet = (baseSrc: string): string => {
    if (srcSet) return srcSet

    // Если srcSet не предоставлен, генерируем базовый
    const widths = [320, 640, 768, 1024, 1280, 1536]
    return widths
      .map(w => `${baseSrc}?w=${w} ${w}w`)
      .join(', ')
  }

  // Оптимизированные стили для загрузки
  const imageStyle = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.7,
    filter: !isLoaded && blurDataURL ? 'blur(8px)' : 'none'
  }

  const handleError = () => {
    setIsError(true)
    setCurrentSrc(placeholder)
    onError?.()
  }

  if (isError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Изображение недоступно</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={sizes}
        srcSet={generateSrcSet(src)}
        style={imageStyle}
        onLoad={onLoad}
        onError={handleError}
        className="w-full h-full object-cover"
      />
      
      {/* Прогресс-бар для загрузки */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      )}
    </div>
  )
}

// Компонент для галереи с оптимизацией
interface OptimizedGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
    width?: number
    height?: number
  }>
  className?: string
  itemClassName?: string
  lazy?: boolean
  columns?: number
  gap?: string
}

export function OptimizedGallery({
  images,
  className = '',
  itemClassName = '',
  lazy = true,
  columns = 3,
  gap = 'gap-4'
}: OptimizedGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src))
  }

  // Предзагрузка первых изображений
  useEffect(() => {
    const preloadCount = Math.min(6, images.length)
    const imagesToPreload = images.slice(0, preloadCount)
    
    imageCache.preloadImages(imagesToPreload.map(img => img.src))
      .catch(console.warn)
  }, [images])

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gap} ${className}`}>
      {images.map((image, index) => (
        <div key={image.src} className={itemClassName}>
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={lazy ? (index < 2 ? 'eager' : 'lazy') : 'eager'}
            onLoad={() => handleImageLoad(image.src)}
            className="w-full h-48 sm:h-56 lg:h-64 rounded-lg"
          />
          {image.caption && (
            <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// Компонент для фонового изображения с оптимизацией
interface OptimizedBackgroundProps {
  src: string
  alt?: string
  className?: string
  children: React.ReactNode
  overlay?: boolean
  overlayOpacity?: number
}

export function OptimizedBackground({
  src,
  alt = '',
  className = '',
  children,
  overlay = false,
  overlayOpacity = 0.5
}: OptimizedBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')

  useEffect(() => {
    imageCache.loadImage(src)
      .then((img) => {
        setCurrentSrc(src)
        setIsLoaded(true)
      })
      .catch(console.warn)
  }, [src])

  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundImage: currentSrc ? `url(${currentSrc})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'opacity 0.5s ease-in-out',
        opacity: isLoaded ? 1 : 0
      }}
    >
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Хук для отложенной загрузки изображений
export function useImageLazyLoad() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const loadImage = useCallback((src: string) => {
    if (!loadedImages.has(src)) {
      imageCache.loadImage(src)
        .then(() => {
          setLoadedImages(prev => new Set(prev).add(src))
        })
        .catch(console.warn)
    }
  }, [loadedImages])

  const preloadImages = useCallback((srcs: string[]) => {
    imageCache.preloadImages(srcs)
      .then(() => {
        setLoadedImages(prev => {
          const newSet = new Set(prev)
          srcs.forEach(src => newSet.add(src))
          return newSet
        })
      })
      .catch(console.warn)
  }, [])

  return {
    loadedImages,
    loadImage,
    preloadImages,
    isLoaded: (src: string) => loadedImages.has(src)
  }
}

// Утилиты для оптимизации изображений
export const imageOptimization = {
  // Генерация WebP URL
  getWebPUrl: (src: string): string => {
    if (src.includes('?')) {
      return src + '&format=webp'
    }
    return src + '?format=webp'
  },

  // Генерация разных размеров
  getResponsiveUrl: (src: string, width: number): string => {
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}w=${width}`
  },

  // Определение оптимального качества
  getOptimalQuality: (fileSize: number): number => {
    if (fileSize < 100 * 1024) return 90 // < 100KB
    if (fileSize < 500 * 1024) return 80 // < 500KB
    if (fileSize < 1024 * 1024) return 70 // < 1MB
    return 60 // > 1MB
  },

  // Расчет aspect ratio
  calculateAspectRatio: (width: number, height: number): number => {
    return width / height
  },

  // Генерация placeholder
  generatePlaceholder: (width: number, height: number): string => {
    return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E`
  }
}
