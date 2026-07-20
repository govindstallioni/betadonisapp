'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Promo = {
  title: string
  desc: string
  tag: string
  cat: 'spor' | 'casino' | 'genel'
  gradient: string
}

const promos: Promo[] = [
  { title: '%100 Hoş Geldin Bonusu', desc: 'İlk yatırımına 10.000 TL’ye kadar %100 bonus', tag: 'Yeni Üye', cat: 'genel', gradient: 'from-[#0E8FCF] to-[#2da8e6]' },
  { title: 'Spor %50 Kayıp Bonusu', desc: 'Haftalık spor kayıplarına %50 iade', tag: 'Spor', cat: 'spor', gradient: 'from-[#27ae60] to-[#2ecc71]' },
  { title: 'Kombine Kazanç Katlama', desc: '5+ maçlı kombinelerde %75’e varan ek kazanç', tag: 'Spor', cat: 'spor', gradient: 'from-[#7c3aed] to-[#a855f7]' },
  { title: 'Casino %25 Çevrimsiz', desc: 'Slot yatırımlarına çevrimsiz %25 bonus', tag: 'Casino', cat: 'casino', gradient: 'from-[#c026d3] to-[#e11d97]' },
  { title: 'Canlı Casino Cashback', desc: 'Her pazartesi %15 canlı casino iadesi', tag: 'Casino', cat: 'casino', gradient: 'from-[#e74c3c] to-[#f0743a]' },
  { title: 'Günlük Şans Çarkı', desc: 'Her gün ücretsiz çevir, nakit ödül kazan', tag: 'Genel', cat: 'genel', gradient: 'from-[#f59e0b] to-[#d97706]' },
]

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'spor', label: 'Spor' },
  { id: 'casino', label: 'Casino' },
  { id: 'genel', label: 'Genel' },
] as const

export default function PromosyonlarScreen() {
  const router = useRouter()
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')

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
          <div key={p.title} className="rounded-2xl overflow-hidden border border-[#e8ecf1] bg-white">
            <div className={`bg-gradient-to-r ${p.gradient} px-4 py-5 relative`}>
              <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-2 py-[3px] rounded-full">{p.tag}</span>
              <p className="text-[16px] font-extrabold text-white leading-tight max-w-[75%] drop-shadow">{p.title}</p>
              <p className="text-[11px] text-white/85 mt-1.5 leading-snug max-w-[85%]">{p.desc}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[10px] text-[#737B8C]">Kampanya koşulları geçerlidir</span>
              <button className="px-4 py-1.5 rounded-full bg-[#0E8FCF] text-white text-[11px] font-bold active:scale-95 transition-transform">
                Katıl
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
