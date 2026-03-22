'use client'

import { useState } from 'react'
import { Database, LockKeyhole, MapPinned, Shield, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface StepLGPDProps {
  onBack: () => void
  onAccept: () => void
}

const lgpdSections = [
  {
    title: 'Uso de dados',
    description: 'Utilizamos seus dados apenas para melhorar sua experi\u00eancia.',
    icon: Database,
  },
  {
    title: 'Geolocaliza\u00e7\u00e3o',
    description: 'Sua localiza\u00e7\u00e3o \u00e9 usada para recomenda\u00e7\u00f5es e n\u00e3o \u00e9 compartilhada indevidamente.',
    icon: MapPinned,
  },
  {
    title: 'Seguran\u00e7a',
    description: 'Seus dados s\u00e3o armazenados com seguran\u00e7a seguindo boas pr\u00e1ticas e padr\u00f5es de prote\u00e7\u00e3o.',
    icon: Shield,
  },
  {
    title: 'LGPD',
    description: 'Estamos em conformidade com a Lei Geral de Prote\u00e7\u00e3o de Dados.',
    icon: ShieldCheck,
  },
]

export function StepLGPD({ onBack, onAccept }: StepLGPDProps) {
  const [showFullPolicy, setShowFullPolicy] = useState(false)

  return (
    <div className="flex min-h-full w-full flex-1 flex-col">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80 sm:text-sm">
          {'Terceiro passo'}
        </p>
        <h2 className="mt-2 text-[clamp(1.7rem,6vw,2.35rem)] font-bold tracking-tight text-foreground leading-[1.08]">
          {'Privacidade e Seguran\u00e7a'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base md:text-lg">
          {
            'Queremos que sua experi\u00eancia seja \u00fatil, segura e transparente. Estes s\u00e3o os compromissos que guiam o uso dos seus dados na plataforma.'
          }
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-6 md:gap-4">
        {lgpdSections.map((section) => {
          const Icon = section.icon

          return (
            <div
              key={section.title}
              className="rounded-[1.35rem] border border-border/60 bg-muted/25 p-4 shadow-sm md:rounded-[1.6rem] md:p-5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary md:h-12 md:w-12">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground md:mt-4 md:text-lg">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.05] p-4 md:mt-6 md:rounded-[1.8rem] md:p-5">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 md:h-11 md:w-11">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground md:text-base">
              {'Voc\u00ea controla essa jornada.'}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {
                'O consentimento desta etapa apenas libera seu primeiro acesso. A qualquer momento, novas configura\u00e7\u00f5es podem ser ajustadas conforme a evolu\u00e7\u00e3o da plataforma.'
              }
            </p>
          </div>
        </div>
      </div>

      {showFullPolicy ? (
        <div className="mt-4 rounded-[1.35rem] border border-border/60 bg-background/80 p-4 text-sm leading-6 text-muted-foreground md:mt-5 md:rounded-[1.6rem] md:p-5">
          <p>
            {
              'Tratamos apenas os dados necess\u00e1rios para personaliza\u00e7\u00e3o, navega\u00e7\u00e3o e comunica\u00e7\u00e3o essencial dentro da experi\u00eancia do CentroGO. Nenhum dado \u00e9 vendido ou compartilhado fora das finalidades operacionais e legais da plataforma.'
            }
          </p>
          <p className="mt-3">
            {
              'Quando a localiza\u00e7\u00e3o estiver habilitada, ela \u00e9 usada para recomenda\u00e7\u00f5es e contexto de proximidade. Mantemos boas pr\u00e1ticas de seguran\u00e7a, princ\u00edpio de m\u00ednimo acesso e revis\u00e3o cont\u00ednua de prote\u00e7\u00e3o de dados.'
            }
          </p>
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] sm:flex-row sm:items-center sm:justify-between sm:pt-5">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full px-5 sm:w-auto"
          onClick={onBack}
        >
          {'Voltar'}
        </Button>

        <div className="grid gap-3 sm:flex sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            className="w-full rounded-full px-5 text-muted-foreground hover:text-foreground sm:w-auto"
            onClick={() => setShowFullPolicy((value) => !value)}
          >
            {showFullPolicy ? 'Ocultar pol\u00edtica completa' : 'Ver pol\u00edtica completa'}
          </Button>

          <Button
            type="button"
            className="w-full rounded-full px-5 sm:w-auto"
            onClick={onAccept}
          >
            {'Aceitar e continuar'}
          </Button>
        </div>
      </div>
    </div>
  )
}