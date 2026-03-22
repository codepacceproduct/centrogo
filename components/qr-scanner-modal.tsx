'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, QrCode, ScanLine, X } from 'lucide-react'

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess?: (points: number) => void
}

export function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [phase, setPhase] = useState<'scanning' | 'success'>('scanning')
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    setPhase('scanning')
    const timer = window.setTimeout(() => {
      const points = Math.floor(Math.random() * 50) + 30
      setPointsEarned(points)
      setPhase('success')
      onScanSuccess?.(points)
    }, 2600)

    return () => window.clearTimeout(timer)
  }, [isOpen, onScanSuccess])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[82] bg-[#020617] text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>

          {phase === 'scanning' ? (
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
                  <Camera className="h-8 w-8 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold">Scanner inteligente</h2>
                <p className="mt-2 text-sm text-white/70">Leitura continua com overlay premium para check-in e ativacoes contextuais.</p>
              </div>

              <div className="relative mt-10 h-72 w-72 rounded-[2rem] border border-white/12 bg-white/5 p-4 shadow-[0_28px_80px_-35px_rgba(34,211,238,0.4)] backdrop-blur-md">
                <div className="absolute inset-5 rounded-[1.6rem] border border-cyan-400/60" />
                <div className="absolute left-5 top-5 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-cyan-300" />
                <div className="absolute right-5 top-5 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-cyan-300" />
                <div className="absolute bottom-5 left-5 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-cyan-300" />
                <div className="absolute bottom-5 right-5 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-cyan-300" />
                <motion.div
                  animate={{ y: [0, 185, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-8 right-8 top-8 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                    <QrCode className="h-24 w-24 text-white/18" />
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cyan-400/12 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                  <ScanLine className="h-3.5 w-3.5" />
                  Escaneando...
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-8 shadow-[0_28px_80px_-35px_rgba(16,185,129,0.45)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <QrCode className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">QR reconhecido</h2>
                <p className="mt-2 text-sm text-white/70">Check-in confirmado com leitura premium e suporte a fluxo continuo.</p>
                <div className="mt-5 rounded-2xl bg-white/10 px-5 py-4 text-3xl font-bold text-amber-300">+{pointsEarned} pontos</div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
                >
                  Continuar
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}