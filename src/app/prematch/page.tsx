'use client'

import PreMatchScreen from '@/components/PreMatchScreen'
import BottomNav from '@/components/BottomNav'

export default function PreMatchPage() {
  return (
    <>
      <PreMatchScreen initialTab={1} />
      <BottomNav />
    </>
  )
}
