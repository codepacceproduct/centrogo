'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Calendar, CalendarDays, Clock3, MapPin, Star, Store, UtensilsCrossed, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { AccessibilityMapCard } from '@/components/accessibility/accessibility-map-card'
import { AccessibilityHighlights } from '@/components/accessibility/accessibility-physical-card'
import { ActiveFiltersBar, PageFiltersHeader, type PageFilterChip } from '@/components/filters/page-filters'
import { EventCardSkeleton } from '@/components/skeleton-loader'
import {
  EVENT_CATEGORY_META,
  EVENT_FILTERS,
  normalizeEventGeoJson,
  type AmbulanteMapItem,
  type EventGeoJson,
  type EventMapCategory,
  type EventMapItem,
} from '@/lib/eventos-map'
import { cn } from '@/lib/utils'

const EventsMapLayer = dynamic(() => import('@/components/events-map-layer'), {
  ssr: false,
})

const FUTURE_FILTERS = ['Data em breve', 'Ranking em breve', 'Heatmap em breve']

export default function EventosPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | EventMapCategory>('all')
  const [events, setEvents] = useState<EventMapItem[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedAmbulanteId, setSelectedAmbulanteId] = useState<string | null>(null)
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
        event.ambulantes.some(
          (ambulante) =>
            ambulante.nome.toLowerCase().includes(query) ||
            ambulante.tipo.toLowerCase().includes(query) ||
            ambulante.especialidade.some((item) => item.toLowerCase().includes(query)),
        )
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

  useEffect(() => {
    if (!selectedAmbulanteId) return

    const exists = filteredEvents.some((event) => event.ambulantes.some((ambulante) => ambulante.id === selectedAmbulanteId))
    if (!exists) {
      setSelectedAmbulanteId(null)
    }
  }, [filteredEvents, selectedAmbulanteId])

  const selectedEvent = useMemo(
    () => filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0] ?? null,
    [filteredEvents, selectedEventId],
  )

  const selectedAmbulante = useMemo<AmbulanteMapItem | null>(() => {
    if (!selectedEvent || !selectedAmbulanteId) return null
    return selectedEvent.ambulantes.find((ambulante) => ambulante.id === selectedAmbulanteId) ?? null
  }, [selectedAmbulanteId, selectedEvent])

  const eventFilterChips = useMemo<PageFilterChip[]>(() => {
    return EVENT_FILTERS.map((filter) => ({
      id: filter.id,
      label: filter.label,
      active: selectedFilter === filter.id,
      onClick: () => setSelectedFilter(filter.id),
    }))
  }, [selectedFilter])

  const futureFilterChips = useMemo<PageFilterChip[]>(() => {
    return FUTURE_FILTERS.map((filter) => ({
      id: filter,
      label: filter,
      disabled: true,
    }))
  }, [])

  const activeFilterTags = useMemo(() => {
    const tags: Array<{ id: string; label: string; onRemove?: () => void }> = []

    if (selectedFilter !== 'all') {
      tags.push({
        id: 'category',
        label: EVENT_CATEGORY_META[selectedFilter].label,
        onRemove: () => setSelectedFilter('all'),
      })
    }

    if (searchValue) {
      tags.push({
        id: 'search',
        label: `Busca: ${searchValue}`,
        onRemove: () => setSearchValue(''),
      })
    }

    return tags
  }, [searchValue, selectedFilter])

  const clearAllFilters = () => {
    setSearchValue('')
    setSelectedFilter('all')
  }

  const handleSelectEvent = (event: EventMapItem) => {
    setSelectedEventId(event.id)
    setSelectedAmbulanteId(null)
  }

  const handleSelectAmbulante = (ambulante: AmbulanteMapItem) => {
    setSelectedEventId(ambulante.eventId)
    setSelectedAmbulanteId(ambulante.id)
  }

  return (
    <main className="pb-24 pt-[17.5rem] lg:pb-8 lg:pt-[20rem]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm lg:top-28">
        <PageFiltersHeader
          title="Eventos da Cidade"
          subtitle="Busca por categoria, descricao, endereco e ambulantes vinculados"
          icon={<CalendarDays className="h-5 w-5" />}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          primaryFilters={eventFilterChips}
          secondaryFilters={futureFilterChips}
        />
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          <div className="space-y-3 rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                </p>
                <p className="text-xs text-muted-foreground">Os filtros afetam mapa, cards e ambulantes da mesma base.</p>
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

            <ActiveFiltersBar
              tags={activeFilterTags}
              onClear={activeFilterTags.length > 0 ? clearAllFilters : undefined}
              emptyLabel="Use os chips acima para focar uma categoria ou combine com a busca textual."
            />
          </div>

          <EventsMapLayer
            events={filteredEvents}
            selectedEvent={selectedEvent}
            selectedAmbulante={selectedAmbulante}
            onSelect={handleSelectEvent}
            onSelectAmbulante={handleSelectAmbulante}
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
                  {selectedEvent.ambulantes.length} ambulante{selectedEvent.ambulantes.length === 1 ? '' : 's'}
                </div>
              </div>

              <AccessibilityHighlights data={selectedEvent.physicalAccessibility} className="mt-4" />

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    {format(parseISO(selectedEvent.dataInicio), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedEvent.dataInicio === selectedEvent.dataFim
                      ? 'Evento em data unica'
                      : `Vai ate ${format(parseISO(selectedEvent.dataFim), 'dd/MM/yyyy')}`}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {selectedEvent.horario}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Horario principal para card e experiencia no mapa</p>
                </div>
                <div className="rounded-2xl bg-muted p-3 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedEvent.endereco}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Localizacao-base do evento com ambulantes posicionados ao redor</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <Store className="h-4 w-4 text-primary" />
                  Preview de ambulantes
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedEvent.ambulantes.map((ambulante) => (
                    <button
                      key={ambulante.id}
                      type="button"
                      onClick={() => handleSelectAmbulante(ambulante)}
                      className={cn(
                        'rounded-2xl border px-4 py-3 text-left transition-colors',
                        selectedAmbulante?.id === ambulante.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40 hover:bg-muted/70',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{ambulante.nome}</p>
                          <p className="text-sm capitalize text-muted-foreground">{ambulante.tipo}</p>
                        </div>
                        {ambulante.destaque ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">
                            Destaque
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{ambulante.especialidade.slice(0, 2).join(' - ')}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{ambulante.horario}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedAmbulante ? (
                <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <UtensilsCrossed className="h-4 w-4 text-primary" />
                    Card do ambulante
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{selectedAmbulante.nome}</h3>
                      <p className="text-sm capitalize text-muted-foreground">{selectedAmbulante.tipo}</p>
                    </div>
                    {selectedAmbulante.destaque ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        destaque
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{selectedAmbulante.descricao}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Especialidade</p>
                      <p className="mt-1 text-sm">{selectedAmbulante.especialidade.join(', ')}</p>
                    </div>
                    <div className="rounded-2xl bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preco medio</p>
                      <p className="mt-1 text-sm">{selectedAmbulante.precoMedio}</p>
                    </div>
                    <div className="rounded-2xl bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Horario</p>
                      <p className="mt-1 text-sm">{selectedAmbulante.horario}</p>
                    </div>
                    <div className="rounded-2xl bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Escalavel</p>
                      <p className="mt-1 flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        Pronto para avaliacao, vendas e ranking por evento
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {selectedEvent ? (
            <AccessibilityMapCard
              data={selectedEvent.accessibilityMap}
              description="Leitura do entorno, das rotas de chegada e dos trechos com mais atencao no acesso ao evento."
            />
          ) : null}
        </section>

        <section>
          <div className="mb-4 text-sm text-muted-foreground">
            Clique em um marker maior para focar o evento. Os markers menores destacam os ambulantes vinculados e abrem mini cards.
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
                    onClick={() => handleSelectEvent(event)}
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
                        <p className="mt-1 text-sm text-muted-foreground">{event.horario}</p>
                      </div>
                      <span className="rounded-xl bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary">
                        {event.ambulantes.length} no mapa
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(event.dataInicio), 'dd/MM/yyyy')}</span>
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
                      {event.ambulantes.slice(0, 3).map((ambulante) => (
                        <span key={ambulante.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {ambulante.nome}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/eventos/${event.id}`}
                        onClick={(eventClick) => eventClick.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-xl border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                      >
                        Ver detalhes
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.button>
                )
              })
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-14 text-center">
                <div className="mb-3 text-4xl">EV</div>
                <h3 className="font-semibold text-lg">Nenhum evento encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Remova algum filtro ou amplie a busca para voltar a explorar os eventos.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}