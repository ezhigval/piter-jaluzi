import { promises as fs } from 'fs'
import path from 'path'
import { Page, Block, BlockTemplate, PageTemplate, SiteSettings, SEOData } from './site-builder-types'

// Сохраняем обратную совместимость со старыми типами
export type PageBlockType = 'hero' | 'text' | 'image' | 'features' | 'testimonials' | 'cta' | 'gallery'
export type PageBlock = Block
export type PageContent = Page

const PAGES_FILE = path.join(process.cwd(), '..', 'backend', 'data', 'pages.json')

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
      isInNavigation: true,
      navigationTitle: 'Главная',
      navigationOrder: 1,
      lastModified: now,
      modifiedBy: 'admin',
      blocks: [
        {
          id: 'hero-1',
          type: 'hero',
          order: 1,
          isActive: true,
          content: {
            title: 'Жалюзи под ваш размер окна за 3–5 дней',
            subtitle: 'Изготовление и ремонт жалюзи в Санкт-Петербурге',
            description:
              'Подбираем материалы у надежных поставщиков, собираем жалюзи под ваш проем и выезжаем на замер и установку. Также быстро ремонтируем уже установленные изделия.',
            button: { text: 'Рассчитать стоимость', link: '/catalog' },
            buttons: [
              { text: 'Рассчитать стоимость', link: '/catalog', style: 'primary' },
              { text: 'Вызвать замерщика', link: '/contacts', style: 'secondary' }
            ],
          },
        },
        {
          id: 'cta-1',
          type: 'cta',
          order: 99,
          isActive: true,
          content: {
            title: 'Готовы заказать жалюзи?',
            subtitle: 'Получите бесплатную консультацию и расчет стоимости',
            button: { text: 'Рассчитать стоимость', link: '/catalog' },
            buttons: [
              { text: 'Рассчитать стоимость', link: '/catalog', style: 'primary' },
              { text: 'Оставить заявку', link: '/contacts', style: 'secondary' }
            ],
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
      isInNavigation: true,
      navigationTitle: 'О нас',
      navigationOrder: 5,
      lastModified: now,
      modifiedBy: 'admin',
      blocks: [
        {
          id: 'hero-2',
          type: 'hero',
          order: 1,
          isActive: true,
          content: {
            title: 'О компании Jaluxi',
            subtitle: 'Профессиональное производство и установка жалюзи с 2013 года',
            description: '15 лет на рынке, более 5000 довольных клиентов, гарантия на все работы.'
          },
        },
        {
          id: 'cta-2',
          type: 'cta',
          order: 50,
          isActive: true,
          content: {
            title: 'Готовы преобразить ваш интерьер?',
            subtitle: 'Получите бесплатную консультацию и расчет стоимости',
            button: { text: 'Заказать замер', link: '/contacts' },
            buttons: [
              { text: 'Заказать замер', link: '/contacts', style: 'primary' },
              { text: 'Рассчитать стоимость', link: '/catalog', style: 'secondary' }
            ],
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
      isInNavigation: true,
      navigationTitle: 'Ремонт',
      navigationOrder: 4,
      lastModified: now,
      modifiedBy: 'admin',
      blocks: [
        {
          id: 'hero-3',
          type: 'hero',
          order: 1,
          isActive: true,
          content: {
            title: 'Ремонт жалюзи',
            subtitle: 'Профессиональный ремонт всех видов жалюзи',
            description: 'Быстрый и качественный ремонт жалюзи на дому. Гарантия на все работы.'
          },
        },
        {
          id: 'cta-3',
          type: 'cta',
          order: 50,
          isActive: true,
          content: {
            title: 'Нужен ремонт жалюзи?',
            subtitle: 'Оставьте заявку и мы свяжемся с вами в течение 15 минут',
            button: { text: 'Оставить заявку', link: '/contacts' },
            buttons: [
              { text: 'Оставить заявку', link: '/contacts', style: 'primary' },
              { text: 'Позвонить', link: 'tel:+78121234567', style: 'secondary' }
            ],
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
