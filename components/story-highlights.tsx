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
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto no-scrollbar px-4 py-2 lg:justify-center">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openStory(index)}
            className="shrink-0 flex flex-col items-center gap-1.5"
          >
            <div className={cn('rounded-full p-0.5', story.viewed ? 'bg-muted' : 'bg-gradient-to-tr from-primary via-secondary to-gold')}>
              <div className="rounded-full bg-background p-0.5">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <span className="w-16 truncate text-center text-xs font-medium">
              {story.title}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {viewingStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-foreground"
          >
            <div className="absolute left-4 right-4 top-4 z-10 flex gap-1">
              {stories.map((_, index) => (
                <div key={index} className="h-0.5 flex-1 overflow-hidden rounded-full bg-primary-foreground/30">
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

            <div className="absolute left-4 right-4 top-10 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-foreground">
                  <Image
                    src={stories[viewingStory].image}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="font-semibold text-primary-foreground">{stories[viewingStory].title}</span>
              </div>
              <button
                onClick={closeStory}
                className="rounded-full bg-primary-foreground/20 p-2 text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button onClick={prevStory} className="absolute left-0 top-1/4 bottom-1/4 z-10 w-1/3" />
            <button onClick={nextStory} className="absolute right-0 top-1/4 bottom-1/4 z-10 w-1/3" />

            {viewingStory > 0 && (
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {viewingStory < stories.length - 1 && (
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary-foreground/20 p-2 text-primary-foreground"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            <div className="absolute bottom-8 left-4 right-4 z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-primary-foreground/10 p-4 backdrop-blur-md"
              >
                <h3 className="text-lg font-bold text-primary-foreground">{stories[viewingStory].title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">Toque para continuar</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
