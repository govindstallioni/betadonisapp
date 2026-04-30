'use client'

import { Suspense } from 'react'
import LiveSportScreen from '@/components/LiveSportScreen'
import BottomNav from '@/components/BottomNav'

export default function LiveSportPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#f0f4f8]" />}>
        <LiveSportScreen />
      </Suspense>
      <BottomNav />
    </>
  )
}
