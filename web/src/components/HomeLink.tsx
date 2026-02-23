'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

export default function HomeLink(props: LinkProps & { className?: string; children: ReactNode }) {
  const { className, children, ...rest } = props
  const pathname = usePathname()

  return (
    <Link
      {...rest}
      onClick={(e) => {
        if (pathname === '/' && (rest.href === '/' || rest.href === '')) {
          e.preventDefault()
        }
      }}
      className={className}
    >
      {children}
    </Link>
  )
}
