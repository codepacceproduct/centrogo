'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Star, X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  storeName?: string
  onSubmit?: (rating: number, comment: string, targetType: string) => void
}

const targetOptions = [
  { id: 'ambulante', label: 'Ambulante' },
  { id: 'loja', label: 'Loja' },
  { id: 'pessoa', label: 'Pessoa' },
]

export function RatingModal({ isOpen, onClose, storeName = 'este perfil', onSubmit }: RatingModalProps) {
  const [targetType, setTargetType] = useState('ambulante')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const displayRating = hoveredRating || rating
  const headline = useMemo(() => `Avaliar ${storeName}`, [storeName])

  const handleSubmit = () => {
    if (rating === 0) return
    onSubmit?.(rating, comment, targetType)
    setSubmitted(true)
    window.setTimeout(() => {
      setSubmitted(false)
      setRating(0)
      setComment('')
      onClose()
    }, 1800)
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[82] flex items-end justify-center sm:items-center">
          <motion.div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative z-10 w-full rounded-t-[2rem] border border-border bg-background p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem]"
          >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted">
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg">
                    <Star className="h-8 w-8 fill-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{headline}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Reputacao, gamificacao e feedback rapido em um unico fluxo.</p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {targetOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTargetType(option.id)}
                      className={cn(
                        'rounded-full border px-3 py-2 text-xs font-semibold transition-colors',
                        targetType === option.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star className={cn('h-10 w-10 transition-colors', star <= displayRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
                    </motion.button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Comentario opcional"
                  className="mt-6 h-28 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className={cn(
                    'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition-colors',
                    rating > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Send className="h-4 w-4" />
                  Enviar avaliacao
                </button>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <Star className="h-10 w-10 fill-white" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">Avaliacao enviada</h3>
                <p className="mt-2 text-sm text-muted-foreground">Fluxo de reputacao registrado com sucesso.</p>
                <p className="mt-3 text-base font-semibold text-amber-500">+30 pontos</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}