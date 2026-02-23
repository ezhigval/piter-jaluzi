export type PageBlockType = 'hero' | 'text' | 'image' | 'features' | 'testimonials' | 'cta' | 'gallery'

export type PageBlock = {
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

export type PageContent = {
  id: string
  slug: string
  title: string
  description: string
  blocks: PageBlock[]
  isActive: boolean
  lastModified: string
  modifiedBy: string
}

type PagesStoreState = {
  pages: PageContent[]
}

function initState(): PagesStoreState {
  const now = new Date().toISOString()

  return {
    pages: [
      {
        id: 'home',
        slug: '/',
        title: 'Главная - Jaluxi',
        description: 'Производство и установка жалюзи в Москве',
        isActive: true,
        lastModified: now,
        modifiedBy: 'admin',
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            order: 1,
            content: {
              title: 'Жалюзи под ваш размер окна за 3–5 дней',
              subtitle: 'Изготовление и ремонт жалюзи в Москве',
              description:
                'Подбираем материалы у надежных поставщиков, собираем жалюзи под ваш проем и выезжаем на замер и установку. Также быстро ремонтируем уже установленные изделия.',
              ctaPrimary: { text: 'Рассчитать стоимость', link: '/catalog' },
              ctaSecondary: { text: 'Вызвать замерщика', action: 'measure' },
            },
          },
          {
            id: 'cta-1',
            type: 'cta',
            order: 99,
            content: {
              title: 'Готовы заказать жалюзи?',
              subtitle: 'Получите бесплатную консультацию и расчет стоимости',
              primary: { text: 'Рассчитать стоимость', link: '/catalog' },
              secondary: { text: 'Оставить заявку', action: 'request' },
            },
          },
        ],
      },
      {
        id: 'about',
        slug: '/about',
        title: 'О компании - Jaluxi',
        description: '15 лет опыта в производстве жалюзи',
        isActive: true,
        lastModified: now,
        modifiedBy: 'admin',
        blocks: [
          {
            id: 'cta-1',
            type: 'cta',
            order: 50,
            content: {
              title: 'Готовы преобразить ваш интерьер?',
              subtitle: 'Получите бесплатную консультацию и расчет стоимости',
              primary: { text: 'Заказать замер', action: 'measure' },
              secondary: { text: 'Рассчитать стоимость', link: '/catalog' },
            },
          },
        ],
      },
      {
        id: 'repair',
        slug: '/repair',
        title: 'Ремонт жалюзи - Jaluxi',
        description: 'Профессиональный ремонт жалюзи в Москве',
        isActive: true,
        lastModified: now,
        modifiedBy: 'admin',
        blocks: [
          {
            id: 'cta-1',
            type: 'cta',
            order: 50,
            content: {
              title: 'Нужен ремонт жалюзи?',
              subtitle: 'Оставьте заявку и мы свяжемся с вами в течение 15 минут',
              primary: { text: 'Оставить заявку', action: 'request' },
              secondary: { text: 'Позвонить', action: 'call' },
            },
          },
        ],
      },
    ],
  }
}

const globalKey = '__jaluxi_pages_store__'

function getState(): PagesStoreState {
  const g = globalThis as any
  if (!g[globalKey]) g[globalKey] = initState()
  return g[globalKey] as PagesStoreState
}

export function listPages(): PageContent[] {
  return getState().pages
}

export function getPublicPageBySlug(slug: string): PageContent | null {
  const page = getState().pages.find((p) => p.slug === slug && p.isActive)
  return page ?? null
}

export function updatePage(input: { pageId: string; title?: string; description?: string; blocks?: PageBlock[]; modifiedBy?: string }): PageContent | null {
  const state = getState()
  const idx = state.pages.findIndex((p) => p.id === input.pageId)
  if (idx === -1) return null

  const prev = state.pages[idx]
  const next: PageContent = {
    ...prev,
    title: input.title ?? prev.title,
    description: input.description ?? prev.description,
    blocks: input.blocks ?? prev.blocks,
    lastModified: new Date().toISOString(),
    modifiedBy: input.modifiedBy ?? prev.modifiedBy,
  }

  state.pages[idx] = next
  return next
}

export function findBlock(page: PageContent | null, type: PageBlockType): PageBlock | null {
  if (!page) return null
  const blocks = [...(page.blocks ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return blocks.find((b) => b.type === type) ?? null
}
