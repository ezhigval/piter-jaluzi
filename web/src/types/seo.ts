export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  noIndex?: boolean
}

export interface PageSEO extends SEOData {
  pageId: string
  slug: string
  lastModified: string
}

export interface ProductSEO extends SEOData {
  productId: string
  productCategory: string
  price?: number
  availability?: 'in_stock' | 'out_of_stock' | 'preorder'
  brand?: string
  sku?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface StructuredData {
  type: 'WebPage' | 'Product' | 'Service' | 'Organization' | 'BreadcrumbList'
  data: Record<string, any>
}
