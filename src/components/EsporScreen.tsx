'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MatchCard from './MatchCard'
import PreMatchCard from './PreMatchCard'
import { esportGames, esportLiveMatches, esportPreMatches } from '@/data/esports'

// ── E-Spor page (work3 task 11) ─────────────────────────────────────────────
// The home "CANLI Turnuvalar" block and the Sporlar screen's E-Spor tab land
// here. Two sections, like Betadonis: live e-sports (CANLI) and upcoming
// e-sports (Maç Öncesi), each filterable by game title.

export type EsporTab = 'live' | 'prematch'

const TABS: { key: EsporTab; label: string }[] = [
  { key: 'live', label: 'CANLI' },
  { key: 'prematch', label: 'Maç Öncesi' },
]

const ALL = 'Tümü'

export default function EsporScreen({ initialTab = 'live', initialGame = ALL }: { initialTab?: EsporTab; initialGame?: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<EsporTab>(initialTab)
  const [game, setGame] = useState(initialGame)

  const source = tab === 'live' ? esportLiveMatches : esportPreMatches
  const countFor = (label: string) => source.filter((m) => m.sport === label).length
  // Games with fixtures in the active section first, then the rest.
  const games = [...esportGames].sort((a, b) => Number(countFor(b.label) > 0) - Number(countFor(a.label) > 0))

  const liveList = esportLiveMatches.filter((m) => game === ALL || m.sport === game)
  const preList = esportPreMatches.filter((m) => game === ALL || m.sport === game)
  const empty = tab === 'live' ? liveList.length === 0 : preList.length === 0

  return (
    <div className="max-w-[430px] mx-auto bg-[#edf1f7] min-h-screen pb-24">
      {/* ── Header ── */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button onClick={() => router.back()} aria-label="Geri" className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">E-SPOR</h1>
          <button onClick={() => router.push('/search')} aria-label="Ara" className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>

        {/* CANLI / Maç Öncesi */}
        <div className="px-4 pb-2">
          <div className="bg-[#edf5ff] rounded-full p-[3px] flex items-center">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={`flex-1 py-[8px] rounded-full text-[11px] font-semibold text-center transition-all flex items-center justify-center gap-[5px] ${tab === t.key ? 'bg-[#0E8FCF] text-white shadow-sm' : 'text-[#737B8C]'}`}
              >
                {t.key === 'live' && <span className={`w-[6px] h-[6px] rounded-full animate-pulse-dot ${tab === t.key ? 'bg-white' : 'bg-[#e74c3c]'}`} />}
                {t.label}
                <span className={`text-[9px] ${tab === t.key ? 'text-white/80' : 'text-[#94a3b8]'}`}>
                  ({t.key === 'live' ? esportLiveMatches.length : esportPreMatches.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Game strip */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-3 pb-2 border-t border-[#f0f2f5] pt-2">
          {[{ label: ALL, icon: null as React.ReactNode }, ...games].map((g) => {
            const active = game === g.label
            const n = g.label === ALL ? source.length : countFor(g.label)
            return (
              <button
                key={g.label}
                onClick={() => setGame(g.label)}
                className={`flex flex-col items-center gap-[3px] flex-shrink-0 min-w-[62px] py-[6px] px-1 rounded-xl transition-colors ${active ? 'bg-[#edf5ff]' : ''} ${n === 0 && !active ? 'opacity-50' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-[#0E8FCF]' : 'bg-[#f1f5f9]'}`}>
                  {g.icon ?? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#0E8FCF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="12" rx="4" /><path d="M7 11v4M5 13h4" /><circle cx="15.5" cy="12" r="1" fill="currentColor" /><circle cx="18" cy="14" r="1" fill="currentColor" />
                    </svg>
                  )}
                </div>
                <span className={`text-[9px] font-semibold leading-none whitespace-nowrap ${active ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{g.label}</span>
                <span className="text-[8px] text-[#94a3b8] leading-none">{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="flex items-center gap-[6px] px-4 pt-3 pb-2">
        <span className="text-[12px] font-bold text-[#1a2332]">{game === ALL ? 'TÜM E-SPORLAR' : game.toUpperCase()}</span>
        <span className="text-[10px] text-[#737B8C] font-semibold">({tab === 'live' ? liveList.length : preList.length})</span>
        {tab === 'live' && <span className="w-[6px] h-[6px] rounded-full bg-[#e74c3c] animate-pulse-dot ml-1" />}
      </div>

      {/* ── Match list ── */}
      <div className="px-3">
        {empty ? (
          <div className="bg-white rounded-xl py-10 px-6 text-center border border-[#e8ecf1]">
            <p className="text-[12px] text-[#94a3b8]">
              {tab === 'live' ? 'Bu oyunda şu an canlı karşılaşma yok.' : 'Bu oyunda yaklaşan karşılaşma yok.'}
            </p>
            <button
              onClick={() => setTab(tab === 'live' ? 'prematch' : 'live')}
              className="mt-3 text-[11px] font-semibold text-[#0E8FCF]"
            >
              {tab === 'live' ? 'Maç Öncesi karşılaşmalara bak' : 'Canlı karşılaşmalara bak'}
            </button>
          </div>
        ) : tab === 'live' ? (
          <div className="flex flex-col gap-[10px]">
            {liveList.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {preList.map((m) => <PreMatchCard key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </div>
  )
}
