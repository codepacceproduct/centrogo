// Centro Vivo Aracaju - Dados Mockados Inteligentes

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
    { id: '2', name: 'Frequentador Assíduo', description: 'Visitou 10 lojas diferentes', icon: '🏆', unlocked: true, unlockedDate: '2024-02-20' },
    { id: '3', name: 'Crítico Gastronômico', description: 'Avaliou 5 restaurantes', icon: '🍽️', unlocked: true, unlockedDate: '2024-03-10' },
    { id: '4', name: 'Explorador Cultural', description: 'Participou de 5 eventos culturais', icon: '🎭', unlocked: false },
    { id: '5', name: 'Colecionador', description: 'Resgatou 10 recompensas', icon: '💎', unlocked: false },
    { id: '6', name: 'Embaixador do Centro', description: 'Convidou 5 amigos', icon: '👥', unlocked: false },
  ],
  history: [
    { id: '1', action: 'Check-in no Forrozim do Centro', points: 50, date: '2024-03-18', type: 'earned' },
    { id: '2', action: 'Resgate de Cupom - Café Sergipano', points: -200, date: '2024-03-17', type: 'spent' },
    { id: '3', action: 'Avaliação - Caranguejo Sergipano', points: 30, date: '2024-03-15', type: 'earned' },
    { id: '4', action: 'Visita à Casa do Artesão', points: 20, date: '2024-03-14', type: 'earned' },
    { id: '5', action: 'Check-in na Feira de Artesanato', points: 50, date: '2024-03-12', type: 'earned' },
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
    name: 'Café Sergipano',
    category: 'Gastronomia',
    categoryIcon: '🍽️',
    image: '/images/cafe-sergipano.jpg',
    rating: 4.8,
    reviewCount: 234,
    address: 'Rua João Pessoa, 123 - Centro',
    openHour: 7,
    closeHour: 22,
    phone: '(79) 3211-1234',
    description: 'O melhor café da região com ambiente acolhedor e receitas tradicionais sergipanas. Experimente nossa tapioca recheada e o café coado na hora.',
    highlights: [
      { id: '1', name: 'Café Coado Especial', price: 8.90, image: '/images/cafe-sergipano.jpg' },
      { id: '2', name: 'Tapioca de Queijo Coalho', price: 14.90, image: '/images/cafe-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: '20% OFF no café da tarde',
    loyaltyPoints: 50
  },
  {
    id: '2',
    name: 'Boutique Atalaia',
    category: 'Moda',
    categoryIcon: '👗',
    image: '/images/boutique-atalaia.jpg',
    rating: 4.5,
    reviewCount: 156,
    address: 'Av. Barão de Maruim, 456 - Centro',
    openHour: 9,
    closeHour: 19,
    phone: '(79) 3212-5678',
    description: 'Moda feminina e masculina com as últimas tendências e preços acessíveis. Roupas leves perfeitas para o clima de Aracaju.',
    highlights: [
      { id: '1', name: 'Vestido Tropical', price: 89.90, image: '/images/boutique-atalaia.jpg' },
      { id: '2', name: 'Camisa Linho', price: 79.90, image: '/images/boutique-atalaia.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Compre 2, leve 3',
    loyaltyPoints: 80
  },
  {
    id: '3',
    name: 'Casa do Artesão',
    category: 'Cultura',
    categoryIcon: '🎨',
    image: '/images/casa-artesao.jpg',
    rating: 4.9,
    reviewCount: 89,
    address: 'Praça Olímpio Campos, 78 - Centro Histórico',
    openHour: 10,
    closeHour: 18,
    phone: '(79) 3213-9012',
    description: 'O melhor do artesanato sergipano em um só lugar. Cerâmicas, bordados, rendas e esculturas feitas por artistas locais.',
    highlights: [
      { id: '1', name: 'Cerâmica Pintada à Mão', price: 85.00, image: '/images/casa-artesao.jpg' },
      { id: '2', name: 'Renda Irlandesa', price: 120.00, image: '/images/casa-artesao.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 100
  },
  {
    id: '4',
    name: 'Caranguejo Sergipano',
    category: 'Gastronomia',
    categoryIcon: '🍽️',
    image: '/images/caranguejo-sergipano.jpg',
    rating: 4.7,
    reviewCount: 312,
    address: 'Rua Laranjeiras, 200 - Centro',
    openHour: 11,
    closeHour: 23,
    phone: '(79) 3214-3456',
    description: 'Culinária nordestina autêntica com frutos do mar frescos do litoral sergipano. Especialidade em caranguejo e moqueca.',
    highlights: [
      { id: '1', name: 'Caranguejo Catado', price: 75.90, image: '/images/caranguejo-sergipano.jpg' },
      { id: '2', name: 'Moqueca de Camarão', price: 89.90, image: '/images/caranguejo-sergipano.jpg' },
    ],
    hasPromotion: true,
    promotionText: 'Sobremesa grátis no almoço',
    loyaltyPoints: 70
  },
  {
    id: '5',
    name: 'Livraria Leitura Sergipe',
    category: 'Serviços',
    categoryIcon: '📚',
    image: '/images/livraria-leitura.jpg',
    rating: 4.6,
    reviewCount: 178,
    address: 'Rua São Cristóvão, 55 - Centro',
    openHour: 8,
    closeHour: 20,
    phone: '(79) 3215-7890',
    description: 'Livraria completa com café literário e espaço para eventos culturais. Seção especial de autores sergipanos.',
    highlights: [
      { id: '1', name: 'Bestsellers', price: 45.90, image: '/images/livraria-leitura.jpg' },
      { id: '2', name: 'Literatura Sergipana', price: 35.00, image: '/images/livraria-leitura.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 40
  },
  {
    id: '6',
    name: 'Ótica Centro Aracaju',
    category: 'Serviços',
    categoryIcon: '👓',
    image: '/images/otica-centro.jpg',
    rating: 4.4,
    reviewCount: 98,
    address: 'Av. Ivo do Prado, 300 - Centro',
    openHour: 9,
    closeHour: 18,
    phone: '(79) 3216-1234',
    description: 'Óculos de grau e sol das melhores marcas com atendimento personalizado. Exame de vista gratuito.',
    highlights: [
      { id: '1', name: 'Óculos Ray-Ban', price: 450.00, image: '/images/otica-centro.jpg' },
      { id: '2', name: 'Armação Premium', price: 280.00, image: '/images/otica-centro.jpg' },
    ],
    hasPromotion: true,
    promotionText: '30% OFF na segunda armação',
    loyaltyPoints: 60
  },
  {
    id: '7',
    name: 'Sorveteria Mangaba',
    category: 'Gastronomia',
    categoryIcon: '🍦',
    image: '/images/sorveteria-mangaba.jpg',
    rating: 4.8,
    reviewCount: 445,
    address: 'Praça Fausto Cardoso, 10 - Centro',
    openHour: 10,
    closeHour: 22,
    phone: '(79) 3217-5678',
    description: 'Sorvetes artesanais com sabores regionais. Mangaba, cajá, umbu e outras frutas típicas de Sergipe.',
    highlights: [
      { id: '1', name: 'Sorvete de Mangaba', price: 8.90, image: '/images/sorveteria-mangaba.jpg' },
      { id: '2', name: 'Açaí Sergipano', price: 22.90, image: '/images/sorveteria-mangaba.jpg' },
    ],
    hasPromotion: false,
    loyaltyPoints: 30
  },
  {
    id: '8',
    name: 'Empório Nordeste',
    category: 'Gastronomia',
    categoryIcon: '🧀',
    image: '/images/emporio-nordeste.jpg',
    rating: 4.6,
    reviewCount: 167,
    address: 'Rua Pacatuba, 180 - Centro',
    openHour: 8,
    closeHour: 19,
    phone: '(79) 3218-9012',
    description: 'Produtos regionais do Nordeste. Queijo coalho, carne de sol, temperos e doces típicos sergipanos.',
    highlights: [
      { id: '1', name: 'Queijo Coalho Artesanal', price: 32.00, image: '/images/emporio-nordeste.jpg' },
      { id: '2', name: 'Cesta Nordestina', price: 89.90, image: '/images/emporio-nordeste.jpg' },
    ],
    hasPromotion: true,
    promotionText: '15% OFF em compras acima de R$100',
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
    title: 'Forrozim do Centro',
    description: 'Uma noite especial de forró pé de serra com os melhores músicos de Sergipe. Venha dançar e celebrar a cultura nordestina!',
    image: '/images/evento-forrozim.jpg',
    date: '2024-03-20',
    time: '19:00',
    location: 'Praça Fausto Cardoso',
    category: 'Música',
    categoryTag: 'Forró ao Vivo',
    isHappening: true,
    nearbyStores: ['1', '7', '3']
  },
  {
    id: '2',
    title: 'Feira de Artesanato Sergipano',
    description: 'Exposição e venda de artesanato local com mais de 50 artesãos da região. Renda irlandesa, cerâmica e muito mais.',
    image: '/images/evento-feira-artesanato.jpg',
    date: '2024-03-22',
    time: '08:00',
    location: 'Praça Olímpio Campos',
    category: 'Cultura',
    categoryTag: 'Artesanato',
    isHappening: false,
    nearbyStores: ['3', '5']
  },
  {
    id: '3',
    title: 'Festival Gastronômico do Centro',
    description: 'Degustação de pratos típicos sergipanos com chefs renomados. Caranguejo, moqueca, tapioca e muito mais!',
    image: '/images/evento-gastronomia.jpg',
    date: '2024-03-23',
    time: '18:00',
    location: 'Rua São Cristóvão',
    category: 'Gastronomia',
    categoryTag: 'Food Festival',
    isHappening: false,
    nearbyStores: ['1', '4', '7']
  },
  {
    id: '4',
    title: 'Desfile Centro Vivo Fashion',
    description: 'As últimas tendências da moda sergipana apresentadas pelas lojas do centro histórico.',
    image: '/images/evento-moda.jpg',
    date: '2024-03-25',
    time: '19:30',
    location: 'Av. Barão de Maruim',
    category: 'Moda',
    categoryTag: 'Fashion Week',
    isHappening: false,
    nearbyStores: ['2', '8']
  },
  {
    id: '5',
    title: 'Sarau Literário Sergipano',
    description: 'Leituras de poesia e lançamento de livros de autores sergipanos. Participação de Tobias Barreto Cultural.',
    image: '/images/evento-sarau.jpg',
    date: '2024-03-27',
    time: '17:00',
    location: 'Livraria Leitura Sergipe',
    category: 'Cultura',
    categoryTag: 'Literatura',
    isHappening: false,
    nearbyStores: ['5', '3']
  },
  {
    id: '6',
    title: 'Arraiá do Centro Vivo',
    description: 'Forró pé de serra autêntico com trio sanfoneiro e quadrilha junina. Comidas típicas e muita animação!',
    image: '/images/evento-forro.jpg',
    date: '2024-03-29',
    time: '20:00',
    location: 'Praça Fausto Cardoso',
    category: 'Música',
    categoryTag: 'Forró',
    isHappening: false,
    nearbyStores: ['1', '4', '7']
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
    storeName: 'Café Sergipano',
    storeId: '1',
    pointsCost: 300,
    image: '/images/cafe-sergipano.jpg',
    expiresAt: '2024-04-30'
  },
  {
    id: '2',
    title: 'Sobremesa Grátis',
    description: 'Na compra de qualquer prato principal',
    storeName: 'Caranguejo Sergipano',
    storeId: '4',
    pointsCost: 500,
    image: '/images/caranguejo-sergipano.jpg',
    expiresAt: '2024-04-15'
  },
  {
    id: '3',
    title: '15% OFF em Óculos',
    description: 'Desconto em armações selecionadas',
    storeName: 'Ótica Centro Aracaju',
    storeId: '6',
    pointsCost: 400,
    image: '/images/otica-centro.jpg',
    expiresAt: '2024-05-01'
  },
  {
    id: '4',
    title: 'Sorvete de Mangaba Duplo',
    description: 'Pague 1, leve 2 no sabor mangaba',
    storeName: 'Sorveteria Mangaba',
    storeId: '7',
    pointsCost: 200,
    image: '/images/sorveteria-mangaba.jpg',
    expiresAt: '2024-04-20'
  },
  {
    id: '5',
    title: 'Livro Sergipano de Brinde',
    description: 'Livro de autor local na compra acima de R$50',
    storeName: 'Livraria Leitura Sergipe',
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
  { id: '1', title: 'Novo evento!', message: 'Forrozim do Centro começa às 19h hoje', time: '10 min', read: false, type: 'event' },
  { id: '2', title: 'Promoção relâmpago!', message: 'Café Sergipano com 20% OFF agora', time: '30 min', read: false, type: 'promo' },
  { id: '3', title: 'Parabéns!', message: 'Você ganhou 50 pontos', time: '1h', read: true, type: 'points' },
  { id: '4', title: 'Recompensa disponível', message: 'Você pode resgatar um sorvete de mangaba duplo', time: '2h', read: true, type: 'reward' },
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
    title: 'Beco das Artes',
    description: 'Galeria escondida com arte urbana e grafites de artistas sergipanos',
    image: '/images/beco-artes.jpg',
    type: 'experience',
    rating: 4.9
  },
  {
    id: '2',
    title: 'Café Secreto',
    description: 'Cafeteria intimista em um casarão histórico do século XIX',
    image: '/images/cafe-secreto.jpg',
    type: 'store',
    rating: 4.7
  },
  {
    id: '3',
    title: 'Mirante do Centro',
    description: 'Vista panorâmica do Rio Sergipe e do centro histórico ao pôr do sol',
    image: '/images/mirante-centro.jpg',
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
