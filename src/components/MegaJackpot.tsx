'use client'

import { useState, useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'

const jackpots = [
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 4429349,
    icon: '/megajackpot/icon01.png',
    gradient: 'linear-gradient(160deg, #FFB347 0%, #FF7A00 50%, #E85D00 100%)',
    shadow: 'rgba(255,122,0,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 666679,
    icon: '/megajackpot/icon02.png',
    gradient: 'linear-gradient(160deg, #38BDF8 0%, #0284C7 50%, #0054A6 100%)',
    shadow: 'rgba(2,132,199,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 5627,
    icon: '/megajackpot/icon03.png',
    gradient: 'linear-gradient(160deg, #4ADE80 0%, #16A34A 50%, #166534 100%)',
    shadow: 'rgba(22,163,74,0.3)',
  },
  {
    label: 'CASINO',
    provider: 'AMUSNET',
    amount: 1400,
    icon: '/megajackpot/icon04.png',
    gradient: 'linear-gradient(160deg, #CBD5E1 0%, #94A3B8 50%, #64748B 100%)',
    shadow: 'rgba(100,116,139,0.3)',
  },
]


function AnimatedAmount({ target }: { target: number }) {
  const [val, setVal] = useState(target)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    ref.current = setInterval(() => {
      setVal(p => p + Math.floor(Math.random() * 3) + 1)
    }, 200)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])
  return <>{val.toLocaleString('tr-TR')}</>
}

export default function MegaJackpot() {
  return (
    <div>
      <SectionHeader title="Mega Jackpot" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {jackpots.map((jp, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[190px] rounded-xl px-[12px] py-[8px] flex flex-col items-center gap-[5px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{
              background: jp.gradient,
              boxShadow: `0 2px 6px ${jp.shadow}`,
            }}
          >
            {/* Label */}
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/80">
              {jp.label}
            </span>

            {/* Icon */}
            <img src={jp.icon} alt="" className="w-[44px] h-[44px] object-contain flex-shrink-0" />

            {/* Amount */}
            <div className="flex flex-col items-center gap-[1px]">
              <span className="text-[13px] font-black text-white leading-none tabular-nums">
                <AnimatedAmount target={jp.amount} />
              </span>
              <span className="text-[9px] font-bold text-white/80">TRY</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
