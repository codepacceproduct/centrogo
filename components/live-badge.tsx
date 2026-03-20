'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LiveBadgeProps {
  className?: string
  text?: string
}

export function LiveBadge({ className, text = 'AO VIVO' }: LiveBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 bg-live rounded-full',
        className
      )}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="h-2 w-2 bg-primary-foreground rounded-full"
      />
      <span className="text-[10px] font-bold text-primary-foreground tracking-wide">
        {text}
      </span>
    </motion.div>
  )
}

interface PromoBadgeProps {
  text: string
  className?: string
  variant?: 'live' | 'promo' | 'new' | 'hot'
}

export function PromoBadge({ text, className, variant = 'promo' }: PromoBadgeProps) {
  const variants = {
    live: 'bg-live',
    promo: 'bg-destructive',
    new: 'bg-success',
    hot: 'bg-gradient-to-r from-orange-500 to-red-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-md',
        variants[variant],
        className
      )}
    >
      <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wide">
        {text}
      </span>
    </motion.div>
  )
}

interface PointsBadgeProps {
  points: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showPlus?: boolean
}

export function PointsBadge({ points, className, size = 'md', showPlus = true }: PointsBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 10 }}
      className={cn(
        'inline-flex items-center gap-1 bg-gold/20 text-gold-dark rounded-full font-semibold',
        sizes[size],
        className
      )}
    >
      <span>⭐</span>
      <span>{showPlus && points > 0 ? '+' : ''}{points}</span>
    </motion.div>
  )
}
