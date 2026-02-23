'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuth() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting login...')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      console.log('Login response status:', response.status)

      if (response.ok) {
        console.log('Login successful, waiting before redirect...')
        // Небольшая задержка чтобы cookie успел установиться
        setTimeout(() => {
          console.log('Redirecting to admin...')
          router.push('/admin')
        }, 200)
      } else {
        const errorData = await response.json()
        console.log('Login failed:', errorData)
        setError(errorData.error || 'Неверный пароль')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ошибка авторизации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Вход в админ-панель
          </h1>
          <p className="text-gray-600">
            Jaluxi - Управление сайтом
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-900 text-sm transition-colors duration-200"
          >
            ← Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  )
}
