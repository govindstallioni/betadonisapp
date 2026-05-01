'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ── Mock match data ────────────────────────────────────────────
const matchData = {
  league: 'Futbol. Hindistan. Delhi. Premier Ligi',
  country: 'Hindistan',
  home: { name: 'Delhi II',        abbr: 'DHI', color: '#1e3a8a' },
  away: { name: 'CISF Protectors', abbr: 'CSF', color: '#14532d' },
  score: { home: 0, away: 2 },
  time: '21 : 46',
  period: '1. Yarı',
  status: '1. Yarı, (0-2), Maç henüz başlamadı',
  corners: 2,
}

type Market = {
  id: string
  name: string
  count?: number
  rows?: { label: string; value: string; locked?: boolean }[][]
}

const markets: Market[] = [
  {
    id: '1x2', name: '1X2',
    rows: [[
      { label: 'W1', value: '6.7' },
      { label: 'X',  value: '6.03' },
      { label: 'W2', value: '1.304' },
    ]],
  },
  {
    id: 'dc', name: 'Çifte Şans',
    rows: [[
      { label: '1X', value: '3.195' },
      { label: '12', value: '1.1' },
      { label: '2X', value: '1.08' },
    ]],
  },
  {
    id: 'total', name: 'Toplam',
    rows: [
      [{ label: 'Üst (1.5)', value: '1.296' }, { label: 'Alt (1.5)', value: '3.24' }],
      [{ label: 'Üst (2.5)', value: '1.87'  }, { label: 'Alt (2.5)', value: '1.83' }],
      [{ label: 'Üst (4.5)', value: '1.925' }, { label: 'Alt (4.5)', value: '1.82' }],
    ],
  },
  { id: 'handicap', name: 'Handikap',  count: 4 },
  { id: 'total1',   name: 'Toplam 1',  count: 4 },
]

const marketFilters = ['Tüm Pazarlar', 'Popüler', 'Toplam', 'Handikap', 'Goller']
const timePeriods   = ['Normal Süre', '1. Yarı', '2. Yarı', 'Sarı Kartlar', 'Kırmızı K.']

export default function LiveMatchDetail() {
  const router  = useRouter()
  const params  = useSearchParams()
  const league  = params.get('league') || matchData.league

  const [activeFilter, setActiveFilter]   = useState(0)
  const [activePeriod, setActivePeriod]   = useState(0)
  const [expanded, setExpanded]           = useState<Set<string>>(new Set(['1x2', 'dc', 'total']))
  const [pinned, setPinned]               = useState<Set<string>>(new Set())
  const [favHome, setFavHome]             = useState(false)
  const [favAway, setFavAway]             = useState(false)
  const [selectedOdds, setSelectedOdds]   = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function togglePin(id: string) {
    setPinned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleOdd(key: string) {
    setSelectedOdds(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  return (
    <div className="max-w-[430px] mx-auto bg-[#f0f4f8] min-h-screen">

      {/* ── Header ── */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-[16px] font-bold text-[#1a2332] leading-tight text-center truncate px-1">{league}</h1>
        <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a2332">
            <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a2332">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d3b2e 0%, #1a5c3a 35%, #0f7a4a 60%, #1a6640 100%)',
          minHeight: '180px',
        }}
      >
        {/* Stadium lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[40, 55, 70, 85].map(p => (
            <div key={p} className="absolute left-0 right-0 h-px bg-white" style={{ top: `${p}%` }}/>
          ))}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white -translate-x-1/2"/>
          <div className="absolute w-[90px] h-[90px] rounded-full border border-white left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"/>
        </div>

        {/* Country label */}
        <p className="relative text-center text-[11px] text-white/60 pt-[10px] pb-[6px]">{matchData.country}</p>

        {/* Teams row */}
        <div className="relative flex items-center justify-between px-6 pb-2">
          {/* Home team */}
          <div className="flex flex-col items-center gap-[6px] w-[100px]">
            <div className="relative">
              <div className="w-[44px] h-[44px] rounded-full border-2 border-white/30 flex items-center justify-center shadow-lg"
                style={{ background: matchData.home.color }}>
                <span className="text-[10px] font-extrabold text-white">{matchData.home.abbr}</span>
              </div>
              <button
                onClick={() => setFavHome(!favHome)}
                className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center shadow"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill={favHome ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
            <span className="text-[10px] font-bold text-white text-center leading-tight mt-1">{matchData.home.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-[4px]">
            <div className="flex items-center gap-[10px]">
              <span className="text-[30px] font-extrabold text-white tabular-nums leading-none">{matchData.score.home}</span>
              <span className="text-[20px] font-bold text-white/60 leading-none">:</span>
              <span className="text-[30px] font-extrabold text-white tabular-nums leading-none">{matchData.score.away}</span>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-white/50 leading-none">geçen süre:</p>
              <p className="text-[14px] font-bold text-white leading-tight">{matchData.time}</p>
            </div>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-[6px] w-[100px]">
            <div className="relative">
              <div className="w-[44px] h-[44px] rounded-full border-2 border-white/30 flex items-center justify-center shadow-lg"
                style={{ background: matchData.away.color }}>
                <span className="text-[10px] font-extrabold text-white">{matchData.away.abbr}</span>
              </div>
              <button
                onClick={() => setFavAway(!favAway)}
                className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center shadow"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill={favAway ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
            <span className="text-[10px] font-bold text-white text-center leading-tight mt-1">{matchData.away.name}</span>
          </div>
        </div>

        {/* Corners indicator */}
        <div className="relative flex items-center gap-1 px-6 pb-3 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M4 4v7h7V4H4zm2 2h3v3H6V6zM13 4v7h7V4h-7zm2 2h3v3h-3V6zM4 13v7h7v-7H4zm2 2h3v3H6v-3z"/>
          </svg>
          <span className="text-[11px] font-bold text-[#4ade80]">{matchData.corners}</span>
        </div>

        {/* Status */}
        <div className="relative text-center pb-[10px]">
          <p className="text-[10px] text-white/60">{matchData.status}</p>
        </div>

        {/* Pagination dots */}
        <div className="relative flex items-center justify-center gap-[5px] pb-[12px]">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-[16px] h-[5px] bg-white' : 'w-[5px] h-[5px] bg-white/30'}`}/>
          ))}
        </div>
      </div>

      {/* ── Market type filters ── */}
      <div className="bg-white border-b border-[#f0f2f5]">
        <div className="flex overflow-x-auto scrollbar-hide px-3 py-[7px] gap-[5px]">
          {marketFilters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`flex-shrink-0 flex items-center gap-[5px] px-[14px] py-[7px] rounded-full text-[11px] font-semibold transition-all ${
                activeFilter === i
                  ? 'bg-[#0E8FCF] text-white shadow-sm'
                  : 'bg-white text-[#0E8FCF] border border-[#bce0f5]'
              }`}
            >
              {i === 1 && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              )}
              {f}
            </button>
          ))}
        </div>

        {/* Time period sub-tabs */}
        <div className="flex overflow-x-auto scrollbar-hide px-3 pb-[2px] gap-[4px]">
          {timePeriods.map((p, i) => (
            <button
              key={p}
              onClick={() => setActivePeriod(i)}
              className={`flex-shrink-0 px-[14px] py-[8px] text-[11px] font-semibold transition-all border-b-2 whitespace-nowrap ${
                activePeriod === i
                  ? 'text-[#0E8FCF] border-[#0E8FCF]'
                  : 'text-[#737B8C] border-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bet markets ── */}
      <div className="px-3 pt-3 pb-28 flex flex-col gap-[8px]">
        {markets.map(market => {
          const isExpanded = expanded.has(market.id)
          const isPinned   = pinned.has(market.id)
          return (
            <div key={market.id} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
              {/* Market header */}
              <div className="flex items-center px-4 py-[11px]">
                <span className="flex-1 text-[13px] font-bold text-[#1a2332]">{market.name}</span>
                {market.count && (
                  <span className="text-[11px] text-[#94a3b8] mr-3">({market.count})</span>
                )}
                <button onClick={() => togglePin(market.id)} className="w-7 h-7 flex items-center justify-center mr-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isPinned ? '#0E8FCF' : 'none'} stroke="#94a3b8" strokeWidth="2">
                    <path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/>
                  </svg>
                </button>
                <button onClick={() => toggleExpand(market.id)} className="w-7 h-7 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
                    className={`transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`}>
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </button>
              </div>

              {/* Market odds */}
              {isExpanded && market.rows && (
                <div className="px-3 pb-3 flex flex-col gap-[6px]">
                  {market.rows.map((row, ri) => (
                    <div key={ri} className={`grid gap-[6px]`} style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
                      {row.map(odd => {
                        const key = `${market.id}-${ri}-${odd.label}`
                        const sel = selectedOdds.has(key)
                        return (
                          <button
                            key={odd.label}
                            onClick={() => toggleOdd(key)}
                            className={`flex flex-col items-center py-[10px] px-[6px] rounded-[10px] transition-all border ${
                              sel
                                ? 'bg-[#0E8FCF] border-[#0E8FCF]'
                                : odd.locked
                                ? 'bg-[#f8fafc] border-[#e8ecf1]'
                                : 'bg-[#f4f7fb] border-[#e8ecf1] hover:border-[#0E8FCF]'
                            }`}
                          >
                            <span className={`text-[10px] font-medium leading-none mb-[4px] ${sel ? 'text-white/80' : 'text-[#94a3b8]'}`}>
                              {odd.label}
                            </span>
                            {odd.locked ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#94a3b8">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
                              </svg>
                            ) : (
                              <span className={`text-[14px] font-extrabold tabular-nums leading-none ${sel ? 'text-white' : 'text-[#1a2332]'}`}>
                                {odd.value}
                              </span>
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
    </div>
  )
}
