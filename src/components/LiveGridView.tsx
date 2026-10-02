'use client'

import MatchCard, { OddsMarket } from './MatchCard'
import { Match } from '@/data/liveData'
import Flag from '@/components/Flag'

// ── "Grid" view, redesigned (task 7) ─────────────────────────────────────────
// The old 2-fixed-column grid squeezed MatchCard down to compact mode, which
// made team names and odds unreadable (lives1.png: "Tür...", "İngi...").
// Matches now group by league, same as LiveListView, and each league's cards
// render full-size in a horizontally scrollable, scroll-snapped row — "2
// boxes side by side" becomes "swipe between full-size boxes" instead of
// "squeeze 2 boxes into half the width."

function groupByLeague(matches: Match[]) {
  const groups: { league: string; flag: string; matches: Match[] }[] = []
  for (const m of matches) {
    const g = groups.find((x) => x.league === m.league)
    if (g) g.matches.push(m)
    else groups.push({ league: m.league, flag: m.flag, matches: [m] })
  }
  return groups
}

export default function LiveGridView({ matches, market, pinnedIds, onTogglePin, onTogglePinLeague }: {
  matches: Match[]
  market: OddsMarket
  pinnedIds: string[]
  onTogglePin: (id: string) => void
  onTogglePinLeague: (ids: string[]) => void
}) {
  return (
    <div className="flex flex-col gap-[14px]">
      {groupByLeague(matches).map((g) => {
        const ids = g.matches.map((m) => m.id)
        const leaguePinned = ids.every((id) => pinnedIds.includes(id))
        return (
          <div key={g.league}>
            <div className="flex items-center gap-[6px] mb-[8px] px-[2px]">
              <span
                role="button"
                tabIndex={0}
                aria-label={leaguePinned ? 'Ligi üste sabitlemeyi kaldır' : 'Ligi üste sabitle'}
                aria-pressed={leaguePinned}
                onClick={() => onTogglePinLeague(ids)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onTogglePinLeague(ids) }}
                className="flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={leaguePinned ? '#0E8FCF' : '#c0c8d4'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" />
                </svg>
              </span>
              <Flag emoji={g.flag} size={15} />
              <span className="text-[11px] text-[#1a2332] font-semibold truncate">{g.league}</span>
            </div>

            {g.matches.length === 1 ? (
              <MatchCard match={g.matches[0]} market={market} pinned={pinnedIds.includes(g.matches[0].id)} onTogglePin={() => onTogglePin(g.matches[0].id)} />
            ) : (
              <div className="flex gap-[10px] overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {g.matches.map((m) => (
                  <div key={m.id} className="flex-shrink-0 w-[88%]" style={{ scrollSnapAlign: 'start' }}>
                    <MatchCard match={m} market={market} pinned={pinnedIds.includes(m.id)} onTogglePin={() => onTogglePin(m.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
