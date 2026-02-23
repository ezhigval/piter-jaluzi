import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'

// Структура страниц сайта
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

interface PageBlock {
  id: string
  type: 'hero' | 'text' | 'image' | 'features' | 'testimonials' | 'cta' | 'gallery'
  content: any
  order: number
  styles?: {
    backgroundColor?: string
    padding?: string
    textAlign?: 'left' | 'center' | 'right'
  }
}

// Реалистичные данные страниц
const pagesData: PageContent[] = [
  {
    id: 'home',
    slug: '/',
    title: 'Главная - Jaluxi',
    description: 'Производство и установка жалюзи в Москве',
    isActive: true,
    lastModified: new Date().toISOString(),
    modifiedBy: 'admin',
    blocks: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        content: {
          title: 'Жалюзи на заказ в Москве',
          subtitle: 'Производство и профессиональная установка с гарантией до 5 лет',
          backgroundImage: 'https://images.unsplash.com/photo-1586087912743-4b4c5a1c7ca0?w=1920&h=600&fit=crop',
          cta: {
            text: 'Рассчитать стоимость',
            link: '/calculator'
          }
        },
        styles: {
          backgroundColor: '#f8fafc',
          padding: 'large'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        order: 2,
        content: {
          title: 'Почему выбирают Jaluxi',
          subtitle: '15 лет опыта и более 5000 довольных клиентов',
          items: [
            {
              title: 'Собственное производство',
              description: 'Контролируем качество на каждом этапе',
              icon: 'factory'
            },
            {
              title: 'Гарантия 5 лет',
              description: 'Полная уверенность в наших изделиях',
              icon: 'shield'
            },
            {
              title: 'Быстрый монтаж',
              description: 'Установка за 1 день в удобное время',
              icon: 'clock'
            },
            {
              title: 'Индивидуальный подход',
              description: 'Подберем идеальное решение для вашего интерьера',
              icon: 'palette'
            }
          ]
        },
        styles: {
          backgroundColor: '#ffffff',
          padding: 'medium'
        }
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        order: 3,
        content: {
          title: 'Отзывы наших клиентов',
          subtitle: 'Более 5000 довольных клиентов доверяют нам',
          items: [
            {
              author: 'Елена Петрова',
              rating: 5,
              text: 'Отличные жалюзи! Качество на высоте, монтаж выполнен профессионально.',
              image: 'https://images.unsplash.com/photo-1586087912743-4b4c5a1c7ca0?w=400&h=300&fit=crop'
            },
            {
              author: 'Михаил Иванов',
              rating: 5,
              text: 'Заказывал алюминиевые жалюзи на кухню. Качество материалов хорошее.',
              image: 'https://images.unsplash.com/photo-1558624734-db5eed19b27e?w=400&h=300&fit=crop'
            }
          ]
        },
        styles: {
          backgroundColor: '#f1f5f9',
          padding: 'large'
        }
      }
    ]
  },
  {
    id: 'about',
    slug: '/about',
    title: 'О компании - Jaluxi',
    description: '15 лет опыта в производстве жалюзи',
    isActive: true,
    lastModified: new Date().toISOString(),
    modifiedBy: 'admin',
    blocks: [
      {
        id: 'text-1',
        type: 'text',
        order: 1,
        content: {
          title: 'О компании Jaluxi',
          body: 'Jaluxi - это команда профессионалов с 15-летним опытом в производстве и установке жалюзи. Мы начинали как небольшая мастерская и выросли в одного из ведущих производителей Москвы.',
          image: 'https://images.unsplash.com/photo-1586087912743-4b4c5a1c7ca0?w=800&h=400&fit=crop'
        },
        styles: {
          backgroundColor: '#ffffff',
          padding: 'medium'
        }
      },
      {
        id: 'stats-1',
        type: 'features',
        order: 2,
        content: {
          title: 'Наши достижения',
          items: [
            {
              title: '15+ лет',
              description: 'На рынке',
              icon: 'calendar'
            },
            {
              title: '5000+',
              description: 'Довольных клиентов',
              icon: 'users'
            },
            {
              title: '10000+',
              description: 'Установленных жалюзи',
              icon: 'home'
            },
            {
              title: '5 лет',
              description: 'Гарантия на продукцию',
              icon: 'shield'
            }
          ]
        },
        styles: {
          backgroundColor: '#f8fafc',
          padding: 'medium'
        }
      }
    ]
  },
  {
    id: 'catalog',
    slug: '/catalog',
    title: 'Каталог - Jaluxi',
    description: 'Каталог жалюзи и комплектующих',
    isActive: true,
    lastModified: new Date().toISOString(),
    modifiedBy: 'admin',
    blocks: [
      {
        id: 'catalog-header',
        type: 'text',
        order: 1,
        content: {
          title: 'Каталог продукции',
          body: 'Широкий ассортимент жалюзи для любого интерьера. От классических тканей до современных алюминиевых профилей.',
          image: 'https://images.unsplash.com/photo-1586087912743-4b4c5a1c7ca0?w=1200&h=400&fit=crop'
        },
        styles: {
          backgroundColor: '#ffffff',
          padding: 'medium'
        }
      }
    ]
  }
]

export const GET = withPermission(PERMISSIONS.CONTENT.READ)(
  async (req: AuthenticatedRequest) => {
    try {
      console.log('Pages fetched by:', { 
        userId: req.user?.id, 
        role: req.user?.role 
      })

      return NextResponse.json({
        success: true,
        data: pagesData,
        total: pagesData.length
      })

    } catch (error) {
      console.error('Pages fetch error:', error)
      return NextResponse.json(
        { error: 'Ошибка при получении страниц' },
        { status: 500 }
      )
    }
  }
)

export const PUT = withPermission(PERMISSIONS.CONTENT.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const { pageId, blocks, title, description } = await req.json()
      
      if (!pageId) {
        return NextResponse.json(
          { error: 'ID страницы обязателен' },
          { status: 400 }
        )
      }

      const pageIndex = pagesData.findIndex(p => p.id === pageId)
      if (pageIndex === -1) {
        return NextResponse.json(
          { error: 'Страница не найдена' },
          { status: 404 }
        )
      }

      // Обновляем страницу
      pagesData[pageIndex] = {
        ...pagesData[pageIndex],
        title: title || pagesData[pageIndex].title,
        description: description || pagesData[pageIndex].description,
        blocks: blocks || pagesData[pageIndex].blocks,
        lastModified: new Date().toISOString(),
        modifiedBy: req.user?.id || 'unknown'
      }

      console.log('Page updated:', { 
        pageId, 
        updatedBy: req.user?.id,
        blocksCount: blocks?.length 
      })

      return NextResponse.json({
        success: true,
        data: pagesData[pageIndex],
        message: 'Страница успешно обновлена'
      })

    } catch (error) {
      console.error('Page update error:', error)
      return NextResponse.json(
        { error: 'Ошибка при обновлении страницы' },
        { status: 500 }
      )
    }
  }
)
