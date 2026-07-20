'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import MatchDetailScreen from '@/components/MatchDetailScreen'
import BottomNav from '@/components/BottomNav'

function MatchContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || undefined
  return (
    <>
      <MatchDetailScreen matchId={id} />
      <BottomNav />
    </>
  )
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <MatchContent />
    </Suspense>
  )
}
