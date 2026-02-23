'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Role = 'admin' | 'manager' | 'viewer'

interface User {
  id: string
  email: string
  role: Role
  permissions: string[]
}

interface Material {
  id: number
  name: string
  category: string
  color: string
  lightTransmission: number
  pricePerM2: number
  supplierCode: string
  imageURL?: string
  description?: string
  composition?: string
  density?: string
  width?: string
  features?: string[]
  inStock?: boolean
  minOrder?: number
}

interface Review {
  id: number
  author: string
  rating: number
  text: string
  date: string
  response?: string
  imageUrl?: string
  attachments?: {
    type: 'image' | 'video'
    mimeType: string
    name: string
    dataUrl: string
  }[]
  verified?: boolean
  service?: string
}

interface PricingConfig {
  frameMarkup: number
  productionMarkup: number
  minAreaM2: number
  installationFee: number
  measurementFee: number
  materialBasePrice: number
  complexityFactor: number
}

type PageBlockType = 'hero' | 'text' | 'image' | 'features' | 'testimonials' | 'cta' | 'gallery'

interface PageBlock {
  id: string
  type: PageBlockType
  content: any
  order: number
  styles?: {
    backgroundColor?: string
    padding?: string
    textAlign?: 'left' | 'center' | 'right'
  }
}

interface PageContent {
  id: string
  slug: string
  title: string
  description: string
  blocks: PageBlock[]
  isActive: boolean
  lastModified: string
  modifiedBy: string
}

type TabKey = 'pages' | 'materials' | 'reviews' | 'pricing'

function safeJsonParse(value: string): { ok: true; data: any } | { ok: false; error: string } {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' }
  }
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [activeTab, setActiveTab] = useState<TabKey>('pages')

  const [pages, setPages] = useState<PageContent[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const selectedPage = useMemo(() => pages.find((p) => p.id === selectedPageId) ?? null, [pages, selectedPageId])
  const [pageDraft, setPageDraft] = useState<PageContent | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const selectedMaterial = useMemo(
    () => materials.find((m) => m.id === selectedMaterialId) ?? null,
    [materials, selectedMaterialId]
  )
  const [materialDraft, setMaterialDraft] = useState<Material | null>(null)
  const [materialDirty, setMaterialDirty] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    frameMarkup: 0.3,
    productionMarkup: 0.5,
    minAreaM2: 0.5,
    installationFee: 1500,
    measurementFee: 800,
    materialBasePrice: 800,
    complexityFactor: 1.2,
  })

  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    name: '',
    category: 'ткани',
    color: '',
    lightTransmission: 70,
    pricePerM2: 1200,
    supplierCode: '',
    description: '',
    composition: '100% полиэстер',
    density: '280 г/м²',
    width: '280 см',
    imageURL: '',
    inStock: true,
    minOrder: 5,
  })

  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState<Partial<Review>>({
    author: '',
    rating: 5,
    text: '',
    date: new Date().toISOString().split('T')[0],
  })

  const hasPerm = useCallback(
    (perm: string) => {
      const perms = user?.permissions ?? []
      return perms.includes('*') || perms.includes(perm)
    },
    [user]
  )

  const fetchSession = useCallback(async () => {
    const res = await fetch('/api/auth/session', { method: 'GET' })
    const data = await res.json()
    if (data?.authenticated && data?.user) {
      setIsAuthenticated(true)
      setUser(data.user)
      return data.user as User
    }
    setIsAuthenticated(false)
    setUser(null)
    return null
  }, [])

  const fetchPages = useCallback(async () => {
    const res = await fetch('/api/admin/pages')
    const data = await res.json()
    setPages(data?.data ?? [])
  }, [])

  const fetchMaterials = useCallback(async () => {
    const res = await fetch('/api/admin/materials')
    const data = await res.json()
    setMaterials(data?.data ?? [])
  }, [])

  const fetchReviews = useCallback(async () => {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(data?.data ?? data ?? [])
  }, [])

  const fetchPricing = useCallback(async () => {
    const res = await fetch('/api/pricing')
    const data = await res.json()
    setPricingConfig(data ?? pricingConfig)
  }, [pricingConfig])

  const bootstrap = useCallback(async () => {
    try {
      const u = await fetchSession()
      if (!u) return

      const tasks: Promise<void>[] = []
      if (u.permissions.includes('*') || u.permissions.includes('content.read')) tasks.push(fetchPages())
      if (u.permissions.includes('*') || u.permissions.includes('materials.read')) tasks.push(fetchMaterials())
      if (u.permissions.includes('*') || u.permissions.includes('reviews.read')) tasks.push(fetchReviews())
      if (u.permissions.includes('*') || u.permissions.includes('pricing.read')) tasks.push(fetchPricing())
      await Promise.all(tasks)
    } finally {
      setLoading(false)
    }
  }, [fetchMaterials, fetchPages, fetchPricing, fetchReviews, fetchSession])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    if (!selectedMaterialId) {
      setMaterialDraft(null)
      setMaterialDirty(false)
      return
    }
    setMaterialDraft(selectedMaterial)
    setMaterialDirty(false)
  }, [selectedMaterialId, selectedMaterial])

  useEffect(() => {
    if (!selectedPageId) {
      setPageDraft(null)
      setHasUnsavedChanges(false)
      return
    }
    setPageDraft(selectedPage)
    setHasUnsavedChanges(false)
  }, [selectedPageId, selectedPage])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok || !data?.success) {
        setAuthError(data?.error ?? 'Неверные учетные данные')
        setLoading(false)
        return
      }

      await bootstrap()
    } catch {
      setAuthError('Ошибка авторизации')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } finally {
      window.location.reload()
    }
  }

  const updateDraft = (updates: Partial<PageContent>) => {
    if (!pageDraft) return
    setPageDraft({ ...pageDraft, ...updates })
    setHasUnsavedChanges(true)
  }

  const getDefaultBlockContent = (type: PageBlockType) => {
    if (type === 'hero') {
      return {
        title: 'Заголовок',
        subtitle: 'Подзаголовок',
        backgroundImage: '',
        cta: { text: 'Кнопка', link: '/' },
      }
    }
    if (type === 'text') {
      return { title: 'Заголовок', body: 'Текст', fontSize: '16px', fontFamily: 'Inter, sans-serif' }
    }
    if (type === 'image') {
      return { url: '', alt: '', caption: '', width: '100%', height: 'auto' }
    }
    if (type === 'features') {
      return { title: 'Преимущества', subtitle: '', items: [{ title: 'Пункт 1', description: '' }] }
    }
    if (type === 'testimonials') {
      return { title: 'Отзывы', subtitle: '', items: [{ author: 'Имя', rating: 5, text: 'Текст' }] }
    }
    if (type === 'cta') {
      return {
        title: 'Заголовок',
        subtitle: 'Подзаголовок',
        buttonText: 'Кнопка',
        buttonLink: '/',
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
      }
    }
    if (type === 'gallery') {
      return { title: 'Галерея', columns: 2, images: [{ url: '', alt: '', caption: '' }] }
    }
    return {}
  }

  const addBlockToDraft = (type: PageBlockType) => {
    if (!pageDraft) return
    const block: PageBlock = {
      id: Date.now().toString(),
      type,
      order: (pageDraft.blocks?.length ?? 0) + 1,
      content: getDefaultBlockContent(type),
      styles: { backgroundColor: '#ffffff', padding: 'medium', textAlign: 'left' },
    }
    updateDraft({ blocks: [...(pageDraft.blocks ?? []), block] })
  }

  const removeBlockFromDraft = (blockId: string) => {
    if (!pageDraft) return
    updateDraft({ blocks: (pageDraft.blocks ?? []).filter((b) => b.id !== blockId) })
  }

  const duplicateBlockInDraft = (blockId: string) => {
    if (!pageDraft) return
    const original = (pageDraft.blocks ?? []).find((b) => b.id === blockId)
    if (!original) return
    const copy: PageBlock = { ...original, id: Date.now().toString(), order: (pageDraft.blocks ?? []).length + 1 }
    updateDraft({ blocks: [...(pageDraft.blocks ?? []), copy] })
  }

  const updateBlockInDraft = (blockId: string, updates: Partial<PageBlock>) => {
    if (!pageDraft) return
    const nextBlocks = (pageDraft.blocks ?? []).map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    updateDraft({ blocks: nextBlocks })
  }

  const savePageDraft = async () => {
    if (!pageDraft) return
    if (!hasPerm('content.edit')) {
      alert('Недостаточно прав')
      return
    }

    const res = await fetch('/api/admin/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: pageDraft.id, title: pageDraft.title, description: pageDraft.description, blocks: pageDraft.blocks }),
    })

    const data = await res.json()
    if (!res.ok || !data?.success) {
      alert(data?.error ?? 'Ошибка сохранения')
      return
    }

    await fetchPages()
    setHasUnsavedChanges(false)
  }

  const addMaterial = async () => {
    if (!hasPerm('materials.edit')) {
      alert('Недостаточно прав')
      return
    }

    const res = await fetch('/api/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMaterial),
    })

    const data = await res.json()
    if (!res.ok || !data?.success) {
      alert(data?.error ?? 'Ошибка')
      return
    }

    setMaterials((prev) => [...prev, data.data])
    setShowAddMaterial(false)
    setNewMaterial({
      name: '',
      category: 'ткани',
      color: '',
      lightTransmission: 70,
      pricePerM2: 1200,
      supplierCode: '',
      description: '',
      composition: '100% полиэстер',
      density: '280 г/м²',
      width: '280 см',
      imageURL: '',
      inStock: true,
      minOrder: 5,
    })
  }

  const deleteMaterial = async (id: number) => {
    if (!hasPerm('materials.delete')) {
      alert('Недостаточно прав')
      return
    }

    if (!confirm('Удалить материал?')) return

    const res = await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      alert(data?.error ?? 'Ошибка')
      return
    }

    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMaterialDraft = (patch: Partial<Material>) => {
    if (!materialDraft) return
    setMaterialDraft({ ...materialDraft, ...patch })
    setMaterialDirty(true)
  }

  const saveMaterialDraft = async () => {
    if (!materialDraft) return
    if (!hasPerm('materials.edit')) {
      alert('Недостаточно прав')
      return
    }

    const res = await fetch(`/api/admin/materials/${materialDraft.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialDraft),
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.success) {
      alert(data?.error ?? 'Ошибка сохранения')
      return
    }

    setMaterials((prev) => prev.map((m) => (m.id === materialDraft.id ? data.data : m)))
    setMaterialDirty(false)
  }

  const addReview = async () => {
    if (!hasPerm('reviews.edit')) {
      alert('Недостаточно прав')
      return
    }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })

    const data = await res.json()
    if (!res.ok || !data?.success) {
      alert(data?.error ?? 'Ошибка')
      return
    }

    setReviews((prev) => [...prev, data.data])
    setShowAddReview(false)
    setNewReview({ author: '', rating: 5, text: '', date: new Date().toISOString().split('T')[0] })
  }

  const deleteReview = async (id: number) => {
    if (!hasPerm('reviews.delete')) {
      alert('Недостаточно прав')
      return
    }

    if (!confirm('Удалить отзыв?')) return

    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      alert(data?.error ?? 'Ошибка')
      return
    }

    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const savePricing = async () => {
    if (!hasPerm('pricing.edit')) {
      alert('Недостаточно прав')
      return
    }

    const res = await fetch('/api/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pricingConfig),
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || !data?.success) {
      alert(data?.error ?? 'Ошибка')
      return
    }

    alert('Сохранено')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Загрузка...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Вход в админ-панель</h1>
            <p className="text-gray-600">Jaluxi - Управление сайтом</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="admin@jaluxi.ru"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Введите пароль"
                required
              />
            </div>

            {authError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{authError}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Войти
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-slate-600 hover:text-slate-900 text-sm transition-colors duration-200">
              ← Вернуться на сайт
            </a>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">Демо-пользователи:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Admin: admin@jaluxi.ru / admin</p>
              <p>Manager: manager@jaluxi.ru / manager</p>
              <p>Viewer: viewer@jaluxi.ru / viewer</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <span
                className={
                  user?.role === 'admin'
                    ? 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
                    : user?.role === 'manager'
                      ? 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'
                      : 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
                }
              >
                {user?.role}
              </span>
              {hasUnsavedChanges && <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Есть несохраненные изменения</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'pages' && pageDraft && hasUnsavedChanges && hasPerm('content.edit') && (
              <button onClick={savePageDraft} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Сохранить изменения
              </button>
            )}
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Выйти
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {(hasPerm('content.read') || hasPerm('content.edit')) && (
                <button
                  onClick={() => setActiveTab('pages')}
                  className={
                    activeTab === 'pages'
                      ? 'py-4 px-6 border-b-2 border-blue-500 text-blue-600 font-medium text-sm whitespace-nowrap'
                      : 'py-4 px-6 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-medium text-sm whitespace-nowrap'
                  }
                >
                  Страницы ({pages.length})
                </button>
              )}
              {(hasPerm('materials.read') || hasPerm('materials.edit')) && (
                <button
                  onClick={() => setActiveTab('materials')}
                  className={
                    activeTab === 'materials'
                      ? 'py-4 px-6 border-b-2 border-blue-500 text-blue-600 font-medium text-sm whitespace-nowrap'
                      : 'py-4 px-6 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-medium text-sm whitespace-nowrap'
                  }
                >
                  Материалы ({materials.length})
                </button>
              )}
              {(hasPerm('reviews.read') || hasPerm('reviews.edit')) && (
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={
                    activeTab === 'reviews'
                      ? 'py-4 px-6 border-b-2 border-blue-500 text-blue-600 font-medium text-sm whitespace-nowrap'
                      : 'py-4 px-6 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-medium text-sm whitespace-nowrap'
                  }
                >
                  Отзывы ({reviews.length})
                </button>
              )}
              {(hasPerm('pricing.read') || hasPerm('pricing.edit')) && (
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={
                    activeTab === 'pricing'
                      ? 'py-4 px-6 border-b-2 border-blue-500 text-blue-600 font-medium text-sm whitespace-nowrap'
                      : 'py-4 px-6 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-medium text-sm whitespace-nowrap'
                  }
                >
                  Ценообразование
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pages' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Страницы сайта</h2>
                  <div className="space-y-2">
                    {pages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPageId(p.id)}
                        className={
                          (selectedPageId === p.id
                            ? 'w-full text-left p-3 rounded-lg border border-blue-500 bg-blue-50'
                            : 'w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300')
                        }
                      >
                        <div className="font-medium text-gray-900">{p.title}</div>
                        <div className="text-sm text-gray-600">{p.slug}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(p.lastModified).toLocaleString('ru-RU')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {!pageDraft ? (
                    <div className="text-center py-12 text-gray-600">Выберите страницу для редактирования</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                              value={pageDraft.title}
                              onChange={(e) => updateDraft({ title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={!hasPerm('content.edit')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                              value={pageDraft.description}
                              onChange={(e) => updateDraft({ description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={!hasPerm('content.edit')}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value=""
                            onChange={(e) => {
                              const v = e.target.value as PageBlockType
                              if (!v) return
                              addBlockToDraft(v)
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!hasPerm('content.edit')}
                          >
                            <option value="">Добавить блок</option>
                            <option value="hero">Hero</option>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="features">Features</option>
                            <option value="testimonials">Testimonials</option>
                            <option value="cta">CTA</option>
                            <option value="gallery">Gallery</option>
                          </select>

                          {hasPerm('content.edit') && (
                            <button onClick={savePageDraft} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                              Сохранить
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(pageDraft.blocks ?? []).slice().sort((a, b) => a.order - b.order).map((block) => (
                          <BlockEditor
                            key={block.id}
                            block={block}
                            canEdit={hasPerm('content.edit')}
                            onDuplicate={() => duplicateBlockInDraft(block.id)}
                            onRemove={() => removeBlockFromDraft(block.id)}
                            onUpdate={(updates) => updateBlockInDraft(block.id, updates)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Материалы (карточки товаров)</h2>
                    <div className="text-sm text-gray-600 mt-1">Выберите карточку, отредактируйте поля и сохраните.</div>
                  </div>
                  {hasPerm('materials.edit') && (
                    <button onClick={() => setShowAddMaterial(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Добавить материал
                    </button>
                  )}
                </div>

                {showAddMaterial && (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <input
                        value={newMaterial.name ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, name: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Название"
                      />
                      <select
                        value={newMaterial.category ?? 'ткани'}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, category: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="ткани">Ткани</option>
                        <option value="профили">Профили</option>
                        <option value="брус">Брус</option>
                        <option value="ламели">Ламели</option>
                      </select>
                      <input
                        value={newMaterial.color ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, color: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Цвет"
                      />
                      <input
                        type="number"
                        value={newMaterial.lightTransmission ?? 0}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, lightTransmission: Number(e.target.value) }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Светопропускаемость"
                      />
                      <input
                        type="number"
                        value={newMaterial.pricePerM2 ?? 0}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, pricePerM2: Number(e.target.value) }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Цена м²"
                      />
                      <input
                        value={newMaterial.supplierCode ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, supplierCode: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Артикул"
                      />
                      <input
                        value={newMaterial.imageURL ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, imageURL: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="URL картинки"
                      />
                      <input
                        value={newMaterial.description ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, description: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Описание"
                      />
                      <input
                        value={newMaterial.composition ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, composition: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Состав"
                      />
                      <input
                        value={newMaterial.density ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, density: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Плотность"
                      />
                      <input
                        value={newMaterial.width ?? ''}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, width: e.target.value }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Ширина"
                      />
                      <input
                        type="number"
                        value={newMaterial.minOrder ?? 0}
                        onChange={(e) => setNewMaterial((p) => ({ ...p, minOrder: Number(e.target.value) }))}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Мин. заказ"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={addMaterial} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                        Сохранить
                      </button>
                      <button onClick={() => setShowAddMaterial(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {materials.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMaterialId(m.id)}
                          className={
                            selectedMaterialId === m.id
                              ? 'text-left border-2 border-blue-500 rounded-lg overflow-hidden bg-white'
                              : 'text-left border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300'
                          }
                        >
                          <div className="h-40 bg-gray-100">
                            {m.imageURL ? <img src={m.imageURL} alt={m.name} className="w-full h-40 object-cover" /> : null}
                          </div>
                          <div className="p-3">
                            <div className="font-medium text-gray-900 truncate">{m.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{m.category} · {m.color}</div>
                            <div className="text-sm text-gray-900 mt-2">{m.pricePerM2} ₽/м²</div>
                            <div className="text-xs text-gray-600 mt-1">Артикул: {m.supplierCode}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    {!materialDraft ? (
                      <div className="text-sm text-gray-600">Выберите материал слева для редактирования.</div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">Редактирование</div>
                          {materialDirty && <div className="text-xs text-yellow-700">Есть изменения</div>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                          <input
                            value={materialDraft.name}
                            onChange={(e) => updateMaterialDraft({ name: e.target.value })}
                            disabled={!hasPerm('materials.edit')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                            <select
                              value={materialDraft.category}
                              onChange={(e) => updateMaterialDraft({ category: e.target.value })}
                              disabled={!hasPerm('materials.edit')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                              <option value="ткани">Ткани</option>
                              <option value="профили">Профили</option>
                              <option value="брус">Брус</option>
                              <option value="ламели">Ламели</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Цвет</label>
                            <input
                              value={materialDraft.color}
                              onChange={(e) => updateMaterialDraft({ color: e.target.value })}
                              disabled={!hasPerm('materials.edit')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Цена (₽/м²)</label>
                            <input
                              type="number"
                              value={materialDraft.pricePerM2}
                              onChange={(e) => updateMaterialDraft({ pricePerM2: Number(e.target.value) })}
                              disabled={!hasPerm('materials.edit')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Светопропускание (%)</label>
                            <input
                              type="number"
                              value={materialDraft.lightTransmission}
                              onChange={(e) => updateMaterialDraft({ lightTransmission: Number(e.target.value) })}
                              disabled={!hasPerm('materials.edit')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Артикул</label>
                          <input
                            value={materialDraft.supplierCode}
                            onChange={(e) => updateMaterialDraft({ supplierCode: e.target.value })}
                            disabled={!hasPerm('materials.edit')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
                          <input
                            value={materialDraft.imageURL ?? ''}
                            onChange={(e) => updateMaterialDraft({ imageURL: e.target.value })}
                            disabled={!hasPerm('materials.edit')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                          <textarea
                            value={materialDraft.description ?? ''}
                            onChange={(e) => updateMaterialDraft({ description: e.target.value })}
                            disabled={!hasPerm('materials.edit')}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={Boolean(materialDraft.inStock)}
                              onChange={(e) => updateMaterialDraft({ inStock: e.target.checked })}
                              disabled={!hasPerm('materials.edit')}
                            />
                            В наличии
                          </label>
                          <div className="w-28">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Мин. заказ</label>
                            <input
                              type="number"
                              value={materialDraft.minOrder ?? 0}
                              onChange={(e) => updateMaterialDraft({ minOrder: Number(e.target.value) })}
                              disabled={!hasPerm('materials.edit')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {hasPerm('materials.edit') && (
                            <button
                              onClick={saveMaterialDraft}
                              disabled={!materialDirty}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Сохранить
                            </button>
                          )}
                          {hasPerm('materials.delete') && (
                            <button
                              onClick={() => deleteMaterial(materialDraft.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Отзывы</h2>
                  {hasPerm('reviews.edit') && (
                    <button onClick={() => setShowAddReview(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Добавить отзыв
                    </button>
                  )}
                </div>

                {showAddReview && (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <input
                      value={newReview.author ?? ''}
                      onChange={(e) => setNewReview((p) => ({ ...p, author: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Автор"
                    />
                    <select
                      value={newReview.rating ?? 5}
                      onChange={(e) => setNewReview((p) => ({ ...p, rating: Number(e.target.value) }))}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={newReview.text ?? ''}
                      onChange={(e) => setNewReview((p) => ({ ...p, text: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      rows={4}
                      placeholder="Текст"
                    />
                    <div className="flex gap-2">
                      <button onClick={addReview} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                        Сохранить
                      </button>
                      <button onClick={() => setShowAddReview(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{r.author}</div>
                          <div className="text-sm text-gray-600">Оценка: {r.rating}</div>
                          <div className="text-gray-700 mt-2">{r.text}</div>

                          {r.imageUrl && (
                            <div className="mt-3">
                              <img src={r.imageUrl} alt={r.author} className="w-full max-w-md h-48 object-cover rounded" />
                            </div>
                          )}

                          {(r.attachments?.length ?? 0) > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                              {r.attachments!.map((a, idx) => (
                                <div key={idx} className="rounded-lg overflow-hidden bg-gray-100">
                                  {a.type === 'video' ? (
                                    <video controls className="w-full h-48 object-cover" src={a.dataUrl} />
                                  ) : (
                                    <img className="w-full h-48 object-cover" src={a.dataUrl} alt={a.name} />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="text-xs text-gray-500 mt-2">{new Date(r.date).toLocaleDateString('ru-RU')}</div>
                        </div>
                        {hasPerm('reviews.delete') && (
                          <button onClick={() => deleteReview(r.id)} className="text-red-600 hover:text-red-900">
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Ценообразование</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberField
                    label="Наценка производства"
                    value={(pricingConfig.productionMarkup ?? 0) * 100}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, productionMarkup: v / 100 }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                  <NumberField
                    label="Наценка каркаса"
                    value={(pricingConfig.frameMarkup ?? 0) * 100}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, frameMarkup: v / 100 }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                  <NumberField
                    label="Коэффициент сложности"
                    value={pricingConfig.complexityFactor ?? 1}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, complexityFactor: v }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                  <NumberField
                    label="Установка"
                    value={pricingConfig.installationFee ?? 0}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, installationFee: v }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                  <NumberField
                    label="Замер"
                    value={pricingConfig.measurementFee ?? 0}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, measurementFee: v }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                  <NumberField
                    label="Базовая цена материала"
                    value={pricingConfig.materialBasePrice ?? 0}
                    onChange={(v) => setPricingConfig((p) => ({ ...p, materialBasePrice: v }))}
                    disabled={!hasPerm('pricing.edit')}
                  />
                </div>

                {hasPerm('pricing.edit') && (
                  <button onClick={savePricing} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Сохранить
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NumberField(props: { label: string; value: number; onChange: (v: number) => void; disabled: boolean }) {
  const { label, value, onChange, disabled } = props
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100"
      />
    </div>
  )
}

function BlockEditor(props: {
  block: PageBlock
  canEdit: boolean
  onUpdate: (updates: Partial<PageBlock>) => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  const { block, canEdit, onDuplicate, onRemove, onUpdate } = props
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [editorTab, setEditorTab] = useState<'visual' | 'json'>('visual')
  const [jsonValue, setJsonValue] = useState(() => JSON.stringify(block.content ?? {}, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  useEffect(() => {
    setJsonValue(JSON.stringify(block.content ?? {}, null, 2))
    setJsonError(null)
  }, [block.content])

  const updateContent = (patch: any) => {
    onUpdate({ content: { ...(block.content ?? {}), ...patch } })
  }

  const applyJson = (value: string) => {
    setJsonValue(value)
    const parsed = safeJsonParse(value)
    if (!parsed.ok) {
      setJsonError(parsed.error)
      return
    }
    setJsonError(null)
    onUpdate({ content: parsed.data })
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{block.type}</span>
          {mode === 'edit' && (
            <div className="flex gap-1">
              <button
                onClick={() => setEditorTab('visual')}
                className={editorTab === 'visual' ? 'px-2 py-1 text-xs rounded bg-blue-600 text-white' : 'px-2 py-1 text-xs rounded bg-gray-200 text-gray-700'}
              >
                Визуально
              </button>
              <button
                onClick={() => setEditorTab('json')}
                className={editorTab === 'json' ? 'px-2 py-1 text-xs rounded bg-blue-600 text-white' : 'px-2 py-1 text-xs rounded bg-gray-200 text-gray-700'}
              >
                JSON
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={() => setMode((m) => (m === 'preview' ? 'edit' : 'preview'))} className="text-sm text-blue-700 hover:text-blue-900">
              {mode === 'preview' ? 'Редактировать' : 'Готово'}
            </button>
          )}
          <button onClick={onDuplicate} className="text-sm text-green-700 hover:text-green-900" title="Дублировать">
            Дубль
          </button>
          {canEdit && (
            <button onClick={onRemove} className="text-sm text-red-700 hover:text-red-900" title="Удалить">
              Удалить
            </button>
          )}
        </div>
      </div>

      {mode === 'preview' ? (
        <div className="p-4">
          <BlockPreview block={block} />
        </div>
      ) : (
        <div className="p-4 bg-gray-50">
          {editorTab === 'json' ? (
            <div className="space-y-2">
              <textarea
                value={jsonValue}
                onChange={(e) => applyJson(e.target.value)}
                className="w-full h-48 p-2 border rounded font-mono text-sm"
              />
              {jsonError && <div className="text-sm text-red-700">{jsonError}</div>}
            </div>
          ) : (
            <BlockVisualEditor block={block} onPatch={updateContent} />
          )}
        </div>
      )}
    </div>
  )
}

function BlockPreview({ block }: { block: PageBlock }) {
  const c = block.content ?? {}
  if (block.type === 'hero') {
    return (
      <div className="rounded-lg p-6 text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="text-2xl font-semibold">{c.title ?? ''}</div>
        <div className="opacity-80 mt-1">{c.subtitle ?? ''}</div>
        <div className="mt-4">
          <span className="inline-block bg-white text-slate-900 px-3 py-2 rounded">{c.cta?.text ?? 'Кнопка'}</span>
        </div>
      </div>
    )
  }
  if (block.type === 'text') {
    return (
      <div className="border rounded-lg p-4">
        <div className="font-semibold">{c.title ?? ''}</div>
        <div className="text-gray-700 mt-2" style={{ fontSize: c.fontSize ?? '16px', fontFamily: c.fontFamily ?? 'Inter, sans-serif' }}>
          {c.body ?? ''}
        </div>
      </div>
    )
  }
  if (block.type === 'image') {
    return (
      <div className="border rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">{c.caption ?? ''}</div>
        {c.url ? <img src={c.url} alt={c.alt ?? ''} className="w-full h-48 object-cover rounded" /> : <div className="h-48 bg-gray-200 rounded" />}
      </div>
    )
  }
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-gray-700">{block.type}</div>
      <div className="text-xs text-gray-600 mt-2">{JSON.stringify(block.content ?? {})}</div>
    </div>
  )
}

function BlockVisualEditor({ block, onPatch }: { block: PageBlock; onPatch: (patch: any) => void }) {
  const c = block.content ?? {}

  if (block.type === 'hero') {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
          <input
            value={c.title ?? ''}
            onChange={(e) => onPatch({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Подзаголовок</label>
          <textarea
            value={c.subtitle ?? ''}
            onChange={(e) => onPatch({ subtitle: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Текст кнопки</label>
            <input
              value={c.cta?.text ?? ''}
              onChange={(e) => onPatch({ cta: { ...(c.cta ?? {}), text: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ссылка кнопки</label>
            <input
              value={c.cta?.link ?? ''}
              onChange={(e) => onPatch({ cta: { ...(c.cta ?? {}), link: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Фон (URL картинки)</label>
          <input
            value={c.backgroundImage ?? ''}
            onChange={(e) => onPatch({ backgroundImage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    )
  }

  if (block.type === 'text') {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
          <input
            value={c.title ?? ''}
            onChange={(e) => onPatch({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Текст</label>
          <textarea
            value={c.body ?? ''}
            onChange={(e) => onPatch({ body: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Размер шрифта</label>
            <select
              value={c.fontSize ?? '16px'}
              onChange={(e) => onPatch({ fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['14px', '16px', '18px', '20px', '24px'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Шрифт</label>
            <select
              value={c.fontFamily ?? 'Inter, sans-serif'}
              onChange={(e) => onPatch({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['Inter, sans-serif', 'Georgia, serif', 'Arial, sans-serif', 'Times New Roman, serif'].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            value={c.url ?? ''}
            onChange={(e) => onPatch({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alt</label>
          <input
            value={c.alt ?? ''}
            onChange={(e) => onPatch({ alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Подпись</label>
          <input
            value={c.caption ?? ''}
            onChange={(e) => onPatch({ caption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        value={JSON.stringify(block.content ?? {}, null, 2)}
        onChange={(e) => {
          const parsed = safeJsonParse(e.target.value)
          if (!parsed.ok) return
          onPatch(parsed.data)
        }}
        className="w-full h-48 p-2 border rounded font-mono text-sm"
      />
    </div>
  )
}
