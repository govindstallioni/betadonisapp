'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BetSettingsPage() {
  const router = useRouter()
  const [oddsChange, setOddsChange] = useState(0)

  const oddsOptions = [
    'Değişiklikleri onaylamamı iste',
    'Herhangi değişikliği kabul et',
    'Oranlar artarsa kabul et',
  ]

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Bahis Ayarları</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4">
        <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-5 pb-2">Oranlar değişince</p>
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          {oddsOptions.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setOddsChange(i)}
              className={`w-full flex items-center gap-3 px-3 py-3.5 text-left ${i < oddsOptions.length - 1 ? 'border-b border-[#f0f2f5]' : ''}`}
            >
              <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${oddsChange === i ? 'border-[#0E8FCF]' : 'border-[#d0d5dd]'}`}>
                {oddsChange === i && <div className="w-[10px] h-[10px] rounded-full bg-[#0E8FCF]" />}
              </div>
              <span className={`text-[12px] font-medium ${oddsChange === i ? 'text-[#0E8FCF]' : 'text-[#1a2332]'}`}>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
