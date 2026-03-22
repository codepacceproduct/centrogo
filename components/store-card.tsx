'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Heart, MapPin, Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Store, isStoreOpen } from '@/lib/data'
import { normalizeText } from '@/lib/text'
import { cn } from '@/lib/utils'

interface StoreCardProps {
  store: Store
  index?: number
  variant?: 'default' | 'compact' | 'horizontal' | 'featured'
  onCardClick?: (store: Store) => void
  showDetailsButton?: boolean
}

function PromoPill({ text }: { text: string }) {
  return (
    <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-lg">
      {normalizeText(text)}
    </span>
  )
}

function PromoInfo({ text }: { text: string }) {
  return (
    <div className="inline-flex max-w-full items-center rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
      <span className="truncate">{normalizeText(text)}</span>
    </div>
  )
}

function StatusPill({ isOpen }: { isOpen: boolean | null }) {
  if (isOpen === null) {
    return (
      <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
        Horario
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        isOpen ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600',
      )}
    >
      {isOpen ? 'Aberto' : 'Fechado'}
    </span>
  )
}

function ScorePill({ points }: { points: number }) {
  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
      {points} pts
    </span>
  )
}

function useNormalizedStore(store: Store) {
  return useMemo(
    () => ({
      name: normalizeText(store.name),
      subcategoryLabel: normalizeText(store.subcategoryLabel),
      neighborhood: normalizeText(store.neighborhood),
      promotionText: normalizeText(store.promotionText || 'Promo'),
    }),
    [store],
  )
}

export function StoreCard({
  store,
  index = 0,
  variant = 'default',
  onCardClick,
  showDetailsButton = false,
}: StoreCardProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const content = useNormalizedStore(store)

  useEffect(() => {
    setIsOpen(isStoreOpen(store.openHour, store.closeHour))
  }, [store.openHour, store.closeHour])

  if (variant === 'featured') {
    return (
      <Link href={`/lojas/${store.id}`} className="snap-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="min-w-[260px] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-xl lg:min-w-0"
        >
          <div className="relative h-44 overflow-hidden">
            <Image src={store.image} alt={content.name} fill priority={index === 0} loading={index === 0 ? 'eager' : 'lazy'} sizes="(max-width: 1024px) 260px, 25vw" className="object-cover transition-transform duration-300 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-neutral-950/15 to-transparent" />
            {store.hasPromotion ? <PromoPill text={content.promotionText} /> : null}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                setIsFavorite((current) => !current)
              }}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/88 text-neutral-700 shadow-sm backdrop-blur-md"
              aria-label="Favoritar loja"
            >
              <Heart className={cn('h-4.5 w-4.5 transition-colors', isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600')} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-lg font-semibold">{content.name}</h3>
                  <p className="text-sm text-white/75">{content.subcategoryLabel}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {store.rating}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
                <StatusPill isOpen={isOpen} />
                <ScorePill points={store.loyaltyPoints} />
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {content.neighborhood}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/lojas/${store.id}`} className="snap-start min-w-[260px] md:min-w-0">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.985 }}
          className="flex min-h-[122px] gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={store.image} alt={content.name} fill className="object-cover" />
            {store.hasPromotion ? <PromoPill text="Promo" /> : null}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">{content.name}</h3>
                <p className="text-xs text-neutral-500">{content.subcategoryLabel}</p>
              </div>
              <StatusPill isOpen={isOpen} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{store.rating}</span>
                <span className="text-neutral-500">({store.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{content.neighborhood}</span>
              </div>
              <ScorePill points={store.loyaltyPoints} />
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/lojas/${store.id}`} className="snap-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="min-w-[200px] rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md"
        >
          <div className="relative h-28 overflow-hidden rounded-xl">
            <Image src={store.image} alt={content.name} fill className="object-cover" />
            {store.hasPromotion ? <PromoPill text="Promo" /> : null}
          </div>
          <div className="mt-3 space-y-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">{content.name}</h3>
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 text-neutral-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{store.rating}</span>
              </div>
              <span className="text-neutral-500">{content.neighborhood}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  const cardBody = (
    <>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image src={store.image} alt={content.name} fill className="object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">{content.name}</h3>
            <p className="text-xs text-neutral-500">{content.subcategoryLabel}</p>
          </div>
          <StatusPill isOpen={isOpen} />
        </div>

        {store.hasPromotion ? (
          <div className="mt-2">
            <PromoInfo text={content.promotionText} />
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-neutral-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{store.rating}</span>
            <span className="text-neutral-500">({store.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{content.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{store.openHour}:00 - {store.closeHour}:00</span>
          </div>
          <ScorePill points={store.loyaltyPoints} />
        </div>

        {showDetailsButton ? (
          <div className="mt-3 flex justify-end">
            <Link
              href={`/lojas/${store.id}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-xl border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              Ver detalhes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )

  if (onCardClick) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => onCardClick(store)}
        className="flex h-full min-h-[132px] w-full gap-4 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
      >
        {cardBody}
      </motion.button>
    )
  }

  return (
    <Link href={`/lojas/${store.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.985 }}
        className="flex h-full min-h-[132px] gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        {cardBody}
      </motion.div>
    </Link>
  )
}



