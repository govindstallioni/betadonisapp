'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Static match data ──────────────────────────────────────────

const matchesData = [
  {
    id: 'gal-fen',
    league: 'Türkiye. Süper Lig',
    leagueSub: 'Hafta 34. Türkiye',
    team1: 'Galatasaray',
    team2: 'Fenerbahçe',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    score1: 2,
    score2: 1,
    isLive: true,
    minute: "67'",
    half: '2Y',
    dateTime: '04.04.2026 (09:00 pm)',
  },
  {
    id: 'mci-ars',
    league: 'İngiltere. Premier Lig',
    leagueSub: 'Hafta 30. İngiltere',
    team1: 'Manchester City',
    team2: 'Arsenal',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 0,
    score2: 0,
    isLive: true,
    minute: "23'",
    half: '1Y',
    dateTime: '04.04.2026 (10:00 pm)',
  },
  {
    id: 'rma-bar',
    league: 'İspanya. La Liga',
    leagueSub: 'Hafta 28. İspanya',
    team1: 'Real Madrid',
    team2: 'Barcelona',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    score1: 1,
    score2: 2,
    isLive: true,
    minute: "78'",
    half: '2Y',
    dateTime: '04.04.2026 (10:00 pm)',
  },
  {
    id: 'bes-tra',
    league: 'Türkiye. Süper Lig',
    leagueSub: 'Hafta 35. Türkiye',
    team1: 'Beşiktaş',
    team2: 'Trabzonspor',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    countdown: { hours: '04', minutes: '12', seconds: '36' },
    dateTime: '05.04.2026 (08:00 pm)',
  },
  {
    id: 'liv-che',
    league: 'İngiltere. Premier Lig',
    leagueSub: 'Hafta 31. İngiltere',
    team1: 'Liverpool',
    team2: 'Chelsea',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    countdown: { hours: '06', minutes: '45', seconds: '10' },
    dateTime: '06.04.2026 (10:00 pm)',
  },
  {
    id: 'atl-sev',
    league: 'İspanya. La Liga',
    leagueSub: 'Hafta 29. İspanya',
    team1: 'Atletico Madrid',
    team2: 'Sevilla',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    countdown: { hours: '03', minutes: '24', seconds: '15' },
    dateTime: '05.04.2026 (07:30 pm)',
  },
  {
    id: 'gs-bay',
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueSub: 'Grup A. Avrupa',
    team1: 'Galatasaray',
    team2: 'Bayern Münih',
    logo1: '/teams/jersey1.png',
    logo2: '/teams/jersey2.png',
    isLive: false,
    countdown: { hours: '03', minutes: '34', seconds: '24' },
    dateTime: '28.03.26 07:30 pm',
  },
  {
    id: 'rma-mci',
    league: 'Şampiyonlar Ligi. Grup Aşaması',
    leagueSub: 'Grup B. Avrupa',
    team1: 'Real Madrid',
    team2: 'Manchester City',
    logo1: '/teams/jersey2.png',
    logo2: '/teams/jersey1.png',
    isLive: false,
    countdown: { hours: '05', minutes: '12', seconds: '48' },
    dateTime: '28.03.26 10:00 pm',
  },
]

const defaultMatch = matchesData[0]

// ── Static market data ─────────────────────────────────────────

interface MarketRow { label: string; value: string }

interface Market {
  title: string
  tabs: number[]
  pinned?: boolean
  subCount?: number
  rows: MarketRow[][]
}

const allMarkets: Market[] = [
  {
    title: '1X2',
    tabs: [0, 1],
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
    tabs: [0, 1, 2],
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
    tabs: [0, 1, 2],
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
    tabs: [0, 1, 2],
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
    tabs: [0, 1],
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
    tabs: [0],
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
    title: 'Karşılıklı Gol',
    tabs: [0],
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

const filterTabs = ['Tüm Marketler', 'Popüler', 'Toplam']
const subTabs = ['Normal Süre', 'Alternatif Sonuçlar', 'Akümülatör']

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
  const [sectionOpen, setSectionOpen] = useState(true)
  const [expandedMarkets, setExpandedMarkets] = useState<Set<number>>(
    new Set(allMarkets.map((m, i) => (m.rows.length > 0 ? i : -1)).filter(i => i >= 0))
  )
  const [selectedOdds, setSelectedOdds] = useState<Set<string>>(new Set())

  const visibleMarkets = allMarkets.filter(m => m.tabs.includes(activeFilter))

  const toggleMarket = (i: number) => {
    setExpandedMarkets(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const toggleOdd = (key: string) => {
    setSelectedOdds(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/events/bannerbg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1a3a52]/85" />
        </div>

        <div className="relative px-5 pt-7 pb-5">
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

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="w-[16px] h-[3px] rounded-full bg-white" />
            <span className="w-[16px] h-[3px] rounded-full bg-white/25" />
            <span className="w-[16px] h-[3px] rounded-full bg-white/25" />
            <span className="w-[16px] h-[3px] rounded-full bg-white/25" />
          </div>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="bg-white px-4 py-3">
        <div className="flex gap-[8px]">
          {filterTabs.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className={`flex items-center gap-1.5 rounded-full px-[14px] py-[8px] text-[11px] font-medium transition-all ${
                activeFilter === i
                  ? 'bg-[#0E8FCF] text-white'
                  : 'bg-white text-[#1a2332] border border-[#d0d5dd]'
              }`}
            >
              {i === 1 && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="bg-white border-b border-[#e8ecf1]">
        <div className="flex items-center px-4 overflow-x-auto scrollbar-hide">
          <button className="flex-shrink-0 pr-3 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ── Markets ── */}
      <div className="bg-white">
        {activeFilter === 0 ? (
          /* ─── All Markets: collapsible per-market sections ─── */
          <div className="px-4 pt-2">
            {visibleMarkets.map((market) => {
              const globalIdx = allMarkets.indexOf(market)
              const isOpen = expandedMarkets.has(globalIdx)
              return (
                <div key={market.title} className="border-b border-[#f0f2f5] last:border-b-0">
                  <button
                    onClick={() => toggleMarket(globalIdx)}
                    className="w-full flex items-center justify-between py-3.5"
                  >
                    <span className="text-[12px] font-bold text-[#1a2332]">{market.title}</span>
                    <div className="flex items-center gap-2">
                      {market.subCount !== undefined && (
                        <span className="text-[11px] text-[#737B8C] font-medium">({market.subCount})</span>
                      )}
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
                    </div>
                  </button>

                  {isOpen && market.rows.length > 0 && (
                    <div className="pb-3 flex flex-col gap-[6px]">
                      {market.rows.map((row, ri) => (
                        <div key={ri} className="flex gap-[6px]">
                          {row.map((odd, oi) => {
                            const key = `${globalIdx}-${ri}-${oi}`
                            const sel = selectedOdds.has(key)
                            return (
                              <button
                                key={oi}
                                onClick={() => toggleOdd(key)}
                                className={`flex-1 rounded-lg py-[10px] px-3 flex flex-col items-center gap-[3px] transition-all active:scale-[0.97] ${
                                  sel
                                    ? 'bg-[#0E8FCF] border border-[#0E8FCF] shadow-[0_2px_8px_rgba(14,143,207,0.3)]'
                                    : 'bg-[#edf5ff] border border-[#e8ecf1] hover:border-[#c8d8e8]'
                                }`}
                              >
                                <span className={`text-[9px] font-medium ${sel ? 'text-white/70' : 'text-[#737B8C]'}`}>
                                  {odd.label}
                                </span>
                                <span className={`text-[11px] font-bold leading-none ${sel ? 'text-white' : 'text-[#1a2332]'}`}>
                                  {odd.value}
                                </span>
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
        ) : (
          /* ─── Popular / Total: "Regular time" collapsible group with flat market labels ─── */
          <>
            <button
              onClick={() => setSectionOpen(!sectionOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-[#f0f2f5]"
            >
              <span className="text-[13px] font-bold text-[#1a2332]">Normal Süre</span>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${sectionOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {sectionOpen && (
              <div className="px-4 pt-1 pb-3">
                {visibleMarkets.map((market, mi) => (
                  <div key={market.title} className="mt-3 first:mt-2">
                    <p className="text-[12px] font-bold text-[#1a2332] mb-2">{market.title}</p>
                    <div className="flex flex-col gap-[6px]">
                      {market.rows.map((row, ri) => (
                        <div key={ri} className="flex gap-[6px]">
                          {row.map((odd, oi) => {
                            const key = `p-${activeFilter}-${mi}-${ri}-${oi}`
                            const sel = selectedOdds.has(key)
                            return (
                              <button
                                key={oi}
                                onClick={() => toggleOdd(key)}
                                className={`flex-1 rounded-lg py-[10px] px-3 flex flex-col items-center gap-[3px] transition-all active:scale-[0.97] ${
                                  sel
                                    ? 'bg-[#0E8FCF] border border-[#0E8FCF] shadow-[0_2px_8px_rgba(14,143,207,0.3)]'
                                    : 'bg-[#edf5ff] border border-[#e8ecf1] hover:border-[#c8d8e8]'
                                }`}
                              >
                                <span className={`text-[9px] font-medium ${sel ? 'text-white/70' : 'text-[#737B8C]'}`}>
                                  {odd.label}
                                </span>
                                <span className={`text-[11px] font-bold leading-none ${sel ? 'text-white' : 'text-[#1a2332]'}`}>
                                  {odd.value}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}
