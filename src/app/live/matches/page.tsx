'use client'

import { Suspense } from 'react'
<<<<<<< HEAD
import LiveLeagueScreen from '@/components/LiveLeagueScreen'
=======
import LiveMatchDetail from '@/components/LiveMatchDetail'
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
import BottomNav from '@/components/BottomNav'

export default function LiveMatchesPage() {
  return (
    <>
<<<<<<< HEAD
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#edf1f7]" />}>
        <LiveLeagueScreen />
=======
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#f0f4f8]" />}>
        <LiveMatchDetail />
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
      </Suspense>
      <BottomNav />
    </>
  )
}
