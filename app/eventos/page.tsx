'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock3, MapPin, Sparkles, Ticket } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { BottomNav } from '@/components/bottom-nav'
import { EventCardSkeleton } from '@/components/skeleton-loader'
import { SearchBar } from '@/components/search-bar'
import {
  EVENT_CATEGORY_META,
  EVENT_FILTERS,
  normalizeEventGeoJson,
  type EventGeoJson,
  type EventMapCategory,
  type EventMapItem,
} from '@/lib/eventos-map'
import { cn } from '@/lib/utils'

const EventsMapLayer = dynamic(() => import('@/components/events-map-layer'), {
  ssr: false,
})

const FUTURE_FILTERS = ['Data', 'Preco', 'Tipo']

export default function EventosPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | EventMapCategory>('all')
  const [events, setEvents] = useState<EventMapItem[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    const loadEvents = async () => {
      try {
        const response = await fetch('/mock/eventos.json', { cache: 'no-store' })
        const geoJson = (await response.json()) as EventGeoJson

        if (!isCancelled) {
          setEvents(normalizeEventGeoJson(geoJson))
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadEvents()

    return () => {
      isCancelled = true
    }
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedFilter !== 'all' && event.categoria !== selectedFilter) {
        return false
      }

      if (!searchValue) {
        return true
      }

      const query = searchValue.toLowerCase()
      return (
        event.nome.toLowerCase().includes(query) ||
        event.descricao.toLowerCase().includes(query) ||
        event.endereco.toLowerCase().includes(query) ||
        EVENT_CATEGORY_META[event.categoria].label.toLowerCase().includes(query) ||
        event.atracoes.some((attraction) => attraction.toLowerCase().includes(query))
      )
    })
  }, [events, searchValue, selectedFilter])

  useEffect(() => {
    if (filteredEvents.length === 0) {
      setSelectedEventId(null)
      return
    }

    const stillVisible = filteredEvents.some((event) => event.id === selectedEventId)
    if (!stillVisible) {
      setSelectedEventId(filteredEvents[0].id)
    }
  }, [filteredEvents, selectedEventId])

  const selectedEvent = useMemo(
    () => filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0] ?? null,
    [filteredEvents, selectedEventId],
  )

  return (
    <main className="pb-24 lg:pb-8 lg:pt-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:top-20">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-semibold text-lg">Eventos da Cidade</h1>
              <p className="text-xs text-muted-foreground">Mapa interativo com descoberta e exploracao de eventos</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <SearchBar value={searchValue} onChange={setSearchValue} className="pb-3" />
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {EVENT_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                selectedFilter === filter.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {FUTURE_FILTERS.map((filter) => (
            <div
              key={filter}
              className="shrink-0 rounded-full border border-dashed border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {filter} em breve
            </div>
          ))}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
              </p>
              <p className="text-xs text-muted-foreground">Dados carregados via GeoJSON local em /mock/eventos.json</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {EVENT_FILTERS.filter((filter) => filter.id !== 'all').map((filter) => {
                const meta = EVENT_CATEGORY_META[filter.id as EventMapCategory]
                return (
                  <div key={filter.id} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span>{meta.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <EventsMapLayer
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onSelect={(event) => setSelectedEventId(event.id)}
          />

          {selectedEvent ? (
            <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', EVENT_CATEGORY_META[selectedEvent.categoria].pillClass)}>
                    {EVENT_CATEGORY_META[selectedEvent.categoria].label}
                  </span>
                  <h2 className="mt-3 font-semibold text-lg">{selectedEvent.nome}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedEvent.descricao}</p>
                </div>
                <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                  {selectedEvent.preco}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    {format(parseISO(selectedEvent.data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Data preparada para futuros filtros por periodo</p>
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {selectedEvent.horario}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Horario do evento e janela de programacao</p>
                </div>
                <div className="rounded-2xl bg-muted p-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedEvent.endereco}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Destino usado tambem para rota e interacao no mapa</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Atracoes
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.atracoes.map((attraction) => (
                    <span key={attraction} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Ticket className="h-4 w-4 text-primary" />
                  Estrutura preparada para ingressos
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  O card ja deixa preco, categoria e detalhes organizados para futura integracao com checkout e disponibilidade.
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section>
          <div className="mb-4 text-sm text-muted-foreground">
            Clique em um marker para abrir o evento selecionado com descricao, data, horario, preco e atracoes.
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <EventCardSkeleton key={index} />)
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => {
                const meta = EVENT_CATEGORY_META[event.categoria]

                return (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedEventId(event.id)}
                    className={cn(
                      'rounded-[1.75rem] border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md',
                      selectedEvent?.id === event.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', meta.pillClass)}>
                          {meta.label}
                        </span>
                        <h3 className="mt-3 font-semibold text-base">{event.nome}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{event.descricao}</p>
                      </div>
                      <span className="rounded-xl bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary">
                        {event.preco}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(event.data), 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" />
                        <span>{event.horario}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.endereco}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.atracoes.slice(0, 3).map((attraction) => (
                        <span key={attraction} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                )
              })
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-14 text-center">
                <div className="mb-3 text-4xl">EV</div>
                <h3 className="font-semibold text-lg">Nenhum evento encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou os filtros para explorar novos eventos.</p>
                <button
                  onClick={() => {
                    setSearchValue('')
                    setSelectedFilter('all')
                  }}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  )
}
