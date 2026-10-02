'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import CategoryTabs from '@/components/CategoryTabs'
import QuickFilters from '@/components/QuickFilters'
import SportsTabStrip from '@/components/SportsTabStrip'
import CallMeCard from '@/components/CallMeCard'
import AdcCard from '@/components/AdcCard'
import GameCategories from '@/components/GameCategories'
import LiveBets from '@/components/LiveBets'
import TopPreMatch from '@/components/TopPreMatch'
import TodaysParlays from '@/components/TodaysParlays'
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
import Footer from '@/components/Footer'
import { DEFAULT_ORDER, blockDef, loadHomepageLayout, visibleBlockIds, type HomepageLayout } from '@/data/homepageLayout'

// Task 2: the homepage blocks below render from this map, keyed by id, so
// "Giriş Sayfası Düzeni" (Settings) can reorder and show/hide them — see
// src/data/homepageLayout.ts for the id list and src/components/settings/
// HomepageLayoutScreen.tsx for the editor itself.
const BLOCK_RENDERERS: Record<string, () => React.ReactNode> = {
  promo: () => <PromoBanners />,
  adc: () => <AdcCard />,
  callme: () => <CallMeCard />,
  megajackpot: () => <MegaJackpot />,
  topevents: () => <TopEvents />,
  sonkazananlar: () => <SonKazananlar />,
  livebets: () => <LiveBets />,
  toppreMatch: () => <TopPreMatch />,
  todaysparlays: () => <TodaysParlays />,
  gamecategories: () => <GameCategories />,
  carkikazananlar: () => <CarkiKazananlar />,
  toptournaments: () => <TopTournaments />,
  topproviders: () => <TopProviders />,
  ensonkazananlar: () => <EnsonKazananlar />,
  casinocategories: () => <CasinoCategories />,
  inthespotlight: () => <InTheSpotlight />,
  selectedforyou: () => <SelectedForYou />,
  dailywheel: () => <Link href="/sans-carki" className="block"><DailyWheel /></Link>,
  virtualbets: () => <VirtualBets />,
}

function HomeContent() {
  // "Sporlar" tab navigates to /?view=sports — like 1xBet, only the sports
  // betting sections stay; casino / slots / virtual sections are hidden.
  const sportsOnly = useSearchParams().get('view') === 'sports'

  // Layout is read from localStorage after mount (static export + per-device
  // preference, same hydration-safe pattern as Favorites/Withdrawals): the
  // default order renders first so SSR/first paint never mismatch, then the
  // user's saved order swaps in once available.
  const [layout, setLayout] = useState<HomepageLayout>({ order: DEFAULT_ORDER, hidden: [] })
  useEffect(() => { setLayout(loadHomepageLayout()) }, [])

  const ids = visibleBlockIds(layout, sportsOnly)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative" style={{ overflowX: 'clip' }}>
      <div className="sticky top-0 z-50">
        <Header />
        <div className="bg-white"><CategoryTabs /></div>
      </div>
      <main className="px-3 pb-24">
        {/* Sports section chooser — only on the "Sporlar" view (task 24 item 8) */}
        {sportsOnly && <div className="mt-3"><SportsTabStrip /></div>}
        <div className="mt-2"><QuickFilters /></div>
        {ids.map(id => (
          <div key={id} className={blockDef(id)?.mt ?? 'mt-3'}>{BLOCK_RENDERERS[id]()}</div>
        ))}
        <Footer />
      </main>
      <BottomNav />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-[430px] mx-auto bg-bg min-h-screen" />}>
      <HomeContent />
    </Suspense>
  )
}
