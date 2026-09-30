'use client'

import { MultiMarketFixture } from '@/data/liveData'
import { useBetSlip } from './BetSlipProvider'
import OddLock, { isSuspended } from './OddLock'
import { MARKET_CONFIG, OddsMarket } from './MatchCard'

// Inline "show me the other markets" panel behind a match card's "+N" badge —
// task 4 (revize v6.1 §4): browse every other market for a fixture without
// leaving the list. Lives outside MatchCard/PreMatchCard's <Link> so a click
// anywhere in here must stopPropagation, or it'd navigate to the match page
// the same way the existing odds pills already guard against that.
export default function MarketsExpand({
  fixture, matchId, league, team1, team2, sport, isLive, activeMarket,
}: {
  fixture: MultiMarketFixture
  matchId: string
  league: string
  team1: string
  team2: string
  sport: string
  isLive: boolean
  activeMarket: OddsMarket
}) {
  const { has, toggle } = useBetSlip()
  const matchLabel = `${team1} - ${team2}`

  const otherMarkets = (Object.keys(MARKET_CONFIG) as OddsMarket[])
    .filter((key) => key !== activeMarket)
    .map((key) => {
      const { label, pick } = MARKET_CONFIG[key]
      return { key, label, odds: pick(fixture) }
    })
    // A sport that can't draw (basketball, tennis, ...) fills Çifte
    // Şans/Beraberlik/Kornerler with the disabled '—' placeholder for every
    // outcome — no point showing an accordion section that's all padlocks.
    .filter((m) => m.odds.some((o) => !isSuspended(o.value)))

  if (otherMarkets.length === 0) return null

  return (
    <div
      className="border-t border-[#f0f2f5] px-[10px] py-[10px] flex flex-col gap-[10px]"
      onClick={(e) => e.stopPropagation()}
    >
      {otherMarkets.map((m) => (
        <div key={m.key}>
          <p className="text-[10px] font-bold text-[#1a2332] mb-[6px]">{m.label}</p>
          <div className="flex flex-wrap gap-[5px]">
            {m.odds.map((odd, j) => {
              const disabled = isSuspended(odd.value)
              const id = `${matchId}::${m.label}::${odd.label}`
              const sel = has(id)
              return (
                <span
                  key={j}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onClick={(e) => {
                    e.preventDefault(); e.stopPropagation()
                    if (disabled) return
                    toggle({ id, league, match: matchLabel, market: m.label, pick: odd.label, baseOdd: parseFloat(odd.value) || 1, isLive, sport })
                  }}
                  className={`flex-1 min-w-[calc(50%-3px)] rounded-lg py-[6px] px-[8px] flex items-center border ${disabled ? 'bg-[#f4f6f9] border-[#eef1f5] cursor-default justify-center' : `cursor-pointer justify-between ${sel ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'bg-[#edf5ff] border-[#e8ecf1]'}`}`}
                >
                  {disabled ? (
                    <OddLock />
                  ) : (
                    <>
                      <span className={`text-[9px] font-semibold ${sel ? 'text-white/80' : 'text-[#737B8C]'}`}>{odd.label}</span>
                      <span className={`text-[10px] font-medium ${sel ? 'text-white' : 'text-[#1a2332]'}`}>{odd.value}</span>
                    </>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
