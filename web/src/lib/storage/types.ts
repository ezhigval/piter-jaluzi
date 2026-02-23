// Типы для системы хранения

export interface StorageItem<T = any> {
  key: string
  value: T
  timestamp: number
  expires?: number
}

export interface CalculatorState {
  productType: string
  materialId: number | ''
  width: string
  height: string
}

export interface CatalogFilters {
  category: string
  color: string
  priceRange: [number, number]
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  showAnimation: boolean
}

export interface SessionData {
  sessionId: string
  startTime: number
  pageViews: number
  lastActivity: number
}

export type StorageType = 'cookie' | 'session' | 'local'

export interface StorageOptions {
  type: StorageType
  expires?: number
  path?: string
  domain?: string
  secure?: boolean
}
