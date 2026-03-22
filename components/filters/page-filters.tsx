'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'

import { SearchBar } from '@/components/search-bar'
import { cn } from '@/lib/utils'

export type PageFilterChip = {
  id: string
  label: string
  active?: boolean
  disabled?: boolean
  dotColor?: string
  onClick?: () => void
}

type PageFiltersHeaderProps = {
  title: string
  subtitle: string
  backHref?: string
  icon: ReactNode
  searchValue: string
  onSearchChange: (value: string) => void
  actionSlot?: ReactNode
  primaryFilters: PageFilterChip[]
  secondaryFilters?: PageFilterChip[]
}

type ActiveFiltersBarProps = {
  tags: Array<{
    id: string
    label: string
    onRemove?: () => void
  }>
  onClear?: () => void
  emptyLabel?: string
}

function FilterChipButton({ chip, compact = false }: { chip: PageFilterChip; compact?: boolean }) {
  const content = (
    <>
      {chip.dotColor ? <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chip.dotColor }} /> : null}
      <span>{chip.label}</span>
    </>
  )

  if (chip.disabled) {
    return (
      <div
        className={cn(
          'shrink-0 rounded-full border border-dashed border-border bg-card text-muted-foreground',
          compact ? 'px-3 py-1.5 text-xs font-medium' : 'px-4 py-2 text-sm font-medium',
        )}
      >
        <div className="flex items-center gap-2">{content}</div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={chip.onClick}
      className={cn(
        'shrink-0 rounded-full border transition-colors',
        compact ? 'px-3 py-1.5 text-xs font-medium' : 'px-4 py-2 text-sm font-medium',
        chip.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-muted',
      )}
    >
      <div className="flex items-center gap-2">{content}</div>
    </button>
  )
}

export function PageFiltersHeader({
  title,
  subtitle,
  backHref = '/',
  icon,
  searchValue,
  onSearchChange,
  actionSlot,
  primaryFilters,
  secondaryFilters = [],
}: PageFiltersHeaderProps) {
  return (
    <>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="text-primary">{icon}</div>
            <div>
              <h1 className="font-semibold text-lg">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
        {actionSlot}
      </div>

      <div className="mx-auto max-w-7xl">
        <SearchBar value={searchValue} onChange={onSearchChange} className="pb-3" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        {primaryFilters.map((chip) => (
          <FilterChipButton key={chip.id} chip={chip} />
        ))}
      </div>

      {secondaryFilters.length > 0 ? (
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {secondaryFilters.map((chip) => (
            <FilterChipButton key={chip.id} chip={chip} compact />
          ))}
        </div>
      ) : null}
    </>
  )
}

export function ActiveFiltersBar({
  tags,
  onClear,
  emptyLabel = 'Nenhum filtro ativo no momento.',
}: ActiveFiltersBarProps) {
  if (tags.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={tag.onRemove}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <span>{tag.label}</span>
          {tag.onRemove ? <X className="h-3.5 w-3.5" /> : null}
        </button>
      ))}
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Limpar tudo
        </button>
      ) : null}
    </div>
  )
}