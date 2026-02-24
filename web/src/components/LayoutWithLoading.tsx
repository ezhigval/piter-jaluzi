'use client'

import { useLoadingAnimation } from '@/hooks/useLoadingAnimation'
import LoadingAnimation from './LoadingAnimation'

interface LayoutWithLoadingProps {
  children: React.ReactNode
}

export default function LayoutWithLoading({ children }: LayoutWithLoadingProps) {
  const { isLoading } = useLoadingAnimation(2500) // Минимум 2.5 секунды

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        {children}
      </div>
    </>
  )
}
