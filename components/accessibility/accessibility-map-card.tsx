import { AlertTriangle, Footprints, MapPinned, Route, ShieldCheck } from 'lucide-react'

import { type AccessibilityMapData } from '@/lib/accessibility'
import { cn } from '@/lib/utils'

type AccessibilityMapCardProps = {
  data: AccessibilityMapData
  title?: string
  description?: string
  className?: string
}

const sections = [
  { key: 'accessibleRoutes', label: 'Rotas acessiveis', icon: Route, tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'adaptedSidewalks', label: 'Calcadas adaptadas', icon: Footprints, tone: 'bg-sky-50 text-sky-700 border-sky-200' },
  { key: 'obstacleStreets', label: 'Ruas com obstaculos', icon: AlertTriangle, tone: 'bg-amber-50 text-amber-800 border-amber-200' },
  { key: 'accessibleLocations', label: 'Locais acessiveis', icon: ShieldCheck, tone: 'bg-violet-50 text-violet-700 border-violet-200' },
] as const

export function AccessibilityMapCard({
  data,
  title = 'Mapa de acessibilidade',
  description = 'Contexto do entorno para planejar deslocamento e chegada com mais segurança.',
  className,
}: AccessibilityMapCardProps) {
  return (
    <section className={cn('rounded-[1.75rem] border border-border bg-card p-5 shadow-sm', className)}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <MapPinned className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sections.map((section) => {
          const items = data[section.key]
          const Icon = section.icon

          return (
            <div key={section.key} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {section.label}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className={cn('rounded-full border px-3 py-1 text-xs font-medium', section.tone)}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
