export type EventMapCategory = 'show' | 'cultural' | 'religioso' | 'corporativo'

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
    data: string
    horario: string
    preco: string
    atracoes: string[]
    endereco: string
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
  data: string
  horario: string
  preco: string
  atracoes: string[]
  endereco: string
  longitude: number
  latitude: number
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
  { id: 'religioso', label: 'Religioso' },
  { id: 'corporativo', label: 'Corporativo' },
]

export function normalizeEventGeoJson(geoJson: EventGeoJson): EventMapItem[] {
  return geoJson.features.map((feature) => ({
    id: feature.properties.id,
    nome: feature.properties.nome,
    categoria: feature.properties.categoria,
    descricao: feature.properties.descricao,
    data: feature.properties.data,
    horario: feature.properties.horario,
    preco: feature.properties.preco,
    atracoes: feature.properties.atracoes,
    endereco: feature.properties.endereco,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }))
}
