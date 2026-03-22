'use client'

import dynamic from 'next/dynamic'

const HomePageClient = dynamic(() => import('@/components/home-page-client'), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-background" />,
})

export function HomePageClientOnly() {
  return <HomePageClient />
}
