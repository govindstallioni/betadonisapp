'use client'

import PreMatchScreen from '@/components/PreMatchScreen'
import BottomNav from '@/components/BottomNav'

export default function LivePage() {
  return (
    <>
      <PreMatchScreen initialTab={0} />
      <BottomNav />
    </>
  )
}
