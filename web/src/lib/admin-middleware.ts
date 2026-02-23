import { NextRequest, NextResponse } from 'next/server'
import { users, PERMISSIONS } from '@/app/api/auth/users/route'

// Сессии (в проде - Redis)
const sessions: Map<
  string,
  {
    userId: string
    role: string
    permissions: string[]
    createdAt: number
    expiresAt: number
  }
> =
  (globalThis as any).__jaluxi_sessions ??
  ((globalThis as any).__jaluxi_sessions =
    new Map<
      string,
      {
        userId: string
        role: string
        permissions: string[]
        createdAt: number
        expiresAt: number
      }
    >())

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    permissions: string[]
  }
}

// Middleware для проверки авторизации
export function withAuth(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
  return async (req: NextRequest, ...args: any[]) => {
    // Получаем session_id из cookie
    const sessionId = req.cookies.get('session_id')?.value
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      )
    }

    // Проверяем сессию
    const session = sessions.get(sessionId)
    if (!session || session.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired session' },
        { status: 401 }
      )
    }

    // Получаем пользователя
    const user = users.find(u => u.id === session.userId)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Forbidden - User not found or inactive' },
        { status: 403 }
      )
    }

    // Добавляем пользователя в запрос
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    }

    return handler(authenticatedReq, ...args)
  }
}

// Middleware для проверки прав доступа
export function withPermission(permission: string) {
  return function(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
    return withAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
      const user = req.user!
      
      // Проверяем права
      const hasPermission = user.permissions.includes('*') || // Супер-админ
                             user.permissions.includes(permission)
      
      if (!hasPermission) {
        return NextResponse.json(
          { 
            error: 'Forbidden - Insufficient permissions',
            required: permission,
            userPermissions: user.permissions
          },
          { status: 403 }
        )
      }

      return handler(req, ...args)
    })
  }
}

// Middleware для проверки роли
export function withRole(role: string) {
  return function(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
    return withAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
      const user = req.user!
      
      if (user.role !== role && !user.permissions.includes('*')) {
        return NextResponse.json(
          { 
            error: 'Forbidden - Insufficient role',
            required: role,
            userRole: user.role
          },
          { status: 403 }
        )
      }

      return handler(req, ...args)
    })
  }
}

// Функции для работы с сессиями
export function createSession(userId: string, role: string, permissions: string[]) {
  const sessionId = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15)
  
  const now = Date.now()
  const expiresAt = now + (24 * 60 * 60 * 1000) // 24 часа
  
  const session = {
    userId,
    role,
    permissions,
    createdAt: now,
    expiresAt
  }
  
  sessions.set(sessionId, session)
  return sessionId
}

export function getSession(sessionId: string) {
  const session = sessions.get(sessionId)
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return null
  }
  return session
}

export function deleteSession(sessionId: string) {
  return sessions.delete(sessionId)
}

// Очистка истекших сессий
setInterval(() => {
  const now = Date.now()
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId)
    }
  }
}, 60 * 60 * 1000) // Каждый час
