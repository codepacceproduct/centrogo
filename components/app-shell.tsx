'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { BottomNav } from '@/components/bottom-nav'
import { cn } from '@/lib/utils'

const HIDDEN_CHROME_ROUTES = ['/login', '/explorar']

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hideChrome = HIDDEN_CHROME_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  return (
    <div className="bg-background">
      <main className={cn('w-full', !hideChrome && 'pb-28 lg:pb-2')}>
        {children}
      </main>
      {!hideChrome ? <BottomNav /> : null}
    </div>
  )
}
