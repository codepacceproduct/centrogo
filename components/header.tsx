'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MapPin, X, ChevronRight, Trophy, Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { currentUser, notifications } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [mounted, setMounted] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  // Only run on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get greeting based on time of day
  const getGreeting = () => {
    if (!mounted) return 'Ola'
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  // Calculate progress to next level (mock data)
  const progressToNextLevel = 65

  return (
    <header className="relative z-40">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      
      <div className="relative px-5 pt-5 pb-4">
        {/* Top row - User info and notification */}
        <div className="flex items-center justify-between">
          {/* User greeting */}
          <div className="flex items-center gap-3.5">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="relative"
            >
              {/* Profile picture with gradient border */}
              <div className="h-14 w-14 rounded-full p-0.5 bg-gradient-to-br from-white/40 to-white/10">
                <div className="h-full w-full rounded-full bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-400 rounded-full border-[2.5px] border-primary shadow-lg" />
            </motion.div>
            
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white/70 text-sm font-medium"
              >
                <span suppressHydrationWarning>{getGreeting()}</span>, <span className="font-bold text-white">{currentUser.firstName}!</span>
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 mt-1"
              >
                <MapPin className="h-3.5 w-3.5 text-white/60" />
                <span className="text-xs text-white/60">Centro Historico - Aracaju</span>
              </motion.div>
            </div>
          </div>

          {/* Notification button */}
          <motion.button 
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowNotifications(true)}
            className="relative p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm"
          >
            <Bell className="h-5 w-5 text-white" />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-primary"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Stats card - clickable */}
        <Link href="/perfil">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', damping: 20 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Points section */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">{currentUser.points.toLocaleString()}</p>
                  <p className="text-white/50 text-xs">pontos</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-px bg-white/10" />

              {/* Level section */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">Nivel {currentUser.levelNumber}</p>
                  <p className="text-amber-400 text-xs font-medium">{currentUser.level}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-white/40" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Progresso para Nivel {currentUser.levelNumber + 1}</span>
                <span className="text-xs text-white/70 font-medium">{progressToNextLevel}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-0 left-0 right-0 bg-card text-foreground z-50 rounded-b-3xl shadow-2xl max-h-[80vh] overflow-auto"
            >
              <div className="sticky top-0 bg-card/95 backdrop-blur-lg flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="font-bold text-lg">Notificacoes</h2>
                  <p className="text-xs text-muted-foreground">{unreadCount} nao lidas</p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="divide-y divide-border">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer',
                      !notification.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn(
                      'h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-lg',
                      notification.type === 'event' && 'bg-secondary/10',
                      notification.type === 'promo' && 'bg-live/10',
                      notification.type === 'points' && 'bg-gold/10',
                      notification.type === 'reward' && 'bg-success/10'
                    )}>
                      {notification.type === 'event' && '📅'}
                      {notification.type === 'promo' && '🏷️'}
                      {notification.type === 'points' && '⭐'}
                      {notification.type === 'reward' && '🎁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                        <span className="h-1 w-1 bg-muted-foreground rounded-full" />
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border">
                <button className="w-full py-3 text-center text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
                  Ver todas as notificacoes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
