'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Accessibility, Lightbulb, QrCode, ShieldAlert, Star } from 'lucide-react'

import FabItem from '@/components/fab-item'

type FabMenuProps = {
  isOpen: boolean
  emphasizedAction?: 'scan' | 'rate' | 'accessibility' | 'security' | 'suggestions' | null
  onScan: () => void
  onRate: () => void
  onAccessibility: () => void
  onSecurity: () => void
  onSuggestions: () => void
}

export default function FabMenu({
  isOpen,
  emphasizedAction = null,
  onScan,
  onRate,
  onAccessibility,
  onSecurity,
  onSuggestions,
}: FabMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-5 flex flex-col items-end gap-4"
        >
          <FabItem
            icon={Lightbulb}
            label="Sugestoes"
            colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
            index={0}
            isHighlighted={emphasizedAction === 'suggestions'}
            onClick={onSuggestions}
          />
          <FabItem
            icon={ShieldAlert}
            label="Seguranca"
            colorClass="bg-gradient-to-br from-rose-500 to-red-600"
            index={1}
            isHighlighted={emphasizedAction === 'security'}
            onClick={onSecurity}
          />
          <FabItem
            icon={Accessibility}
            label="Acessibilidade"
            colorClass="bg-gradient-to-br from-emerald-500 to-teal-600"
            index={2}
            isHighlighted={emphasizedAction === 'accessibility'}
            badgeText="NEW"
            onClick={onAccessibility}
          />
          <FabItem
            icon={Star}
            label="Avaliar"
            colorClass="bg-gradient-to-br from-amber-400 to-yellow-500"
            index={3}
            isHighlighted={emphasizedAction === 'rate'}
            onClick={onRate}
          />
          <FabItem
            icon={QrCode}
            label="Escanear"
            colorClass="bg-gradient-to-br from-blue-500 to-indigo-600"
            index={4}
            isHighlighted={emphasizedAction === 'scan'}
            onClick={onScan}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
