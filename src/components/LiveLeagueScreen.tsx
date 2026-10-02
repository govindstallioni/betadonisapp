'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MatchCard, { OddsMarket } from './MatchCard'
import LiveListView from './LiveListView'
import LiveGridView from './LiveGridView'
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
  // 3 bet list view options + pin-to-top (task 7: these must be present on
  // every "league selected, bets listed" screen too, not just the main list).
  const [layout, setLayout] = useState<'cards' | 'grid' | 'list'>('cards')
  const [market] = useState<OddsMarket>('MS')
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const togglePin = (id: string) => {
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
  }
  const togglePinLeague = (ids: string[]) => {
    setPinnedIds((prev) => {
      const allPinned = ids.every((id) => prev.includes(id))
      return allPinned ? prev.filter((id) => !ids.includes(id)) : [...ids, ...prev.filter((id) => !ids.includes(id))]
    })
  }

  const base = leagueMatches(league, flag)
  const filteredMatches = base.filter((m) => {
    if (streamOnly && !m.hasStream) return false
    if (query.trim() && !`${m.team1} ${m.team2}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })
  const matches = [
    ...pinnedIds.map((id) => filteredMatches.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m),
    ...filteredMatches.filter((m) => !pinnedIds.includes(m.id)),
  ]

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

      {/* ── Live section header + view toggle ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
          <span className="text-[12px] font-bold text-[#1a2332]">Canlı Etkinlikler</span>
          <span className="text-[10px] text-[#737B8C] font-semibold">{matches.length}</span>
        </div>
        <div className="flex items-center bg-white rounded-full border border-[#e8ecf1] p-[2px]">
          {([
            { key: 'cards', label: 'Tek sütun', icon: <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></> },
            { key: 'grid', label: 'İki sütun', icon: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></> },
            { key: 'list', label: 'Liste görünümü', icon: <><rect x="3" y="4" width="18" height="4" rx="1" /><line x1="3" y1="12" x2="12" y2="12" /><line x1="3" y1="17" x2="12" y2="17" /><rect x="15" y="10.5" width="6" height="8" rx="1" /></> },
          ] as const).map((b) => {
            const on = layout === b.key
            return (
              <button key={b.key} onClick={() => setLayout(b.key)} aria-label={b.label} aria-pressed={on} className={`w-7 h-7 rounded-full flex items-center justify-center ${on ? 'bg-[#0E8FCF]' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? '#fff' : '#737B8C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{b.icon}</svg>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Match list ── */}
      <div className="px-3">
        {matches.length === 0 ? (
          <div className="bg-white rounded-xl py-10 text-center border border-[#e8ecf1]">
            <p className="text-[12px] text-[#94a3b8]">Bu filtreyle canlı maç yok.</p>
          </div>
        ) : layout === 'list' ? (
          <LiveListView matches={matches} market={market} pinnedIds={pinnedIds} onTogglePin={togglePin} onTogglePinLeague={togglePinLeague} />
        ) : layout === 'grid' ? (
          <LiveGridView matches={matches} market={market} pinnedIds={pinnedIds} onTogglePin={togglePin} onTogglePinLeague={togglePinLeague} />
        ) : (
          <div className="flex flex-col gap-[10px]">
            {matches.map((m) => <MatchCard key={m.id} match={m} market={market} pinned={pinnedIds.includes(m.id)} onTogglePin={() => togglePin(m.id)} />)}
          </div>
        )}
      </div>
    </div>
  )
}
