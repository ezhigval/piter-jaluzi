import { NextRequest, NextResponse } from 'next/server'
import { withPermission, AuthenticatedRequest } from '@/lib/admin-middleware'
import { PERMISSIONS } from '@/app/api/auth/users/route'

// Хранилище изменений в реальном времени
interface RealtimeUpdate {
  id: string
  type: 'page' | 'material' | 'review' | 'pricing'
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: string
  userId: string
  userEmail: string
}

const realtimeUpdates: RealtimeUpdate[] = []

// Функция для рассылки обновлений (в реальном приложении это будет WebSocket)
export function broadcastUpdate(update: RealtimeUpdate) {
  realtimeUpdates.push(update)
  
  // Удаляем старые обновления (хранить только последние 100)
  if (realtimeUpdates.length > 100) {
    realtimeUpdates.splice(0, realtimeUpdates.length - 100)
  }
  
  console.log('Realtime update broadcasted:', update)
}

export const GET = withPermission(PERMISSIONS.CONTENT.READ)(
  async (req: AuthenticatedRequest) => {
    try {
      const url = new URL(req.url)
      const since = url.searchParams.get('since')
      const timestamp = since || new Date(0).toISOString()
      
      // Возвращаем обновления с указанного времени
      const updates = realtimeUpdates.filter(
        update => update.timestamp > timestamp
      )

      return NextResponse.json({
        success: true,
        data: updates,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Realtime fetch error:', error)
      return NextResponse.json(
        { error: 'Ошибка при получении обновлений' },
        { status: 500 }
      )
    }
  }
)

export const POST = withPermission(PERMISSIONS.CONTENT.EDIT)(
  async (req: AuthenticatedRequest) => {
    try {
      const updateData = await req.json()
      
      const update: RealtimeUpdate = {
        id: Date.now().toString(),
        type: updateData.type,
        action: updateData.action,
        data: updateData.data,
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'unknown',
        userEmail: req.user?.email || 'unknown'
      }

      broadcastUpdate(update)

      return NextResponse.json({
        success: true,
        data: update,
        message: 'Обновление отправлено в реальном времени'
      })

    } catch (error) {
      console.error('Realtime update error:', error)
      return NextResponse.json(
        { error: 'Ошибка при отправке обновления' },
        { status: 500 }
      )
    }
  }
)
