'use client'

import { Suspense } from 'react'
import LiveMatchDetail from '@/components/LiveMatchDetail'
import BottomNav from '@/components/BottomNav'

export default function LiveMatchesPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-[#f0f4f8]" />}>
        <LiveMatchDetail />
      </Suspense>
      <BottomNav />
    </>
  )
}
