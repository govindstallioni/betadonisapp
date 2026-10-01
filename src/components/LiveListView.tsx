'use client'

import Link from 'next/link'
import { useBetSlip } from './BetSlipProvider'
import { MARKET_CONFIG, OddsMarket } from './MatchCard'
import OddLock, { isSuspended } from './OddLock'
import { Match, halfText } from '@/data/liveData'
import Flag from '@/components/Flag'

// ── "Betadonis live betting list view" (live9.png) ─────────────────────────
// Compact alternative to the MatchCard stack: matches grouped under a league
// header row that carries the outcome column labels, then one dense row per
// match — minute/half, stream tile, teams with scores, and the odds boxes of
// the active market. Odds are wired to the betslip exactly like MatchCard.

function groupByLeague(matches: Match[]) {
  const groups: { league: string; flag: string; matches: Match[] }[] = []
  for (const m of matches) {
    const g = groups.find((x) => x.league === m.league)
    if (g) g.matches.push(m)
    else groups.push({ league: m.league, flag: m.flag, matches: [m] })
  }
  return groups
}

export default function LiveListView({ matches, market, pinnedIds, onTogglePin }: { matches: Match[]; market: OddsMarket; pinnedIds?: string[]; onTogglePin?: (id: string) => void }) {
  const { has, toggle } = useBetSlip()
  const { label: marketLabel, pick } = MARKET_CONFIG[market]

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
      {groupByLeague(matches).map((g) => {
        const columns = pick(g.matches[0]).map((o) => o.label)
        return (
          <div key={g.league}>
            {/* League header + outcome column labels */}
            <div className="flex items-center bg-[#1a2332] px-[10px] py-[6px]">
              <div className="flex-1 flex items-center gap-[5px] min-w-0">
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
              const sub = halfText(m.half)
              const odds = pick(m)
              return (
                <Link
                  key={m.id}
                  href={`/match?id=${m.id}`}
                  className="block px-[10px] py-[7px] border-b border-[#f0f2f5] last:border-b-0"
                >
                  <p className="text-[9px] text-[#737B8C] mb-[4px]">
                    <span className="text-[#e74c3c] font-semibold">{m.minute}{/^\d/.test(m.minute) && <>&apos;</>}</span>
                    {sub && <> · {sub}</>}
                  </p>
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

                    {/* Teams + scores */}
                    <div className="flex-1 min-w-0">
                      {[[m.team1, m.score1], [m.team2, m.score2]].map(([team, score]) => (
                        <div key={team} className="flex items-center justify-between gap-[4px]">
                          <span className="text-[11px] text-[#1a2332] font-medium truncate">{team}</span>
                          <span className="text-[11px] text-[#0E8FCF] font-bold flex-shrink-0">{score}</span>
                        </div>
                      ))}
                    </div>

                    {/* Odds boxes */}
                    <div className="flex gap-[3px] flex-shrink-0">
                      {odds.map((odd, j) => {
                        const disabled = isSuspended(odd.value)
                        const id = `${m.id}::${marketLabel}::${odd.label}`
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
                              toggle({ id, league: m.league, match: `${m.team1} - ${m.team2}`, market: marketLabel, pick: odd.label, baseOdd: parseFloat(odd.value) || 1, isLive: true, sport: m.sport })
                            }}
                            className={`relative w-[52px] h-[38px] rounded-md flex items-center justify-center text-[11px] font-semibold ${disabled ? 'bg-[#f4f6f9] cursor-default' : `cursor-pointer ${sel ? 'bg-[#0E8FCF] text-white' : `bg-[#edf5ff] text-[#1a2332] ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}`}`}
                          >
                            {disabled ? <OddLock /> : odd.value}
                            {!disabled && !sel && odd.trend === 'up' && (
                              <svg className="absolute top-[1px] left-1/2 -translate-x-1/2" width="9" height="9" viewBox="0 0 24 24" fill="#27ae60"><path d="M7 14l5-5 5 5z" /></svg>
                            )}
                            {!disabled && !sel && odd.trend === 'down' && (
                              <svg className="absolute bottom-[1px] left-1/2 -translate-x-1/2" width="9" height="9" viewBox="0 0 24 24" fill="#e74c3c"><path d="M7 10l5 5 5-5z" /></svg>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
