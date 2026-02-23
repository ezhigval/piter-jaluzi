'use client'

import { useState, useEffect } from 'react'

interface BlindsLoaderProps {
  onComplete?: () => void
}

export default function BlindsLoader({ onComplete }: BlindsLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        onComplete?.()
      }, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex items-center justify-center">
      <div className="relative w-96 h-96">
        {/* Горизонтальные жалюзи в минималистичном стиле */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"
              style={{
                height: '32px',
                top: `${i * 32}px`,
                transform: `translateY(${progress === 100 ? '-100%' : '0'})`,
                transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s`,
                transformOrigin: 'top',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {/* Минималистичная текстура */}
              <div className="w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>
          ))}
        </div>

        {/* Декоративные элементы управления */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-32 bg-gray-600 rounded-full" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-32 bg-gray-600 rounded-full" />
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-32 bg-gray-400 rounded-full -ml-1" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-32 bg-gray-400 rounded-full -mr-1" />

        {/* Шнурок управления */}
        <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-gray-500" />
        <div className="absolute right-1 bottom-8 w-3 h-3 bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}
