'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const timeFilters = ['Tümü', '30 dk', '1 saat', '2 saat', '6 saat', '12 saat', '24 saat']

type ClubBadge = { abbr: string; color: string; bg: string }
type Fixture = {
  id: number
  league: string
  date: string
  home: { name: string; badge: ClubBadge }
  away: { name: string; badge: ClubBadge }
  odds: { w1: string; x: string; w2: string }
}

const fixturesByLeague: Record<string, Fixture[]> = {
  default: [
    {
      id: 1,
      league: 'UEFA Şampiyonlar Ligi',
      date: '06.05.26 12:30',
      home: { name: 'Arsenal',         badge: { abbr: 'ARS', color: '#fff',    bg: '#EF0107' } },
      away: { name: 'Atletico Madrid', badge: { abbr: 'ATM', color: '#fff',    bg: '#CB3524' } },
      odds: { w1: '1.686', x: '4.11', w2: '5.58' },
    },
    {
      id: 2,
      league: 'UEFA Şampiyonlar Ligi',
      date: '07.05.26 12:30',
      home: { name: 'Bayern Münih',        badge: { abbr: 'BAY', color: '#fff', bg: '#DC052D' } },
      away: { name: 'Paris Saint-Germain', badge: { abbr: 'PSG', color: '#fff', bg: '#003F7F' } },
      odds: { w1: '1.728', x: '4.875', w2: '4.32' },
    },
  ],
  'Türkiye. Süper Lig': [
    {
      id: 3,
      league: 'Türkiye. Süper Lig',
      date: '08.05.26 21:00',
      home: { name: 'Galatasaray', badge: { abbr: 'GS',  color: '#fff', bg: '#e90000' } },
      away: { name: 'Fenerbahçe', badge: { abbr: 'FB',  color: '#fff', bg: '#003580' } },
      odds: { w1: '2.35', x: '3.20', w2: '3.10' },
    },
    {
      id: 4,
      league: 'Türkiye. Süper Lig',
      date: '09.05.26 19:00',
      home: { name: 'Beşiktaş',    badge: { abbr: 'BJK', color: '#fff', bg: '#000000' } },
      away: { name: 'Trabzonspor', badge: { abbr: 'TS',  color: '#fff', bg: '#6C1D45' } },
      odds: { w1: '2.10', x: '3.40', w2: '3.50' },
    },
  ],
  'İngiltere. Premier Ligi': [
    {
      id: 5,
      league: 'İngiltere. Premier Ligi',
      date: '10.05.26 18:30',
      home: { name: 'Manchester City', badge: { abbr: 'MCI', color: '#fff', bg: '#6CABDD' } },
      away: { name: 'Liverpool',       badge: { abbr: 'LIV', color: '#fff', bg: '#C8102E' } },
      odds: { w1: '1.95', x: '3.60', w2: '4.20' },
    },
    {
      id: 6,
      league: 'İngiltere. Premier Ligi',
      date: '10.05.26 21:00',
      home: { name: 'Chelsea',          badge: { abbr: 'CHE', color: '#fff', bg: '#034694' } },
      away: { name: 'Manchester United',badge: { abbr: 'MUN', color: '#fff', bg: '#DA291C' } },
      odds: { w1: '2.45', x: '3.30', w2: '2.90' },
    },
  ],
}

function SportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="#0E8FCF">
      <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493l-6.805-1.777-24.417-65.435L203.074 336h105.854l.57 1.076 19.34 38.852-23.618 64.282a189.782 189.782 0 0 1-8.069 1.969zM189.578 77.28 247 116.576v58.147l-70.997 60.067-49.403-22.51-4.167-1.899-22.332-64.019c22.009-31.204 53.138-55.532 89.477-69.082zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.968 68.906z"/>
    </svg>
  )
}

export default function PreMatchLeagueScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const leagueName = params.get('name') || 'UEFA Şampiyonlar Ligi'

  const [activeTimeFilter, setActiveTimeFilter] = useState(0)
  const [notified, setNotified] = useState<Set<number>>(new Set())
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [selectedOdds, setSelectedOdds] = useState<Set<string>>(new Set())

  const fixtures = fixturesByLeague[leagueName] ?? fixturesByLeague['default']

  function toggleNotify(id: number) {
    setNotified(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleFav(id: number) {
    setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleOdd(key: string) {
    setSelectedOdds(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-2 flex items-center gap-2 shadow-sm">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-[16px] font-bold text-[#1a2332] text-center truncate">{leagueName}</h1>
        <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
      </div>

      {/* ── Time filters ── */}
      <div className="bg-white border-b border-[#f0f2f5]">
        <div className="flex gap-[5px] overflow-x-auto scrollbar-hide px-3 py-2">
          {timeFilters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveTimeFilter(i)}
              className={`flex-shrink-0 px-[10px] py-[5px] rounded-full text-[10px] font-semibold transition-all ${
                activeTimeFilter === i
                  ? 'bg-[#0E8FCF] text-white shadow-sm'
                  : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Match cards ── */}
      <div className="px-3 pt-2 pb-24 flex flex-col gap-[8px]">
        {fixtures.map(fixture => {
          const isNotified = notified.has(fixture.id)
          const isFav      = favorites.has(fixture.id)

          return (
            <div key={fixture.id} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1] shadow-sm">
              {/* Card header */}
              <div className="flex items-center gap-2 px-3 py-[7px] border-b border-[#f0f4f8]">
                <SportIcon />
                <span className="flex-1 text-[10px] font-semibold text-[#1a2332] truncate">{fixture.league}</span>
                <button onClick={() => toggleNotify(fixture.id)} className="w-7 h-7 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isNotified ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.8">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>
                <button onClick={() => toggleFav(fixture.id)} className="w-7 h-7 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              </div>

              {/* Teams row */}
              <div className="flex items-center justify-between px-3 pt-[10px] pb-[2px]">
                {/* Home */}
                <div className="flex items-center gap-[8px] flex-1">
                  <span className="text-[11px] font-bold text-[#1a2332]">{fixture.home.name}</span>
                  <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: fixture.home.badge.bg }}>
                    <span className="text-[9px] font-extrabold" style={{ color: fixture.home.badge.color }}>
                      {fixture.home.badge.abbr}
                    </span>
                  </div>
                </div>

                {/* VS */}
                <span className="text-[11px] font-bold text-[#94a3b8] mx-[6px] flex-shrink-0">VS</span>

                {/* Away */}
                <div className="flex items-center gap-[8px] flex-1 justify-end">
                  <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: fixture.away.badge.bg }}>
                    <span className="text-[9px] font-extrabold" style={{ color: fixture.away.badge.color }}>
                      {fixture.away.badge.abbr}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1a2332]">{fixture.away.name}</span>
                </div>
              </div>

              {/* Date */}
              <p className="text-center text-[10px] text-[#0E8FCF] font-medium py-[5px]">{fixture.date}</p>

              {/* 1X2 odds */}
              <div className="px-3 pb-[10px]">
                <p className="text-[10px] font-bold text-[#1a2332] mb-[5px]">1X2</p>
                <div className="grid grid-cols-3 gap-[5px]">
                  {[
                    { label: 'W1', value: fixture.odds.w1 },
                    { label: 'X',  value: fixture.odds.x  },
                    { label: 'W2', value: fixture.odds.w2 },
                  ].map(odd => {
                    const key = `${fixture.id}-${odd.label}`
                    const sel = selectedOdds.has(key)
                    return (
                      <button
                        key={odd.label}
                        onClick={() => toggleOdd(key)}
                        className={`flex items-center justify-between px-2 py-[7px] rounded-[8px] border transition-all ${
                          sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'bg-[#f4f7fb] border-[#e8ecf1] hover:border-[#0E8FCF]'
                        }`}
                      >
                        <span className={`text-[9px] font-medium ${sel ? 'text-white/80' : 'text-[#94a3b8]'}`}>{odd.label}</span>
                        <span className={`text-[11px] font-extrabold tabular-nums ${sel ? 'text-white' : 'text-[#1a2332]'}`}>{odd.value}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
