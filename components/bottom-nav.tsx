'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { House, ShoppingBag, CalendarDays, Compass, CircleUserRound } from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Inicio', icon: House },
  { href: '/lojas', label: 'Lojas', icon: ShoppingBag },
  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/explorar', label: 'Explorar', icon: Compass },
  { href: '/perfil', label: 'Perfil', icon: CircleUserRound },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 lg:top-0 lg:bottom-auto lg:px-0 lg:pb-0 lg:pt-5">
      <div className="pointer-events-auto mx-auto lg:flex lg:w-full lg:justify-center lg:px-4">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:w-auto lg:max-w-[calc(100vw-2rem)]"
        >
          <div className="absolute inset-0 rounded-[1.9rem] border border-white/80 bg-background/92 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:rounded-[2rem] lg:border-border/80 lg:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.3)]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:inset-x-16" />

          <div className="relative px-2.5 py-2 safe-bottom lg:px-5 lg:py-3">
            <ul className="flex items-end justify-between gap-1 lg:justify-center lg:gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href} className="flex-1 lg:flex-none">
                    <Link
                      href={item.href}
                      className="relative flex min-w-0 flex-col items-center gap-1.5 rounded-[1.4rem] px-2 py-2.5 transition-all duration-300 hover:-translate-y-0.5 lg:flex-row lg:gap-2.5 lg:px-5 lg:py-3"
                    >
                      {isActive ? (
                        <motion.div
                          layoutId="nav-active-bg"
                          className="absolute inset-0 rounded-[1.4rem] bg-gradient-to-br from-primary/14 via-primary/10 to-primary/6 lg:from-[#1262AA]/16 lg:via-[#1262AA]/10 lg:to-[#1262AA]/6"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      ) : null}

                      <motion.div
                        className="relative z-10"
                        initial={false}
                        animate={{
                          scale: isActive ? 1.08 : 1,
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
                            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-gold lg:bg-[#1262AA]"
                          />
                        ) : null}
                      </motion.div>

                      <motion.span
                        className={cn(
                          'relative z-10 text-[10px] font-medium leading-none transition-colors duration-200 lg:text-[0.97rem]',
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
        </motion.div>
      </div>
    </nav>
  )
}
