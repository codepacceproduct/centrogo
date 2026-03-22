'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from 'lucide-react'

import { getWhatsAppHref, SERVICOS_CATEGORY_META, type ServicoPublico } from '@/lib/servicos-map'
import { cn } from '@/lib/utils'

type ServicoPreviewProps = {
  servico: ServicoPublico
  distanceLabel?: string | null
  isNearest?: boolean
  onOpenList: () => void
}

export default function ServicoPreview({
  servico,
  distanceLabel = null,
  isNearest = false,
  onOpenList,
}: ServicoPreviewProps) {
  const meta = SERVICOS_CATEGORY_META[servico.categoria]

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="fixed inset-x-3 bottom-20 z-[72] mx-auto max-w-xl lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0 lg:w-[24rem]"
    >
      <div className="rounded-[1.7rem] border border-white/55 bg-background/92 p-4 text-left shadow-[0_24px_70px_-30px_rgba(15,23,42,0.72)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold', meta.pillClass)}>
                {meta.label}
              </span>
              {isNearest ? (
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  Mais proximo
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-base font-semibold text-foreground">{servico.nome}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{servico.descricao}</p>
          </div>
          {distanceLabel ? (
            <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
              {distanceLabel}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{servico.horario}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{servico.endereco}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${servico.telefone}`} className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background">
            <Phone className="h-3.5 w-3.5" />
            Ligar
          </a>
          <a href={getWhatsAppHref(servico.whatsapp)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={onOpenList}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
          >
            Abrir lista
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}