'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EsporScreen from '@/components/EsporScreen'
import BottomNav from '@/components/BottomNav'

// `?tab=prematch` opens the Maç Öncesi section (default: CANLI);
// `?game=<title>` preselects a game, e.g. from the Sporlar screen's E-Spor list.
function EsporContent() {
  const params = useSearchParams()
  const tab = params.get('tab') === 'prematch' ? 'prematch' : 'live'
  const game = params.get('game') ?? undefined
  return <EsporScreen initialTab={tab} initialGame={game} />
}

export default function EsporPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
        <EsporContent />
      </Suspense>
      <BottomNav />
    </>
  )
}
