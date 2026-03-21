'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Mail } from 'lucide-react'
import { isMockAuthenticated, loginMockAuth } from '@/lib/mock-auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isMockAuthenticated()) {
      router.replace('/perfil')
    }
  }, [router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha para continuar.')
      return
    }

    loginMockAuth(email.trim())
    router.push('/perfil')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo CentroGO" width={42} height={42} className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Entrar no CentroGO</h1>
              <p className="text-sm text-primary-foreground/80">Acesse sua conta com dados mockados</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">E-mail</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="h-11 w-full bg-transparent outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">Senha</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full bg-transparent outline-none"
              />
            </div>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Entrar
          </button>

          <p className="text-sm text-center text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-primary font-semibold hover:underline">
              Criar cadastro
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
