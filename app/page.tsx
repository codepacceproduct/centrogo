'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Utensils, Shirt, Wrench, Palette, Tag, TrendingUp, Sparkles, Clock, Users, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { GamificationCard } from '@/components/gamification-card'
import { SearchBar } from '@/components/search-bar'
import { StoreCard } from '@/components/store-card'
import { EventCard } from '@/components/event-card'
import { StoryHighlights } from '@/components/story-highlights'
import { FloatingActionButton } from '@/components/floating-action-button'
import { QRScannerModal } from '@/components/qr-scanner-modal'
import { RatingModal } from '@/components/rating-modal'
import { CompactCardSkeleton } from '@/components/skeleton-loader'
import { LiveBadge } from '@/components/live-badge'
import { stores, events, categories, currentUser, getRandomVisitors, discoverySuggestions } from '@/lib/data'
import { SplashScreen } from '@/components/splash-screen'

const categoryIcons = {
  'Gastronomia': Utensils,
  'Moda': Shirt,
  'Servicos': Wrench,
  'Cultura': Palette,
  'Ofertas': Tag,
}

// Story data from events and promotions
const storyData = [
  { id: '1', title: 'Forró Caju', image: '/img-centro/forrocaju.jpg', viewed: false },
  { id: '2', title: 'Mercadão', image: '/images/cafe-sergipano.jpg', viewed: false },
  { id: '3', title: 'Feirinha', image: '/images/evento-feira-artesanato.jpg', viewed: true },
  { id: '4', title: 'Orla', image: '/img-centro/orladeatalaia.jpg', viewed: true },
  { id: '5', title: 'Cultura', image: '/img-centro/centrodeartesanatochicachaves.jpg', viewed: true },
]

let hasShownStartupSplash = false

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [visitors, setVisitors] = useState(0)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    setVisitors(getRandomVisitors())
    const timer = setTimeout(() => setIsLoading(false), 600)

    let splashTimer: ReturnType<typeof setTimeout> | undefined

    // Mostra splash apenas no carregamento inicial do documento.
    // Em navegacao interna (SPA), a variavel permanece true e evita repetir.
    if (!hasShownStartupSplash) {
      setShowSplash(true)
      hasShownStartupSplash = true
      splashTimer = setTimeout(() => setShowSplash(false), 2500)
    } else {
      setShowSplash(false)
    }
    
    return () => {
      clearTimeout(timer)
      if (splashTimer) clearTimeout(splashTimer)
    }
  }, [])

  // Hot items (with promotion or happening now)
  const hotItems = useMemo(() => {
    const hotStores = stores.filter(s => s.hasPromotion).slice(0, 4)
    return hotStores
  }, [])

  // Recommended stores based on preferences
  const recommendedStores = useMemo(() => {
    return stores.filter(s => 
      currentUser.preferences.some(p => s.category.toLowerCase().includes(p.toLowerCase()))
    ).slice(0, 4)
  }, [])

  // Featured event (happening now or next)
  const featuredEvent = events.find(e => e.isHappening) || events[0]

  const handleScanSuccess = (points: number) => {
    setEarnedPoints(points)
  }

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      
      <main className="pb-28 lg:pb-8 lg:pt-24 bg-background min-h-screen">
        <Header />
        
        <div className="max-w-7xl mx-auto">
      
      {/* Story Highlights */}
      <section className="mt-2">
        <StoryHighlights stories={storyData} />
      </section>

      {/* Gamification Card */}
      <GamificationCard />

      {/* Search Bar */}
      <SearchBar 
        value={searchValue} 
        onChange={setSearchValue}
        className="mt-4"
      />

      {/* Live Event Banner */}
      {featuredEvent && featuredEvent.isHappening && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 mt-6"
        >
          <Link href={`/eventos/${featuredEvent.id}`}>
            <div className="relative h-36 lg:h-48 rounded-3xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredEvent.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
              
              <div className="relative h-full p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <LiveBadge />
                  <span className="text-primary-foreground/80 text-xs font-medium">{visitors} pessoas assistindo</span>
                </div>
                
                <div>
                  <h3 className="text-primary-foreground font-bold text-xl">{featuredEvent.title}</h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">{featuredEvent.location}</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Hot Now Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="h-10 w-10 rounded-xl bg-live/10 flex items-center justify-center"
            >
              <TrendingUp className="h-5 w-5 text-live" />
            </motion.div>
            <div>
              <h2 className="font-bold text-lg">Bombando Agora</h2>
              <p className="text-xs text-muted-foreground">Lojas com promocoes ativas</p>
            </div>
          </div>
          <Link 
            href="/lojas?filter=promo" 
            className="flex items-center gap-1 text-sm text-primary font-semibold"
          >
            Ver mais
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 lg:grid lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CompactCardSkeleton key={i} />
            ))
          ) : (
            hotItems.map((store, index) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                index={index}
                variant="featured"
              />
            ))
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8 px-4">
        <h2 className="font-bold text-lg mb-4">Categorias</h2>
        <div className="grid grid-cols-5 md:grid-cols-5 lg:flex lg:justify-center gap-3 lg:gap-6">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Tag
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Link 
                  href={`/lojas?categoria=${category.name.toLowerCase()}`}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm ${category.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <span className="text-xs text-center font-medium">{category.name}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* For You Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <div>
            <div>
              <h2 className="font-bold text-lg">Para Você</h2>
              <p className="text-xs text-muted-foreground">Baseado nas suas preferências</p>
            </div>
          </div>
          <Link 
            href="/lojas" 
            className="flex items-center gap-1 text-sm text-primary font-semibold"
          >
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {recommendedStores.map((store, index) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              index={index}
              variant="horizontal"
            />
          ))}
        </div>
      </section>

      {/* Discoveries Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <div>
            <div>
              <h2 className="font-bold text-lg">Joias Escondidas</h2>
              <p className="text-xs text-muted-foreground">Descubra lugares unicos</p>
            </div>
          </div>
          <Link 
            href="/explorar" 
            className="flex items-center gap-1 text-sm text-primary font-semibold"
          >
            Explorar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 lg:grid lg:grid-cols-4 xl:grid-cols-5">
          {discoverySuggestions.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="w-48 shrink-0 lg:w-auto"
            >
              <div className="relative h-32 rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${discovery.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-primary-foreground font-bold text-sm">{discovery.title}</p>
                  <p className="text-primary-foreground/70 text-xs line-clamp-1">{discovery.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mt-8 pb-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gold-dark" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Proximos Eventos</h2>
              <p className="text-xs text-muted-foreground">Nao perca!</p>
            </div>
          </div>
          <Link 
            href="/eventos" 
            className="flex items-center gap-1 text-sm text-primary font-semibold"
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 lg:grid lg:grid-cols-4">
          {events.filter(e => !e.isHappening).slice(0, 4).map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
              variant="compact"
            />
          ))}
        </div>
      </section>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onScanQR={() => setShowQRScanner(true)}
        onCheckIn={() => setShowQRScanner(true)}
        onRate={() => setShowRatingModal(true)}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Rating Modal */}
      <RatingModal 
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        storeName="uma loja visitada"
        onSubmit={(rating, comment) => {
          console.log('[v0] Rating submitted:', { rating, comment })
        }}
      />

      {/* Points earned toast */}
      <AnimatePresence>
        {earnedPoints && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-32 left-4 right-4 bg-success text-primary-foreground p-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 z-50"
            onAnimationComplete={() => {
              setTimeout(() => setEarnedPoints(null), 3000)
            }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">+{earnedPoints} pontos ganhos!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
      </main>
    </>
  )
}
