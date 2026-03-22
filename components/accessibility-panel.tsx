'use client'

import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Accessibility,
  Eye,
  MoonStar,
  RotateCcw,
  Type,
  Volume2,
  CaseSensitive,
  StretchHorizontal,
} from 'lucide-react'

import { useAccessibility } from '@/context/AccessibilityContext'
import { cn } from '@/lib/utils'

type AccessibilityPanelProps = {
  isOpen: boolean
  onClose: () => void
}

type ToggleRowProps = {
  icon: typeof Accessibility
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}

function ToggleRow({ icon: Icon, label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/80 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-2xl bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={value}
        onClick={() => onChange(!value)}
        className={cn('flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-200', value ? 'bg-primary' : 'bg-muted')}
      >
        <motion.span
          className="h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        />
      </button>
    </div>
  )
}

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility()

  const panelTitle = useMemo(() => 'Painel de Acessibilidade', [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const adjustFontScale = (direction: 'up' | 'down') => {
    updateSetting('fontScale', settings.fontScale + (direction === 'up' ? 0.1 : -0.1))
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[88] bg-foreground/35 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] z-[89] max-h-[min(70vh,560px)] overflow-hidden rounded-[2rem] border border-border/70 bg-background/96 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:w-[min(720px,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{panelTitle}</h2>
                <p className="text-sm text-muted-foreground">Ajustes globais, persistentes e aplicados em tempo real.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                Fechar
              </button>
            </div>

            <div className="overflow-y-auto p-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] overscroll-contain max-h-[calc(min(70vh,560px)-5rem)] sm:max-h-[calc(85vh-5rem)]">
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-border bg-card/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                      <Type className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Escala de texto</p>
                      <p className="text-sm text-muted-foreground">Ajuste global em todas as paginas</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" onClick={() => adjustFontScale('down')} className="rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold">A-</button>
                    <div className="flex-1 rounded-full bg-muted px-4 py-2 text-center text-sm font-semibold text-foreground">
                      {Math.round(settings.fontScale * 100)}%
                    </div>
                    <button type="button" onClick={() => adjustFontScale('up')} className="rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold">A+</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <ToggleRow icon={MoonStar} label="Modo noturno forcado" description="Escurece a interface sem depender do tema atual." value={settings.darkMode} onChange={(value) => updateSetting('darkMode', value)} />
                <ToggleRow icon={CaseSensitive} label="Modo dislexia" description="Aplica fonte e leitura mais amigavel para dislexia." value={settings.dyslexiaMode} onChange={(value) => updateSetting('dyslexiaMode', value)} />
                <ToggleRow icon={StretchHorizontal} label="Espacamento de texto" description="Aumenta espaco entre letras e linhas." value={settings.textSpacing} onChange={(value) => updateSetting('textSpacing', value)} />
                <ToggleRow icon={Volume2} label="Leitor de tela" description="Le titulo da pagina e elementos focados por voz." value={settings.screenReader} onChange={(value) => updateSetting('screenReader', value)} />
                <ToggleRow icon={Eye} label="Destacar clicaveis" description="Aplica contorno forte em links, botoes e elementos interativos." value={settings.highlightClickable} onChange={(value) => updateSetting('highlightClickable', value)} />
                <ToggleRow icon={Accessibility} label="Reduzir animacoes" description="Remove animacoes e transicoes intensas globalmente." value={settings.reduceMotion} onChange={(value) => updateSetting('reduceMotion', value)} />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-card/80 p-4">
                <div>
                  <p className="font-semibold text-foreground">Resetar configuracoes</p>
                  <p className="text-sm text-muted-foreground">Volta para o perfil padrao e limpa a persistencia local.</p>
                </div>
                <button
                  type="button"
                  onClick={resetSettings}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetar padrao
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
