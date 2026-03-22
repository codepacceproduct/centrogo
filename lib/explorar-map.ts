import type { MapPoint } from '@/services/mapbox'

export type ExplorarFluxo = 'muito_alto' | 'alto' | 'medio' | 'baixo'
export type ExplorarCategoria =
  | 'comercio'
  | 'turismo'
  | 'mobilidade'
  | 'servicos'
  | 'referencia'

export interface ExplorarLocation extends MapPoint {
  id: string
  nome: string
  categoria: ExplorarCategoria
  descricao: string
  fluxo: ExplorarFluxo
  tipoPublico: string[]
  horarioFuncionamento: string
  pesoGamificacao: number
  multiplicadorFluxo: number
  score: number
  categoryLabel: string
  flowLabel: string
  badge: string
  audienceLabel: string
  image?: string
}

interface RawExplorarLocation extends MapPoint {
  id: string
  nome: string
  categoria: ExplorarCategoria
  descricao: string
  fluxo: ExplorarFluxo
  tipo_publico: string[]
  horario_funcionamento: string
  peso_gamificacao: number
  image?: string
}

const FLUXO_MULTIPLIERS: Record<ExplorarFluxo, number> = {
  muito_alto: 1.5,
  alto: 1.2,
  medio: 1.0,
  baixo: 0.7,
}

const CATEGORY_LABELS: Record<ExplorarCategoria, string> = {
  comercio: 'Comercio',
  turismo: 'Turismo',
  mobilidade: 'Mobilidade',
  servicos: 'Servicos',
  referencia: 'Referencia',
}

const FLOW_LABELS: Record<ExplorarFluxo, string> = {
  muito_alto: 'Fluxo muito alto',
  alto: 'Fluxo alto',
  medio: 'Fluxo medio',
  baixo: 'Fluxo baixo',
}

export const DEFAULT_EXPLORAR_CENTER: MapPoint = {
  lat: -10.914,
  lng: -37.0489,
}

const RAW_LOCATIONS: RawExplorarLocation[] = [
  {
    id: 'loc_001',
    nome: 'Museu da Gente Sergipana',
    categoria: 'turismo',
    descricao: 'Museu interativo que ancora o circuito cultural do Centro de Aracaju.',
    lat: -10.91756,
    lng: -37.04766,
    fluxo: 'alto',
    tipo_publico: ['turistas', 'estudantes', 'moradores'],
    horario_funcionamento: '10:00 - 15:00',
    peso_gamificacao: 10,
    image: '/img-explorar/museudagentesergipana.jpg',
  },
  {
    id: 'loc_002',
    nome: 'Mercado Municipal Antonio Franco',
    categoria: 'comercio',
    descricao: 'Mercado tradicional com gastronomia, boxes populares e fluxo diario no Centro.',
    lat: -10.9142,
    lng: -37.0477,
    fluxo: 'muito_alto',
    tipo_publico: ['turistas', 'moradores', 'trabalhadores'],
    horario_funcionamento: '06:00 - 17:00',
    peso_gamificacao: 10,
    image: '/img-explorar/Mercado-Municipal-Antonio-Franco-980x653.jpg',
  },
  {
    id: 'loc_003',
    nome: 'Palacio Museu Olimpio Campos',
    categoria: 'turismo',
    descricao: 'Patrimonio historico na Praca Fausto Cardoso, ideal para roteiros culturais.',
    lat: -10.9135,
    lng: -37.0495,
    fluxo: 'medio',
    tipo_publico: ['turistas', 'estudantes'],
    horario_funcionamento: '09:00 - 17:00',
    peso_gamificacao: 8,
    image: '/img-centro/colinasantoantonio.jpg',
  },
  {
    id: 'loc_004',
    nome: 'Ponte do Imperador',
    categoria: 'turismo',
    descricao: 'Ponto turistico classico do Centro, conectado ao circuito historico e ao rio.',
    lat: -10.9149,
    lng: -37.0469,
    fluxo: 'medio',
    tipo_publico: ['turistas', 'moradores'],
    horario_funcionamento: 'Aberto 24h',
    peso_gamificacao: 7,
    image: '/img-centro/orladeatalaia.jpg',
  },
  {
    id: 'loc_005',
    nome: 'Calcadao da Rua Laranjeiras',
    categoria: 'comercio',
    descricao: 'Corredor comercial com lojas populares, servicos e alta circulacao durante o dia.',
    lat: -10.914,
    lng: -37.0498,
    fluxo: 'muito_alto',
    tipo_publico: ['moradores', 'trabalhadores', 'compradores'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 10,
    image: '/img-explorar/calcadaodarualaranjeiras.jpg',
  },
  {
    id: 'loc_006',
    nome: 'Praca Tobias Barreto',
    categoria: 'referencia',
    descricao: 'Ponto de encontro usado por feiras e ativacoes culturais no Centro.',
    lat: -10.9138,
    lng: -37.0489,
    fluxo: 'alto',
    tipo_publico: ['moradores', 'visitantes', 'familias'],
    horario_funcionamento: 'Aberto 24h',
    peso_gamificacao: 8,
    image: '/img-explorar/pracatobiasbarreto.jpg',
  },
  {
    id: 'loc_007',
    nome: 'Restaurante Popular do Mercado',
    categoria: 'servicos',
    descricao: 'Operacao gastronomica ligada ao Mercado Antonio Franco, com grande fluxo no almoco.',
    lat: -10.9142,
    lng: -37.0477,
    fluxo: 'alto',
    tipo_publico: ['trabalhadores', 'moradores', 'turistas'],
    horario_funcionamento: '08:00 - 15:00',
    peso_gamificacao: 7,
    image: '/img-explorar/restaurantepopular.jpg',
  },
  {
    id: 'loc_008',
    nome: 'Terminal do Centro',
    categoria: 'mobilidade',
    descricao: 'Nodo de mobilidade que alimenta o fluxo diario do bairro Centro.',
    lat: -10.90881,
    lng: -37.05224,
    fluxo: 'muito_alto',
    tipo_publico: ['trabalhadores', 'moradores'],
    horario_funcionamento: '05:00 - 23:00',
    peso_gamificacao: 9,
    image: '/img-explorar/terminaldocentro.jpg',
  },
  {
    id: 'loc_009',
    nome: 'Oticas Diniz',
    categoria: 'servicos',
    descricao: 'Otica com grande variedade de oculos, lentes e acessorios visuais no coracao do Centro.',
    lat: -10.9139,
    lng: -37.0492,
    fluxo: 'medio',
    tipo_publico: ['moradores', 'trabalhadores'],
    horario_funcionamento: '09:00 - 19:00',
    peso_gamificacao: 6,
    image: '/img-centro/oticasdiniz.png',
  },
  {
    id: 'loc_010',
    nome: 'Livraria Escariz',
    categoria: 'servicos',
    descricao: 'Livraria classica do Centro com acervo de livros, papelaria e atendimento especializado.',
    lat: -10.9137,
    lng: -37.0493,
    fluxo: 'alto',
    tipo_publico: ['moradores', 'estudantes', 'visitantes'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 7,
    image: '/images/livraria-leitura.jpg',
  },
]

function capitalize(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function buildAudienceLabel(audience: string[]) {
  return audience.map(capitalize).join(' + ')
}

function buildBadge(location: RawExplorarLocation) {
  if (location.fluxo === 'muito_alto') {
    return 'Hotspot urbano'
  }

  if (location.categoria === 'turismo') {
    return 'Circuito turistico'
  }

  if (location.categoria === 'mobilidade') {
    return 'No de mobilidade'
  }

  return 'Ponto estrategico'
}

function buildExplorarLocation(location: RawExplorarLocation): ExplorarLocation {
  const multiplicadorFluxo = FLUXO_MULTIPLIERS[location.fluxo]
  const score = Number((location.peso_gamificacao * multiplicadorFluxo).toFixed(1))

  return {
    id: location.id,
    nome: location.nome,
    categoria: location.categoria,
    descricao: location.descricao,
    lat: location.lat,
    lng: location.lng,
    fluxo: location.fluxo,
    tipoPublico: location.tipo_publico,
    horarioFuncionamento: location.horario_funcionamento,
    pesoGamificacao: location.peso_gamificacao,
    multiplicadorFluxo,
    score,
    categoryLabel: CATEGORY_LABELS[location.categoria],
    flowLabel: FLOW_LABELS[location.fluxo],
    badge: buildBadge(location),
    audienceLabel: buildAudienceLabel(location.tipo_publico),
    image: location.image,
  }
}

function sortByScore(a: ExplorarLocation, b: ExplorarLocation) {
  if (b.score !== a.score) {
    return b.score - a.score
  }

  return b.pesoGamificacao - a.pesoGamificacao
}

export function formatLocationScore(score: number) {
  return `${score.toFixed(1)} pts`
}

export const explorarLocations = RAW_LOCATIONS.map(buildExplorarLocation)

export const featuredExplorarLocations = [...explorarLocations]
  .sort(sortByScore)
  .slice(0, 6)

export const hiddenExplorarLocations = [...explorarLocations]
  .filter((location) => location.fluxo !== 'muito_alto' && location.categoria !== 'referencia')
  .sort(sortByScore)
  .slice(0, 4)

export const parkingExplorarLocations = [...explorarLocations]
  .filter((location) => location.categoria === 'mobilidade' && location.nome.toLowerCase().includes('terminal'))
  .sort(sortByScore)