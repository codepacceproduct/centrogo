import type { MapPoint } from '@/services/mapbox'

export type SecurityType =
  | 'delegacia'
  | 'policia_militar'
  | 'guarda_municipal'
  | 'posto_policial'
  | 'delegacia_especializada'
  | 'bombeiros'
  | 'hospital_publico'
  | 'posto_saude'
  | 'emergencia_medica'

export interface SecurityContact {
  telefone: string
  email: string
  responsavel: string
}

export interface SecurityLocation extends MapPoint {
  id: string
  nome: string
  tipo: SecurityType
  endereco: string
  horarioFuncionamento: string
  contato: SecurityContact
  typeLabel: string
  accentColor: string
  summaryLabel: string
}

interface RawSecurityLocation extends MapPoint {
  id: string
  nome: string
  tipo: SecurityType
  endereco: string
  horarioFuncionamento: string
  contato: SecurityContact
}

const SECURITY_TYPE_LABELS: Record<SecurityType, string> = {
  delegacia: 'Delegacia',
  policia_militar: 'Policia Militar',
  guarda_municipal: 'Guarda Municipal',
  posto_policial: 'Posto Policial',
  delegacia_especializada: 'Delegacia Especializada',
  bombeiros: 'Bombeiros',
  hospital_publico: 'Hospital Publico',
  posto_saude: 'Posto de Saude',
  emergencia_medica: 'Emergencia Medica',
}

const SECURITY_TYPE_COLORS: Record<SecurityType, string> = {
  delegacia: '#2563eb',
  policia_militar: '#1d4ed8',
  guarda_municipal: '#0f766e',
  posto_policial: '#0891b2',
  delegacia_especializada: '#7c3aed',
  bombeiros: '#dc2626',
  hospital_publico: '#ea580c',
  posto_saude: '#16a34a',
  emergencia_medica: '#db2777',
}

const SECURITY_TYPE_SUMMARY: Record<SecurityType, string> = {
  delegacia: 'Atendimento policial e registro de ocorrencias',
  policia_militar: 'Patrulhamento ostensivo e apoio imediato',
  guarda_municipal: 'Seguranca urbana e apoio no centro',
  posto_policial: 'Ponto de apoio com cobertura local',
  delegacia_especializada: 'Atendimento especializado ao publico',
  bombeiros: 'Incendio, resgate e emergencias',
  hospital_publico: 'Urgencia e atendimento hospitalar',
  posto_saude: 'Atendimento basico de saude',
  emergencia_medica: 'Resposta movel de urgencia',
}

export const DEFAULT_SECURITY_CENTER: MapPoint = {
  lat: -10.9138,
  lng: -37.0489,
}

const RAW_SECURITY_LOCATIONS: RawSecurityLocation[] = [
  {
    id: 'seg_001',
    nome: '1a Delegacia Metropolitana',
    tipo: 'delegacia',
    endereco: 'Rua Itabaianinha, Centro, Aracaju - SE',
    lat: -10.911897,
    lng: -37.048512,
    contato: {
      telefone: '(79) 3214-1201',
      email: '1dm.centro@policiacivil.se.gov.br',
      responsavel: 'Delegado Joao Ribeiro',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_002',
    nome: '2o Batalhao da Policia Militar',
    tipo: 'policia_militar',
    endereco: 'Av. Ivo do Prado, Centro, Aracaju - SE',
    lat: -10.911122,
    lng: -37.044875,
    contato: {
      telefone: '(79) 3226-8300',
      email: '2bpm@pm.se.gov.br',
      responsavel: 'Tenente-Coronel Marcos Silva',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_003',
    nome: 'Guarda Municipal de Aracaju - Base Centro',
    tipo: 'guarda_municipal',
    endereco: 'Praca General Valadao, Centro, Aracaju - SE',
    lat: -10.910478,
    lng: -37.048201,
    contato: {
      telefone: '(79) 3179-1400',
      email: 'gma.centro@aracaju.se.gov.br',
      responsavel: 'Inspetor Carlos Andrade',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_004',
    nome: 'Posto Policial - Mercado Municipal',
    tipo: 'posto_policial',
    endereco: 'Mercado Municipal Antonio Franco, Centro, Aracaju - SE',
    lat: -10.909735,
    lng: -37.052103,
    contato: {
      telefone: '(79) 99911-2204',
      email: 'posto.mercado@pm.se.gov.br',
      responsavel: 'Sargento Paulo Souza',
    },
    horarioFuncionamento: '06:00 - 18:00',
  },
  {
    id: 'seg_005',
    nome: 'Delegacia de Turismo (Detur)',
    tipo: 'delegacia_especializada',
    endereco: 'Rua Pacatuba, Centro, Aracaju - SE',
    lat: -10.912345,
    lng: -37.046912,
    contato: {
      telefone: '(79) 3214-1450',
      email: 'detur@policiacivil.se.gov.br',
      responsavel: 'Delegada Ana Beatriz Costa',
    },
    horarioFuncionamento: '08:00 - 18:00',
  },
  {
    id: 'seg_006',
    nome: 'Central de Flagrantes',
    tipo: 'delegacia',
    endereco: 'Av. Tancredo Neves, Aracaju - SE',
    lat: -10.9275,
    lng: -37.0603,
    contato: {
      telefone: '(79) 3205-9400',
      email: 'flagrantes@policiacivil.se.gov.br',
      responsavel: 'Delegado Ricardo Menezes',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_007',
    nome: 'Corpo de Bombeiros - Centro',
    tipo: 'bombeiros',
    endereco: 'Rua Itabaiana, Centro, Aracaju - SE',
    lat: -10.908912,
    lng: -37.049887,
    contato: {
      telefone: '(79) 193',
      email: 'atendimento@cbmse.se.gov.br',
      responsavel: 'Capitao Eduardo Santos',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_008',
    nome: 'Hospital de Urgencia de Sergipe (HUSE)',
    tipo: 'hospital_publico',
    endereco: 'Av. Tancredo Neves, Aracaju - SE',
    lat: -10.927923,
    lng: -37.060456,
    contato: {
      telefone: '(79) 3225-8000',
      email: 'contato@huse.se.gov.br',
      responsavel: 'Dr. Marcelo Oliveira',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_009',
    nome: 'Unidade Basica de Saude - Centro',
    tipo: 'posto_saude',
    endereco: 'Centro, Aracaju - SE',
    lat: -10.9153,
    lng: -37.0502,
    contato: {
      telefone: '(79) 3211-3300',
      email: 'ubs.centro@aracaju.se.gov.br',
      responsavel: 'Enf. Juliana Martins',
    },
    horarioFuncionamento: '07:00 - 17:00',
  },
  {
    id: 'seg_010',
    nome: 'SAMU Base Aracaju Centro',
    tipo: 'emergencia_medica',
    endereco: 'Centro Administrativo, Aracaju - SE',
    lat: -10.9138,
    lng: -37.0479,
    contato: {
      telefone: '(79) 192',
      email: 'samu@saude.se.gov.br',
      responsavel: 'Coordenador Felipe Araujo',
    },
    horarioFuncionamento: '24h',
  },
]

function buildSecurityLocation(location: RawSecurityLocation): SecurityLocation {
  return {
    ...location,
    typeLabel: SECURITY_TYPE_LABELS[location.tipo],
    accentColor: SECURITY_TYPE_COLORS[location.tipo],
    summaryLabel: SECURITY_TYPE_SUMMARY[location.tipo],
  }
}

export const securityLocations = RAW_SECURITY_LOCATIONS.map(buildSecurityLocation)

export const emergencySecurityLocations = securityLocations.filter((location) =>
  ['policia_militar', 'bombeiros', 'emergencia_medica'].includes(location.tipo),
)
