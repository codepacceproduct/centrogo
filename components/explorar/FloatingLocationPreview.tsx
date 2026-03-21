'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'

import type { ExplorarCategoria, ExplorarLocation } from '@/lib/explorar-map'
import { formatLocationScore } from '@/lib/explorar-map'
import { cn } from '@/lib/utils'

function getCategoryBadgeClass(category: ExplorarCategoria) {
  switch (category) {
    case 'comercio':
      return 'bg-amber-500/12 text-amber-700'
    case 'turismo':
      return 'bg-emerald-500/12 text-emerald-700'
    case 'mobilidade':
      return 'bg-sky-500/12 text-sky-700'
    case 'servicos':
      return 'bg-rose-500/12 text-rose-700'
    case 'referencia':
      return 'bg-slate-500/12 text-slate-700'
  }
}

type FloatingLocationPreviewProps = {
  location: ExplorarLocation
  onOpenDetails: () => void
}

export default function FloatingLocationPreview({ location, onOpenDetails }: FloatingLocationPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="fixed inset-x-3 bottom-20 z-[72] mx-auto w-auto max-w-xl lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0 lg:w-[24rem]"
    >
      <button
        type="button"
        onClick={onOpenDetails}
        className="w-full rounded-[1.7rem] border border-white/55 bg-background/92 p-4 text-left shadow-[0_24px_70px_-30px_rgba(15,23,42,0.72)] backdrop-blur-xl transition-transform hover:scale-[1.01]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold', getCategoryBadgeClass(location.categoria))}>
              {location.categoryLabel}
            </span>
            <h3 className="mt-3 text-base font-semibold text-foreground">{location.nome}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{location.descricao}</p>
          </div>
          <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            {formatLocationScore(location.score)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{location.horarioFuncionamento}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{location.badge}</span>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Ver detalhes
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </button>
    </motion.div>
  )
}
