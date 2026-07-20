'use client'

import { useRouter } from 'next/navigation'
import SpinWheel from './SpinWheel'

const perks = [
  { t: 'Her gün ücretsiz çevirme', d: 'Günde bir kez çarkı çevir, boş yok' },
  { t: 'Çevrimsiz nakit ödül', d: 'Kazancın anında çekilebilir bakiye olur' },
  { t: 'Sürpriz bonuslar', d: 'Freebet, freespin ve daha fazlası' },
]

export default function SansCarkiScreen() {
  const router = useRouter()

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] flex items-center gap-2">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332] px-1">Şans Çarkı</h1>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      <div className="px-4 pt-4 pb-24">
        <SpinWheel />

        {/* Perks */}
        <div className="mt-5 flex flex-col gap-[8px]">
          {perks.map((p) => (
            <div key={p.t} className="bg-white rounded-xl border border-[#e8ecf1] px-3.5 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fff7ed] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#1a2332] leading-tight">{p.t}</p>
                <p className="text-[10px] text-[#737B8C] mt-[2px] leading-tight">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
