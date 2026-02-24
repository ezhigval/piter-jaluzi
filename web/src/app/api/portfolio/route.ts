import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'
import { promises as fs } from 'fs'
import path from 'path'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: 'horizontal' | 'vertical' | 'roller' | 'repair'
  images: string[]
  beforeAfter?: {
    before: string
    after: string
  }
  tags: string[]
  featured: boolean
  createdAt: string
  modifiedAt: string
  createdBy: string
}

const PORTFOLIO_FILE = path.join(process.cwd(), 'data', 'portfolio.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(PORTFOLIO_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get initial portfolio data
function getInitialPortfolio(): PortfolioItem[] {
  return [
    {
      id: '1',
      title: 'Горизонтальные жалюзи в спальне',
      description: 'Установка алюминиевых горизонтальных жалюзи в современной спальне',
      category: 'horizontal',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      tags: ['алюминий', 'белый', 'современный стиль'],
      featured: true,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: '2', 
      title: 'Вертикальные жалюзи в гостиной',
      description: 'Элегантные вертикальные тканевые жалюзи для просторной гостиной',
      category: 'vertical',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558624734-db5eed19b27e?w=800&h=600&fit=crop'
      ],
      tags: ['ткань', 'бежевый', 'классика'],
      featured: true,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: '3',
      title: 'Рулонные шторы на кухне',
      description: 'Практичные рулонные шторы с блэкаут эффектом для кухни',
      category: 'roller',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      tags: ['блэкаут', 'серый', 'практичность'],
      featured: false,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ]
}

// Read portfolio from file
async function readPortfolio(): Promise<PortfolioItem[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('Portfolio file not found, creating initial data')
    const initialPortfolio = getInitialPortfolio()
    await writePortfolio(initialPortfolio)
    return initialPortfolio
  }
}

// Write portfolio to file
async function writePortfolio(portfolio: PortfolioItem[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(portfolio, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing portfolio:', error)
    throw error
  }
}

// GET - получить все работы
export const GET = withPermission(PERMISSIONS.PORTFOLIO.READ)(
  async (req: AuthenticatedRequest) => {
    try {
      const portfolio = await readPortfolio()
      return NextResponse.json({
        success: true,
        data: portfolio,
        total: portfolio.length
      })
    } catch (error) {
      console.error('Portfolio fetch error:', error)
      return NextResponse.json(
        { error: 'Ошибка при получении портфолио' },
        { status: 500 }
      )
    }
  }
)

// POST - добавить новую работу
export const POST = withPermission(PERMISSIONS.PORTFOLIO.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const item = await req.json()
      
      const newItem: PortfolioItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        createdBy: req.user?.id || 'unknown'
      }
      
      const portfolio = await readPortfolio()
      portfolio.push(newItem)
      await writePortfolio(portfolio)
      
      return NextResponse.json({
        success: true,
        data: newItem,
        message: 'Работа добавлена успешно'
      })
    } catch (error) {
      console.error('Portfolio create error:', error)
      return NextResponse.json(
        { error: 'Ошибка при добавлении работы' },
        { status: 500 }
      )
    }
  }
)

// PUT - обновить работу
export const PUT = withPermission(PERMISSIONS.PORTFOLIO.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const { id, ...updates } = await req.json()
      
      const portfolio = await readPortfolio()
      const index = portfolio.findIndex(item => item.id === id)
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Работа не найдена' },
          { status: 404 }
        )
      }
      
      portfolio[index] = {
        ...portfolio[index],
        ...updates,
        modifiedAt: new Date().toISOString()
      }
      
      await writePortfolio(portfolio)
      
      return NextResponse.json({
        success: true,
        data: portfolio[index],
        message: 'Работа обновлена успешно'
      })
    } catch (error) {
      console.error('Portfolio update error:', error)
      return NextResponse.json(
        { error: 'Ошибка при обновлении работы' },
        { status: 500 }
      )
    }
  }
)

// DELETE - удалить работу
export const DELETE = withPermission(PERMISSIONS.PORTFOLIO.DELETE)(
  async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(req.url)
      const id = searchParams.get('id')
      
      if (!id) {
        return NextResponse.json(
          { error: 'ID работы обязателен' },
          { status: 400 }
        )
      }
      
      const portfolio = await readPortfolio()
      const filteredPortfolio = portfolio.filter(item => item.id !== id)
      
      if (filteredPortfolio.length === portfolio.length) {
        return NextResponse.json(
          { error: 'Работа не найдена' },
          { status: 404 }
        )
      }
      
      await writePortfolio(filteredPortfolio)
      
      return NextResponse.json({
        success: true,
        message: 'Работа удалена успешно'
      })
    } catch (error) {
      console.error('Portfolio delete error:', error)
      return NextResponse.json(
        { error: 'Ошибка при удалении работы' },
        { status: 500 }
      )
    }
  }
)
