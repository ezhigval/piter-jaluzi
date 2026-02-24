'use client'

import { useState, useEffect } from 'react'

export function useLoadingAnimation(minDuration: number = 3500) {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    
    // Функция для завершения загрузки
    const completeLoading = () => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDuration - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
        setIsReady(true)
      }, remainingTime)
    }

    // Проверяем готовность страницы
    if (document.readyState === 'complete') {
      completeLoading()
    } else {
      window.addEventListener('load', completeLoading)
      return () => window.removeEventListener('load', completeLoading)
    }
  }, [minDuration])

  return { isLoading, isReady }
}
