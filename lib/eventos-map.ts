import type { AccessibilityMapData, PhysicalAccessibility } from '@/lib/accessibility'

export type EventMapCategory = 'show' | 'cultural' | 'festival' | 'religioso' | 'corporativo'

export type AmbulanteType = 'comida' | 'bebida' | string

export type AmbulanteGeoJson = {
  id: string
  nome: string
  tipo: AmbulanteType
  descricao: string
  lat: number
  lng: number
  especialidade: string[]
  horario: string
  precoMedio: string
  destaque: boolean
  avaliacao?: number
  numeroVendas?: number
  rankingEvento?: number
  heatmapScore?: number
}

export type AmbulanteMapItem = AmbulanteGeoJson & {
  eventId: string
  eventNome: string
  latitude: number
  longitude: number
}

export type EventGeoJson = {
  type: 'FeatureCollection'
  features: EventGeoJsonFeature[]
}

export type EventGeoJsonFeature = {
  type: 'Feature'
  properties: {
    id: string
    nome: string
    categoria: EventMapCategory
    descricao: string
    dataInicio: string
    dataFim: string
    horario: string
    endereco: string
    ambulantes: AmbulanteGeoJson[]
    preco?: string
    atracoes?: string[]
    physicalAccessibility: PhysicalAccessibility
    accessibilityMap: AccessibilityMapData
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export type EventMapItem = {
  id: string
  nome: string
  categoria: EventMapCategory
  descricao: string
  dataInicio: string
  dataFim: string
  horario: string
  endereco: string
  longitude: number
  latitude: number
  ambulantes: AmbulanteMapItem[]
  preco?: string
  atracoes: string[]
  physicalAccessibility: PhysicalAccessibility
  accessibilityMap: AccessibilityMapData
}

export const EVENT_CATEGORY_META: Record<
  EventMapCategory,
  {
    label: string
    color: string
    pillClass: string
  }
> = {
  show: {
    label: 'Show',
    color: '#E74C3C',
    pillClass: 'bg-red-100 text-red-700',
  },
  cultural: {
    label: 'Cultural',
    color: '#8E44AD',
    pillClass: 'bg-violet-100 text-violet-700',
  },
  festival: {
    label: 'Festival',
    color: '#F59E0B',
    pillClass: 'bg-amber-100 text-amber-700',
  },
  religioso: {
    label: 'Religioso',
    color: '#3498DB',
    pillClass: 'bg-sky-100 text-sky-700',
  },
  corporativo: {
    label: 'Corporativo',
    color: '#2ECC71',
    pillClass: 'bg-emerald-100 text-emerald-700',
  },
}

export const EVENT_FILTERS: Array<{ id: 'all' | EventMapCategory; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'show', label: 'Show' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'festival', label: 'Festival' },
  { id: 'religioso', label: 'Religioso' },
  { id: 'corporativo', label: 'Corporativo' },
]

export function normalizeEventGeoJson(geoJson: EventGeoJson): EventMapItem[] {
  return geoJson.features.map((feature) => ({
    id: feature.properties.id,
    nome: feature.properties.nome,
    categoria: feature.properties.categoria,
    descricao: feature.properties.descricao,
    dataInicio: feature.properties.dataInicio,
    dataFim: feature.properties.dataFim,
    horario: feature.properties.horario,
    endereco: feature.properties.endereco,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
    ambulantes: feature.properties.ambulantes.map((ambulante) => ({
      ...ambulante,
      eventId: feature.properties.id,
      eventNome: feature.properties.nome,
      latitude: ambulante.lat,
      longitude: ambulante.lng,
    })),
    preco: feature.properties.preco,
    atracoes: feature.properties.atracoes ?? [],
    physicalAccessibility: feature.properties.physicalAccessibility,
    accessibilityMap: feature.properties.accessibilityMap,
  }))
}