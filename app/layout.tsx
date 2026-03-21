import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'CentroGO',
  description: 'O centro de Aracaju como um shopping a céu aberto. Descubra lojas, eventos e ganhe recompensas!',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo.png', sizes: '256x256', type: 'image/png' },
      { url: '/logo.png', sizes: '1024x1024', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
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
    <html lang="pt-BR">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased icons-no-container`}>
        <div className="min-h-screen w-full bg-background relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
