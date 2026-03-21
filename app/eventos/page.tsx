'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { EventCard } from '@/components/event-card'
import { EventCardSkeleton } from '@/components/skeleton-loader'
import { events } from '@/lib/data'
import { cn } from '@/lib/utils'

const filterOptions = [
  { id: 'all', label: 'Todos' },
  { id: 'happening', label: 'Agora' },
  { id: 'music', label: 'Música' },
  { id: 'culture', label: 'Cultura' },
  { id: 'gastronomy', label: 'Gastronomia' },
  { id: 'fashion', label: 'Moda' },
]

export default function EventosPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'happening') return event.isHappening
    return event.category.toLowerCase().includes(selectedFilter)
  })

  return (
    <main className="pb-24 lg:pb-8 lg:pt-24">
      {/* Header */}
      <header className="sticky top-0 lg:top-20 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Eventos</h1>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {filterOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedFilter(option.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-colors',
                selectedFilter === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-border'
              )}
            >
              {option.id === 'happening' && (
                <span className="inline-block h-2 w-2 bg-live rounded-full mr-1.5 animate-pulse" />
              )}
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {/* Lista de Eventos em Timeline */}
      <div className="p-4 max-w-7xl mx-auto">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-4"
        >
          {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-4">
                <EventCardSkeleton />
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
                variant="timeline"
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-semibold text-lg">Nenhum evento encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tente outro filtro ou volte mais tarde
              </p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Ver todos os eventos
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
