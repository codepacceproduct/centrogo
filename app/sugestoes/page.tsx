'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, ListFilter, MailPlus, Plus, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import FeedSuggestionCard from '@/components/sugestoes/FeedSuggestionCard'
import MySuggestionsList from '@/components/sugestoes/MySuggestionsList'
import SuggestionSubmissionForm from '@/components/sugestoes/SuggestionSubmissionForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getSuggestionStatusLabel,
  isSuggestionTrending,
  mockCurrentSuggestionUser,
  mockSuggestions,
  sortSuggestions,
  suggestionCategoryLabels,
  suggestionsChannel,
  suggestionStatusLabels,
  type Suggestion,
  type SuggestionCategory,
  type SuggestionSortMode,
  type SuggestionStatus,
} from '@/lib/sugestoes-map'

const SuggestionsMap = dynamic(() => import('@/components/sugestoes/SuggestionsMap'), {
  ssr: false,
  loading: () => <div className="h-[360px] rounded-[2rem] bg-muted animate-pulse md:h-[420px]" />,
})

type TabValue = 'feed' | 'enviar' | 'minhas'

function matchesMockCurrentUser(suggestion: Suggestion) {
  return (
    suggestion.autor.nome === mockCurrentSuggestionUser.nome &&
    suggestion.autor.tipo === mockCurrentSuggestionUser.tipo
  )
}

export default function SugestoesPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('feed')
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(
    mockSuggestions.find((suggestion) => suggestion.tipo_envio === 'publico')?.id ?? null,
  )
  const [categoryFilter, setCategoryFilter] = useState<'all' | SuggestionCategory>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | SuggestionStatus>('all')
  const [sortMode, setSortMode] = useState<SuggestionSortMode>('recentes')
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const publicSuggestions = useMemo(
    () => suggestions.filter((suggestion) => suggestion.tipo_envio === 'publico'),
    [suggestions],
  )

  const feedSuggestions = useMemo(() => {
    const filtered = publicSuggestions.filter((suggestion) => {
      if (categoryFilter !== 'all' && suggestion.categoria !== categoryFilter) return false
      if (statusFilter !== 'all' && suggestion.status !== statusFilter) return false
      return true
    })

    return sortSuggestions(filtered, sortMode)
  }, [categoryFilter, publicSuggestions, sortMode, statusFilter])

  const mySuggestions = useMemo(
    () => sortSuggestions(suggestions.filter(matchesMockCurrentUser), 'recentes'),
    [suggestions],
  )

  const selectedSuggestion = useMemo(() => {
    if (!selectedSuggestionId) return feedSuggestions[0] ?? publicSuggestions[0] ?? null
    return publicSuggestions.find((suggestion) => suggestion.id === selectedSuggestionId) ?? feedSuggestions[0] ?? publicSuggestions[0] ?? null
  }, [feedSuggestions, publicSuggestions, selectedSuggestionId])

  const stats = useMemo(() => {
    const approvedCount = suggestions.filter((suggestion) => suggestion.status === 'aprovado' || suggestion.status === 'em_execucao').length
    const trendingCount = publicSuggestions.filter(isSuggestionTrending).length
    const publicCount = publicSuggestions.length

    return { approvedCount, trendingCount, publicCount }
  }, [publicSuggestions, suggestions])

  useEffect(() => {
    if (!selectedSuggestionId && publicSuggestions[0]) {
      setSelectedSuggestionId(publicSuggestions[0].id)
      return
    }

    if (selectedSuggestionId && !publicSuggestions.some((suggestion) => suggestion.id === selectedSuggestionId)) {
      setSelectedSuggestionId(publicSuggestions[0]?.id ?? null)
    }
  }, [publicSuggestions, selectedSuggestionId])

  function handleVote(suggestionId: string, direction: 'up' | 'down') {
    setSuggestions((current) =>
      current.map((suggestion) => {
        if (suggestion.id !== suggestionId) return suggestion

        if (direction === 'up') {
          return {
            ...suggestion,
            upvotes: suggestion.upvotes + 1,
            prioridade_score: suggestion.prioridade_score + 3,
          }
        }

        return {
          ...suggestion,
          downvotes: suggestion.downvotes + 1,
          prioridade_score: Math.max(0, suggestion.prioridade_score - 1),
        }
      }),
    )
  }

  function handleCreatedSuggestion(suggestion: Suggestion) {
    setSuggestions((current) => [suggestion, ...current])
    if (suggestion.tipo_envio === 'publico') {
      setSelectedSuggestionId(suggestion.id)
    }
    setSubmitMessage(
      suggestion.tipo_envio === 'publico'
        ? 'Sugestao enviada para o feed comunitario com sucesso.'
        : 'Sugestao privada enviada para a administracao com sucesso.',
    )
    setActiveTab('minhas')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_100%)] pb-32 pt-20 lg:pb-12 lg:pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 lg:px-6">
        <header className="rounded-[2rem] border border-border/70 bg-background/92 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <Link href="/" className="rounded-full border border-border bg-background p-2.5 transition-colors hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <MailPlus className="h-3.5 w-3.5" />
                  Sugestoes
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Canal de melhorias do CentroGO</h1>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                  {suggestionsChannel.descricao}. Transforme percepção da rua em dado estruturado para orientar melhorias no Centro de Aracaju.
                </p>
              </div>
            </div>

            <Button type="button" size="lg" className="rounded-full" onClick={() => setActiveTab('enviar')}>
              <Plus className="h-4 w-4" />
              Nova Sugestao
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
            {suggestionsChannel.objetivo_estrategico.slice(0, 4).map((item) => (
              <div key={item} className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Feed público</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.publicCount}</p>
              <p className="text-sm text-muted-foreground">Sugestoes visiveis no mapa comunitario</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Trending</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.trendingCount}</p>
              <p className="text-sm text-muted-foreground">Demandas com maior impacto percebido</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Em avancando</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.approvedCount}</p>
              <p className="text-sm text-muted-foreground">Sugestoes aprovadas ou em execucao</p>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="gap-4">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-[1.25rem] bg-muted/70 p-1">
            <TabsTrigger value="feed" className="rounded-[1rem] py-2.5">Feed Público</TabsTrigger>
            <TabsTrigger value="enviar" className="rounded-[1rem] py-2.5">Enviar Sugestao</TabsTrigger>
            <TabsTrigger value="minhas" className="rounded-[1rem] py-2.5">Minhas Sugestoes</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-5">
            <section className="rounded-[2rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Feed comunitario</h2>
                  <p className="text-sm text-muted-foreground">Sugestoes publicas, votacao social e prioridade urbana em tempo real.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                  <ListFilter className="h-4 w-4" />
                  Filtros do feed
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as 'all' | SuggestionCategory)}>
                    <SelectTrigger className="w-full rounded-xl bg-card">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {Object.entries(suggestionCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select value={sortMode} onValueChange={(value) => setSortMode(value as SuggestionSortMode)}>
                    <SelectTrigger className="w-full rounded-xl bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recentes">Recentes</SelectItem>
                      <SelectItem value="mais_votadas">Mais votadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | SuggestionStatus)}>
                    <SelectTrigger className="w-full rounded-xl bg-card">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(suggestionStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="rounded-[2rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
                <SuggestionsMap suggestions={suggestions} selectedSuggestionId={selectedSuggestion?.id ?? null} onSelectSuggestion={setSelectedSuggestionId} />
              </div>

              <div className="space-y-4">
                {feedSuggestions.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-border bg-background/90 p-8 text-center text-sm text-muted-foreground">
                    Nenhuma sugestao publica encontrada com os filtros selecionados.
                  </div>
                ) : (
                  feedSuggestions.map((suggestion) => (
                    <FeedSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      isSelected={suggestion.id === selectedSuggestion?.id}
                      onSelect={setSelectedSuggestionId}
                      onVote={handleVote}
                    />
                  ))
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="enviar">
            <SuggestionSubmissionForm suggestions={suggestions} onCreated={handleCreatedSuggestion} />
          </TabsContent>

          <TabsContent value="minhas">
            <MySuggestionsList suggestions={mySuggestions} currentUserName={mockCurrentSuggestionUser.nome} submitMessage={submitMessage} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}


