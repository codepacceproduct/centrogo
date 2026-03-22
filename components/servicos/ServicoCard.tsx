'use client'

import { Clock3, MapPin, MessageCircle, Phone, Star } from 'lucide-react'

import { getWhatsAppHref, SERVICOS_CATEGORY_META, type ServicoPublico } from '@/lib/servicos-map'
import { cn } from '@/lib/utils'

type ServicoCardProps = {
  servico: ServicoPublico
  isSelected?: boolean
  isNearest?: boolean
  distanceLabel?: string | null
  onSelect: (servico: ServicoPublico) => void
  onFocusMap: (servico: ServicoPublico) => void
}

export default function ServicoCard({
  servico,
  isSelected = false,
  isNearest = false,
  distanceLabel = null,
  onSelect,
  onFocusMap,
}: ServicoCardProps) {
  const meta = SERVICOS_CATEGORY_META[servico.categoria]

  return (
    <button
      type="button"
      onClick={() => onSelect(servico)}
      className={cn(
        'w-full rounded-[1.6rem] border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md',
        isSelected ? 'border-primary ring-2 ring-primary/15' : 'border-border hover:border-primary/30',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', meta.pillClass)}>
              {meta.label}
            </span>
            {servico.destaque ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Destaque
              </span>
            ) : null}
            {isNearest ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                Mais proximo
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">{servico.nome}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{servico.descricao}</p>
        </div>
        {distanceLabel ? (
          <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            {distanceLabel}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{servico.endereco}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-primary" />
          <span>{servico.horario}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`tel:${servico.telefone}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"
        >
          <Phone className="h-3.5 w-3.5" />
          Ligar
        </a>
        <a
          href={getWhatsAppHref(servico.whatsapp)}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onFocusMap(servico)
          }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
        >
          <Star className="h-3.5 w-3.5" />
          Ver no mapa
        </button>
      </div>
    </button>
  )
}