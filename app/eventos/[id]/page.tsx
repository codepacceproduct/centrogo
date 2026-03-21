'use client'

import { use, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Share2, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { events, stores, getRandomAttendees } from '@/lib/data'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { StoreCard } from '@/components/store-card'

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const event = events.find(e => e.id === id)
  const [isInterested, setIsInterested] = useState(false)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const attendees = useMemo(() => getRandomAttendees(), [])

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="font-semibold text-lg">Evento não encontrado</h2>
          <Link href="/eventos" className="text-primary text-sm mt-2 inline-block">
            Voltar para eventos
          </Link>
        </div>
      </div>
    )
  }

  const nearbyStores = stores.filter(s => event.nearbyStores.includes(s.id))
  const dateFormatted = format(parseISO(event.date), "EEEE, dd 'de' MMMM", { locale: ptBR })

  const handleInterest = () => {
    if (!isInterested) {
      setIsInterested(true)
      setShowPointsAnimation(true)
      setTimeout(() => setShowPointsAnimation(false), 2000)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Confira este evento: ${event.title}`,
        url: window.location.href,
      })
    }
  }

  return (
    <main className="pb-8">
      {/* Header com imagem */}
      <div className="relative h-72 lg:h-96">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>

        {event.isHappening && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-live text-primary-foreground rounded-full font-semibold text-sm flex items-center gap-2"
          >
            <span className="h-2 w-2 bg-primary-foreground rounded-full animate-pulse" />
            ACONTECENDO AGORA
          </motion.div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-2 py-1 bg-background/90 text-xs font-medium rounded-full">
              {event.categoryTag}
            </span>
            <h1 className="text-2xl font-bold text-primary-foreground mt-2">{event.title}</h1>
          </motion.div>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 max-w-4xl mx-auto">
        {/* Card de info rápida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4 shadow-lg"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium capitalize">{dateFormatted}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{event.location}</p>
                <p className="text-sm text-muted-foreground">Centro - Aracaju, SE</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{attendees} pessoas confirmadas</p>
                <p className="text-sm text-muted-foreground">Evento gratuito</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Descrição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6"
        >
          <h2 className="font-semibold text-lg mb-2">Sobre o evento</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </motion.div>

        {/* Lojas próximas */}
        {nearbyStores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <h2 className="font-semibold text-lg mb-3">Lojas próximas a este evento</h2>
            <div className="space-y-3">
              {nearbyStores.map((store, index) => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  index={index}
                  variant="horizontal"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Botão de Check-in/Interesse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 relative"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleInterest}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2',
              isInterested 
                ? 'bg-success text-primary-foreground' 
                : 'bg-primary text-primary-foreground'
            )}
          >
            {isInterested ? (
              <>
                <Check className="h-5 w-5" />
                Check-in Confirmado!
              </>
            ) : (
              <>
                <Clock className="h-5 w-5" />
                Fazer Check-in
              </>
            )}
          </motion.button>

          {/* Animação de pontos ganhos */}
          {showPointsAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: -50 }}
              transition={{ duration: 2 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 bg-gold text-gold-dark rounded-full font-bold"
            >
              +50 pontos!
            </motion.div>
          )}
        </motion.div>

        {isInterested && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground mt-3"
          >
            Você ganhou 50 pontos por fazer check-in!
          </motion.p>
        )}
      </div>
    </main>
  )
}
