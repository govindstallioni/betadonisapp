'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const matchData = {
  league: 'Futbol. ABD. USL',
  country: 'ABD',
  home: { name: 'Las Vegas Lights', abbr: 'LVL', color: '#f59e0b', bg: '#1a1a2e' },
  away: { name: 'Lexington SC',     abbr: 'LEX', color: '#fff',    bg: '#15803d' },
  score: { home: 0, away: 1 },
  time: '09 : 42',
  period: '1. Yarı',
  status: '1. Yarı, (0-1)',
  corners: 1,
}

type Market = {
  id: string
  name: string
  count?: number
  rows?: { label: string; value: string }[][]
}

const markets: Market[] = [
  {
    id: '1x2', name: '1X2',
    rows: [[
      { label: 'W1', value: '5.97' },
      { label: 'X',  value: '4.31' },
      { label: 'W2', value: '1.49' },
    ]],
  },
  {
    id: 'dc', name: 'Çifte Şans',
    rows: [[
      { label: '1X', value: '2.515' },
      { label: '12', value: '1.2'   },
      { label: '2X', value: '1.112' },
    ]],
  },
  {
    id: 'btts', name: 'Her İki Takım Gol Atar',
    rows: [
      [{ label: 'Evet', value: '1.368' }, { label: 'Hayır', value: '3.008' }],
      [{ label: 'Her İki Takım 2+ Evet', value: '4.02'  }, { label: 'Her İki Takım 2+ Hayır', value: '1.184' }],
    ],
  },
  { id: 'combo1',  name: '1X2 + Her İki Takım Gol Atar',  count: 11 },
  { id: 'combo2',  name: 'Çifte Şans + Her İki Takım Gol', count: 12 },
  { id: 'total',   name: 'Toplam',                          count: 18 },
]

const marketFilters = ['Tüm Pazarlar', 'Popüler', 'Toplam', 'Handikap', 'Goller']
const timePeriods   = ['Normal Süre', '1. Yarı', '2. Yarı', 'Köşeler', 'Köşeler. 1.']

export default function LiveMatchDetail() {
  const router  = useRouter()
  const params  = useSearchParams()
  const league  = params.get('league') || matchData.league

  const [activeFilter, setActiveFilter]   = useState(0)
  const [activePeriod, setActivePeriod]   = useState(0)
  const [expanded, setExpanded]           = useState<Set<string>>(new Set(['1x2', 'dc', 'btts']))
  const [pinned, setPinned]               = useState<Set<string>>(new Set())
  const [favHome, setFavHome]             = useState(false)
  const [favAway, setFavAway]             = useState(false)
  const [selectedOdds, setSelectedOdds]   = useState<Set<string>>(new Set())
  const [oneClickSheet, setOneClickSheet] = useState(false)
  const [oneClickEnabled, setOneClickEnabled] = useState(true)
  const [stakeAmount, setStakeAmount]     = useState('0.5')

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
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 border-b border-[#e8ecf1]">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="flex-1 text-[14px] font-bold text-[#1a2332] leading-tight text-center truncate px-1">{league}</h1>
        <button onClick={() => setOneClickSheet(true)} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={oneClickEnabled ? '#0E8FCF' : '#1a2332'}>
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
          background: 'linear-gradient(180deg,#071428 0%,#0b2240 30%,#0d3318 60%,#0a2a14 100%)',
          minHeight: '200px',
        }}
      >
        {/* Stadium lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[80px] border-2 border-white rounded-t-full"/>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white"/>
          {[30,50,70].map(p => (
            <div key={p} className="absolute left-0 right-0 h-px bg-white/30" style={{ bottom: `${p}%` }}/>
          ))}
        </div>

        {/* Country label */}
        <p className="relative text-center text-[11px] text-white/50 pt-[10px]">{matchData.country}</p>

        {/* Teams + score */}
        <div className="relative flex items-center justify-between px-6 pt-[8px] pb-[6px]">
          {/* Home */}
          <div className="flex flex-col items-center gap-[6px] w-[100px]">
            <div className="relative">
              <img src="/teams/jersey1.png" width={54} height={54} style={{ objectFit: 'contain' }} alt="home jersey"/>
              <button onClick={() => setFavHome(!favHome)}
                className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-white/90 flex items-center justify-center shadow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill={favHome ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
            <span className="text-[11px] font-bold text-white text-center leading-tight mt-2">{matchData.home.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-[3px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[32px] font-extrabold text-white tabular-nums leading-none">{matchData.score.home}</span>
              <span className="text-[20px] font-bold text-white/50 leading-none">:</span>
              <span className="text-[32px] font-extrabold text-white tabular-nums leading-none">{matchData.score.away}</span>
            </div>
            <p className="text-[9px] text-white/40 leading-none">geçen süre:</p>
            <p className="text-[13px] font-bold text-white leading-none">{matchData.time}</p>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-[6px] w-[100px]">
            <div className="relative">
              <img src="/teams/jersey2.png" width={54} height={54} style={{ objectFit: 'contain' }} alt="away jersey"/>
              <button onClick={() => setFavAway(!favAway)}
                className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-white/90 flex items-center justify-center shadow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill={favAway ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
            <span className="text-[11px] font-bold text-white text-center leading-tight mt-2">{matchData.away.name}</span>
          </div>
        </div>


        {/* Status */}
        <p className="relative text-center text-[10px] text-white/50 pb-[8px]">{matchData.status}</p>

        {/* Dots */}
        <div className="relative flex items-center justify-center gap-[5px] pb-[12px]">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-[14px] h-[4px] bg-white' : 'w-[4px] h-[4px] bg-white/25'}`}/>
          ))}
        </div>
      </div>

      {/* ── Market filters ── */}
      <div className="bg-white border-b border-[#e8ecf1]">
        <div className="flex overflow-x-auto scrollbar-hide px-3 py-[10px] gap-[6px]">
          {marketFilters.map((f, i) => (
            <button key={f} onClick={() => setActiveFilter(i)}
              className={`flex-shrink-0 flex items-center gap-[4px] px-[14px] py-[7px] rounded-full text-[11px] font-semibold transition-all ${
                activeFilter === i
                  ? 'bg-white border-2 border-[#1a2332] text-[#1a2332]'
                  : 'bg-[#2d3748] text-white'
              }`}>
              {i === 1 && <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>}
              {f}
            </button>
          ))}
        </div>

        {/* Time period tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-hide px-3 pb-[2px] gap-[2px]">
          <button className="w-7 h-7 flex items-center justify-center flex-shrink-0 mr-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {timePeriods.map((p, i) => (
            <button key={p} onClick={() => setActivePeriod(i)}
              className={`flex-shrink-0 px-[12px] py-[8px] text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all ${
                activePeriod === i ? 'text-[#0E8FCF] border-[#0E8FCF]' : 'text-[#94a3b8] border-transparent'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── One-click bet backdrop ── */}
      {oneClickSheet && (
        <div className="fixed inset-0 z-[70] bg-black/40" onClick={() => setOneClickSheet(false)}/>
      )}

      {/* ── One-click bet sheet ── */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] bg-white transition-transform duration-300 ${oneClickSheet ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ borderRadius: '20px 20px 0 0' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-[36px] h-[4px] rounded-full bg-[#e2e8f0]"/>
        </div>

        {/* Title */}
        <div className="px-5 pt-3 pb-2 text-center">
          <h3 className="text-[16px] font-bold text-[#0E8FCF]">Tek tıkla bahis</h3>
          <p className="text-[12px] text-[#737B8C] mt-[6px] leading-relaxed">
            Bahis miktarınızı girin ve tahminlerinizi tek tıklamayla daha hızlı yapın
          </p>
        </div>

        {/* Toggle card */}
        <div className="mx-5 mt-3 bg-[#f1f5f9] rounded-xl px-4 py-[14px] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#1a2332]">Tek tıkla bahis</span>
          <button
            onClick={() => setOneClickEnabled(v => !v)}
            className={`w-[46px] h-[26px] rounded-full flex items-center px-[2px] transition-colors ${oneClickEnabled ? 'bg-[#0E8FCF]' : 'bg-[#d0d5dd]'}`}
          >
            <div className={`w-[22px] h-[22px] rounded-full bg-white shadow transition-transform ${oneClickEnabled ? 'translate-x-[20px]' : 'translate-x-0'}`}/>
          </button>
        </div>

        {/* Stake amount */}
        <div className="mx-5 mt-4">
          <label className="text-[10px] font-medium text-[#0E8FCF]">Bahis miktarı</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={e => setStakeAmount(e.target.value)}
            className="w-full text-[18px] font-bold text-[#1a2332] border-b border-[#c8d8e8] pb-[6px] mt-[4px] outline-none bg-transparent"
          />
          <p className="text-[10px] text-[#94a3b8] mt-[4px]">Min. bahis 0.5 ₺</p>
        </div>

        {/* Apply */}
        <div className="px-5 pt-4 pb-8">
          <button
            onClick={() => setOneClickSheet(false)}
            className="w-full py-[14px] rounded-xl text-[14px] font-bold text-white bg-[#0E8FCF]"
          >
            Uygula
          </button>
        </div>
      </div>

      {/* ── Markets ── */}
      <div className="pb-28 divide-y divide-[#e8ecf1]">
        {markets.map(market => {
          const isExp = expanded.has(market.id)
          const isPinned = pinned.has(market.id)
          return (
            <div key={market.id} className="bg-white">
              {/* Market header */}
              <div className="flex items-center px-4 py-[12px]">
                <span className="flex-1 text-[13px] font-bold text-[#1a2332]">{market.name}</span>
                {market.count && <span className="text-[11px] text-[#94a3b8] mr-2">({market.count})</span>}
                <button onClick={() => togglePin(market.id)} className="w-7 h-7 flex items-center justify-center mr-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isPinned ? '#94a3b8' : 'none'} stroke="#94a3b8" strokeWidth="2">
                    <path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/>
                  </svg>
                </button>
                <button onClick={() => toggleExpand(market.id)} className="w-7 h-7 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {/* Odds */}
              {isExp && market.rows && (
                <div className="px-3 pb-3 flex flex-col gap-[6px]">
                  {market.rows.map((row, ri) => (
                    <div key={ri} className="grid gap-[6px]" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
                      {row.map(odd => {
                        const key = `${market.id}-${ri}-${odd.label}`
                        const sel = selectedOdds.has(key)
                        return (
                          <button key={odd.label} onClick={() => toggleOdd(key)}
                            className={`flex items-center justify-between px-[10px] py-[10px] rounded-[10px] border transition-all ${
                              sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'bg-[#f4f7fb] border-[#e8ecf1]'
                            }`}>
                            <span className={`text-[11px] font-medium ${sel ? 'text-white/80' : 'text-[#94a3b8]'}`}>{odd.label}</span>
                            <span className={`text-[11px] font-medium tabular-nums ${sel ? 'text-white' : 'text-[#1a2332]'}`}>{odd.value}</span>
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
