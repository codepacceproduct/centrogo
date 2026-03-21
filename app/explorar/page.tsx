'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock3,
  Compass,
  Layers3,
  List,
  Map as MapIcon,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { BottomNav } from '@/components/bottom-nav'
import { Skeleton } from '@/components/skeleton-loader'
import {
  type ExplorarCategoria,
  explorarLocations,
  featuredExplorarLocations,
  formatLocationScore,
  hiddenExplorarLocations,
} from '@/lib/explorar-map'
import { cn } from '@/lib/utils'

const ExplorarMapLayer = dynamic(
  () => import('@/components/explorar/ExplorarMapLayer'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.18)_0%,rgba(15,23,42,0.05)_45%,rgba(15,23,42,0.18)_100%)]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      </div>
    ),
  },
)

function getCategoryPanelClass(category: ExplorarCategoria) {
  switch (category) {
    case 'comercio':
      return 'from-amber-500 via-amber-600 to-orange-700 text-white'
    case 'turismo':
      return 'from-emerald-500 via-emerald-600 to-teal-700 text-white'
    case 'mobilidade':
      return 'from-sky-500 via-sky-600 to-cyan-700 text-white'
    case 'servicos':
      return 'from-rose-500 via-rose-600 to-red-700 text-white'
    case 'referencia':
      return 'from-slate-500 via-slate-600 to-slate-800 text-white'
  }
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

export default function ExplorarPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    featuredExplorarLocations[0]?.id ?? null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      typeof window === 'undefined' ||
      !isMobileMapOpen ||
      window.innerWidth >= 1024
    ) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMapOpen])

  const locationById = useMemo(
    () => new Map(explorarLocations.map((location) => [location.id, location])),
    [],
  )

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) {
      return null
    }

    return locationById.get(selectedLocationId) ?? null
  }, [locationById, selectedLocationId])

  useEffect(() => {
    if (!selectedLocationId || isMobileMapOpen) {
      return
    }

    const node = cardRefs.current[selectedLocationId]
    node?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [isMobileMapOpen, selectedLocationId])

  const setCardRef = (locationId: string) => (node: HTMLDivElement | null) => {
    cardRefs.current[locationId] = node
  }

  const summaryTitle = selectedLocation
    ? selectedLocation.nome
    : 'Mapa vivo com hotspots mockados do centro'

  const summaryDescription = selectedLocation
    ? selectedLocation.descricao
    : 'Cada ponto usa score de relevancia calculado com peso de gamificacao x multiplicador de fluxo.'

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden pb-32 lg:pb-10 lg:pt-24">
      <div className="fixed inset-0 z-0">
        <ExplorarMapLayer
          locations={explorarLocations}
          selected={selectedLocation}
          onSelect={(location) => setSelectedLocationId(location.id)}
          isMobileFullscreen={isMobileMapOpen}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0)_32%,rgba(15,23,42,0.08)_100%)]" />

      <header className="sticky top-0 z-40 lg:top-24 lg:border-none lg:bg-transparent lg:backdrop-blur-0">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 lg:px-6 lg:py-2">
          <div className="flex w-full items-center gap-3 rounded-full border border-white/65 bg-background/88 px-4 py-3 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl lg:inline-flex lg:w-auto lg:px-5 lg:py-3">
            <Link
              href="/"
              className="-ml-2 rounded-full p-2 transition-colors hover:bg-muted/80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Explorar</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMapOpen((current) => !current)}
              aria-pressed={isMobileMapOpen}
              className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 lg:hidden"
            >
              {isMobileMapOpen ? (
                <List className="h-4 w-4" />
              ) : (
                <MapIcon className="h-4 w-4" />
              )}
              {isMobileMapOpen ? 'Ver cards' : 'Ver mapa'}
            </button>
          </div>
        </div>
      </header>

      <section
        className={cn(
          'relative z-20 px-3 pt-2 sm:px-4 sm:pt-3 lg:px-6 lg:pt-4',
          isMobileMapOpen && 'hidden lg:block',
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          <div className="max-w-2xl rounded-[1.9rem] border border-white/60 bg-background/84 p-4 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.62)] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                <Compass className="h-3.5 w-3.5 text-primary" />
                Camada Uber-style mockada
              </div>
              {selectedLocation ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                  {selectedLocation.badge}
                </span>
              ) : null}
            </div>

            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] text-balance text-foreground">
              {summaryTitle}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {summaryDescription}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/50 bg-background/72 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md">
                {explorarLocations.length} pontos mockados
              </div>
              <div className="rounded-full border border-white/50 bg-background/72 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md">
                Score = peso x fluxo
              </div>
              <div className="rounded-full border border-white/50 bg-background/72 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md">
                Rotas sincronizadas com a UI
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMapOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_38px_-20px_rgba(37,99,235,0.9)] transition-transform active:scale-[0.98]"
              >
                <MapIcon className="h-4 w-4" />
                Abrir mapa cheio
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/50 bg-background/74 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Relevancia
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {selectedLocation
                    ? formatLocationScore(selectedLocation.score)
                    : formatLocationScore(featuredExplorarLocations[0].score)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedLocation
                    ? `${selectedLocation.pesoGamificacao} x ${selectedLocation.multiplicadorFluxo}`
                    : 'Peso de gamificacao x multiplicador de fluxo'}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/50 bg-background/74 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Horario
                </div>
                <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {selectedLocation?.horarioFuncionamento ?? 'Dados mockados'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedLocation?.flowLabel ?? 'Baseado no dataset de operacao'}
                </p>
              </div>

              <div className="col-span-2 rounded-[1.5rem] border border-white/50 bg-background/74 p-4 shadow-sm backdrop-blur-md lg:col-span-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Publico
                </div>
                <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {selectedLocation?.audienceLabel ?? 'Turistas + moradores'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estado unico entre mapa, cards e rota
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div
        className={cn('h-10 sm:h-14 lg:h-20', isMobileMapOpen && 'hidden lg:block')}
        aria-hidden="true"
      />

      <section className={cn('relative z-20', isMobileMapOpen && 'hidden lg:block')}>
        <div className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-6">
          <div className="overflow-hidden rounded-t-[2rem] border border-border/70 bg-background/94 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:rounded-[2rem]">
            <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-foreground/10 sm:hidden" />

            <div className="grid gap-0 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
              <section className="px-3 pb-5 pt-5 sm:px-4 lg:px-6 lg:pb-6 lg:pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    Descobertas do Dia
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Top relevancias calculadas a partir do score mockado
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-[1.6rem] border border-border bg-card/90 p-3"
                        >
                          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </div>
                      ))
                    : featuredExplorarLocations.map((location, index) => {
                        const isSelected = location.id === selectedLocationId

                        return (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.22 + index * 0.06 }}
                            ref={setCardRef(location.id)}
                          >
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.985 }}
                              onClick={() => setSelectedLocationId(location.id)}
                              aria-pressed={isSelected}
                              className={cn(
                                'flex w-full gap-3 rounded-[1.65rem] border p-3 text-left transition-all',
                                isSelected
                                  ? 'border-primary/70 bg-background shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] ring-1 ring-primary/15'
                                  : 'border-border bg-card/92 hover:border-primary/30 hover:bg-card',
                              )}
                            >
                              <div
                                className={cn(
                                  'flex h-20 w-20 shrink-0 flex-col rounded-[1.3rem] bg-gradient-to-br p-3 shadow-lg',
                                  getCategoryPanelClass(location.categoria),
                                )}
                              >
                                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                                  {location.categoryLabel}
                                </span>
                                <span className="mt-auto text-lg font-semibold leading-none">
                                  {formatLocationScore(location.score)}
                                </span>
                                <span className="mt-1 text-[11px] text-white/80">
                                  {location.flowLabel}
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-sm font-semibold leading-snug text-foreground">
                                    {location.nome}
                                  </h3>
                                  {isSelected ? (
                                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                      Ativo
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                  {location.descricao}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span
                                    className={cn(
                                      'rounded-full px-2.5 py-1 text-[11px] font-medium',
                                      getCategoryBadgeClass(location.categoria),
                                    )}
                                  >
                                    {location.badge}
                                  </span>
                                  <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                    {location.horarioFuncionamento}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  <span className="truncate">{location.audienceLabel}</span>
                                </div>
                              </div>
                            </motion.button>
                          </motion.div>
                        )
                      })}
                </div>
              </section>

              <aside className="border-t border-border/60 bg-background/76 px-3 pb-5 pt-5 sm:px-4 lg:px-5 lg:pb-6 lg:pt-6 xl:border-l xl:border-t-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    Joias Escondidas
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Pontos com boa relevancia e fluxo menos saturado
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-[1.5rem] border border-border bg-card/92 p-4"
                        >
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="mt-3 h-3 w-full" />
                          <Skeleton className="mt-2 h-3 w-5/6" />
                          <Skeleton className="mt-4 h-10 w-full" />
                        </div>
                      ))
                    : hiddenExplorarLocations.map((location, index) => {
                        const isSelected = location.id === selectedLocationId

                        return (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.32 + index * 0.06 }}
                            ref={setCardRef(location.id)}
                          >
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.985 }}
                              onClick={() => setSelectedLocationId(location.id)}
                              className={cn(
                                'h-full w-full rounded-[1.5rem] border p-4 text-left transition-all',
                                isSelected
                                  ? 'border-primary/70 bg-background shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] ring-1 ring-primary/15'
                                  : 'border-border bg-card/92 hover:border-primary/30 hover:bg-card',
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span
                                  className={cn(
                                    'rounded-full px-2.5 py-1 text-[11px] font-medium',
                                    getCategoryBadgeClass(location.categoria),
                                  )}
                                >
                                  {location.categoryLabel}
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                  {formatLocationScore(location.score)}
                                </span>
                              </div>
                              <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
                                {location.nome}
                              </h3>
                              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                                {location.descricao}
                              </p>
                              <div className="mt-4 space-y-2 text-[11px] text-muted-foreground">
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
                              </div>
                            </motion.button>
                          </motion.div>
                        )
                      })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
