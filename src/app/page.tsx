'use client'

<<<<<<< HEAD
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
import Header from '@/components/Header'
import CategoryTabs from '@/components/CategoryTabs'
import QuickFilters from '@/components/QuickFilters'
import GameCategories from '@/components/GameCategories'
import LiveBets from '@/components/LiveBets'
import TopPreMatch from '@/components/TopPreMatch'
import TopTournaments from '@/components/TopTournaments'
import TopProviders from '@/components/TopProviders'
import CasinoCategories from '@/components/CasinoCategories'
import InTheSpotlight from '@/components/InTheSpotlight'
import SelectedForYou from '@/components/SelectedForYou'
import DailyWheel from '@/components/DailyWheel'
import VirtualBets from '@/components/VirtualBets'
import PromoBanners from '@/components/PromoBanners'
import MegaJackpot from '@/components/MegaJackpot'
import TopEvents from '@/components/TopEvents'
import SonKazananlar from '@/components/SonKazananlar'
import EnsonKazananlar from '@/components/EnsonKazananlar'
import CarkiKazananlar from '@/components/CarkiKazananlar'
import BottomNav from '@/components/BottomNav'

<<<<<<< HEAD
function HomeContent() {
  // "Sporlar" tab navigates to /?view=sports — like 1xBet, only the sports
  // betting sections stay; casino / slots / virtual sections are hidden.
  const sportsOnly = useSearchParams().get('view') === 'sports'

=======
export default function HomePage() {
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative" style={{ overflowX: 'clip' }}>
      <div className="sticky top-0 z-50">
        <Header />
        <div className="bg-white"><CategoryTabs /></div>
      </div>
      <main className="px-4 pb-24">
        <div className="mt-2"><QuickFilters /></div>
        <div className="mt-3"><PromoBanners /></div>
<<<<<<< HEAD
        <div className="mt-4"><MegaJackpot /></div>
        <div className="mt-4"><TopEvents /></div>
        {!sportsOnly && <div className="mt-4"><SonKazananlar /></div>}
        <div className="mt-5"><LiveBets /></div>
        <div className="mt-3"><TopPreMatch /></div>
        {!sportsOnly && <div className="mt-3"><GameCategories /></div>}
        {!sportsOnly && <div className="mt-3"><CarkiKazananlar /></div>}
        <div className="mt-3"><TopTournaments /></div>
        {!sportsOnly && (
          <>
            <div className="mt-3"><TopProviders /></div>
            <div className="mt-3"><EnsonKazananlar /></div>
            <div className="mt-4"><CasinoCategories /></div>
            <div className="mt-4"><InTheSpotlight /></div>
            <div className="mt-4"><SelectedForYou /></div>
            <Link href="/sans-carki" className="block mt-3"><DailyWheel /></Link>
            <div className="mt-3"><VirtualBets /></div>
          </>
        )}
=======
        <div className="mt-3"><GameCategories /></div>
        <div className="mt-4"><MegaJackpot /></div>
        <div className="mt-4"><TopEvents /></div>
        <div className="mt-4"><SonKazananlar /></div>
        <div className="mt-5"><LiveBets /></div>
        <div className="mt-3"><TopPreMatch /></div>
        <div className="mt-3"><CarkiKazananlar /></div>
        <div className="mt-3"><TopTournaments /></div>
        <div className="mt-3"><TopProviders /></div>
        <div className="mt-3"><EnsonKazananlar /></div>
        <div className="mt-4"><CasinoCategories /></div>
        <div className="mt-4"><InTheSpotlight /></div>
        <div className="mt-4"><SelectedForYou /></div>
        <div className="mt-3"><DailyWheel /></div>
        <div className="mt-3"><VirtualBets /></div>
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
      </main>
      <BottomNav />
    </div>
  )
}
<<<<<<< HEAD

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <HomeContent />
    </Suspense>
  )
}
=======
>>>>>>> 4ff8f4c9ce07e2dfe914605d9ef135e12b22f971
