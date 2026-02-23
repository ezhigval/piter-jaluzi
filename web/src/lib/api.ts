export type ProductType = "horizontal" | "vertical" | "roller";

export interface PriceEstimateRequest {
  widthMm: number;
  heightMm: number;
  productType: ProductType;
  materialId: number;
}

export interface PriceEstimateResponse {
  price: number;
  currency: string;
  areaM2: number;
  breakdown: string;
}

export interface Material {
  id: number;
  supplierCode: string;
  name: string;
  category: string;
  color?: string;
  lightTransmission: number; // Светопропускаемость в процентах
  pricePerM2: number;
  imageUrl?: string;
  imageURL?: string; // Для совместимости
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  badge?: string;
}

export interface Review {
  id: number;
  name: string;
  author?: string; // Для совместимости
  rating: number;
  comment: string;
  text?: string; // Для совместимости
  imageUrl?: string;
  attachments?: {
    type: 'image' | 'video'
    mimeType: string
    name: string
    dataUrl: string
  }[];
  createdAt: string;
  date?: string; // Для совместимости
  companyResponse?: string; // Ответ компании
}

export interface PricingConfig {
  frameMarkup: number; // Коэффициент стоимости каркаса (30% = 0.3)
  productionMarkup: number; // Наценка производства (50% = 0.5)
  minAreaM2: number; // Минимальная площадь в м²
  installationFee?: number; // Плата за установку
  measurementFee?: number; // Плата за замер
  materialBasePrice?: number; // Базовая цена материала
  complexityFactor?: number; // Коэффициент сложности
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL !== ""
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return (await res.json()) as T;
}

function unwrapData<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return payload.data as T
  }
  return payload as T
}

function normalizeReview(raw: any): Review {
  const name = raw?.name ?? raw?.author ?? ''
  const comment = raw?.comment ?? raw?.text ?? ''
  const createdAt = raw?.createdAt ?? raw?.date ?? new Date().toISOString()

  return {
    id: raw?.id,
    name,
    author: raw?.author,
    rating: raw?.rating ?? 5,
    comment,
    text: raw?.text,
    imageUrl: raw?.imageUrl,
    attachments: raw?.attachments,
    createdAt,
    date: raw?.date,
    companyResponse: raw?.companyResponse ?? raw?.response,
  }
}

function normalizeReviews(payload: any): Review[] {
  const data = unwrapData<any[]>(payload)
  if (!Array.isArray(data)) return []
  return data.map(normalizeReview)
}

export const api = {
  getHealth: () => request<{ status: string }>("/health"),
  getPromotions: () => request<Promotion[]>("/promotions"),
  getMaterials: async () => unwrapData<Material[]>(await request<any>("/materials")),
  estimatePrice: (payload: PriceEstimateRequest) =>
    request<PriceEstimateResponse>("/estimate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getReviews: async () => normalizeReviews(await request<any>("/reviews")),
  createReview: (data: { name: string; rating: number; comment: string }) =>
    request<any>("/reviews", {
      method: "POST",
      body: JSON.stringify({ author: data.name, rating: data.rating, text: data.comment }),
    }).then((p) => normalizeReview(unwrapData<any>(p))),
  createReviewWithMedia: (data: { name: string; rating: number; comment: string; files: File[] }) => {
    const form = new FormData()
    form.set('author', data.name)
    form.set('rating', String(data.rating))
    form.set('text', data.comment)
    for (const f of data.files) {
      form.append('media', f)
    }
    return request<any>("/reviews", {
      method: 'POST',
      body: form,
    }).then((p) => normalizeReview(unwrapData<any>(p)))
  },
};

