'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PreMatchScreen from '@/components/PreMatchScreen'
import BottomNav from '@/components/BottomNav'

// `?tab=` picks the opening section: 0 CANLI, 1 Maç Öncesi (default), 2 E-Spor.
// The sports chooser on /?view=sports links straight to E-Spor with ?tab=2.
function PreMatchContent() {
  // Note: only parse when the param is actually present — Number(null) is 0,
  // which would silently open CANLI on a bare /prematch.
  const raw = useSearchParams().get('tab')
  const parsed = raw === null ? NaN : Number(raw)
  const initialTab = parsed === 0 || parsed === 2 ? parsed : 1
  return <PreMatchScreen initialTab={initialTab} />
}

export default function PreMatchPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
        <PreMatchContent />
      </Suspense>
      <BottomNav />
    </>
  )
}
