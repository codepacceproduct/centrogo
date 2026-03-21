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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:bottom-auto lg:top-4 lg:left-1/2 lg:right-auto lg:w-[min(860px,calc(100%-2rem))] lg:-translate-x-1/2">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border lg:rounded-2xl lg:border lg:shadow-lg" />
      
      <div className="relative mx-auto max-w-7xl safe-bottom lg:pb-2">
        <ul className="flex items-center justify-around py-2 px-2 lg:justify-center lg:gap-2 lg:px-3 lg:py-2.5">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-4 py-2 lg:flex-row lg:gap-2 lg:px-4 lg:py-2 rounded-2xl transition-all relative"
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 bg-primary/10 lg:bg-[#1262AA]/12 rounded-2xl"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  
                  <motion.div 
                    className="relative z-10"
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0 
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon className={cn(
                      'h-5 w-5 transition-colors duration-200',
                      isActive ? 'text-primary lg:text-[#1262AA]' : 'text-muted-foreground lg:text-[#1262AA]/80'
                    )} />
                    
                    {/* Active dot indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-2 w-2 bg-gold lg:bg-[#1262AA] rounded-full"
                      />
                    )}
                  </motion.div>
                  
                  <motion.span 
                    className={cn(
                      'text-[10px] lg:text-xs font-medium relative z-10 transition-colors duration-200',
                      isActive ? 'text-primary lg:text-[#1262AA]' : 'text-muted-foreground lg:text-[#1262AA]/80'
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
    </nav>
  )
}
