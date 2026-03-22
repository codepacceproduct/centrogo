'use client'

import { useState } from 'react'
import { Compass, Loader2, MapPin, Navigation, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface StepGeolocationProps {
  onBack: () => void
  onContinue: () => void
}

type LocationAction = 'activate' | 'already-enabled' | null

function persistLocationPermission(value: 'granted' | 'denied') {
  try {
    window.localStorage.setItem('location_permission', value)
  } catch {
    // Ignore storage failures and keep the onboarding flowing.
  }
}

const benefits = [
  {
    title: 'Lugares pr\u00f3ximos',
    description: 'Mostramos lojas, servi\u00e7os e eventos relevantes ao seu redor.',
    icon: MapPin,
  },
  {
    title: 'Rotas mais r\u00e1pidas',
    description: 'Voc\u00ea navega pelo Centro com menos atrito e mais contexto.',
    icon: Navigation,
  },
  {
    title: 'Experi\u00eancia personalizada',
    description: 'As recomenda\u00e7\u00f5es ficam mais \u00fateis conforme sua localiza\u00e7\u00e3o.',
    icon: Compass,
  },
]

export function StepGeolocation({ onBack, onContinue }: StepGeolocationProps) {
  const [locationAction, setLocationAction] = useState<LocationAction>(null)
  const isRequesting = locationAction !== null

  const requestLocation = (mode: Exclude<LocationAction, null>) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      persistLocationPermission('denied')
      onContinue()
      return
    }

    setLocationAction(mode)

    navigator.geolocation.getCurrentPosition(
      () => {
        persistLocationPermission('granted')
        setLocationAction(null)
        onContinue()
      },
      () => {
        persistLocationPermission('denied')
        setLocationAction(null)
        onContinue()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  return (
    <div className="flex min-h-full w-full flex-1 flex-col">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80 sm:text-sm">
          {'Segundo passo'}
        </p>
        <h2 className="mt-2 text-[clamp(1.7rem,6vw,2.35rem)] font-bold tracking-tight text-foreground leading-[1.08]">
          {'Ative sua localiza\u00e7\u00e3o'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base md:text-lg">
          {
            'Usamos sua localiza\u00e7\u00e3o para mostrar lugares pr\u00f3ximos, eventos relevantes e melhorar sua experi\u00eancia dentro da plataforma.'
          }
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon

          return (
            <div
              key={benefit.title}
              className="rounded-[1.35rem] border border-border/60 bg-muted/25 p-4 shadow-sm md:rounded-[1.6rem] md:p-5"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary md:h-12 md:w-12">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground md:mt-4 md:text-lg">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-primary/10 bg-primary/[0.04] p-4 md:mt-6 md:rounded-[1.8rem] md:p-5">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 md:h-11 md:w-11">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground md:text-base">
              {'Voc\u00ea segue mesmo se preferir n\u00e3o compartilhar agora.'}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {
                'A permiss\u00e3o \u00e9 opcional. Se quiser, voc\u00ea pode ativar depois direto nas configura\u00e7\u00f5es do navegador.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] sm:flex-row sm:items-center sm:justify-between sm:pt-5">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full px-5 sm:w-auto"
          onClick={onBack}
          disabled={isRequesting}
        >
          {'Voltar'}
        </Button>

        <div className="grid gap-3 sm:flex sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            className="w-full rounded-full px-5 text-muted-foreground hover:text-foreground sm:w-auto"
            onClick={() => {
              persistLocationPermission('denied')
              onContinue()
            }}
            disabled={isRequesting}
          >
            {'Agora n\u00e3o'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full px-5 sm:w-auto"
            onClick={() => requestLocation('already-enabled')}
            disabled={isRequesting}
          >
            {locationAction === 'already-enabled' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {'Verificando'}
              </>
            ) : (
              <>
                {'J\u00e1 ativei'}
                <Navigation className="h-4 w-4" />
              </>
            )}
          </Button>

          <Button
            type="button"
            className="w-full rounded-full px-5 sm:w-auto"
            onClick={() => requestLocation('activate')}
            disabled={isRequesting}
          >
            {locationAction === 'activate' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {'Solicitando permiss\u00e3o'}
              </>
            ) : (
              <>
                {'Ativar localiza\u00e7\u00e3o'}
                <Navigation className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}