'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import EventDetail from '@/components/EventDetail'
import BottomNav from '@/components/BottomNav'

function EventContent() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Event'
  const color = searchParams.get('color') || '#0E8FCF'

  return (
    <>
      <EventDetail event={{ title, color }} />
      <BottomNav />
    </>
  )
}

export default function EventPage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <EventContent />
    </Suspense>
  )
}
