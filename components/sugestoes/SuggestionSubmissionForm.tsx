'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ImagePlus, Plus, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  getSuggestionAuthorTypeLabel,
  mockCurrentSuggestionUser,
  suggestionCategoryLabels,
  type Suggestion,
  type SuggestionCategory,
  type SuggestionDeliveryType,
  type SuggestionLocation,
} from '@/lib/sugestoes-map'

const SuggestionsMap = dynamic(() => import('@/components/sugestoes/SuggestionsMap'), {
  ssr: false,
  loading: () => <div className="h-[360px] rounded-[2rem] bg-muted animate-pulse md:h-[420px]" />,
})

type SuggestionFormState = {
  titulo: string
  descricao: string
  categoria: SuggestionCategory
  tipo_envio: SuggestionDeliveryType
  anonimo: boolean
  endereco: string
  location: SuggestionLocation | null
  imagens: string[]
}

const initialFormState: SuggestionFormState = {
  titulo: '',
  descricao: '',
  categoria: 'infraestrutura',
  tipo_envio: 'publico',
  anonimo: false,
  endereco: '',
  location: null,
  imagens: [],
}

function buildNewSuggestion(form: SuggestionFormState): Suggestion {
  const createdAt = new Date().toISOString()

  return {
    id: `sug_${Date.now()}`,
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    tipo_envio: form.tipo_envio,
    categoria: form.categoria,
    autor: mockCurrentSuggestionUser,
    anonimo: form.anonimo,
    localizacao: form.location
      ? {
          endereco: form.endereco.trim() || form.location.endereco,
          lat: form.location.lat,
          lng: form.location.lng,
        }
      : form.endereco.trim()
        ? {
            endereco: form.endereco.trim(),
            lat: -10.9111,
            lng: -37.0492,
          }
        : null,
    imagens: form.imagens,
    status: 'pendente',
    upvotes: 0,
    downvotes: 0,
    comentarios: 0,
    prioridade_score: 10,
    created_at: createdAt,
  }
}

type SuggestionSubmissionFormProps = {
  suggestions: Suggestion[]
  onCreated: (suggestion: Suggestion) => void
}

export default function SuggestionSubmissionForm({ suggestions, onCreated }: SuggestionSubmissionFormProps) {
  const [formState, setFormState] = useState<SuggestionFormState>(initialFormState)
  const [formError, setFormError] = useState<string | null>(null)

  function handleFormLocationPick(location: SuggestionLocation) {
    setFormState((current) => ({
      ...current,
      location,
      endereco: current.endereco || location.endereco,
    }))
  }

  function handleSubmitSuggestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!formState.titulo.trim() || !formState.descricao.trim()) {
      setFormError('Preencha titulo e descricao para enviar a sugestao.')
      return
    }

    if (!formState.endereco.trim()) {
      setFormError('Informe um endereco de referencia para a sugestao.')
      return
    }

    onCreated(buildNewSuggestion(formState))
    setFormState(initialFormState)
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmitSuggestion} className="rounded-[2rem] border border-border/70 bg-background/92 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Enviar sugestao</h2>
            <p className="text-sm text-muted-foreground">Preencha os dados abaixo e use o mapa para marcar o ponto de referencia da demanda.</p>
          </div>
          <Badge variant="secondary" className="rounded-full">UI + mocks</Badge>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Titulo</Label>
            <Input id="titulo" value={formState.titulo} onChange={(event) => setFormState((current) => ({ ...current, titulo: event.target.value }))} placeholder="Ex.: Melhorar iluminacao no calcadao" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={formState.descricao} onChange={(event) => setFormState((current) => ({ ...current, descricao: event.target.value }))} className="min-h-28" placeholder="Descreva o problema ou a oportunidade com o máximo de contexto possível" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formState.categoria} onValueChange={(value) => setFormState((current) => ({ ...current, categoria: value as SuggestionCategory }))}>
                <SelectTrigger className="w-full rounded-xl bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(suggestionCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formState.tipo_envio} onValueChange={(value) => setFormState((current) => ({ ...current, tipo_envio: value as SuggestionDeliveryType }))}>
                <SelectTrigger className="w-full rounded-xl bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="privado">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereco de referencia</Label>
            <Input id="endereco" value={formState.endereco} onChange={(event) => setFormState((current) => ({ ...current, endereco: event.target.value }))} placeholder="Ex.: Rua Laranjeiras, esquina com João Pessoa" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagens">Upload de imagens</Label>
            <Input
              id="imagens"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).map((file) => file.name)
                setFormState((current) => ({ ...current, imagens: files }))
              }}
            />
            {formState.imagens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formState.imagens.map((image) => (
                  <Badge key={image} variant="outline" className="rounded-full">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {image}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-start gap-3 rounded-[1.25rem] border border-border bg-card/70 p-4">
            <Checkbox
              id="anonimo"
              checked={formState.anonimo}
              onCheckedChange={(checked) => setFormState((current) => ({ ...current, anonimo: checked === true }))}
            />
            <div>
              <Label htmlFor="anonimo">Enviar como anonimo</Label>
              <p className="mt-1 text-sm text-muted-foreground">Quando ativo, o feed público mostrará sua sugestão sem exibir seu nome.</p>
            </div>
          </div>
        </div>

        {formError ? (
          <div className="mt-4 rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            <p>Usuario mock atual: <span className="font-medium text-foreground">{mockCurrentSuggestionUser.nome}</span></p>
            <p>Tipo: {getSuggestionAuthorTypeLabel(mockCurrentSuggestionUser.tipo)}</p>
          </div>
          <Button type="submit" size="lg" className="rounded-full">
            <Plus className="h-4 w-4" />
            Publicar sugestao
          </Button>
        </div>
      </form>

      <div className="space-y-5">
        <section className="rounded-[2rem] border border-border/70 bg-background/92 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Localizacao da sugestao</h2>
              <p className="text-sm text-muted-foreground">Clique no mapa para marcar o ponto aproximado e depois ajuste o endereco de referencia.</p>
            </div>
            {formState.location ? (
              <Badge variant="outline" className="rounded-full">Ponto marcado</Badge>
            ) : null}
          </div>

          <SuggestionsMap
            suggestions={suggestions}
            pickerMode
            pickedLocation={formState.location}
            onPickLocation={handleFormLocationPick}
          />
        </section>

        <section className="rounded-[2rem] border border-border/70 bg-background/92 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-700">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Gamificacao da participacao</h3>
              <p className="mt-1 text-sm text-muted-foreground">Nesta v1, a gamificacao eh visual e mostra como o canal pode incentivar participacao recorrente.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-border bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cidadao ativo</p>
              <p className="mt-2 text-lg font-semibold text-foreground">+35 pontos por nova sugestão</p>
              <p className="mt-1 text-sm text-muted-foreground">+75 pontos extras se a sugestão entrar em aprovação.</p>
            </div>
            <div className="rounded-[1.25rem] border border-border bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Badge</p>
              <p className="mt-2 text-lg font-semibold text-foreground">Agente do Centro</p>
              <p className="mt-1 text-sm text-muted-foreground">Reconhecimento para quem envia e acompanha melhorias da regiao.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}


