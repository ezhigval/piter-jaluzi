import axios, { AxiosResponse } from 'axios'
import { 
  ApiResponse, 
  PaginatedResponse, 
  Page, 
  Category, 
  Material, 
  Review, 
  GalleryWork, 
  Lead, 
  SiteConfig,
  NavigationItem,
  LeadForm,
  ReviewForm
} from '../types'

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status >= 400) {
      console.error('API Error:', response.data)
    }
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Pages API
export const pagesApi = {
  getAll: async (): Promise<Page[]> => {
    const response = await api.get<ApiResponse<Page[]>>('/pages')
    return response.data.data || []
  },

  getBySlug: async (slug: string): Promise<Page | null> => {
    const response = await api.get<ApiResponse<Page>>(`/pages/${slug}`)
    return response.data.data || null
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data.data || []
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${slug}`)
    return response.data.data || null
  },
}

// Materials API
export const materialsApi = {
  getByCategory: async (categorySlug: string): Promise<Material[]> => {
    const response = await api.get<ApiResponse<Material[]>>(`/categories/${categorySlug}/materials`)
    return response.data.data || []
  },

  getBySlug: async (slug: string): Promise<Material | null> => {
    const response = await api.get<ApiResponse<Material>>(`/materials/${slug}`)
    return response.data.data || null
  },
}

// Reviews API
export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    const response = await api.get<ApiResponse<Review[]>>('/reviews')
    return response.data.data || []
  },

  create: async (review: ReviewForm): Promise<Review> => {
    const response = await api.post<ApiResponse<Review>>('/reviews', review)
    return response.data.data
  },
}

// Gallery API
export const galleryApi = {
  getAll: async (): Promise<GalleryWork[]> => {
    const response = await api.get<ApiResponse<GalleryWork[]>>('/gallery')
    return response.data.data || []
  },
}

// Leads API
export const leadsApi = {
  create: async (lead: LeadForm): Promise<Lead> => {
    const response = await api.post<ApiResponse<Lead>>('/leads', lead)
    return response.data.data
  },
}

// Site config API
export const siteConfigApi = {
  get: async (): Promise<SiteConfig> => {
    const response = await api.get<ApiResponse<SiteConfig>>('/config')
    return response.data.data || {
      siteName: '',
      phone: '',
      email: '',
      address: '',
      workingHours: '',
    }
  },
}

// Navigation API
export const navigationApi = {
  get: async (): Promise<NavigationItem[]> => {
    const pages = await pagesApi.getAll()
    return pages
      .filter(page => page.isActive && page.isInNavigation)
      .sort((a, b) => a.navigationOrder - b.navigationOrder)
      .map(page => ({
        id: page.id,
        slug: page.slug,
        title: page.navigationTitle || page.title,
        order: page.navigationOrder,
      }))
  },
}
