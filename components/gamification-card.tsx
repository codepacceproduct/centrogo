'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronRight, Sparkles, Trophy, Zap, Target } from 'lucide-react'
import { currentUser, getUserLevel } from '@/lib/data'
import Link from 'next/link'
import { AnimatedCounter, AnimatedProgress } from './animated-counter'

export function GamificationCard() {
  const [mounted, setMounted] = useState(false)
  const currentLevel = getUserLevel(currentUser.points)
  const progress = ((currentUser.points - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100

  useEffect(() => {
    setMounted(true)
  }, [])

  // Daily challenges (mock)
  const dailyChallenges = [
    { id: '1', title: 'Visitar 2 lojas', progress: 1, total: 2, points: 50, icon: '🏪' },
    { id: '2', title: 'Fazer check-in', progress: 0, total: 1, points: 30, icon: '📍' },
  ]

  const completedToday = dailyChallenges.filter(c => c.progress >= c.total).length

  return (
    <div className="px-4 -mt-2 max-w-7xl mx-auto lg:flex lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Main card with gradient */}
        <Link href="/perfil" className="block lg:flex-1">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="relative p-5 bg-gradient-to-br from-card via-card to-muted rounded-3xl border border-border shadow-lg"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

            {/* Top section */}
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Level badge */}
                <div className="relative">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20"
                  >
                    <Trophy className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-card"
                  >
                    {currentLevel.level}
                  </motion.div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Nivel</span>
                    <span className="px-2 py-0.5 bg-gold/10 text-gold-dark rounded-full text-xs font-bold">
                      {currentLevel.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    {mounted ? (
                      <AnimatedCounter 
                        value={currentUser.points} 
                        className="text-3xl font-bold" 
                        duration={1.5}
                      />
                    ) : (
                      <span className="text-3xl font-bold">0</span>
                    )}
                    <span className="text-sm text-muted-foreground">pontos</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Progress bar */}
            <div className="relative mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Proximo nivel</span>
                <span className="font-medium text-gold-dark">
                  {currentLevel.maxPoints - currentUser.points} pts restantes
                </span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-gold via-gold to-gold-dark rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Daily challenges section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 p-4 bg-card rounded-2xl border border-border lg:mt-0 lg:flex-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Desafios do Dia</h3>
                <p className="text-xs text-muted-foreground">{completedToday}/{dailyChallenges.length} completados</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gold-dark">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-bold">+80 pts</span>
            </div>
          </div>

          <div className="space-y-2">
            {dailyChallenges.map((challenge, index) => {
              const isComplete = challenge.progress >= challenge.total
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    isComplete ? 'bg-success/10' : 'bg-muted/50'
                  }`}
                >
                  <span className="text-lg">{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                      {challenge.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                          className={`h-full rounded-full ${isComplete ? 'bg-success' : 'bg-primary'}`}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-gold-dark">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-xs font-semibold">+{challenge.points}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
