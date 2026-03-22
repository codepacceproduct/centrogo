'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Clock3, Mail, MapPin, PhoneCall, ShieldAlert, UserRound } from 'lucide-react'
import Link from 'next/link'

import { emergencySecurityLocations, securityLocations, type SecurityLocation } from '@/lib/seguranca-map'
import { cn } from '@/lib/utils'

const SecurityMap = dynamic(() => import('@/components/seguranca/SecurityMap'), {
  ssr: false,
  loading: () => <div className="h-[360px] rounded-[2rem] bg-muted animate-pulse md:h-[420px]" />,
})

function buildPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function buildMailHref(email: string) {
  return `mailto:${email}`
}

function getTypeBadgeClass(tipo: SecurityLocation['tipo']) {
  switch (tipo) {
    case 'policia_militar':
      return 'bg-blue-500/12 text-blue-700'
    case 'bombeiros':
      return 'bg-red-500/12 text-red-700'
    case 'emergencia_medica':
      return 'bg-pink-500/12 text-pink-700'
    case 'guarda_municipal':
      return 'bg-teal-500/12 text-teal-700'
    case 'delegacia_especializada':
      return 'bg-violet-500/12 text-violet-700'
    case 'hospital_publico':
      return 'bg-orange-500/12 text-orange-700'
    case 'posto_saude':
      return 'bg-emerald-500/12 text-emerald-700'
    case 'posto_policial':
      return 'bg-cyan-500/12 text-cyan-700'
    case 'delegacia':
    default:
      return 'bg-slate-500/12 text-slate-700'
  }
}

export default function SegurancaPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(securityLocations[0]?.id ?? null)

  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return securityLocations[0] ?? null
    return securityLocations.find((location) => location.id === selectedLocationId) ?? securityLocations[0] ?? null
  }, [selectedLocationId])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_100%)] pb-32 pt-20 lg:pb-12 lg:pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 lg:px-6">
        <header className="rounded-[2rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
          <div className="flex items-start gap-3">
            <Link href="/" className="rounded-full border border-border bg-background p-2.5 transition-colors hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <ShieldAlert className="h-3.5 w-3.5" />
                Seguranca
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mapa de seguranca do Centro de Aracaju</h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                Encontre delegacias, policiamento, bombeiros e apoio de saude com contato rapido para ligacao, e-mail e referencia de responsavel.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {emergencySecurityLocations.map((location) => (
            <article
              key={location.id}
              className="rounded-[1.75rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cn('rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]', getTypeBadgeClass(location.tipo))}>
                  {location.typeLabel}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{location.horarioFuncionamento}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">{location.nome}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{location.summaryLabel}</p>
              <div className="mt-4 grid gap-2 text-sm text-foreground">
                <a href={buildPhoneHref(location.contato.telefone)} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 font-medium transition-colors hover:bg-muted">
                  <PhoneCall className="h-4 w-4 text-primary" />
                  {location.contato.telefone}
                </a>
                <a href={buildMailHref(location.contato.email)} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 font-medium transition-colors hover:bg-muted">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="truncate">{location.contato.email}</span>
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Mapa de seguranca</h2>
              <p className="text-sm text-muted-foreground">Toque em um marcador para destacar a unidade e ver a rota aproximada a partir da sua localizacao.</p>
            </div>
            {selectedLocation ? (
              <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                <p className="font-semibold text-foreground">{selectedLocation.nome}</p>
                <p className="text-muted-foreground">{selectedLocation.typeLabel}</p>
              </div>
            ) : null}
          </div>

          <SecurityMap
            locations={securityLocations}
            selectedLocation={selectedLocation}
            onSelect={(location) => setSelectedLocationId(location.id)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Pontos e contatos</h2>
            <p className="text-sm text-muted-foreground">Lista completa das unidades com informacoes para quem ligar, enviar e-mail e procurar no atendimento.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {securityLocations.map((location) => {
              const isSelected = location.id === selectedLocation?.id

              return (
                <article
                  key={location.id}
                  className={cn(
                    'rounded-[1.75rem] border bg-background/94 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] transition-all',
                    isSelected ? 'border-primary/60 ring-1 ring-primary/15' : 'border-border/70',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]', getTypeBadgeClass(location.tipo))}>
                          {location.typeLabel}
                        </span>
                        <span className="rounded-full bg-foreground/5 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                          {location.horarioFuncionamento}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-foreground">{location.nome}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{location.summaryLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLocationId(location.id)}
                      className="rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                    >
                      Ver no mapa
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{location.endereco}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{location.horarioFuncionamento}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{location.contato.responsavel}</span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a
                      href={buildPhoneHref(location.contato.telefone)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_32px_-20px_rgba(37,99,235,0.75)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Ligar
                    </a>
                    <a
                      href={buildMailHref(location.contato.email)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <Mail className="h-4 w-4" />
                      E-mail
                    </a>
                  </div>

                  <div className="mt-4 rounded-[1.25rem] border border-border bg-card/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Quem procurar</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{location.contato.responsavel}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{location.contato.email}</p>
                    <p className="text-sm text-muted-foreground">{location.contato.telefone}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
