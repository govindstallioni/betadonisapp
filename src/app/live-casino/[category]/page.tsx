// Server component (no 'use client') so it can export generateStaticParams,
// which `output: 'export'` requires for every dynamic route. The UI below is
// still client-rendered — LiveCasinoCategoryScreen reads the slug with useParams().
import LiveCasinoCategoryScreen from '@/components/LiveCasinoCategoryScreen'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_SLUGS } from '@/components/liveCasinoData'

export function generateStaticParams() {
  return CATEGORY_SLUGS.map(c => ({ category: c.slug }))
}

export default function LiveCasinoCategoryPage() {
  return (
    <>
      <LiveCasinoCategoryScreen />
      <BottomNav />
    </>
  )
}
