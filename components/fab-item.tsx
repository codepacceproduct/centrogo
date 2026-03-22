'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type FabItemProps = {
  icon: LucideIcon
  label: string
  colorClass: string
  index: number
  isHighlighted?: boolean
  badgeText?: string
  onClick: () => void
}

export default function FabItem({
  icon: Icon,
  label,
  colorClass,
  index,
  isHighlighted = false,
  badgeText,
  onClick,
}: FabItemProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.88 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group flex items-center gap-3"
    >
      <span className="hidden rounded-full border border-white/55 bg-background/92 px-3 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md sm:inline-flex">
        {label}
      </span>
      <span
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_18px_32px_-16px_rgba(15,23,42,0.45)] transition-transform duration-200',
          colorClass,
          isHighlighted && 'ring-2 ring-white/80 ring-offset-2 ring-offset-background',
        )}
      >
        {badgeText ? (
          <span className="absolute -right-2 -top-2 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-md">
            {badgeText}
          </span>
        ) : null}
        <Icon className="h-5 w-5" />
      </span>
    </motion.button>
  )
}