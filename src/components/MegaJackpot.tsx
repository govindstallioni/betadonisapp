'use client'

import Link from 'next/link'
import SectionHeader from './SectionHeader'
import { jackpots, AnimatedAmount } from './megaJackpotData'

export default function MegaJackpot() {
  return (
    <div>
      <SectionHeader title="Mega Jackpot" />
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide -mx-4 px-4">
        {jackpots.map((jp, i) => (
          <Link
            href="/mega-jackpot"
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
          </Link>
        ))}
      </div>
    </div>
  )
}
