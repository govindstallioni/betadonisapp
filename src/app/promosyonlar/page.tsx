'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PromosyonlarScreen from '@/components/PromosyonlarScreen'
import BottomNav from '@/components/BottomNav'

// `?promo=<id>` jumps to that promotion and opens its rules popup.
function PromosyonlarContent() {
  const promo = useSearchParams().get('promo') ?? undefined
  return <PromosyonlarScreen focusId={promo} />
}

export default function PromosyonlarPage() {
  return (
    <>
      <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
        <PromosyonlarContent />
      </Suspense>
      <BottomNav />
    </>
  )
}
