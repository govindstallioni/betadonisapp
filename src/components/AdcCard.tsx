'use client'

import Link from 'next/link'
import { useAdc } from './AdcProvider'
import { fmtAdc } from '@/data/adc'

// Home-page entry point for Adonis Coin — the client asked for the ADC balance
// to sit "in the menu and on the homepage, colourful and icon-based, like a
// button". Same inline placement as CallMeCard rather than another floating
// launcher. Renders on ?view=sports too: ADC is a sports-only product.
export default function AdcCard() {
  const { loaded, available, pending } = useAdc()

  return (
    <Link
      href="/adonis-coin"
      className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#0891b2] to-[#0e7490] px-3 py-3 active:scale-[0.99] transition-transform"
    >
      {/* Decorative coin motif */}
      <svg width="88" height="88" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
        className="absolute -right-3 -top-4 text-white/10 pointer-events-none">
        <circle cx="12" cy="12" r="10" />
      </svg>

      <span className="relative w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[18px] font-bold leading-none">₳</span>
      </span>

      <span className="relative flex-1 min-w-0">
        <span className="block text-[13px] font-bold text-white">Adonis Coin Kodları</span>
        <span className="block text-[10px] text-white/75 mt-[2px] truncate">
          Promosyon Puanları: {loaded ? fmtAdc(available) : 0} ADC PUAN
          {loaded && pending > 0 && ` · ${fmtAdc(pending)} bekliyor`}
        </span>
      </span>

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative flex-shrink-0 opacity-80">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  )
}
