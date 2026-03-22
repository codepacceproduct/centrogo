'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { House, ShoppingBag, CalendarDays, Compass, CircleUserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Inicio', icon: House },
  { href: '/lojas', label: 'Lojas', icon: ShoppingBag },
  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/explorar', label: 'Explorar', icon: Compass },
  { href: '/perfil', label: 'Perfil', icon: CircleUserRound },
]

function BottomNavContent() {
  const pathname = usePathname()

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] lg:bottom-auto lg:top-5">
      <div className="pointer-events-auto mx-auto lg:flex lg:w-full lg:justify-center lg:px-4">
        <div className="relative w-full lg:w-auto lg:max-w-[calc(100vw-2rem)]">
          <div className="absolute inset-0 border-t border-border bg-background/80 backdrop-blur-xl lg:rounded-[1.75rem] lg:border lg:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)]" />

          <div className="relative mx-auto max-w-7xl safe-bottom lg:px-5 lg:py-3">
            <ul className="flex items-center justify-around px-2 py-2 lg:justify-center lg:gap-3 lg:px-0 lg:py-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all lg:flex-row lg:gap-2.5 lg:px-5 lg:py-3"
                    >
                      {isActive ? (
                        <motion.div
                          layoutId="nav-active-bg"
                          className="absolute inset-0 rounded-2xl bg-primary/10 lg:bg-[#1262AA]/12"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      ) : null}

                      <motion.div
                        className="relative z-10"
                        initial={false}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          y: isActive ? -1 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-colors duration-200',
                            isActive ? 'text-primary lg:text-[#1262AA]' : 'text-muted-foreground lg:text-[#1262AA]/80',
                          )}
                        />

                        {isActive ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold lg:bg-[#1262AA]"
                          />
                        ) : null}
                      </motion.div>

                      <motion.span
                        className={cn(
                          'relative z-10 text-[10px] font-medium transition-colors duration-200 lg:text-[0.97rem]',
                          isActive ? 'text-primary lg:text-[#1262AA]' : 'text-muted-foreground lg:text-[#1262AA]/80',
                        )}
                        initial={false}
                        animate={{
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function BottomNav() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(<BottomNavContent />, document.body)
}