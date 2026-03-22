// CentroVivo Aracaju - dados mockados do Centro
import type { AccessibilityMapData, PhysicalAccessibility } from './accessibility'

export function isStoreOpen(openHour: number, closeHour: number): boolean {
  const now = new Date()
  const currentHour = now.getHours()
  return currentHour >= openHour && currentHour < closeHour
}

function getSeedFromText(seed?: string): number {
  if (!seed) return Math.random()

  return seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

export function getRandomDistance(seed?: string): string {
  const distances = [50, 80, 120, 150, 200, 250, 300, 350, 400, 450]
  const seedValue = getSeedFromText(seed)
  const distance = distances[seed ? seedValue % distances.length : Math.floor(seedValue * distances.length)]
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance}m`
}

export function getRandomVisitors(seed?: string): number {
  const seedValue = getSeedFromText(seed)
  return seed ? 20 + (seedValue % 150) : Math.floor(seedValue * 150) + 20
}

export function getRandomAttendees(seed?: string): number {
  const seedValue = getSeedFromText(seed)
  return seed ? 30 + (seedValue % 200) : Math.floor(seedValue * 200) + 30
}

export interface User {
  id: string
  name: string
  firstName: string
  avatar: string
  city: string
  level: string
  levelNumber: number
  points: number
  pointsToNextLevel: number
  achievements: Achievement[]
  history: HistoryItem[]
  preferences: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

export interface HistoryItem {
  id: string
  action: string
  points: number
  date: string
  type: 'earned' | 'spent'
}

export const currentUser: User = {
  id: '1',
  name: 'Joao Santos',
  firstName: 'Joao',
  avatar: '/images/avatar-joao.jpg',
  city: 'Aracaju, SE',
  level: 'Explorador',
  levelNumber: 3,
  points: 750,
  pointsToNextLevel: 1000,
  achievements: [
    { id: '1', name: 'Primeiro check-in', description: 'Fez seu primeiro check-in em um evento do Centro', icon: '📍', unlocked: true, unlockedDate: '2026-03-10' },
    { id: '2', name: 'Circuito cultural', description: 'Visitou 3 pontos turisticos do Centro', icon: '🏛️', unlocked: true, unlockedDate: '2026-03-14' },
    { id: '3', name: 'Cliente frequente', description: 'Passou por 5 lojas do Centro', icon: '🛍️', unlocked: true, unlockedDate: '2026-03-18' },
    { id: '4', name: 'Guia local', description: 'Explorou pontos historicos e comerciais do bairro', icon: '🗺️', unlocked: false },
    { id: '5', name: 'Curador do Centro', description: 'Avaliou experiencias do bairro Centro', icon: '⭐', unlocked: false },
  ],
  history: [
    { id: '1', action: 'Check-in na Feirinha da Praca Tobias Barreto', points: 50, date: '2026-03-20', type: 'earned' },
    { id: '2', action: 'Resgate de cupom na Loja Moda Centro', points: -120, date: '2026-03-19', type: 'spent' },
    { id: '3', action: 'Visita ao Museu da Gente Sergipana', points: 40, date: '2026-03-18', type: 'earned' },
    { id: '4', action: 'Avaliacao das Oticas Diniz', points: 20, date: '2026-03-17', type: 'earned' },
  ],
  preferences: ['Lojas', 'Mercados', 'Farmacias'],
}

export type StoreGroup = 'lojas' | 'mercados' | 'farmacias' | 'servicos'

export interface Store {
  id: string
  name: string
  category: string
  categoryIcon: string
  group: StoreGroup
  groupLabel: string
  subcategory: string
  subcategoryLabel: string
  color: string
  image: string
  rating: number
  reviewCount: number
  address: string
  neighborhood: string
  latitude: number
  longitude: number
  openHour: number
  closeHour: number
  phone: string
  description: string
  highlights: Product[]
  hasPromotion: boolean
  promotionText?: string
  loyaltyPoints: number
  physicalAccessibility: PhysicalAccessibility
  accessibilityMap: AccessibilityMapData
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
}

export const stores: Store[] = [
  {
    id: 'store_001',
    name: 'Loja Moda Centro',
    category: 'Lojas',
    categoryIcon: 'LJ',
    group: 'lojas',
    groupLabel: 'Lojas',
    subcategory: 'moda',
    subcategoryLabel: 'Moda casual',
    color: '#FF6B6B',
    image: '/images/lojamoda.png',
    rating: 4.3,
    reviewCount: 112,
    address: 'Calcadao da Rua Laranjeiras, 210 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9141,
    longitude: -37.0497,
    openHour: 9,
    closeHour: 18,
    phone: '(79) 3211-4500',
    description: 'Loja de moda localizada no eixo comercial do Centro, com pecas casuais e atendimento rapido.',
    highlights: [
      { id: '1', name: 'Camisa de linho', price: 89.9, image: '/images/lojamoda.png' },
      { id: '2', name: 'Bolsa urbana', price: 119.9, image: '/images/lojamoda.png' },
    ],
    hasPromotion: true,
    promotionText: 'Colecao do Centro com 15% OFF em compras acima de R$ 200',
    loyaltyPoints: 60,
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: true,
      tactileFloor: true,
      wideDoor: true,
      wheelchairParking: false,
      stepsCount: 0,
      rampInclination: 'Suave (8%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Calcadao da Rua Laranjeiras', 'Travessa Jose de Faro'],
      adaptedSidewalks: ['Frente comercial com piso regular', 'Esquina com faixa rebaixada'],
      obstacleStreets: ['Trecho com fluxo intenso na Rua Joao Pessoa'],
      accessibleLocations: ['Entrada principal', 'Caixa adaptado', 'Provador acessivel'],
    },
  },
  {
    id: 'market_001',
    name: 'Restaurante Popular do Mercado',
    category: 'Mercados',
    categoryIcon: 'MC',
    group: 'mercados',
    groupLabel: 'Mercados',
    subcategory: 'gastronomia',
    subcategoryLabel: 'Gastronomia regional',
    color: '#27AE60',
    image: '/img-explorar/restaurantepopular.jpg',
    rating: 4.5,
    reviewCount: 186,
    address: 'Mercado Municipal Antonio Franco - Centro',
    neighborhood: 'Centro',
    latitude: -10.9142,
    longitude: -37.0477,
    openHour: 8,
    closeHour: 15,
    phone: '(79) 3212-3001',
    description: 'Operacao gastronomica popular dentro do mercado, com pratos regionais e alto fluxo turistico.',
    highlights: [
      { id: '1', name: 'Prato executivo sergipano', price: 24.9, image: '/img-explorar/restaurantepopular.jpg' },
      { id: '2', name: 'Suco regional', price: 8.9, image: '/img-explorar/restaurantepopular.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Combo almoco do mercado com sobremesa inclusa',
    loyaltyPoints: 80,
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: true,
      tactileFloor: false,
      wideDoor: true,
      wheelchairParking: true,
      stepsCount: 1,
      rampInclination: 'Moderada (10%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Acesso lateral do Mercado Antonio Franco', 'Travessia sinalizada da Av. Coelho e Campos'],
      adaptedSidewalks: ['Entrada com guia rebaixada', 'Corredor central amplo'],
      obstacleStreets: ['Boxes com pico de fluxo no horario do almoco'],
      accessibleLocations: ['Praca de alimentacao', 'Banheiro acessivel', 'Area de apoio'],
    },
  },
  {
    id: 'service_001',
    name: 'Oticas Diniz',
    category: 'Servicos',
    categoryIcon: 'SV',
    group: 'servicos',
    groupLabel: 'Servicos',
    subcategory: 'optica',
    subcategoryLabel: 'Otica e cuidados visuais',
    color: '#F39C12',
    image: '/img-centro/oticasdiniz.png',
    rating: 4.6,
    reviewCount: 94,
    address: 'Rua Itabaianinha, 145 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9139,
    longitude: -37.0492,
    openHour: 9,
    closeHour: 19,
    phone: '(79) 3213-8890',
    description: 'Otica com grande variedade de oculos, lentes e acessorios visuais no coracao do Centro comercial de Aracaju.',
    highlights: [
      { id: '1', name: 'Oculos de grau completo', price: 199.9, image: '/img-centro/oticasdiniz.png' },
      { id: '2', name: 'Lentes de contato mensais', price: 89.9, image: '/img-centro/oticasdiniz.png' },
    ],
    hasPromotion: true,
    promotionText: 'Armacao gratis na compra de lentes de grau',
    loyaltyPoints: 50,
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: false,
      tactileFloor: false,
      wideDoor: true,
      wheelchairParking: false,
      stepsCount: 0,
      rampInclination: 'Suave (7%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Rua Itabaianinha com acesso lateral', 'Travessa com menor fluxo de veiculos'],
      adaptedSidewalks: ['Trecho frontal nivelado', 'Guia rebaixada na esquina mais proxima'],
      obstacleStreets: ['Trecho estreito no horario comercial'],
      accessibleLocations: ['Recepcao principal', 'Area de atendimento'],
    },
  },
  {
    id: 'pharma_001',
    name: 'Livraria Escariz',
    category: 'Lojas',
    categoryIcon: 'LV',
    group: 'lojas',
    groupLabel: 'Lojas',
    subcategory: 'livraria',
    subcategoryLabel: 'Livraria e papelaria',
    color: '#8B5CF6',
    image: '/images/livraria-leitura.jpg',
    rating: 4.7,
    reviewCount: 203,
    address: 'Rua Pacatuba, 98 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9137,
    longitude: -37.0493,
    openHour: 8,
    closeHour: 18,
    phone: '(79) 3214-1020',
    description: 'Livraria classica do Centro de Aracaju com vasto acervo de livros, papelaria fina e atendimento especializado.',
    highlights: [
      { id: '1', name: 'Livros nacionais e importados', price: 49.9, image: '/images/livraria-leitura.jpg' },
      { id: '2', name: 'Kit papelaria premium', price: 28.9, image: '/images/livraria-leitura.jpg' },
    ],
    hasPromotion: true,
    promotionText: '20% OFF em livros selecionados e papelaria',
    loyaltyPoints: 60,
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: true,
      tactileFloor: true,
      wideDoor: true,
      wheelchairParking: true,
      stepsCount: 0,
      rampInclination: 'Suave (6%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Rua Pacatuba com travessia rebaixada', 'Ligacao acessivel pela Rua Laranjeiras'],
      adaptedSidewalks: ['Faixa livre sinalizada', 'Entrada com piso regular'],
      obstacleStreets: ['Trecho com carga e descarga em horario comercial'],
      accessibleLocations: ['Balcao preferencial', 'Banheiro acessivel', 'Area de leitura'],
    },
  },
]

export interface StoreFilterCategory {
  id: StoreGroup
  name: string
  icon: string
  color: string
  markerColor: string
}

export const storeSubcategoryFilters: Record<StoreGroup, Array<{ id: string; name: string }>> = {
  lojas: [{ id: 'moda', name: 'Moda casual' }],
  mercados: [{ id: 'gastronomia', name: 'Gastronomia regional' }],
  farmacias: [{ id: 'farmacia', name: 'Farmacia 24 horas' }],
  servicos: [{ id: 'optica', name: 'Otica e cuidados visuais' }],
}

export const storesGeoJson = {
  type: 'FeatureCollection' as const,
  features: stores.map((store) => ({
    type: 'Feature' as const,
    properties: {
      id: store.id,
      nome: store.name,
      categoria: store.group,
      cor: store.color,
      grupo: store.group,
      subcategoria: store.subcategory,
      endereco: store.address,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [store.longitude, store.latitude] as [number, number],
    },
  })),
}

export interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
  location: string
  category: string
  categoryTag: string
  isHappening: boolean
  nearbyStores: string[]
  physicalAccessibility: PhysicalAccessibility
  accessibilityMap: AccessibilityMapData
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Feirinha da Praca Tobias Barreto',
    description: 'Feira de domingo com gastronomia, pequenos produtores e clima de encontro no Centro de Aracaju.',
    image: '/images/feirinha.jpg',
    date: '2026-03-22',
    time: '16:00',
    location: 'Praca Tobias Barreto - Centro',
    category: 'Gastronomia',
    categoryTag: 'Feira de Rua',
    isHappening: true,
    nearbyStores: ['market_001', 'store_001'],
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: true,
      tactileFloor: false,
      wideDoor: true,
      wheelchairParking: false,
      stepsCount: 0,
      rampInclination: 'Suave (5%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Acesso principal pela Praca Tobias Barreto', 'Trecho plano vindo da Av. Ivo do Prado'],
      adaptedSidewalks: ['Calcada ampliada no entorno da praca', 'Faixa rebaixada na entrada principal'],
      obstacleStreets: ['Trecho com mesas e fluxo intenso durante o pico da feira'],
      accessibleLocations: ['Palco central', 'Area de alimentacao acessivel', 'Ponto de apoio com banheiro'],
    },
  },
  {
    id: '2',
    title: 'Programacao do Museu da Gente Sergipana',
    description: 'Agenda cultural com exposicoes, visitas mediadas e atividades sobre a memoria sergipana.',
    image: '/img-explorar/museudagentesergipana.jpg',
    date: '2026-03-27',
    time: '10:00',
    location: 'Museu da Gente Sergipana',
    category: 'Cultura',
    categoryTag: 'Museu',
    isHappening: false,
    nearbyStores: ['store_001', 'pharma_001'],
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: true,
      accessibleBathroom: true,
      tactileFloor: true,
      wideDoor: true,
      wheelchairParking: true,
      stepsCount: 0,
      rampInclination: 'Suave (4%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Acesso pela Av. Ivo do Prado', 'Percurso assistido pelo calcadao lateral do museu'],
      adaptedSidewalks: ['Piso regular no entorno do museu', 'Entrada sinalizada com faixa rebaixada'],
      obstacleStreets: ['Trecho com parada rapida de veiculos turisticos'],
      accessibleLocations: ['Bilheteria', 'Elevador interno', 'Banheiro acessivel', 'Exposicao terrea'],
    },
  },
  {
    id: '3',
    title: 'Feiras Gastronomicas nos Mercados',
    description: 'Circuito de sabores regionais nos mercados do Centro, com boxes, pratos tipicos e produtos locais.',
    image: '/images/evento-gastronomia.jpg',
    date: '2026-03-29',
    time: '11:00',
    location: 'Mercado Municipal Antonio Franco',
    category: 'Gastronomia',
    categoryTag: 'Circuito Regional',
    isHappening: false,
    nearbyStores: ['market_001', 'service_001'],
    physicalAccessibility: {
      hasRamp: true,
      hasElevator: false,
      accessibleBathroom: true,
      tactileFloor: false,
      wideDoor: true,
      wheelchairParking: true,
      stepsCount: 1,
      rampInclination: 'Moderada (9%)',
    },
    accessibilityMap: {
      accessibleRoutes: ['Entrada acessivel pelo portao lateral do mercado', 'Corredor principal com menor inclinacao'],
      adaptedSidewalks: ['Calcada rebaixada na frente do mercado', 'Corredor central com largura ampliada'],
      obstacleStreets: ['Setor de carga e descarga no fundo do mercado'],
      accessibleLocations: ['Boxes principais', 'Area de refeicao', 'Banheiro acessivel'],
    },
  },
]

export interface Category {
  id: StoreGroup
  name: string
  icon: string
  color: string
  markerColor: string
}

export const categories: Category[] = [
  { id: 'lojas', name: 'Lojas', icon: 'LJ', color: 'bg-rose-100 text-rose-700', markerColor: '#FF6B6B' },
  { id: 'mercados', name: 'Mercados', icon: 'MC', color: 'bg-emerald-100 text-emerald-700', markerColor: '#27AE60' },
  { id: 'farmacias', name: 'Farmacias', icon: 'FM', color: 'bg-sky-100 text-sky-700', markerColor: '#3498DB' },
  { id: 'servicos', name: 'Servicos', icon: 'SV', color: 'bg-amber-100 text-amber-700', markerColor: '#F39C12' },
]

export interface Reward {
  id: string
  title: string
  description: string
  storeName: string
  storeId: string
  pointsCost: number
  image: string
  expiresAt: string
}

export const rewards: Reward[] = [
  {
    id: '1',
    title: 'Combo almoco do mercado',
    description: 'Valido para prato principal e bebida no Restaurante Popular do Mercado',
    storeName: 'Restaurante Popular do Mercado',
    storeId: 'market_001',
    pointsCost: 280,
    image: '/images/cafe-sergipano.jpg',
    expiresAt: '2026-04-15',
  },
  {
    id: '2',
    title: '15% OFF em moda urbana',
    description: 'Desconto em pecas selecionadas da Loja Moda Centro',
    storeName: 'Loja Moda Centro',
    storeId: 'store_001',
    pointsCost: 320,
    image: '/images/boutique-atalaia.jpg',
    expiresAt: '2026-04-10',
  },
  {
    id: '3',
    title: 'Desconto em oculos de grau',
    description: '20% OFF em armacoes selecionadas nas Oticas Diniz do Centro',
    storeName: 'Oticas Diniz',
    storeId: 'service_001',
    pointsCost: 220,
    image: '/img-centro/oticasdiniz.png',
    expiresAt: '2026-04-18',
  },
]

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'promo' | 'event' | 'reward' | 'points'
}

export const notifications: Notification[] = [
  { id: '1', title: 'Evento confirmado', message: 'A Feirinha da Praca Tobias Barreto comeca as 16h no Centro', time: '10 min', read: false, type: 'event' },
  { id: '2', title: 'Promocao ativa', message: 'Loja Moda Centro liberou desconto na colecao da semana', time: '35 min', read: false, type: 'promo' },
  { id: '3', title: 'Pontos creditados', message: 'Voce ganhou 40 pontos ao visitar o Museu da Gente Sergipana', time: '1h', read: true, type: 'points' },
]

export interface DiscoverySuggestion {
  id: string
  title: string
  description: string
  image: string
  type: 'store' | 'experience'
  rating: number
}

export const discoverySuggestions: DiscoverySuggestion[] = [
  {
    id: '1',
    title: 'Museu da Gente Sergipana',
    description: 'Museu interativo a beira do Rio Sergipe com experiencias ligadas a cultura e identidade local.',
    image: '/img-centro/museudagentesergipana.jpg',
    type: 'experience',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Mercado Municipal Antonio Franco',
    description: 'Mercado historico com gastronomia, artesanato e fluxo constante de moradores e visitantes.',
    image: '/images/cafe-sergipano.jpg',
    type: 'experience',
    rating: 4.5,
  },
  {
    id: '3',
    title: 'Palacio Museu Olimpio Campos',
    description: 'Patrimonio historico da Praca Fausto Cardoso com visita guiada e conteudo sobre a historia sergipana.',
    image: '/img-centro/colinasantoantonio.jpg',
    type: 'experience',
    rating: 4.6,
  },
  {
    id: '4',
    title: 'Projeto Verao Aracaju',
    description: 'Grande festival de verao na orla com shows, atrações e muita agitação na beira-mar de Aracaju.',
    image: '/img-centro/projetoveraoaracaju.jpg',
    type: 'experience',
    rating: 4.4,
  },
  {
    id: '5',
    title: 'Centro de Artesanato Chica Chaves',
    description: 'Espaco dedicado ao artesanato sergipano com pecas unicas, cultura local e producao dos artesaos do estado.',
    image: '/img-centro/centrodeartesanatochicachaves.jpg',
    type: 'experience',
    rating: 4.3,
  },
]

export const levels = [
  { level: 1, name: 'Iniciante', minPoints: 0, maxPoints: 200 },
  { level: 2, name: 'Curioso', minPoints: 200, maxPoints: 500 },
  { level: 3, name: 'Explorador', minPoints: 500, maxPoints: 1000 },
  { level: 4, name: 'Conhecedor', minPoints: 1000, maxPoints: 2000 },
  { level: 5, name: 'Expert do Centro', minPoints: 2000, maxPoints: 5000 },
  { level: 6, name: 'Embaixador', minPoints: 5000, maxPoints: Infinity },
]

export function getUserLevel(points: number) {
  return levels.find((level) => points >= level.minPoints && points < level.maxPoints) || levels[0]
}


