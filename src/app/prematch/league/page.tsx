'use client'

import { Suspense } from 'react'
import PreMatchLeagueScreen from '@/components/PreMatchLeagueScreen'
import BottomNav from '@/components/BottomNav'

export default function PreMatchLeaguePage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#edf1f7]" />}>
        <PreMatchLeagueScreen />
      </Suspense>
      <BottomNav />
    </>
  )
}
