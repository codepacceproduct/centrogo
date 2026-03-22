'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Crosshair, Expand, List, MapPinned, Shrink } from 'lucide-react'
import Link from 'next/link'

import ServicoCard from '@/components/servicos/ServicoCard'
import ServicoDrawer from '@/components/servicos/ServicoDrawer'
import ServicoFilters from '@/components/servicos/ServicoFilters'
import ServicoPreview from '@/components/servicos/ServicoPreview'
import {
  DEFAULT_SERVICOS_CENTER,
  formatDistance,
  getDistanceInMeters,
  servicosPublicos,
  type ServicoCategoria,
  type ServicoPublico,
} from '@/lib/servicos-map'
import { cn } from '@/lib/utils'
import type { MapPoint } from '@/services/mapbox'

const ServicoMap = dynamic(() => import('@/components/servicos/ServicoMap'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] rounded-[2rem] bg-muted animate-pulse" />,
})

type DrawerSnap = 'peek' | 'medium' | 'full'

export default function ServicosPage() {
  const [selectedServicoId, setSelectedServicoId] = useState<string | null>(servicosPublicos[0]?.id ?? null)
  const [activeCategory, setActiveCategory] = useState<'all' | ServicoCategoria>('all')
  const [isMapFull, setIsMapFull] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerSnap, setDrawerSnap] = useState<DrawerSnap>('peek')
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMapFull(true)
    }
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation(DEFAULT_SERVICOS_CENTER)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      },
    )
  }, [])

  const filteredServicos = useMemo(() => {
    return servicosPublicos.filter((servico) => activeCategory === 'all' || servico.categoria === activeCategory)
  }, [activeCategory])

  const nearestServico = useMemo(() => {
    if (!userLocation || filteredServicos.length === 0) return null

    return filteredServicos.reduce<ServicoPublico | null>((nearest, servico) => {
      if (!nearest) return servico
      const currentDistance = getDistanceInMeters(userLocation, { lat: servico.lat, lng: servico.lng })
      const bestDistance = getDistanceInMeters(userLocation, { lat: nearest.lat, lng: nearest.lng })
      return currentDistance < bestDistance ? servico : nearest
    }, null)
  }, [filteredServicos, userLocation])

  const distanceById = useMemo<Record<string, string>>(() => {
    if (!userLocation) return {}

    return Object.fromEntries(
      filteredServicos.map((servico) => [
        servico.id,
        formatDistance(getDistanceInMeters(userLocation, { lat: servico.lat, lng: servico.lng })),
      ]),
    )
  }, [filteredServicos, userLocation])

  useEffect(() => {
    if (filteredServicos.length === 0) {
      setSelectedServicoId(null)
      return
    }

    const stillVisible = filteredServicos.some((servico) => servico.id === selectedServicoId)
    if (!stillVisible) {
      setSelectedServicoId(nearestServico?.id ?? filteredServicos[0].id)
    }
  }, [filteredServicos, nearestServico, selectedServicoId])

  const selectedServico = useMemo(() => {
    if (!selectedServicoId) return filteredServicos[0] ?? null
    return filteredServicos.find((servico) => servico.id === selectedServicoId) ?? filteredServicos[0] ?? null
  }, [filteredServicos, selectedServicoId])

  const handleSelectServico = (servico: ServicoPublico) => {
    setSelectedServicoId(servico.id)
  }

  const handleFocusMap = (servico: ServicoPublico) => {
    setSelectedServicoId(servico.id)
    setIsMapFull(true)
    setIsDrawerOpen(false)
  }

  const handleNearest = () => {
    if (!nearestServico) return
    setActiveCategory('all')
    setSelectedServicoId(nearestServico.id)
    setIsMapFull(true)
    setIsDrawerOpen(false)
  }

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden pb-32 lg:pb-10 lg:pt-24">
      <div className={cn('fixed inset-0', isMapFull ? 'z-30' : 'z-0')}>
        <ServicoMap
          servicos={filteredServicos}
          selectedServico={selectedServico}
          userLocation={userLocation}
          nearestServicoId={nearestServico?.id ?? null}
          isMapFull={isMapFull}
          isMobileFullscreen={isDrawerOpen}
          onSelect={handleSelectServico}
        />
      </div>

      <div className={cn('pointer-events-none fixed inset-0', isMapFull ? 'z-40 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0)_28%,rgba(15,23,42,0.12)_100%)]' : 'z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0)_32%,rgba(15,23,42,0.08)_100%)]')} />

      <header className={cn('z-[60]', isMapFull ? 'fixed right-3 top-3 left-3 sm:right-4 sm:left-4 lg:left-6 lg:right-6 lg:top-6' : 'sticky top-0 border-b border-border bg-background lg:top-20')}>
        <div className={cn(isMapFull ? 'px-0 py-0' : 'mx-auto max-w-7xl px-4 py-3')}>
          <div className={cn('flex items-center gap-3 rounded-full border border-white/65 bg-background/88 px-4 py-3 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl', !isMapFull && 'rounded-none border-0 bg-transparent px-0 py-0 shadow-none backdrop-blur-0 lg:rounded-full lg:border lg:bg-background/88 lg:px-4 lg:py-3 lg:shadow-[0_14px_40px_-24px_rgba(15,23,42,0.22)] lg:backdrop-blur-xl')}>
            <Link href="/" className="rounded-full p-2 transition-colors hover:bg-muted/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">Servicos</h1>
                <p className="text-[11px] text-muted-foreground">Serviços públicos no centro com mapa, contato e geolocalização</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleNearest}
                className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Crosshair className="h-4 w-4" />
                Proximos de mim
              </button>
              {isMapFull ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(true)
                    setDrawerSnap('medium')
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 lg:hidden"
                >
                  <List className="h-4 w-4" />
                  Ver lista
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsMapFull((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {isMapFull ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                {isMapFull ? 'Ver lista' : 'Ver mapa'}
              </button>
            </div>
          </div>

          {!isMapFull ? (
            <div className="mt-3">
              <ServicoFilters activeCategory={activeCategory} onChange={setActiveCategory} />
            </div>
          ) : null}
        </div>
      </header>

      {isMapFull ? (
        <button
          type="button"
          onClick={() => {
            setIsDrawerOpen(true)
            setDrawerSnap('medium')
          }}
          className="fixed bottom-6 left-1/2 z-[70] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_38px_-20px_rgba(37,99,235,0.9)] transition-transform active:scale-[0.98] lg:hidden"
        >
          <List className="h-4 w-4" />
          Ver servicos
        </button>
      ) : null}

      {!isMapFull ? (
        <section className="relative z-20 mx-auto max-w-7xl px-4 py-4">
          <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Lista de servicos</h2>
                <p className="text-sm text-muted-foreground">Cards sincronizados com o mapa, categoria e acoes criticas.</p>
              </div>
              <div className="grid gap-4">
                {filteredServicos.map((servico) => (
                  <ServicoCard
                    key={servico.id}
                    servico={servico}
                    isSelected={servico.id === selectedServico?.id}
                    isNearest={servico.id === nearestServico?.id}
                    distanceLabel={distanceById[servico.id] ?? null}
                    onSelect={handleSelectServico}
                    onFocusMap={handleFocusMap}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Mapa de serviços públicos</h2>
                    <p className="text-sm text-muted-foreground">Clique no card para destacar o marker ou abra o modo mapa para navegacao rapida.</p>
                  </div>
                  <ServicoFilters activeCategory={activeCategory} onChange={setActiveCategory} />
                </div>
              </div>
              <div className="h-[560px]">
                <ServicoMap
                  servicos={filteredServicos}
                  selectedServico={selectedServico}
                  userLocation={userLocation}
                  nearestServicoId={nearestServico?.id ?? null}
                  onSelect={handleSelectServico}
                />
              </div>
            </section>
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {isMapFull && selectedServico ? (
          <ServicoPreview
            servico={selectedServico}
            distanceLabel={distanceById[selectedServico.id] ?? null}
            isNearest={selectedServico.id === nearestServico?.id}
            onOpenList={() => {
              setIsDrawerOpen(true)
              setDrawerSnap('full')
            }}
          />
        ) : null}
      </AnimatePresence>

      <ServicoDrawer
        isOpen={isDrawerOpen}
        snap={drawerSnap}
        selectedId={selectedServico?.id ?? null}
        servicos={filteredServicos}
        nearestId={nearestServico?.id ?? null}
        distanceById={distanceById}
        onClose={() => setIsDrawerOpen(false)}
        onSnapChange={setDrawerSnap}
        onSelect={(servico) => {
          handleSelectServico(servico)
          setDrawerSnap('full')
        }}
        onFocusMap={handleFocusMap}
      />

    </main>
  )
}
