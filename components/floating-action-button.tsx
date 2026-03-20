'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, QrCode, Camera, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onScanQR?: () => void
  onCheckIn?: () => void
  onRate?: () => void
}

const actions = [
  { id: 'scan', icon: QrCode, label: 'Escanear QR Code', color: 'bg-secondary' },
  { id: 'checkin', icon: MapPin, label: 'Fazer Check-in', color: 'bg-success' },
  { id: 'rate', icon: Star, label: 'Avaliar Loja', color: 'bg-gold' },
]

export function FloatingActionButton({ onScanQR, onCheckIn, onRate }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'scan':
        onScanQR?.()
        break
      case 'checkin':
        onCheckIn?.()
        break
      case 'rate':
        onRate?.()
        break
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse items-center gap-3">
        {/* Action buttons */}
        <AnimatePresence>
          {isOpen && actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAction(action.id)}
                className="flex items-center gap-2 group"
              >
                <span className="px-3 py-1.5 bg-card rounded-lg shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <div className={cn('h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-primary-foreground', action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 bg-primary rounded-full shadow-xl flex items-center justify-center text-primary-foreground"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </motion.button>
      </div>
    </>
  )
}
