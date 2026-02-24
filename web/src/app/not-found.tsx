import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страница не найдена - Северный Контур',
  description: 'Запрошенная страница не существует. Проверьте URL или вернитесь на главную.',
  robots: 'noindex, nofollow',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
        </div>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto px-4">
          К сожалению, запрошенная страница не существует.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200"
          >
            ← На главную
          </Link>
          
          <div className="text-sm text-gray-500">
            Или выберите из меню:
          </div>
          
          <div className="flex flex-col space-y-2 max-w-xs mx-auto">
            <Link
              href="/catalog"
              className="text-slate-700 hover:text-slate-900 px-4 py-2 border border border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-200"
            >
              📋 Каталог
            </Link>
            <Link
              href="/contacts"
              className="text-slate-700 hover:text-slate-900 px-4 py-2 border border border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-200"
            >
              📞 Контакты
            </Link>
            <Link
              href="/repair"
              className="text-slate-700 hover:text-slate-900 px-4 py-2 border border border-slate-300 rounded-lg hover:border-slate-400 transition-colors duration-200"
            >
              🔧 Ремонт
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-xs text-gray-400">
          Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нами:
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
