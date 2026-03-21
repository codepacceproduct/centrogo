'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock3, Grip, Layers3, Sparkles, Users, X } from 'lucide-react'

import {
  type ExplorarCategoria,
  type ExplorarLocation,
  formatLocationScore,
} from '@/lib/explorar-map'
import { cn } from '@/lib/utils'

type DrawerSnap = 'peek' | 'medium' | 'full'

type LocationDrawerProps = {
  isOpen: boolean
  snap: DrawerSnap
  selectedId: string | null
  locations: ExplorarLocation[]
  onClose: () => void
  onSnapChange: (snap: DrawerSnap) => void
  onSelect: (location: ExplorarLocation) => void
  onHoverChange: (locationId: string | null) => void
}

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

function getDrawerHeightClass(snap: DrawerSnap) {
  switch (snap) {
    case 'peek':
      return 'h-[32vh]'
    case 'medium':
      return 'h-[68vh]'
    case 'full':
      return 'h-[92vh]'
  }
}

export default function LocationDrawer({
  isOpen,
  snap,
  selectedId,
  locations,
  onClose,
  onSnapChange,
  onSelect,
  onHoverChange,
}: LocationDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[74] bg-foreground/18 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                if (snap === 'full') {
                  onSnapChange('medium')
                  return
                }
                if (snap === 'medium') {
                  onSnapChange('peek')
                  return
                }
                onClose()
                return
              }

              if (info.offset.y < -120) {
                if (snap === 'peek') {
                  onSnapChange('medium')
                  return
                }
                onSnapChange('full')
              }
            }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-[75] overflow-hidden rounded-t-[2rem] border border-border/70 bg-background/96 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.7)] backdrop-blur-xl lg:hidden',
              getDrawerHeightClass(snap),
            )}
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (snap === 'peek') onSnapChange('medium')
                  else if (snap === 'medium') onSnapChange('full')
                  else onSnapChange('peek')
                }}
                className="mx-auto inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"
              >
                <Grip className="h-4 w-4" />
                {snap === 'peek' ? 'Expandir' : snap === 'medium' ? 'Abrir lista total' : 'Reduzir'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pb-3">
              <h2 className="text-base font-semibold text-foreground">Locais do Centro</h2>
              <p className="text-sm text-muted-foreground">Lista sincronizada com o mapa em tempo real</p>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              <button
                type="button"
                onClick={() => onSnapChange('peek')}
                className={cn('rounded-full border px-3 py-2 text-xs font-semibold', snap === 'peek' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground')}
              >
                30%
              </button>
              <button
                type="button"
                onClick={() => onSnapChange('medium')}
                className={cn('rounded-full border px-3 py-2 text-xs font-semibold', snap === 'medium' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground')}
              >
                70%
              </button>
              <button
                type="button"
                onClick={() => onSnapChange('full')}
                className={cn('rounded-full border px-3 py-2 text-xs font-semibold', snap === 'full' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground')}
              >
                Lista cheia
              </button>
            </div>

            <div className="h-[calc(100%-7.5rem)] overflow-y-auto px-4 pb-6">
              <div className="grid gap-3">
                {locations.map((location, index) => {
                  const isSelected = location.id === selectedId

                  return (
                    <motion.button
                      key={location.id}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileTap={{ scale: 0.985 }}
                      onMouseEnter={() => onHoverChange(location.id)}
                      onMouseLeave={() => onHoverChange(null)}
                      onClick={() => onSelect(location)}
                      className={cn(
                        'rounded-[1.45rem] border p-4 text-left transition-all',
                        isSelected
                          ? 'border-primary/70 bg-background shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] ring-1 ring-primary/15'
                          : 'border-border bg-card/92 hover:border-primary/30 hover:bg-card',
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', getCategoryBadgeClass(location.categoria))}>
                          {location.categoryLabel}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{formatLocationScore(location.score)}</span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">{location.nome}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{location.descricao}</p>
                      <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5" />
                          <span>{location.horarioFuncionamento}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers3 className="h-3.5 w-3.5" />
                          <span>{location.flowLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          <span className="truncate">{location.audienceLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{location.badge}</span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
