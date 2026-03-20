'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode, CheckCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess?: (points: number) => void
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [scanning, setScanning] = useState(true)
  const [success, setSuccess] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setScanning(true)
      setSuccess(false)
      
      // Simular scan após 2.5 segundos
      const timer = setTimeout(() => {
        setScanning(false)
        setSuccess(true)
        const points = Math.floor(Math.random() * 50) + 30
        setPointsEarned(points)
        onScanSuccess?.(points)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onScanSuccess])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-foreground flex items-center justify-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-primary-foreground/20 text-primary-foreground z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {scanning ? (
            <>
              {/* Scanning UI */}
              <div className="relative">
                {/* Scanner frame */}
                <div className="relative h-64 w-64">
                  {/* Corner borders */}
                  <div className="absolute top-0 left-0 h-12 w-12 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 h-12 w-12 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                  
                  {/* Scanning line */}
                  <motion.div
                    animate={{ y: [0, 240, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  />

                  {/* QR Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <QrCode className="h-20 w-20 text-primary-foreground/30" />
                    </motion.div>
                  </div>
                </div>

                {/* Instructions */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary-foreground text-center mt-8 text-lg"
                >
                  Posicione o QR Code da loja
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                  className="text-primary-foreground/70 text-center mt-2"
                >
                  Escaneando...
                </motion.p>
              </div>
            </>
          ) : success ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-8"
            >
              {/* Success animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="relative mb-6"
              >
                <div className="h-24 w-24 mx-auto bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-primary-foreground" />
                </div>
                
                {/* Sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ 
                      scale: [0, 1, 1],
                      opacity: [1, 1, 0],
                      x: Math.cos(i * 60 * Math.PI / 180) * 60,
                      y: Math.sin(i * 60 * Math.PI / 180) * 60,
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="h-5 w-5 text-gold" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-primary-foreground mb-2"
              >
                Check-in realizado!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-gold text-3xl font-bold mb-4"
              >
                <Sparkles className="h-6 w-6" />
                +{pointsEarned} pontos
                <Sparkles className="h-6 w-6" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.7 }}
                className="text-primary-foreground/80 mb-8"
              >
                Continue explorando o centro para ganhar mais pontos!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg"
              >
                Continuar Explorando
              </motion.button>
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
