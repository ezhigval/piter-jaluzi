'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Page } from '@/lib/site-builder-types'

interface DynamicNavigationProps {
  className?: string
  linkClassName?: string
  activeLinkClassName?: string
}

export default function DynamicNavigation({ 
  className = '', 
  linkClassName = '',
  activeLinkClassName = ''
}: DynamicNavigationProps) {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    fetchNavigationPages()
  }, [])

  const fetchNavigationPages = async () => {
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      
      if (data.success && data.data) {
        // Фильтруем только активные страницы для навигации
        const navigationPages = data.data
          .filter((page: Page) => page.isActive && page.isInNavigation)
          .sort((a: Page, b: Page) => (a.navigationOrder || 999) - (b.navigationOrder || 999))
        
        setPages(navigationPages)
      }
    } catch (error) {
      console.error('Error fetching navigation pages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <nav className={className}>
        <div className="flex items-center gap-8 text-sm text-slate-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </nav>
    )
  }

  return (
    <nav className={className}>
      <div className="flex items-center gap-8 text-sm text-slate-700">
        {/* Главная страница всегда первая */}
        <Link
          href="/"
          className={`${linkClassName} ${
            pathname === '/' ? activeLinkClassName : 'hover:text-slate-900 transition-colors duration-200 font-medium'
          }`}
        >
          Главная
        </Link>
        
        {/* Динамические страницы */}
        {pages
          .filter(page => page.slug !== '/') // Исключаем главную
          .map((page) => (
            <Link
              key={page.id}
              href={page.slug}
              className={`${linkClassName} ${
                pathname === page.slug 
                  ? activeLinkClassName 
                  : 'hover:text-slate-900 transition-colors duration-200 font-medium'
              }`}
            >
              {page.navigationTitle || page.title.replace(' - Северный Контур', '')}
            </Link>
          ))}
        
        {/* Каталог всегда в конце */}
        <Link
          href="/catalog"
          className={`${linkClassName} ${
            pathname === '/catalog' ? activeLinkClassName : 'hover:text-slate-900 transition-colors duration-200 font-medium'
          }`}
        >
          Каталог
        </Link>
      </div>
    </nav>
  )
}
