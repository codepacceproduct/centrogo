export interface AccessibilitySettings {
  fontScale: number
  darkMode: boolean
  dyslexiaMode: boolean
  textSpacing: boolean
  screenReader: boolean
  highlightClickable: boolean
  reduceMotion: boolean
}

export const ACCESSIBILITY_STORAGE_KEY = 'centrovivo:accessibility-settings'

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  darkMode: false,
  dyslexiaMode: false,
  textSpacing: false,
  screenReader: false,
  highlightClickable: false,
  reduceMotion: false,
}

export function clampFontScale(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_ACCESSIBILITY_SETTINGS.fontScale
  return Math.min(1.4, Math.max(0.9, Number(value.toFixed(2))))
}

export function normalizeAccessibilitySettings(input?: Partial<AccessibilitySettings>): AccessibilitySettings {
  return {
    fontScale: clampFontScale(input?.fontScale ?? DEFAULT_ACCESSIBILITY_SETTINGS.fontScale),
    darkMode: Boolean(input?.darkMode),
    dyslexiaMode: Boolean(input?.dyslexiaMode),
    textSpacing: Boolean(input?.textSpacing),
    screenReader: Boolean(input?.screenReader),
    highlightClickable: Boolean(input?.highlightClickable),
    reduceMotion: Boolean(input?.reduceMotion),
  }
}

export interface PhysicalAccessibility {
  hasRamp: boolean
  hasElevator: boolean
  accessibleBathroom: boolean
  tactileFloor: boolean
  wideDoor: boolean
  wheelchairParking: boolean
  stepsCount: number
  rampInclination: string
}

export interface AccessibilityMapData {
  accessibleRoutes: string[]
  adaptedSidewalks: string[]
  obstacleStreets: string[]
  accessibleLocations: string[]
}

export const PHYSICAL_ACCESSIBILITY_ITEMS: Array<{ key: keyof Omit<PhysicalAccessibility, 'stepsCount' | 'rampInclination'>; label: string }> = [
  { key: 'hasRamp', label: 'Tem rampa' },
  { key: 'hasElevator', label: 'Tem elevador' },
  { key: 'accessibleBathroom', label: 'Banheiro acessivel' },
  { key: 'tactileFloor', label: 'Piso tatil' },
  { key: 'wideDoor', label: 'Porta larga' },
  { key: 'wheelchairParking', label: 'Vaga para cadeirante' },
]

export function getAvailableAccessibilityLabels(data: PhysicalAccessibility): string[] {
  return PHYSICAL_ACCESSIBILITY_ITEMS.filter((item) => data[item.key]).map((item) => item.label)
}

export function getAccessibilitySummary(data: PhysicalAccessibility): string {
  const availableCount = getAvailableAccessibilityLabels(data).length
  const stepSummary = data.stepsCount === 0 ? 'sem degraus' : `${data.stepsCount} degrau${data.stepsCount === 1 ? '' : 's'}`

  return `${availableCount} recurso${availableCount === 1 ? '' : 's'} acessiveis • ${stepSummary}`
}
