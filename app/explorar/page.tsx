'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Compass, MapPin, Star, Navigation } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { discoverySuggestions, stores, getRandomDistance } from '@/lib/data'
import { Skeleton } from '@/components/skeleton-loader'

// Pins do mapa simulado
const mapPins = [
  { id: '1', x: 25, y: 30, label: 'Praça Fausto Cardoso' },
  { id: '2', x: 60, y: 25, label: 'Rua João Pessoa' },
  { id: '3', x: 45, y: 50, label: 'Mercado Municipal' },
  { id: '4', x: 70, y: 60, label: 'Catedral' },
  { id: '5', x: 30, y: 70, label: 'Praça Olímpio Campos' },
]

export default function ExplorarPage() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Lojas menos conhecidas mas bem avaliadas
  const hiddenGems = useMemo(() => {
    return stores
      .filter(s => s.rating >= 4.5 && s.reviewCount < 150)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
  }, [])

  return (
    <main className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Explorar</h1>
          </div>
        </div>
      </header>

      {/* Mapa interativo simulado */}
      <section className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-muted rounded-2xl overflow-hidden h-64"
        >
          {/* Imagem de mapa estilizado */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10">
            {/* Linhas de rua simuladas */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="20%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="80%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="1" />
              <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Pins interativos */}
          {mapPins.map((pin, index) => (
            <motion.button
              key={pin.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
              className="absolute"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                animate={{ 
                  scale: selectedPin === pin.id ? 1.2 : 1,
                  y: selectedPin === pin.id ? -5 : 0
                }}
                className="relative"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg ${
                  selectedPin === pin.id ? 'bg-secondary' : 'bg-primary'
                } text-primary-foreground`}>
                  <MapPin className="h-4 w-4" />
                </div>
                {selectedPin === pin.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-background border border-border rounded-lg shadow-lg whitespace-nowrap text-xs font-medium z-10"
                  >
                    {pin.label}
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          ))}

          {/* Indicador de localização do usuário */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute"
            style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative">
              <div className="h-4 w-4 bg-secondary rounded-full border-2 border-primary-foreground shadow-lg" />
              <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-75" />
            </div>
          </motion.div>

          {/* Legenda */}
          <div className="absolute bottom-3 left-3 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="h-3.5 w-3.5 text-secondary" />
              <span>Você está aqui</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sugestões de Descoberta do Dia */}
      <section className="mt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg mb-1">Descobertas do Dia</h2>
          <p className="text-sm text-muted-foreground mb-4">Lugares especiais para você explorar</p>
        </motion.div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border">
                <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            discoverySuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="flex gap-3 p-3 bg-card rounded-xl border border-border cursor-pointer"
              >
                <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={suggestion.image}
                    alt={suggestion.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-gold/90 text-[10px] font-bold rounded text-gold-dark">
                    {suggestion.type === 'experience' ? 'EXPERIÊNCIA' : 'LOJA'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{suggestion.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 text-gold fill-gold" />
                      <span className="text-xs font-medium">{suggestion.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getRandomDistance()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Joias Escondidas */}
      <section className="mt-6 px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-semibold text-lg mb-1">Joias Escondidas</h2>
          <p className="text-sm text-muted-foreground mb-4">Lugares menos conhecidos, muito bem avaliados</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {hiddenGems.map((store, index) => (
            <Link key={store.id} href={`/lojas/${store.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="relative h-24">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-primary-foreground text-xs font-semibold truncate">{store.name}</p>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gold fill-gold" />
                      <span className="text-xs font-medium">{store.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{store.category}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
