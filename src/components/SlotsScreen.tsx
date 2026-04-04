'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const promoBanners = [
  { title: 'Evaginarium: Wonder Circus', image: '/spotlight/1.png', badge: '€100,000' },
  { title: 'Hoşgeldin Paketi 75.500 TRY + ...', image: '/spotlight/2.png' },
  { title: 'Wild Spin Chase', image: '/spotlight/3.png' },
  { title: 'Haftanın Slot Oyunu', image: '/spotlight/4.png' },
  { title: '1X Fortune Gems 2', image: '/spotlight/5.png' },
]

const categories = ['Evaginarium', 'Popüler', 'Anime Legends', 'Yeni', 'Jackpot', 'Megaways', 'Klasik']

const slotGames = [
  { name: 'Cash Me Eva', provider: 'Winspinity', image: '/spotlight/1.png', promo: true },
  { name: 'Golden Crown Extreme', provider: 'Fazi', image: '/spotlight/2.png', promo: true },
  { name: 'Fortune Gems 3', provider: 'JILI Games', image: '/spotlight/3.png', promo: true },
  { name: 'Navigator', provider: 'Solidicon', image: '/spotlight/4.png', promo: false },
  { name: 'Fortune Numbers', provider: 'BGaming', image: '/spotlight/5.png', promo: true },
  { name: 'Royalty', provider: 'Pragmatic Play', image: '/spotlight/6.png', promo: true },
  { name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '/spotlight/1.png', promo: false },
  { name: 'Book of Dead', provider: 'Play n GO', image: '/spotlight/2.png', promo: true },
]

export default function SlotsScreen() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const router = useRouter()

  const toggleFavorite = (i: number) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

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
          <h1 className="text-[16px] font-bold text-[#1a2332]">Slotlar</h1>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance bar */}
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#edf5ff] rounded-full px-3 py-[8px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8FCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <span className="text-[12px] font-medium text-[#1a2332] flex-1">0 ₺</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <button className="flex items-center gap-[6px] bg-[#27ae60] text-white rounded-full px-4 py-[8px] hover:bg-[#219a52] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[11px] font-medium">Para Yatır</span>
          </button>
        </div>
      </div>

      {/* Promo banners */}
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-3">
        {promoBanners.map((banner, i) => (
          <div key={i} className="flex-shrink-0 w-[100px]">
            <div className="w-full h-[120px] rounded-xl overflow-hidden relative">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              {banner.badge && (
                <span className="absolute top-2 left-2 bg-[#0E8FCF] text-white text-[8px] font-medium px-[6px] py-[2px] rounded-full">
                  {banner.badge}
                </span>
              )}
            </div>
            <p className="text-[9px] font-medium text-[#1a2332] mt-[4px] leading-tight text-center line-clamp-2">
              {banner.title}
            </p>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 pb-3 items-center">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={`flex-shrink-0 rounded-full px-[14px] py-[7px] text-[10px] font-medium transition-all ${
              activeCategory === i
                ? 'bg-[#0E8FCF] text-white'
                : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
            }`}
          >
            {cat}
          </button>
        ))}
        <button className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#e8ecf1] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="1.5" fill="#737B8C" /><circle cx="16" cy="12" r="1.5" fill="#737B8C" /><circle cx="10" cy="18" r="1.5" fill="#737B8C" />
          </svg>
        </button>
      </div>

      {/* Game grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-[10px]">
          {slotGames.map((game, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
              {/* Game image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                {game.promo && (
                  <span className="absolute top-2 left-2 bg-[#e74c3c] text-white text-[8px] font-bold px-[6px] py-[2px] rounded-md uppercase">
                    Promo
                  </span>
                )}
              </div>
              {/* Game info */}
              <div className="px-2.5 py-2 flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[#1a2332] leading-tight truncate">{game.name}</p>
                  <p className="text-[9px] text-[#737B8C] leading-tight mt-[1px]">{game.provider}</p>
                </div>
                <button onClick={() => toggleFavorite(i)} className="flex-shrink-0 ml-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.has(i) ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
