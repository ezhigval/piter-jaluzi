// Система кэширования для оптимизации производительности
import { useState, useCallback, useEffect } from 'react'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface CacheConfig {
  pages: number
  blocks: number
  navigation: number
  images: number
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private config: CacheConfig

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      pages: 5 * 60 * 1000, // 5 минут
      blocks: 10 * 60 * 1000, // 10 минут
      navigation: 2 * 60 * 1000, // 2 минуты
      images: 24 * 60 * 1000, // 24 часа
      ...config
    }
  }

  // Установка значения в кэш
  set<T>(key: string, data: T, ttl?: number): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.getDefaultTTL(key)
    }
    this.cache.set(key, cacheItem)
  }

  // Получение значения из кэша
  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined
    
    if (!item) return null

    // Проверяем TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  // Проверка наличия в кэше
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Проверяем TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Удаление из кэша
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Очистка кэша
  clear(): void {
    this.cache.clear()
  }

  // Очистка истекших записей
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Получение размера кэша
  size(): number {
    return this.cache.size
  }

  // Получение всех ключей
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Получение TTL по умолчанию для разных типов данных
  private getDefaultTTL(key: string): number {
    if (key.startsWith('page-')) return this.config.pages
    if (key.startsWith('block-')) return this.config.blocks
    if (key.startsWith('navigation-')) return this.config.navigation
    if (key.startsWith('image-')) return this.config.images
    return 5 * 60 * 1000 // По умолчанию 5 минут
  }

  // Статистика кэша
  getStats(): {
    total: number
    expired: number
    valid: number
    byType: Record<string, number>
  } {
    const now = Date.now()
    let expired = 0
    let valid = 0
    const byType: Record<string, number> = {}

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expired++
      } else {
        valid++
      }

      // Группировка по типу
      const type = key.split('-')[0]
      byType[type] = (byType[type] || 0) + 1
    }

    return {
      total: this.cache.size,
      expired,
      valid,
      byType
    }
  }
}

// Глобальный экземпляр кэша
export const cacheManager = new CacheManager()

// Хуки для работы с кэшем
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Проверяем кэш
      const cached = cacheManager.get<T>(key)
      if (cached) {
        setData(cached)
        setLoading(false)
        return
      }

      // Загружаем данные
      const result = await fetcher()
      cacheManager.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Хук для кэширования с фоновым обновлением
export function useCacheWithRefresh<T>(
  key: string,
  fetcher: () => Promise<T>,
  refreshInterval?: number,
  ttl?: number
): {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
} {
  const { data, loading, error, refetch } = useCache(key, fetcher, ttl)

  useEffect(() => {
    if (!refreshInterval) return

    const interval = setInterval(() => {
      refetch()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, refetch])

  return {
    data,
    loading,
    error,
    refresh: refetch
  }
}

// Кэширование изображений
export class ImageCache {
  private cache = new Map<string, HTMLImageElement>()
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>()

  // Загрузка изображения с кэшированием
  async loadImage(src: string): Promise<HTMLImageElement> {
    // Проверяем кэш
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    // Проверяем, не загружается ли уже
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }

    // Создаем промис загрузки
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        this.cache.set(src, img)
        this.loadingPromises.delete(src)
        resolve(img)
      }
      
      img.onerror = () => {
        this.loadingPromises.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }

      img.src = src
    })

    this.loadingPromises.set(src, promise)
    return promise
  }

  // Предзагрузка изображений
  preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map(src => this.loadImage(src)))
  }

  // Очистка кэша
  clear(): void {
    this.cache.clear()
    this.loadingPromises.clear()
  }

  // Статистика
  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loadingPromises.size
    }
  }
}

export const imageCache = new ImageCache()

// Кэширование API запросов
export class APICache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 минут

  async get<T>(
    url: string,
    fetcher: () => Promise<Response>,
    ttl?: number
  ): Promise<T> {
    const cacheKey = `api-${url}`

    // Проверяем кэш
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached.data
    }

    try {
      const response = await fetcher()
      const data = await response.json()

      // Кэшируем только успешные запросы
      if (response.ok) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: ttl || this.defaultTTL
        })
      }

      return data
    } catch (error) {
      // При ошибке пробуем вернуть кэшированные данные
      const cached = this.cache.get(cacheKey)
      if (cached) {
        console.warn('API request failed, returning cached data:', error)
        return cached.data
      }
      throw error
    }
  }

  // Инвалидация кэша по URL
  invalidate(url: string): void {
    this.cache.delete(`api-${url}`)
  }

  // Очистка кэша
  clear(): void {
    this.cache.clear()
  }

  // Очистка истекших записей
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCache = new APICache()

// Утилиты для работы с кэшем
export const cacheUtils = {
  // Генерация ключей для кэша
  generateKey: (type: string, id: string, params?: Record<string, any>): string => {
    const paramString = params ? JSON.stringify(params) : ''
    return `${type}-${id}${paramString ? '-' + btoa(paramString) : ''}`
  },

  // Создание мемоизированной функции
  memoize: <T extends (...args: any[]) => any>(
    fn: T,
    getKey?: (...args: any[]) => string
  ): T => {
    const cache = new Map<string, ReturnType<T>>()

    return ((...args: any[]) => {
      const key = getKey ? getKey(...args) : JSON.stringify(args)
      
      if (cache.has(key)) {
        return cache.get(key)!
      }

      const result = fn(...args)
      cache.set(key, result)
      return result
    }) as T
  },

  // Дебаггинг кэша
  debug: () => {
    console.group('Cache Debug Info')
    console.log('Cache Manager Stats:', cacheManager.getStats())
    console.log('Image Cache Stats:', imageCache.getStats())
    console.groupEnd()
  }
}

// Автоматическая очистка кэша
if (typeof window !== 'undefined') {
  // Очищаем кэш каждые 5 минут
  setInterval(() => {
    cacheManager.cleanup()
  }, 5 * 60 * 1000)
}

export default cacheManager
