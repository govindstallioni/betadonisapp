'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SectionHeader from './SectionHeader'
import { jackpots, AnimatedAmount } from './megaJackpotData'

export default function MegaJackpot() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  // Auto-advance one box every 15s; each box is exactly half the row's width
  // (see w-[calc((100%-8px)/2)] below), so every snap position always shows
  // two full boxes — never a half-cut one.
  useEffect(() => {
    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const card = el.querySelector('[data-jp-card]') as HTMLElement
      if (!card) return
      const cardWidth = card.offsetWidth + 8 // gap-[8px]
      indexRef.current = (indexRef.current + 1) % jackpots.length
      const maxScroll = el.scrollWidth - el.clientWidth
      el.scrollTo({ left: Math.min(indexRef.current * cardWidth, maxScroll), behavior: 'smooth' })
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <SectionHeader title="Mega Jackpot" />
      <div
        ref={scrollRef}
        className="flex gap-[8px] overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {jackpots.map((jp, i) => (
          <Link
            href="/mega-jackpot"
            key={i}
            data-jp-card
            className="flex-shrink-0 w-[calc((100%-8px)/2)] rounded-xl px-[12px] py-[8px] flex flex-col items-center gap-[5px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{
              scrollSnapAlign: 'start',
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
          </Link>
        ))}
      </div>
    </div>
  )
}
