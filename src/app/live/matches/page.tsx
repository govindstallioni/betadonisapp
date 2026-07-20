'use client'

import { Suspense } from 'react'
import LiveLeagueScreen from '@/components/LiveLeagueScreen'
import BottomNav from '@/components/BottomNav'

export default function LiveMatchesPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#edf1f7]" />}>
        <LiveLeagueScreen />
      </Suspense>
      <BottomNav />
    </>
  )
}
