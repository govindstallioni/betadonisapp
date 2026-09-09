'use client'

import Link from 'next/link'
import NotifyBell from './NotifyBell'
import LiveTag from './LiveTag'
import FavoriteStar from './FavoriteStar'
import { SPORT_ICONS } from './sportIcons'
import { useBetSlip } from './BetSlipProvider'
import { PreMatch } from '@/data/prematchData'

// Reusable pre-match fixture card — same anatomy as MatchCard (league header,
// teams, odds row) but for upcoming (non-live) matches: date/time instead of
// a live score/minute, and no live-only affordances (LiveTag stays, minute doesn't).
export default function PreMatchCard({ match, className = '' }: { match: PreMatch; className?: string }) {
  const { has, toggle } = useBetSlip()

  return (
    <Link
      href={`/match?id=${match.id}`}
      className={`block bg-white rounded-xl overflow-hidden border border-[#e8ecf1] ${className}`}
    >
      {/* League header */}
      <div className="flex items-center justify-between px-[10px] py-[7px] border-b border-[#f0f2f5]">
        <div className="flex items-center gap-[5px] min-w-0">
          <span className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0 text-[#374957]">
            {SPORT_ICONS[match.sport]}
          </span>
          <span className="text-[10px] text-[#737B8C] font-medium truncate max-w-[110px]">{match.league}</span>
        </div>
        <div className="flex items-center gap-[6px] flex-shrink-0">
          <NotifyBell size={12} />
          {match.hasStream && <LiveTag />}
          <FavoriteStar
            size={12}
            item={{
              type: 'event',
              id: match.id,
              title: `${match.team1} - ${match.team2}`,
              subtitle: match.league,
              href: `/match?id=${match.id}`,
              logo1: match.logo1,
              logo2: match.logo2,
              isLive: false,
            }}
          />
        </div>
      </div>

      {/* Match center: teams + date/time */}
      <div className="px-[10px] py-[10px]">
        <div className="flex items-center">
          <div className="flex-1 flex items-center justify-end gap-[6px]">
            <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate text-right">{match.team1}</span>
            <img src={match.logo1} alt={match.team1} className="w-[22px] h-[22px] object-contain flex-shrink-0" />
          </div>
          <div className="flex flex-col items-center px-[16px]">
            <span className="text-[14px] font-bold text-[#1a2332] leading-none">VS</span>
          </div>
          <div className="flex-1 flex items-center gap-[6px]">
            <img src={match.logo2} alt={match.team2} className="w-[22px] h-[22px] object-contain flex-shrink-0" />
            <span className="text-[11px] text-[#1a2332] font-medium leading-tight truncate">{match.team2}</span>
          </div>
        </div>
        <p className="text-[9px] text-[#737B8C] text-center mt-[6px]">{match.date}, {match.time}</p>
      </div>

      {/* Odds */}
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
                  toggle({ id, league: match.league, match: `${match.team1} - ${match.team2}`, market: '1X2', pick: odd.label, baseOdd: parseFloat(odd.value) || 1, isLive: false })
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
