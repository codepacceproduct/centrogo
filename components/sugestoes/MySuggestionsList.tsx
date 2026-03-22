'use client'

import { Flame, MapPin, MessageSquare, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  formatSuggestionDate,
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

type MySuggestionsListProps = {
  suggestions: Suggestion[]
  currentUserName: string
  submitMessage: string | null
}

export default function MySuggestionsList({ suggestions, currentUserName, submitMessage }: MySuggestionsListProps) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-background/92 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Minhas sugestoes</h2>
          <p className="text-sm text-muted-foreground">Lista mockada a partir do usuario atual simulado, incluindo sugestoes publicas e privadas enviadas por ele.</p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {currentUserName}
        </Badge>
      </div>

      {submitMessage ? (
        <div className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {submitMessage}
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {suggestions.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
            O usuario mock atual ainda nao possui sugestoes cadastradas.
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <article key={suggestion.id} className="rounded-[1.5rem] border border-border bg-card/80 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full border" style={getCategoryBadgeStyle(suggestion.categoria)}>
                      {getSuggestionCategoryLabel(suggestion.categoria)}
                    </Badge>
                    <Badge variant={suggestionStatusTone[suggestion.status]} className="rounded-full">
                      {getSuggestionStatusLabel(suggestion.status)}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {suggestion.tipo_envio === 'publico' ? 'Publico' : 'Privado'}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{suggestion.titulo}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{suggestion.descricao}</p>
                </div>
                {isSuggestionTrending(suggestion) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                    <Flame className="h-3.5 w-3.5" />
                    Em destaque
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{suggestion.localizacao?.endereco ?? 'Sem endereco informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>Prioridade {suggestion.prioridade_score}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  {suggestion.upvotes} apoio(s)
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  {suggestion.comentarios} comentarios
                </span>
                <span className="text-xs">Criada em {formatSuggestionDate(suggestion.created_at)}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

