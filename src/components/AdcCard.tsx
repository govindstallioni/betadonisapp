'use client'

import Link from 'next/link'
import { useAdc } from './AdcProvider'
import { fmtAdc } from '@/data/adc'

// Home-page entry point for Adonis Coin — the client asked for the ADC balance
// to sit "in the menu and on the homepage, colourful and icon-based, like a
// button". Same inline placement as CallMeCard rather than another floating
// launcher. v2.1 adds the "🎯 Görevler" shortcut next to it (revize-coin §2.4).
export default function AdcCard() {
  const { loaded, available, pending } = useAdc()

  return (
    <div className="relative flex items-stretch overflow-hidden rounded-xl bg-gradient-to-r from-[#0891b2] to-[#0e7490]">
      {/* Decorative coin motif */}
      <svg width="88" height="88" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
        className="absolute right-16 -top-4 text-white/10 pointer-events-none">
        <circle cx="12" cy="12" r="10" />
      </svg>

      <Link href="/adonis-coin" className="relative flex-1 min-w-0 flex items-center gap-3 px-3 py-3 active:scale-[0.99] transition-transform">
        <span className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[18px] font-bold leading-none">₳</span>
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-bold text-white">Adonis Coin Kodları</span>
          <span className="block text-[10px] text-white/75 mt-[2px] truncate">
            💰 {loaded ? fmtAdc(available) : 0} ADC · Mağazaya Git
            {loaded && pending > 0 && ` · ${fmtAdc(pending)} bekliyor`}
          </span>
        </span>
      </Link>

      <Link
        href="/adonis-coin/gorevler"
        className="relative flex-shrink-0 flex flex-col items-center justify-center gap-[2px] px-3 border-l border-white/20 active:bg-white/10"
      >
        <span className="text-[18px] leading-none" aria-hidden="true">🎯</span>
        <span className="text-[10px] font-bold text-white">Görevler</span>
      </Link>
    </div>
  )
}
