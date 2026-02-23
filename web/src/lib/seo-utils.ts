import { SEOData, StructuredData, BreadcrumbItem } from '@/types/seo'

export function generateSEOTitle(baseTitle: string, siteName: string = 'Jaluxi'): string {
  const cleanTitle = baseTitle.trim()
  return cleanTitle.includes(siteName) ? cleanTitle : `${cleanTitle} | ${siteName}`
}

export function generateSEODescription(service: string, location: string = 'Санкт-Петербург'): string {
  return `Профессиональные ${service} в ${location}. Изготовление, установка и ремонт. Гарантия качества. Выезд замерщика бесплатно.`
}

export function generateKeywords(service: string, location: string = 'Санкт-Петербург'): string[] {
  const baseKeywords = [
    service.toLowerCase(),
    `${service.toLowerCase()} ${location.toLowerCase()}`,
    'жалюзи',
    'установка жалюзи',
    'ремонт жалюзи',
    'изготовление жалюзи',
    location.toLowerCase(),
    'купить жалюзи',
    'цены на жалюзи'
  ]
  
  // Add service-specific keywords
  const serviceKeywords: Record<string, string[]> = {
    'горизонтальные жалюзи': ['горизонтальные жалюзи', 'жалюзи горизонтальные', 'алюминиевые жалюзи'],
    'вертикальные жалюзи': ['вертикальные жалюзи', 'жалюзи вертикальные', 'тканевые жалюзи'],
    'рулонные жалюзи': ['рулонные жалюзи', 'рулонные шторы', 'блэкаут'],
    'римские жалюзи': ['римские жалюзи', 'римские шторы', 'текстильные жалюзи']
  }
  
  return [...new Set([...baseKeywords, ...(serviceKeywords[service.toLowerCase()] || [])])]
}

export function createStructuredData(type: StructuredData['type'], data: Record<string, any>): StructuredData {
  return { type, data }
}

export function createWebPageStructuredData(url: string, title: string, description: string): StructuredData {
  return createStructuredData('WebPage', {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    description,
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://jaluxi.ru/',
      name: 'Jaluxi - Жалюзи в Санкт-Петербурге'
    }
  })
}

export function createProductStructuredData(product: {
  name: string
  description: string
  price: number
  image: string
  category: string
  availability: string
  sku?: string
}): StructuredData {
  return createStructuredData('Product', {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Jaluxi',
        url: 'https://jaluxi.ru'
      }
    }
  })
}

export function createServiceStructuredData(service: {
  name: string
  description: string
  area: string
  priceRange?: string
}): StructuredData {
  return createStructuredData('Service', {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    areaServed: {
      '@type': 'City',
      name: service.area
    },
    provider: {
      '@type': 'Organization',
      name: 'Jaluxi',
      url: 'https://jaluxi.ru',
      telephone: '+7-921-123-45-67',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Санкт-Петербург',
        addressCountry: 'RU'
      }
    },
    ...(service.priceRange && { priceRange: service.priceRange })
  })
}

export function createOrganizationStructuredData(): StructuredData {
  return createStructuredData('Organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaluxi',
    url: 'https://jaluxi.ru',
    logo: 'https://jaluxi.ru/logo.png',
    description: 'Профессиональные жалюзи в Санкт-Петербурге. Изготовление, установка и ремонт всех видов жалюзи.',
    telephone: '+7-921-123-45-67',
    email: 'info@jaluxi.ru',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Санкт-Петербург',
      addressRegion: 'СП',
      addressCountry: 'RU'
    },
    sameAs: [
      'https://vk.com/jaluxi',
      'https://instagram.com/jaluxi'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-921-123-45-67',
      contactType: 'customer service',
      availableLanguage: 'Russian'
    }
  })
}

export function createBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]): StructuredData {
  return createStructuredData('BreadcrumbList', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  })
}

export function generateAltText(productName: string, category: string, color?: string): string {
  const parts = [
    productName,
    category,
    color && `цвет ${color}`
  ].filter(Boolean)
  
  return parts.join(', ') + ' - Jaluxi'
}

export function validateSEO(seo: SEOData): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Title validation
  if (!seo.title) {
    errors.push('Заголовок (title) обязателен')
  } else if (seo.title.length < 30) {
    warnings.push('Заголовок слишком короткий (рекомендуется 30-60 символов)')
  } else if (seo.title.length > 60) {
    warnings.push('Заголовок слишком длинный (может обрезаться в поисковой выдаче)')
  }

  // Description validation
  if (!seo.description) {
    errors.push('Описание (description) обязательно')
  } else if (seo.description.length < 120) {
    warnings.push('Описание слишком короткое (рекомендуется 120-160 символов)')
  } else if (seo.description.length > 160) {
    warnings.push('Описание слишком длинное (может обрезаться в поисковой выдаче)')
  }

  // Keywords validation
  if (!seo.keywords || seo.keywords.length === 0) {
    warnings.push('Отсутствуют ключевые слова')
  }

  // OG Image validation
  if (seo.ogImage && !isValidUrl(seo.ogImage)) {
    errors.push('Некорректный URL для OG изображения')
  }

  // Canonical URL validation
  if (seo.canonicalUrl && !isValidUrl(seo.canonicalUrl)) {
    errors.push('Некорректный canonical URL')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
