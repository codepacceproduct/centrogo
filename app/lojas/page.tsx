'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Star, MapPinned, Store } from 'lucide-react'

import { AccessibilityMapCard } from '@/components/accessibility/accessibility-map-card'
import { AccessibilityHighlights } from '@/components/accessibility/accessibility-physical-card'
import { ActiveFiltersBar, PageFiltersHeader, type PageFilterChip } from '@/components/filters/page-filters'
import { StoreCard } from '@/components/store-card'
import { StoreCardSkeleton } from '@/components/skeleton-loader'
import { categories, isStoreOpen, stores, storeSubcategoryFilters, type StoreGroup } from '@/lib/data'
import { normalizeText } from '@/lib/text'
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
        const query = normalizeText(searchValue).toLowerCase()
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
    if (selectedCategory) count += 1
    if (selectedSubcategory) count += 1
    if (filters.openNow) count += 1
    if (filters.minRating > 0) count += 1
    if (filters.promoOnly) count += 1
    return count
  }, [filters, selectedCategory, selectedSubcategory])

  const primaryFilterChips = useMemo<PageFilterChip[]>(() => {
    return [
      {
        id: 'all',
        label: 'Todas',
        active: !selectedCategory,
        onClick: () => setSelectedCategory(null),
      },
      ...categories.map((category) => ({
        id: category.id,
        label: category.name,
        active: selectedCategory === category.id,
        onClick: () => setSelectedCategory((current) => (current === category.id ? null : category.id)),
      })),
    ]
  }, [selectedCategory])

  const secondaryFilterChips = useMemo<PageFilterChip[]>(() => {
    return subcategoryOptions.map((subcategory) => ({
      id: subcategory.id,
      label: subcategory.name,
      active: selectedSubcategory === subcategory.id,
      onClick: () => setSelectedSubcategory((current) => (current === subcategory.id ? null : subcategory.id)),
    }))
  }, [selectedSubcategory, subcategoryOptions])

  const activeFilterTags = useMemo(() => {
    const tags: Array<{ id: string; label: string; onRemove?: () => void }> = []

    if (selectedCategory) {
      const category = categories.find((item) => item.id === selectedCategory)
      if (category) {
        tags.push({ id: 'category', label: category.name, onRemove: () => setSelectedCategory(null) })
      }
    }

    if (selectedSubcategory) {
      const subcategory = subcategoryOptions.find((item) => item.id === selectedSubcategory)
      if (subcategory) {
        tags.push({ id: 'subcategory', label: subcategory.name, onRemove: () => setSelectedSubcategory(null) })
      }
    }

    if (filters.openNow) {
      tags.push({ id: 'openNow', label: 'Aberto agora', onRemove: () => setFilters((current) => ({ ...current, openNow: false })) })
    }

    if (filters.minRating > 0) {
      tags.push({ id: 'minRating', label: `${filters.minRating}+ estrelas`, onRemove: () => setFilters((current) => ({ ...current, minRating: 0 })) })
    }

    if (filters.promoOnly) {
      tags.push({ id: 'promoOnly', label: 'Somente promoção', onRemove: () => setFilters((current) => ({ ...current, promoOnly: false })) })
    }

    return tags
  }, [filters, selectedCategory, selectedSubcategory, subcategoryOptions])

  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setFilters({ openNow: false, minRating: 0, promoOnly: false })
  }

  return (
    <main className="pb-24 pt-[17.5rem] lg:overflow-visible lg:pb-8 lg:pt-28">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm lg:sticky lg:top-28 lg:shadow-sm">
        <PageFiltersHeader
          title="Lojas do Centro"
          subtitle="Busca inteligente com categorias, subcategorias e filtros de conveniencia"
          icon={<Store className="h-5 w-5" />}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          actionSlot={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className={cn(
                'hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors md:flex',
                activeFiltersCount > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Ajustes
              {activeFiltersCount > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFiltersCount}
                </span>
              ) : null}
            </motion.button>
          }
          primaryFilters={primaryFilterChips}
          secondaryFilters={secondaryFilterChips}
        />
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          <div className="space-y-3 rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {filteredStores.length} {filteredStores.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
                <p className="text-xs text-muted-foreground">Tudo sincronizado com lista, mapa e destaque selecionado.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Ajustes
              </button>
            </div>

            <ActiveFiltersBar
              tags={activeFilterTags}
              onClear={activeFilterTags.length > 0 ? clearAllFilters : undefined}
              emptyLabel="Selecione uma categoria, subcategoria ou ajuste avancado para refinar a lista."
            />
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
                      {normalizeText(selectedStore.groupLabel)}
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">{normalizeText(selectedStore.name)}</h2>
                  <p className="text-sm text-muted-foreground">{normalizeText(selectedStore.subcategoryLabel)}</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-gold/10 px-2.5 py-1.5 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  {selectedStore.rating}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{normalizeText(selectedStore.address)}</span>
                <span>{selectedStore.openHour}:00 - {selectedStore.closeHour}:00</span>
                <span>{selectedStore.phone}</span>
              </div>
              <AccessibilityHighlights data={selectedStore.physicalAccessibility} className="mt-4" />
            </div>
          ) : null}

          {selectedStore ? (
            <AccessibilityMapCard
              data={selectedStore.accessibilityMap}
              description="Rotas e pontos do entorno para planejar a chegada a loja com mais conforto."
            />
          ) : null}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinned className="h-4 w-4" />
            Os filtros afetam lista, mapa e card selecionado ao mesmo tempo.
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <StoreCardSkeleton key={index} />)
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <div
                  key={store.id}
                  className={cn(
                    'rounded-[1.75rem] transition-all',
                    selectedStore?.id === store.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
                  )}
                >
                  <StoreCard
                    store={store}
                    index={index}
                    onCardClick={() => setSelectedStoreId(store.id)}
                    showDetailsButton
                  />
                </div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-14 text-center">
                <div className="mb-3 text-4xl">MAP</div>
                <h3 className="font-semibold text-lg">Nenhum ponto encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Remova algum filtro ou ajuste a busca para voltar a explorar.</p>
                <button
                  onClick={() => {
                    setSearchValue('')
                    clearAllFilters()
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
                <div>
                  <h2 className="font-semibold text-lg">Refinar lojas</h2>
                  <p className="text-xs text-muted-foreground">Ajustes rápidos para disponibilidade, promoção e nota.</p>
                </div>
                <button onClick={() => setShowFilters(false)} className="rounded-full p-2 transition-colors hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-4">
                <div className="rounded-2xl border border-border p-4">
                  <p className="mb-3 font-medium">Disponibilidade</p>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mostrar apenas lojas abertas agora</span>
                    <div
                      className={cn('h-7 w-12 rounded-full p-1 transition-colors', filters.openNow ? 'bg-primary' : 'bg-muted')}
                      onClick={() => setFilters((current) => ({ ...current, openNow: !current.openNow }))}
                    >
                      <motion.div className="h-5 w-5 rounded-full bg-background shadow" animate={{ x: filters.openNow ? 20 : 0 }} />
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="mb-3 font-medium">Promocoes</p>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-sm text-muted-foreground">Exibir somente lojas com promoção ativa</span>
                    <div
                      className={cn('h-7 w-12 rounded-full p-1 transition-colors', filters.promoOnly ? 'bg-primary' : 'bg-muted')}
                      onClick={() => setFilters((current) => ({ ...current, promoOnly: !current.promoOnly }))}
                    >
                      <motion.div className="h-5 w-5 rounded-full bg-background shadow" animate={{ x: filters.promoOnly ? 20 : 0 }} />
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border border-border p-4">
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
                      clearAllFilters()
                      setShowFilters(false)
                    }}
                    className="flex-1 rounded-xl border border-border py-3 font-medium"
                  >
                    Resetar
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
    </main>
  )
}

function LojasPageFallback() {
  return (
    <main className="pb-24 pt-[17.5rem] lg:overflow-visible lg:pb-8 lg:pt-28">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm lg:sticky lg:top-28 lg:shadow-sm">
        <PageFiltersHeader
          title="Lojas do Centro"
          subtitle="Carregando busca e filtros"
          icon={<Store className="h-5 w-5" />}
          searchValue=""
          onSearchChange={() => undefined}
          primaryFilters={[]}
        />
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 xl:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-[2rem] bg-muted" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StoreCardSkeleton key={index} />
          ))}
        </div>
      </div>
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

