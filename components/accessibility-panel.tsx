'use client'

import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Accessibility,
  Contrast,
  Eye,
  MoonStar,
  Palette,
  RotateCcw,
  Type,
  Volume2,
  CaseSensitive,
  StretchHorizontal,
} from 'lucide-react'

import { useAccessibility } from '@/context/AccessibilityContext'
import type { ColorMode } from '@/lib/accessibility'
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
        className={cn('flex h-7 w-12 rounded-full p-1 transition-colors', value ? 'bg-primary' : 'bg-muted')}
      >
        <motion.span
          layout
          className="h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: value ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        />
      </button>
    </div>
  )
}

const COLOR_MODE_OPTIONS: Array<{ id: ColorMode; label: string }> = [
  { id: 'normal', label: 'Padrao' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
]

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility()

  const panelTitle = useMemo(() => 'Painel de Acessibilidade', [])

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
            className="fixed inset-0 z-[78] bg-foreground/35 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-[79] rounded-t-[2rem] border border-border/70 bg-background/96 shadow-[0_-18px_65px_-35px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:w-[min(720px,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[2rem]"
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

            <div className="max-h-[calc(85vh-84px)] overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="rounded-[1.5rem] border border-border bg-card/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-600">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Modo de cor</p>
                      <p className="text-sm text-muted-foreground">Filtro global para daltonismo</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {COLOR_MODE_OPTIONS.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => updateSetting('colorMode', mode.id)}
                        className={cn(
                          'rounded-full border px-3 py-2 text-xs font-semibold',
                          settings.colorMode === mode.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-card text-muted-foreground',
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <ToggleRow icon={Contrast} label="Alto contraste" description="Aumenta contraste e brilho global da interface." value={settings.highContrast} onChange={(value) => updateSetting('highContrast', value)} />
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
