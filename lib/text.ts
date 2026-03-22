const DIRECT_REPLACEMENTS: Array<[string, string]> = [
  ['Disponivel', 'Disponível'],
  ['Nao possui', 'Não possui'],
  ['Joao', 'João'],
  ['Praca', 'Praça'],
  ['Calcadao', 'Calçadão'],
  ['historicos', 'históricos'],
  ['historico', 'histórico'],
  ['turisticos', 'turísticos'],
  ['turistico', 'turístico'],
  ['promocao', 'promoção'],
  ['Promocao', 'Promoção'],
  ['promocoes', 'promoções'],
  ['Promocoes', 'Promoções'],
  ['avaliacao', 'avaliação'],
  ['Avaliacao', 'Avaliação'],
  ['informacoes', 'informações'],
  ['Informacoes', 'Informações'],
  ['operacao', 'operação'],
  ['Operacao', 'Operação'],
  ['circulacao', 'circulação'],
  ['Circulacao', 'Circulação'],
  ['localizacao', 'localização'],
  ['Localizacao', 'Localização'],
  ['rapidos', 'rápidos'],
  ['Rapidos', 'Rápidos'],
  ['rapido', 'rápido'],
  ['Rapido', 'Rápido'],
  ['basico', 'básico'],
  ['Basico', 'Básico'],
  ['publico', 'público'],
  ['Publico', 'Público'],
  ['servicos', 'serviços'],
  ['Servicos', 'Serviços'],
  ['seguranca', 'segurança'],
  ['Seguranca', 'Segurança'],
  ['saude', 'saúde'],
  ['Saude', 'Saúde'],
  ['emergencia', 'emergência'],
  ['Emergencia', 'Emergência'],
  ['clinica', 'clínica'],
  ['Clinica', 'Clínica'],
  ['clinicas', 'clínicas'],
  ['Clinicas', 'Clínicas'],
  ['medico', 'médico'],
  ['Medico', 'Médico'],
  ['medica', 'médica'],
  ['Medica', 'Médica'],
  ['medicas', 'médicas'],
  ['Medicas', 'Médicas'],
  ['nao', 'não'],
  ['Nao', 'Não'],
  ['possivel', 'possível'],
  ['Possivel', 'Possível'],
  ['voce', 'você'],
  ['Voce', 'Você'],
  ['presenca', 'presença'],
  ['Presenca', 'Presença'],
  ['periodo', 'período'],
  ['Periodo', 'Período'],
  ['musica', 'música'],
  ['Musica', 'Música'],
  ['gastronomicas', 'gastronômicas'],
  ['gastronomica', 'gastronômica'],
  ['atracoes', 'atrações'],
  ['Atracoes', 'Atrações'],
  ['reclamacao', 'reclamação'],
  ['Reclamacao', 'Reclamação'],
  ['decisoes', 'decisões'],
  ['Decisoes', 'Decisões'],
  ['publicas', 'públicas'],
  ['Publicas', 'Públicas'],
  ['privadas', 'privadas'],
  ['populacao', 'população'],
  ['Populacao', 'População'],
  ['inteligencia', 'inteligência'],
  ['Inteligencia', 'Inteligência'],
  ['Sugestao', 'Sugestão'],
  ['sugestao', 'sugestão'],
  ['sugestoes', 'sugestões'],
  ['Sugestoes', 'Sugestões'],
  ['anonimo', 'anônimo'],
  ['Anonimo', 'Anônimo'],
  ['patrocinio', 'patrocínio'],
  ['Patrocinio', 'Patrocínio'],
  ['cidadaos', 'cidadãos'],
  ['Cidadaos', 'Cidadãos'],
  ['aprovacao', 'aprovação'],
  ['Aprovacao', 'Aprovação'],
  ['otica', 'ótica'],
  ['Otica', 'Ótica'],
  ['oticas', 'óticas'],
  ['Farmacias', 'Farmácias'],
  ['farmacias', 'farmácias'],
  ['colecao', 'coleção'],
  ['Colecao', 'Coleção'],
  ['classica', 'clássica'],
  ['Classica', 'Clássica'],
  ['acessorios', 'acessórios'],
  ['Acessorios', 'Acessórios'],
  ['coracao', 'coração'],
  ['Coracao', 'Coração'],
  ['refeicao', 'refeição'],
  ['Refeicao', 'Refeição'],
  ['acessivel', 'acessível'],
  ['Acessivel', 'Acessível'],
  ['guia rebaixada', 'guia rebaixada'],
]

export function normalizeText(text: string) {
  if (!text) return ''

  let output = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  )

  const suspiciousCodePoints = [0x00c3, 0x00c2, 0x00e2, 0x00f0]
  const hasMojibake = suspiciousCodePoints.some((codePoint) =>
    output.includes(String.fromCharCode(codePoint)),
  )

  if (hasMojibake) {
    try {
      const bytes = Uint8Array.from(Array.from(output).map((char) => char.charCodeAt(0) & 0xff))
      const decoded = new TextDecoder('utf-8').decode(bytes)
      if (!decoded.includes('\uFFFD')) {
        output = decoded
      }
    } catch {
      output = text
    }
  }

  for (const [from, to] of DIRECT_REPLACEMENTS) {
    output = output.replaceAll(from, to)
  }

  return output.normalize('NFC')
}


