'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LeagueDetail from '@/components/LeagueDetail'
import BottomNav from '@/components/BottomNav'

function LeagueContent() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Lig'
  const color = searchParams.get('color') || '#0E8FCF'

  return (
    <>
      <LeagueDetail league={{ title, color }} />
      <BottomNav />
    </>
  )
}

export default function LeaguePage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <LeagueContent />
    </Suspense>
  )
}
