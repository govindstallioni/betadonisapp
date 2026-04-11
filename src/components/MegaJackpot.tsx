'use client'

import { useState, useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'

const jackpots = [
  {
    label: 'CASINO',
    icon: '/spotlight/1.png',
    amount: 3621155,
    color: '#f59e0b',
  },
  {
    label: 'CASINO',
    icon: '/spotlight/2.png',
    amount: 389129,
    color: '#0E8FCF',
  },
  {
    label: 'CASINO',
    icon: '/spotlight/3.png',
    amount: 7679,
    color: '#27ae60',
  },
  {
    label: 'CASINO',
    icon: '/spotlight/4.png',
    amount: 4090,
    color: '#8b5cf6',
  },
]

function AnimatedAmount({ target }: { target: number }) {
  const [value, setValue] = useState(target)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    ref.current = setInterval(() => {
      setValue(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 200)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [])

  return (
    <>
      {value.toLocaleString('tr-TR')} TRY
    </>
  )
}

export default function MegaJackpot() {
  return (
    <div>
      <SectionHeader title="MEGA JACKPOT - ÖDÜL HAVUZU" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {jackpots.map((jp, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[170px] rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.97] transition-transform px-3 py-2.5 flex flex-col gap-1.5 bg-white border-2"
            style={{ borderColor: jp.color }}
          >
            <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: jp.color }}>{jp.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-[28px] h-[28px] rounded-lg overflow-hidden flex-shrink-0 border" style={{ borderColor: jp.color }}>
                <img src={jp.icon} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="tabular-nums font-extrabold text-[12px] leading-none tracking-wide" style={{ color: jp.color }}>
                <AnimatedAmount target={jp.amount} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
