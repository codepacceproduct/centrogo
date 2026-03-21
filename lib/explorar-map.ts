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
  lat: -10.9109,
  lng: -37.0518,
}

const RAW_LOCATIONS: RawExplorarLocation[] = [
  {
    id: 'loc_001',
    nome: 'Mercado Municipal Antonio Franco',
    categoria: 'comercio',
    descricao:
      'Principal mercado tradicional de Aracaju, com forte fluxo turistico e gastronomico.',
    lat: -10.907383,
    lng: -37.048808,
    fluxo: 'alto',
    tipo_publico: ['turistas', 'moradores'],
    horario_funcionamento: '06:00 - 17:00',
    peso_gamificacao: 10,
  },
  {
    id: 'loc_002',
    nome: 'Mercado Thales Ferraz',
    categoria: 'comercio',
    descricao:
      'Extensao do mercado municipal com foco em alimentos regionais.',
    lat: -10.906553,
    lng: -37.048831,
    fluxo: 'alto',
    tipo_publico: ['moradores'],
    horario_funcionamento: '06:00 - 17:00',
    peso_gamificacao: 9,
  },
  {
    id: 'loc_003',
    nome: 'Mercado Albano Franco',
    categoria: 'comercio',
    descricao: 'Area com venda de carnes e produtos frescos.',
    lat: -10.904722,
    lng: -37.048889,
    fluxo: 'alto',
    tipo_publico: ['moradores'],
    horario_funcionamento: '05:30 - 16:00',
    peso_gamificacao: 8,
  },
  {
    id: 'loc_004',
    nome: 'Calcadao Joao Pessoa',
    categoria: 'comercio',
    descricao:
      'Principal eixo comercial do centro com alto fluxo de pedestres.',
    lat: -10.91079,
    lng: -37.04924,
    fluxo: 'muito_alto',
    tipo_publico: ['moradores', 'trabalhadores'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 10,
  },
  {
    id: 'loc_005',
    nome: 'Calcadao Laranjeiras',
    categoria: 'comercio',
    descricao: 'Area comercial com lojas populares e servicos.',
    lat: -10.911508,
    lng: -37.057458,
    fluxo: 'alto',
    tipo_publico: ['moradores'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 9,
  },
  {
    id: 'loc_006',
    nome: 'Praca Fausto Cardoso',
    categoria: 'turismo',
    descricao: 'Praca historica com predios governamentais ao redor.',
    lat: -10.913274,
    lng: -37.049201,
    fluxo: 'medio',
    tipo_publico: ['turistas', 'trabalhadores'],
    horario_funcionamento: 'Livre',
    peso_gamificacao: 7,
  },
  {
    id: 'loc_007',
    nome: 'Palacio Museu Olimpio Campos',
    categoria: 'turismo',
    descricao: 'Museu historico no centro da cidade.',
    lat: -10.912828,
    lng: -37.049339,
    fluxo: 'medio',
    tipo_publico: ['turistas'],
    horario_funcionamento: '09:00 - 17:00',
    peso_gamificacao: 6,
  },
  {
    id: 'loc_008',
    nome: 'Catedral Metropolitana de Aracaju',
    categoria: 'turismo',
    descricao: 'Principal igreja da cidade.',
    lat: -10.913372,
    lng: -37.050975,
    fluxo: 'medio',
    tipo_publico: ['turistas', 'religioso'],
    horario_funcionamento: '07:00 - 19:00',
    peso_gamificacao: 7,
  },
  {
    id: 'loc_009',
    nome: 'Terminal do Centro',
    categoria: 'mobilidade',
    descricao: 'Principal ponto de transporte publico urbano.',
    lat: -10.90881,
    lng: -37.05224,
    fluxo: 'muito_alto',
    tipo_publico: ['trabalhadores'],
    horario_funcionamento: '05:00 - 23:00',
    peso_gamificacao: 10,
  },
  {
    id: 'loc_009a',
    nome: 'Estacionamento Fausto Cardoso',
    categoria: 'mobilidade',
    descricao: 'Estacionamento rotativo proximo a Praca Fausto Cardoso, com acesso rapido aos predios historicos e servicos do centro.',
    lat: -10.91305,
    lng: -37.04972,
    fluxo: 'alto',
    tipo_publico: ['motoristas', 'trabalhadores', 'turistas'],
    horario_funcionamento: '07:00 - 19:00',
    peso_gamificacao: 8,
  },
  {
    id: 'loc_009b',
    nome: 'Estacionamento General Valadao',
    categoria: 'mobilidade',
    descricao: 'Ponto de apoio para quem acessa bancos, comercio popular e servicos no entorno da Praca General Valadao.',
    lat: -10.90961,
    lng: -37.04858,
    fluxo: 'alto',
    tipo_publico: ['motoristas', 'trabalhadores'],
    horario_funcionamento: '06:30 - 18:30',
    peso_gamificacao: 8,
  },
  {
    id: 'loc_009c',
    nome: 'Estacionamento Rua Laranjeiras',
    categoria: 'mobilidade',
    descricao: 'Estacionamento privado com boa cobertura para quem vai ao calcadao e ao comercio popular.',
    lat: -10.91118,
    lng: -37.05532,
    fluxo: 'medio',
    tipo_publico: ['motoristas', 'moradores'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 7,
  },
  {
    id: 'loc_010',
    nome: 'Rua Joao Pessoa (Zona Bancaria)',
    categoria: 'servicos',
    descricao:
      'Area com grande concentracao de bancos e servicos financeiros.',
    lat: -10.90906,
    lng: -37.04919,
    fluxo: 'alto',
    tipo_publico: ['trabalhadores'],
    horario_funcionamento: '09:00 - 16:00',
    peso_gamificacao: 8,
  },
  {
    id: 'loc_011',
    nome: 'Praca General Valadao',
    categoria: 'turismo',
    descricao: 'Praca central com fluxo intenso e comercio informal.',
    lat: -10.909348,
    lng: -37.048802,
    fluxo: 'alto',
    tipo_publico: ['moradores'],
    horario_funcionamento: 'Livre',
    peso_gamificacao: 8,
  },
  {
    id: 'loc_012',
    nome: 'Rua Laranjeiras (Comercio Popular)',
    categoria: 'comercio',
    descricao: 'Regiao com grande densidade de lojas populares.',
    lat: -10.91139,
    lng: -37.05647,
    fluxo: 'muito_alto',
    tipo_publico: ['moradores'],
    horario_funcionamento: '08:00 - 18:00',
    peso_gamificacao: 10,
  },
  {
    id: 'loc_013',
    nome: 'Shopping Jardins (influencia indireta)',
    categoria: 'referencia',
    descricao:
      'Ponto externo relevante para comparacao de fluxo comercial.',
    lat: -10.943026,
    lng: -37.05949,
    fluxo: 'alto',
    tipo_publico: ['classe_media'],
    horario_funcionamento: '10:00 - 22:00',
    peso_gamificacao: 5,
  },
  {
    id: 'loc_014',
    nome: 'Orla do Bairro Industrial',
    categoria: 'turismo',
    descricao:
      'Area proxima ao centro com potencial turistico e gastronomico.',
    lat: -10.90795,
    lng: -37.04615,
    fluxo: 'medio',
    tipo_publico: ['turistas', 'moradores'],
    horario_funcionamento: 'Livre',
    peso_gamificacao: 7,
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

function buildExplorarLocation(
  location: RawExplorarLocation,
): ExplorarLocation {
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
  .filter(
    (location) =>
      location.fluxo !== 'muito_alto' && location.categoria !== 'referencia',
  )
  .sort(sortByScore)
  .slice(0, 4)





export const parkingExplorarLocations = [...explorarLocations]
  .filter((location) =>
    location.categoria === 'mobilidade' && location.nome.toLowerCase().includes('estacionamento'),
  )
  .sort(sortByScore)
