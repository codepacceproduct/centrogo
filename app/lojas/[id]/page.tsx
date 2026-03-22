'use client'

import { use, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, MapPin, Phone, Clock, ExternalLink, Gift, Share2, Users, Tag, CheckCircle2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AccessibilityMapCard } from '@/components/accessibility/accessibility-map-card'
import { AccessibilityPhysicalCard } from '@/components/accessibility/accessibility-physical-card'
import { stores, isStoreOpen, getRandomDistance, getRandomVisitors } from '@/lib/data'
import { normalizeText } from '@/lib/text'
import { cn } from '@/lib/utils'

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const store = stores.find((item) => item.id === id)

  const isOpen = useMemo(() => (store ? isStoreOpen(store.openHour, store.closeHour) : false), [store])
  const distance = useMemo(() => getRandomDistance(id), [id])
  const visitors = useMemo(() => getRandomVisitors(id), [id])

  if (!store) {
    return (
      <main className="pb-24 pt-16 lg:pb-8 lg:pt-24">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <p className="mb-3 text-4xl">:-(</p>
            <h2 className="font-semibold text-lg">Loja nao encontrada</h2>
            <Link href="/lojas" className="mt-2 inline-block text-sm text-primary">
              Voltar para lojas
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleDirections = () => {
    const query = encodeURIComponent(`${store.name}, ${store.address}, Aracaju, SE`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: normalizeText(store.name),
        text: `Confira esta loja: ${normalizeText(store.name)}`,
        url: window.location.href,
      })
    }
  }

  return (
    <>
      <main className="pb-44 pt-16 lg:pb-8 lg:pt-24">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/96 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-semibold text-lg">Detalhes da Loja</h1>
                <p className="text-xs text-muted-foreground">{normalizeText(store.name)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleShare()}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Compartilhar loja"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_22px_60px_-38px_rgba(15,23,42,0.45)]">
            <div className="relative h-[280px] md:h-[340px] lg:h-[390px]">
              <Image src={store.image} alt={normalizeText(store.name)} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/82 via-foreground/58 to-foreground/18" />

              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm',
                      isOpen ? 'bg-success text-primary-foreground' : 'bg-white/20 text-white',
                    )}
                  >
                    {isOpen ? 'Aberto agora' : 'Fechado'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/12 px-3 py-1 text-xs font-semibold text-white/92 shadow-sm backdrop-blur-sm">
                    {normalizeText(store.groupLabel)}
                  </span>
                  {store.hasPromotion ? (
                    <span className="rounded-full border border-white/10 bg-live px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                      PROMO ATIVA
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white lg:text-4xl">{normalizeText(store.name)}</h2>
                <p className="mt-3 max-w-2xl text-sm text-white/78 lg:text-base">{normalizeText(store.description)}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/82">
                  <span>{normalizeText(store.subcategoryLabel)}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  <span>{normalizeText(store.address)}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
                  <span>{distance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <section className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-primary" />
                    Avaliacao
                  </div>
                  <p className="mt-3 font-semibold">{store.rating} de 5</p>
                  <p className="mt-1 text-sm text-muted-foreground">Baseado em {store.reviewCount} avaliacoes</p>
                </div>

                <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-primary" />
                    Horario
                  </div>
                  <p className="mt-3 font-semibold">{store.openHour}:00 - {store.closeHour}:00</p>
                  <p className="mt-1 text-sm text-muted-foreground">Funcionamento principal exibido nos cards</p>
                </div>

                <div className="rounded-[1.6rem] border border-border bg-card p-4 shadow-sm md:col-span-2 xl:col-span-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    Movimento
                  </div>
                  <p className="mt-3 font-semibold">{visitors} visitas hoje</p>
                  <p className="mt-1 text-sm text-muted-foreground">Fluxo estimado para a experiencia da loja</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">Sobre a loja</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Contexto, proposta e posicionamento no Centro</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    {store.loyaltyPoints} pts por compra
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">{normalizeText(store.description)}</p>

                {store.hasPromotion && store.promotionText ? (
                  <div className="mt-5 rounded-2xl border border-live/20 bg-live/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-live">
                      <Tag className="h-4 w-4" />
                      Promocao ativa
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{normalizeText(store.promotionText)}</p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Informacoes da operacao
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{normalizeText(store.address)}</p>
                      <p className="text-xs text-muted-foreground">{normalizeText(store.neighborhood)} - Aracaju, SE</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{store.openHour}:00 - {store.closeHour}:00</p>
                      <p className="text-xs text-muted-foreground">Horario de funcionamento</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{store.phone}</p>
                      <p className="text-xs text-muted-foreground">Contato direto</p>
                    </div>
                  </div>
                </div>
              </div>

              <AccessibilityPhysicalCard data={store.physicalAccessibility} />
              <AccessibilityMapCard
                data={store.accessibilityMap}
                description="Rotas, calcadas e pontos do entorno para organizar a visita com foco em mobilidade."
              />
            </section>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">Informacoes rapidas</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Resumo para decisao imediata</p>
                  </div>
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {normalizeText(store.groupLabel)}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{normalizeText(store.address)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{store.openHour}:00 - {store.closeHour}:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{visitors} pessoas passaram por aqui hoje</span>
                  </div>
                </div>

                <div className="mt-5 hidden gap-3 lg:flex">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDirections}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Como chegar
                  </motion.button>
                  <motion.a
                    href={`tel:${store.phone.replace(/\D/g, '')}`}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-semibold"
                  >
                    <Phone className="h-4 w-4" />
                    Ligar
                  </motion.a>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">Destaques da loja</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Itens e produtos em evidencia</p>
                  </div>
                  <Gift className="h-4 w-4 text-primary" />
                </div>

                <div className="space-y-3">
                  {store.highlights.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.18 + index * 0.05 }}
                      className="rounded-2xl border border-border bg-background p-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="mt-1 text-sm font-semibold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Link
                href="/lojas"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Voltar para lojas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-4 bottom-[5.5rem] z-[65] lg:hidden">
        <div className="rounded-[1.6rem] border border-border bg-background/96 p-3 shadow-[0_18px_48px_-30px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDirections}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 font-medium text-primary-foreground"
            >
              <ExternalLink className="h-5 w-5" />
              Como Chegar
            </motion.button>
            <motion.a
              href={`tel:${store.phone.replace(/\D/g, '')}`}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 font-medium"
            >
              <Phone className="h-5 w-5" />
              Ligar
            </motion.a>
          </div>
        </div>
      </div>
    </>
  )
}
