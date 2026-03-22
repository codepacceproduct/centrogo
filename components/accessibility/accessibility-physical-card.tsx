import { Accessibility, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

import { PHYSICAL_ACCESSIBILITY_ITEMS, type PhysicalAccessibility } from '@/lib/accessibility'
import { cn } from '@/lib/utils'

type AccessibilityPhysicalCardProps = {
  data: PhysicalAccessibility
  title?: string
  description?: string
  className?: string
}

export function AccessibilityPhysicalCard({
  data,
  title = 'Acessibilidade fisica',
  description = 'Leitura rapida de mobilidade e estrutura de apoio no local.',
  className,
}: AccessibilityPhysicalCardProps) {
  return (
    <section className={cn('rounded-[1.75rem] border border-border bg-card p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Accessibility className="h-4 w-4 text-primary" />
            {title}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {PHYSICAL_ACCESSIBILITY_ITEMS.filter((item) => data[item.key]).length}/{PHYSICAL_ACCESSIBILITY_ITEMS.length}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {PHYSICAL_ACCESSIBILITY_ITEMS.map((item) => {
          const available = data[item.key]

          return (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-4 py-3">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                  available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
                )}
              >
                {available ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {available ? 'Disponível' : 'Não possui'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Degraus</p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {data.stepsCount === 0 ? 'Sem degraus no acesso principal' : `${data.stepsCount} degrau${data.stepsCount === 1 ? '' : 's'} no acesso principal`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Informacao relevante para mobilidade e planejamento da visita.</p>
        </div>

        <div className="rounded-2xl border border-border bg-background px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Inclinacao da rampa</p>
          <p className="mt-2 text-sm font-medium text-foreground">{data.rampInclination}</p>
          <p className="mt-1 text-xs text-muted-foreground">Referencia visual para o esforco de acesso no ponto principal.</p>
        </div>
      </div>

      {data.stepsCount > 0 ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          O acesso principal tem degraus. Vale conferir a rota assistida ou entrada alternativa antes de sair.
        </div>
      ) : null}
    </section>
  )
}

export function AccessibilityHighlights({ data, className }: { data: PhysicalAccessibility; className?: string }) {
  const availableItems = PHYSICAL_ACCESSIBILITY_ITEMS.filter((item) => data[item.key]).slice(0, 3)

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {availableItems.map((item) => (
        <span key={item.key} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {item.label}
        </span>
      ))}
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {data.stepsCount === 0 ? 'Sem degraus' : `${data.stepsCount} degrau${data.stepsCount === 1 ? '' : 's'}`}
      </span>
    </div>
  )
}

