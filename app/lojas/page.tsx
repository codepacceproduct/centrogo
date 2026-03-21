'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, SlidersHorizontal, X, Star, MapPinned } from 'lucide-react'
import Link from 'next/link'

import { BottomNav } from '@/components/bottom-nav'
import { SearchBar } from '@/components/search-bar'
import { StoreCard } from '@/components/store-card'
import { StoreCardSkeleton } from '@/components/skeleton-loader'
import { categories, isStoreOpen, stores, storeSubcategoryFilters, type StoreGroup } from '@/lib/data'
import { cn } from '@/lib/utils'

const StoresMapLayer = dynamic(() => import('@/components/stores-map-layer'), {
  ssr: false,
})

function LojasContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('categoria') as StoreGroup | null
  const promoParam = searchParams.get('filter')

  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<StoreGroup | null>(categoryParam)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    openNow: false,
    minRating: 0,
    promoOnly: promoParam === 'promo',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (categoryParam && categories.some((item) => item.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    if (promoParam === 'promo') {
      setFilters((current) => ({ ...current, promoOnly: true }))
    }
  }, [promoParam])

  const subcategoryOptions = useMemo(
    () => (selectedCategory ? storeSubcategoryFilters[selectedCategory] ?? [] : []),
    [selectedCategory],
  )

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubcategory(null)
      return
    }

    const stillValid = subcategoryOptions.some((option) => option.id === selectedSubcategory)
    if (!stillValid) {
      setSelectedSubcategory(null)
    }
  }, [selectedCategory, selectedSubcategory, subcategoryOptions])

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      if (searchValue) {
        const query = searchValue.toLowerCase()
        const matchesSearch =
          store.name.toLowerCase().includes(query) ||
          store.groupLabel.toLowerCase().includes(query) ||
          store.subcategoryLabel.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query) ||
          store.description.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      if (selectedCategory && store.group !== selectedCategory) {
        return false
      }

      if (selectedSubcategory && store.subcategory !== selectedSubcategory) {
        return false
      }

      if (filters.openNow && !isStoreOpen(store.openHour, store.closeHour)) {
        return false
      }

      if (filters.minRating > 0 && store.rating < filters.minRating) {
        return false
      }

      if (filters.promoOnly && !store.hasPromotion) {
        return false
      }

      return true
    })
  }, [filters, searchValue, selectedCategory, selectedSubcategory])

  useEffect(() => {
    if (filteredStores.length === 0) {
      setSelectedStoreId(null)
      return
    }

    const stillVisible = filteredStores.some((store) => store.id === selectedStoreId)
    if (!stillVisible) {
      setSelectedStoreId(filteredStores[0].id)
    }
  }, [filteredStores, selectedStoreId])

  const selectedStore = useMemo(
    () => filteredStores.find((store) => store.id === selectedStoreId) ?? filteredStores[0] ?? null,
    [filteredStores, selectedStoreId],
  )

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.openNow) count += 1
    if (filters.minRating > 0) count += 1
    if (filters.promoOnly) count += 1
    if (selectedSubcategory) count += 1
    return count
  }, [filters, selectedSubcategory])

  return (
    <main className="pb-24 lg:pb-8 lg:pt-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:top-20">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-lg">Lojas do Centro</h1>
            <p className="text-xs text-muted-foreground">Filtros especificos por tipo e mapa integrado com markers</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <SearchBar value={searchValue} onChange={setSearchValue} className="pb-3" />
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              activeFiltersCount > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFiltersCount}
              </span>
            ) : null}
          </motion.button>

          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              !selectedCategory ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted',
            )}
          >
            Todas
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory((current) => (current === category.id ? null : category.id))}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === category.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {subcategoryOptions.length > 0 ? (
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
            {subcategoryOptions.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setSelectedSubcategory((current) => (current === subcategory.id ? null : subcategory.id))}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  selectedSubcategory === subcategory.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:bg-muted',
                )}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {filteredStores.length} {filteredStores.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
              <p className="text-xs text-muted-foreground">Dados mockados integrados ao mapa do Centro de Aracaju</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.markerColor }} />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          <StoresMapLayer
            stores={filteredStores}
            selectedStore={selectedStore}
            onSelect={(store) => setSelectedStoreId(store.id)}
          />

          {selectedStore ? (
            <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedStore.color }} />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {selectedStore.groupLabel}
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">{selectedStore.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedStore.subcategoryLabel}</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-gold/10 px-2.5 py-1.5 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {selectedStore.rating}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{selectedStore.address}</span>
                <span>{selectedStore.openHour}:00 - {selectedStore.closeHour}:00</span>
                <span>{selectedStore.phone}</span>
              </div>
            </div>
          ) : null}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinned className="h-4 w-4" />
            Cards e markers usam a mesma base mockada: nome, categoria, cor e localizacao.
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <StoreCardSkeleton key={index} />)
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={cn(
                    'cursor-pointer rounded-[1.75rem] transition-all',
                    selectedStore?.id === store.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
                  )}
                >
                  <StoreCard store={store} index={index} />
                </div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-14 text-center">
                <div className="mb-3 text-4xl">MAP</div>
                <h3 className="font-semibold text-lg">Nenhum ponto encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros para exibir lojas e markers novamente.</p>
                <button
                  onClick={() => {
                    setSearchValue('')
                    setSelectedCategory(null)
                    setSelectedSubcategory(null)
                    setFilters({ openNow: false, minRating: 0, promoOnly: false })
                  }}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showFilters ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/20"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[72vh] overflow-auto rounded-t-3xl bg-background"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-semibold text-lg">Filtros da rota /lojas</h2>
                <button onClick={() => setShowFilters(false)} className="rounded-full p-2 transition-colors hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-4">
                <div>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="font-medium">Aberto agora</span>
                    <div
                      className={cn('h-7 w-12 rounded-full p-1 transition-colors', filters.openNow ? 'bg-primary' : 'bg-muted')}
                      onClick={() => setFilters((current) => ({ ...current, openNow: !current.openNow }))}
                    >
                      <motion.div className="h-5 w-5 rounded-full bg-background shadow" animate={{ x: filters.openNow ? 20 : 0 }} />
                    </div>
                  </label>
                </div>

                <div>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="font-medium">Somente promocao</span>
                    <div
                      className={cn('h-7 w-12 rounded-full p-1 transition-colors', filters.promoOnly ? 'bg-primary' : 'bg-muted')}
                      onClick={() => setFilters((current) => ({ ...current, promoOnly: !current.promoOnly }))}
                    >
                      <motion.div className="h-5 w-5 rounded-full bg-background shadow" animate={{ x: filters.promoOnly ? 20 : 0 }} />
                    </div>
                  </label>
                </div>

                <div>
                  <p className="mb-3 font-medium">Avaliacao minima</p>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters((current) => ({ ...current, minRating: rating }))}
                        className={cn(
                          'flex items-center gap-1 rounded-lg border px-3 py-2 transition-colors',
                          filters.minRating === rating ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted',
                        )}
                      >
                        {rating === 0 ? (
                          'Todas'
                        ) : (
                          <>
                            <Star className="h-4 w-4 fill-gold text-gold" />
                            {rating}+
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 border-t border-border pt-4">
                  <button
                    onClick={() => {
                      setSelectedSubcategory(null)
                      setFilters({ openNow: false, minRating: 0, promoOnly: false })
                    }}
                    className="flex-1 rounded-xl border border-border py-3 font-medium"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <BottomNav />
    </main>
  )
}

function LojasPageFallback() {
  return (
    <main className="pb-24 lg:pb-8 lg:pt-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:top-20">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold text-lg">Lojas do Centro</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <div className="h-10 animate-pulse rounded-xl bg-muted" />
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 xl:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-[2rem] bg-muted" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StoreCardSkeleton key={index} />
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  )
}

export default function LojasPage() {
  return (
    <Suspense fallback={<LojasPageFallback />}>
      <LojasContent />
    </Suspense>
  )
}
