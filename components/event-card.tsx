'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Event, getRandomAttendees } from '@/lib/data'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EventCardProps {
  event: Event
  index?: number
  variant?: 'default' | 'compact' | 'timeline'
}

export function EventCard({ event, index = 0, variant = 'default' }: EventCardProps) {
  const [interested, setInterested] = useState(false)
  const attendees = useMemo(() => getRandomAttendees(), [])
  const dateFormatted = format(parseISO(event.date), "dd 'de' MMM", { locale: ptBR })
  const dayOfWeek = format(parseISO(event.date), 'EEEE', { locale: ptBR })

  const handleInterest = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInterested(!interested)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/eventos/${event.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-56 shrink-0 lg:w-auto"
        >
          <div className="relative h-32 rounded-xl overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
            {event.isHappening && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-2 left-2 px-2 py-0.5 bg-live text-[10px] font-bold text-primary-foreground rounded flex items-center gap-1"
              >
                <span className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-pulse" />
                AO VIVO
              </motion.div>
            )}
            <div className="absolute bottom-2 left-2 right-2">
              <span className="text-[10px] text-primary-foreground/80">{event.categoryTag}</span>
              <p className="text-primary-foreground text-sm font-semibold truncate">{event.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5 px-1 text-xs text-muted-foreground">
            <span>{dateFormatted}</span>
            <span>•</span>
            <span>{event.time}</span>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'timeline') {
    return (
      <Link href={`/eventos/${event.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex gap-4"
        >
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div className={cn(
              'h-12 w-12 rounded-xl flex flex-col items-center justify-center shrink-0',
              event.isHappening ? 'bg-live text-primary-foreground' : 'bg-primary text-primary-foreground'
            )}>
              <span className="text-lg font-bold leading-none">{format(parseISO(event.date), 'dd')}</span>
              <span className="text-[10px] uppercase">{format(parseISO(event.date), 'MMM', { locale: ptBR })}</span>
            </div>
            <div className="w-0.5 flex-1 bg-border mt-2" />
          </div>

          {/* Event content */}
          <div className="flex-1 pb-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-32">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                {event.isHappening && (
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-2 left-2 px-2 py-0.5 bg-live text-xs font-bold text-primary-foreground rounded flex items-center gap-1"
                  >
                    <span className="h-1.5 w-1.5 bg-primary-foreground rounded-full animate-pulse" />
                    ACONTECENDO AGORA
                  </motion.div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/90 text-xs font-medium rounded-full">
                  {event.categoryTag}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{event.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{attendees} confirmados</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInterest}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
                      interested 
                        ? 'bg-success text-primary-foreground' 
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {interested ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Confirmado
                      </>
                    ) : (
                      'Tenho Interesse'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/eventos/${event.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
      >
        <div className="relative h-40">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {event.isHappening && (
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-3 left-3 px-2 py-1 bg-live text-xs font-bold text-primary-foreground rounded-full flex items-center gap-1.5"
            >
              <span className="h-2 w-2 bg-primary-foreground rounded-full animate-pulse" />
              ACONTECENDO AGORA
            </motion.div>
          )}
          <div className="absolute top-3 right-3 px-2 py-1 bg-background/90 text-xs font-medium rounded-full">
            {event.categoryTag}
          </div>
          <div className="absolute bottom-3 left-3">
            <p className="text-primary-foreground/80 text-xs capitalize">{dayOfWeek}</p>
            <p className="text-primary-foreground text-lg font-bold">{dateFormatted}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{attendees} confirmados</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInterest}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5',
                interested 
                  ? 'bg-success text-primary-foreground' 
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {interested ? (
                <>
                  <Check className="h-4 w-4" />
                  Confirmado
                </>
              ) : (
                'Tenho Interesse'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
