'use client'

import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState('Проверка...')
  const [cookies, setCookies] = useState('')
  
  useEffect(() => {
    const cookieString = document.cookie
    setCookies(cookieString)
    
    const cookieArray = cookieString.split(';')
    const adminSession = cookieArray.find(cookie => 
      cookie.trim().startsWith('admin_session=')
    )
    
    if (adminSession && adminSession.split('=')[1] === 'true') {
      setAuthStatus('✅ Авторизован')
    } else {
      setAuthStatus('❌ Не авторизован')
    }
  }, [])

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleAdmin = () => {
    window.location.href = '/admin'
  }

  const handleLogout = () => {
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Тест авторизации</h1>
        
        <div className="mb-4">
          <p className="text-lg mb-2">Статус: {authStatus}</p>
          <p className="text-sm text-gray-600 break-all">Cookies: {cookies || '(пусто)'}</p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            → Войти в админ-панель
          </button>
          <button 
            onClick={handleAdmin}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            → Админ-панель
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}
