'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Story {
  id: string
  title: string
  image: string
  viewed: boolean
}

interface StoryHighlightsProps {
  stories: Story[]
}

export function StoryHighlights({ stories }: StoryHighlightsProps) {
  const [viewingStory, setViewingStory] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  const openStory = (index: number) => {
    setViewingStory(index)
    setProgress(0)
  }

  const closeStory = () => {
    setViewingStory(null)
    setProgress(0)
  }

  const nextStory = () => {
    if (viewingStory !== null && viewingStory < stories.length - 1) {
      setViewingStory(viewingStory + 1)
      setProgress(0)
    } else {
      closeStory()
    }
  }

  const prevStory = () => {
    if (viewingStory !== null && viewingStory > 0) {
      setViewingStory(viewingStory - 1)
      setProgress(0)
    }
  }

  return (
    <>
      {/* Story Circles */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openStory(index)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className={cn(
              'p-0.5 rounded-full',
              story.viewed 
                ? 'bg-muted' 
                : 'bg-gradient-to-tr from-primary via-secondary to-gold'
            )}>
              <div className="p-0.5 bg-background rounded-full">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-center w-16 truncate">
              {story.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {viewingStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground"
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {stories.map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-primary-foreground/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-foreground"
                    initial={{ width: index < viewingStory ? '100%' : '0%' }}
                    animate={{ 
                      width: index < viewingStory ? '100%' : index === viewingStory ? '100%' : '0%' 
                    }}
                    transition={{ 
                      duration: index === viewingStory ? 5 : 0,
                      ease: 'linear'
                    }}
                    onAnimationComplete={() => {
                      if (index === viewingStory) {
                        nextStory()
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story content */}
            <motion.div
              key={viewingStory}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative h-full w-full"
            >
              <Image
                src={stories[viewingStory].image}
                alt={stories[viewingStory].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-transparent to-foreground/50" />
            </motion.div>

            {/* Header */}
            <div className="absolute top-10 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-foreground">
                  <Image
                    src={stories[viewingStory].image}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-primary-foreground font-semibold">{stories[viewingStory].title}</span>
              </div>
              <button 
                onClick={closeStory}
                className="p-2 rounded-full bg-primary-foreground/20 text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation areas */}
            <button 
              onClick={prevStory}
              className="absolute left-0 top-1/4 bottom-1/4 w-1/3 z-10"
            />
            <button 
              onClick={nextStory}
              className="absolute right-0 top-1/4 bottom-1/4 w-1/3 z-10"
            />

            {/* Navigation arrows (visible on hover) */}
            {viewingStory > 0 && (
              <button 
                onClick={prevStory}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-foreground/20 text-primary-foreground z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {viewingStory < stories.length - 1 && (
              <button 
                onClick={nextStory}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-foreground/20 text-primary-foreground z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-8 left-4 right-4 z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-4"
              >
                <h3 className="text-primary-foreground font-bold text-lg">{stories[viewingStory].title}</h3>
                <p className="text-primary-foreground/80 text-sm mt-1">Toque para continuar</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
