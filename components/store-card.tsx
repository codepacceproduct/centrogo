'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Store, isStoreOpen } from '@/lib/data'
import { cn } from '@/lib/utils'
import { LiveBadge, PromoBadge, PointsBadge } from './live-badge'

interface StoreCardProps {
  store: Store
  index?: number
  variant?: 'default' | 'compact' | 'horizontal' | 'featured'
}

export function StoreCard({ store, index = 0, variant = 'default' }: StoreCardProps) {  const [isOpen, setIsOpen] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsOpen(isStoreOpen(store.openHour, store.closeHour))
  }, [store.openHour, store.closeHour])

  if (variant === 'featured') {
    return (
      <Link href={`/lojas/${store.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-72 shrink-0 lg:w-auto rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="relative h-44">
            <Image
              src={store.image}
              alt={store.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {store.hasPromotion && <LiveBadge text="PROMOCAO" />}
            </div>

            {/* Favorite button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart className={cn('h-5 w-5', isFavorite ? 'fill-live text-live' : 'text-muted-foreground')} />
            </motion.button>

            {/* Points badge */}
            <div className="absolute top-3 right-14">
              <PointsBadge points={store.loyaltyPoints} size="sm" />
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg leading-tight">{store.name}</h3>
                <p className="text-primary-foreground/70 text-sm">{store.subcategoryLabel}</p>
              </div>
              <div className="flex items-center gap-1 bg-primary-foreground/20 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="font-bold text-sm">{store.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{store.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className={isOpen ? 'text-success' : 'text-live'}>{isOpen ? 'Aberto' : 'Fechado'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/lojas/${store.id}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex gap-4 p-3 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0">
            <Image
              src={store.image}
              alt={store.name}
              fill
              className="object-cover"
            />
            {store.hasPromotion && (
              <div className="absolute top-1.5 left-1.5">
                <PromoBadge text="PROMO" variant="hot" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate">{store.name}</h3>
                <p className="text-sm text-muted-foreground">{store.subcategoryLabel}</p>
              </div>
              <span className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-full shrink-0',
                isOpen ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              )}>
                {isOpen ? 'Aberto' : 'Fechado'}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="text-sm font-semibold">{store.rating}</span>
                <span className="text-xs text-muted-foreground">({store.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{store.neighborhood}</span>
              </div>
              <PointsBadge points={store.loyaltyPoints} size="sm" showPlus={false} />
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/lojas/${store.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-40 shrink-0"
        >
          <div className="relative h-28 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={store.image}
              alt={store.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            
            {store.hasPromotion && (
              <div className="absolute top-2 left-2">
                <LiveBadge />
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-primary-foreground text-sm font-bold truncate drop-shadow-lg">{store.name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-gold fill-gold" />
              <span className="text-sm font-semibold">{store.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">{store.neighborhood}</span>
          </div>
        </motion.div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/lojas/${store.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all"
      >
        <div className="relative h-40">
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="object-cover"
          />
          
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm',
              isOpen ? 'bg-success/90 text-primary-foreground' : 'bg-muted/90 text-muted-foreground'
            )}>
              {isOpen ? 'Aberto agora' : 'Fechado'}
            </span>
          </div>

          {/* Promo badge */}
          {store.hasPromotion && (
            <div className="absolute top-3 left-3">
              <PromoBadge text={store.promotionText || 'PROMOCAO'} variant="hot" />
            </div>
          )}

          {/* Favorite button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <Heart className={cn('h-5 w-5 transition-colors', isFavorite ? 'fill-live text-live' : 'text-muted-foreground')} />
          </motion.button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-lg truncate">{store.name}</h3>
              <p className="text-sm text-muted-foreground">{store.subcategoryLabel}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-gold/10 px-2.5 py-1.5 rounded-xl shrink-0">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="font-bold">{store.rating}</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{store.neighborhood}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{store.reviewCount} avaliacoes</span>
            </div>
            <PointsBadge points={store.loyaltyPoints} size="sm" showPlus={false} />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}



