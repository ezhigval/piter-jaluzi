'use client'

import { useState, useEffect } from 'react'

export function useInitialLoad() {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Проверяем, была ли страница уже загружена в текущей сессии
    const hasLoaded = sessionStorage.getItem('jaluxi-loaded')
    
    if (hasLoaded) {
      setIsInitialLoad(false)
    } else {
      // Помечаем, что страница была загружена
      sessionStorage.setItem('jaluxi-loaded', 'true')
    }
  }, [])

  return isInitialLoad
}
