'use client'

import { useRef, useEffect } from 'react'
import SectionHeader from './SectionHeader'

const winners = [
  { user: 'is***T', amount: 239020.50, game: 'Lucky Penny',      image: '/canli-casino/1.jpg' },
  { user: 'Ca***A', amount: 60750.00,  game: 'Gates of Olympus', image: '/canli-casino/2.jpg' },
  { user: 'Ay***b', amount: 59400.00,  game: 'Magic Wins',       image: '/canli-casino/3.jpg' },
  { user: 'Me***n', amount: 41250.75,  game: 'Sweet Bonanza',    image: '/canli-casino/4.jpg' },
  { user: 'Bu***k', amount: 32180.00,  game: 'Big Bass Splash',  image: '/canli-casino/5.jpg' },
  { user: 'Se***r', amount: 28900.50,  game: 'Fire Strike',      image: '/canli-casino/6.jpg' },
  { user: 'Ha***e', amount: 19650.00,  game: 'Book of Dead',     image: '/canli-casino/7.jpg' },
  { user: 'Em***s', amount: 14320.25,  game: 'Wolf Gold',        image: '/canli-casino/8.jpg' },
  { user: 'Ya***z', amount: 11800.00,  game: 'Starburst',        image: '/canli-casino/9.png' },
  { user: 'Oz***n', amount: 9450.50,   game: 'Gonzo\'s Quest',   image: '/canli-casino/10.png' },
]

function formatAmount(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function SonKazananlar() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const card = el.querySelector('[data-card]') as HTMLElement
      if (!card) return
      const cardWidth = card.offsetWidth + 8 // gap-[8px]
      indexRef.current = (indexRef.current + 1) % winners.length
      el.scrollTo({ left: indexRef.current * cardWidth, behavior: 'smooth' })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <SectionHeader title="Son Kazananlar" badge="Casino" />
      <div
        ref={scrollRef}
        className="flex gap-[4px] overflow-x-auto scrollbar-hide -mx-4 px-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {winners.map((w, i) => (
          <div
            key={i}
            data-card
            className="flex-shrink-0 flex items-center gap-[8px] bg-white border border-[#e8ecf0] rounded-xl px-[10px] py-[8px] w-[155px] cursor-pointer hover:border-[#0E8FCF] transition-colors"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Game thumbnail */}
            <div className="w-[38px] h-[38px] rounded-lg overflow-hidden flex-shrink-0">
              <img src={w.image} alt={w.game} className="w-full h-full object-cover" />
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-[#e8ecf0] flex-shrink-0" />

            {/* Info */}
            <div className="flex flex-col gap-[2px] min-w-0">
              <span className="text-[10px] font-semibold text-[#1a2332] truncate">{w.user}</span>
              <span className="text-[11px] font-black text-[#16a34a] leading-none tabular-nums truncate">
                ₺ {formatAmount(w.amount)}
              </span>
              <span className="text-[9px] text-[#6b7280] truncate">{w.game}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
