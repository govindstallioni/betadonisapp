// Server component (no 'use client') so it can export generateStaticParams,
// which `output: 'export'` requires for every dynamic route. The UI below is
// still client-rendered — SlotCategoryScreen reads the slug with useParams().
import SlotCategoryScreen from '@/components/SlotCategoryScreen'
import BottomNav from '@/components/BottomNav'
import { SLOT_CATEGORIES, EXTRA_CATEGORY_LABELS } from '@/components/slotGamesData'

export function generateStaticParams() {
  const slugs = new Set([
    ...SLOT_CATEGORIES.map(c => c.slug),
    ...Object.keys(EXTRA_CATEGORY_LABELS),
  ])
  return [...slugs].map(slug => ({ slug }))
}

export default function SlotCategoryPage() {
  return (
    <>
      <SlotCategoryScreen />
      <BottomNav />
    </>
  )
}
