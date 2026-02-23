'use client'

import React from 'react'
import { useRequestModal } from '@/components/RequestModalProvider'

type Props = {
  kind?: 'request' | 'measure'
  className?: string
  children: React.ReactNode
}

export default function OpenRequestModalButton({ kind = 'request', className, children }: Props) {
  const { open } = useRequestModal()

  return (
    <button type="button" className={className} onClick={() => open(kind)}>
      {children}
    </button>
  )
}
