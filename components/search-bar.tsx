'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const placeholders = [
  'Buscar lojas...',
  'Buscar eventos...',
  'Buscar restaurantes...',
  'Buscar promoções...',
]

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  className?: string
}

export function SearchBar({ value, onChange, onFocus, className }: SearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isFocused || value) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isFocused, value])

  return (
    <div className={cn('px-4 max-w-7xl mx-auto', className)}>
      <div className={cn(
        'relative flex items-center bg-muted rounded-xl transition-all duration-200',
        isFocused && 'ring-2 ring-primary/30'
      )}>
        <Search className="h-5 w-5 text-muted-foreground ml-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            onFocus?.()
          }}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground"
          placeholder=""
        />
        <AnimatePresence mode="wait">
          {!value && !isFocused && (
            <motion.span
              key={placeholderIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-12 text-sm text-muted-foreground pointer-events-none"
            >
              {placeholders[placeholderIndex]}
            </motion.span>
          )}
        </AnimatePresence>
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 mr-2 rounded-full hover:bg-border transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
