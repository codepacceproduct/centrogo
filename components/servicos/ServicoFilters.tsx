'use client'

import { cn } from '@/lib/utils'
import { SERVICOS_FILTERS, type ServicoCategoria } from '@/lib/servicos-map'

type ServicoFiltersProps = {
  activeCategory: 'all' | ServicoCategoria
  onChange: (category: 'all' | ServicoCategoria) => void
}

export default function ServicoFilters({ activeCategory, onChange }: ServicoFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {SERVICOS_FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
            activeCategory === filter.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:bg-muted',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}