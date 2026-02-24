import { promises as fs } from 'fs'
import path from 'path'

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

const PAGES_FILE = path.join(process.cwd(), 'data', 'pages.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(PAGES_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get initial state
function getInitialState(): PageContent[] {
  const now = new Date().toISOString()

  return [
    {
      id: 'home',
      slug: '/',
      title: 'Главная - Северный Контур',
      description: 'Производство и установка жалюзи в Санкт-Петербурге',
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
            subtitle: 'Изготовление и ремонт жалюзи в Санкт-Петербурге',
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
      title: 'О компании - Северный Контур',
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
      title: 'Ремонт жалюзи - Северный Контур',
      description: 'Профессиональный ремонт жалюзи в Санкт-Петербурге',
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
  ]
}

// Read pages from file
async function readPages(): Promise<PageContent[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(PAGES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('Pages file not found, creating initial state')
    const initialPages = getInitialState()
    await writePages(initialPages)
    return initialPages
  }
}

// Write pages to file
async function writePages(pages: PageContent[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(PAGES_FILE, JSON.stringify(pages, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing pages:', error)
    throw error
  }
}

// Public API
export async function listPages(): Promise<PageContent[]> {
  return await readPages()
}

export async function getPublicPageBySlug(slug: string): Promise<PageContent | null> {
  const pages = await readPages()
  const page = pages.find((p) => p.slug === slug && p.isActive)
  return page ?? null
}

export async function updatePage(input: { 
  pageId: string; 
  title?: string; 
  description?: string; 
  blocks?: PageBlock[]; 
  modifiedBy?: string 
}): Promise<PageContent | null> {
  const pages = await readPages()
  const idx = pages.findIndex((p) => p.id === input.pageId)
  
  if (idx === -1) return null

  const prev = pages[idx]
  const next: PageContent = {
    ...prev,
    title: input.title ?? prev.title,
    description: input.description ?? prev.description,
    blocks: input.blocks ?? prev.blocks,
    lastModified: new Date().toISOString(),
    modifiedBy: input.modifiedBy ?? prev.modifiedBy,
  }

  pages[idx] = next
  
  try {
    await writePages(pages)
    console.log('Page updated successfully:', { pageId: input.pageId, title: next.title })
    return next
  } catch (error) {
    console.error('Failed to update page:', error)
    throw error
  }
}

export function findBlock(page: PageContent | null, type: PageBlockType): PageBlock | null {
  if (!page) return null
  const blocks = [...(page.blocks ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return blocks.find((b) => b.type === type) ?? null
}
