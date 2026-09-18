'use client'

import { useRouter } from 'next/navigation'
import SpinWheel from './SpinWheel'
import DayMultiplierStrip from './DayMultiplierStrip'

// Layout, spacing and card styles follow betadonis.store/cark.html
// (.app-card / .info-card) — work3 task 4.
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

      <div className="px-3 pt-3 pb-24">
        <div
          className="rounded-3xl bg-[#eef6ff] pt-4 px-3.5 pb-5 flex flex-col gap-4"
          style={{ boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)' }}
        >
          <SpinWheel />
          <DayMultiplierStrip />

          <div className="flex flex-col gap-2.5">
            {perks.map((p) => (
              <div key={p.t} className="bg-[#fff] rounded-2xl px-4 py-3.5 flex items-center gap-3.5" style={{ boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)' }}>
                <div className="w-[34px] h-[34px] rounded-full bg-[#fff8f0] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]">{p.t}</p>
                  <p className="text-[12px] text-[#64748b] mt-0.5">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
