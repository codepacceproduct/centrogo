'use client'

import { useState, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 60], [0, 1])
  const scale = useTransform(y, [0, 60], [0.5, 1])
  const rotate = useTransform(y, [0, 60], [0, 180])

  const handleTouchStart = useRef<number>(0)

  const handleTouchStartEvent = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      handleTouchStart.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      const diff = e.touches[0].clientY - handleTouchStart.current
      if (diff > 0) {
        y.set(Math.min(diff * 0.5, 80))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (y.get() > 60 && !isRefreshing) {
      setIsRefreshing(true)
      animate(y, 60)
      await onRefresh()
      setIsRefreshing(false)
    }
    animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStartEvent}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-auto"
    >
      <motion.div
        style={{ opacity }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 pointer-events-none z-10"
      >
        <motion.div style={{ scale, rotate }}>
          <RefreshCw className={`h-6 w-6 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.div>
      </motion.div>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
