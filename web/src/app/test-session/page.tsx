'use client'

import { useState, useEffect } from 'react'

export default function TestSessionPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setSessionData(data)
    } catch (error) {
      setError('Ошибка проверки сессии')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async () => {
    const password = prompt('Введите пароль:')
    if (!password) return

    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      
      if (response.ok) {
        alert('Сессия создана: ' + data.sessionId)
        checkSession()
      } else {
        alert('Ошибка: ' + data.error)
      }
    } catch (error) {
      alert('Ошибка создания сессии')
    }
  }

  const deleteSession = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      alert('Сессия удалена')
      checkSession()
    } catch (error) {
      alert('Ошибка удаления сессии')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Тест сессий</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Статус сессии</h2>
          
          {sessionData ? (
            <div className="space-y-2">
              <p><strong>Авторизован:</strong> {sessionData.authenticated ? '✅ Да' : '❌ Нет'}</p>
              <p><strong>Админ:</strong> {sessionData.isAdmin ? '✅ Да' : '❌ Нет'}</p>
              {sessionData.createdAt && (
                <p><strong>Создана:</strong> {new Date(sessionData.createdAt).toLocaleString()}</p>
              )}
              {sessionData.expiresAt && (
                <p><strong>Истекает:</strong> {new Date(sessionData.expiresAt).toLocaleString()}</p>
              )}
              {sessionData.error && (
                <p className="text-red-600"><strong>Ошибка:</strong> {sessionData.error}</p>
              )}
            </div>
          ) : (
            <p>Нет данных о сессии</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Действия</h2>
          <div className="space-y-3">
            <button
              onClick={checkSession}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🔄 Проверить сессию
            </button>
            <button
              onClick={createSession}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              🔑 Создать сессию
            </button>
            <button
              onClick={deleteSession}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              🗑️ Удалить сессию
            </button>
            <a
              href="/admin"
              className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
            >
              🛠️ Админ-панель
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
