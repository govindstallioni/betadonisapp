'use client'

import { useAuth } from './AuthProvider'
import { DAY_MULTIPLIERS } from '@/data/wheelData'

// Visual below the wheel showing the per-day payout multiplier (cark1.png).
// The active day's chip is highlighted; winnings are auto-multiplied by
// SpinWheel.tsx using this exact same array, so the two never drift apart.
export default function DayMultiplierStrip() {
  const { wheel } = useAuth()
  const dayNumber = wheel.firstDepositAt
    ? Math.floor((Date.now() - wheel.firstDepositAt) / 86400000) + 1
    : 0
  const activeIdx = dayNumber > 0 ? (dayNumber - 1) % 7 : -1

  return (
    <div className="mt-3">
      <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide mb-2 px-1">Günlük Kazanç Çarpanı</p>
      <div className="grid grid-cols-7 gap-[6px]">
        {DAY_MULTIPLIERS.map((m, i) => {
          const active = i === activeIdx
          return (
            <div
              key={i}
              className={`rounded-lg py-[8px] flex flex-col items-center gap-[2px] border ${
                active ? 'bg-[#0E8FCF] border-[#0E8FCF]' : 'bg-white border-[#e8ecf1]'
              }`}
            >
              <span className={`text-[8px] font-semibold uppercase ${active ? 'text-white/70' : 'text-[#94a3b8]'}`}>Gün {i + 1}</span>
              <span className={`text-[12px] font-extrabold ${active ? 'text-white' : 'text-[#1a2332]'}`}>x{m}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
