'use client'

import { Suspense } from 'react'
import GameScreen from '@/components/GameScreen'

export default function GamePage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-[#eef2f7] min-h-screen" />}>
      <GameScreen />
    </Suspense>
  )
}
