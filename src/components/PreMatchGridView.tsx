'use client'

import PreMatchCard from './PreMatchCard'
import { PreMatch } from '@/data/prematchData'
import Flag from '@/components/Flag'

// Pre-match counterpart to LiveGridView (task 7) — see that file for why the
// old fixed 2-column grid was replaced with per-league horizontal scrolling.

function groupByLeague(matches: PreMatch[]) {
  const groups: { league: string; flag: string; matches: PreMatch[] }[] = []
  for (const m of matches) {
    const g = groups.find((x) => x.league === m.league)
    if (g) g.matches.push(m)
    else groups.push({ league: m.league, flag: m.flag, matches: [m] })
  }
  return groups
}

export default function PreMatchGridView({ matches, pinnedIds, onTogglePin, onTogglePinLeague }: {
  matches: PreMatch[]
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
              <PreMatchCard match={g.matches[0]} pinned={pinnedIds.includes(g.matches[0].id)} onTogglePin={() => onTogglePin(g.matches[0].id)} />
            ) : (
              <div className="flex gap-[10px] overflow-x-auto scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                {g.matches.map((m) => (
                  <div key={m.id} className="flex-shrink-0 w-[88%]" style={{ scrollSnapAlign: 'start' }}>
                    <PreMatchCard match={m} pinned={pinnedIds.includes(m.id)} onTogglePin={() => onTogglePin(m.id)} />
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
