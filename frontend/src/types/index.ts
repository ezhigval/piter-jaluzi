import React from 'react'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Page types
export interface Page {
  id: number
  slug: string
  title: string
  description: string
  content: string
  isActive: boolean
  isInNavigation: boolean
  navigationTitle: string
  navigationOrder: number
  seo: PageSEO
  blocks: Block[]
  createdAt: string
  updatedAt: string
}

export interface PageSEO {
  title: string
  description: string
  keywords: string
  ogImage: string
  canonical: string
  robots: string
}

export interface Block {
  id: number
  pageId: number
  type: string
  content: any
  order: number
  isActive: boolean
  styles: any
  seo: BlockSEO
  createdAt: string
  updatedAt: string
}

export interface BlockSEO {
  title: string
  description: string
  ogImage: string
}

// Category types
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  order: number
  materials: Material[]
}

export interface Material {
  id: number
  categoryId: number
  name: string
  slug: string
  description: string
  image: string
  pricePerM2: number
  supplierCode: string
  composition: string
  density: string
  width: string
  features: string[]
  inStock: boolean
  minOrder: number
  isActive: boolean
}

// Review types
export interface Review {
  id: number
  author: string
  rating: number
  text: string
  response: string
  imageUrl: string
  isPublished: boolean
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

// Gallery types
export interface GalleryWork {
  id: number
  title: string
  description: string
  images: Image[]
  isActive: boolean
  order: number
  category: string
}

export interface Image {
  id: number
  galleryWorkId: number
  src: string
  alt: string
  caption: string
  order: number
}

// Lead types
export interface Lead {
  id: number
  name: string
  phone: string
  email: string
  windowWidth: number
  windowHeight: number
  materialId?: number
  categoryId?: number
  message: string
  status: string
  source: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

// Site config types
export interface SiteConfig {
  siteName: string
  phone: string
  email: string
  address: string
  workingHours: string
}

// Navigation types
export interface NavigationItem {
  id: number
  slug: string
  title: string
  order: number
}

// Form types
export interface LeadForm {
  name: string
  phone: string
  email: string
  windowWidth: number
  windowHeight: number
  materialId?: number
  categoryId?: number
  message: string
}

export interface ReviewForm {
  author: string
  rating: number
  text: string
  imageUrl?: string
}

// Component props types
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export interface InputProps {
  label: string
  type?: 'text' | 'email' | 'tel' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode
  className?: string
}

// SEO types
export interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
}
