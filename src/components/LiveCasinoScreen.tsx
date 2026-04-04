'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const promoBanners = [
  { title: 'Hoşgeldin Paketi 150.000 TRY', image: '/spotlight/1.png' },
  { title: 'VIP CASHBACK', image: '/spotlight/2.png' },
  { title: 'Promosyon kodu mu var?', image: '/spotlight/3.png' },
  { title: 'Hafta Sonu Bonusu', image: '/spotlight/4.png' },
  { title: 'Günlük Kayıp Bonusu', image: '/spotlight/5.png' },
]

const categories = ['Rulet', 'Blackjack', 'Poker', 'Bakara', 'Dragon Tiger', 'SIC BO', 'Diğerleri']

const games = [
  { name: 'Live - Lobby Roulette', provider: 'Rulet', image: '/spotlight/1.png', promo: true },
  { name: 'Roulette Lobby', provider: 'Rulet', image: '/spotlight/2.png', promo: true },
  { name: 'Instant Roulette', provider: 'Rulet', image: '/spotlight/3.png', promo: true },
  { name: 'Blackjack Lobby', provider: 'Blackjack', image: '/spotlight/4.png', promo: false },
  { name: 'Blackjack 16', provider: 'Blackjack', image: '/spotlight/5.png', promo: true },
  { name: 'Live - Lobby Blackjack', provider: 'Blackjack', image: '/spotlight/6.png', promo: true },
  { name: 'Poker Lobby', provider: 'Poker', image: '/spotlight/1.png', promo: false },
  { name: 'Jacks or Better Draw Poker', provider: 'Poker', image: '/spotlight/2.png', promo: true },
]

export default function LiveCasinoScreen() {
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
          <h1 className="text-[16px] font-bold text-[#1a2332]">Canlı Casino</h1>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Promo banners */}
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide px-4 py-3">
        {promoBanners.map((banner, i) => (
          <div key={i} className="flex-shrink-0 w-[110px]">
            <div className="w-full h-[100px] rounded-xl overflow-hidden">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-[8px] font-medium text-[#1a2332] mt-[3px] leading-tight text-center line-clamp-2">
              {banner.title}
            </p>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-4 pb-3 items-center">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={`flex-shrink-0 rounded-full px-[12px] py-[6px] text-[10px] font-medium transition-all ${
              activeCategory === i
                ? 'bg-[#0E8FCF] text-white'
                : 'bg-white text-[#1a2332] border border-[#e8ecf1]'
            }`}
          >
            {cat}
          </button>
        ))}
        <button className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#e8ecf1] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="1.5" fill="#737B8C" /><circle cx="16" cy="12" r="1.5" fill="#737B8C" /><circle cx="10" cy="18" r="1.5" fill="#737B8C" />
          </svg>
        </button>
      </div>

      {/* Game grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-[8px]">
          {games.map((game, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#e8ecf1]">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                {game.promo && (
                  <span className="absolute top-1.5 left-1.5 bg-[#e74c3c] text-white text-[7px] font-bold px-[5px] py-[2px] rounded uppercase">
                    Promo
                  </span>
                )}
              </div>
              <div className="px-2 py-1.5 flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-[#1a2332] leading-tight truncate">{game.name}</p>
                  <p className="text-[8px] text-[#737B8C] leading-tight">{game.provider}</p>
                </div>
                <button onClick={() => toggleFavorite(i)} className="flex-shrink-0 ml-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(i) ? '#0E8FCF' : 'none'} stroke="#0E8FCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
