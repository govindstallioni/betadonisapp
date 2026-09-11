'use client'

import { Suspense } from 'react'
import SanalBahisScreen from '@/components/SanalBahisScreen'
import BottomNav from '@/components/BottomNav'

export default function SanalBahisPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto min-h-screen bg-bg" />}>
        <SanalBahisScreen />
      </Suspense>
      <BottomNav />
    </>
  )
}
