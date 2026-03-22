import type { MapPoint } from '@/services/mapbox'

export type SecurityType =
  | 'policia_militar'
  | 'guarda_municipal'
  | 'bombeiros'
  | 'emergencia_medica'
  | 'defesa_civil'
  | 'hospital'
  | 'clinica'
  | 'plano_saude'

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
  policia_militar: 'Policia Militar',
  guarda_municipal: 'Guarda Municipal',
  bombeiros: 'Bombeiros',
  emergencia_medica: 'Emergência Médica',
  defesa_civil: 'Defesa Civil',
  hospital: 'Hospital',
  clinica: 'Clinica',
  plano_saude: 'Saúde',
}

const SECURITY_TYPE_COLORS: Record<SecurityType, string> = {
  policia_militar: '#1d4ed8',
  guarda_municipal: '#0f766e',
  bombeiros: '#dc2626',
  emergencia_medica: '#db2777',
  defesa_civil: '#d97706',
  hospital: '#ea580c',
  clinica: '#16a34a',
  plano_saude: '#7c3aed',
}

const SECURITY_TYPE_SUMMARY: Record<SecurityType, string> = {
  policia_militar: 'Patrulhamento ostensivo e apoio imediato',
  guarda_municipal: 'Segurança urbana e apoio no centro',
  bombeiros: 'Incêndio, resgate e emergências',
  emergencia_medica: 'Resposta móvel de urgência',
  defesa_civil: 'Monitoramento de risco e atendimento emergencial',
  hospital: 'Atendimento hospitalar e suporte de urgencia',
  clinica: 'Atendimento clínico e suporte em saúde',
  plano_saude: 'Atendimento médico e rede de saúde',
}

export const DEFAULT_SECURITY_CENTER: MapPoint = {
  lat: -10.9140202,
  lng: -37.0673404,
}

const MAIN_SECURITY_LOCATIONS_RAW: RawSecurityLocation[] = [
  {
    id: 'seg_pmse_001',
    nome: 'PMSE',
    tipo: 'policia_militar',
    endereco: 'Ponto mapeado da Policia Militar, Aracaju - SE',
    lat: -10.9197847,
    lng: -37.0772116,
    contato: {
      telefone: '190',
      email: 'pmse.centro@seguranca.se.gov.br',
      responsavel: 'Equipe de atendimento PMSE',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_gm_001',
    nome: 'Guarda Municipal de Aracaju - Base Centro',
    tipo: 'guarda_municipal',
    endereco: 'Praca General Valadao, Centro, Aracaju - SE',
    lat: -10.910478,
    lng: -37.048201,
    contato: {
      telefone: '153',
      email: 'gma.centro@aracaju.se.gov.br',
      responsavel: 'Inspetor Carlos Andrade',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_bomb_001',
    nome: 'Corpo de Bombeiros - Centro',
    tipo: 'bombeiros',
    endereco: 'Rua Itabaiana, Centro, Aracaju - SE',
    lat: -10.908912,
    lng: -37.049887,
    contato: {
      telefone: '193',
      email: 'atendimento@cbmse.se.gov.br',
      responsavel: 'Capitao Eduardo Santos',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_samu_001',
    nome: 'SAMU Base Aracaju Centro',
    tipo: 'emergencia_medica',
    endereco: 'Centro Administrativo, Aracaju - SE',
    lat: -10.9138,
    lng: -37.0479,
    contato: {
      telefone: '192',
      email: 'samu@saude.se.gov.br',
      responsavel: 'Coordenador Felipe Araujo',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'seg_dc_001',
    nome: 'Defesa Civil',
    tipo: 'defesa_civil',
    endereco: 'Atendimento emergencial da Defesa Civil, Aracaju - SE',
    lat: -10.9170397,
    lng: -37.0504143,
    contato: {
      telefone: '199',
      email: 'defesacivil@aracaju.se.gov.br',
      responsavel: 'Equipe de plantao da Defesa Civil',
    },
    horarioFuncionamento: '24h',
  },
]

const HEALTH_LOCATIONS_RAW: RawSecurityLocation[] = [
  {
    id: 'health_001',
    nome: 'Hospital Sao Jose',
    tipo: 'hospital',
    endereco: 'Hospital Sao Jose, Aracaju - SE',
    lat: -10.90176201283367,
    lng: -37.05452259373581,
    contato: {
      telefone: '0000-0000',
      email: 'contato@hospitalsaojose.se',
      responsavel: 'Recepcao Hospital Sao Jose',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_002',
    nome: 'Hospital Dr. Nestor Piva',
    tipo: 'hospital',
    endereco: 'Hospital Dr. Nestor Piva, Aracaju - SE',
    lat: -10.904503423360163,
    lng: -37.06735883733688,
    contato: {
      telefone: '0000-0000',
      email: 'contato@nestorpiva.se',
      responsavel: 'Recepcao Hospital Nestor Piva',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_003',
    nome: 'HAPVIDA',
    tipo: 'plano_saude',
    endereco: 'HAPVIDA, Aracaju - SE',
    lat: -10.911815552812778,
    lng: -37.05026753588088,
    contato: {
      telefone: '0000-0000',
      email: 'contato@hapvida.com.br',
      responsavel: 'Atendimento HAPVIDA',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_004',
    nome: 'Hospital Gabriel Soares',
    tipo: 'hospital',
    endereco: 'Hospital Gabriel Soares, Aracaju - SE',
    lat: -10.919939208114286,
    lng: -37.050482733390176,
    contato: {
      telefone: '0000-0000',
      email: 'contato@hospitalgabrielsoares.se',
      responsavel: 'Recepcao Hospital Gabriel Soares',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_005',
    nome: 'Hospital Cirurgia',
    tipo: 'hospital',
    endereco: 'Hospital Cirurgia, Aracaju - SE',
    lat: -10.917668740057454,
    lng: -37.05913972741158,
    contato: {
      telefone: '0000-0000',
      email: 'contato@hospitalcirurgia.se',
      responsavel: 'Recepcao Hospital Cirurgia',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_006',
    nome: 'IpeSaude',
    tipo: 'plano_saude',
    endereco: 'IpeSaude, Aracaju - SE',
    lat: -10.918270077593359,
    lng: -37.05959904448518,
    contato: {
      telefone: '0000-0000',
      email: 'contato@ipesaude.se.gov.br',
      responsavel: 'Atendimento IpeSaude',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_007',
    nome: 'Hospital Sao Lucas',
    tipo: 'hospital',
    endereco: 'Hospital Sao Lucas, Aracaju - SE',
    lat: -10.924179982501004,
    lng: -37.05201865349148,
    contato: {
      telefone: '0000-0000',
      email: 'contato@hospitalsaolucas.se',
      responsavel: 'Recepcao Hospital Sao Lucas',
    },
    horarioFuncionamento: '24h',
  },
  {
    id: 'health_008',
    nome: 'CenterMed',
    tipo: 'clinica',
    endereco: 'CenterMed, Aracaju - SE',
    lat: -10.908360026621,
    lng: -37.05098341002646,
    contato: {
      telefone: '0000-0000',
      email: 'contato@centermed.se',
      responsavel: 'Atendimento CenterMed',
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

export const securityLocations = MAIN_SECURITY_LOCATIONS_RAW.map(buildSecurityLocation)
export const emergencySecurityLocations = securityLocations
export const healthLocations = HEALTH_LOCATIONS_RAW.map(buildSecurityLocation)
export const allSecurityLocations = [...securityLocations, ...healthLocations]



