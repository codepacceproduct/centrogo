'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  BellOff,
  Check,
  ChevronRight,
  Globe,
  Info,
  Lock,
  MapPin,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Star,
  Sun,
  User,
  Volume2,
  VolumeX,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/context/AccessibilityContext'

/* ─── Toggle animado ─────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <motion.span
        className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

/* ─── Toast de confirmação ───────────────────────────────────── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="fixed bottom-28 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-20px_rgba(15,76,163,0.65)] lg:bottom-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25"
          >
            <Check className="h-3 w-3" />
          </motion.div>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Linha de configuração ──────────────────────────────────── */
function SettingRow({
  icon: Icon,
  label,
  description,
  toggle,
  value,
  onChange,
  iconBg,
}: {
  icon: React.ElementType
  label: string
  description?: string
  toggle?: boolean
  value?: boolean
  onChange?: (v: boolean) => void
  iconBg?: string
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
          iconBg ?? 'bg-primary/10',
        )}
      >
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            {description}
          </p>
        )}
      </div>
      {toggle && onChange !== undefined ? (
        <Toggle checked={value ?? false} onChange={onChange} />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  )
}

/* ─── Cabeçalho de seção ─────────────────────────────────────── */
function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string
  icon?: React.ElementType
}) {
  return (
    <div className="flex items-center gap-2 px-4 pt-6 pb-2">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
    </div>
  )
}

/* ─── Página principal ───────────────────────────────────────── */
export default function ConfiguracoesPage() {
  const { settings, updateSetting } = useAccessibility()
  const darkMode = settings.darkMode

  const [notifications, setNotifications] = useState(false)
  const [eventAlerts, setEventAlerts] = useState(false)
  const [promoAlerts, setPromoAlerts] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  /* toast state */
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null)

  function showToast(msg: string) {
    setToast({ message: msg, key: Date.now() })
    setTimeout(() => setToast(null), 2800)
  }

  function handleDarkMode(v: boolean) {
    updateSetting('darkMode', v)
  }

  function handleNotifications(v: boolean) {
    setNotifications(v)
    if (v) showToast('🔔 Notificações push ativadas!')
  }

  function handleEventAlerts(v: boolean) {
    setEventAlerts(v)
    if (v) showToast('📅 Alertas de eventos ativados!')
  }

  function handlePromoAlerts(v: boolean) {
    setPromoAlerts(v)
    if (v) showToast('🏷️ Promoções e ofertas ativadas!')
  }

  return (
    <>
      <main className="min-h-screen bg-background pb-24 lg:pb-8 lg:pt-24">
        {/* Header */}
        <header className="bg-gradient-to-br from-primary to-secondary text-primary-foreground px-4 pb-8 pt-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <Link
              href="/perfil"
              className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Configurações</h1>
              <p className="text-primary-foreground/70 text-sm">
                Personalize sua experiência
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto -mt-2">
          {/* Cartão de perfil rápido */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 -mt-4 bg-card rounded-2xl border border-border shadow-lg p-4 flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">João Santos</p>
              <p className="text-sm text-muted-foreground truncate">
                Centro Histórico · Aracaju
              </p>
            </div>
            <Link
              href="/perfil"
              className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors shrink-0"
            >
              Ver perfil
            </Link>
          </motion.div>

          {/* Notificações */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SectionHeader title="Notificações" icon={Bell} />
            <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              <SettingRow
                icon={notifications ? Bell : BellOff}
                label="Notificações push"
                description="Receba alertas de eventos e promoções"
                toggle
                value={notifications}
                onChange={handleNotifications}
                iconBg="bg-blue-500/10"
              />
              <SettingRow
                icon={Star}
                label="Alertas de eventos"
                description="Seja avisado sobre eventos próximos"
                toggle
                value={eventAlerts}
                onChange={handleEventAlerts}
                iconBg="bg-gold/10"
              />
              <SettingRow
                icon={Bell}
                label="Promoções e ofertas"
                description="Notificações de descontos nas lojas"
                toggle
                value={promoAlerts}
                onChange={handlePromoAlerts}
                iconBg="bg-emerald-500/10"
              />
              <SettingRow
                icon={soundEnabled ? Volume2 : VolumeX}
                label="Sons do aplicativo"
                description="Ativar sons e vibrações"
                toggle
                value={soundEnabled}
                onChange={setSoundEnabled}
                iconBg="bg-violet-500/10"
              />
            </div>
          </motion.div>

          {/* Aparência */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <SectionHeader title="Aparência" icon={Palette} />
            <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              <SettingRow
                icon={darkMode ? Moon : Sun}
                label="Modo escuro"
                description="Alterna entre tema claro e escuro"
                toggle
                value={darkMode}
                onChange={handleDarkMode}
                iconBg="bg-slate-500/10"
              />
              <SettingRow
                icon={Globe}
                label="Idioma"
                description="Português (Brasil)"
                iconBg="bg-teal-500/10"
              />
            </div>
          </motion.div>

          {/* Localização e conectividade */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectionHeader title="Localização e conexão" icon={MapPin} />
            <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              <SettingRow
                icon={MapPin}
                label="Localização em tempo real"
                description="Necessário para o mapa e sugestões próximas"
                toggle
                value={locationEnabled}
                onChange={setLocationEnabled}
                iconBg="bg-rose-500/10"
              />
            </div>
          </motion.div>

          {/* Privacidade */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <SectionHeader title="Privacidade e segurança" icon={Shield} />
            <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
              <SettingRow
                icon={Lock}
                label="Dados e privacidade"
                description="Gerencie como seus dados são usados"
                iconBg="bg-indigo-500/10"
              />
              <SettingRow
                icon={Shield}
                label="Alterar senha"
                description="Atualize sua senha de acesso"
                iconBg="bg-primary/10"
              />
            </div>
          </motion.div>

          {/* Sobre */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SectionHeader title="Sobre" icon={Info} />
            <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border mb-8">
              <SettingRow
                icon={Info}
                label="Sobre o CentroGO"
                description="Versão 1.0.0 · Centro Histórico de Aracaju"
                iconBg="bg-primary/10"
              />
              <SettingRow
                icon={Star}
                label="Avaliar o app"
                description="Dê sua opinião na loja de aplicativos"
                iconBg="bg-gold/10"
              />
              <SettingRow
                icon={User}
                label="Termos de uso"
                iconBg="bg-slate-500/10"
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Toast global */}
      <Toast
        message={toast?.message ?? ''}
        visible={toast !== null}
        key={toast?.key}
      />
    </>
  )
}
