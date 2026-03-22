import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { AppShell } from '../components/app-shell'
import { AccessibilityProvider } from '@/context/AccessibilityContext'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'CentroGO',
  description: 'O centro de Aracaju como um shopping a ceu aberto. Descubra lojas, eventos e ganhe recompensas!',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo.png', sizes: '256x256', type: 'image/png' },
      { url: '/logo.png', sizes: '1024x1024', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [{ url: '/logo.png', sizes: '512x512', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0056A3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} icons-no-container font-sans antialiased`}>
        <AccessibilityProvider>
          <AppShell>{children}</AppShell>
          <Analytics />
        </AccessibilityProvider>
      </body>
    </html>
  )
}
