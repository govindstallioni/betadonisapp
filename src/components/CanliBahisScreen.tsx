'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MatchCard, { OddsMarket } from './MatchCard'
import { useFavorites } from './FavoritesProvider'
import { SPORT_ICONS as sportIcons } from './sportIcons'
import { liveMatches, liveSportCats } from '@/data/liveData'
import { RegionButton, RegionSheet, flagOptionsFrom } from './RegionFilter'
import OnboardingTour from './OnboardingTour'

// Popular-league shortcut chips (filter by league substring; 'Tümü' = all).
const shortcuts = ['Tümü', 'Süper Lig', 'Premier Lig', 'La Liga', 'Bundesliga', 'Serie A', 'NBA']

// Market-shortcut pills — the first four swap which odds market every card
// shows; the last two are real filters (favorites / region), not markets.
const MARKET_PILLS: { key: OddsMarket; label: string }[] = [
  { key: 'MS', label: 'Maç Sonucu' },
  { key: 'ALTUST', label: 'Alt/Üst' },
  { key: 'CS', label: 'Çifte Şans' },
  { key: 'BERABER', label: 'Beraberlik' },
  { key: 'HANDIKAP', label: 'Handikap' },
  { key: 'KORNER', label: 'Kornerler' },
]

export default function CanliBahisScreen() {
  const router = useRouter()
  const { isFav } = useFavorites()
  const [activeSport, setActiveSport] = useState(liveSportCats[0].label)
  const [shortcut, setShortcut] = useState('Tümü')
  const [streamOnly, setStreamOnly] = useState(false)
  const [twoCol, setTwoCol] = useState(false)
  const [market, setMarket] = useState<OddsMarket>('MS')
  const [favOnly, setFavOnly] = useState(false)
  const [countryFilters, setCountryFilters] = useState<Set<string>>(new Set())
  const [countrySheetOpen, setCountrySheetOpen] = useState(false)

  const flagOptions = flagOptionsFrom(liveMatches)

  function toggleCountry(flag: string) {
    setCountryFilters((prev) => {
      const n = new Set(prev)
      n.has(flag) ? n.delete(flag) : n.add(flag)
      return n
    })
  }

  const matches = liveMatches.filter((m) => {
    if (activeSport !== m.sport) return false
    if (shortcut !== 'Tümü' && !m.league.includes(shortcut)) return false
    if (streamOnly && !m.hasStream) return false
    if (favOnly && !isFav('event', m.id)) return false
    if (countryFilters.size > 0 && !countryFilters.has(m.flag)) return false
    return true
  })

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen pb-24">
      <OnboardingTour />

      {/* ── Header ── */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">CANLI BAHİS</h1>
          <div className="flex items-center gap-[2px]">
            <button onClick={() => router.push('/search')} className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            {/* Live-broadcast toggle */}
            <button
              onClick={() => setStreamOnly((v) => !v)}
              aria-pressed={streamOnly}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${streamOnly ? 'bg-[#0E8FCF]' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={streamOnly ? '#fff' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sport-category strip */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2">
          {liveSportCats.map((s) => {
            const active = activeSport === s.label
            return (
              <button
                key={s.label}
                onClick={() => setActiveSport(s.label)}
                className={`flex flex-col items-center gap-[3px] flex-shrink-0 min-w-[58px] py-[6px] px-1 rounded-xl transition-colors ${active ? 'bg-[#edf5ff]' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#0E8FCF]'}`}>
                  {sportIcons[s.label]}
                </div>
                <span className={`text-[9px] font-semibold leading-none whitespace-nowrap ${active ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{s.label}</span>
                <span className="text-[8px] text-[#94a3b8] leading-none">{s.count}</span>
              </button>
            )
          })}
        </div>

        {/* Shortcut chips */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2 border-t border-[#f0f2f5] pt-2">
          {shortcuts.map((s) => (
            <button
              key={s}
              onClick={() => setShortcut(s)}
              className={`flex-shrink-0 px-[12px] py-[5px] rounded-full text-[10px] font-semibold transition-all ${shortcut === s ? 'bg-[#0E8FCF] text-white shadow-sm' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Market-shortcut pills */}
        <div className="flex items-center gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2 border-t border-[#f0f2f5] pt-2">
          {MARKET_PILLS.map((p) => (
            <button
              key={p.key}
              onClick={() => setMarket(p.key)}
              className={`flex-shrink-0 px-[12px] py-[5px] rounded-full text-[10px] font-semibold transition-all ${market === p.key ? 'bg-[#0E8FCF] text-white shadow-sm' : 'bg-white text-[#1a2332] border border-[#e8ecf1]'}`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setFavOnly((v) => !v)}
            aria-label="Favoriler"
            aria-pressed={favOnly}
            className={`flex-shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all ${favOnly ? 'bg-[#0E8FCF] shadow-sm' : 'bg-white border border-[#e8ecf1]'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={favOnly ? '#fff' : 'none'} stroke={favOnly ? '#fff' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          <RegionButton count={countryFilters.size} onClick={() => setCountrySheetOpen(true)} />
        </div>
      </div>

      {/* ── Sport header + layout toggle ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-[6px]">
          <div className="flex-shrink-0 w-[16px] h-[16px] flex items-center justify-center" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
            {sportIcons[activeSport]}
          </div>
          <span className="text-[12px] font-bold text-[#1a2332]">{activeSport.toUpperCase()}</span>
          <span className="text-[10px] text-[#737B8C] font-semibold">({matches.length})</span>
          <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot ml-1" />
        </div>
        <div className="flex items-center bg-white rounded-full border border-[#e8ecf1] p-[2px]">
          <button onClick={() => setTwoCol(false)} aria-label="Tek sütun" className={`w-7 h-7 rounded-full flex items-center justify-center ${!twoCol ? 'bg-[#0E8FCF]' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={!twoCol ? '#fff' : '#737B8C'} strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
          </button>
          <button onClick={() => setTwoCol(true)} aria-label="İki sütun" className={`w-7 h-7 rounded-full flex items-center justify-center ${twoCol ? 'bg-[#0E8FCF]' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={twoCol ? '#fff' : '#737B8C'} strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
          </button>
        </div>
      </div>

      {/* ── Match list ── */}
      <div className="px-3">
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl py-10 text-center border border-[#e8ecf1]">
            <p className="text-[12px] text-[#94a3b8]">Bu filtreyle canlı etkinlik yok.</p>
          </div>
        ) : (
          <div className={twoCol ? 'grid grid-cols-2 gap-[8px]' : 'flex flex-col gap-[10px]'}>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} compact={twoCol} market={market} />
            ))}
          </div>
        )}
      </div>

      {/* ── "Bölgeye Göre" filter sheet ── */}
      <RegionSheet
        open={countrySheetOpen}
        options={flagOptions}
        selected={countryFilters}
        onToggle={toggleCountry}
        onClear={() => setCountryFilters(new Set())}
        onClose={() => setCountrySheetOpen(false)}
      />
    </div>
  )
}
