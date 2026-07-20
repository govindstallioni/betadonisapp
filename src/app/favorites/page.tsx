'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFavorites, type FavType, type FavItem } from '@/components/FavoritesProvider'
import FavoriteStar from '@/components/FavoriteStar'
import BottomNav from '@/components/BottomNav'

const TABS: { key: FavType; label: string }[] = [
  { key: 'event', label: 'Etkinlikler' },
  { key: 'league', label: 'Ligler' },
  { key: 'game', label: 'Oyunlar' },
]

const EMPTY: Record<FavType, { title: string; desc: string; cta: string; href: string }> = {
  event: { title: 'Favori etkinlik yok', desc: 'Maç detay veya lig sayfasındaki yıldıza dokunarak etkinlik ekle.', cta: 'Canlı Bahis', href: '/live' },
  league: { title: 'Favori lig yok', desc: 'Canlı bahis listesinde turnuvaların yanındaki yıldıza dokun.', cta: 'Ligleri Keşfet', href: '/live' },
  game: { title: 'Favori oyun yok', desc: 'Slot ve casino oyunlarındaki yıldıza dokunarak oyun ekle.', cta: 'Slotlar', href: '/slots' },
}

export default function FavoritesPage() {
  const router = useRouter()
  const { items, count, clear } = useFavorites()
  const [tab, setTab] = useState<FavType>('event')

  const list = items.filter(i => i.type === tab)

  return (
    <div className="max-w-[430px] mx-auto bg-[#f5f7fa] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e8ecf1]">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16px] font-bold text-[#1a2332]">Favorilerim</h1>
          {list.length > 0 ? (
            <button onClick={() => clear(tab)} className="text-[11px] font-semibold text-[#e74c3c] px-1">Temizle</button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {TABS.map(t => {
            const c = count(t.key)
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-[7px] rounded-xl text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  active ? 'bg-[#0E8FCF] text-white' : 'bg-[#f1f5f9] text-[#64748b]'
                }`}
              >
                {t.label}
                {c > 0 && (
                  <span className={`text-[9px] font-bold rounded-full px-[5px] py-[1px] leading-none ${active ? 'bg-white/25 text-white' : 'bg-[#0E8FCF] text-white'}`}>
                    {c}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-4">
        {list.length === 0 ? (
          <EmptyState type={tab} onCta={(href) => router.push(href)} />
        ) : (
          <div className="flex flex-col gap-2.5">
            {list.map(item => (
              <FavRow key={`${item.type}:${item.id}`} item={item} onOpen={() => router.push(item.href)} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function FavRow({ item, onOpen }: { item: FavItem; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-xl border border-[#e8ecf1] px-3 py-3 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
    >
      {/* Leading visual */}
      {item.type === 'event' ? (
        <div className="flex items-center flex-shrink-0">
          <img src={item.logo1} alt="" className="w-[26px] h-[26px] object-contain" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
          <img src={item.logo2} alt="" className="w-[26px] h-[26px] object-contain -ml-2" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[#edf5ff] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.emoji ? (
            <span className="text-[18px] leading-none">{item.emoji}</span>
          ) : item.image ? (
            <img src={item.image} alt="" className={item.type === 'game' ? 'w-full h-full object-cover' : 'w-6 h-6 object-contain'} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <span className="text-[10px] text-[#0E8FCF] font-bold">{item.title.slice(0, 2)}</span>
          )}
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-semibold text-[#1a2332] leading-tight truncate">{item.title}</p>
          {item.isLive && (
            <span className="text-[8px] font-bold text-[#e74c3c] bg-[#fde8e8] rounded px-[4px] py-[1px] leading-none flex-shrink-0">CANLI</span>
          )}
        </div>
        {item.subtitle && <p className="text-[10px] text-[#737B8C] mt-[2px] truncate">{item.subtitle}</p>}
      </div>

      {/* Live score */}
      {item.type === 'event' && typeof item.score1 === 'number' && typeof item.score2 === 'number' && (
        <span className="text-[13px] font-bold text-[#0E8FCF] tabular-nums flex-shrink-0">{item.score1}:{item.score2}</span>
      )}

      {/* Remove (filled star toggles off) */}
      <FavoriteStar item={item} size={18} activeColor="#0E8FCF" />
    </div>
  )
}

function EmptyState({ type, onCta }: { type: FavType; onCta: (href: string) => void }) {
  const e = EMPTY[type]
  return (
    <div className="flex flex-col items-center text-center pt-16 px-8">
      <div className="w-16 h-16 rounded-full bg-[#edf5ff] flex items-center justify-center mb-4">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <p className="text-[15px] font-bold text-[#1a2332]">{e.title}</p>
      <p className="text-[12px] text-[#737B8C] mt-1.5 leading-relaxed">{e.desc}</p>
      <button
        onClick={() => onCta(e.href)}
        className="mt-5 px-5 py-2.5 bg-[#0E8FCF] text-white text-[12px] font-semibold rounded-xl hover:bg-[#0a7ab5] transition-colors"
      >
        {e.cta}
      </button>
    </div>
  )
}
