'use client'

import { useState, useEffect } from 'react'
import { SiteCookies } from '@/lib/storage/cookies'
import { SiteSession } from '@/lib/storage/session'

export function useAnimation() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    // Проверяем первое ли это посещение
    const firstVisit = SiteCookies.isFirstVisit()
    setIsFirstVisit(firstVisit)

    // Показываем анимацию если:
    // 1. Первое посещение ИЛИ
    // 2. Это обновление страницы (F5)
    const shouldShowAnimation = firstVisit || SiteSession.getPageLoads() > 1
    
    setShowAnimation(shouldShowAnimation)

    // Отмечаем посещение и загрузку страницы
    if (firstVisit) {
      SiteCookies.markVisited()
    }
    SiteSession.markPageLoad()
  }, [])

  const completeAnimation = () => {
    setShowAnimation(false)
  }

  return {
    showAnimation,
    isFirstVisit,
    completeAnimation
  }
}
