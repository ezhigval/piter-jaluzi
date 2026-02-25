// Расширенные типы для сайта-конструктора

export type BlockType = 
  | 'hero'
  | 'text' 
  | 'image'
  | 'button'
  | 'gallery'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'contact'
  | 'form'
  | 'video'
  | 'pricing'
  | 'team'
  | 'faq'
  | 'stats'

export interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  robots?: string
  structuredData?: Record<string, any>
}

export interface BlockStyles {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  border?: string
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: string
  fontWeight?: string
  customCSS?: string
}

export interface BlockContent {
  // Общие поля
  id?: string
  title?: string
  subtitle?: string
  description?: string
  
  // Для текстовых блоков
  text?: string
  html?: string
  
  // Для изображений
  image?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  images?: Array<{
    src: string
    alt: string
    caption?: string
  }>
  
  // Для кнопок
  button?: {
    text: string
    link: string
    style?: 'primary' | 'secondary' | 'outline'
    target?: '_blank' | '_self'
  }
  buttons?: Array<{
    text: string
    link: string
    style?: 'primary' | 'secondary' | 'outline'
    target?: '_blank' | '_self'
  }>
  
  // Для форм
  form?: {
    fields: Array<{
      name: string
      type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
      label: string
      required?: boolean
      placeholder?: string
      options?: string[]
    }>
    submitText?: string
    successMessage?: string
  }
  
  // Для видео
  video?: {
    src: string
    thumbnail?: string
    autoplay?: boolean
    controls?: boolean
  }
  
  // Для других специфичных полей
  [key: string]: any
}

export interface Block {
  id: string
  type: BlockType
  content: BlockContent
  styles?: BlockStyles
  seo?: SEOData
  order: number
  isActive: boolean
  templateId?: string // ID шаблона, если создан из шаблона
}

export interface Page {
  id: string
  slug: string
  title: string
  description: string
  blocks: Block[]
  seo?: SEOData
  
  // Настройки страницы
  isActive: boolean
  isInNavigation: boolean // Показывать в навигации
  navigationTitle?: string // Название в меню
  navigationOrder?: number // Порядок в навигации
  
  // Шаблон страницы
  templateId?: string
  
  // Метаданные
  lastModified: string
  modifiedBy: string
  createdAt?: string
}

export interface BlockTemplate {
  id: string
  name: string
  description: string
  category: string
  type: BlockType
  content: BlockContent
  styles?: BlockStyles
  preview?: string // URL превью изображения
  isSystem?: boolean // Системный шаблон (нельзя удалить)
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  category: string
  blocks: Omit<Block, 'id'>[]
  seo?: SEOData
  preview?: string
  isSystem?: boolean
}

export interface SiteSettings {
  // Основные настройки
  siteName: string
  siteDescription: string
  siteUrl: string
  logo?: string
  favicon?: string
  
  // SEO настройки
  globalSeo: SEOData
  
  // Настройки навигации
  navigationStyle?: 'horizontal' | 'vertical' | 'sidebar'
  showInNavigation?: string[] // ID страниц для показа в навигации
  
  // Настройки футера
  footerText?: string
  socialLinks?: Array<{
    platform: string
    url: string
    icon?: string
  }>
  
  // Дополнительные настройки
  googleAnalytics?: string
  yandexMetrika?: string
  customHead?: string
  customBody?: string
}

// Типы для API запросов
export interface CreatePageRequest {
  page: Omit<Page, 'id' | 'lastModified' | 'modifiedBy'>
}

export interface UpdatePageRequest {
  page: Partial<Page>
}

export interface CreateBlockRequest {
  block: Omit<Block, 'id'>
  pageId: string
  order?: number
}

export interface UpdateBlockRequest {
  block: Partial<Block>
  pageId: string
  blockId: string
}

// Типы для визуального редактора
export interface EditorState {
  selectedBlockId?: string
  isEditing: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
  showGrid: boolean
}

export interface DragDropItem {
  id: string
  type: 'block' | 'template'
  data: Block | BlockTemplate
}
