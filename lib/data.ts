// CentroGO Aracaju - Dados Mockados Inteligentes

// Funções utilitárias para simulação dinâmica
export function isStoreOpen(openHour: number, closeHour: number): boolean {
  const now = new Date()
  const currentHour = now.getHours()
  return currentHour >= openHour && currentHour < closeHour
}

export function getRandomDistance(): string {
  const distances = [50, 80, 120, 150, 200, 250, 300, 350, 400, 450]
  const distance = distances[Math.floor(Math.random() * distances.length)]
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance}m`
}

export function getRandomVisitors(): number {
  return Math.floor(Math.random() * 150) + 20
}

export function getRandomAttendees(): number {
  return Math.floor(Math.random() * 200) + 30
}

// Tipo do Usuário
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
  name: 'João Santos',
  firstName: 'João',
  avatar: '/images/avatar-joao.jpg',
  city: 'Aracaju, SE',
  level: 'Explorador',
  levelNumber: 3,
  points: 750,
  pointsToNextLevel: 1000,
  achievements: [
    { id: '1', name: 'Primeiro Check-in', description: 'Fez seu primeiro check-in em um evento', icon: '🎯', unlocked: true, unlockedDate: '2024-01-15' },
    { id: '2', name: 'Cliente Frequente', description: 'Visitou 10 lojas diferentes', icon: '🏆', unlocked: true, unlockedDate: '2024-02-20' },
    { id: '3', name: 'Experiência Gastronômica', description: 'Avaliou 5 restaurantes', icon: '🍽️', unlocked: true, unlockedDate: '2024-03-10' },
    { id: '4', name: 'Explorador Cultural', description: 'Participou de 5 eventos culturais', icon: '🎭', unlocked: false },
    { id: '5', name: 'Acumulador de Pontos', description: 'Resgatou 10 recompensas', icon: '💎', unlocked: false },
    { id: '6', name: 'Lenda do Centro', description: 'Convidou 5 amigos', icon: '👥', unlocked: false },
  ],
  history: [
    { id: '1', action: 'Check-in no Forró Caju', points: 50, date: '2026-03-18', type: 'earned' },
    { id: '2', action: 'Resgate de Cupom - Mercado Municipal Antônio Franco', points: -200, date: '2026-03-17', type: 'spent' },
    { id: '3', action: 'Avaliação - Restaurante Cariri', points: 30, date: '2026-03-15', type: 'earned' },
    { id: '4', action: 'Visita ao Centro de Artesanato Chica Chaves', points: 20, date: '2026-03-14', type: 'earned' },
    { id: '5', action: 'Check-in na Feirinha da Orla de Atalaia', points: 50, date: '2026-03-12', type: 'earned' },
  ],
  preferences: ['Lojas', 'Mercados', 'Farmacias']
}

// Tipos de Loja
export type StoreGroup = 'lojas' | 'shoppings' | 'mercados' | 'farmacias' | 'servicos'

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
    name: 'Passo Forte Calcados',
    category: 'Lojas',
    categoryIcon: '??',
    group: 'lojas',
    groupLabel: 'Lojas',
    subcategory: 'sapatos',
    subcategoryLabel: 'Lojas de sapatos',
    color: '#FF4D4D',
    image: '/img-centro/oticasdiniz.png',
    rating: 4.8,
    reviewCount: 124,
    address: 'Rua Joao Pessoa, 182 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9107,
    longitude: -37.0492,
    openHour: 8,
    closeHour: 18,
    phone: '(79) 3211-1234',
    description: 'Loja mockada com calcados casuais e sociais para o fluxo comercial do centro de Aracaju.',
    highlights: [
      { id: '1', name: 'Sapato social couro', price: 189.9, image: '/img-centro/oticasdiniz.png' },
      { id: '2', name: 'Tenis urbano leve', price: 149.9, image: '/img-centro/oticasdiniz.png' },
    ],
    hasPromotion: true,
    promotionText: '15% OFF na segunda unidade',
    loyaltyPoints: 60
  },
  {
    id: 'store_002',
    name: 'Conecta Cell Centro',
    category: 'Lojas',
    categoryIcon: '??',
    group: 'lojas',
    groupLabel: 'Lojas',
    subcategory: 'celulares',
    subcategoryLabel: 'Lojas de celulares',
    color: '#FF4D4D',
    image: '/images/boutique-atalaia.jpg',
    rating: 4.7,
    reviewCount: 98,
    address: 'Rua Laranjeiras, 244 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9115,
    longitude: -37.0485,
    openHour: 8,
    closeHour: 18,
    phone: '(79) 3212-5678',
    description: 'Loja mockada de celulares, acessorios e manutencao rapida no coracao comercial da cidade.',
    highlights: [
      { id: '1', name: 'Smartphone 128GB', price: 1399.9, image: '/images/boutique-atalaia.jpg' },
      { id: '2', name: 'Fone bluetooth', price: 129.9, image: '/images/boutique-atalaia.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Peliculas gratis na compra do aparelho',
    loyaltyPoints: 80
  },
  {
    id: 'store_003',
    name: 'Vitrine dos Pes',
    category: 'Lojas',
    categoryIcon: '???',
    group: 'lojas',
    groupLabel: 'Lojas',
    subcategory: 'sapatos',
    subcategoryLabel: 'Lojas de sapatos',
    color: '#FF4D4D',
    image: '/img-centro/centrodeartesanatochicachaves.jpg',
    rating: 4.6,
    reviewCount: 76,
    address: 'Rua Itabaianinha, 91 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9102,
    longitude: -37.0478,
    openHour: 9,
    closeHour: 18,
    phone: '(79) 3213-9012',
    description: 'Operacao mockada voltada a calcados femininos e linha casual, pensada para o polo do centro.',
    highlights: [
      { id: '1', name: 'Sandalia comfort', price: 99.9, image: '/img-centro/centrodeartesanatochicachaves.jpg' },
      { id: '2', name: 'Mocassim urbano', price: 169.9, image: '/img-centro/centrodeartesanatochicachaves.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 55
  },
  {
    id: 'mall_001',
    name: 'Shopping Centro Aracaju',
    category: 'Shoppings',
    categoryIcon: '??',
    group: 'shoppings',
    groupLabel: 'Shoppings',
    subcategory: 'centro-comercial',
    subcategoryLabel: 'Centro comercial',
    color: '#8E44AD',
    image: '/images/caranguejo-sergipano.jpg',
    rating: 4.7,
    reviewCount: 210,
    address: 'Praca Fausto Cardoso, 55 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9095,
    longitude: -37.0489,
    openHour: 9,
    closeHour: 20,
    phone: '(79) 3214-3456',
    description: 'Galeria mockada com mix de lojas, servicos e operacoes de conveniencia no Centro de Aracaju.',
    highlights: [
      { id: '1', name: 'Praca de servicos', price: 0, image: '/images/caranguejo-sergipano.jpg' },
      { id: '2', name: 'Vagas rotativas', price: 12, image: '/images/caranguejo-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Campanha de vitrine ativa nesta semana',
    loyaltyPoints: 70
  },
  {
    id: 'mall_002',
    name: 'Galeria Comercial Sergipe',
    category: 'Shoppings',
    categoryIcon: '??',
    group: 'shoppings',
    groupLabel: 'Shoppings',
    subcategory: 'galeria',
    subcategoryLabel: 'Galeria comercial',
    color: '#8E44AD',
    image: '/images/livraria-leitura.jpg',
    rating: 4.6,
    reviewCount: 142,
    address: 'Rua Santa Rosa, 118 - Centro',
    neighborhood: 'Centro',
    latitude: -10.911,
    longitude: -37.05,
    openHour: 8,
    closeHour: 19,
    phone: '(79) 3215-7890',
    description: 'Galeria mockada com operacoes de varejo rapido e servicos de apoio para o fluxo do centro.',
    highlights: [
      { id: '1', name: 'Mix de boxes', price: 0, image: '/images/livraria-leitura.jpg' },
      { id: '2', name: 'Acesso coberto', price: 0, image: '/images/livraria-leitura.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 40
  },
  {
    id: 'market_001',
    name: 'Mercado Popular Central',
    category: 'Mercados',
    categoryIcon: '??',
    group: 'mercados',
    groupLabel: 'Mercados',
    subcategory: 'mercado-popular',
    subcategoryLabel: 'Mercado popular',
    color: '#27AE60',
    image: '/img-centro/oticasdiniz.png',
    rating: 4.5,
    reviewCount: 188,
    address: 'Av. Coelho e Campos, 310 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9115,
    longitude: -37.051,
    openHour: 7,
    closeHour: 18,
    phone: '(79) 3216-1234',
    description: 'Mercado mockado com alimentos, utilidades e boxes de apoio ao consumidor do centro.',
    highlights: [
      { id: '1', name: 'Cesta basica expressa', price: 49.9, image: '/img-centro/oticasdiniz.png' },
      { id: '2', name: 'Kit limpeza', price: 22.9, image: '/img-centro/oticasdiniz.png' },
    ],
    hasPromotion: true,
    promotionText: 'Desconto progressivo em compras acima de R$ 80',
    loyaltyPoints: 60
  },
  {
    id: 'market_002',
    name: 'Mini Mercado Aracaju',
    category: 'Mercados',
    categoryIcon: '??',
    group: 'mercados',
    groupLabel: 'Mercados',
    subcategory: 'mini-mercado',
    subcategoryLabel: 'Mini mercado',
    color: '#27AE60',
    image: '/images/emporio-nordeste.jpg',
    rating: 4.6,
    reviewCount: 133,
    address: 'Rua Pacatuba, 73 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9122,
    longitude: -37.0475,
    openHour: 8,
    closeHour: 19,
    phone: '(79) 3218-9012',
    description: 'Mercado de bairro mockado, pratico para compras rapidas no eixo comercial do centro.',
    highlights: [
      { id: '1', name: 'Mercearia rapida', price: 18, image: '/images/emporio-nordeste.jpg' },
      { id: '2', name: 'Combo cafe da manha', price: 24.9, image: '/images/emporio-nordeste.jpg' },
    ],
    hasPromotion: true,
    promotionText: '10% OFF em itens de conveniencia',
    loyaltyPoints: 50
  },
  {
    id: 'pharma_001',
    name: 'Farmacia Vida+',
    category: 'Farmacias',
    categoryIcon: '??',
    group: 'farmacias',
    groupLabel: 'Farmacias',
    subcategory: 'farmacia',
    subcategoryLabel: 'Farmacia',
    color: '#3498DB',
    image: '/images/cafe-sergipano.jpg',
    rating: 4.8,
    reviewCount: 154,
    address: 'Rua Capela, 201 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9108,
    longitude: -37.0503,
    openHour: 7,
    closeHour: 22,
    phone: '(79) 3220-4100',
    description: 'Farmacia mockada com mix de medicamentos, higiene e atendimento rapido para o centro.',
    highlights: [
      { id: '1', name: 'Kit primeiros socorros', price: 39.9, image: '/images/cafe-sergipano.jpg' },
      { id: '2', name: 'Vitaminas essenciais', price: 27.9, image: '/images/cafe-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Ate 20% OFF em higiene pessoal',
    loyaltyPoints: 65
  },
  {
    id: 'pharma_002',
    name: 'Drogaria Central AJU',
    category: 'Farmacias',
    categoryIcon: '??',
    group: 'farmacias',
    groupLabel: 'Farmacias',
    subcategory: 'drogaria',
    subcategoryLabel: 'Drogaria',
    color: '#3498DB',
    image: '/images/livraria-leitura.jpg',
    rating: 4.5,
    reviewCount: 117,
    address: 'Rua Itaporanga, 66 - Centro',
    neighborhood: 'Centro',
    latitude: -10.9099,
    longitude: -37.048,
    openHour: 7,
    closeHour: 21,
    phone: '(79) 3220-4200',
    description: 'Drogaria mockada com atendimento estendido e linha de conveniencia para quem circula no centro.',
    highlights: [
      { id: '1', name: 'Fraldas e higiene', price: 59.9, image: '/images/livraria-leitura.jpg' },
      { id: '2', name: 'Dermocosmeticos', price: 84.9, image: '/images/livraria-leitura.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 55
  },
  {
    id: 'service_001',
    name: 'Banco Regional Sergipe',
    category: 'Servicos',
    categoryIcon: '??',
    group: 'servicos',
    groupLabel: 'Servicos',
    subcategory: 'bancos',
    subcategoryLabel: 'Bancos',
    color: '#F39C12',
    image: '/images/boutique-atalaia.jpg',
    rating: 4.3,
    reviewCount: 96,
    address: 'Praca General Valadao, 27 - Centro',
    neighborhood: 'Centro',
    latitude: -10.912,
    longitude: -37.0483,
    openHour: 9,
    closeHour: 16,
    phone: '(79) 3221-1000',
    description: 'Agencia bancaria mockada para representar os servicos financeiros mais procurados no centro.',
    highlights: [
      { id: '1', name: 'Caixa eletronico 24h', price: 0, image: '/images/boutique-atalaia.jpg' },
      { id: '2', name: 'Atendimento PJ', price: 0, image: '/images/boutique-atalaia.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 35
  },
  {
    id: 'service_002',
    name: 'Prefeitura Centro Atendimento',
    category: 'Servicos',
    categoryIcon: '???',
    group: 'servicos',
    groupLabel: 'Servicos',
    subcategory: 'prefeitura',
    subcategoryLabel: 'Prefeitura',
    color: '#F39C12',
    image: '/img-centro/projetoveraoaracaju.jpg',
    rating: 4.4,
    reviewCount: 88,
    address: 'Rua Propria, 45 - Centro',
    neighborhood: 'Centro',
    latitude: -10.91,
    longitude: -37.0507,
    openHour: 8,
    closeHour: 17,
    phone: '(79) 3221-2000',
    description: 'Ponto mockado de atendimento municipal para concentrar servicos publicos no mapa do centro.',
    highlights: [
      { id: '1', name: 'Protocolo digital', price: 0, image: '/img-centro/projetoveraoaracaju.jpg' },
      { id: '2', name: 'Atendimento cadastral', price: 0, image: '/img-centro/projetoveraoaracaju.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 30
  }
]

export interface StoreFilterCategory {
  id: StoreGroup
  name: string
  icon: string
  color: string
  markerColor: string
}

export const storeSubcategoryFilters: Record<StoreGroup, Array<{ id: string; name: string }>> = {
  lojas: [
    { id: 'sapatos', name: 'Lojas de sapatos' },
    { id: 'celulares', name: 'Lojas de celulares' },
  ],
  shoppings: [
    { id: 'centro-comercial', name: 'Centro comercial' },
    { id: 'galeria', name: 'Galeria comercial' },
  ],
  mercados: [
    { id: 'mercado-popular', name: 'Mercado popular' },
    { id: 'mini-mercado', name: 'Mini mercado' },
  ],
  farmacias: [
    { id: 'farmacia', name: 'Farmacia' },
    { id: 'drogaria', name: 'Drogaria' },
  ],
  servicos: [
    { id: 'prefeitura', name: 'Prefeitura' },
    { id: 'bancos', name: 'Bancos' },
  ],
}

export const storesGeoJson = {
  type: 'FeatureCollection' as const,
  features: stores.map((store) => ({
    type: 'Feature' as const,
    properties: {
      id: store.id,
      nome: store.name,
      categoria: store.group.slice(0, -1),
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

// Tipos de Evento
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
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Forró Caju',
    description: 'Um dos eventos juninos mais tradicionais de Aracaju, com shows, quadrilhas e culinária típica sergipana.',
    image: '/img-centro/forrocaju.jpg',
    date: '2026-06-21',
    time: '19:00',
    location: 'Praça Hilton Lopes',
    category: 'Música',
    categoryTag: 'Forró ao Vivo',
    isHappening: true,
    nearbyStores: ['store_001', 'store_003']
  },
  {
    id: '2',
    title: 'Feirinha da Orla de Atalaia',
    description: 'Feira com artesanato, gastronomia e produtos regionais na orla, reunindo expositores e artistas locais.',
    image: '/images/evento-feira-artesanato.jpg',
    date: '2026-04-06',
    time: '08:00',
    location: 'Orla de Atalaia',
    category: 'Cultura',
    categoryTag: 'Artesanato',
    isHappening: false,
    nearbyStores: ['store_003', 'mall_002']
  },
  {
    id: '3',
    title: 'Festival de Caranguejo da Orla',
    description: 'Circuito gastronômico com pratos de frutos do mar e culinária regional em restaurantes da orla de Aracaju.',
    image: '/images/evento-gastronomia.jpg',
    date: '2026-05-11',
    time: '18:00',
    location: 'Orla de Atalaia',
    category: 'Gastronomia',
    categoryTag: 'Festival Gastronômico',
    isHappening: false,
    nearbyStores: ['market_001', 'mall_001']
  },
  {
    id: '4',
    title: 'Pré-Caju',
    description: 'Micareta tradicional de Aracaju com grandes atrações nacionais e blocos na Orla da Atalaia.',
    image: '/img-centro/precaju.jpg',
    date: '2026-11-08',
    time: '20:00',
    location: 'Orla da Atalaia',
    category: 'Música',
    categoryTag: 'Micareta',
    isHappening: false,
    nearbyStores: ['store_002', 'market_002']
  },
  {
    id: '5',
    title: 'Projeto Verão Aracaju',
    description: 'Programação de verão com esporte, música e atividades culturais na praia e na orla da cidade.',
    image: '/img-centro/projetoveraoaracaju.jpg',
    date: '2026-01-18',
    time: '16:00',
    location: 'Orla de Atalaia',
    category: 'Cultura',
    categoryTag: 'Verão',
    isHappening: false,
    nearbyStores: ['mall_002', 'store_003']
  },
  {
    id: '6',
    title: 'Natal Iluminado de Aracaju',
    description: 'Evento natalino com decoração temática, atrações culturais e apresentações musicais no centro da cidade.',
    image: '/img-centro/nataliluminado.jpg',
    date: '2026-12-15',
    time: '19:30',
    location: 'Centro de Aracaju',
    category: 'Cultura',
    categoryTag: 'Natal',
    isHappening: false,
    nearbyStores: ['market_001', 'mall_001']
  }
]

// Categorias
export interface Category {
  id: StoreGroup
  name: string
  icon: string
  color: string
  markerColor: string
}

export const categories: Category[] = [
  { id: 'lojas', name: 'Lojas', icon: 'LJ', color: 'bg-rose-100 text-rose-700', markerColor: '#FF4D4D' },
  { id: 'shoppings', name: 'Shoppings', icon: 'SH', color: 'bg-violet-100 text-violet-700', markerColor: '#8E44AD' },
  { id: 'mercados', name: 'Mercados', icon: 'MC', color: 'bg-emerald-100 text-emerald-700', markerColor: '#27AE60' },
  { id: 'farmacias', name: 'Farmacias', icon: 'FM', color: 'bg-sky-100 text-sky-700', markerColor: '#3498DB' },
  { id: 'servicos', name: 'Servicos', icon: 'SV', color: 'bg-amber-100 text-amber-700', markerColor: '#F39C12' },
]

// Recompensas
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
    title: '10% de desconto',
    description: 'Válido em qualquer produto da loja',
    storeName: 'Mercado Popular Central',
    storeId: 'market_001',
    pointsCost: 300,
    image: '/images/cafe-sergipano.jpg',
    expiresAt: '2024-04-30'
  },
  {
    id: '2',
    title: 'Sobremesa Grátis',
    description: 'Na compra de qualquer prato principal',
    storeName: 'Shopping Centro Aracaju',
    storeId: 'mall_001',
    pointsCost: 500,
    image: '/images/caranguejo-sergipano.jpg',
    expiresAt: '2024-04-15'
  },
  {
    id: '3',
    title: '15% OFF em Óculos',
    description: 'Desconto em armações selecionadas',
    storeName: 'Óticas Diniz Centro',
    storeId: '6',
    pointsCost: 400,
    image: '/img-centro/oticasdiniz.png',
    expiresAt: '2024-05-01'
  },
  {
    id: '5',
    title: 'Livro Sergipano de Brinde',
    description: 'Livro de autor local na compra acima de R$50',
    storeName: 'Galeria Comercial Sergipe',
    storeId: 'mall_002',
    pointsCost: 350,
    image: '/images/livraria-leitura.jpg',
    expiresAt: '2024-04-25'
  }
]

// Notificações
export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'promo' | 'event' | 'reward' | 'points'
}

export const notifications: Notification[] = [
  { id: '1', title: 'Novo evento!', message: 'Forró Caju começa às 19h hoje', time: '10 min', read: false, type: 'event' },
  { id: '2', title: 'Promoção relâmpago!', message: 'Mercado Antônio Franco com ofertas especiais agora', time: '30 min', read: false, type: 'promo' },
  { id: '3', title: 'Parabéns!', message: 'Você ganhou 50 pontos', time: '1h', read: true, type: 'points' },
]

// Sugestões de descoberta
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
    description: 'Museu interativo à beira do Rio Sergipe com experiências sobre a cultura e identidade sergipana',
    image: '/img-centro/museudagentesergipana.jpg',
    type: 'experience',
    rating: 4.9
  },
  {
    id: '2',
    title: 'Orla de Atalaia',
    description: 'Cartão-postal de Aracaju com passarela, feiras, espaços culturais e ótimas opções de gastronomia',
    image: '/img-centro/orladeatalaia.jpg',
    type: 'experience',
    rating: 4.7
  },
  {
    id: '3',
    title: 'Colina do Santo Antônio',
    description: 'Área histórica com vista da cidade e do rio, ideal para conhecer a formação urbana de Aracaju',
    image: '/img-centro/colinasantoantonio.jpg',
    type: 'experience',
    rating: 4.8
  },
]

// Níveis do sistema de gamificação
export const levels = [
  { level: 1, name: 'Iniciante', minPoints: 0, maxPoints: 200 },
  { level: 2, name: 'Curioso', minPoints: 200, maxPoints: 500 },
  { level: 3, name: 'Explorador', minPoints: 500, maxPoints: 1000 },
  { level: 4, name: 'Conhecedor', minPoints: 1000, maxPoints: 2000 },
  { level: 5, name: 'Expert do Centro', minPoints: 2000, maxPoints: 5000 },
  { level: 6, name: 'Embaixador', minPoints: 5000, maxPoints: Infinity },
]

export function getUserLevel(points: number) {
  return levels.find(l => points >= l.minPoints && points < l.maxPoints) || levels[0]
}


