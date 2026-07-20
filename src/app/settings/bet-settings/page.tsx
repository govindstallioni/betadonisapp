'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-[40px] h-[22px] rounded-full flex items-center px-[2px] transition-colors ${value ? 'bg-[#0E8FCF]' : 'bg-[#d0d5dd]'}`}
    >
      <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  )
}

export default function BetSettingsPage() {
  const router = useRouter()
  const [oddsChange, setOddsChange] = useState(0)
  const [instantNotify, setInstantNotify] = useState(true)
  const [clearAfterBet, setClearAfterBet] = useState(true)
  const [removeFinished, setRemoveFinished] = useState(true)

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
        <p className="text-[12px] font-bold text-[#0E8FCF] px-1 pt-5 pb-2">Etkinlikler</p>
        <div className="bg-white rounded-xl border border-[#e8ecf1] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bahisler yapıldığında anlık bildirimleri alın</span>
            <Toggle value={instantNotify} onChange={setInstantNotify} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#f0f2f5]">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bahis yapıldıktan sonra bahis kuponunu temizle</span>
            <Toggle value={clearAfterBet} onChange={setClearAfterBet} />
          </div>
          <div className="flex items-center justify-between px-3 py-3.5">
            <span className="text-[12px] font-medium text-[#1a2332] flex-1 pr-3">Bitmiş etkinlikleri bahis kuponundan çıkar</span>
            <Toggle value={removeFinished} onChange={setRemoveFinished} />
          </div>
        </div>
      </div>
    </div>
  )
}
