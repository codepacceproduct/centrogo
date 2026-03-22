'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { IoAccessibility } from 'react-icons/io5'
import { usePathname, useRouter } from 'next/navigation'

import AccessibilityPanel from '@/components/accessibility-panel'
import FabMenu from '@/components/fab-menu'
import { QRScannerModal } from '@/components/qr-scanner-modal'
import { RatingModal } from '@/components/rating-modal'

type SmartFABProps = {
  onScanSuccess?: (points: number) => void
}

function getContextAction(pathname: string | null) {
  if (!pathname) return null
  if (pathname.includes('/sugestoes')) return 'suggestions'
  if (pathname.includes('/seguranca')) return 'security'
  if (pathname.includes('/eventos')) return 'rate'
  if (pathname.includes('/explorar') || pathname.includes('/servicos') || pathname.includes('/lojas')) return 'scan'
  return 'accessibility'
}

export function SmartFAB({ onScanSuccess }: SmartFABProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])

  const emphasizedAction = useMemo(() => getContextAction(pathname), [pathname])

  useEffect(() => {
    if (!isFabOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFabOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFabOpen])

  const triggerFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15)
    }
    setRipples((current) => [...current, Date.now()])
  }

  const handleFabToggle = () => {
    triggerFeedback()
    setIsFabOpen((current) => !current)
  }

  return (
    <>
      <AnimatePresence>
        {isFabOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[72] bg-foreground/16 backdrop-blur-[2px]"
            onClick={() => setIsFabOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+6.25rem)] right-4 z-[73] flex flex-col items-end lg:bottom-6 lg:right-6">
        <FabMenu
          isOpen={isFabOpen}
          emphasizedAction={emphasizedAction}
          onScan={() => {
            triggerFeedback()
            setIsFabOpen(false)
            setIsScannerOpen(true)
          }}
          onRate={() => {
            triggerFeedback()
            setIsFabOpen(false)
            setIsRatingOpen(true)
          }}
          onAccessibility={() => {
            triggerFeedback()
            setIsFabOpen(false)
            setIsAccessibilityOpen(true)
          }}
          onSecurity={() => {
            triggerFeedback()
            setIsFabOpen(false)
            router.push('/seguranca')
          }}
          onSuggestions={() => {
            triggerFeedback()
            setIsFabOpen(false)
            router.push('/sugestoes')
          }}
        />

        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleFabToggle}
          style={{ backgroundColor: '#1061AA' }}
          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white shadow-[0_22px_45px_-20px_rgba(16,97,170,0.85)]"
        >
          <span className="absolute inset-0 animate-pulse rounded-full bg-white/10" />
          <AnimatePresence>
            {ripples.map((rippleId) => (
              <motion.span
                key={rippleId}
                initial={{ scale: 0.2, opacity: 0.45 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onAnimationComplete={() => setRipples((current) => current.filter((item) => item !== rippleId))}
                className="absolute inset-0 rounded-full border border-white/40"
              />
            ))}
          </AnimatePresence>
          <motion.div
            animate={{ rotate: isFabOpen ? 45 : 0, scale: isFabOpen ? 1.08 : 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {isFabOpen ? <Plus className="h-6 w-6" /> : <IoAccessibility size={26} color="white" />}
          </motion.div>
        </motion.button>
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={onScanSuccess}
      />

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        storeName="um perfil da plataforma"
        onSubmit={(rating, comment, targetType) => {
          console.log('[SmartFAB] Rating submitted', { rating, comment, targetType })
        }}
      />

      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
    </>
  )
}
