'use client'

import { Flame, MapPin, MessageSquare, Sparkles, ThumbsDown, ThumbsUp, UserRound } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatSuggestionDate,
  getSuggestionAuthorTypeLabel,
  getSuggestionCategoryLabel,
  getSuggestionStatusLabel,
  isSuggestionTrending,
  suggestionCategoryColors,
  suggestionStatusTone,
  type Suggestion,
  type SuggestionCategory,
} from '@/lib/sugestoes-map'

function getCategoryBadgeStyle(category: SuggestionCategory) {
  return {
    backgroundColor: `${suggestionCategoryColors[category]}20`,
    color: suggestionCategoryColors[category],
    borderColor: `${suggestionCategoryColors[category]}45`,
  }
}

function buildVisibleAuthorName(suggestion: Suggestion) {
  if (suggestion.anonimo) return 'Anonimo'
  return suggestion.autor.nome
}

type FeedSuggestionCardProps = {
  suggestion: Suggestion
  isSelected: boolean
  onSelect: (suggestionId: string) => void
  onVote: (suggestionId: string, direction: 'up' | 'down') => void
}

export default function FeedSuggestionCard({ suggestion, isSelected, onSelect, onVote }: FeedSuggestionCardProps) {
  return (
    <article
      className={[
        'rounded-[1.75rem] border bg-background/94 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] transition-all',
        isSelected ? 'border-primary/60 ring-1 ring-primary/15' : 'border-border/70',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border" style={getCategoryBadgeStyle(suggestion.categoria)}>
              {getSuggestionCategoryLabel(suggestion.categoria)}
            </Badge>
            <Badge variant={suggestionStatusTone[suggestion.status]} className="rounded-full">
              {getSuggestionStatusLabel(suggestion.status)}
            </Badge>
            {isSuggestionTrending(suggestion) ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                <Flame className="h-3.5 w-3.5" />
                Trending
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">{suggestion.titulo}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{suggestion.descricao}</p>
        </div>

        <Button type="button" variant="outline" className="rounded-full" onClick={() => onSelect(suggestion.id)}>
          Ver no mapa
        </Button>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{suggestion.localizacao?.endereco ?? 'Sem localizacao publica'}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-primary" />
          <span>{buildVisibleAuthorName(suggestion)} • {getSuggestionAuthorTypeLabel(suggestion.autor.tipo)}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" onClick={() => onVote(suggestion.id, 'up')} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-medium text-foreground transition-colors hover:bg-muted">
          <ThumbsUp className="h-4 w-4 text-emerald-600" />
          {suggestion.upvotes}
        </button>
        <button type="button" onClick={() => onVote(suggestion.id, 'down')} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-medium text-foreground transition-colors hover:bg-muted">
          <ThumbsDown className="h-4 w-4 text-rose-600" />
          {suggestion.downvotes}
        </button>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4 text-primary" />
          {suggestion.comentarios} comentarios
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-amber-600" />
          Score {suggestion.prioridade_score}
        </span>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Atualizado em {formatSuggestionDate(suggestion.created_at)}</p>
    </article>
  )
}

