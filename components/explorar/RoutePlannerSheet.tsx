'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bike, BusFront, CarFront, Clock3, MapPin, Route, ShieldAlert, X } from 'lucide-react'

import type { ExplorarLocation } from '@/lib/explorar-map'
import { DEFAULT_EXPLORAR_CENTER } from '@/lib/explorar-map'
import { getRoute, type MapPoint, type RouteCoordinates, type RouteMode } from '@/services/mapbox'
import { cn } from '@/lib/utils'

export type TransportModeId = 'walk' | 'bike' | 'moto' | 'car' | 'uber' | 'bus'

type RoutePlannerSheetProps = {
  isOpen: boolean
  location: ExplorarLocation | null
  activeModeId: TransportModeId | null
  onSelectMode: (modeId: TransportModeId) => void
  onClose: () => void
  onEndRoute: () => void
}

type RouteSummary = {
  distanceKm: number
  durationByMode: Array<{
    id: TransportModeId
    label: string
    minutes: number
    helper: string
    icon: typeof Bike
    accent: string
  }>
  routeMode: RouteMode
  originLabel: string
}

const TRANSPORT_MODES = [
  { id: 'walk', label: 'A pe', speedKmh: 4.8, baseMinutes: 0, helper: 'Rota urbana mais direta', icon: Route, accent: 'bg-slate-100 text-slate-700' },
  { id: 'bike', label: 'Bicicleta', speedKmh: 14, baseMinutes: 1, helper: 'Bom para circuito curto no Centro', icon: Bike, accent: 'bg-emerald-100 text-emerald-700' },
  { id: 'moto', label: 'Moto', speedKmh: 30, baseMinutes: 2, helper: 'Chegada rapida com paradas curtas', icon: CarFront, accent: 'bg-amber-100 text-amber-700' },
  { id: 'car', label: 'Carro', speedKmh: 22, baseMinutes: 4, helper: 'Considera trafego urbano central', icon: CarFront, accent: 'bg-sky-100 text-sky-700' },
  { id: 'uber', label: 'Uber', speedKmh: 22, baseMinutes: 7, helper: 'Inclui espera media para embarque', icon: CarFront, accent: 'bg-violet-100 text-violet-700' },
  { id: 'bus', label: 'Onibus', speedKmh: 15, baseMinutes: 10, helper: 'Inclui espera e deslocamento entre pontos', icon: BusFront, accent: 'bg-rose-100 text-rose-700' },
] as const

function getDistanceInKmFromCoordinates(coordinates: RouteCoordinates) {
  if (coordinates.length < 2) return 0

  const toRadians = (value: number) => (value * Math.PI) / 180
  let total = 0

  for (let index = 1; index < coordinates.length; index += 1) {
    const [fromLng, fromLat] = coordinates[index - 1]
    const [toLng, toLat] = coordinates[index]
    const earthRadiusKm = 6371
    const dLat = toRadians(toLat - fromLat)
    const dLng = toRadians(toLng - fromLng)
    const originLat = toRadians(fromLat)
    const targetLat = toRadians(toLat)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    total += 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  return total
}

function formatDistance(distanceKm: number) {
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`
}

function getLocationLabel(point: MapPoint, isFallback: boolean) {
  if (isFallback) return 'Origem aproximada no Centro'
  return `Sua localização (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`
}

function buildRouteSteps(location: ExplorarLocation, modeLabel: string, etaLabel: string) {
  return [
    `Saia da sua localização atual e siga em direção ao eixo central do bairro Centro.`,
    modeLabel === 'Onibus'
      ? `Va para o ponto de embarque mais proximo e acompanhe a rota principal ate ${location.nome}.`
      : `Acompanhe a linha destacada no mapa seguindo o melhor trajeto para ${location.nome}.`,
    `Na aproximacao final, use as referencias do entorno para localizar ${location.nome} com seguranca.`,
    `Chegada estimada em ${etaLabel}. Encerrar a rota para limpar o trajeto do mapa.`,
  ]
}

export default function RoutePlannerSheet({
  isOpen,
  location,
  activeModeId,
  onSelectMode,
  onClose,
  onEndRoute,
}: RoutePlannerSheetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<RouteSummary | null>(null)

  useEffect(() => {
    if (!isOpen || !location) return

    let isCancelled = false

    const buildSummary = async () => {
      setIsLoading(true)
      setError(null)

      const resolveOrigin = async (): Promise<{ point: MapPoint; isFallback: boolean }> => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
          return { point: DEFAULT_EXPLORAR_CENTER, isFallback: true }
        }

        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                point: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                isFallback: false,
              })
            },
            () => resolve({ point: DEFAULT_EXPLORAR_CENTER, isFallback: true }),
            {
              enableHighAccuracy: true,
              timeout: 9000,
              maximumAge: 60000,
            },
          )
        })
      }

      try {
        const origin = await resolveOrigin()
        const route = await getRoute(origin.point, location)
        if (isCancelled) return

        const rawDistance = getDistanceInKmFromCoordinates(route.coordinates)
        const adjustedDistance = rawDistance <= 0 ? 0.2 : route.mode === 'fallback' ? rawDistance * 1.18 : rawDistance

        const durationByMode = TRANSPORT_MODES.map((mode) => ({
          id: mode.id,
          label: mode.label,
          minutes: Math.max(1, Math.round((adjustedDistance / mode.speedKmh) * 60 + mode.baseMinutes)),
          helper: mode.helper,
          icon: mode.icon,
          accent: mode.accent,
        }))

        setSummary({
          distanceKm: adjustedDistance,
          durationByMode,
          routeMode: route.mode,
          originLabel: getLocationLabel(origin.point, origin.isFallback),
        })
      } catch {
        if (isCancelled) return
        setError('Não foi possível calcular a rota agora. Tente novamente em alguns segundos.')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    void buildSummary()

    return () => {
      isCancelled = true
    }
  }, [isOpen, location])

  const fastestMode = useMemo(() => {
    if (!summary) return null
    return [...summary.durationByMode].sort((a, b) => a.minutes - b.minutes)[0] ?? null
  }, [summary])

  const selectedMode = useMemo(() => {
    if (!summary || !activeModeId) return null
    return summary.durationByMode.find((mode) => mode.id === activeModeId) ?? null
  }, [activeModeId, summary])

  const routeSteps = useMemo(() => {
    if (!location || !selectedMode) return []
    return buildRouteSteps(location, selectedMode.label, formatMinutes(selectedMode.minutes))
  }, [location, selectedMode])

  return (
    <AnimatePresence>
      {isOpen && location ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[78] bg-foreground/35 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.section
            initial={{ opacity: 0, y: 56, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-[79] max-h-[88vh] overflow-y-auto rounded-t-[2rem] border border-border/70 bg-background/96 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.72)] backdrop-blur-xl sm:left-1/2 sm:bottom-6 sm:max-h-[80vh] sm:max-w-3xl sm:-translate-x-1/2 sm:rounded-[2rem]"
          >
            <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-foreground/10 sm:hidden" />

            <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4 sm:px-6 sm:pt-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Rota ativa
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {location.categoryLabel}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">Ir para {location.nome}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Escolha o modal de transporte para iniciar a navegacao e manter a rota desenhada no mapa.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Fechar rota"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 border-t border-border/60 px-4 py-4 sm:grid-cols-3 sm:px-6">
              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Origem e destino
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{summary?.originLabel ?? 'Buscando origem...'}</p>
                <p className="mt-2 text-sm font-medium text-foreground">Destino: {location.nome}</p>
              </div>

              <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Route className="h-4 w-4 text-primary" />
                  Distancia
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {summary ? formatDistance(summary.distanceKm) : '--'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {summary?.routeMode === 'mapbox' ? 'Rota calculada com base viaria' : 'Estimativa fallback aproximada'}
                </p>
              </div>
            </div>

            <div className="border-t border-border/60 px-4 py-4 sm:px-6">
              {isLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-[1.35rem] bg-muted" />
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 rounded-[1.35rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              ) : summary ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {summary.durationByMode.map((mode) => {
                    const Icon = mode.icon
                    const isFastest = fastestMode?.id === mode.id
                    const isSelected = activeModeId === mode.id

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => onSelectMode(mode.id)}
                        className={cn(
                          'rounded-[1.35rem] border border-border/70 bg-card/80 p-4 text-left transition-all',
                          isSelected && 'border-primary/60 ring-1 ring-primary/20',
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={cn('rounded-2xl p-2', mode.accent)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {isFastest ? (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                              Mais rapido
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">{mode.label}</p>
                        <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                          <Clock3 className="h-4 w-4 text-primary" />
                          {formatMinutes(mode.minutes)}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{mode.helper}</p>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            {selectedMode ? (
              <div className="border-t border-border/60 px-4 py-4 sm:px-6">
                <div className="rounded-[1.5rem] border border-primary/20 bg-primary/5 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Rota em andamento via {selectedMode.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Siga a linha destacada no mapa. Tempo estimado: {formatMinutes(selectedMode.minutes)}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onEndRoute}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                    >
                      Encerrar rota
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {routeSteps.map((step, index) => (
                      <div key={`${selectedMode.id}-${index}`} className="flex gap-3 rounded-2xl bg-background/90 p-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  )
}

