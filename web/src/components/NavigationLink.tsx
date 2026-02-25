'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

interface NavigationLinkProps extends LinkProps {
  className?: string
  children: ReactNode
  activeClassName?: string
}

export default function NavigationLink({ 
  className, 
  children, 
  activeClassName = 'text-slate-900 font-semibold',
  ...rest 
}: NavigationLinkProps) {
  const pathname = usePathname()

  const isActive = pathname === rest.href

  return (
    <Link
      {...rest}
      className={`${className || ''} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </Link>
  )
}
