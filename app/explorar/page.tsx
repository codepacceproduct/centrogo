'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock3,
  Compass,
  Expand,
  Layers3,
  List,
  Shrink,
  Sparkles,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import FloatingLocationPreview from '@/components/explorar/FloatingLocationPreview'
import LocationDetailsSheet from '@/components/explorar/LocationDetailsSheet'
import LocationDrawer from '@/components/explorar/LocationDrawer'
import RoutePlannerSheet, { type TransportModeId } from '@/components/explorar/RoutePlannerSheet'
import { Skeleton } from '@/components/skeleton-loader'
import {
  type ExplorarCategoria,
  explorarLocations,
  featuredExplorarLocations,
  formatLocationScore,
  hiddenExplorarLocations,
  parkingExplorarLocations,
  type ExplorarLocation,
} from '@/lib/explorar-map'
import { cn } from '@/lib/utils'

const ExplorarMapLayer = dynamic(() => import('@/components/explorar/ExplorarMapLayer'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.18)_0%,rgba(15,23,42,0.05)_45%,rgba(15,23,42,0.18)_100%)]">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
    </div>
  ),
})

type DrawerSnap = 'peek' | 'medium' | 'full'

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

function LocationCardButton({
  location,
  isSelected,
  isHovered,
  onSelect,
  onHoverChange,
  compact = false,
}: {
  location: ExplorarLocation
  isSelected: boolean
  isHovered: boolean
  onSelect: (location: ExplorarLocation) => void
  onHoverChange: (locationId: string | null) => void
  compact?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985 }}
      onMouseEnter={() => onHoverChange(location.id)}
      onMouseLeave={() => onHoverChange(null)}
      onClick={() => onSelect(location)}
      className={cn(
        'w-full rounded-[1.5rem] border text-left transition-all',
        compact ? 'bg-background/80 p-3' : 'bg-card/92 p-4',
        isSelected
          ? 'border-primary/70 bg-background shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] ring-1 ring-primary/15'
          : isHovered
            ? 'border-primary/45 bg-card shadow-[0_18px_34px_-28px_rgba(37,99,235,0.35)]'
            : 'border-border hover:border-primary/30 hover:bg-card',
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
      </div>
    </motion.button>
  )
}

export default function ExplorarPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(featuredExplorarLocations[0]?.id ?? null)
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullMap, setIsFullMap] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [plannerLocationId, setPlannerLocationId] = useState<string | null>(null)
  const [activeRoute, setActiveRoute] = useState<{ locationId: string; modeId: TransportModeId } | null>(null)
  const [drawerSnap, setDrawerSnap] = useState<DrawerSnap>('peek')
  const [resetCounter, setResetCounter] = useState(0)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    if (!isFullMap || window.innerWidth >= 1024) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isFullMap])

  const locationById = useMemo(() => new Map(explorarLocations.map((location) => [location.id, location])), [])

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return null
    return locationById.get(selectedLocationId) ?? null
  }, [locationById, selectedLocationId])

  const plannerLocation = useMemo(() => {
    if (!plannerLocationId) return null
    return locationById.get(plannerLocationId) ?? null
  }, [locationById, plannerLocationId])

  const activeRouteLocation = useMemo(() => {
    if (!activeRoute) return null
    return locationById.get(activeRoute.locationId) ?? null
  }, [activeRoute, locationById])

  useEffect(() => {
    if (!selectedLocationId || isFullMap) return

    const node = cardRefs.current[selectedLocationId]
    node?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [isFullMap, selectedLocationId])

  const setCardRef = (locationId: string) => (node: HTMLDivElement | null) => {
    cardRefs.current[locationId] = node
  }

  function handleSelectLocation(location: ExplorarLocation, options?: { openDrawer?: boolean }) {
    setSelectedLocationId(location.id)
    setHoveredLocationId(location.id)
    setIsFullMap(true)
    setIsDetailsOpen(false)
    setPlannerLocationId(null)
    setActiveRoute(null)

    if (options?.openDrawer) {
      setIsDrawerOpen(true)
      setDrawerSnap('full')
      return
    }

    setIsDrawerOpen(false)
  }

  function handleResetView() {
    setSelectedLocationId(null)
    setHoveredLocationId(null)
    setIsDrawerOpen(false)
    setIsDetailsOpen(false)
    setPlannerLocationId(null)
    setActiveRoute(null)
    setResetCounter((current) => current + 1)
    setIsFullMap(true)
  }

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden pb-32 lg:pb-10 lg:pt-24">
      <div className={cn('fixed inset-0', isFullMap ? 'z-30' : 'z-0')}>
        <ExplorarMapLayer
          locations={explorarLocations}
          selected={selectedLocation}
          routeTarget={activeRouteLocation}
          hoveredLocationId={hoveredLocationId}
          onHoverChange={setHoveredLocationId}
          onSelect={(location) => handleSelectLocation(location)}
          isMobileFullscreen={isDrawerOpen}
          isFullMap={isFullMap}
          resetCounter={resetCounter}
        />
      </div>

      <div className={cn('pointer-events-none fixed inset-0', isFullMap ? 'z-40 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0)_28%,rgba(15,23,42,0.12)_100%)]' : 'z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0)_32%,rgba(15,23,42,0.08)_100%)]')} />

      <header className={cn('z-[60]', isFullMap ? 'fixed right-3 top-3 sm:right-4 lg:right-6 lg:top-6' : 'sticky top-0 lg:top-24 lg:border-none lg:bg-transparent lg:backdrop-blur-0')}>
        <div className={cn(isFullMap ? 'px-0 py-0' : 'mx-auto max-w-6xl px-3 py-3 sm:px-4 lg:px-6 lg:py-2')}>
          <div className={cn('flex items-center rounded-full border border-white/65 bg-background/88 px-4 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-all', isFullMap ? 'w-auto gap-3 py-2.5 lg:px-4' : 'w-full gap-3 py-3 lg:flex lg:w-full lg:px-5 lg:py-3')}>
            <Link href="/" className="-ml-2 rounded-full p-2 transition-colors hover:bg-muted/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">Explorar</h1>
                {isFullMap ? <p className="text-[11px] text-muted-foreground">Modo mapa em foco</p> : null}
              </div>
            </div>
            <div className="ml-auto flex items-center justify-end gap-2">
              {isFullMap ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(true)
                    setDrawerSnap('medium')
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 lg:hidden"
                >
                  <List className="h-4 w-4" />
                  Ver locais
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsFullMap((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {isFullMap ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                {isFullMap ? 'Ver cards' : 'Ver mapa'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isFullMap ? (
        <button
          type="button"
          onClick={() => {
            setIsDrawerOpen(true)
            setDrawerSnap('medium')
          }}
          className="fixed bottom-6 left-1/2 z-[70] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_38px_-20px_rgba(37,99,235,0.9)] transition-transform active:scale-[0.98] lg:hidden"
        >
          <List className="h-4 w-4" />
          Ver locais
        </button>
      ) : null}

      {!isFullMap ? (
        <>
          <div className="h-10 sm:h-14 lg:h-20" aria-hidden="true" />

          <section className="relative z-20">
            <div className="mx-auto max-w-6xl px-0 sm:px-4 lg:px-6">
              <div className="overflow-hidden rounded-t-[2rem] border border-border/70 bg-background/94 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:rounded-[2rem]">
                <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-foreground/10 sm:hidden" />

                <div className="grid gap-0 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
                  <section className="px-3 pb-5 pt-5 sm:px-4 lg:px-6 lg:pb-6 lg:pt-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                      <h2 className="text-lg font-semibold text-foreground">Descobertas do Dia</h2>
                      <p className="mb-4 text-sm text-muted-foreground">Top relevancias calculadas a partir do score mockado</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex gap-3 rounded-[1.6rem] border border-border bg-card/90 p-3">
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
                            const isHovered = location.id === hoveredLocationId

                            return (
                              <motion.div key={location.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + index * 0.06 }} ref={setCardRef(location.id)}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setHoveredLocationId(location.id)}
                                  onMouseLeave={() => setHoveredLocationId(null)}
                                  onClick={() => handleSelectLocation(location)}
                                  className={cn(
                                    'flex w-full gap-3 rounded-[1.65rem] border p-3 text-left transition-all',
                                    isSelected
                                      ? 'border-primary/70 bg-background shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] ring-1 ring-primary/15'
                                      : isHovered
                                        ? 'border-primary/45 bg-card shadow-[0_18px_34px_-28px_rgba(37,99,235,0.35)]'
                                        : 'border-border bg-card/92 hover:border-primary/30 hover:bg-card',
                                  )}
                                >
                                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.3rem] shadow-lg">
                                    {location.image ? (
                                      <Image
                                        src={location.image}
                                        alt={location.nome}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className={cn('flex h-full w-full flex-col rounded-[1.3rem] bg-gradient-to-br p-3', getCategoryPanelClass(location.categoria))}>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">{location.categoryLabel}</span>
                                        <span className="mt-auto text-lg font-semibold leading-none text-white">{formatLocationScore(location.score)}</span>
                                        <span className="mt-1 text-[11px] text-white/80">{location.flowLabel}</span>
                                      </div>
                                    )}
                                    <div className={cn('absolute bottom-1 left-1 rounded-lg px-1.5 py-0.5 text-[9px] font-bold text-white shadow bg-gradient-to-r', getCategoryPanelClass(location.categoria))}>
                                      {formatLocationScore(location.score)}
                                    </div>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <h3 className="text-sm font-semibold leading-snug text-foreground">{location.nome}</h3>
                                      {isSelected ? <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Ativo</span> : null}
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{location.descricao}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', getCategoryBadgeClass(location.categoria))}>{location.badge}</span>
                                      <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{location.horarioFuncionamento}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <Sparkles className="h-3.5 w-3.5" />
                                      <span className="truncate">{location.audienceLabel}</span>
                                    </div>
                                  </div>
                                </button>
                              </motion.div>
                            )
                          })}
                    </div>
                  </section>

                  <aside className="border-t border-border/60 bg-background/76 px-3 pb-5 pt-5 sm:px-4 lg:px-5 lg:pb-6 lg:pt-6 xl:border-l xl:border-t-0">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mb-4 rounded-[1.5rem] border border-border bg-card/92 p-4">
                      <h2 className="text-lg font-semibold text-foreground">Estacionamentos Proximos</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Pontos de apoio para chegar ao centro e seguir a rota pelo mapa.</p>
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        {isLoading
                          ? Array.from({ length: 3 }).map((_, index) => (
                              <div key={index} className="rounded-[1.25rem] border border-border bg-background/80 p-3">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="mt-2 h-3 w-full" />
                                <Skeleton className="mt-2 h-3 w-5/6" />
                              </div>
                            ))
                          : parkingExplorarLocations.map((location) => (
                              <LocationCardButton
                                key={location.id}
                                location={location}
                                compact
                                isSelected={location.id === selectedLocationId}
                                isHovered={location.id === hoveredLocationId}
                                onSelect={handleSelectLocation}
                                onHoverChange={setHoveredLocationId}
                              />
                            ))}
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                      <h2 className="text-lg font-semibold text-foreground">Joias Escondidas</h2>
                      <p className="mb-4 text-sm text-muted-foreground">Pontos com boa relevancia e fluxo menos saturado</p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      {isLoading
                        ? Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="rounded-[1.5rem] border border-border bg-card/92 p-4">
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="mt-3 h-3 w-full" />
                              <Skeleton className="mt-2 h-3 w-5/6" />
                              <Skeleton className="mt-4 h-10 w-full" />
                            </div>
                          ))
                        : hiddenExplorarLocations.map((location, index) => {
                            const isSelected = location.id === selectedLocationId
                            const isHovered = location.id === hoveredLocationId
                            return (
                              <motion.div key={location.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.32 + index * 0.06 }} ref={setCardRef(location.id)}>
                                <LocationCardButton
                                  location={location}
                                  isSelected={isSelected}
                                  isHovered={isHovered}
                                  onSelect={handleSelectLocation}
                                  onHoverChange={setHoveredLocationId}
                                />
                              </motion.div>
                            )
                          })}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <AnimatePresence>
        {isFullMap && selectedLocation ? (
          <FloatingLocationPreview
            location={selectedLocation}
            onOpenDetails={() => {
              setIsDetailsOpen(true)
              setIsDrawerOpen(false)
            }}
            onOpenRoute={() => {
              setPlannerLocationId(selectedLocation.id)
              setIsDrawerOpen(false)
              setIsDetailsOpen(false)
              setIsFullMap(true)
            }}
          />
        ) : null}
      </AnimatePresence>

      <LocationDetailsSheet
        isOpen={isDetailsOpen}
        location={selectedLocation}
        onClose={() => setIsDetailsOpen(false)}
      />

      <RoutePlannerSheet
        isOpen={Boolean(plannerLocation)}
        location={plannerLocation}
        activeModeId={activeRoute && plannerLocation && activeRoute.locationId === plannerLocation.id ? activeRoute.modeId : null}
        onSelectMode={(modeId) => {
          if (!plannerLocation) return
          setActiveRoute({ locationId: plannerLocation.id, modeId })
        }}
        onClose={() => setPlannerLocationId(null)}
        onEndRoute={() => {
          setActiveRoute(null)
          setPlannerLocationId(null)
        }}
      />

      <LocationDrawer
        isOpen={isDrawerOpen}
        snap={drawerSnap}
        selectedId={selectedLocationId}
        locations={explorarLocations}
        onClose={() => setIsDrawerOpen(false)}
        onSnapChange={setDrawerSnap}
        onSelect={(location) => handleSelectLocation(location, { openDrawer: true })}
        onHoverChange={setHoveredLocationId}
      />

    </main>
  )
}

