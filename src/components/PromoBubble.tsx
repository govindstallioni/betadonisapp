'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'

// 1xBet-style promo bubble: shown to logged-out visitors while they browse,
// repeating at intervals (not just once) until they register or log in.
const FIRST_DELAY_MS = 20000
const REPEAT_INTERVAL_MS = 90000

export default function PromoBubble() {
  const { loaded, isLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!loaded || isLoggedIn) {
      setOpen(false)
      return
    }
    const firstTimer = setTimeout(() => setOpen(true), FIRST_DELAY_MS)
    const interval = setInterval(() => setOpen(true), FIRST_DELAY_MS + REPEAT_INTERVAL_MS)
    return () => {
      clearTimeout(firstTimer)
      clearInterval(interval)
    }
  }, [loaded, isLoggedIn])

  const close = () => setOpen(false)

  if (!open || !loaded || isLoggedIn) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/50 z-[92]" />

      {/* Bubble card */}
      <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[93] flex items-center justify-center px-6 pointer-events-none">
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto relative w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.35)] animate-winner-in"
        >
          <button
            onClick={close}
            aria-label="Kapat"
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="w-full aspect-[16/10] bg-gray-100">
            <img src="/promotions/01.png" alt="Promosyon" className="w-full h-full object-cover" />
          </div>

          <div className="px-5 pt-4 pb-5 text-center">
            <p className="text-[16px] font-bold text-[#1a2332] leading-snug">
              Büyük kazançlar elde etmek için acele edin!
            </p>
            <p className="text-[12px] text-[#737B8C] mt-[6px] leading-relaxed">
              Büyük kazançları ve harika promosyonları kaçırmamak için hemen kayıt olun.
            </p>

            <div className="flex flex-col gap-[10px] mt-4">
              <Link href="/login" onClick={close} className="w-full h-[42px] rounded-full border-2 border-[#0E8FCF] text-[#0E8FCF] text-[13px] font-bold tracking-wide flex items-center justify-center">
                Giriş Yap
              </Link>
              <Link href="/register" onClick={close} className="w-full h-[42px] rounded-full bg-[#0E8FCF] text-white text-[13px] font-bold tracking-wide flex items-center justify-center">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
