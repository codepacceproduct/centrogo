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
  preferences: ['Gastronomia', 'Cultura', 'Moda']
}

// Tipos de Loja
export interface Store {
  id: string
  name: string
  category: string
  categoryIcon: string
  image: string
  rating: number
  reviewCount: number
  address: string
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
    id: '1',
    name: 'Mercado Municipal Antônio Franco',
    category: 'Gastronomia',
    categoryIcon: '🍽️',
    image: '/images/cafe-sergipano.jpg',
    rating: 4.8,
    reviewCount: 234,
    address: 'Av. Coelho e Campos, s/n - Centro',
    openHour: 6,
    closeHour: 18,
    phone: '(79) 3211-1234',
    description: 'Mercado tradicional no centro de Aracaju com boxes de comidas típicas, temperos regionais e produtos sergipanos.',
    highlights: [
      { id: '1', name: 'Queijo Coalho Regional', price: 24.90, image: '/images/cafe-sergipano.jpg' },
      { id: '2', name: 'Cuscuz com Carne de Sol', price: 22.90, image: '/images/cafe-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: '15% OFF em produtos regionais selecionados',
    loyaltyPoints: 50
  },
  {
    id: '2',
    name: 'Shopping Jardins Aracaju',
    category: 'Moda',
    categoryIcon: '👗',
    image: '/images/boutique-atalaia.jpg',
    rating: 4.5,
    reviewCount: 156,
    address: 'Av. Ministro Geraldo Barreto Sobral, 215 - Jardins',
    openHour: 10,
    closeHour: 22,
    phone: '(79) 3212-5678',
    description: 'Centro de compras com lojas de moda, serviços e alimentação, referência para compras em Aracaju.',
    highlights: [
      { id: '1', name: 'Coleção Verão 2026', price: 129.90, image: '/images/boutique-atalaia.jpg' },
      { id: '2', name: 'Camisa de Linho Premium', price: 99.90, image: '/images/boutique-atalaia.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Semana da Moda com até 40% OFF',
    loyaltyPoints: 80
  },
  {
    id: '3',
    name: 'Centro de Artesanato Chica Chaves',
    category: 'Cultura',
    categoryIcon: '🎨',
    image: '/img-centro/centrodeartesanatochicachaves.jpg',
    rating: 4.9,
    reviewCount: 89,
    address: 'Av. Ivo do Prado, 398 - Centro',
    openHour: 10,
    closeHour: 18,
    phone: '(79) 3213-9012',
    description: 'Espaço tradicional de artesanato sergipano com renda, cerâmica, madeira e peças autorais de artistas locais.',
    highlights: [
      { id: '1', name: 'Cerâmica Sergipana', price: 75.00, image: '/img-centro/centrodeartesanatochicachaves.jpg' },
      { id: '2', name: 'Renda Irlandesa de Divina Pastora', price: 140.00, image: '/img-centro/centrodeartesanatochicachaves.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 100
  },
  {
    id: '4',
    name: 'Restaurante Cariri',
    category: 'Gastronomia',
    categoryIcon: '🍽️',
    image: '/images/caranguejo-sergipano.jpg',
    rating: 4.7,
    reviewCount: 312,
    address: 'Av. Santos Dumont, 1870 - Atalaia',
    openHour: 11,
    closeHour: 23,
    phone: '(79) 3214-3456',
    description: 'Restaurante tradicional em Aracaju com pratos regionais e culinária nordestina, muito procurado na orla.',
    highlights: [
      { id: '1', name: 'Carne de Sol na Chapa', price: 84.90, image: '/images/caranguejo-sergipano.jpg' },
      { id: '2', name: 'Moqueca Sergipana', price: 94.90, image: '/images/caranguejo-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Sobremesa regional grátis no almoço',
    loyaltyPoints: 70
  },
  {
    id: '5',
    name: 'Livraria Escariz',
    category: 'Serviços',
    categoryIcon: '📚',
    image: '/images/livraria-leitura.jpg',
    rating: 4.6,
    reviewCount: 178,
    address: 'Av. Jorge Amado, 1565 - Jardins',
    openHour: 8,
    closeHour: 20,
    phone: '(79) 3215-7890',
    description: 'Livraria tradicional em Aracaju com amplo acervo, papelaria e espaço para lançamentos e eventos culturais.',
    highlights: [
      { id: '1', name: 'Lançamentos Nacionais', price: 59.90, image: '/images/livraria-leitura.jpg' },
      { id: '2', name: 'Coleção Sergipe em História', price: 49.90, image: '/images/livraria-leitura.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 40
  },
  {
    id: '6',
    name: 'Óticas Diniz Centro',
    category: 'Serviços',
    categoryIcon: '👓',
    image: '/img-centro/oticasdiniz.png',
    rating: 4.4,
    reviewCount: 98,
    address: 'Rua João Pessoa, 214 - Centro',
    openHour: 9,
    closeHour: 18,
    phone: '(79) 3216-1234',
    description: 'Óculos de grau e sol das melhores marcas com atendimento personalizado. Exame de vista gratuito.',
    highlights: [
      { id: '1', name: 'Óculos Ray-Ban', price: 450.00, image: '/img-centro/oticasdiniz.png' },
      { id: '2', name: 'Armação Premium', price: 280.00, image: '/img-centro/oticasdiniz.png' },
    ],
    hasPromotion: true,
    promotionText: '30% OFF na segunda armação',
    loyaltyPoints: 60
  },
  {
    id: '8',
    name: 'Mercado Municipal Thales Ferraz',
    category: 'Gastronomia',
    categoryIcon: '🧀',
    image: '/images/emporio-nordeste.jpg',
    rating: 4.6,
    reviewCount: 167,
    address: 'Av. Coelho e Campos, s/n - Centro',
    openHour: 8,
    closeHour: 19,
    phone: '(79) 3218-9012',
    description: 'Mercado municipal com produtos regionais, carnes, queijos e artigos típicos da culinária sergipana.',
    highlights: [
      { id: '1', name: 'Farinha e Temperos Regionais', price: 18.00, image: '/images/emporio-nordeste.jpg' },
      { id: '2', name: 'Cesta Sergipana', price: 99.90, image: '/images/emporio-nordeste.jpg' },
    ],
    hasPromotion: true,
    promotionText: '10% OFF aos sábados',
    loyaltyPoints: 50
  }
]

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
    nearbyStores: ['1', '3']
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
    nearbyStores: ['3', '5']
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
    nearbyStores: ['1', '4']
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
    nearbyStores: ['2', '8']
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
    nearbyStores: ['5', '3']
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
    nearbyStores: ['1', '4']
  }
]

// Categorias
export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: Category[] = [
  { id: '1', name: 'Gastronomia', icon: '🍽️', color: 'bg-orange-100 text-orange-600' },
  { id: '2', name: 'Moda', icon: '👗', color: 'bg-pink-100 text-pink-600' },
  { id: '3', name: 'Serviços', icon: '🔧', color: 'bg-blue-100 text-blue-600' },
  { id: '4', name: 'Cultura', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
  { id: '5', name: 'Ofertas', icon: '🏷️', color: 'bg-red-100 text-red-600' },
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
    storeName: 'Mercado Municipal Antônio Franco',
    storeId: '1',
    pointsCost: 300,
    image: '/images/cafe-sergipano.jpg',
    expiresAt: '2024-04-30'
  },
  {
    id: '2',
    title: 'Sobremesa Grátis',
    description: 'Na compra de qualquer prato principal',
    storeName: 'Restaurante Cariri',
    storeId: '4',
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
    storeName: 'Livraria Escariz',
    storeId: '5',
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
