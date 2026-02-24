'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ошибка сервера - Северный Контур',
  description: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или свяжитесь с поддержкой.',
  robots: 'noindex, nofollow',
}

export default function ErrorPage() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">500</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ошибка сервера</h2>
        </div>
        
        <div className="mb-8 p-6 bg-red-50 border border border-red-200 rounded-lg max-w-md mx-auto">
          <p className="text-gray-700 mb-4">
            Произошла внутренняя ошибка сервера. Наши специалисты уже работают над решением проблемы.
          </p>
          
          {countdown > 0 && (
            <div className="text-sm text-gray-600 mb-4">
              Автоматическое обновление через <span className="font-mono">{countdown}</span> секунд...
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200"
          >
            🔄 Обновить страницу
          </button>
          
          <div className="text-sm text-gray-500">
            Если проблема не решена:
          </div>
          
          <div className="flex flex-col space-y-2 max-w-xs mx-auto">
            <Link
              href="/"
              className="text-slate-700 hover:text-slate-900 px-4 py-2 border border border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-200"
            >
              🏠 На главную
            </Link>
            <Link
              href="/contacts"
              className="text-slate-700 hover:text-slate-900 px-4 py-2 border border border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-200"
            >
              📞 Поддержка
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-xs text-gray-400">
          Код ошибки: <span className="font-mono">SERVER_ERROR</span>
        </div>
        
        <div className="text-sm text-gray-600">
          📧 <strong>Техническая поддержка:</strong>{' '}
          <a href="tel:+7 (812) 123-45-67" className="text-slate-900 hover:underline">
            +7 (812) 123-45-67
          </a>
          {` | `}
          <a href="mailto:info@severnyj-kontur.ru" className="text-slate-900 hover:underline">
            info@severnyj-kontur.ru
          </a>
        </div>
      </div>
    </div>
  )
}
