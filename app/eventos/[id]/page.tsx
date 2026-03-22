'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Share2, Check, Store, UtensilsCrossed, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { AccessibilityMapCard } from '@/components/accessibility/accessibility-map-card'
import { AccessibilityPhysicalCard } from '@/components/accessibility/accessibility-physical-card'
import { StoreCard } from '@/components/store-card'
import { events as appEvents, stores, getRandomAttendees, type Event as AppEvent } from '@/lib/data'
import { EVENT_CATEGORY_META, normalizeEventGeoJson, type EventGeoJson, type EventMapItem } from '@/lib/eventos-map'
import { normalizeText } from '@/lib/text'
import { cn } from '@/lib/utils'

type EventDetailSource =
  | { kind: 'map'; event: EventMapItem }
  | { kind: 'app'; event: AppEvent }

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isInterested, setIsInterested] = useState(false)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [mapEvents, setMapEvents] = useState<EventMapItem[]>([])
  const [isLoadingMapEvents, setIsLoadingMapEvents] = useState(true)
  const attendees = useMemo(() => getRandomAttendees(), [])

  useEffect(() => {
    let isCancelled = false

    const loadEvents = async () => {
      try {
        const response = await fetch('/mock/eventos.json', { cache: 'no-store' })
        const geoJson = (await response.json()) as EventGeoJson

        if (!isCancelled) {
          setMapEvents(normalizeEventGeoJson(geoJson))
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingMapEvents(false)
        }
      }
    }

    void loadEvents()

    return () => {
      isCancelled = true
    }
  }, [])

  const detail = useMemo<EventDetailSource | null>(() => {
    const mapEvent = mapEvents.find((item) => item.id === id)
    if (mapEvent) return { kind: 'map', event: mapEvent }

    const appEvent = appEvents.find((item) => item.id === id)
    if (appEvent) return { kind: 'app', event: appEvent }

    return null
  }, [id, mapEvents])

  const nearbyStores = useMemo(() => {
    if (!detail) return []

    if (detail.kind === 'app') {
      return stores.filter((store) => detail.event.nearbyStores.includes(store.id))
    }

    return stores.slice(0, 3)
  }, [detail])

  const handleInterest = () => {
    if (!isInterested) {
      setIsInterested(true)
      setShowPointsAnimation(true)
      setTimeout(() => setShowPointsAnimation(false), 2000)
    }
  }

  const handleShare = async () => {
    const title = detail?.kind === 'map' ? detail.event.nome : detail?.event.title
    if (!title) return

    if (navigator.share) {
      await navigator.share({
        title,
        text: `Confira este evento: ${title}`,
        url: window.location.href,
      })
    }
  }

  if (!detail && isLoadingMapEvents) {
    return (
      <main className="pb-24 pt-16 lg:pb-8 lg:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="h-16 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-4 h-[320px] animate-pulse rounded-[2rem] bg-muted" />
          <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="h-[420px] animate-pulse rounded-[2rem] bg-muted" />
            <div className="h-[420px] animate-pulse rounded-[2rem] bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (!detail) {
    return (
      <main className="pb-24 pt-16 lg:pb-8 lg:pt-24">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <p className="mb-3 text-4xl">:-(</p>
            <h2 className="font-semibold text-lg">Evento nao encontrado</h2>
            <Link href="/eventos" className="mt-2 inline-block text-sm text-primary">
              Voltar para eventos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isMapEvent = detail.kind === 'map'
  const title = isMapEvent ? detail.event.nome : detail.event.title
  const description = isMapEvent ? detail.event.descricao : detail.event.description
  const startDate = isMapEvent ? detail.event.dataInicio : detail.event.date
  const endDate = isMapEvent ? detail.event.dataFim : detail.event.date
  const timeLabel = isMapEvent ? detail.event.horario : detail.event.time
  const locationLabel = isMapEvent ? detail.event.endereco : detail.event.location
  const image = detail.event.image ?? '/img-centro/forrocaju.jpg'
  const categoryLabel = isMapEvent ? EVENT_CATEGORY_META[detail.event.categoria].label : detail.event.categoryTag
  const categoryPillClass = isMapEvent ? EVENT_CATEGORY_META[detail.event.categoria].pillClass : 'bg-primary/10 text-primary'
  const attractions = isMapEvent ? detail.event.atracoes : []
  const ambulantes = isMapEvent ? detail.event.ambulantes : []
  const physicalAccessibility = detail.event.physicalAccessibility
  const accessibilityMap = detail.event.accessibilityMap
  const dateFormatted = format(parseISO(startDate), "EEEE, dd 'de' MMMM", { locale: ptBR })
  const hasMultipleDates = startDate !== endDate

  return (
    <main className="pb-24 pt-16 lg:pb-8 lg:pt-24">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/96 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-2 transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-semibold text-lg">Detalhes do Evento</h1>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleShare()}
            className="rounded-full p-2 transition-colors hover:bg-muted"
            aria-label="Compartilhar evento"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_22px_60px_-38px_rgba(15,23,42,0.45)]">
          <div className="relative h-[340px] md:h-[400px] lg:h-[440px]">
            <Image src={image} alt={title} fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', categoryPillClass, 'border border-white/10 shadow-sm backdrop-blur-sm')}>
                {categoryLabel}
              </span>
              <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-white lg:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/78 lg:text-base line-clamp-2">{description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/82">
                <span>{dateFormatted}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                <span>{timeLabel}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                <span>{locationLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  Data
                </div>
                <p className="mt-3 font-semibold">{dateFormatted}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasMultipleDates ? `Vai ate ${format(parseISO(endDate), 'dd/MM/yyyy')}` : 'Evento em data unica'}
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Horario
                </div>
                <p className="mt-3 font-semibold">{timeLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">Janela principal exibida no mapa e nos cards</p>
              </div>

              <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm md:col-span-2 xl:col-span-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-primary" />
                  Publico
                </div>
                <p className="mt-3 font-semibold">{attendees} pessoas acompanhando</p>
                <p className="mt-1 text-sm text-muted-foreground">Presenca e interesse mockados para a experiencia</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">Sobre o evento</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Contexto principal e informacoes de apoio</p>
                </div>
                <div className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  {isMapEvent ? `${ambulantes.length} ambulante${ambulantes.length === 1 ? '' : 's'}` : 'Evento em destaque'}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>

              {attractions.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Atracoes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attractions.map((item) => (
                      <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <AccessibilityPhysicalCard data={physicalAccessibility} />

            <AccessibilityMapCard
              data={accessibilityMap}
              description="Planejamento de chegada, circulacao e leitura do entorno para quem vai ao evento."
            />

            {isMapEvent ? (
              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                  Ambulantes vinculados
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {ambulantes.map((ambulante) => (
                    <div key={ambulante.id} className="rounded-2xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-medium">{ambulante.nome}</h4>
                          <p className="text-sm capitalize text-muted-foreground">{ambulante.tipo}</p>
                        </div>
                        {ambulante.destaque ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">Destaque</span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{ambulante.descricao}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ambulante.especialidade.map((item) => (
                          <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{item}</span>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <div>{ambulante.horario}</div>
                        <div>{ambulante.precoMedio}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-5">
            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">Informacoes rapidas</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Resumo operacional do evento</p>
                </div>
                <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', categoryPillClass)}>
                  {categoryLabel}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{locationLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{timeLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{attendees} pessoas interessadas</span>
                </div>
              </div>

              <div className="mt-5 relative">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInterest}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors',
                    isInterested ? 'bg-success text-primary-foreground' : 'bg-primary text-primary-foreground',
                  )}
                >
                  {isInterested ? (
                    <>
                      <Check className="h-4 w-4" />
                      Check-in confirmado
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      Fazer check-in
                    </>
                  )}
                </motion.button>

                {showPointsAnimation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -42 }}
                    transition={{ duration: 2 }}
                    className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-dark"
                  >
                    +50 pontos!
                  </motion.div>
                ) : null}
              </div>

              {isInterested ? (
                <p className="mt-3 text-center text-sm text-muted-foreground">Voce ganhou 50 pontos por confirmar interesse no evento.</p>
              ) : null}
            </div>

            {nearbyStores.length > 0 ? (
              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">Lojas proximas</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Apoio comercial ao redor do evento</p>
                  </div>
                  <Store className="h-4 w-4 text-primary" />
                </div>

                <div className="space-y-3">
                  {nearbyStores.map((store, index) => (
                    <StoreCard key={store.id} store={store} index={index} variant="horizontal" />
                  ))}
                </div>
              </div>
            ) : null}

            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Voltar para eventos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
