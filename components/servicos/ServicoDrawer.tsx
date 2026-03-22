'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Grip, List, X } from 'lucide-react'

import type { ServicoPublico } from '@/lib/servicos-map'
import { cn } from '@/lib/utils'
import ServicoCard from './ServicoCard'

type DrawerSnap = 'peek' | 'medium' | 'full'

type ServicoDrawerProps = {
  isOpen: boolean
  snap: DrawerSnap
  selectedId: string | null
  servicos: ServicoPublico[]
  nearestId?: string | null
  distanceById: Record<string, string>
  onClose: () => void
  onSnapChange: (snap: DrawerSnap) => void
  onSelect: (servico: ServicoPublico) => void
  onFocusMap: (servico: ServicoPublico) => void
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

export default function ServicoDrawer({
  isOpen,
  snap,
  selectedId,
  servicos,
  nearestId = null,
  distanceById,
  onClose,
  onSnapChange,
  onSelect,
  onFocusMap,
}: ServicoDrawerProps) {
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
                if (snap === 'full') return onSnapChange('medium')
                if (snap === 'medium') return onSnapChange('peek')
                onClose()
                return
              }

              if (info.offset.y < -120) {
                if (snap === 'peek') return onSnapChange('medium')
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
              <h2 className="text-base font-semibold text-foreground">Servicos do Centro</h2>
              <p className="text-sm text-muted-foreground">Lista sincronizada com o mapa e os filtros</p>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              {(['peek', 'medium', 'full'] as const).map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSnapChange(option)}
                  className={cn(
                    'rounded-full border px-3 py-2 text-xs font-semibold',
                    snap === option ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground',
                  )}
                >
                  {index === 0 ? '30%' : index === 1 ? '70%' : 'Lista cheia'}
                </button>
              ))}
            </div>

            <div className="h-[calc(100%-7.5rem)] overflow-y-auto px-4 pb-6">
              <div className="grid gap-3">
                {servicos.map((servico) => (
                  <ServicoCard
                    key={servico.id}
                    servico={servico}
                    isSelected={servico.id === selectedId}
                    isNearest={servico.id === nearestId}
                    distanceLabel={distanceById[servico.id] ?? null}
                    onSelect={onSelect}
                    onFocusMap={onFocusMap}
                  />
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                <List className="h-3.5 w-3.5" />
                {servicos.length} servico{servicos.length === 1 ? '' : 's'} visiveis
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}