'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, ShoppingBag, Building2, ShoppingCart, Cross, Landmark, Tag, TrendingUp, Sparkles, Clock, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { SearchBar } from '@/components/search-bar'
import { StoreCard } from '@/components/store-card'
import { EventCard } from '@/components/event-card'
import { StoryHighlights } from '@/components/story-highlights'
import { SmartFAB } from '@/components/smart-fab'
import { CompactCardSkeleton } from '@/components/skeleton-loader'
import { LiveBadge } from '@/components/live-badge'
import { stores, events, categories, currentUser, getRandomVisitors, discoverySuggestions } from '@/lib/data'
import { SplashScreen } from '@/components/splash-screen'
import { normalizeText } from '@/lib/text'

const categoryIcons = {
  'Lojas': ShoppingBag,
  'Shoppings': Building2,
  'Mercados': ShoppingCart,
  'Farmacias': Cross,
  'Servicos': Landmark,
}

const storyData = [
  { id: '1', title: 'Museu', image: '/img-centro/museudagentesergipana.jpg', viewed: false },
  { id: '2', title: 'Mercado', image: '/images/cafe-sergipano.jpg', viewed: false },
  { id: '3', title: 'Feirinha', image: '/images/evento-feira-artesanato.jpg', viewed: true },
  { id: '4', title: 'Palacio', image: '/img-centro/centrodeartesanatochicachaves.jpg', viewed: true },
  { id: '5', title: 'Centro', image: '/images/boutique-atalaia.jpg', viewed: true },
]

let hasShownStartupSplash = false

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [visitors, setVisitors] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    setVisitors(getRandomVisitors())
    const timer = setTimeout(() => setIsLoading(false), 600)

    let splashTimer: ReturnType<typeof setTimeout> | undefined

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

  const hotItems = useMemo(() => {
    const hotStores = stores.filter(s => s.hasPromotion).slice(0, 4)
    return hotStores
  }, [])

  const recommendedStores = useMemo(() => {
    return stores.filter(s => 
      currentUser.preferences.some(p => normalizeText(s.category).toLowerCase().includes(normalizeText(p).toLowerCase()))
    ).slice(0, 4)
  }, [])

  const featuredEvent = events.find(e => e.isHappening) || events[0]


  const handleScanSuccess = (points: number) => {
    setEarnedPoints(points)
  }

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      
      <main className="min-h-screen bg-background pb-28 lg:pb-8 lg:pt-24">
        <Header />
        
        <div className="mx-auto max-w-7xl">
          <section className="mt-2">
            <StoryHighlights stories={storyData} />
          </section>


          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            className="mt-4"
          />

          {featuredEvent && featuredEvent.isHappening && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-4 mt-6 lg:hidden"
            >
              <Link href={`/eventos/${featuredEvent.id}`}>
                <div className="relative h-36 overflow-hidden rounded-3xl lg:h-48">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredEvent.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
                  
                  <div className="relative flex h-full flex-col justify-between p-4">
                    <div className="flex items-center gap-2">
                      <LiveBadge />
                      <span className="text-xs font-medium text-primary-foreground/80">{visitors} pessoas assistindo</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-primary-foreground">{featuredEvent.title}</h3>
                      <p className="mt-1 text-sm text-primary-foreground/70">{featuredEvent.location}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.section>
          )}

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-live/10"
                >
                  <TrendingUp className="h-5 w-5 text-live" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold">Bombando Agora</h2>
                  <p className="text-xs text-muted-foreground">Lojas com promocoes ativas</p>
                </div>
              </div>
              <Link
                href="/lojas?filter=promo"
                className="flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Ver mais
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 snap-x lg:grid lg:grid-cols-4">
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

          <section className="mt-8 px-4">
            <h2 className="mb-4 text-lg font-bold">Categorias</h2>
            <div className="grid grid-cols-4 gap-3 md:grid-cols-4 lg:flex lg:justify-center lg:gap-6">
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
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${category.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      <span className="text-center text-xs font-medium">{category.name}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between px-4">
              <div>
                <h2 className="text-lg font-bold">Para Voce</h2>
                <p className="text-xs text-muted-foreground">Baseado nas suas preferencias</p>
              </div>
              <Link
                href="/lojas"
                className="flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Ver todas
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 snap-x md:grid md:grid-cols-2 md:overflow-visible md:px-4 md:pb-0 xl:grid-cols-4">
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

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between px-4">
              <div>
                <h2 className="text-lg font-bold">Joias Escondidas</h2>
                <p className="text-xs text-muted-foreground">Descubra lugares unicos</p>
              </div>
              <Link
                href="/explorar"
                className="flex items-center gap-1 text-sm font-semibold text-primary"
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
                  <div className="relative h-32 overflow-hidden rounded-2xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${discovery.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-bold text-primary-foreground">{discovery.title}</p>
                      <p className="line-clamp-1 text-xs text-primary-foreground/70">{discovery.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-8 pb-4">
            <div className="mb-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <Clock className="h-5 w-5 text-gold-dark" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Proximos Eventos</h2>
                  <p className="text-xs text-muted-foreground">Nao perca!</p>
                </div>
              </div>
              <Link
                href="/eventos"
                className="flex items-center gap-1 text-sm font-semibold text-primary"
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

        <SmartFAB onScanSuccess={handleScanSuccess} />

        <AnimatePresence>
          {earnedPoints && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-32 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-2xl bg-success p-4 text-primary-foreground shadow-xl"
              onAnimationComplete={() => {
                setTimeout(() => setEarnedPoints(null), 3000)
              }}
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">+{earnedPoints} pontos ganhos!</span>
            </motion.div>
          )}
        </AnimatePresence>

        </main>
    </>
  )
}
