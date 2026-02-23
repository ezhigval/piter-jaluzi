import { NextRequest, NextResponse } from 'next/server'

// Типы пользователей и ролей
export interface User {
  id: string
  email: string
  password: string // В проде хэш
  role: 'admin' | 'manager' | 'viewer'
  permissions: string[]
  isActive: boolean
  createdAt: number
  lastLogin?: number
}

// База пользователей (в проде - БД)
export const users: User[] = [
  {
    id: '1',
    email: 'admin@jaluxi.ru',
    password: 'admin', // В проде хэш bcrypt
    role: 'admin',
    permissions: ['*'], // Все права
    isActive: true,
    createdAt: Date.now()
  },
  {
    id: '2', 
    email: 'manager@jaluxi.ru',
    password: 'manager',
    role: 'manager',
    permissions: [
      'materials.read',
      'materials.edit', 
      'reviews.read',
      'reviews.edit',
      'pricing.read'
    ],
    isActive: true,
    createdAt: Date.now()
  },
  {
    id: '3',
    email: 'viewer@jaluxi.ru', 
    password: 'viewer',
    role: 'viewer',
    permissions: [
      'materials.read',
      'reviews.read',
      'pricing.read'
    ],
    isActive: true,
    createdAt: Date.now()
  }
]

// Права доступа
export const PERMISSIONS = {
  MATERIALS: {
    READ: 'materials.read',
    EDIT: 'materials.edit',
    DELETE: 'materials.delete'
  },
  REVIEWS: {
    READ: 'reviews.read',
    EDIT: 'reviews.edit',
    DELETE: 'reviews.delete',
    RESPOND: 'reviews.respond'
  },
  PRICING: {
    READ: 'pricing.read',
    EDIT: 'pricing.edit'
  },
  CONTENT: {
    READ: 'content.read',
    EDIT: 'content.edit',
    DELETE: 'content.delete'
  },
  CONFIG: {
    READ: 'config.read',
    EDIT: 'config.edit'
  },
  USERS: {
    READ: 'users.read',
    EDIT: 'users.edit',
    DELETE: 'users.delete'
  }
} as const

export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации
    const sessionId = request.cookies.get('session_id')?.value
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем сессию (упрощенно)
    const session = await getSession(sessionId)
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Возвращаем пользователей (без паролей)
    const safeUsers = users.map(({ password, ...user }) => user)
    
    return NextResponse.json({
      users: safeUsers,
      permissions: PERMISSIONS
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Вспомогательная функция получения сессии
async function getSession(sessionId: string) {
  // Здесь должна быть проверка в Redis/БД
  // Для примера - простая проверка
  return { isAdmin: true, userId: '1' }
}
