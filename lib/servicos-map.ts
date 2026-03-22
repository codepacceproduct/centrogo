export type ServicoCategoria = 'saude' | 'seguranca' | 'financeiro' | 'publico' | 'emergencia'

export type ServicoPublico = {
  id: string
  nome: string
  categoria: ServicoCategoria
  descricao: string
  lat: number
  lng: number
  endereco: string
  telefone: string
  whatsapp: string
  horario: string
  destaque: boolean
}

export type ServicoCategoryMeta = {
  label: string
  color: string
  pillClass: string
}

export const SERVICOS_CATEGORY_META: Record<ServicoCategoria, ServicoCategoryMeta> = {
  saude: {
    label: 'Saúde',
    color: '#DC2626',
    pillClass: 'bg-red-100 text-red-700',
  },
  seguranca: {
    label: 'Segurança',
    color: '#2563EB',
    pillClass: 'bg-blue-100 text-blue-700',
  },
  financeiro: {
    label: 'Financeiro',
    color: '#16A34A',
    pillClass: 'bg-emerald-100 text-emerald-700',
  },
  publico: {
    label: 'Público',
    color: '#6B7280',
    pillClass: 'bg-slate-100 text-slate-700',
  },
  emergencia: {
    label: 'Emergencia',
    color: '#EAB308',
    pillClass: 'bg-yellow-100 text-yellow-800',
  },
}

export const SERVICOS_FILTERS: Array<{ id: 'all' | ServicoCategoria; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'saude', label: 'Saúde' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'publico', label: 'Público' },
  { id: 'emergencia', label: 'Emergencia' },
]

export const servicosPublicos: ServicoPublico[] = [
  {
    id: 'srv_001',
    nome: 'Hospital Nestor Piva',
    categoria: 'saude',
    descricao: 'Unidade de atendimento medico emergencial 24h.',
    lat: -10.9472,
    lng: -37.0731,
    endereco: 'Av. Maranhao, Siqueira Campos, Aracaju',
    telefone: '(79) 3218-2000',
    whatsapp: '5579999990001',
    horario: '24h',
    destaque: true,
  },
  {
    id: 'srv_002',
    nome: 'Delegacia Plantonista Centro',
    categoria: 'seguranca',
    descricao: 'Atendimento policial para ocorrencias e registros.',
    lat: -10.9115,
    lng: -37.0489,
    endereco: 'Centro, Aracaju',
    telefone: '(79) 3205-9400',
    whatsapp: '5579999990002',
    horario: '24h',
    destaque: true,
  },
  {
    id: 'srv_003',
    nome: 'Caixa Economica Federal',
    categoria: 'financeiro',
    descricao: 'Servicos bancarios e atendimento ao publico.',
    lat: -10.9102,
    lng: -37.0501,
    endereco: 'Rua Joao Pessoa, Centro, Aracaju',
    telefone: '(79) 4004-0104',
    whatsapp: '5579999990003',
    horario: '10:00 - 16:00',
    destaque: false,
  },
]

export const DEFAULT_SERVICOS_CENTER = {
  lat: -10.9112,
  lng: -37.0502,
}

export function getDistanceInMeters(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const originLat = toRadians(from.lat)
  const targetLat = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return Math.round(2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000)
}

export function formatDistance(distanceInMeters: number) {
  if (distanceInMeters < 1000) return `${distanceInMeters}m`
  return `${(distanceInMeters / 1000).toFixed(1)}km`
}

export function getWhatsAppHref(whatsapp: string) {
  return `https://wa.me/${whatsapp}`
}

