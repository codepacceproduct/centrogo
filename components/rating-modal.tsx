'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  storeName?: string
  onSubmit?: (rating: number, comment: string) => void
}

export function RatingModal({ isOpen, onClose, storeName = 'esta loja', onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit?.(rating, comment)
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setRating(0)
        setComment('')
      }, 2000)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-16 w-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4"
                  >
                    <Star className="h-8 w-8 text-gold" />
                  </motion.div>
                  <h2 className="text-xl font-bold">Avalie {storeName}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sua opiniao nos ajuda a melhorar!
                  </p>
                </div>

                {/* Star rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          'h-10 w-10 transition-colors',
                          star <= displayRating
                            ? 'text-gold fill-gold'
                            : 'text-muted-foreground'
                        )}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Rating label */}
                <AnimatePresence mode="wait">
                  {displayRating > 0 && (
                    <motion.p
                      key={displayRating}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-center text-lg font-medium mb-4"
                    >
                      {displayRating === 1 && 'Muito ruim'}
                      {displayRating === 2 && 'Ruim'}
                      {displayRating === 3 && 'Regular'}
                      {displayRating === 4 && 'Bom'}
                      {displayRating === 5 && 'Excelente!'}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Comment input */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Deixe um comentario (opcional)"
                  className="w-full h-24 p-4 bg-muted rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {/* Submit button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className={cn(
                    'w-full mt-4 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors',
                    rating > 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Send className="h-5 w-5" />
                  Enviar Avaliacao
                </motion.button>

                {/* Points info */}
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Ganhe 30 pontos ao enviar sua avaliacao
                </p>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="relative mb-6"
                >
                  <div className="h-20 w-20 mx-auto bg-success rounded-full flex items-center justify-center">
                    <Star className="h-10 w-10 text-primary-foreground fill-primary-foreground" />
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ 
                        scale: [0, 1, 1],
                        opacity: [1, 1, 0],
                        x: Math.cos(i * 90 * Math.PI / 180) * 50,
                        y: Math.sin(i * 90 * Math.PI / 180) * 50,
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <Sparkles className="h-4 w-4 text-gold" />
                    </motion.div>
                  ))}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Obrigado!</h3>
                <p className="text-muted-foreground mb-2">Sua avaliacao foi enviada</p>
                <p className="text-gold font-semibold">+30 pontos</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
