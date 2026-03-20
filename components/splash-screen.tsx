'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface SplashScreenProps {
  isVisible: boolean
  onComplete?: () => void
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Grid pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </motion.div>
          </div>

          {/* Animated circles background */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.15 }}
            transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full bg-primary-foreground"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.1 }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full bg-primary-foreground"
          />

          {/* Content */}
          <div className="relative flex flex-col items-center">
            {/* Logo container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
              className="relative"
            >
              {/* Outer glow ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
                transition={{ 
                  delay: 0.5,
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute inset-0 rounded-3xl bg-primary-foreground"
              />
              
              {/* Main logo */}
              <div className="relative h-28 w-28 rounded-3xl bg-primary-foreground shadow-2xl flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.3
                  }}
                >
                  <MapPin className="h-14 w-14 text-primary" strokeWidth={2.5} />
                </motion.div>
              </div>
            </motion.div>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <motion.h1 
                className="text-3xl font-bold text-primary-foreground tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Centro Vivo
              </motion.h1>
              <motion.p 
                className="text-lg text-primary-foreground/80 font-medium mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                Aracaju
              </motion.p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-4 text-sm text-primary-foreground/60 text-center max-w-[200px]"
            >
              O centro como um shopping a ceu aberto
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="mt-12 w-48"
            >
              <div className="h-1.5 w-full rounded-full bg-primary-foreground/20 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    delay: 1,
                    duration: 1.4,
                    ease: 'easeInOut'
                  }}
                  className="h-full rounded-full bg-primary-foreground"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.3 }}
                className="mt-3 text-xs text-primary-foreground/60 text-center"
              >
                Carregando...
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom wave decoration */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0"
          >
            <svg
              viewBox="0 0 1440 200"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 1.5, ease: 'easeInOut' }}
                d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,128C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
                fill="rgba(255,255,255,0.1)"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
