'use client'

import { useState } from 'react'
import Link from 'next/link'
import HomeLink from '@/components/HomeLink'
import { siteConfig } from '@/lib/site-config'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* О компании */}
          <div className="space-y-4">
            <h3 className="text-lg font-light">Jaluxi</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              Профессиональное изготовление и ремонт жалюзи в Москве с 2013 года.
            </p>
            <HomeLink href="/" className="inline-flex text-sm text-slate-300 hover:text-white transition-colors">
              Главная
            </HomeLink>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a9.923 9.923 0 01-3.028 1.165v.045a9.923 9.923 0 003.99 3.415 4.917 4.917 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058.592.072 1.585.072 2.581 0 1.49-.058 2.923-.072 2.923-.148 3.225-1.664 4.771-4.919.058-.6.072-1.596.072-2.581zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 4.919-.059.602-.074 1.59-.074 2.581 0 .99.015 1.979.074 2.581.2 3.302 2.622 5.78 6.98 4.919 1.28-.058 1.688-.072 4.947-.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-4.919.059-.6.074-1.59.074-2.581 0-.99-.015-1.979-.074-2.581-.2-3.302-2.625-5.78-6.979-4.919z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Услуги */}
          <div className="space-y-4">
            <h3 className="text-lg font-light">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors">
                  Горизонтальные жалюзи
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors">
                  Вертикальные жалюзи
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors">
                  Рулонные шторы
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors">
                  Ремонт жалюзи
                </Link>
              </li>
            </ul>
          </div>

          {/* Компания */}
          <div className="space-y-4">
            <h3 className="text-lg font-light">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-slate-300 hover:text-white transition-colors">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-slate-300 hover:text-white transition-colors">
                  Гарантии
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-slate-300 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Подписка */}
          <div className="space-y-4">
            <h3 className="text-lg font-light">Подписка на новости</h3>
            <p className="text-slate-300 text-sm mb-4">
              Получайте информацию об акциях и новых материалах
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors duration-200"
              >
                Подписаться
              </button>
              {subscribed && (
                <p className="text-green-400 text-sm">Спасибо за подписку!</p>
              )}
            </form>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-white">Телефон</h4>
              <p className="text-slate-300">
                <a href={`tel:${siteConfig.contacts.phoneTel}`} className="hover:text-white transition-colors">
                  {siteConfig.contacts.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">Email</h4>
              <p className="text-slate-300">
                <a href={`mailto:${siteConfig.contacts.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contacts.email}
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">Адрес</h4>
              <p className="text-slate-300">
                {siteConfig.contacts.address}
              </p>
            </div>
          </div>

          {/* Нижняя строка */}
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} Jaluxi. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
