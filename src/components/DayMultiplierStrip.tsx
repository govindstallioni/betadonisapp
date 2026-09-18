'use client'

import { useAuth } from './AuthProvider'
import { DAY_MULTIPLIERS } from '@/data/wheelData'

// Visual below the wheel showing the per-day payout multiplier (cark.html
// .multiplier-section). The active day's box is highlighted; winnings are
// auto-multiplied by SpinWheel.tsx using this exact same array.
export default function DayMultiplierStrip() {
  const { wheel } = useAuth()
  const dayNumber = wheel.firstDepositAt
    ? Math.floor((Date.now() - wheel.firstDepositAt) / 86400000) + 1
    : 0
  const activeIdx = dayNumber > 0 ? (dayNumber - 1) % 7 : -1

  return (
    <div className="w-full">
      <p className="text-[11px] font-bold text-[#8ba1b7] uppercase tracking-[0.6px] mb-2.5">Günlük Kazanç Çarpanı</p>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_MULTIPLIERS.map((m, i) => {
          const active = i === activeIdx
          return (
            <div
              key={i}
              className={`rounded-xl py-2 px-px text-center text-[9px] font-semibold border ${
                active ? 'bg-[#0284c7] border-[#0284c7] text-[#fff]' : 'bg-[#fff] border-[#e2e8f0] text-[#94a3b8]'
              }`}
              style={{ boxShadow: active ? '0 4px 10px rgba(2, 132, 199, 0.25)' : '0 2px 4px rgba(0, 0, 0, 0.015)' }}
            >
              GÜN {i + 1}
              <div className={`text-[14px] font-extrabold mt-1 ${active ? 'text-[#fff]' : 'text-[#0f172a]'}`}>x{m}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
