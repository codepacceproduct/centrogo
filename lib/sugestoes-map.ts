import type { MapPoint } from '@/services/mapbox'

export type SuggestionDeliveryType = 'publico' | 'privado'
export type SuggestionCategory = 'seguranca' | 'infraestrutura' | 'eventos' | 'limpeza' | 'iluminacao' | 'mobilidade' | 'outros'
export type SuggestionStatus = 'pendente' | 'em_analise' | 'aprovado' | 'em_execucao' | 'resolvido' | 'rejeitado'
export type SuggestionAuthorType = 'populacao' | 'lojista' | 'empresa_evento'
export type SuggestionSortMode = 'mais_votadas' | 'recentes'

export interface SuggestionAuthor {
  nome: string
  tipo: SuggestionAuthorType
}

export interface SuggestionLocation extends MapPoint {
  endereco: string
}

export interface Suggestion {
  id: string
  titulo: string
  descricao: string
  tipo_envio: SuggestionDeliveryType
  categoria: SuggestionCategory
  autor: SuggestionAuthor
  anonimo: boolean
  localizacao: SuggestionLocation | null
  imagens: string[]
  status: SuggestionStatus
  upvotes: number
  downvotes: number
  comentarios: number
  prioridade_score: number
  created_at: string
}

export const suggestionsChannel = {
  route: '/sugestoes',
  descricao: 'Canal de melhorias e sugestoes para o Centro de Aracaju (CentroGO)',
  objetivo_estrategico: [
    'Coletar feedback da populacao, lojistas e organizadores de eventos',
    'Gerar inteligencia urbana baseada em dados reais',
    'Aumentar engajamento e senso de pertencimento ao centro',
    'Criar backlog estruturado para decisoes publicas e privadas',
  ],
  tipos_envio: [
    { tipo: 'publico' as const, descricao: 'Sugestao visivel para todos (feed comunitario)' },
    { tipo: 'privado' as const, descricao: 'Sugestao confidencial enviada apenas para administracao' },
  ],
  estrutura_banco: {
    tabela: 'sugestoes_centro',
    fields: [
      { nome: 'id', tipo: 'uuid', primary: true },
      { nome: 'titulo', tipo: 'text' },
      { nome: 'descricao', tipo: 'text' },
      { nome: 'tipo_envio', tipo: 'enum(publico,privado)' },
      { nome: 'categoria', tipo: 'enum(seguranca,infraestrutura,eventos,limpeza,iluminacao,mobilidade,outros)' },
      { nome: 'autor_nome', tipo: 'text', nullable: true },
      { nome: 'autor_tipo', tipo: 'enum(populacao,lojista,empresa_evento)' },
      { nome: 'anonimo', tipo: 'boolean', default: false },
      { nome: 'localizacao_lat', tipo: 'decimal', nullable: true },
      { nome: 'localizacao_lng', tipo: 'decimal', nullable: true },
      { nome: 'endereco_referencia', tipo: 'text', nullable: true },
      { nome: 'imagens', tipo: 'json[]', nullable: true },
      { nome: 'status', tipo: 'enum(pendente,em_analise,aprovado,em_execucao,resolvido,rejeitado)', default: 'pendente' },
      { nome: 'prioridade_score', tipo: 'integer', default: 0 },
      { nome: 'upvotes', tipo: 'integer', default: 0 },
      { nome: 'downvotes', tipo: 'integer', default: 0 },
      { nome: 'comentarios_count', tipo: 'integer', default: 0 },
      { nome: 'created_at', tipo: 'timestamp' },
      { nome: 'updated_at', tipo: 'timestamp' },
    ],
  },
  regras_negocio: [
    'Sugestoes publicas aparecem em feed aberto com interacao',
    'Sugestoes privadas ficam visiveis apenas para admin',
    'Sugestoes podem ser anonimas',
    'Sistema de votacao aumenta prioridade automaticamente',
    'Sugestoes com alta densidade geografica geram hotspots',
    'Admin pode mudar status e responder',
    "Empresas podem marcar sugestoes como oportunidade de patrocinio",
  ],
  integracoes: {
    mapa: {
      descricao: 'Sugestoes aparecem como pins no mapa',
      cores: {
        seguranca: '#FF4D4D',
        infraestrutura: '#FFA500',
        eventos: '#4CAF50',
        limpeza: '#00BCD4',
        iluminacao: '#FFD700',
        mobilidade: '#9C27B0',
        outros: '#64748B',
      },
    },
  },
  api_endpoints: [
    { method: 'POST', route: '/api/sugestoes/create' },
    { method: 'GET', route: '/api/sugestoes/list' },
    { method: 'GET', route: '/api/sugestoes/:id' },
    { method: 'PATCH', route: '/api/sugestoes/:id/status' },
    { method: 'POST', route: '/api/sugestoes/:id/vote' },
    { method: 'POST', route: '/api/sugestoes/:id/comment' },
  ],
  diferencial_estrategico: [
    'Transforma reclamacao em dado estruturado',
    'Cria inteligencia urbana em tempo real',
    'Conecta populacao + poder publico + lojistas',
    'Base para decisoes e investimentos no centro',
    'Ativa engajamento continuo (nao pontual)',
  ],
  gamificacao: {
    usuario: [
      'Ganha pontos ao enviar sugestoes',
      'Ganha mais pontos se sugestao for aprovada',
      'Ranking de cidadaos ativos',
      'Badge: Agente do Centro',
    ],
    lojistas: [
      'Podem responder sugestoes',
      'Podem patrocinar melhorias',
      'Badge: Lojista Engajado',
    ],
  },
} as const

export const suggestionCategoryLabels: Record<SuggestionCategory, string> = {
  seguranca: 'Seguranca',
  infraestrutura: 'Infraestrutura',
  eventos: 'Eventos',
  limpeza: 'Limpeza',
  iluminacao: 'Iluminacao',
  mobilidade: 'Mobilidade',
  outros: 'Outros',
}

export const suggestionStatusLabels: Record<SuggestionStatus, string> = {
  pendente: 'Pendente',
  em_analise: 'Em analise',
  aprovado: 'Aprovado',
  em_execucao: 'Em execucao',
  resolvido: 'Resolvido',
  rejeitado: 'Rejeitado',
}

export const suggestionAuthorTypeLabels: Record<SuggestionAuthorType, string> = {
  populacao: 'Populacao',
  lojista: 'Lojista',
  empresa_evento: 'Empresa/Evento',
}

export const suggestionCategoryColors = suggestionsChannel.integracoes.mapa.cores

export const suggestionStatusTone: Record<SuggestionStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pendente: 'outline',
  em_analise: 'secondary',
  aprovado: 'default',
  em_execucao: 'secondary',
  resolvido: 'default',
  rejeitado: 'destructive',
}

export const mockCurrentSuggestionUser: SuggestionAuthor = {
  nome: 'Carlos Mendes',
  tipo: 'populacao',
}

export const suggestionImpactThresholds = {
  trendingVotes: 50,
  trendingPriority: 90,
}

export const mockSuggestions: Suggestion[] = [
  {
    id: 'sug_001',
    titulo: 'Melhorar iluminacao no Calcadao Joao Pessoa',
    descricao: 'Trecho com pouca iluminacao a noite, aumentando sensacao de inseguranca.',
    tipo_envio: 'publico',
    categoria: 'iluminacao',
    autor: {
      nome: 'Carlos Mendes',
      tipo: 'populacao',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Calcadao Joao Pessoa, Centro, Aracaju',
      lat: -10.91079,
      lng: -37.04924,
    },
    imagens: [],
    status: 'em_analise',
    upvotes: 34,
    downvotes: 3,
    comentarios: 12,
    prioridade_score: 78,
    created_at: '2026-03-20T14:32:00Z',
  },
  {
    id: 'sug_002',
    titulo: 'Mais seguranca no Mercado Municipal',
    descricao: 'Aumentar presenca da guarda municipal principalmente no periodo da tarde.',
    tipo_envio: 'publico',
    categoria: 'seguranca',
    autor: {
      nome: 'Ana Souza',
      tipo: 'lojista',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Mercado Municipal Antonio Franco, Centro, Aracaju',
      lat: -10.909735,
      lng: -37.052103,
    },
    imagens: [],
    status: 'pendente',
    upvotes: 51,
    downvotes: 4,
    comentarios: 20,
    prioridade_score: 92,
    created_at: '2026-03-21T09:10:00Z',
  },
  {
    id: 'sug_003',
    titulo: 'Criar eventos culturais semanais na Praca Fausto Cardoso',
    descricao: 'Atrair mais fluxo de pessoas com musica ao vivo e feiras gastronomicas.',
    tipo_envio: 'publico',
    categoria: 'eventos',
    autor: {
      nome: 'EventoMix Producoes',
      tipo: 'empresa_evento',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Praca Fausto Cardoso, Centro, Aracaju',
      lat: -10.911245,
      lng: -37.048012,
    },
    imagens: [],
    status: 'aprovado',
    upvotes: 87,
    downvotes: 6,
    comentarios: 33,
    prioridade_score: 140,
    created_at: '2026-03-19T18:00:00Z',
  },
  {
    id: 'sug_004',
    titulo: 'Reforma das calcadas na Rua Laranjeiras',
    descricao: 'Calcadas irregulares dificultam circulacao e acessibilidade.',
    tipo_envio: 'publico',
    categoria: 'infraestrutura',
    autor: {
      nome: 'Marcos Oliveira',
      tipo: 'populacao',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Rua Laranjeiras, Centro, Aracaju',
      lat: -10.91223,
      lng: -37.0471,
    },
    imagens: [],
    status: 'em_execucao',
    upvotes: 62,
    downvotes: 2,
    comentarios: 18,
    prioridade_score: 110,
    created_at: '2026-03-18T11:45:00Z',
  },
  {
    id: 'sug_005',
    titulo: 'Instalar Wi-Fi publico no centro',
    descricao: 'Melhorar conectividade para lojistas e visitantes.',
    tipo_envio: 'privado',
    categoria: 'infraestrutura',
    autor: {
      nome: 'Empresa TechLink',
      tipo: 'empresa_evento',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Centro Comercial de Aracaju',
      lat: -10.911,
      lng: -37.0485,
    },
    imagens: [],
    status: 'pendente',
    upvotes: 0,
    downvotes: 0,
    comentarios: 0,
    prioridade_score: 0,
    created_at: '2026-03-22T08:20:00Z',
  },
  {
    id: 'sug_006',
    titulo: 'Mais lixeiras nas ruas do centro',
    descricao: 'Falta de lixeiras contribui para sujeira nas vias.',
    tipo_envio: 'publico',
    categoria: 'limpeza',
    autor: {
      nome: 'Juliana Santos',
      tipo: 'populacao',
    },
    anonimo: false,
    localizacao: {
      endereco: 'Av. Joao Ribeiro, Centro, Aracaju',
      lat: -10.9102,
      lng: -37.0503,
    },
    imagens: [],
    status: 'em_analise',
    upvotes: 29,
    downvotes: 1,
    comentarios: 9,
    prioridade_score: 65,
    created_at: '2026-03-21T16:05:00Z',
  },
]

export const defaultSuggestionCenter: MapPoint = {
  lat: -10.9111,
  lng: -37.0492,
}

export function getSuggestionCategoryLabel(category: SuggestionCategory) {
  return suggestionCategoryLabels[category]
}

export function getSuggestionStatusLabel(status: SuggestionStatus) {
  return suggestionStatusLabels[status]
}

export function getSuggestionAuthorTypeLabel(type: SuggestionAuthorType) {
  return suggestionAuthorTypeLabels[type]
}

export function isSuggestionTrending(suggestion: Suggestion) {
  return (
    suggestion.upvotes >= suggestionImpactThresholds.trendingVotes ||
    suggestion.prioridade_score >= suggestionImpactThresholds.trendingPriority
  )
}

export function formatSuggestionDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function sortSuggestions(suggestions: Suggestion[], mode: SuggestionSortMode) {
  return [...suggestions].sort((a, b) => {
    if (mode === 'mais_votadas') {
      if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes
      return b.prioridade_score - a.prioridade_score
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

