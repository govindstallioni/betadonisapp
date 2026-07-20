'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const frequentItems = [
  { id: 1,  label: 'Türkiye Süper Ligi' },
  { id: 2,  label: 'Galatasaray' },
  { id: 3,  label: 'Fenerbahçe' },
  { id: 4,  label: 'Beşiktaş' },
  { id: 5,  label: 'Şampiyonlar Ligi' },
  { id: 6,  label: 'Premier Lig' },
  { id: 7,  label: 'La Liga' },
  { id: 8,  label: 'Bundesliga' },
  { id: 9,  label: 'Real Madrid' },
  { id: 10, label: 'Barcelona' },
  { id: 11, label: 'Serie A' },
  { id: 12, label: 'Ligue 1' },
  { id: 13, label: 'NBA' },
  { id: 14, label: 'Wimbledon' },
]

type ResultMatch = {
  id: number
  league: string
  homeTeam: string
  homeFlag: string
  awayTeam: string
  awayFlag: string
  isLive: boolean
  score?: string
  status?: string
  date?: string
  countdown?: string
  odds: { w1: string; x: string; w2: string }
  hasStream?: boolean
}

function buildResults(q: string): { live: ResultMatch[]; prematch: ResultMatch[] } {
  return {
    live: [
      {
        id: 1, league: 'Uluslararası Kupa. 24',
        homeTeam: 'Nauru', homeFlag: '🇳🇷',
        awayTeam: q, awayFlag: '🌍',
        isLive: true, score: '14 : 9',
        status: '3. çeyrek, geçen süre: 52:38 (13-6, 1-0, 0-3)',
        odds: { w1: '2.496', x: '4.09', w2: '2.26' },
        hasStream: true,
      },
      {
        id: 2, league: 'Futbol Ligi. 56',
        homeTeam: 'Moğolistan', homeFlag: '🇲🇳',
        awayTeam: 'Gine', awayFlag: '🇬🇳',
        isLive: true, score: 'VS',
        status: 'Maç öncesi bahis',
        countdown: '00 : 10 : 06',
        odds: { w1: '1.84', x: '2.41', w2: '8.84' },
      },
    ],
    prematch: [
      {
        id: 3, league: 'Dünya Kupası 2026',
        homeTeam: 'İran', homeFlag: '🇮🇷',
        awayTeam: 'Yeni Zelanda', awayFlag: '🇳🇿',
        isLive: false, date: '16.06.26 06:30',
        odds: { w1: '1.76', x: '3.78', w2: '5.1' },
      },
      {
        id: 4, league: 'İngiltere. Premier Ligi',
        homeTeam: 'Arsenal', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        awayTeam: 'Chelsea', awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        isLive: false, date: '17.06.26 21:00',
        odds: { w1: '2.10', x: '3.50', w2: '3.40' },
      },
    ],
  }
}

function SportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="#0E8FCF">
      <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48zm41.151 394.179c-13.514 2.657-30.327 4.187-44 4.45a190.525 190.525 0 0 1-38.5-4.493l-24.417-65.435L203.074 336h105.854l19.34 38.852-23.618 64.282zm-66.531-317.9 57.422 39.296v58.147l-70.997 60.067-49.403-22.51-22.332-64.019c22.009-31.204 53.138-55.532 89.31-70.981zm221.986 68.787-22.432 64.483-53.992 24.388L264 174.723v-58.147l57.596-39.415c36.362 13.483 67.905 37.752 89.01 69.726z"/>
    </svg>
  )
}

function MatchCard({ m, selectedOdds, onToggle, notified, onNotify, favorited, onFav, router }: {
  m: ResultMatch
  selectedOdds: Set<string>
  onToggle: (k: string) => void
  notified: boolean
  onNotify: () => void
  favorited: boolean
  onFav: () => void
  router: ReturnType<typeof import('next/navigation').useRouter>
}) {
  const odds = [
    { label: 'EV1',  value: m.odds.w1 },
    { label: 'X',    value: m.odds.x  },
    { label: 'DEP2', value: m.odds.w2 },
  ]

  return (
    <div className="bg-white rounded-xl border border-[#e8ecf1] shadow-sm overflow-hidden mb-[8px] cursor-pointer" onClick={() => router.push(`/live/matches?league=${encodeURIComponent(m.league)}`)}>
      {/* Card header */}
      <div className="flex items-center gap-2 px-3 py-[7px] border-b border-[#f0f4f8]">
        <SportIcon />
        <span className="flex-1 text-[11px] font-medium text-[#737B8C] truncate">{m.league}</span>
        <button onClick={onNotify} className="w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill={notified ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        {m.isLive && (
          <div className="flex items-center gap-[3px] bg-[#ef4444] rounded-full px-[6px] py-[2px]">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span className="text-[8px] font-bold text-white tracking-wide">CANLI</span>
          </div>
        )}
        <button onClick={onFav} className="w-6 h-6 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill={favorited ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      </div>

      {/* Teams + score */}
      <div className="flex items-center px-3 pt-[10px] pb-[2px] gap-[6px]">
        <span className="flex-1 text-[11px] font-normal text-[#1a2332] text-right truncate">{m.homeTeam}</span>
        <img src="/teams/jersey1.png" width={26} height={26} style={{ objectFit: 'contain' }} alt="" className="flex-shrink-0"/>
        <span className="text-[13px] font-extrabold text-[#1a2332] tabular-nums flex-shrink-0 mx-[2px]">
          {m.score ?? '0 : 0'}
        </span>
        <img src="/teams/jersey2.png" width={26} height={26} style={{ objectFit: 'contain' }} alt="" className="flex-shrink-0"/>
        <span className="flex-1 text-[11px] font-normal text-[#1a2332] truncate">{m.awayTeam}</span>
      </div>

      {/* Status */}
      <p className="text-center text-[10px] text-[#737B8C] py-[4px]">
        {m.countdown ? m.countdown : m.status ?? m.date}
      </p>

      {/* Odds */}
      <div className="px-3 pb-[10px]">
        <div className="grid grid-cols-3 gap-[5px]">
          {odds.map(o => {
            const key = `${m.id}-${o.label}`
            const sel = selectedOdds.has(key)
            return (
              <button key={o.label} onClick={() => onToggle(key)}
                className={`flex items-center justify-between px-[10px] py-[7px] rounded-[8px] border transition-all ${
                  sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'bg-[#f4f7fb] border-[#e8ecf1]'
                }`}>
                <span className={`text-[10px] font-medium ${sel ? 'text-white/80' : 'text-[#94a3b8]'}`}>{o.label}</span>
                <span className={`text-[10px] font-medium tabular-nums ${sel ? 'text-white' : 'text-[#1a2332]'}`}>{o.value}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function EventSearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReturnType<typeof buildResults> | null>(null)
  const [selectedOdds, setSelectedOdds] = useState<Set<string>>(new Set())
  const [notified, setNotified] = useState<Set<number>>(new Set())
  const [favorited, setFavorited] = useState<Set<number>>(new Set())

  function search(q: string) {
    setQuery(q)
    if (q.trim()) setResults(buildResults(q))
    else setResults(null)
  }

  function toggleOdd(k: string) {
    setSelectedOdds(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })
  }

  const filtered = !results && query.trim()
    ? frequentItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : frequentItems

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3 sticky top-0 z-10 border-b border-[#f0f2f5]">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-[#f1f5f9] rounded-full px-4 py-[9px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            autoFocus
            value={query}
            onChange={e => search(e.target.value)}
            placeholder="Ara"
            className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none"
          />
          {query && (
            <button onClick={() => search('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results ? (
        <div className="px-3 pt-3 pb-28">
          {/* Live section */}
          {results.live.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[15px] font-extrabold text-[#1a2332]">Canlı</span>
                <button className="px-[12px] py-[4px] rounded-full border border-[#e8ecf1] text-[10px] font-semibold text-[#1a2332]">Tümü</button>
              </div>
              {results.live.map(m => (
                <MatchCard key={m.id} m={m} selectedOdds={selectedOdds} onToggle={toggleOdd}
                  notified={notified.has(m.id)} onNotify={() => setNotified(p => { const n=new Set(p); n.has(m.id)?n.delete(m.id):n.add(m.id); return n })}
                  favorited={favorited.has(m.id)} onFav={() => setFavorited(p => { const n=new Set(p); n.has(m.id)?n.delete(m.id):n.add(m.id); return n })}
                  router={router}
                />
              ))}
            </div>
          )}

          {/* Pre-match section */}
          {results.prematch.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-[8px]">
                <span className="text-[15px] font-extrabold text-[#1a2332]">Maç Öncesi</span>
                <button className="px-[12px] py-[4px] rounded-full border border-[#e8ecf1] text-[10px] font-semibold text-[#1a2332]">Tümü</button>
              </div>
              {results.prematch.map(m => (
                <MatchCard key={m.id} m={m} selectedOdds={selectedOdds} onToggle={toggleOdd}
                  notified={notified.has(m.id)} onNotify={() => setNotified(p => { const n=new Set(p); n.has(m.id)?n.delete(m.id):n.add(m.id); return n })}
                  favorited={favorited.has(m.id)} onFav={() => setFavorited(p => { const n=new Set(p); n.has(m.id)?n.delete(m.id):n.add(m.id); return n })}
                  router={router}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Frequent searches */
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0E8FCF">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
            </svg>
            <span className="text-[14px] font-bold text-[#1a2332]">Sık Arananlar</span>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {filtered.map(item => (
              <button key={item.id} onClick={() => search(item.label)}
                className="flex items-center gap-[6px] bg-[#edf1f7] rounded-full pl-[6px] pr-[12px] py-[6px] border border-[#e8ecf1] hover:border-[#0E8FCF] transition-colors">
                <div className="w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center border border-[#e8ecf1] flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 512 512" fill="#0E8FCF">
                    <path d="M256 48C141.137 48 48 141.136 48 256s93.137 208 208 208c114.872 0 208-93.138 208-208S370.87 48 256 48z"/>
                  </svg>
                </div>
                <span className="text-[12px] font-medium text-[#1a2332] whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
