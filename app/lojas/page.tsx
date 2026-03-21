'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, SlidersHorizontal, X, Star } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/bottom-nav'
import { SearchBar } from '@/components/search-bar'
import { StoreCard } from '@/components/store-card'
import { StoreCardSkeleton } from '@/components/skeleton-loader'
import { stores, categories, isStoreOpen } from '@/lib/data'
import { cn } from '@/lib/utils'

function LojasContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('categoria')
  
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    openNow: false,
    minRating: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Busca por texto
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch = 
          store.name.toLowerCase().includes(searchLower) ||
          store.category.toLowerCase().includes(searchLower) ||
          store.description.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Filtro por categoria
      if (selectedCategory) {
        if (store.category.toLowerCase() !== selectedCategory.toLowerCase()) return false
      }

      // Filtro "Aberto Agora"
      if (filters.openNow) {
        if (!isStoreOpen(store.openHour, store.closeHour)) return false
      }

      // Filtro de avaliação mínima
      if (filters.minRating > 0) {
        if (store.rating < filters.minRating) return false
      }

      return true
    })
  }, [searchValue, selectedCategory, filters])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.openNow) count++
    if (filters.minRating > 0) count++
    return count
  }, [filters])

  return (
    <main className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold text-lg">Marketplace</h1>
        </div>

        {/* Busca */}
        <div className="max-w-7xl mx-auto">
          <SearchBar 
            value={searchValue}
            onChange={setSearchValue}
            className="pb-3"
          />
        </div>

        {/* Filtros rápidos */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium shrink-0 transition-colors',
              activeFiltersCount > 0 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </motion.button>

          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1.5 rounded-full border text-sm font-medium shrink-0 transition-colors',
              !selectedCategory 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-border hover:bg-muted'
            )}
          >
            Todas
          </button>

          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name.toLowerCase() ? null : category.name.toLowerCase()
              )}
              className={cn(
                'px-3 py-1.5 rounded-full border text-sm font-medium shrink-0 transition-colors',
                selectedCategory === category.name.toLowerCase()
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-border hover:bg-muted'
              )}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </header>

      {/* Lista de Lojas */}
      <div className="p-4 max-w-7xl mx-auto">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredStores.length} {filteredStores.length === 1 ? 'loja encontrada' : 'lojas encontradas'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))
          ) : filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg">Nenhuma loja encontrada</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
              <button
                onClick={() => {
                  setSearchValue('')
                  setSelectedCategory(null)
                  setFilters({ openNow: false, minRating: 0 })
                }}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de Filtros */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background z-50 rounded-t-3xl max-h-[70vh] overflow-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold text-lg">Filtros</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Aberto Agora */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium">Aberto agora</span>
                    <div 
                      className={cn(
                        'w-12 h-7 rounded-full p-1 transition-colors',
                        filters.openNow ? 'bg-primary' : 'bg-muted'
                      )}
                      onClick={() => setFilters(f => ({ ...f, openNow: !f.openNow }))}
                    >
                      <motion.div 
                        className="h-5 w-5 bg-background rounded-full shadow"
                        animate={{ x: filters.openNow ? 20 : 0 }}
                      />
                    </div>
                  </label>
                </div>

                {/* Avaliação mínima */}
                <div>
                  <p className="font-medium mb-3">Avaliação mínima</p>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setFilters(f => ({ ...f, minRating: rating }))}
                        className={cn(
                          'flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors',
                          filters.minRating === rating
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:bg-muted'
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

                {/* Botões de ação */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setFilters({ openNow: false, minRating: 0 })
                    }}
                    className="flex-1 py-3 rounded-xl border border-border font-medium"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  )
}

function LojasPageFallback() {
  return (
    <main className="pb-24">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold text-lg">Marketplace</h1>
        </div>
        <div className="px-4 pb-3 max-w-7xl mx-auto">
          <div className="h-10 bg-muted rounded-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </header>
      <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StoreCardSkeleton key={i} />
        ))}
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
