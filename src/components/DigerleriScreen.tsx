'use client'

import { useRouter } from 'next/navigation'
import DigerleriMenu from './DigerleriMenu'

export default function DigerleriScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-[16px] font-bold text-[#1a2332]">Diğerleri</h1>
          <button onClick={() => router.push('/search')} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a2332] to-[#3a4d6b] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <img src="/icons/digerleri.svg" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-white leading-tight">Keşfedilecek Daha Çok Şey</p>
              <p className="text-[10px] text-white/70 mt-[2px]">Poker, çark, e-spor ve daha fazlası bir arada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canonical menu list */}
      <div className="px-4 pt-4 pb-24">
        <DigerleriMenu onNavigate={(href) => router.push(href)} />
      </div>
    </div>
  )
}
