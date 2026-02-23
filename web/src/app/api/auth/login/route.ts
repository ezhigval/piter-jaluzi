import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Получаем пароль из переменных окружения
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'
    
    if (password === adminPassword) {
      // Устанавливаем cookie для сессии
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 часа
        path: '/'
      })
      return response
    } else {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
