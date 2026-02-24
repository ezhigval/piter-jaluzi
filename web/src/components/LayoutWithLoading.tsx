'use client'

import { useLoadingAnimation } from '@/hooks/useLoadingAnimation'
import LoadingAnimation from './LoadingAnimation'

interface LayoutWithLoadingProps {
  children: React.ReactNode
}

export default function LayoutWithLoading({ children }: LayoutWithLoadingProps) {
  const { isLoading } = useLoadingAnimation(3500) // 3.5 секунды для анимации

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div style={{ 
        opacity: isLoading ? 0 : 1, 
        transition: 'opacity 0.8s ease-in-out',
        visibility: isLoading ? 'hidden' : 'visible'
      }}>
        {children}
      </div>
    </>
  )
}
