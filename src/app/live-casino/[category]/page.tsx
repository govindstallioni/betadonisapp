// Server component (no 'use client') so it can export generateStaticParams,
// which `output: 'export'` requires for every dynamic route. The UI below is
// still client-rendered — LiveCasinoCategoryScreen reads the slug with useParams().
import { Suspense } from 'react'
import LiveCasinoCategoryScreen from '@/components/LiveCasinoCategoryScreen'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_SLUGS } from '@/components/liveCasinoData'

export function generateStaticParams() {
  return CATEGORY_SLUGS.map(c => ({ category: c.slug }))
}

export default function LiveCasinoCategoryPage() {
  return (
    <>
      {/* useSearchParams (task 25's ?provider= filter) needs a Suspense
          boundary for static export's CSR bailout. */}
      <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
        <LiveCasinoCategoryScreen />
      </Suspense>
      <BottomNav />
    </>
  )
}
