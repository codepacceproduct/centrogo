'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({ value, duration = 1, className, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => `${prefix}${Math.round(current).toLocaleString()}${suffix}`)
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`)

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [display])

  return <motion.span className={className}>{displayValue}</motion.span>
}

interface AnimatedProgressProps {
  value: number
  max: number
  className?: string
  barClassName?: string
  showPercentage?: boolean
}

export function AnimatedProgress({ value, max, className, barClassName, showPercentage }: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={className}>
      <div className="h-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className={barClassName || 'h-full bg-gradient-to-r from-gold to-gold-dark rounded-full'}
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-muted-foreground ml-2">{Math.round(percentage)}%</span>
      )}
    </div>
  )
}
