'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, MapPinned, ShieldCheck, Sparkles } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import { StepGeolocation } from './step-geolocation'
import { StepIntro } from './step-intro'
import { StepLGPD } from './step-lgpd'

interface OnboardingWrapperProps {
  isVisible: boolean
  onComplete: () => void
}

type OnboardingStep = 'intro' | 'geo' | 'lgpd'

const steps: Array<{
  id: OnboardingStep
  label: string
  title: string
  description: string
  icon: typeof Sparkles
}> = [
  {
    id: 'intro',
    label: '1/3',
    title: 'Conhe\u00e7a o CentroGO',
    description: 'Um giro r\u00e1pido pelo valor da plataforma para quem vive, empreende e transforma o Centro.',
    icon: Sparkles,
  },
  {
    id: 'geo',
    label: '2/3',
    title: 'Ative sua localiza\u00e7\u00e3o',
    description: 'Mostre contexto de proximidade sem bloquear a entrada de quem prefere decidir depois.',
    icon: Compass,
  },
  {
    id: 'lgpd',
    label: '3/3',
    title: 'Privacidade e seguran\u00e7a',
    description: 'Fechamos com transpar\u00eancia sobre dados, geolocaliza\u00e7\u00e3o e boas pr\u00e1ticas de prote\u00e7\u00e3o.',
    icon: ShieldCheck,
  },
]

export function OnboardingWrapper({ isVisible, onComplete }: OnboardingWrapperProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro')

  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  const progressValue = ((currentIndex + 1) / steps.length) * 100

  const handleComplete = () => {
    try {
      window.localStorage.setItem('onboarding_completed', 'true')
    } catch {
      // Ignore storage failures and allow the user to proceed.
    }

    setCurrentStep('intro')
    onComplete()
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.section
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[110] overflow-y-auto overflow-x-hidden bg-background/96 backdrop-blur-xl"
        >
          <div className="relative flex min-h-dvh items-stretch px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-[-6rem] top-[-4rem] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-[-4rem] right-[-4rem] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="absolute right-[20%] top-[12%] h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
            </div>

            <div className="relative mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/95 shadow-[0_30px_120px_-36px_rgba(15,23,42,0.55)] sm:min-h-[calc(100dvh-1rem)] sm:rounded-[2rem] md:min-h-[calc(100dvh-2rem)]">
              <div className="grid flex-1 min-w-0 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="hidden border-r border-border/60 bg-primary/[0.045] px-8 py-9 lg:flex lg:flex-col">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      <MapPinned className="h-4 w-4" />
                      {'Primeiro acesso'}
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                      {'Vamos preparar sua experi\u00eancia.'}
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {
                        'S\u00e3o s\u00f3 tr\u00eas etapas curtas para explicar o valor da plataforma, pedir sua localiza\u00e7\u00e3o de forma opcional e registrar o aceite de privacidade.'
                      }
                    </p>
                  </div>

                  <div className="mt-10 space-y-4">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = step.id === currentStep
                      const isComplete = index < currentIndex

                      return (
                        <div
                          key={step.id}
                          className={cn(
                            'rounded-[1.5rem] border p-4 transition-all',
                            isActive
                              ? 'border-primary/20 bg-background shadow-sm'
                              : 'border-transparent bg-transparent',
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
                                isActive || isComplete
                                  ? 'border-primary/20 bg-primary/10 text-primary'
                                  : 'border-border/60 bg-background text-muted-foreground',
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                                {step.label}
                              </p>
                              <h2 className="mt-1 text-base font-semibold text-foreground">{step.title}</h2>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
                  <div className="shrink-0 rounded-[1.2rem] border border-border/60 bg-muted/20 p-3 sm:rounded-[1.4rem] sm:p-4 lg:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70 sm:text-xs">
                          {steps[currentIndex]?.label}
                        </p>
                        <h2 className="mt-1 text-base font-semibold text-foreground sm:text-lg">
                          {steps[currentIndex]?.title}
                        </h2>
                      </div>
                      <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary sm:text-xs">
                        {'Onboarding'}
                      </div>
                    </div>
                    <Progress value={progressValue} className="mt-3 h-2" />
                  </div>

                  <div className="mb-5 hidden shrink-0 lg:block">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
                          {steps[currentIndex]?.label}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-foreground">
                          {steps[currentIndex]?.title}
                        </h2>
                      </div>
                      <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                        {'Boas-vindas'}
                      </div>
                    </div>
                    <Progress value={progressValue} className="mt-4 h-2" />
                  </div>

                  <div className="mt-3 flex min-h-0 flex-1 overflow-hidden lg:mt-0">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1"
                      >
                        {currentStep === 'intro' ? (
                          <StepIntro onNext={() => setCurrentStep('geo')} />
                        ) : null}

                        {currentStep === 'geo' ? (
                          <StepGeolocation onBack={() => setCurrentStep('intro')} onContinue={() => setCurrentStep('lgpd')} />
                        ) : null}

                        {currentStep === 'lgpd' ? (
                          <StepLGPD onBack={() => setCurrentStep('geo')} onAccept={handleComplete} />
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}