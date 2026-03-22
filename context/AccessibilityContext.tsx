'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

import {
  ACCESSIBILITY_STORAGE_KEY,
  clampFontScale,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  normalizeAccessibilitySettings,
  type AccessibilitySettings,
} from '@/lib/accessibility'

type AccessibilityContextType = {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void
  resetSettings: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

function applyAccessibility(settings: AccessibilitySettings) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const body = document.body

  root.style.fontSize = `${settings.fontScale * 100}%`
  root.dataset.colorMode = settings.colorMode

  body.classList.toggle('high-contrast', settings.highContrast)
  body.classList.toggle('force-dark', settings.darkMode)
  body.classList.toggle('dyslexia', settings.dyslexiaMode)
  body.classList.toggle('text-spacing', settings.textSpacing)
  body.classList.toggle('highlight-clickable', settings.highlightClickable)
  body.classList.toggle('reduce-motion', settings.reduceMotion)
  body.classList.toggle('screen-reader', settings.screenReader)

  const filters = [
    settings.highContrast ? 'contrast(1.3) brightness(1.1)' : '',
    settings.colorMode === 'normal' ? '' : `var(--color-mode-${settings.colorMode})`,
  ].filter(Boolean)

  body.style.filter = filters.length > 0 ? filters.join(' ') : 'none'
}

function getAnnouncementTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return null

  const explicitLabel = target.getAttribute('aria-label')?.trim()
  if (explicitLabel) return explicitLabel

  const labelledBy = target.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelledText = labelledBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .join(' ')
      .trim()

    if (labelledText) return labelledText
  }

  const text = target.textContent?.replace(/\s+/g, ' ').trim()
  if (text) return text

  const title = target.getAttribute('title')?.trim()
  if (title) return title

  return null
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS)
  const [isReady, setIsReady] = useState(false)
  const hasAnnouncedScreenReader = useRef(false)

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)
      if (stored) {
        setSettings(normalizeAccessibilitySettings(JSON.parse(stored) as Partial<AccessibilitySettings>))
      }
    } catch {
      setSettings(DEFAULT_ACCESSIBILITY_SETTINGS)
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    applyAccessibility(settings)
  }, [settings])

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return
    window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings))
  }, [isReady, settings])

  useEffect(() => {
    if (!settings.screenReader) {
      hasAnnouncedScreenReader.current = false
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      return
    }

    const pageTitle = document.title || 'CentroGO'
    if (!hasAnnouncedScreenReader.current) {
      speak(`Leitor de tela ativado. Voce esta em ${pageTitle}.`)
      hasAnnouncedScreenReader.current = true
      return
    }

    speak(`Pagina atual: ${pageTitle}.`)
  }, [pathname, settings.screenReader, speak])

  useEffect(() => {
    if (!settings.screenReader || typeof window === 'undefined') return

    const handleFocusIn = (event: FocusEvent) => {
      const text = getAnnouncementTarget(event.target)
      if (text) speak(text)
    }

    window.addEventListener('focusin', handleFocusIn)
    return () => window.removeEventListener('focusin', handleFocusIn)
  }, [settings.screenReader, speak])

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((current) => {
        if (key === 'fontScale') {
          return {
            ...current,
            fontScale: clampFontScale(Number(value)),
          }
        }

        return {
          ...current,
          [key]: value,
        }
      })
    },
    [],
  )

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY)
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const contextValue = useMemo<AccessibilityContextType>(
    () => ({
      settings,
      updateSetting,
      resetSettings,
    }),
    [settings, updateSetting, resetSettings],
  )

  return <AccessibilityContext.Provider value={contextValue}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }

  return context
}

