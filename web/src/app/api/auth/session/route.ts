import { NextRequest, NextResponse } from 'next/server'
import { users } from '../users/route'
import { createSession, getSession, deleteSession } from '@/lib/admin-middleware'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Поиск пользователя
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password && // В проде - проверка хэша
      u.isActive
    )
    
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Создание сессии
    const sessionId = createSession(user.id, user.role, user.permissions)
    
    console.log('Session created:', { 
      sessionId, 
      userId: user.id, 
      role: user.role,
      permissions: user.permissions 
    })
    
    // Установка cookie с session_id
    const response = NextResponse.json({ 
      success: true,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    })
    
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 часа
      path: '/'
    })
    
    return response
    
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value
    
    if (!sessionId) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'No session' 
      })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'Session expired or invalid' 
      })
    }
    
    // Получаем данные пользователя
    const user = users.find(u => u.id === session.userId)
    if (!user || !user.isActive) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'User not found or inactive' 
      })
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      session: {
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    })
    
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value
    
    if (sessionId) {
      deleteSession(sessionId)
      console.log('Session deleted:', sessionId)
    }
    
    // Удаление cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
      expires: new Date(0)
    })
    
    return response
    
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
