'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Building2, CalendarRange, ChevronLeft, Sparkles, Store, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StepIntroProps {
  onNext: () => void
}

interface IntroSlide {
  eyebrow: string
  title: string
  subtitle?: string
  description: string
  impact: string
  icon: typeof Sparkles
  accentClassName: string
}

const introSlides: IntroSlide[] = [
  {
    eyebrow: 'Plataforma',
    title: 'CentroGO',
    subtitle: 'O centro da cidade, reinventado.',
    description:
      'Uma plataforma que conecta pessoas, com\u00e9rcios e experi\u00eancias em tempo real, unindo o melhor do f\u00edsico e do digital em um s\u00f3 lugar.',
    impact: 'Tudo o que importa no Centro reunido em uma experi\u00eancia viva e conectada.',
    icon: Sparkles,
    accentClassName: 'from-primary/20 via-sky-500/10 to-transparent text-primary',
  },
  {
    eyebrow: 'Visitantes',
    title: 'Para quem vive o Centro',
    description:
      'Descubra o que est\u00e1 ao seu redor, compare pre\u00e7os na hora, navegue com facilidade e aproveite ofertas exclusivas em uma experi\u00eancia r\u00e1pida, inteligente e personalizada.',
    impact: 'Mais praticidade. Mais economia. Melhor experi\u00eancia.',
    icon: Users,
    accentClassName: 'from-emerald-500/20 via-primary/10 to-transparent text-emerald-700',
  },
  {
    eyebrow: 'Lojistas',
    title: 'Para quem faz o Centro acontecer',
    description:
      'Transforme seu neg\u00f3cio em digital, aumente sua visibilidade e atraia clientes certos no momento certo.',
    impact: 'Mais fluxo. Mais vendas. Mais crescimento.',
    icon: Store,
    accentClassName: 'from-amber-500/20 via-orange-500/10 to-transparent text-amber-700',
  },
  {
    eyebrow: 'Criadores de Eventos',
    title: 'Para quem cria movimento',
    description:
      'Divulgue seus eventos com precis\u00e3o, alcance mais pessoas e gere engajamento real no cora\u00e7\u00e3o da cidade.',
    impact: 'Mais p\u00fablico. Mais alcance. Mais impacto.',
    icon: CalendarRange,
    accentClassName: 'from-fuchsia-500/20 via-rose-500/10 to-transparent text-fuchsia-700',
  },
  {
    eyebrow: 'Prefeitura',
    title: 'Para quem transforma a cidade',
    description:
      'Dados inteligentes e em tempo real para decis\u00f5es mais eficientes, impulsionando mobilidade, seguran\u00e7a e desenvolvimento econ\u00f4mico.',
    impact: 'Mais dados. Melhores decis\u00f5es. Cidade mais viva.',
    icon: Building2,
    accentClassName: 'from-sky-500/20 via-cyan-500/10 to-transparent text-sky-700',
  },
]

function IntroSlideCard({ item, compact = false }: { item: IntroSlide; compact?: boolean }) {
  const Icon = item.icon

  return (
    <article
      className={cn(
        'relative flex min-w-full min-w-0 flex-col justify-between',
        compact ? 'px-5 py-5 sm:px-6 sm:py-6' : 'px-6 py-7 md:px-10 md:py-10',
      )}
    >
      <div className="min-w-0">
        <div
          className={cn(
            'inline-flex max-w-full items-center gap-2 rounded-full bg-gradient-to-r text-sm font-semibold',
            compact ? 'px-3.5 py-2 text-xs sm:text-sm' : 'px-4 py-2',
            item.accentClassName,
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.eyebrow}</span>
        </div>

        <h3
          className={cn(
            'mt-5 font-bold tracking-tight text-foreground break-words',
            compact
              ? 'text-[clamp(1.8rem,7vw,2.45rem)] leading-[1.05]'
              : 'max-w-2xl text-3xl leading-tight md:text-4xl',
          )}
        >
          {item.title}
        </h3>

        {item.subtitle ? (
          <p className={cn('mt-3 font-medium text-foreground/80', compact ? 'text-sm sm:text-base' : 'text-lg')}>
            {item.subtitle}
          </p>
        ) : null}

        <p
          className={cn(
            'mt-4 max-w-2xl text-muted-foreground',
            compact ? 'text-sm leading-6 sm:text-base' : 'text-base leading-7 md:text-lg',
          )}
        >
          {item.description}
        </p>
      </div>

      <div
        className={cn(
          'mt-6 rounded-[1.4rem] border border-primary/10 bg-background/85 backdrop-blur',
          compact ? 'p-4 sm:p-5' : 'p-5',
        )}
      >
        <p className={cn('font-semibold text-foreground break-words', compact ? 'text-base leading-6 sm:text-lg' : 'text-lg')}>
          {item.impact}
        </p>
      </div>
    </article>
  )
}

export function StepIntro({ onNext }: StepIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const progressValue = useMemo(() => ((currentSlide + 1) / introSlides.length) * 100, [currentSlide])
  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === introSlides.length - 1
  const activeSlide = introSlides[currentSlide]

  const advanceSlide = () => {
    if (isLastSlide) {
      onNext()
      return
    }

    setCurrentSlide((value) => Math.min(value + 1, introSlides.length - 1))
  }

  useEffect(() => {
    if (!isLastSlide) return

    const timer = window.setTimeout(() => {
      onNext()
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [isLastSlide, onNext])

  return (
    <div className="flex min-h-full w-full flex-1 min-w-0 flex-col overflow-hidden">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80 sm:text-sm">
            {'Primeiro passo'}
          </p>
          <h2 className="mt-2 text-[clamp(1.7rem,6vw,2.35rem)] font-bold tracking-tight text-foreground leading-[1.08]">
            {'Entenda o valor da plataforma em menos de um minuto.'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {
              'Antes de entrar, fazemos um giro r\u00e1pido pelo que o CentroGO entrega para quem visita, empreende, cria experi\u00eancias e toma decis\u00f5es.'
            }
          </p>
        </div>

        <div className="hidden rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary md:block">
          {`${currentSlide + 1}/${introSlides.length}`}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary/10">
        <motion.div
          animate={{ width: `${progressValue}%` }}
          className="h-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500"
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-4 min-w-0 overflow-hidden rounded-[1.6rem] border border-border/60 bg-muted/30 shadow-[0_18px_80px_-40px_rgba(15,23,42,0.55)] lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.title}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-w-0"
          >
            <IntroSlideCard item={activeSlide} compact />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mt-6 hidden min-w-0 flex-1 overflow-hidden rounded-[2rem] border border-border/60 bg-muted/30 shadow-[0_18px_80px_-40px_rgba(15,23,42,0.55)] lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <motion.div
          animate={{ x: `-${currentSlide * 100}%` }}
          className="flex w-full"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {introSlides.map((item) => (
            <IntroSlideCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {introSlides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Ir para o slide ${index + 1}`}
              className={cn(
                'h-2.5 rounded-full transition-all',
                index === currentSlide ? 'w-10 bg-primary' : 'w-2.5 bg-primary/20 hover:bg-primary/35',
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary md:hidden">
          {`${currentSlide + 1}/${introSlides.length}`}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center rounded-full px-5 text-muted-foreground hover:text-foreground sm:w-auto"
          onClick={advanceSlide}
        >
          {'Passar.'}
        </Button>

        <div className="grid gap-3 sm:flex sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full px-5 sm:w-auto"
            onClick={() => setCurrentSlide((value) => Math.max(value - 1, 0))}
            disabled={isFirstSlide}
          >
            <ChevronLeft className="h-4 w-4" />
            {'Voltar'}
          </Button>

          <Button
            type="button"
            className="w-full rounded-full px-5 sm:w-auto"
            onClick={advanceSlide}
          >
            {'Avan\u00e7ar'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}