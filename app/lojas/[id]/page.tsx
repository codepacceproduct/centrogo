'use client'

import { use, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, MapPin, Phone, Clock, ExternalLink, Gift } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { stores, isStoreOpen, getRandomDistance, getRandomVisitors } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const store = stores.find(s => s.id === id)
  
  const isOpen = useMemo(() => store ? isStoreOpen(store.openHour, store.closeHour) : false, [store])
  const distance = useMemo(() => getRandomDistance(), [])
  const visitors = useMemo(() => getRandomVisitors(), [])

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="font-semibold text-lg">Loja não encontrada</h2>
          <Link href="/lojas" className="text-primary text-sm mt-2 inline-block">
            Voltar para lojas
          </Link>
        </div>
      </div>
    )
  }

  const handleDirections = () => {
    const query = encodeURIComponent(`${store.name}, ${store.address}, Aracaju, SE`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  return (
    <main className="pb-8">
      {/* Header com imagem */}
      <div className="relative h-64 lg:h-80">
        <Image
          src={store.image}
          alt={store.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-background/90 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                isOpen ? 'bg-success text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {isOpen ? 'Aberto' : 'Fechado'}
              </span>
              {store.hasPromotion && (
                <span className="px-2 py-0.5 bg-live text-xs font-bold text-primary-foreground rounded-full">
                  PROMO
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground">{store.name}</h1>
            <p className="text-primary-foreground/80 text-sm">{store.category}</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-gold/10 px-3 py-2 rounded-xl">
                <Star className="h-5 w-5 text-gold fill-gold" />
                <span className="font-semibold">{store.rating}</span>
                <span className="text-sm text-muted-foreground">({store.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{distance}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{visitors} visitas hoje</p>
            </div>
          </div>

          {store.hasPromotion && store.promotionText && (
            <div className="mt-3 p-3 bg-live/10 rounded-xl">
              <p className="text-sm font-medium text-live">{store.promotionText}</p>
            </div>
          )}
        </motion.div>

        {/* Descrição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6"
        >
          <h2 className="font-semibold text-lg mb-2">Sobre</h2>
          <p className="text-muted-foreground">{store.description}</p>
        </motion.div>

        {/* Informações de contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <h2 className="font-semibold text-lg mb-3">Informações</h2>
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{store.address}</p>
              <p className="text-xs text-muted-foreground">Centro - Aracaju, SE</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {store.openHour}:00 - {store.closeHour}:00
              </p>
              <p className="text-xs text-muted-foreground">Horário de funcionamento</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{store.phone}</p>
              <p className="text-xs text-muted-foreground">Telefone</p>
            </div>
          </div>
        </motion.div>

        {/* Destaques/Vitrine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          <h2 className="font-semibold text-lg mb-3">Destaques</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {store.highlights.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="w-36 shrink-0"
              >
                <div className="relative h-32 rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-medium mt-2 truncate">{product.name}</p>
                <p className="text-sm text-primary font-semibold">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pontos de fidelidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-gradient-to-r from-gold/20 to-gold/5 rounded-2xl border border-gold/30"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gold rounded-xl flex items-center justify-center">
              <Gift className="h-6 w-6 text-gold-dark" />
            </div>
            <div>
              <p className="font-semibold">Ganhe {store.loyaltyPoints} pontos</p>
              <p className="text-sm text-muted-foreground">A cada compra nesta loja</p>
            </div>
          </div>
        </motion.div>

        {/* Botões de ação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 flex gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            <ExternalLink className="h-5 w-5" />
            Como Chegar
          </motion.button>
          <motion.a
            href={`tel:${store.phone.replace(/\D/g, '')}`}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-4 border border-border rounded-xl font-medium"
          >
            <Phone className="h-5 w-5" />
            Ligar
          </motion.a>
        </motion.div>
      </div>
    </main>
  )
}
