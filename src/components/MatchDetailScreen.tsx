'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NotifyBell from '@/components/NotifyBell'
import FavoriteStar from '@/components/FavoriteStar'
import { useBetSlip } from '@/components/BetSlipProvider'
import { MATCH_RESULT } from '@/data/markets'
import OddLock, { isSuspended } from '@/components/OddLock'

// ── Static match data ──────────────────────────────────────────

const matchesData = [
  {
    id: 'gal-fen',
    sport: 'Futbol',
    league: 'Türkiye. Süper Lig',
    leagueSub: 'Hafta 34. Türkiye',
    team1: 'Galatasaray',
    team2: 'Fenerbahçe',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    score1: 2,
    score2: 1,
    isLive: true,
    hasStream: true,
    minute: "67'",
    half: '2Y',
    dateTime: '04.04.2026 (09:00 pm)',
  },
  {
    id: 'mci-ars',
    sport: 'Futbol',
    league: 'İngiltere. Premier Lig',
    leagueSub: 'Hafta 30. İngiltere',
    team1: 'Manchester City',
    team2: 'Arsenal',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 0,
    score2: 0,
    isLive: true,
    hasStream: true,
    minute: "23'",
    half: '1Y',
    dateTime: '04.04.2026 (10:00 pm)',
  },
  {
    id: 'rma-bar',
    sport: 'Futbol',
    league: 'İspanya. La Liga',
    leagueSub: 'Hafta 28. İspanya',
    team1: 'Real Madrid',
    team2: 'Barcelona',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 1,
    score2: 2,
    isLive: true,
    hasStream: false,
    minute: "78'",
    half: '2Y',
    dateTime: '04.04.2026 (10:00 pm)',
  },
  {
    id: 'bes-tra',
    sport: 'Futbol',
    league: 'Türkiye. Süper Lig',
    leagueSub: 'Hafta 35. Türkiye',
    team1: 'Beşiktaş',
    team2: 'Trabzonspor',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '04', minutes: '12', seconds: '36' },
    dateTime: '05.04.2026 (08:00 pm)',
  },
  {
    id: 'liv-che',
    sport: 'Futbol',
    league: 'İngiltere. Premier Lig',
    leagueSub: 'Hafta 31. İngiltere',
    team1: 'Liverpool',
    team2: 'Chelsea',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '06', minutes: '45', seconds: '10' },
    dateTime: '06.04.2026 (10:00 pm)',
  },
  {
    id: 'atl-sev',
    sport: 'Futbol',
    league: 'İspanya. La Liga',
    leagueSub: 'Hafta 29. İspanya',
    team1: 'Atletico Madrid',
    team2: 'Sevilla',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '03', minutes: '24', seconds: '15' },
    dateTime: '05.04.2026 (07:30 pm)',
  },
  {
    id: 'gs-bay',
    sport: 'Futbol',
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueSub: 'Grup A. Avrupa',
    team1: 'Galatasaray',
    team2: 'Bayern Münih',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '03', minutes: '34', seconds: '24' },
    dateTime: '28.03.26 07:30 pm',
  },
  {
    id: 'rma-mci',
    sport: 'Futbol',
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueSub: 'Grup B. Avrupa',
    team1: 'Real Madrid',
    team2: 'Manchester City',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '05', minutes: '12', seconds: '48' },
    dateTime: '28.03.26 10:00 pm',
  },
  {
    id: 'bos-gsw',
    sport: 'Basketbol',
    league: 'ABD, NBA',
    leagueSub: 'Basketbol',
    team1: 'Boston Celtics',
    team2: 'Golden State Warriors',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '08', minutes: '20', seconds: '10' },
    dateTime: '25.03.26 (09:00 pm)',
  },
  {
    id: 'sin-zve',
    sport: 'Tenis',
    league: 'ATP, Masters 1000',
    leagueSub: 'Tenis',
    team1: 'Sinner',
    team2: 'Zverev',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '02', minutes: '45', seconds: '30' },
    dateTime: '26.03.26 (06:00 pm)',
  },
  {
    id: 'vak-ecz',
    sport: 'Voleybol',
    league: 'Türkiye, Sultanlar Ligi',
    leagueSub: 'Voleybol',
    team1: 'VakıfBank',
    team2: 'Eczacıbaşı',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '01', minutes: '30', seconds: '00' },
    dateTime: '27.03.26 (07:00 pm)',
  },
  {
    id: 'tor-bos',
    sport: 'Buz Hokeyi',
    league: 'ABD, NHL',
    leagueSub: 'Buz Hokeyi',
    team1: 'Toronto Maple Leafs',
    team2: 'Boston Bruins',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '03', minutes: '05', seconds: '55' },
    dateTime: '28.03.26 (08:30 pm)',
  },
  {
    id: 'thw-bar',
    sport: 'Hentbol',
    league: 'EHF, Şampiyonlar Ligi',
    leagueSub: 'Hentbol',
    team1: 'THW Kiel',
    team2: 'Barcelona',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: true,
    countdown: { hours: '02', minutes: '15', seconds: '40' },
    dateTime: '26.03.26 (08:45 pm)',
  },
  {
    id: 'nyy-lad',
    sport: 'Beyzbol',
    league: 'ABD, MLB',
    leagueSub: 'Beyzbol',
    team1: 'New York Yankees',
    team2: 'LA Dodgers',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '06', minutes: '40', seconds: '12' },
    dateTime: '29.03.26 (02:10 am)',
  },
  // ── Pre-match league fixtures (PreMatchLeagueScreen's matchId targets) ──
  {
    id: 'ars-atm',
    sport: 'Futbol',
    league: 'UEFA Şampiyonlar Ligi',
    leagueSub: 'Futbol',
    team1: 'Arsenal',
    team2: 'Atletico Madrid',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: true,
    countdown: { hours: '04', minutes: '20', seconds: '00' },
    dateTime: '06.05.26 (12:30 pm)',
  },
  {
    id: 'bay-psg',
    sport: 'Futbol',
    league: 'UEFA Şampiyonlar Ligi',
    leagueSub: 'Futbol',
    team1: 'Bayern Münih',
    team2: 'Paris Saint-Germain',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '05', minutes: '45', seconds: '30' },
    dateTime: '07.05.26 (12:30 pm)',
  },
  {
    // Return fixture — the derby's live leg is `gal-fen` above; this is the
    // upcoming one the pre-match league list links to.
    id: 'gal-fen-pm',
    sport: 'Futbol',
    league: 'Türkiye. Süper Lig',
    leagueSub: 'Futbol',
    team1: 'Galatasaray',
    team2: 'Fenerbahçe',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: true,
    countdown: { hours: '07', minutes: '10', seconds: '05' },
    dateTime: '08.05.26 (09:00 pm)',
  },
  {
    id: 'mci-liv',
    sport: 'Futbol',
    league: 'İngiltere. Premier Ligi',
    leagueSub: 'Futbol',
    team1: 'Manchester City',
    team2: 'Liverpool',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    hasStream: true,
    countdown: { hours: '02', minutes: '55', seconds: '18' },
    dateTime: '10.05.26 (06:30 pm)',
  },
  {
    id: 'che-mun',
    sport: 'Futbol',
    league: 'İngiltere. Premier Ligi',
    leagueSub: 'Futbol',
    team1: 'Chelsea',
    team2: 'Manchester United',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    hasStream: false,
    countdown: { hours: '05', minutes: '25', seconds: '44' },
    dateTime: '10.05.26 (09:00 pm)',
  },
]

const defaultMatch = matchesData[0]

// ── Static market data ─────────────────────────────────────────

interface MarketRow { label: string; value: string }

interface Market {
  title: string
  tabs: number[]
  // Sports this market applies to. Omitted = offered on every sport (1X2,
  // Handikap, Toplam…). Without this every fixture got all 15 markets, so a
  // basketball match offered corners and a football match offered a cricket
  // coin toss.
  sports?: string[]
  pinned?: boolean
  subCount?: number
  rows: MarketRow[][]
}

// Sport groupings used by the `sports` gate above.
const GOAL_SPORTS = ['Futbol', 'Buz Hokeyi', 'Hentbol']   // scored in goals
const DRAW_SPORTS = ['Futbol', 'Buz Hokeyi', 'Hentbol']   // a draw is possible
const HALF_SPORTS = ['Futbol', 'Basketbol', 'Hentbol']    // played in two halves

// Odds display — always two decimals, the way Betadonis prices them. The static
// market data below mixes precision (2.515, 2.4, 55), so an unformatted "55"
// reads like a broken value sitting next to "2.515" even though 55.00 is a
// legitimate price for a near-impossible outcome.
function formatOdd(value: string): string {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n.toFixed(2) : value
}

// The match-result market ("Maç Sonucu" in betting parlance) — the one market
// pre-match fixtures open by default. Kept as a named constant so the default
// doesn't silently break if the market is reordered or retitled.
const MATCH_RESULT_MARKET = MATCH_RESULT

const allMarkets: Market[] = [
  {
    title: MATCH_RESULT,
    tabs: [0],
    pinned: true,
    rows: [
      [
        { label: 'Ev1', value: '2.515' },
        { label: 'X', value: '55' },
        { label: 'Dep2', value: '1.558' },
      ],
    ],
  },
  {
    title: 'Toss Kazananı',
    tabs: [0],
    sports: ['Kriket'],
    pinned: true,
    rows: [
      [
        { label: 'Takım 1', value: '1.95' },
        { label: 'Takım 2', value: '1.95' },
      ],
    ],
  },
  {
    title: 'Toss / Maç',
    tabs: [0],
    sports: ['Kriket'],
    pinned: true,
    rows: [
      [
        { label: 'Takım 1/Takım 1', value: '4.635' },
        { label: 'Takım 2/Takım 2', value: '2.876' },
      ],
      [
        { label: 'Takım 1/Takım 2', value: '3.02' },
        { label: 'Takım 2/Takım 1', value: '5.03' },
      ],
    ],
  },
  {
    title: 'Toplam',
    tabs: [1],
    pinned: true,
    rows: [
      [
        { label: 'Üst (389.5)', value: '2.4' },
        { label: 'Alt (379.5)', value: '1.85' },
      ],
      [
        { label: 'Üst (399.5)', value: '2.8' },
      ],
    ],
  },
  {
    title: 'Toplam 1',
    tabs: [1],
    subCount: 42,
    rows: [
      [
        { label: '(185.5) Üst', value: '1.92' },
        { label: '(185.5) Alt', value: '1.92' },
      ],
    ],
  },
  {
    title: 'Toplam 2',
    tabs: [1],
    subCount: 42,
    rows: [
      [
        { label: '(193.5) Üst', value: '1.92' },
        { label: '(193.5) Alt', value: '1.92' },
      ],
    ],
  },
  {
    title: 'Beraberlik',
    tabs: [0],
    sports: DRAW_SPORTS,
    rows: [
      [
        { label: 'Evet', value: '55' },
        { label: 'Hayır', value: '1.003' },
      ],
    ],
  },
  {
    title: 'Takım Galibiyetleri',
    tabs: [0],
    rows: [
      [
        { label: 'Takım 1', value: '1.85' },
        { label: 'Takım 2', value: '1.95' },
      ],
    ],
  },
  {
    title: 'Çifte Şans',
    tabs: [0],
    sports: DRAW_SPORTS,
    pinned: true,
    rows: [
      [
        { label: '1X', value: '1.25' },
        { label: '12', value: '1.10' },
        { label: 'X2', value: '1.35' },
      ],
    ],
  },
  {
    title: 'Handikap',
    tabs: [2],
    subCount: 6,
    rows: [
      [
        { label: 'Takım 1 (-1.5)', value: '3.20' },
        { label: 'Takım 2 (+1.5)', value: '1.32' },
      ],
      [
        { label: 'Takım 1 (+1.5)', value: '1.35' },
        { label: 'Takım 2 (-1.5)', value: '3.10' },
      ],
    ],
  },
  {
    title: 'Toplam Korner',
    tabs: [3],
    sports: ['Futbol'],
    subCount: 6,
    rows: [
      [
        { label: 'Üst (9.5)', value: '1.90' },
        { label: 'Alt (9.5)', value: '1.90' },
      ],
      [
        { label: 'Üst (10.5)', value: '2.10' },
        { label: 'Alt (10.5)', value: '1.72' },
      ],
    ],
  },
  {
    title: 'İlk Korner',
    tabs: [3],
    sports: ['Futbol'],
    rows: [
      [
        { label: 'Ev Sahibi', value: '1.85' },
        { label: 'Deplasman', value: '1.95' },
      ],
    ],
  },
  {
    title: 'Karşılıklı Gol',
    tabs: [0],
    sports: GOAL_SPORTS,
    rows: [
      [
        { label: 'Evet', value: '1.72' },
        { label: 'Hayır', value: '2.05' },
      ],
    ],
  },
  {
    title: 'İlk Yarı Sonucu',
    tabs: [0],
    sports: HALF_SPORTS,
    rows: [
      [
        { label: 'Ev1', value: '3.40' },
        { label: 'X', value: '2.10' },
        { label: 'Dep2', value: '2.60' },
      ],
    ],
  },
  {
    title: 'Doğru Skor',
    tabs: [0],
    sports: GOAL_SPORTS,
    subCount: 28,
    rows: [
      [
        { label: '1-0', value: '7.50' },
        { label: '0-1', value: '6.00' },
        { label: '1-1', value: '5.50' },
      ],
      [
        { label: '2-0', value: '12.00' },
        { label: '0-2', value: '10.00' },
        { label: '2-1', value: '9.00' },
      ],
    ],
  },
]

const filterTabs = ['Ana Bahisler', 'Alt/Üst', 'Handikap', 'Kornerler']
const subTabs = ['Normal Süre', 'Alternatif Sonuçlar', 'Akümülatör']

// Short static explanation shown in each market's info popover.
const MARKET_INFO: Record<string, string> = {
  [MATCH_RESULT]: 'Maçı hangi takımın kazanacağını (ya da berabere biteceğini) tahmin edin.',
  'Toss Kazananı': 'Maç öncesi yapılan toss\'u hangi takımın kazanacağını tahmin edin.',
  'Toss / Maç': 'Toss\'u kazanan takım ile maçı kazanan takımın kombinasyonunu tahmin edin.',
  'Toplam': 'Maçtaki toplam gol sayısının belirlenen sınırın üstünde mi altında mı olacağını tahmin edin.',
  'Toplam 1': 'Ev sahibi takımın atacağı toplam gol sayısının sınırın üstünde mi altında mı olacağını tahmin edin.',
  'Toplam 2': 'Deplasman takımının atacağı toplam gol sayısının sınırın üstünde mi altında mı olacağını tahmin edin.',
  'Beraberlik': 'Maçın berabere bitip bitmeyeceğini tahmin edin.',
  'Takım Galibiyetleri': 'Maçı kazanacak takımı tahmin edin (beraberlik seçeneği olmadan).',
  'Çifte Şans': 'İki olası sonucu tek bahiste birleştirerek kazanma şansınızı artırın.',
  'Handikap': 'Bir takıma sanal gol avantajı/dezavantajı tanınarak maç sonucunu tahmin edin.',
  'Karşılıklı Gol': 'Her iki takımın da maçta en az bir gol atıp atmayacağını tahmin edin.',
  'İlk Yarı Sonucu': 'Sadece ilk yarının sonucunu (1, X ya da 2) tahmin edin.',
  'Doğru Skor': 'Maçın tam olarak hangi skorla biteceğini tahmin edin.',
  'Toplam Korner': 'Maçtaki toplam korner sayısının belirlenen sınırın üstünde mi altında mı olacağını tahmin edin.',
  'İlk Korner': 'Maçın ilk kornerini hangi takımın kullanacağını tahmin edin.',
}

// Deterministic "demo" stat generator — same technique as megaJackpotData's
// hashPool: no live-stats feed exists, so numbers are derived from the match
// id (stable per match, not random per render) rather than fabricated live data.
function hashStat(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return min + (hash % (max - min + 1))
}

const HERO_TABS = ['Genel Bakış', 'Saha', 'İstatistik']

// ── Exported lookup helper ─────────────────────────────────────

export function getMatchById(id: string) {
  return matchesData.find(m => m.id === id) || defaultMatch
}

export function getAllMatchIds() {
  return matchesData.map(m => m.id)
}

// ── Component ──────────────────────────────────────────────────

export default function MatchDetailScreen({ matchId }: { matchId?: string }) {
  const router = useRouter()
  const match = matchId ? getMatchById(matchId) : defaultMatch

  const [activeFilter, setActiveFilter] = useState(0)
  const [activeSubTab, setActiveSubTab] = useState(0)
  // Defaults to the first 4 markets of whichever tab is active — see the
  // effect below, which recomputes this whenever the active tab changes.
  const [expandedMarkets, setExpandedMarkets] = useState<Set<number>>(new Set())
  const { has, toggle } = useBetSlip()

  // ── Hero swipeable panel (Genel Bakış / Saha / İstatistik) ──
  // Matches with a live stream open straight on the Saha (broadcast) slide,
  // which itself defaults to our own simulator over the real video feed.
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(match.isLive && match.hasStream ? 1 : 0)
  const [showVideo, setShowVideo] = useState(false)
  const scrollToSlide = (i: number) => {
    const el = heroScrollRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
    setActiveSlide(i)
  }
  const handleHeroScroll = () => {
    const el = heroScrollRef.current
    if (!el || el.clientWidth === 0) return
    setActiveSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Jump (no animation) to the initial slide once the panel has laid out.
  useEffect(() => {
    const el = heroScrollRef.current
    if (!el || activeSlide === 0) return
    el.scrollTo({ left: activeSlide * el.clientWidth })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Market info popover ──
  const [infoOpenFor, setInfoOpenFor] = useState<string | null>(null)

  // Markets offered for this fixture's sport — a market with no `sports` list
  // is universal. Everything downstream filters from here, so corners can never
  // reach a basketball fixture.
  const sportMarkets = allMarkets.filter(m => !m.sports || m.sports.includes(match.sport))
  // Category tabs with nothing to show for this sport are hidden rather than
  // opening on "Bu kategoride bahis bulunamadı."
  const availableFilters = filterTabs
    .map((label, i) => ({ label, i }))
    .filter(({ i }) => sportMarkets.some(m => m.tabs.includes(i)))
  const safeFilter = availableFilters.some(f => f.i === activeFilter)
    ? activeFilter
    : (availableFilters[0]?.i ?? 0)

  const visibleMarkets = sportMarkets.filter(m => m.tabs.includes(safeFilter))
  const visibleIndices = visibleMarkets.map(m => allMarkets.indexOf(m))

  // Re-default whenever the active market-category tab changes. Live matches
  // keep task 19's "first 4 open"; pre-match opens only the match-result market
  // (1X2) per task 24 — everything else starts collapsed. The "Tümünü Aç/Kapat"
  // control below still expands the lot in one tap on either.
  useEffect(() => {
    if (match.isLive) {
      setExpandedMarkets(new Set(visibleIndices.slice(0, 4)))
      return
    }
    const resultIdx = visibleIndices.filter(i => allMarkets[i].title === MATCH_RESULT_MARKET)
    setExpandedMarkets(new Set(resultIdx.length > 0 ? resultIdx : visibleIndices.slice(0, 1)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeFilter, match.isLive, match.sport])

  const toggleMarket = (i: number) => {
    setExpandedMarkets(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const allVisibleExpanded = visibleIndices.length > 0 && visibleIndices.every(i => expandedMarkets.has(i))
  const toggleAllMarkets = () => {
    setExpandedMarkets(prev => {
      if (allVisibleExpanded) {
        const next = new Set(prev)
        visibleIndices.forEach(i => next.delete(i))
        return next
      }
      return new Set([...prev, ...visibleIndices])
    })
  }

  // Stable id per outcome so the same pick dedupes across market tabs and screens.
  const oddId = (marketTitle: string, label: string) => `${match.id}::${marketTitle}::${label}`
  const pickOdd = (marketTitle: string, odd: MarketRow) => toggle({
    id: oddId(marketTitle, odd.label),
    league: match.league,
    match: `${match.team1} - ${match.team2}`,
    market: marketTitle,
    pick: odd.label,
    baseOdd: parseFloat(odd.value) || 1,
    isLive: match.isLive,
    sport: match.sport,
  })

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative pb-20">

      {/* ── Header bar ── */}
      <div className="bg-[#2c3e50]">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-[13px] font-semibold text-white truncate max-w-[220px] text-center">{match.league}</h1>
          <div className="flex items-center gap-1">
            <FavoriteStar
              size={18}
              inactiveStroke="white"
              activeColor="#f5b301"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              item={{
                type: 'event',
                id: match.id,
                title: `${match.team1} - ${match.team2}`,
                subtitle: match.league,
                href: `/match?id=${match.id}`,
                logo1: match.logo1,
                logo2: match.logo2,
                score1: match.isLive ? match.score1 : undefined,
                score2: match.isLive ? match.score2 : undefined,
                isLive: match.isLive,
              }}
            />
            <NotifyBell size={18} stroke="white" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" />
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>
        </div>
        {match.leagueSub && (
          <div className="flex items-center justify-center pb-2.5">
            <div className="bg-white/10 rounded-full px-3 py-[3px]">
              <span className="text-[10px] text-white/70 font-medium">{match.leagueSub}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Hero banner (swipeable: Genel Bakış / Saha / İstatistik) ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/events/bannerbg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1a3a52]/85" />
        </div>

        <div
          ref={heroScrollRef}
          onScroll={handleHeroScroll}
          className="relative flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
        {/* ── Slide 1: Genel Bakış ── */}
        <div className="w-full flex-shrink-0 snap-center px-5 pt-7 pb-5">
          {/* Teams */}
          <div className="flex items-start justify-center gap-4">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-2.5 flex-1">
              <div className="relative">
                <div className="w-[76px] h-[76px] rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <img src={match.logo1} alt={match.team1} className="w-[54px] h-[54px] object-contain" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#0E8FCF] flex items-center justify-center border-2 border-[#1a3a52]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-white text-center leading-tight max-w-[90px]">{match.team1}</span>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-1 pt-2 min-w-[100px]">
              {match.isLive && match.score1 !== undefined ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-[32px] font-extrabold text-white leading-none">{match.score1}</span>
                    <span className="text-[20px] font-bold text-white/30 leading-none">:</span>
                    <span className="text-[32px] font-extrabold text-white leading-none">{match.score2}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
                    <span className="text-[11px] text-[#e74c3c] font-semibold">{match.minute} {match.half}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[24px] font-extrabold text-white/80 leading-none tracking-wider">VS</span>
                  {match.countdown && (
                    <>
                      <span className="text-[9px] text-white/40 font-medium mt-3 uppercase tracking-wider">Başlama</span>
                      <div className="flex items-center gap-[4px] mt-1.5">
                        {[match.countdown.hours, match.countdown.minutes, match.countdown.seconds].map((val, vi) => (
                          <span key={vi} className="flex items-center gap-[4px]">
                            <span className="bg-white/15 backdrop-blur-sm text-white text-[13px] font-bold rounded-lg px-[9px] py-[5px] leading-none min-w-[32px] text-center">{val}</span>
                            {vi < 2 && <span className="text-white/40 font-bold text-[13px]">:</span>}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center gap-2.5 flex-1">
              <div className="relative">
                <div className="w-[76px] h-[76px] rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <img src={match.logo2} alt={match.team2} className="w-[54px] h-[54px] object-contain" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#0E8FCF] flex items-center justify-center border-2 border-[#1a3a52]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-white text-center leading-tight max-w-[90px]">{match.team2}</span>
            </div>
          </div>

          {/* Date */}
          {match.dateTime && (
            <p className="text-[10px] text-white/40 text-center mt-4 font-medium">{match.dateTime}</p>
          )}
        </div>

        {/* ── Slide 2: Saha ── */}
        <div className="w-full flex-shrink-0 snap-center px-5 pt-4 pb-4">
          <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden border border-white/15" style={{ background: showVideo ? '#0a0f14' : 'linear-gradient(180deg, #2e7d46 0%, #1f6337 100%)' }}>
            {showVideo ? (
              /* Video placeholder — no live-stream backend exists, so this follows
                 the same "external provider, connection pending" convention used
                 by ProviderPlay.tsx / SanalBahisScreen.tsx rather than faking a feed. */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <p className="text-[11px] text-white/70 font-medium">Video yayını harici sağlayıcıdan yüklenir</p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-[#f59e0b]/40 px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                  <span className="text-[9px] font-semibold text-[#f59e0b]">Sağlayıcı bağlantısı bekleniyor</span>
                </div>
              </div>
            ) : (
              <>
                {/* Pitch markings */}
                <div className="absolute inset-2 border border-white/30 rounded-sm" />
                <div className="absolute top-2 bottom-2 left-1/2 w-px bg-white/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] aspect-square rounded-full border border-white/30" />
                <div className="absolute top-1/2 left-2 -translate-y-1/2 w-[8%] aspect-square border border-white/30" style={{ borderLeft: 'none' }} />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 w-[8%] aspect-square border border-white/30" style={{ borderRight: 'none' }} />
                {/* Team badges at each end */}
                <img src={match.logo1} alt="" className="absolute top-1/2 left-[8%] -translate-y-1/2 w-6 h-6 object-contain drop-shadow" />
                <img src={match.logo2} alt="" className="absolute top-1/2 right-[8%] -translate-y-1/2 w-6 h-6 object-contain drop-shadow" />
                {/* Ball / status overlay */}
                {match.isLive ? (
                  <>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-white animate-pulse-dot" />
                    {match.half === 'HT' && (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">Devre Arası</span>
                    )}
                  </>
                ) : (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">Maç Başlamadı</span>
                )}
              </>
            )}
          </div>
          {match.hasStream && (
            <button
              onClick={() => setShowVideo(v => !v)}
              className="w-full mt-3 h-[36px] rounded-full flex items-center justify-center gap-2 text-[12px] font-bold transition-colors"
              style={showVideo ? { background: 'rgba(255,255,255,0.1)', color: '#fff' } : { background: '#0E8FCF', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              {showVideo ? 'Simülatörü Göster' : 'Video Yayınını İzle'}
            </button>
          )}
        </div>

        {/* ── Slide 3: İstatistik ── */}
        <div className="w-full flex-shrink-0 snap-center px-5 pt-6 pb-5">
          <div className="flex flex-col gap-3">
            {[
              { label: 'Topla Oynama', key: 'poss' },
              { label: 'İsabetli Şut', key: 'shots' },
              { label: 'Korner', key: 'corner' },
              { label: 'Faul', key: 'foul' },
            ].map(({ label, key }) => {
              const v1 = hashStat(`${match.id}-${key}-1`, 20, 80)
              const v2 = 100 - v1
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-[10px] text-white/70 font-medium mb-1">
                    <span>{v1}</span>
                    <span>{label}</span>
                    <span>{v2}</span>
                  </div>
                  <div className="flex h-[5px] rounded-full overflow-hidden bg-white/10">
                    <div className="bg-[#0E8FCF]" style={{ width: `${v1}%` }} />
                    <div className="bg-white/40" style={{ width: `${v2}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </div>

        {/* Dots */}
        <div className="relative flex items-center justify-center gap-1.5 mt-3">
          {HERO_TABS.map((_, i) => (
            <button key={i} onClick={() => scrollToSlide(i)} className="p-1 -m-1" aria-label={`Slayt ${i + 1}`}>
              <span className={`block w-[16px] h-[3px] rounded-full transition-colors ${activeSlide === i ? 'bg-white' : 'bg-white/25'}`} />
            </button>
          ))}
        </div>

        {/* Icon row */}
        <div className="relative flex items-center justify-center gap-5 mt-2 pb-4">
          {HERO_TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => scrollToSlide(i)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeSlide === i ? 'text-white' : 'text-white/40'}`}
            >
              {i === 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>}
              {i === 1 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M12 5v14M3 12h18" /><circle cx="12" cy="12" r="3" /></svg>}
              {i === 2 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>}
              <span className="text-[8px] font-semibold whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="bg-white px-4 py-3">
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
          {availableFilters.map(({ label, i }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-[14px] py-[8px] text-[11px] font-medium transition-all ${
                safeFilter === i
                  ? 'bg-[#0E8FCF] text-white'
                  : 'bg-white text-[#1a2332] border border-[#d0d5dd]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="bg-white border-b border-[#e8ecf1]">
        <div className="flex items-center px-4 overflow-x-auto scrollbar-hide">
          <button
            onClick={toggleAllMarkets}
            aria-label={allVisibleExpanded ? 'Tümünü Kapat' : 'Tümünü Aç'}
            aria-pressed={allVisibleExpanded}
            className="flex-shrink-0 pr-3 py-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={allVisibleExpanded ? '#0E8FCF' : '#737B8C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          {subTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(i)}
              className={`flex-shrink-0 px-3 py-3 text-[11px] font-medium relative whitespace-nowrap transition-colors ${
                activeSubTab === i ? 'text-[#1a2332]' : 'text-[#737B8C]'
              }`}
            >
              {tab}
              {activeSubTab === i && (
                <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#27ae60] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Markets: collapsible per-market sections, filtered by the active tab ── */}
      <div className="bg-white">
        {visibleMarkets.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[12px] text-[#94a3b8]">Bu kategoride bahis bulunamadı.</p>
          </div>
        ) : (
          <div className="px-4 pt-2">
            {visibleMarkets.map((market) => {
              const globalIdx = allMarkets.indexOf(market)
              const isOpen = expandedMarkets.has(globalIdx)
              return (
                <div key={market.title} className="border-b border-[#f0f2f5] last:border-b-0">
                  <div className="flex items-center justify-between py-3.5">
                    <button
                      onClick={() => toggleMarket(globalIdx)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                    >
                      <span className="text-[11px] text-[#737B8C] font-medium flex-shrink-0">
                        ({market.subCount ?? market.rows.flat().length})
                      </span>
                      <span className="text-[12px] font-bold text-[#1a2332] truncate">{market.title}</span>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setInfoOpenFor(prev => (prev === market.title ? null : market.title))}
                        aria-label={`${market.title} hakkında bilgi`}
                        className="w-4 h-4 rounded-full border border-[#c0c8d4] flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-[8px] text-[#94a3b8] font-bold leading-none">i</span>
                      </button>
                      <button onClick={() => toggleMarket(globalIdx)} className="flex items-center gap-2">
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke={market.pinned ? '#0E8FCF' : '#c0c8d4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" />
                        </svg>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {infoOpenFor === market.title && (
                    <div className="mb-2.5 -mt-1 bg-[#f4f6f9] rounded-lg px-3 py-2">
                      <p className="text-[10px] text-[#737B8C] leading-snug">{MARKET_INFO[market.title]}</p>
                    </div>
                  )}

                  {isOpen && market.rows.length > 0 && (
                    <div className="pb-3 flex flex-col gap-[6px]">
                      {market.rows.map((row, ri) => (
                        <div key={ri} className="flex gap-[6px]">
                          {row.map((odd, oi) => {
                            const locked = isSuspended(odd.value)
                            const sel = !locked && has(oddId(market.title, odd.label))
                            return (
                              <button
                                key={oi}
                                disabled={locked}
                                onClick={() => { if (!locked) pickOdd(market.title, odd) }}
                                className={`flex-1 rounded-lg py-[10px] px-3 flex flex-col items-center gap-[3px] transition-all ${
                                  locked
                                    ? 'bg-[#f4f6f9] border border-[#eef1f5] cursor-default justify-center'
                                    : sel
                                      ? 'bg-[#0E8FCF] border border-[#0E8FCF] shadow-[0_2px_8px_rgba(14,143,207,0.3)] active:scale-[0.97]'
                                      : 'bg-[#edf5ff] border border-[#e8ecf1] hover:border-[#c8d8e8] active:scale-[0.97]'
                                }`}
                              >
                                {locked ? (
                                  <OddLock size={13} />
                                ) : (
                                  <>
                                    <span className={`text-[9px] font-medium ${sel ? 'text-white/70' : 'text-[#737B8C]'}`}>
                                      {odd.label}
                                    </span>
                                    <span className={`text-[11px] font-bold leading-none ${sel ? 'text-white' : 'text-[#1a2332]'}`}>
                                      {formatOdd(odd.value)}
                                    </span>
                                  </>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
