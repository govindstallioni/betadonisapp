'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MatchCard from './MatchCard'
import { leagueMatches } from '@/data/liveData'

// Single-column live match LIST for one league (reached from the tournament
// list's CANLI tab). Replaces the old single-match detail at /live/matches.
export default function LiveLeagueScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const league = params.get('league') || 'Canlı Lig'
  const flag = params.get('flag') || undefined

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [streamOnly, setStreamOnly] = useState(false)

  const base = leagueMatches(league, flag)
  const matches = base.filter((m) => {
    if (streamOnly && !m.hasStream) return false
    if (query.trim() && !`${m.team1} ${m.team2}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen pb-24">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-3 pb-2 flex items-center gap-2 shadow-sm sticky top-0 z-30">
        <button
          onClick={() => { if (searchOpen) { setSearchOpen(false); setQuery('') } else router.back() }}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        {searchOpen ? (
          <div className="flex-1 flex items-center gap-2 bg-[#f1f5f9] rounded-full px-3 py-[7px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Maç ara..." className="flex-1 bg-transparent text-[13px] text-[#1a2332] placeholder-[#94a3b8] outline-none" />
            {query && (
              <button onClick={() => setQuery('')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        ) : (
          <h1 className="flex-1 text-[15px] font-bold text-[#1a2332] text-center truncate">{league}</h1>
        )}
        <button onClick={() => setStreamOnly((v) => !v)} aria-pressed={streamOnly} className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${streamOnly ? 'bg-[#0E8FCF]' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={streamOnly ? '#fff' : '#1a2332'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
        </button>
        <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchOpen ? '#0E8FCF' : '#1a2332'} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        </button>
      </div>

      {/* ── Live section header ── */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
        <span className="text-[12px] font-bold text-[#1a2332]">Canlı Etkinlikler</span>
        <span className="text-[10px] text-[#737B8C] font-semibold">{matches.length}</span>
      </div>

      {/* ── Match list (single column) ── */}
      <div className="px-3">
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl py-10 text-center border border-[#e8ecf1]">
            <p className="text-[12px] text-[#94a3b8]">Bu filtreyle canlı maç yok.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {matches.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}
