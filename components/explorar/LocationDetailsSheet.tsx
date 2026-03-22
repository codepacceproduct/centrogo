'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Clock3, Layers3, MapPin, Sparkles, Users, X } from 'lucide-react'

import {
  type ExplorarCategoria,
  type ExplorarLocation,
  formatLocationScore,
} from '@/lib/explorar-map'
import { cn } from '@/lib/utils'

type LocationDetailsSheetProps = {
  isOpen: boolean
  location: ExplorarLocation | null
  onClose: () => void
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

export default function LocationDetailsSheet({ isOpen, location, onClose }: LocationDetailsSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && location ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[76] bg-foreground/28 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.section
            initial={{ opacity: 0, y: 56, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-[77] overflow-hidden rounded-t-[2rem] border border-border/70 bg-background/96 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.72)] backdrop-blur-xl sm:left-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:bottom-6 sm:rounded-[2rem]"
          >
            {/* Indicador drag — mobile */}
            <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-foreground/10 sm:hidden" />

            {/* Botão Voltar — apenas mobile */}
            <div className="flex items-center gap-2 px-4 pt-3 sm:hidden">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4 sm:px-6 sm:pt-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', getCategoryBadgeClass(location.categoria))}>
                    {location.categoryLabel}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {formatLocationScore(location.score)}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">{location.nome}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{location.descricao}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Fechar detalhes"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 border-t border-border/60 px-4 py-4 sm:grid-cols-2 sm:px-6">
              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Horario
                </div>
                <p className="mt-2 text-base font-semibold text-foreground">{location.horarioFuncionamento}</p>
                <p className="mt-1 text-sm text-muted-foreground">Funcionamento estimado do ponto.</p>
              </div>

              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Fluxo e relevancia
                </div>
                <p className="mt-2 text-base font-semibold text-foreground">{location.flowLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">Peso {location.pesoGamificacao.toFixed(1)} x multiplicador {location.multiplicadorFluxo.toFixed(1)}.</p>
              </div>

              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Publico predominante
                </div>
                <p className="mt-2 text-base font-semibold text-foreground">{location.audienceLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">Perfil principal esperado para esse ponto.</p>
              </div>

              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Tag de descoberta
                </div>
                <p className="mt-2 text-base font-semibold text-foreground">{location.badge}</p>
                <p className="mt-1 text-sm text-muted-foreground">Sinal usado para destacar o ponto na exploracao.</p>
              </div>
            </div>

            <div className="border-t border-border/60 px-4 py-4 sm:px-6">
              <div className="rounded-[1.35rem] border border-border/70 bg-background/85 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Localizacao no mapa
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Lat {location.lat.toFixed(5)} , Lng {location.lng.toFixed(5)}. O mapa continua sincronizado com este ponto enquanto o painel estiver aberto.
                </p>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  )
}
