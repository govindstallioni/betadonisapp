'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBetSlip } from './BetSlipProvider'
import { MATCH_RESULT, matchResultOddId } from '@/data/markets'
import MarketsExpand from './MarketsExpand'
import OddLock, { isSuspended } from './OddLock'
import { PreMatch } from '@/data/prematchData'
import Flag from '@/components/Flag'

// Pre-match counterpart to LiveListView (task 5, revize v6.1 §5): same compact
// grouped-by-league row list, but date/time in place of the live minute/half
// line and no score column — pre-match fixtures haven't kicked off yet.
// Always shows the Maç Sonucu market, matching PreMatchCard's default row.

function groupByLeague(matches: PreMatch[]) {
  const groups: { league: string; flag: string; matches: PreMatch[] }[] = []
  for (const m of matches) {
    const g = groups.find((x) => x.league === m.league)
    if (g) g.matches.push(m)
    else groups.push({ league: m.league, flag: m.flag, matches: [m] })
  }
  return groups
}

export default function PreMatchListView({ matches, pinnedIds, onTogglePin, onTogglePinLeague }: { matches: PreMatch[]; pinnedIds?: string[]; onTogglePin?: (id: string) => void; onTogglePinLeague?: (ids: string[]) => void }) {
  const { has, toggle } = useBetSlip()
  // "+N" expandable markets (task 7) — same as LiveListView.
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggleExpanded = (id: string) => setExpanded((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
      {groupByLeague(matches).map((g) => {
        const columns = g.matches[0].odds.map((o) => o.label)
        const leagueIds = g.matches.map((m) => m.id)
        const leaguePinned = onTogglePinLeague ? leagueIds.every((id) => pinnedIds?.includes(id)) : false
        return (
          <div key={g.league}>
            {/* League header + outcome column labels */}
            <div className="flex items-center bg-[#1a2332] px-[10px] py-[6px]">
              <div className="flex-1 flex items-center gap-[5px] min-w-0">
                {onTogglePinLeague && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={leaguePinned ? 'Ligi üste sabitlemeyi kaldır' : 'Ligi üste sabitle'}
                    aria-pressed={leaguePinned}
                    onClick={() => onTogglePinLeague(leagueIds)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTogglePinLeague(leagueIds) }}
                    className="flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer -ml-[2px]"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={leaguePinned ? '#5bc0ff' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" />
                    </svg>
                  </span>
                )}
                <Flag emoji={g.flag} size={15} />
                <span className="text-[10px] text-white font-semibold truncate">{g.league}</span>
              </div>
              <div className="flex gap-[3px] flex-shrink-0">
                {columns.map((c) => (
                  <span key={c} className="w-[52px] text-center text-[9px] text-white/70 font-semibold truncate">{c}</span>
                ))}
              </div>
            </div>

            {g.matches.map((m) => {
              const isOpen = expanded.has(m.id)
              return (
              <div key={m.id} className="border-b border-[#f0f2f5] last:border-b-0">
              <Link
                href={`/match?id=${m.id}`}
                className="block px-[10px] py-[7px]"
              >
                <p className="text-[9px] text-[#737B8C] mb-[4px]">{m.date}, {m.time}</p>
                <div className="flex items-center gap-[8px]">
                  {/* Pin to top */}
                  {onTogglePin && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={pinnedIds?.includes(m.id) ? 'Üste sabitlemeyi kaldır' : 'Üste sabitle'}
                      aria-pressed={pinnedIds?.includes(m.id)}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(m.id) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onTogglePin(m.id) } }}
                      className="flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={pinnedIds?.includes(m.id) ? '#0E8FCF' : '#c0c8d4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" />
                      </svg>
                    </span>
                  )}
                  {/* Stream tile */}
                  <div className={`w-[30px] h-[30px] rounded-md flex items-center justify-center flex-shrink-0 ${m.hasStream ? 'bg-[#0E8FCF]' : 'bg-[#f1f5f9]'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={m.hasStream ? '#fff' : '#c0c8d4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M10 8.5v5l4-2.5z" />
                    </svg>
                  </div>

                  {/* Teams (no score — fixture hasn't started) */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#1a2332] font-medium truncate">{m.team1}</p>
                    <p className="text-[11px] text-[#1a2332] font-medium truncate">{m.team2}</p>
                  </div>

                  {/* Odds boxes — Maç Sonucu only */}
                  <div className="flex gap-[3px] flex-shrink-0">
                    {m.odds.map((odd, j) => {
                      const disabled = isSuspended(odd.value)
                      const id = matchResultOddId(m.id, odd.label)
                      const sel = has(id)
                      return (
                        <span
                          key={j}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-label={`${odd.label} ${odd.value}`}
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation()
                            if (disabled) return
                            toggle({ id, league: m.league, match: `${m.team1} - ${m.team2}`, market: MATCH_RESULT, pick: odd.label, baseOdd: parseFloat(odd.value) || 1, isLive: false, sport: m.sport })
                          }}
                          className={`w-[52px] h-[38px] rounded-md flex items-center justify-center text-[11px] font-semibold ${disabled ? 'bg-[#f4f6f9] cursor-default' : `cursor-pointer ${sel ? 'bg-[#0E8FCF] text-white' : 'bg-[#edf5ff] text-[#1a2332]'}`}`}
                        >
                          {disabled ? <OddLock /> : odd.value}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </Link>

              {/* "+N" expandable markets (task 7) */}
              <span
                role="button"
                tabIndex={0}
                onClick={() => toggleExpanded(m.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(m.id) }}
                className="mx-[10px] mb-[7px] flex items-center justify-center gap-[3px] rounded-lg px-[8px] py-[5px] bg-[#f4f6f9] border border-[#eef1f5] text-[9px] font-bold text-[#737B8C] cursor-pointer w-fit"
              >
                +{m.totalOdds}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>

              {isOpen && (
                <MarketsExpand
                  fixture={m}
                  matchId={m.id}
                  league={m.league}
                  team1={m.team1}
                  team2={m.team2}
                  sport={m.sport}
                  isLive={false}
                  activeMarket="MS"
                />
              )}
              </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
