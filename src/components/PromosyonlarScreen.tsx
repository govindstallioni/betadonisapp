'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { promos, type Promo } from '@/data/promotions'

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'spor', label: 'Spor' },
  { id: 'casino', label: 'Casino' },
  { id: 'genel', label: 'Genel' },
] as const

// `focusId` comes from /promosyonlar?promo=<id> (home PromoBanners tiles):
// that card is scrolled into view, briefly highlighted, and its rules open.
export default function PromosyonlarScreen({ focusId }: { focusId?: string }) {
  const router = useRouter()
  const focused = promos.find((p) => p.id === focusId) ?? null
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [openRules, setOpenRules] = useState<Promo | null>(focused)
  const [highlight, setHighlight] = useState<string | null>(focused?.id ?? null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!focused) return
    cardRefs.current[focused.id]?.scrollIntoView({ block: 'center' })
    const t = setTimeout(() => setHighlight(null), 2500)
    return () => clearTimeout(t)
  }, [focused])

  const visible = promos.filter((p) => filter === 'all' || p.cat === filter)

  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1] sticky top-0 z-10 flex items-center gap-2">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <h1 className="flex-1 text-center text-[15px] font-bold text-[#1a2332] px-1">Promosyonlar</h1>
        <div className="w-8 h-8 flex-shrink-0" />
      </div>

      {/* Filter chips */}
      <div className="bg-white px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-[#e8ecf1]">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              filter === f.id ? 'bg-[#0E8FCF] text-white' : 'bg-[#eef2f7] text-[#5b6472]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Promo cards */}
      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {visible.map((p) => (
          <div
            key={p.id}
            id={`promo-${p.id}`}
            ref={(el) => { cardRefs.current[p.id] = el }}
            className={`rounded-2xl overflow-hidden border bg-white transition-shadow duration-500 ${highlight === p.id ? 'border-[#0E8FCF] ring-2 ring-[#0E8FCF]' : 'border-[#e8ecf1]'}`}
          >
            <div className={`bg-gradient-to-r ${p.gradient} px-4 py-5 relative overflow-hidden`}>
              {p.image && (
                <>
                  <img src={p.image} alt="" className="absolute inset-y-0 right-0 h-full w-[45%] object-cover" />
                  <div className={`absolute inset-y-0 right-[25%] w-[30%] bg-gradient-to-r ${p.gradient}`} style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }} />
                </>
              )}
              <span className="absolute top-3 right-3 z-10 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-2 py-[3px] rounded-full">{p.tag}</span>
              <span className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2.5">{p.icon}</span>
              <p className={`relative text-[16px] font-extrabold text-white leading-tight drop-shadow ${p.image ? 'max-w-[65%]' : 'max-w-[75%]'}`}>{p.title}</p>
              <p className={`relative text-[11px] text-white/85 mt-1.5 leading-snug drop-shadow ${p.image ? 'max-w-[55%]' : 'max-w-[85%]'}`}>{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="flex-1 text-[10px] text-[#737B8C]">Kampanya koşulları geçerlidir</span>
              <button onClick={() => setOpenRules(p)} className="px-3.5 py-1.5 rounded-full border border-[#0E8FCF] text-[#0E8FCF] text-[11px] font-bold active:scale-95 transition-transform flex-shrink-0">
                Daha fazla bilgi
              </button>
              <button onClick={() => router.push('/kupon/deposit')} className="px-4 py-1.5 rounded-full bg-[#0E8FCF] text-white text-[11px] font-bold active:scale-95 transition-transform flex-shrink-0">
                Para Yatır
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rules popup */}
      {openRules && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-6" onClick={() => setOpenRules(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[360px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#f0f2f5] flex-shrink-0">
              <p className="text-[14px] font-bold text-[#1a2332] pr-3">{openRules.title}</p>
              <button onClick={() => setOpenRules(null)} className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto flex flex-col gap-3">
              {openRules.rules.map((r, i) => (
                <p key={i} className="text-[12px] text-[#4a5568] leading-relaxed">
                  <span className="font-bold text-[#1a2332]">{i + 1}. </span>{r}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
