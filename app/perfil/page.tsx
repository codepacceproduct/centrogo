'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, ChevronRight, Gift, History, Trophy, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { currentUser, rewards, getUserLevel } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function PerfilPage() {
  const [showRewardSuccess, setShowRewardSuccess] = useState(false)
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null)
  const currentLevel = getUserLevel(currentUser.points)
  const progress = ((currentUser.points - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100

  const handleRedeem = (rewardId: string, pointsCost: number) => {
    if (currentUser.points >= pointsCost) {
      setRedeemedReward(rewardId)
      setShowRewardSuccess(true)
      setTimeout(() => setShowRewardSuccess(false), 3000)
    }
  }

  return (
    <main className="pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-secondary text-primary-foreground pb-20 pt-4 px-4">
        <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-gold rounded-full flex items-center justify-center border-2 border-primary">
              <Star className="h-4 w-4 text-gold-dark fill-gold-dark" />
            </div>
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold"
            >
              {currentUser.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-primary-foreground/80 text-sm"
            >
              {currentUser.city}
            </motion.p>
          </div>
        </div>
      </header>

      {/* Card de Pontos */}
      <div className="px-4 -mt-14 relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Seus pontos</p>
              <p className="text-3xl font-bold">{currentUser.points.toLocaleString()}</p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-gold/20 text-gold-dark rounded-full text-sm font-semibold">
              Nível {currentLevel.level} - {currentLevel.name}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progresso para o próximo nível</span>
              <span>{currentLevel.maxPoints - currentUser.points} pts restantes</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conquistas */}
      <section className="mt-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Minhas Conquistas</h2>
          <span className="text-sm text-muted-foreground">
            {currentUser.achievements.filter(a => a.unlocked).length}/{currentUser.achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {currentUser.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl border text-center',
                achievement.unlocked 
                  ? 'bg-card border-gold/30' 
                  : 'bg-muted/50 border-border opacity-50'
              )}
            >
              <div className={cn(
                'text-2xl mb-1',
                !achievement.unlocked && 'grayscale'
              )}>
                {achievement.icon}
              </div>
              <p className="text-xs font-medium line-clamp-2">{achievement.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Central de Recompensas */}
      <section className="mt-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Central de Recompensas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {rewards.map((reward, index) => {
            const canRedeem = currentUser.points >= reward.pointsCost
            const isRedeemed = redeemedReward === reward.id

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={cn(
                  'flex gap-3 p-3 bg-card rounded-xl border',
                  isRedeemed ? 'border-success bg-success/5' : 'border-border'
                )}
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{reward.title}</h3>
                  <p className="text-xs text-muted-foreground">{reward.storeName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                      <span className="text-sm font-semibold">{reward.pointsCost} pts</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                      disabled={!canRedeem || isRedeemed}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        isRedeemed 
                          ? 'bg-success text-primary-foreground'
                          : canRedeem 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {isRedeemed ? 'Resgatado!' : canRedeem ? 'Resgatar' : 'Pontos insuficientes'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Histórico */}
      <section className="mt-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <History className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Histórico de Atividades</h2>
        </div>

        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {currentUser.history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center',
                  item.type === 'earned' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                )}>
                  {item.type === 'earned' ? '+' : '-'}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <span className={cn(
                'font-semibold',
                item.type === 'earned' ? 'text-success' : 'text-muted-foreground'
              )}>
                {item.type === 'earned' ? '+' : ''}{item.points} pts
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu adicional */}
      <section className="mt-6 px-4 pb-4 max-w-7xl mx-auto">
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <button className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Configurações</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 text-destructive">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Modal de sucesso no resgate */}
      <AnimatePresence>
        {showRewardSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/50"
              onClick={() => setShowRewardSuccess(false)}
            />
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-card rounded-2xl p-8 text-center relative z-10 max-w-sm mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Parabéns!</h3>
              <p className="text-muted-foreground">
                Recompensa resgatada com sucesso! Apresente este cupom na loja para utilizar.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRewardSuccess(false)}
                className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                Entendi
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  )
}
