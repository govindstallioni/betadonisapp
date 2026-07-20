'use client'

import Link from 'next/link'
import NotifyBell from './NotifyBell'
import LiveTag from './LiveTag'
import { useBetSlip } from './BetSlipProvider'
import { Match, halfText } from '@/data/liveData'

// Reusable single match card in the ls1.png style. Renders full-width so it
// works both in a single-column stack and inside a 2-column grid. Odds pills
// are wired to the global betslip; the whole card links to the match detail.
export default function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { has, toggle } = useBetSlip()
  const sub = halfText(match.half)

  return (
    <Link
      href={`/match?id=${match.id}`}
      className="block bg-white rounded-xl overflow-hidden border border-[#e8ecf1]"
    >
      {/* League header */}
      <div className="flex items-center justify-between px-[10px] py-[7px] border-b border-[#f0f2f5]">
        <div className="flex items-center gap-[5px] min-w-0">
          <span className="text-[13px] flex-shrink-0">{match.flag}</span>
          <span className="text-[10px] text-[#737B8C] font-medium truncate">{match.league}</span>
        </div>
        <div className="flex items-center gap-[6px] flex-shrink-0">
          {match.hasStream && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          )}
          <NotifyBell size={12} />
          <LiveTag />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      {/* Teams + score */}
      <div className="px-[10px] py-[10px]">
        <div className="flex items-center">
          <div className="flex-1 flex items-center justify-end gap-[6px] min-w-0">
            <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} text-[#1a2332] font-medium leading-tight truncate text-right`}>{match.team1}</span>
            <img src={match.logo1} alt="" className="w-[22px] h-[22px] object-contain flex-shrink-0" />
          </div>
          <div className="flex flex-col items-center px-[14px] flex-shrink-0">
            <div className="flex items-center gap-[4px]">
              <span className="text-[13px] font-bold text-[#1a2332] leading-none">{match.score1}</span>
              <span className="text-[10px] font-bold text-[#9ca3af] leading-none">:</span>
              <span className="text-[13px] font-bold text-[#1a2332] leading-none">{match.score2}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-[4px] h-[4px] rounded-full bg-[#e74c3c] animate-pulse-dot" />
              <span className="text-[9px] text-[#e74c3c] font-semibold whitespace-nowrap">{match.minute}</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-[6px] min-w-0">
            <img src={match.logo2} alt="" className="w-[22px] h-[22px] object-contain flex-shrink-0" />
            <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} text-[#1a2332] font-medium leading-tight truncate`}>{match.team2}</span>
          </div>
        </div>
        {sub && (
          <p className="text-[9px] text-[#737B8C] text-center mt-[6px]">
            {sub}, geçen süre: {match.minute}<span className="animate-pulse-dot">&apos;</span> ({match.score1}-{match.score2})
          </p>
        )}
      </div>

      {/* Odds (1X2) */}
      <div className="px-[10px] pb-[10px]">
        <div className="flex gap-[5px]">
          {match.odds.map((odd, j) => {
            const disabled = odd.value === '—'
            const id = `${match.id}::1X2::${odd.label}`
            const sel = has(id)
            return (
              <span
                key={j}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={(e) => {
                  e.preventDefault(); e.stopPropagation()
                  if (disabled) return
                  toggle({ id, league: match.league, match: `${match.team1} - ${match.team2}`, market: '1X2', pick: odd.label, baseOdd: parseFloat(odd.value) || 1 })
                }}
                className={`flex-1 rounded-lg py-[6px] px-[8px] flex items-center justify-between border ${disabled ? 'bg-[#f4f6f9] border-[#eef1f5] cursor-default' : `cursor-pointer ${sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : `bg-[#edf5ff] border-[#e8ecf1] ${odd.trend === 'up' ? 'animate-flash-green' : odd.trend === 'down' ? 'animate-flash-red' : ''}`}`}`}
              >
                <span className={`text-[9px] font-semibold uppercase ${sel ? 'text-white/80' : 'text-[#737B8C]'}`}>{odd.label}</span>
                <span className={`text-[10px] font-medium flex items-center gap-[2px] ${sel ? 'text-white' : odd.trend === 'up' ? 'text-[#27ae60]' : odd.trend === 'down' ? 'text-[#e74c3c]' : 'text-[#1a2332]'}`}>
                  {odd.value}
                  {!sel && !disabled && odd.trend === 'up' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#27ae60"><path d="M7 14l5-5 5 5z" /></svg>}
                  {!sel && !disabled && odd.trend === 'down' && <svg width="8" height="8" viewBox="0 0 24 24" fill="#e74c3c"><path d="M7 10l5 5 5-5z" /></svg>}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
